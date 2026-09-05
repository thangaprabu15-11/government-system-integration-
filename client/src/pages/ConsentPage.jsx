import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { 
  translateServiceName, 
  translateDepartment, 
  serviceTranslationsMr 
} from '../locales/translations';
import { 
  ShieldCheck, AlertCircle, CheckCircle2, XCircle, 
  Lock, ArrowRight, Building2, Key, Info, RefreshCw, Cpu, Database, Layers, ArrowLeftRight
} from 'lucide-react';
import FirebaseService from '../services/firebaseDb';

const fetchStepsEn = [
  'Validating citizen consent token...',
  'Connecting to Department Mock API...',
  'Authorizing requested scopes...',
  'Fetching standardized citizen records...',
  'Transforming into Common Data Model...',
  'Mapping fields to target schema...',
  'Preparing auto-fill environment...',
  '✓ Data successfully prepared'
];

const fetchStepsMr = [
  'नागरिक संमती टोकन पडताळत आहे...',
  'विभागीय API शी सुरक्षित जोडणी सुरू आहे...',
  'मागितलेल्या डेटा प्रवेश अधिकारांचे प्रमाणीकरण सुरू आहे...',
  'प्रमाणित नागरिक अभिलेख सुरक्षितपणे आणत आहे...',
  'सामान्य नागरिक डेटा मॉडेलमध्ये रूपांतरित करत आहे...',
  'लक्षित अर्जाच्या संरचनेशी क्षेत्रे जोडत आहे...',
  'स्वयंचलित अर्ज भरणी वातावरण तयार करत आहे...',
  '✓ डेटा यशस्वीरीत्या तयार झाला'
];

const scopeTranslationsMr = {
  'Education Information': 'शैक्षणिक माहिती',
  'Address Information': 'पत्ता व रहिवासी माहिती',
  'Citizen Profile Data': 'नागरिक ओळख व प्रोफाईल माहिती',
  'Address Data': 'पत्ता व जिल्हा माहिती',
  'Income Data': 'उत्पन्न तपशील',
  'Community Data': 'जात व सामाजिक प्रवर्ग माहिती',
  'Land Records': 'जमीन मालकी अभिलेख (७/१२)',
  'Academic Records': 'शैक्षणिक गुण व पात्रता अभिलेख'
};

const translateScope = (scope, lang) => {
  if (lang === 'mr' && scopeTranslationsMr[scope]) {
    return scopeTranslationsMr[scope];
  }
  return scope;
};

const ConsentPage = () => {
  const [searchParams] = useSearchParams();
  const serviceId = searchParams.get('serviceId') || 'SRV-FGB-01';
  const redirectUrl = searchParams.get('redirectUrl') || `/apply/${serviceId}`;
  const { language } = useLanguage();
  
  const [service, setService] = useState({
    serviceId: serviceId || 'SRV-FGB-01',
    serviceName: 'First-Generation Graduate Benefit',
    department: 'Department of Higher Education',
    apiConnector: 'EducationConnector',
    consentPurpose: 'To verify service-specific requirements and prepare the selected application.',
    consentScopes: [
      { id: 'edu_data', label: 'Education Information', detail: 'Enrolled Institution, Current Education Level' },
      { id: 'addr_data', label: 'Address Information', detail: 'Permanent Residential Address' }
    ]
  });
  
  const [loading, setLoading] = useState(true);
  const [denied, setDenied] = useState(false);
  const [isSimulatingFetch, setIsSimulatingFetch] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    fetchService();
  }, [serviceId]);

  const fetchService = async () => {
    try {
      const res = await API.get(`/services/${serviceId}`);
      if (res.data.success && res.data.service) {
        setService(res.data.service);
      }
    } catch (err) {
      console.warn('Using default service metadata for consent scope:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGrantConsent = async () => {
    setIsSimulatingFetch(true);
    setDenied(false);

    try {
      const scopesList = (service.consentScopes || []).map(s => s.label || s);
      await API.post('/consent/grant', {
        serviceId: service.serviceId,
        scopes: scopesList,
        requestedFields: scopesList,
        purpose: service.consentPurpose || 'To check eligibility and pre-fill your selected government application.'
      });

      // Also persist to Firebase Firestore Database (brototype-79697)
      FirebaseService.saveConsent({
        serviceId: service.serviceId,
        serviceName: service.serviceName,
        department: service.department,
        scopes: scopesList,
        purpose: service.consentPurpose,
        status: 'Granted',
        grantedAt: new Date().toISOString()
      }).catch(e => console.warn('Firebase async consent sync:', e));
    } catch (err) {
      console.warn('Consent API fallback handled:', err);
    }

    const steps = language === 'mr' ? fetchStepsMr : fetchStepsEn;
    for (let i = 0; i < steps.length; i++) {
      setCurrentStepIndex(i);
      await new Promise(r => setTimeout(r, 450));
    }

    await new Promise(r => setTimeout(r, 600));
    navigate(redirectUrl);
  };

  const handleDenyConsent = () => {
    setDenied(true);
  };

  if (loading) {
    return (
      <div className="max-w-xl mx-auto my-12 p-8 bg-white rounded-2xl border border-slate-200 text-center shadow-sm">
        <RefreshCw className="w-8 h-8 text-gov-600 animate-spin mx-auto mb-2" />
        <p className="text-sm font-bold text-slate-800">
          {language === 'mr' ? 'सेवा डेटा प्रवेश व्याप्ती लोड करत आहे...' : 'Loading Service Data Access Scope...'}
        </p>
      </div>
    );
  }

  const sName = translateServiceName(service.serviceId, service.serviceName, language);
  const sDept = translateDepartment(service.serviceId, service.department, language);
  const steps = language === 'mr' ? fetchStepsMr : fetchStepsEn;

  const scopes = service.consentScopes || [
    { id: 'profile_data', label: 'Citizen Profile Data', detail: 'Full Name, Date of Birth' },
    { id: 'address_data', label: 'Address Data', detail: 'Residential Address, District' }
  ];

  return (
    <div className="max-w-2xl mx-auto my-10 px-4">
      
      {/* Visual Interoperability Simulation Modal during Data Fetch */}
      {isSimulatingFetch ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl p-8 space-y-6 animate-fadeIn">
          
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
              <RefreshCw className="w-8 h-8 animate-spin" />
            </div>
            <span className="text-[10px] font-bold font-mono bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full uppercase tracking-wider">
              {language === 'mr' ? '✓ संमती मंजूर व पडताळली' : '✓ Consent Granted & Verified'}
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">
              {language === 'mr' ? 'शासकीय API डेटा जोडणी' : 'Mock Government API Data Connect'}
            </h2>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {language === 'mr'
                ? 'सिव्हिकब्रिज AI अधिकृत नोंदी प्राप्त करून त्यांना सामान्य नागरिक डेटा मॉडेलमध्ये प्रमाणित करत आहे.'
                : 'CivicBridge AI is retrieving authorized records and normalizing them into the Common Citizen Data Model.'}
            </p>
          </div>

          {/* Pipeline Visual Diagram */}
          <div className="bg-slate-900 text-slate-200 p-5 rounded-xl space-y-3 font-mono text-xs">
            <div className="text-amber-400 font-bold text-[11px] flex items-center justify-between border-b border-slate-700 pb-2">
              <div className="flex items-center space-x-1.5">
                <Layers className="w-4 h-4" />
                <span>{language === 'mr' ? 'आंतरकार्यक्षमता पाइपलाइन अनुकरण' : 'Interoperability Pipeline Simulation'}</span>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                {language === 'mr' ? 'सुरक्षित शासकीय API' : 'Mock Prototype API'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
              <div className="bg-slate-800 border border-slate-700 p-2 rounded text-slate-300">
                <span className="text-slate-400 block">{language === 'mr' ? 'नागरिक प्रोफाईल' : 'Citizen Profile'}</span>
                <strong className="text-white">Thanga Prabu N</strong>
              </div>
              <div className="bg-emerald-950 border border-emerald-700 p-2 rounded text-emerald-300">
                <span className="text-emerald-400 block">{language === 'mr' ? 'संमती टोकन' : 'Consent Token'}</span>
                <strong>{language === 'mr' ? '✓ अधिकृत' : '✓ Service Scoped'}</strong>
              </div>
              <div className="bg-indigo-950 border border-indigo-700 p-2 rounded text-indigo-300">
                <span className="text-indigo-400 block">{language === 'mr' ? 'सामान्य मॉडेल' : 'Common Model'}</span>
                <strong>{language === 'mr' ? 'प्रमाणित' : 'Standardized'}</strong>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg flex items-center justify-between text-[11px]">
              <span className="text-amber-300">{language === 'mr' ? 'लक्षित विभाग:' : 'Target Department:'}</span>
              <span className="font-bold text-white">{sDept}</span>
            </div>
          </div>

          {/* Current Step Status */}
          <div className="bg-gov-50 border border-gov-200 p-4 rounded-xl text-center space-y-2">
            <div className="text-xs font-bold text-gov-900 flex items-center justify-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-gov-600 animate-ping"></span>
              <span>{steps[currentStepIndex]}</span>
            </div>
            <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-gov-700 h-full rounded-full transition-all duration-300"
                style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

        </div>
      ) : (
        /* Standard Data Access Permission Box */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden space-y-6 p-8">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto border border-amber-300 shadow-sm">
              <ShieldCheck className="w-7 h-7 text-amber-700" />
            </div>
            <span className="text-[10px] font-bold font-mono bg-gov-100 text-gov-800 px-2.5 py-0.5 rounded uppercase">
              {language === 'mr' ? 'सेवा-विशिष्ट संमती' : 'Service-Specific Consent'}
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">
              {language === 'mr' ? 'डेटा प्रवेश परवानगी' : 'Data Access Permission'}
            </h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              {language === 'mr' 
                ? <>सिव्हिकब्रिज केवळ <strong>{sName}</strong> या सेवेसाठी आवश्यक असलेल्या अधिकृत डेटासाठी प्रवेशाची विनंती करत आहे:</>
                : <>CivicBridge requests authorized access strictly for the data required by <strong>{service.serviceName}</strong>:</>}
            </p>
          </div>

          {/* Target Service Box */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-1">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              {language === 'mr' ? 'लक्षित शासकीय सेवा' : 'Target Application Service'}
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900">{sName}</h4>
                <span className="text-xs text-slate-500">{sDept}</span>
              </div>
              <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded font-bold">
                {service.apiConnector || 'DepartmentConnector'}
              </span>
            </div>
          </div>

          {/* Data Scopes Required - SERVICE SPECIFIC */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              {language === 'mr' 
                ? `मागितलेले माहितीचे अधिकार (${scopes.length} अधिकार):` 
                : `Requested Information Scopes (${scopes.length} Scopes):`}
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              {scopes.map((scope, idx) => (
                <div key={idx} className="bg-white border border-slate-200 p-3 rounded-xl flex items-center space-x-2.5 shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold text-slate-800 block">
                      {translateScope(scope.label || scope, language)}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {language === 'mr' ? 'सेवा पडताळणी आवश्यकता' : (scope.detail || 'Service verification requirement')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Purpose Box */}
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl text-xs space-y-1 text-slate-700">
            <div className="font-bold text-slate-900 flex items-center space-x-1.5">
              <Info className="w-4 h-4 text-gov-600" />
              <span>{language === 'mr' ? 'सेवेचा उद्देश:' : 'Service Purpose:'}</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-600">
              {language === 'mr' 
                ? 'पात्रता पडताळणी आणि निवडलेल्या शासकीय योजनेचा अर्ज स्वयंचलित भरण्यासाठी. आपली माहिती केवळ या सेवेसाठी वापरली जाईल.'
                : (service.consentPurpose || 'To check eligibility and pre-fill your selected government application. Your data will only be used for this specific service in this prototype.')}
            </p>
          </div>

          {/* Denied Warning (if user clicked Deny) */}
          {denied && (
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-xl space-y-3 animate-fadeIn">
              <div className="flex items-start space-x-2 text-xs text-rose-900 font-medium">
                <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <p>
                  <strong>{language === 'mr' ? 'प्रवेश नाकारला.' : 'Access denied.'}</strong> {language === 'mr' ? 'आपण आवश्यक माहिती स्वहस्ते (मॅन्युअली) भरून पुढे जाऊ शकता.' : 'You can continue by entering the required information manually.'}
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => navigate(`/apply/${service.serviceId}?manual=true`)}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors shadow-sm"
                >
                  {language === 'mr' ? 'स्वहस्ते माहिती भरा' : 'Enter Manually'}
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {!denied && (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleDenyConsent}
                className="py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
              >
                {language === 'mr' ? 'प्रवेश नाकारा' : 'Deny Access'}
              </button>

              <button
                onClick={handleGrantConsent}
                className="py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-sm transition-all"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{language === 'mr' ? 'निवडलेल्या डेटास परवानगी द्या' : 'Allow Selected Data'}</span>
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default ConsentPage;
