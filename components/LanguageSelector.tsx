import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import type { Language } from '../types';

interface LanguageSelectorProps {
    selectedLang: Language;
    setSelectedLang: (lang: Language) => void;
    languages: Language[];
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ selectedLang, setSelectedLang, languages }) => {
    const { t } = useTranslation();
    const [inputValue, setInputValue] = useState(t(selectedLang.name));
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setInputValue(t(selectedLang.name));
    }, [selectedLang, t]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setInputValue(t(selectedLang.name));
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [selectedLang, t]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        setIsOpen(true);
    };

    const handleFocus = () => {
        setInputValue('');
        setIsOpen(true);
    };

    const handleSelect = (lang: Language) => {
        setSelectedLang(lang);
        setInputValue(t(lang.name));
        setIsOpen(false);
    };

    const filteredLanguages = languages.filter(lang => 
        t(lang.name).toLowerCase().includes(inputValue.toLowerCase())
    );

    return (
        <div className="relative flex items-center" ref={wrapperRef}>
            <input
                type="text"
                value={inputValue}
                onChange={handleChange}
                onFocus={handleFocus}
                className="text-lg font-semibold text-gray-700 hover:text-blue-600 bg-transparent border-none p-0 focus:ring-0 w-32 sm:w-48 cursor-pointer"
                placeholder={t('common.searchLanguage') || 'Search...'}
            />
            {isOpen && (
                <ul className="absolute z-50 mt-1 max-h-60 w-48 sm:w-64 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm top-full left-0">
                    {filteredLanguages.length > 0 ? (
                        filteredLanguages.map((lang) => (
                            <li
                                key={lang.code}
                                className={`relative cursor-pointer select-none py-2 pl-3 pr-4 hover:bg-blue-100 ${selectedLang.code === lang.code ? 'bg-blue-50 text-blue-900 font-semibold' : 'text-gray-900'}`}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleSelect(lang);
                                }}
                            >
                                <span className="block truncate">{t(lang.name)}</span>
                            </li>
                        ))
                    ) : (
                        <li className="relative cursor-default select-none py-2 pl-3 pr-4 text-gray-500">
                            {t('common.noResults') || 'No languages found'}
                        </li>
                    )}
                </ul>
            )}
        </div>
    );
};

export default LanguageSelector;