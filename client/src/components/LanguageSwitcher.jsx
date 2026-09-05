import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Globe } from 'lucide-react';

const LanguageSwitcher = ({ variant = 'default' }) => {
  const { language, changeLanguage, openLanguageModal } = useLanguage();

  if (variant === 'pills') {
    return (
      <div className="inline-flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-bold">
        <button
          type="button"
          onClick={() => changeLanguage('en')}
          className={`px-2.5 py-1 rounded-md transition-all ${
            language === 'en'
              ? 'bg-white text-gov-800 shadow-2xs font-extrabold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          English
        </button>
        <button
          type="button"
          onClick={() => changeLanguage('mr')}
          className={`px-2.5 py-1 rounded-md transition-all ${
            language === 'mr'
              ? 'bg-white text-gov-800 shadow-2xs font-extrabold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          मराठी
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-1.5">
      <button
        type="button"
        onClick={openLanguageModal}
        className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 flex items-center space-x-1.5 transition-colors shadow-2xs"
        title="Change Language / भाषा निवडा"
      >
        <Globe className="w-3.5 h-3.5 text-gov-700" />
        <span>{language === 'mr' ? 'मराठी' : 'English'}</span>
      </button>
    </div>
  );
};

export default LanguageSwitcher;
