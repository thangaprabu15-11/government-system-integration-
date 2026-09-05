import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { 
  translateServiceName, 
  translateDepartment, 
  translateField, 
  serviceTranslationsMr 
} from '../locales/translations';
import { 
  Building2, CheckCircle2, ShieldCheck, HelpCircle, FileText, 
  ArrowRight, Cpu, Layers, Award, AlertCircle
} from 'lucide-react';

const docTranslationsMr = {
  'HSC Marksheet': 'इयत्ता १२ वी (HSC) गुणपत्रिका',
  'Income Certificate': 'उत्पन्नाचा दाखला',
  'Community Certificate': 'जात / प्रवर्ग प्रमाणपत्र',
  'Nativity Certificate': 'अधिवास / रहिवासी दाखला (डोमिसिल)',
  'Aadhaar Card': 'आधार कार्ड',
  'First Graduate Certificate': 'प्रथम पदवीधर प्रमाणपत्र',
  'Land Ownership Document': 'जमीन मालकी ७/१२ उतारा / दस्तऐवज',
  'Bank Passbook': 'बँक पासबुक',
  'Ration Card': 'रेशन कार्ड',
  'Startup Pitch Deck': 'स्टार्टअप संकल्पना सादरीकरण (Pitch Deck)',
  'Degree Certificate': 'पदवी प्रमाणपत्र',
  'Institution Bonafide': 'महाविद्यालय बोनाफाइड प्रमाणपत्र'
};

const translateDoc = (doc, lang) => {
  if (lang === 'mr' && docTranslationsMr[doc]) {
    return docTranslationsMr[doc];
  }
  return doc;
};

const ServiceDetailsPage = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const { language, t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    fetchService();
  }, [id]);

  const fetchService = async () => {
    try {
      const res = await API.get(`/services/${id}`);
      if (res.data.success) {
        setService(res.data.service);
      }
    } catch (err) {
      console.error('Failed to load service details:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 font-medium">
        {language === 'mr' ? 'शासकीय सेवेची माहिती लोड करत आहे...' : 'Loading service information...'}
      </div>
    );
  }

  if (!service) {
    return (
      <div className="p-12 text-center text-rose-600 font-medium">
        {language === 'mr' ? 'शासकीय सेवा आढळली नाही.' : 'Service not found.'}
      </div>
    );
  }

  const sName = translateServiceName(service.serviceId, service.serviceName, language);
  const sDept = translateDepartment(service.serviceId, service.department, language);
  const sDesc = language === 'mr' && serviceTranslationsMr[service.serviceId]?.desc
    ? serviceTranslationsMr[service.serviceId].desc
    : service.description;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Breadcrumb Navigation */}
      <div className="text-xs text-slate-500 flex items-center space-x-2">
        <Link to="/services" className="hover:underline text-gov-700 font-medium">
          {language === 'mr' ? '← सर्व शासकीय सेवा' : 'Services'}
        </Link>
        <span>/</span>
        <span className="text-slate-800 font-semibold">{sName}</span>
      </div>

      {/* Main Service Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div>
            <span className="bg-gov-100 text-gov-800 text-[10px] font-bold px-2.5 py-1 rounded uppercase tracking-wider">
              {sDept}
            </span>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-2">{sName}</h1>
            <p className="text-xs text-slate-500 mt-1">
              {language === 'mr' ? `वर्गवारी: ${service.category}` : `${service.category} Service`}
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{language === 'mr' ? 'कनेक्टर:' : 'Connector:'} {service.apiConnector}</span>
          </div>
        </div>

        {/* Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          
          {/* Purpose */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-800 flex items-center space-x-1.5 text-sm">
              <HelpCircle className="w-4 h-4 text-gov-600" />
              <span>{language === 'mr' ? 'उद्देश व योजनेचे स्वरूप' : 'Purpose & Scheme Objective'}</span>
            </h3>
            <p className="text-slate-600 leading-relaxed">
              {language === 'mr' && serviceTranslationsMr[service.serviceId]?.desc
                ? serviceTranslationsMr[service.serviceId].desc
                : service.purpose}
            </p>
          </div>

          {/* Description */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h3 className="font-bold text-slate-800 flex items-center space-x-1.5 text-sm">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>{language === 'mr' ? 'विभागीय विवरण' : 'Department Description'}</span>
            </h3>
            <p className="text-slate-600 leading-relaxed">{sDesc}</p>
          </div>

        </div>

        {/* Required Fields & Required Documents */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          
          <div className="space-y-2">
            <h3 className="font-bold text-slate-800 text-sm">
              {language === 'mr' ? 'आवश्यक माहिती रकाने' : 'Required Information Fields'}
            </h3>
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap gap-1.5">
              {(service.requiredFields || []).map((field, idx) => (
                <span key={idx} className="bg-slate-100 text-slate-700 font-medium text-[11px] px-2.5 py-1 rounded border border-slate-200">
                  ✓ {translateField(field, language)}
                </span>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-slate-800 text-sm">
              {language === 'mr' ? 'आवश्यक पडताळणी कागदपत्रे' : 'Required Verification Documents'}
            </h3>
            <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-wrap gap-1.5">
              {(service.requiredDocuments || []).map((doc, idx) => (
                <span key={idx} className="bg-indigo-50 text-indigo-800 text-[11px] px-2.5 py-1 rounded border border-indigo-200">
                  📄 {translateDoc(doc, language)}
                </span>
              ))}
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-end gap-3">
          <Link
            to={`/services/${service.serviceId}/check-eligibility`}
            className="w-full sm:w-auto px-6 py-3 bg-gov-700 hover:bg-gov-800 text-white font-bold rounded-xl text-xs flex items-center justify-center space-x-2 transition-colors shadow-sm"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{language === 'mr' ? 'पात्रता तपासा आणि अर्ज करा' : 'Check My Eligibility & Apply'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

    </div>
  );
};

export default ServiceDetailsPage;
