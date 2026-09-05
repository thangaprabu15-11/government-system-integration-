import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import API from '../services/api';
import { 
  translateServiceName, 
  translateDepartment, 
  translateField, 
  serviceTranslationsMr 
} from '../locales/translations';
import { 
  FileText, CheckCircle2, Sparkles, ArrowRight, ShieldCheck, 
  RefreshCw, Info, Edit3, ArrowLeftRight, UserCheck, Calendar, Building2, MapPin, Lock, Check, Zap, AlertTriangle
} from 'lucide-react';

const sectionTranslationsMr = {
  'Personal Identity Details': 'वैयक्तिक व ओळख तपशील',
  'Academic & Qualification Metrics': 'शैक्षणिक व पात्रता निकष',
  'Income & Community Validation': 'उत्पन्न व सामाजिक प्रवर्ग पडताळणी',
  'Residential & Contact Information': 'रहिवासी व संपर्क तपशील',
  'Service Specific Details': 'योजना-विशिष्ट तपशील',
  'Applicant Identification': 'अर्जदार ओळख',
  'Academic Information': 'शैक्षणिक माहिती',
  'Income Verification': 'उत्पन्न पडताळणी'
};

const translateSection = (title, lang) => {
  if (lang === 'mr' && sectionTranslationsMr[title]) {
    return sectionTranslationsMr[title];
  }
  return title;
};

const ApplicationFormPage = () => {
  const { serviceId } = useParams();
  const [searchParams] = useSearchParams();
  const isManualMode = searchParams.get('manual') === 'true';

  const { user, profile } = useAuth();
  const { language, t } = useLanguage();
  const [preparedData, setPreparedData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Auto-fill states
  const [isAutoFilled, setIsAutoFilled] = useState(false);
  const [animatingFill, setAnimatingFill] = useState(false);
  const [formData, setFormData] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    fetchApplicationPrep();
  }, [serviceId]);

  const fetchApplicationPrep = async () => {
    try {
      const savedLocal = localStorage.getItem(`civic_verified_${serviceId}`);
      let customInputs = {};
      if (savedLocal) {
        try {
          const parsed = JSON.parse(savedLocal);
          customInputs = parsed.inputs || {};
        } catch (e) {}
      } else {
        const savedSession = sessionStorage.getItem(`civic_inputs_${serviceId}`);
        if (savedSession) {
          try {
            customInputs = JSON.parse(savedSession);
          } catch (e) {}
        }
      }

      const res = await API.post('/application/prepare', { 
        serviceId: serviceId || 'SRV-FGB-01',
        providedInputs: customInputs
      });

      if (res.data && res.data.success) {
        setPreparedData(res.data);
        if (isManualMode) {
          setFormData({});
        }
      }
    } catch (err) {
      console.warn('Using default auto-fill dataset:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerAutoFill = async () => {
    setAnimatingFill(true);
    await new Promise(r => setTimeout(r, 450));
    
    if (preparedData && preparedData.autoFilledForm) {
      setFormData({ ...preparedData.autoFilledForm });
    }
    setIsAutoFilled(true);
    setAnimatingFill(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProceedToReview = (e) => {
    e.preventDefault();
    const activeService = preparedData?.service || { serviceId: serviceId || 'SRV-FGB-01', serviceName: 'Government Service', department: 'Government Department' };
    
    navigate(`/apply/${activeService.serviceId}/review`, {
      state: { 
        preparedData: preparedData, 
        updatedFormData: formData 
      }
    });
  };

  if (loading) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 max-w-xl mx-auto my-12 shadow-sm">
        <RefreshCw className="w-8 h-8 text-gov-600 animate-spin mx-auto mb-3" />
        <p className="text-sm font-bold text-slate-800">
          {language === 'mr' ? 'स्वयंचलित अर्ज वातावरण तयार करत आहे...' : 'Preparing Service Auto-Fill Environment...'}
        </p>
        <p className="text-xs text-slate-500 mt-1">
          {language === 'mr' ? 'सिव्हिकब्रिज कॉमन सिटीझन डेटा मॉडेलशी जोडत आहे.' : 'Connecting to CivicBridge Common Citizen Data Model.'}
        </p>
      </div>
    );
  }

  const rawService = preparedData?.service || {
    serviceId: serviceId || 'SRV-FGB-01',
    serviceName: 'Government Service Application',
    department: 'Department of Public Services'
  };

  const sName = translateServiceName(rawService.serviceId, rawService.serviceName, language);
  const sDept = translateDepartment(rawService.serviceId, rawService.department, language);

  const availableInfoList = preparedData?.availableInfoList || [];
  const missingInfoList = preparedData?.missingInfoList || [];
  const autoFillSections = preparedData?.autoFillSections || [];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <span className="text-[10px] font-bold font-mono bg-gov-100 text-gov-800 px-2.5 py-0.5 rounded uppercase">
              {sDept}
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1">{sName}</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'mr' ? 'स्वयंचलित शासकीय सेवा अर्ज मंच' : 'Automated Government Service Auto-Fill Platform'}
            </p>
          </div>

          <div className="flex items-center space-x-2">
            {isAutoFilled ? (
              <span className="bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-3 py-1 rounded-full text-xs flex items-center space-x-1.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{language === 'mr' ? '✓ स्वयंचलित भरणी पूर्ण झाली' : '✓ Auto-Fill Completed'}</span>
              </span>
            ) : (
              <span className="bg-amber-100 text-amber-900 border border-amber-300 font-bold px-3 py-1 rounded-full text-xs flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>{language === 'mr' ? 'स्वयंचलित भरणी सज्ज' : 'Auto-Fill Ready'}</span>
              </span>
            )}
          </div>
        </div>

        {/* STEP 1: Available Citizen Profile Information */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
              <UserCheck className="w-4 h-4 text-gov-700" />
              <span>
                {language === 'mr'
                  ? 'टप्पा १: उपलब्ध नागरिक प्रोफाईल माहिती (पडताळलेले अभिलेख)'
                  : 'STEP 1: Available Citizen Profile Information (Verified Records)'}
              </span>
            </h3>
            <span className="text-[10px] font-mono text-gov-700 font-bold bg-gov-50 border border-gov-200 px-2 py-0.5 rounded">
              {language === 'mr' ? 'पडताळलेले अभिलेख' : 'Verified Records'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
            {availableInfoList.map((item, idx) => (
              <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 space-y-0.5">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">{translateField(item.label, language)}:</span>
                <span className="font-bold text-slate-900">{item.value}</span>
                <span className="text-[10px] text-slate-500 block">{item.source}</span>
              </div>
            ))}
          </div>
        </div>

        {/* STEP 2: Separate Available vs Provided Missing Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          <div className="bg-emerald-50/70 border border-emerald-200 p-4 rounded-xl space-y-2">
            <div className="flex items-center space-x-1.5 font-bold text-emerald-950">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>
                {language === 'mr' 
                  ? `उपलब्ध माहिती (${availableInfoList.length} पडताळलेले रकाने)` 
                  : `AVAILABLE INFORMATION (${availableInfoList.length} Verified Fields)`}
              </span>
            </div>
            <ul className="space-y-1 text-[11px] text-emerald-900 font-medium">
              {availableInfoList.map((item, idx) => (
                <li key={idx}>✓ {translateField(item.label, language)}: <strong>{item.value}</strong></li>
              ))}
            </ul>
          </div>

          <div className="bg-indigo-50/70 border border-indigo-200 p-4 rounded-xl space-y-2">
            <div className="flex items-center space-x-1.5 font-bold text-indigo-950">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              <span>
                {language === 'mr'
                  ? `सादर केलेल्या सेवा आवश्यकता (${missingInfoList.length} रकाने)`
                  : `PROVIDED SERVICE REQUIREMENTS (${missingInfoList.length} Fields)`}
              </span>
            </div>
            {missingInfoList.length > 0 ? (
              <ul className="space-y-1 text-[11px] text-indigo-900 font-medium">
                {missingInfoList.map((item, idx) => (
                  <li key={idx}>✓ {translateField(item.label, language)}: <strong>{item.value}</strong></li>
                ))}
              </ul>
            ) : (
              <p className="text-[11px] text-indigo-700 leading-relaxed">
                {language === 'mr'
                  ? 'पडताळलेल्या नागरिक ओळख नोंदणीमधून सर्व आवश्यक विभागीय निकष पूर्ण झाले आहेत.'
                  : 'All essential department requirements satisfied from verified citizen identity registers.'}
              </p>
            )}
          </div>

        </div>

        {/* STEP 3: Auto-Fill Button */}
        {!isAutoFilled && (
          <div className="p-4 bg-gradient-to-r from-gov-50 via-indigo-50 to-amber-50 rounded-xl border border-gov-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>
                  {language === 'mr' ? `${sName} अर्जाचे रकाने भरण्यासाठी सज्ज` : `Ready to Populate ${sName} Form`}
                </span>
              </h4>
              <p className="text-[11px] text-slate-600 mt-0.5">
                {language === 'mr'
                  ? 'अधिकृत नागरिक नोंदी आणि सादर केलेल्या माहितीसह अर्जाचे रकाने भरण्यासाठी खाली क्लिक करा.'
                  : 'Click below to populate form inputs with authorized citizen records and provided details.'}
              </p>
            </div>

            <button
              type="button"
              onClick={handleTriggerAutoFill}
              disabled={animatingFill}
              className="px-6 py-3 bg-gov-700 hover:bg-gov-800 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-md transition-all shrink-0 disabled:opacity-50"
            >
              {animatingFill ? (
                <span>{language === 'mr' ? 'अर्ज भरत आहे...' : 'Populating Form...'}</span>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>{language === 'mr' ? 'स्वयंचलितपणे अर्ज भरा' : 'Auto-Fill Application'}</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* STEP 4: Status Indicator after Auto-Fill Completed */}
        {isAutoFilled && (
          <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl flex items-center justify-between animate-fadeIn">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center font-bold">
                <Check className="w-5 h-5 text-emerald-700" />
              </div>
              <div>
                <span className="font-bold text-xs text-emerald-950 block">
                  {language === 'mr' ? 'अर्जाचे रकाने यशस्वीरीत्या स्वयंचलित भरले गेले' : 'Application successfully auto-filled'}
                </span>
                <span className="text-[11px] text-emerald-800">
                  {language === 'mr'
                    ? '✓ स्वयंचलित भरणी पूर्ण झाली — अंतिम सादरीकरणापूर्वी खालील माहिती तपासा'
                    : '✓ Auto-Fill Completed — Review fields below before final submission'}
                </span>
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold bg-emerald-200 text-emerald-900 px-2.5 py-1 rounded-full">
              {language === 'mr' ? 'पुनरावलोकनासाठी सज्ज' : 'Ready for Review'}
            </span>
          </div>
        )}

        {/* Dynamic Form Sections populated visually */}
        <form onSubmit={handleProceedToReview} className="space-y-6 pt-2">
          
          {autoFillSections.map((sec, sIdx) => (
            <div key={sIdx} className="space-y-3 bg-slate-50/60 p-4 rounded-xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5 border-b border-slate-200 pb-2">
                <span>{translateSection(sec.sectionTitle, language)}</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {sec.fields.map((fld) => (
                  <div key={fld.key} className={`space-y-1 ${fld.type === 'textarea' ? 'md:col-span-2' : ''}`}>
                    <div className="flex items-center justify-between">
                      <label className="block font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                        {translateField(fld.label, language)}
                      </label>
                      {fld.source && (
                        <span className="text-[9px] text-slate-400 font-mono">
                          Src: {fld.source}
                        </span>
                      )}
                    </div>

                    <div className="relative flex items-center">
                      {fld.type === 'textarea' ? (
                        <textarea
                          rows={2}
                          value={formData[fld.key] || ''}
                          onChange={(e) => handleInputChange(fld.key, e.target.value)}
                          className={`w-full p-2.5 rounded-lg font-medium text-slate-900 border transition-all ${
                            isAutoFilled ? 'bg-emerald-50/40 border-emerald-300' : 'bg-white border-slate-300'
                          }`}
                        />
                      ) : (
                        <input
                          type={fld.type || 'text'}
                          disabled={fld.disabled}
                          value={formData[fld.key] || ''}
                          onChange={(e) => handleInputChange(fld.key, e.target.value)}
                          placeholder={translateField(fld.label, language)}
                          className={`w-full p-2.5 rounded-lg font-medium text-slate-900 border transition-all ${
                            fld.disabled ? 'bg-slate-100 text-slate-600 font-mono' : isAutoFilled ? 'bg-emerald-50/40 border-emerald-300' : 'bg-white border-slate-300'
                          }`}
                        />
                      )}

                      {isAutoFilled && !fld.disabled && (
                        <span className="absolute right-2 top-2 text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
                          {language === 'mr' ? 'स्वयंचलित भरले' : 'Auto-Filled'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Action Buttons */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <Link
              to="/services"
              className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold"
            >
              {language === 'mr' ? 'रद्द करा' : 'Cancel'}
            </Link>

            <button
              type="submit"
              disabled={!isAutoFilled && Object.keys(formData).length === 0}
              className="px-8 py-3 bg-gov-700 hover:bg-gov-800 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-sm transition-all disabled:opacity-50"
            >
              <span>{language === 'mr' ? 'आपल्या अर्जाचे पुनरावलोकन करा' : 'Review Your Application'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>

    </div>
  );
};

export default ApplicationFormPage;
