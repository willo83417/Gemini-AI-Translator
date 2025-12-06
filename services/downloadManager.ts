// services/downloadManager.ts
import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'offline-model-db';
const CHUNKS_STORE = 'model-chunks';
const META_STORE = 'model-meta';
const CONSOLIDATED_STORE = 'consolidated-models';
const DB_VERSION = 3;

export type DownloadStatus = 'not_started' | 'downloading' | 'paused' | 'completed' | 'error' | 'consolidating';

export interface DownloadProgress {
    downloaded: number;
    total: number;
    percent: number;
    status: DownloadStatus;
    error?: string;
}

class DownloadManager {
    private dbPromise: Promise<IDBPDatabase>;
    private controllers: Map<string, AbortController> = new Map();
    private readonly isOpfsSupported: boolean;
    private opfsRootPromise: Promise<FileSystemDirectoryHandle | null>;
    
    constructor() {
        this.dbPromise = openDB(DB_NAME, DB_VERSION, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(CHUNKS_STORE)) {
                     const store = db.createObjectStore(CHUNKS_STORE, { keyPath: ['modelName', 'chunkIndex'] });
                     store.createIndex('modelName', 'modelName', { unique: false });
                }
                 if (!db.objectStoreNames.contains(META_STORE)) {
                    db.createObjectStore(META_STORE, { keyPath: 'modelName' });
                }
                if (!db.objectStoreNames.contains(CONSOLIDATED_STORE)) {
                    db.createObjectStore(CONSOLIDATED_STORE, { keyPath: 'modelName' });
                }
            },
        });

        this.isOpfsSupported = 'getDirectory' in navigator.storage;
        this.opfsRootPromise = this.isOpfsSupported ? navigator.storage.getDirectory().catch(err => {
            console.error("Failed to get OPFS root directory:", err);
            return null;
        }) : Promise.resolve(null);

        if (this.isOpfsSupported) {
            console.log('Origin Private File System is supported and will be used for model storage.');
        } else {
            console.log('Origin Private File System not supported, falling back to IndexedDB.');
        }
    }

    private async getOpfsRoot(): Promise<FileSystemDirectoryHandle | null> {
        return this.opfsRootPromise;
    }

    async startDownload(modelName: string, url: string, hfApiKey: string, onProgress: (progress: DownloadProgress) => void): Promise<void> {
        if (this.controllers.has(modelName)) {
            console.warn(`Download for ${modelName} is already in progress.`);
            return;
        }
        if (this.isOpfsSupported) {
            await this.runOpfsDownload(modelName, url, hfApiKey, onProgress, false);
        } else {
            await this.runIdbDownload(modelName, url, hfApiKey, onProgress, false);
        }
    }
    
    async resumeDownload(modelName: string, url: string, hfApiKey: string, onProgress: (progress: DownloadProgress) => void): Promise<void> {
        if (this.controllers.has(modelName)) return;
        if (this.isOpfsSupported) {
            await this.runOpfsDownload(modelName, url, hfApiKey, onProgress, true);
        } else {
            await this.runIdbDownload(modelName, url, hfApiKey, onProgress, true);
        }
    }

    private async runOpfsDownload(modelName: string, url: string, hfApiKey: string, onProgress: (progress: DownloadProgress) => void, isResume: boolean): Promise<void> {
        if (!hfApiKey) {
            onProgress({ downloaded: 0, total: 0, percent: 0, status: 'error', error: 'Hugging Face API Key is required.' });
            return;
        }

        const controller = new AbortController();
        this.controllers.set(modelName, controller);
        
        let downloaded = 0;
        let total = 0;
    
        try {
            const root = await this.getOpfsRoot();
            if (!root) throw new Error("Could not access OPFS.");
    
            const fileHandle = await root.getFileHandle(modelName, { create: true });
            const db = await this.getDb();
            const meta = await db.get(META_STORE, modelName);
    
            if (isResume && meta && meta.total > 0) {
                total = meta.total;
                const file = await fileHandle.getFile();
                downloaded = file.size;
                 // If file is larger than expected (corrupt), restart download
                if (downloaded >= total) {
                    console.warn(`Resuming download for ${modelName}, but existing file is complete or corrupt. Restarting.`);
                    downloaded = 0;
                }
            }
            
            // If total is still unknown, fetch it
            if (total === 0) {
                const headResponse = await fetch(url, { 
                    method: 'HEAD',
                    headers: { 'Authorization': `Bearer ${hfApiKey}` },
                    signal: controller.signal 
                });
                if (!headResponse.ok) throw new Error(`Failed to get model info. Status: ${headResponse.status}`);
                total = Number(headResponse.headers.get('Content-Length'));
                if (isNaN(total) || total === 0) throw new Error('Could not determine file size.');
                downloaded = 0;
            }
            
            await db.put(META_STORE, { modelName, total, status: 'downloading' });
            onProgress({ downloaded, total, percent: total > 0 ? (downloaded / total) * 100 : 0, status: 'downloading' });
    
            if (downloaded < total) {
                const response = await fetch(url, {
                    headers: { 'Range': `bytes=${downloaded}-`, 'Authorization': `Bearer ${hfApiKey}` },
                    signal: controller.signal,
                });
    
                if (!response.ok || !response.body) throw new Error(`Download request failed. Status: ${response.status}`);
                
                const writable = await fileHandle.createWritable({ keepExistingData: true });
                await writable.seek(downloaded);
    
                const reader = response.body.getReader();
                while(true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    await writable.write(value);
                    downloaded += value.length;
                    onProgress({ downloaded, total, percent: (downloaded / total) * 100, status: 'downloading' });
                }
                await writable.close();
            }
            
            const finalFile = await fileHandle.getFile();
            if (finalFile.size !== total) {
                throw new Error(`Final file size ${finalFile.size} does not match expected size ${total}`);
            }
            
            await db.put(META_STORE, { modelName, total, status: 'completed' });
            onProgress({ downloaded: total, total, percent: 100, status: 'completed' });
            console.log(`Model ${modelName} downloaded to OPFS successfully.`);
    
        } catch (error) {
            this.handleDownloadError(error, modelName, downloaded, total, onProgress);
        } finally {
            this.controllers.delete(modelName);
        }
    }
    
    private async runIdbDownload(modelName: string, url: string, hfApiKey: string, onProgress: (progress: DownloadProgress) => void, isResume: boolean): Promise<void> {
        if (!hfApiKey) {
            onProgress({ downloaded: 0, total: 0, percent: 0, status: 'error', error: 'Hugging Face API Key is required.' });
            return;
        }

        const controller = new AbortController();
        this.controllers.set(modelName, controller);
        
        let downloaded = 0;
        let total = 0;
        let chunkIndex = 0;
        const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

        try {
            const db = await this.getDb();
            if (isResume) {
                const meta = await db.get(META_STORE, modelName);
                if (!meta || !meta.total) {
                    // If no metadata, treat as a new download
                    return this.runIdbDownload(modelName, url, hfApiKey, onProgress, false);
                }
                total = meta.total;
                const chunks = await db.getAllFromIndex(CHUNKS_STORE, 'modelName', modelName);
                downloaded = chunks.reduce((acc, chunk) => acc + chunk.data.byteLength, 0);
                chunkIndex = chunks.length;
            } else {
                 await this.deleteModel(modelName); // Clear any old data before a fresh start
                 const headResponse = await fetch(url, { 
                    method: 'HEAD',
                    headers: { 'Authorization': `Bearer ${hfApiKey}` },
                    signal: controller.signal 
                });
                if (!headResponse.ok) throw new Error(`Failed to get model info. Status: ${headResponse.status}`);
                total = Number(headResponse.headers.get('Content-Length'));
                if (isNaN(total) || total === 0) throw new Error('Could not determine file size.');
            }

            await db.put(META_STORE, { modelName, total, status: 'downloading' });
            
            while (downloaded < total) {
                const start = downloaded;
                const end = Math.min(downloaded + CHUNK_SIZE - 1, total - 1);

                const chunkResponse = await fetch(url, {
                    headers: { 'Range': `bytes=${start}-${end}`, 'Authorization': `Bearer ${hfApiKey}` },
                    signal: controller.signal,
                });

                if (!chunkResponse.ok) throw new Error(`Chunk download failed. Status: ${chunkResponse.status}`);
                
                const chunk = await chunkResponse.arrayBuffer();
                await db.put(CHUNKS_STORE, { modelName, chunkIndex, data: chunk });
                
                downloaded += chunk.byteLength;
                chunkIndex++;
                
                onProgress({ downloaded, total, percent: (downloaded / total) * 100, status: 'downloading' });
            }
            
            await this._consolidateModel(modelName, onProgress);

        } catch (error) {
            this.handleDownloadError(error, modelName, downloaded, total, onProgress);
        } finally {
            this.controllers.delete(modelName);
        }
    }
    
    private handleDownloadError(error: unknown, modelName: string, downloaded: number, total: number, onProgress: (progress: DownloadProgress) => void) {
        if (error instanceof DOMException && error.name === 'AbortError') {
            console.log(`Download for ${modelName} was paused.`);
            this.getDb().then(db => db.put(META_STORE, { modelName, total, status: 'paused', downloaded }));
            onProgress({ downloaded, total, percent: total > 0 ? (downloaded / total) * 100 : 0, status: 'paused' });
        } else {
            const errorMessage = error instanceof Error ? error.message : 'Unknown download error';
            console.error(`Download error for ${modelName}:`, error);
            this.getDb().then(db => db.put(META_STORE, { modelName, status: 'error', error: errorMessage, total }));
            onProgress({ downloaded, total, percent: total > 0 ? (downloaded / total) * 100 : 0, status: 'error', error: errorMessage });
        }
    }
    
    private async _consolidateModel(modelName: string, onProgress: (progress: DownloadProgress) => void): Promise<void> {
        const db = await this.getDb();
        const meta = await db.get(META_STORE, modelName);
        if (!meta) return;
        const total = meta.total || 0;
        const downloaded = meta.downloaded || total;

        try {
            onProgress({ downloaded, total, percent: 100, status: 'consolidating' });
            
            const consolidatedBlob = await this.getModelFromChunksAsStream(modelName);
            if (!consolidatedBlob) throw new Error("Failed to reconstruct model from chunks.");

            await db.put(CONSOLIDATED_STORE, { modelName, blob: consolidatedBlob });
            await this._deleteChunks(modelName);

            await db.put(META_STORE, { modelName, total, status: 'completed', downloaded: total });
            onProgress({ downloaded: total, total, percent: 100, status: 'completed' });
            console.log(`Model ${modelName} consolidated successfully.`);
        } catch(error) {
             const errorMessage = error instanceof Error ? error.message : 'Unknown consolidation error';
             console.error(`Consolidation error for ${modelName}:`, error);
             await db.put(META_STORE, { modelName, status: 'error', error: errorMessage, total });
             onProgress({ downloaded, total, percent: (downloaded/total)*100, status: 'error', error: `Consolidation failed: ${errorMessage}` });
        }
    }

    private async _deleteChunks(modelName: string): Promise<void> {
        const db = await this.getDb();
        const tx = db.transaction(CHUNKS_STORE, 'readwrite');
        const index = tx.objectStore(CHUNKS_STORE).index('modelName');
        let cursor = await index.openCursor(IDBKeyRange.only(modelName));
        while(cursor) {
            cursor.delete();
            cursor = await cursor.continue();
        }
        await tx.done;
    }
    
    pauseDownload(modelName: string): void {
        const controller = this.controllers.get(modelName);
        if (controller) {
            controller.abort();
            this.controllers.delete(modelName);
        }
    }

    async deleteModel(modelName: string): Promise<void> {
        this.pauseDownload(modelName);

        if (this.isOpfsSupported) {
            try {
                const root = await this.getOpfsRoot();
                if (root) {
                    await root.removeEntry(modelName);
                }
            } catch (error) {
                if (!(error instanceof DOMException && error.name === 'NotFoundError')) {
                    console.error(`Error deleting ${modelName} from OPFS:`, error);
                }
            }
        }
        
        const db = await this.getDb();
        await db.delete(META_STORE, modelName);
        await db.delete(CONSOLIDATED_STORE, modelName);
        await this._deleteChunks(modelName);
    }

    async getStatus(modelName: string): Promise<DownloadProgress> {
        const db = await this.getDb();
        const meta = await db.get(META_STORE, modelName);
    
        if (!meta) {
            return { downloaded: 0, total: 0, percent: 0, status: 'not_started' };
        }
        
        const total = meta.total || 0;
    
        if (meta.status === 'completed') {
            return { downloaded: total, total, percent: 100, status: 'completed' };
        }

        let downloaded = 0;
        if (this.isOpfsSupported) {
            try {
                const root = await this.getOpfsRoot();
                if (root) {
                    const fileHandle = await root.getFileHandle(modelName);
                    const file = await fileHandle.getFile();
                    downloaded = file.size;
                }
            } catch (e) { /* File not found is expected */ }
        } else {
             const chunks = await db.getAllFromIndex(CHUNKS_STORE, 'modelName', modelName);
             downloaded = chunks.reduce((acc, chunk) => acc + chunk.data.byteLength, 0);
        }
    
        return { downloaded, total, percent: total > 0 ? (downloaded / total) * 100 : 0, status: meta.status, error: meta.error };
    }

    async getModelAsBlob(modelName: string): Promise<Blob | null> {
        const db = await this.getDb();
        const meta = await db.get(META_STORE, modelName);
        if (!meta || meta.status !== 'completed') return null;
    
        if (this.isOpfsSupported) {
            try {
                const root = await this.getOpfsRoot();
                if(root) {
                    const fileHandle = await root.getFileHandle(modelName);
                    const file = await fileHandle.getFile();
                    if (file.size === meta.total) {
                        return file;
                    } else {
                         console.error(`OPFS file for ${modelName} is incomplete. Expected ${meta.total}, found ${file.size}.`);
                         return null;
                    }
                }
            } catch (e) {
                console.warn(`Could not get model ${modelName} from OPFS, will check IndexedDB.`, e);
            }
        }
    
        const consolidatedModel = await db.get(CONSOLIDATED_STORE, modelName);
        if (consolidatedModel && consolidatedModel.blob) {
            return consolidatedModel.blob;
        }
    
        console.warn(`Consolidated model for ${modelName} not found in store. Reconstructing from chunks as a fallback.`);
        return this.getModelFromChunksAsStream(modelName);
    }

    private async getModelFromChunksAsStream(modelName: string): Promise<Blob | null> {
        const db = await this.getDb();
        // Check if chunks even exist to avoid creating an empty blob
        const firstChunk = await db.getFromIndex(CHUNKS_STORE, 'modelName', modelName);
        if (!firstChunk) return null;

        const stream = new ReadableStream({
            async start(controller) {
                const tx = db.transaction(CHUNKS_STORE, 'readonly');
                const index = tx.objectStore(CHUNKS_STORE).index('modelName');
                let cursor = await index.openCursor(IDBKeyRange.only(modelName));
                while (cursor) {
                    controller.enqueue(new Uint8Array(cursor.value.data));
                    cursor = await cursor.continue();
                }
                controller.close();
            }
        });

        try {
            return await new Response(stream).blob();
        } catch {
            return null;
        }
    }
    
    private getDb(): Promise<IDBPDatabase> {
        return this.dbPromise;
    }
}

export const downloadManager = new DownloadManager();