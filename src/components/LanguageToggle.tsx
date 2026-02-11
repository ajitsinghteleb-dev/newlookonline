'use client';
import { useState, useEffect } from 'react';

export default function LanguageToggle() {
    const [lang, setLang] = useState('en');

    useEffect(() => {
        const storedLang = localStorage.getItem('app_lang') || 'en';
        setLang(storedLang);
    }, []);

    const toggleLang = () => {
        const newLang = lang === 'en' ? 'hi' : 'en';
        localStorage.setItem('app_lang', newLang);
        setLang(newLang);
        window.location.reload(); // Reload to apply language change across all components
    };

    return (
        <button onClick={toggleLang} className="text-sm font-medium dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 px-3 py-2 rounded-md">
            {lang === 'en' ? 'हिन्दी' : 'English'}
        </button>
    );
}
