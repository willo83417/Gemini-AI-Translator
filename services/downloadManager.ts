// services/downloadManager.ts
import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'offline-model-db';
const CHUNKS_STORE = 'model-chunks';
const META_STORE = 'model-meta';

export type DownloadStatus = 'not_started' | 'downloading' | 'paused' | 'completed' | 'error';

export interface DownloadProgress {
    downloaded: number;
    total: number;
    percent: number;
    status: DownloadStatus;
    error?: string;
}

class DownloadManager {
    private dbPromise: Promise<IDBPDatabase>;
    
    // NOTE: A CORS proxy is required to download models directly from Hugging Face
    // in the browser. Hugging Face does not provide the necessary CORS headers.
    // Uncommenting the line below will enable downloads via a public proxy.
    // However, for production use, it is STRONGLY recommended to create your own
    // backend proxy to handle downloads securely and reliably.
    // FIX: Uncommented PROXY_URL to fix property does not exist error.
    private readonly PROXY_URL = 'https://corsproxy.io/?';

    constructor() {
        this.dbPromise = openDB(DB_NAME, 2, {
            upgrade(db, oldVersion, newVersion, tx) {
                if (oldVersion < 1) {
                    const chunkStore = db.createObjectStore(CHUNKS_STORE, { keyPath: ['modelName', 'chunkIndex'] });
                    chunkStore.createIndex('modelName', 'modelName', { unique: false });
                    db.createObjectStore(META_STORE, { keyPath: 'modelName' });
                }
                if (oldVersion < 2) {
                    const chunkStore = tx.objectStore(CHUNKS_STORE);
                    if (!chunkStore.indexNames.contains('modelName')) {
                        chunkStore.createIndex('modelName', 'modelName', { unique: false });
                    }
                }
            },
        });
    }

    private controllers: Map<string, AbortController> = new Map();

    async startDownload(modelName: string, url: string, hfApiKey: string, onProgress: (progress: DownloadProgress) => void): Promise<void> {
        if (this.controllers.has(modelName)) {
            console.warn(`Download for ${modelName} is already in progress.`);
            return;
        }

        if (!hfApiKey) {
            onProgress({ downloaded: 0, total: 0, percent: 0, status: 'error', error: 'Hugging Face API Key is required.' });
            return;
        }

        const controller = new AbortController();
        this.controllers.set(modelName, controller);
        
        // Disabling proxy will likely cause CORS errors. See note at the top of the file.
        const targetUrl = this.PROXY_URL ? this.PROXY_URL + encodeURIComponent(url) : url;
        
        let downloaded = 0;
        let total = 0;

        try {
            const headResponse = await fetch(targetUrl, { 
                method: 'HEAD',
                headers: { 'Authorization': `Bearer ${hfApiKey}` },
                signal: controller.signal 
            });

            if (!headResponse.ok) throw new Error(`Failed to get model info. Status: ${headResponse.status}`);
            
            total = Number(headResponse.headers.get('Content-Length'));
            if (isNaN(total) || total === 0) throw new Error('Could not determine file size.');

            await this.getDb().then(db => db.put(META_STORE, { modelName, total, status: 'downloading' }));

            const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
            let chunkIndex = 0;

            while (downloaded < total) {
                if (controller.signal.aborted) {
                  throw new DOMException('Download aborted by user', 'AbortError');
                }
                
                const start = downloaded;
                const end = Math.min(downloaded + CHUNK_SIZE - 1, total - 1);

                const chunkResponse = await fetch(targetUrl, {
                    headers: { 'Range': `bytes=${start}-${end}`, 'Authorization': `Bearer ${hfApiKey}` },
                    signal: controller.signal,
                });

                if (!chunkResponse.ok) throw new Error(`Chunk download failed. Status: ${chunkResponse.status}`);
                
                const chunk = await chunkResponse.arrayBuffer();
                await this.getDb().then(db => db.put(CHUNKS_STORE, { modelName, chunkIndex, data: chunk }));
                
                downloaded += chunk.byteLength;
                chunkIndex++;
                
                onProgress({ downloaded, total, percent: (downloaded / total) * 100, status: 'downloading' });
            }

            await this.getDb().then(db => db.put(META_STORE, { modelName, total, status: 'completed', downloaded }));
            onProgress({ downloaded, total, percent: 100, status: 'completed' });

        } catch (error) {
            if (error instanceof DOMException && error.name === 'AbortError') {
                console.log(`Download for ${modelName} was paused.`);
                await this.getDb().then(db => db.put(META_STORE, { modelName, total, status: 'paused', downloaded }));
                onProgress({ downloaded, total, percent: total > 0 ? (downloaded / total) * 100 : 0, status: 'paused' });
            } else {
                const errorMessage = error instanceof Error ? error.message : 'Unknown download error';
                console.error(`Download error for ${modelName}:`, error);
                await this.getDb().then(db => db.put(META_STORE, { modelName, status: 'error', error: errorMessage, total }));
                onProgress({ downloaded, total, percent: (downloaded/total)*100, status: 'error', error: errorMessage });
            }
        } finally {
            this.controllers.delete(modelName);
        }
    }
    
    async resumeDownload(modelName: string, url: string, hfApiKey: string, onProgress: (progress: DownloadProgress) => void): Promise<void> {
        if (this.controllers.has(modelName)) return;

        if (!hfApiKey) {
            onProgress({ downloaded: 0, total: 0, percent: 0, status: 'error', error: 'Hugging Face API Key is required.' });
            return;
        }

        const controller = new AbortController();
        this.controllers.set(modelName, controller);
        
        const targetUrl = this.PROXY_URL ? this.PROXY_URL + encodeURIComponent(url) : url;
        let downloaded = 0;
        let total = 0;

        try {
            const db = await this.getDb();
            const meta = await db.get(META_STORE, modelName);
            if (!meta || !meta.total) {
                return this.startDownload(modelName, url, hfApiKey, onProgress);
            }

            total = meta.total;
            
            const chunks = await db.getAllFromIndex(CHUNKS_STORE, 'modelName', modelName);
            downloaded = chunks.reduce((acc, chunk) => acc + chunk.data.byteLength, 0);

            let chunkIndex = chunks.length;
            const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB

             while (downloaded < total) {
                 if (controller.signal.aborted) {
                    throw new DOMException('Download aborted by user', 'AbortError');
                }
                
                const start = downloaded;
                const end = Math.min(downloaded + CHUNK_SIZE - 1, total - 1);

                const chunkResponse = await fetch(targetUrl, {
                    headers: { 'Range': `bytes=${start}-${end}`, 'Authorization': `Bearer ${hfApiKey}` },
                    signal: controller.signal,
                });

                if (!chunkResponse.ok) throw new Error(`Chunk download failed. Status: ${chunkResponse.status}`);
                
                const chunk = await chunkResponse.arrayBuffer();
                await this.getDb().then(db => db.put(CHUNKS_STORE, { modelName, chunkIndex, data: chunk }));
                
                downloaded += chunk.byteLength;
                chunkIndex++;
                
                onProgress({ downloaded, total, percent: (downloaded / total) * 100, status: 'downloading' });
            }

            await db.put(META_STORE, { modelName, total, status: 'completed', downloaded });
            onProgress({ downloaded, total, percent: 100, status: 'completed' });

        } catch (error) {
           if (error instanceof DOMException && error.name === 'AbortError') {
                console.log(`Download for ${modelName} was paused.`);
                await this.getDb().then(db => db.put(META_STORE, { modelName, total, status: 'paused', downloaded }));
                onProgress({ downloaded, total, percent: total > 0 ? (downloaded / total) * 100 : 0, status: 'paused' });
            } else {
                const errorMessage = error instanceof Error ? error.message : 'Unknown download error';
                console.error(`Resume error for ${modelName}:`, error);
                await this.getDb().then(db => db.put(META_STORE, { modelName, status: 'error', error: errorMessage, total }));
                onProgress({ downloaded, total, percent: (downloaded/total)*100, status: 'error', error: errorMessage });
            }
        } finally {
            this.controllers.delete(modelName);
        }
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
        const db = await this.getDb();
        await db.delete(META_STORE, modelName);
        const tx = db.transaction(CHUNKS_STORE, 'readwrite');
        const index = tx.objectStore(CHUNKS_STORE).index('modelName');
        let cursor = await index.openCursor(IDBKeyRange.only(modelName));
        while(cursor) {
            cursor.delete();
            cursor = await cursor.continue();
        }
        await tx.done;
        console.log(`Model ${modelName} deleted.`);
    }

    async getStatus(modelName: string): Promise<DownloadProgress> {
        const db = await this.getDb();
        const meta = await db.get(META_STORE, modelName);
        
        if (!meta) {
            return { downloaded: 0, total: 0, percent: 0, status: 'not_started' };
        }

        const chunks = await db.getAllFromIndex(CHUNKS_STORE, 'modelName', modelName);
        const downloaded = chunks.reduce((acc, chunk) => acc + chunk.data.byteLength, 0);

        const total = meta.total || 0;

        if (meta.status === 'completed' && downloaded >= total) {
            return { downloaded: total, total: total, percent: 100, status: 'completed' };
        }
        
        return {
            downloaded,
            total,
            percent: total > 0 ? (downloaded / total) * 100 : 0,
            status: meta.status,
            error: meta.error
        };
    }

    async getModelAsBlob(modelName: string): Promise<Blob | null> {
        const db = await this.getDb();
        const meta = await db.get(META_STORE, modelName);
        if (!meta || meta.status !== 'completed') {
            return null;
        }
    
        const chunks = await db.getAllFromIndex(CHUNKS_STORE, 'modelName', modelName);
        chunks.sort((a, b) => a.chunkIndex - b.chunkIndex);
    
        const blobParts = chunks.map(chunk => chunk.data);
        return new Blob(blobParts, { type: 'application/octet-stream' });
    }
    
    private getDb(): Promise<IDBPDatabase> {
        return this.dbPromise;
    }
}

export const downloadManager = new DownloadManager();