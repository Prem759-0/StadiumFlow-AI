"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';
import '../lib/i18n';

const languages = [
  { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'es', label: 'Spanish', native: 'Español', flag: '🇪🇸' },
  { code: 'fr', label: 'French', native: 'Français', flag: '🇫🇷' },
];

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  const current = languages.find(l => l.code === i18n.language) || languages[0];

  useEffect(() => {
    const handleClick = (e: MouseEvent) => { 
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false); 
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm"
      >
        <Globe size={16} />
        <span className="hidden sm:inline font-medium">{current.flag} {current.native}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 rounded-xl shadow-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 z-[100] overflow-hidden">
          <div className="max-h-72 overflow-y-auto py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { i18n.changeLanguage(lang.code); setOpen(false); }}
                className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${i18n.language === lang.code ? 'font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/20' : ''}`}
              >
                <span className="text-base">{lang.flag}</span>
                <div>
                  <div className="font-medium">{lang.native}</div>
                  <div className="text-xs text-gray-500">{lang.label}</div>
                </div>
                {i18n.language === lang.code && <span className="ml-auto text-blue-600">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
