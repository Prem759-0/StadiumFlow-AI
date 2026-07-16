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
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFE600] border-2 border-black shadow-[2px_2px_0_#000] hover:shadow-[1px_1px_0_#000] hover:translate-y-[1px] hover:translate-x-[1px] transition-all text-sm font-bold text-black uppercase tracking-wider"
      >
        <Globe size={16} />
        <span className="hidden sm:inline font-black">{current.flag} {current.code}</span>
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white border-4 border-black shadow-[6px_6px_0_#000] z-[100] overflow-hidden">
          <div className="flex flex-col">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => { i18n.changeLanguage(lang.code); setOpen(false); }}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 border-b-2 border-black last:border-b-0 hover:bg-[#00FF87] transition-colors ${
                  i18n.language === lang.code ? 'bg-gray-100' : 'bg-white'
                }`}
              >
                <span className="text-xl">{lang.flag}</span>
                <div className="flex flex-col">
                  <span className="font-black text-black text-sm uppercase tracking-wide">{lang.native}</span>
                  <span className="text-[10px] text-gray-600 font-bold uppercase">{lang.label}</span>
                </div>
                {i18n.language === lang.code && <span className="ml-auto font-black text-black text-lg">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
