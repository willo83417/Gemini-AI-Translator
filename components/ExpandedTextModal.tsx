import React from 'react';
import { useTranslation } from 'react-i18next';
import { XIcon } from './icons';

interface ExpandedTextModalProps {
    isOpen: boolean;
    onClose: () => void;
    text: string;
}

const ExpandedTextModal: React.FC<ExpandedTextModalProps> = ({ isOpen, onClose, text }) => {
    const { t } = useTranslation();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">{t('translationOutput.expandedView', 'Expanded View')}</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label={t('common.close', 'Close')}
                    >
                        <XIcon />
                    </button>
                </div>
                <div className="p-6 overflow-y-auto flex-1">
                    <p className="text-gray-800 text-xl leading-relaxed whitespace-pre-wrap">{text}</p>
                </div>
            </div>
        </div>
    );
};

export default ExpandedTextModal;
