import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../locales/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('civicbridge_lang') || 'en';
  });

  // Modal pops up before user login / sign in if not already confirmed in session
  const [showLanguageModal, setShowLanguageModal] = useState(() => {
    return !sessionStorage.getItem('civicbridge_lang_confirmed');
  });

  const changeLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem('civicbridge_lang', lang);
    sessionStorage.setItem('civicbridge_lang_confirmed', 'true');
    setShowLanguageModal(false);
  };

  const openLanguageModal = () => {
    setShowLanguageModal(true);
  };

  const closeLanguageModal = () => {
    setShowLanguageModal(false);
    sessionStorage.setItem('civicbridge_lang_confirmed', 'true');
  };

  const checkAndPromptPreLogin = () => {
    if (!sessionStorage.getItem('civicbridge_lang_confirmed')) {
      setShowLanguageModal(true);
    }
  };

  const t = (key, fallback = '') => {
    if (translations[language] && translations[language][key]) {
      return translations[language][key];
    }
    if (translations['en'] && translations['en'][key]) {
      return translations['en'][key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider value={{
      language,
      changeLanguage,
      showLanguageModal,
      openLanguageModal,
      closeLanguageModal,
      checkAndPromptPreLogin,
      t
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
