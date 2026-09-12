import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown, Check, Search, X } from 'lucide-react';
import { SUPPORTED_LANGUAGES, getLanguageByCode } from '../../i18n/languages';

export default function LanguageSelector() {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const currentLangCode = i18n.language || 'en';
  const currentLang = getLanguageByCode(currentLangCode);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Keyboard navigation: Escape closes dropdown
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Auto focus search input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  const filteredLanguages = useMemo(() => {
    if (!searchQuery.trim()) return SUPPORTED_LANGUAGES;
    const q = searchQuery.toLowerCase().trim();
    return SUPPORTED_LANGUAGES.filter(
      (lang) =>
        lang.name.toLowerCase().includes(q) ||
        lang.nativeName.toLowerCase().includes(q) ||
        lang.code.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleSelectLanguage = (code) => {
    if (code !== currentLangCode) {
      i18n.changeLanguage(code);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left select-none" ref={dropdownRef}>
      {/* 1. Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={t('common.selectLanguage', 'Select language')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer border ${
          isOpen
            ? 'bg-cyan-500/30 text-cyan-200 border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.5)]'
            : 'bg-[#0d2258]/90 text-cyan-200 hover:text-white border-cyan-400/50 hover:border-cyan-300 hover:bg-[#132f75] shadow-[0_0_10px_rgba(6,182,212,0.15)]'
        }`}
        title={`${t('common.selectLanguage', 'Select language')}: ${currentLang.nativeName} (${currentLang.name})`}
      >
        <span className="text-sm leading-none">🌐</span>
        <span className="truncate max-w-[85px] sm:max-w-[110px] font-bold text-white tracking-wide">
          {currentLang.nativeName}
        </span>
        <ChevronDown
          className={`w-3 h-3 text-cyan-300 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* 2. Dropdown Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-label={t('common.selectLanguage', 'Select language')}
          className="absolute left-0 sm:right-0 sm:left-auto mt-2 w-64 sm:w-72 rounded-2xl bg-[#06112c]/98 border border-cyan-500/40 shadow-2xl backdrop-blur-xl z-[100] overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header & Search Bar */}
          <div className="p-2.5 border-b border-sky-500/20 bg-[#08173d]/80">
            <div className="flex items-center justify-between text-[11px] font-bold text-sky-300/80 uppercase tracking-wider mb-2 px-1">
              <span>{t('common.selectLanguage', 'Select Language')}</span>
              <span className="text-[10px] font-mono text-cyan-400">
                {SUPPORTED_LANGUAGES.length} {t('navbar.analytics', 'Languages')}
              </span>
            </div>

            <div className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-sky-400 absolute left-2.5 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('common.searchLanguage', 'Search language...')}
                className="w-full pl-8 pr-7 py-1.5 rounded-lg bg-[#040c20] border border-sky-500/30 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 font-medium"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 text-slate-400 hover:text-white p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Language Options List */}
          <div className="max-h-72 overflow-y-auto p-1.5 custom-scrollbar space-y-0.5">
            {filteredLanguages.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-400">
                No matching language found
              </div>
            ) : (
              filteredLanguages.map((lang) => {
                const isSelected = lang.code === currentLangCode;

                return (
                  <button
                    key={lang.code}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-left text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-sky-600/80 to-cyan-600/80 text-white font-bold border border-cyan-400/40 shadow-glow-cyan'
                        : 'text-slate-200 hover:text-white hover:bg-sky-500/15'
                    }`}
                  >
                    <div className="flex flex-col min-w-0 pr-2">
                      <span className="font-semibold text-sm leading-tight truncate">
                        {lang.nativeName}
                      </span>
                      <span className="text-[10px] text-sky-300/70 truncate">
                        {lang.name}
                        {lang.dir === 'rtl' ? ' (RTL)' : ''}
                      </span>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
