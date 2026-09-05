import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { 
  translateServiceName, 
  translateDepartment 
} from '../locales/translations';
import { ShieldCheck, CheckCircle2, XCircle, Trash2, Clock, Lock, Info, Building2 } from 'lucide-react';

const scopeTranslationsMr = {
  'Education Information': 'शैक्षणिक माहिती',
  'Address Information': 'पत्ता व रहिवासी माहिती',
  'Citizen Profile Data': 'नागरिक ओळख व प्रोफाईल माहिती',
  'Address Data': 'पत्ता व जिल्हा माहिती',
  'Education Data': 'शैक्षणिक डेटा',
  'Income Data': 'उत्पन्न तपशील',
  'Community Data': 'जात व सामाजिक प्रवर्ग माहिती',
  'Land Records': 'जमीन मालकी अभिलेख'
};

const translateScope = (scope, lang) => {
  if (lang === 'mr' && scopeTranslationsMr[scope]) {
    return scopeTranslationsMr[scope];
  }
  return scope;
};

const ConsentHistoryPage = () => {
  const [consents, setConsents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [revokingId, setRevokingId] = useState(null);
  const { language } = useLanguage();

  useEffect(() => {
    fetchConsents();
  }, []);

  const fetchConsents = async () => {
    try {
      const res = await API.get('/consent');
      if (res.data.success) {
        setConsents(res.data.consents);
      }
    } catch (err) {
      console.error('Failed to load consents:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async (serviceId) => {
    setRevokingId(serviceId);
    try {
      await API.post('/consent/revoke', { serviceId });
      await fetchConsents();
    } catch (err) {
      console.error('Failed to revoke consent:', err);
    } finally {
      setRevokingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-gov-700 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{language === 'mr' ? 'नागरिक डेटा सुरक्षा आणि संमती व्यवस्थापन' : 'Citizen Data Protection & Consent Management'}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            {language === 'mr' ? 'संमती व्यवस्थापन' : 'Consent Management'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'mr'
              ? 'शासकीय सेवांसाठी नागरिकाने अधिकृत दिलेल्या सक्रिय व मागील डेटा प्रवेश परवानग्या.'
              : 'Active and previous data permissions authorized by the citizen for automated government service orchestration.'}
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-500 font-medium">
            {language === 'mr' ? 'संमती नोंदवही लोड करत आहे...' : 'Loading Consent Registry...'}
          </div>
        ) : (
          <div className="space-y-4">
            {consents.map((c, idx) => {
              const scopesList = c.scopes || c.requestedFields || ['Education Data', 'Income Data', 'Address Data'];
              const isActive = (c.status || '').toUpperCase() === 'ACTIVE';
              const sName = translateServiceName(c.serviceId || c.id, c.serviceName, language);
              const sDept = translateDepartment(c.serviceId || c.id, c.department, language);

              return (
                <div
                  key={c.id || idx}
                  className={`border rounded-2xl p-5 space-y-4 transition-all ${isActive ? 'bg-slate-50/70 border-slate-200' : 'bg-rose-50/30 border-rose-200 opacity-80'}`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-3">
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-bold text-slate-900 text-sm">{sName}</h3>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                          {isActive 
                            ? (language === 'mr' ? '✓ मंजूर' : '✓ Granted') 
                            : (language === 'mr' ? 'रद्द केले' : 'Revoked')}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">{sDept}</span>
                    </div>

                    <div className="text-right text-[11px] text-slate-400 font-mono">
                      {language === 'mr' ? 'मंजूर तारीख:' : 'Granted:'} {new Date(c.grantedAt || Date.now()).toLocaleDateString(language === 'mr' ? 'mr-IN' : 'en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>

                  {/* Scopes Display */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {language === 'mr' ? 'अधिकृत डेटा कार्यक्षेत्र:' : 'Authorized Data Scopes:'}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {scopesList.map((sc, i) => (
                        <div key={i} className="flex items-center space-x-1 bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-xs">
                          <CheckCircle2 className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                          <span className="font-medium text-slate-700">{translateScope(sc, language)}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${isActive ? 'text-emerald-700 bg-emerald-50' : 'text-slate-400'}`}>
                            {isActive 
                              ? (language === 'mr' ? '✓ मंजूर' : '✓ Granted') 
                              : (language === 'mr' ? 'निष्क्रिय' : 'Inactive')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Purpose */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start space-x-2">
                    <Info className="w-4 h-4 text-gov-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-800">{language === 'mr' ? 'उद्देश: ' : 'Purpose: '}</strong>
                      <span>
                        {language === 'mr' 
                          ? 'पात्रता पडताळणी आणि स्वयंचलित शासकीय योजना अर्ज प्रक्रियेसाठी माहिती अधिकृतीकरण.'
                          : (c.purpose || 'Eligibility verification and application preparation for automated government benefits.')}
                      </span>
                    </div>
                  </div>

                  {/* Revoke Option */}
                  {isActive && (
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => handleRevoke(c.serviceId || c.id)}
                        disabled={revokingId === (c.serviceId || c.id)}
                        className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>
                          {revokingId === (c.serviceId || c.id) 
                            ? (language === 'mr' ? 'संमती रद्द करत आहे...' : 'Revoking...') 
                            : (language === 'mr' ? 'संमती रद्द करा' : 'Revoke Consent')}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
};

export default ConsentHistoryPage;

