import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import API from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { serviceTranslationsMr } from '../locales/translations';
import { 
  FolderOpen, Search, ArrowRight, ShieldCheck, CheckCircle2, 
  GraduationCap, Compass, Award, FileText, BookOpen, Cpu, HeartPulse, Sparkles, Building2, Landmark
} from 'lucide-react';

const ServiceCataloguePage = () => {
  const { t, language } = useLanguage();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryFilter = searchParams.get('category') || 'all';

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await API.get('/services');
      if (res.data.success) {
        setServices(res.data.services);
      }
    } catch (err) {
      console.error('Failed to load services:', err);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'GraduationCap': return GraduationCap;
      case 'Compass': return Compass;
      case 'Award': return Award;
      case 'FileText': return FileText;
      case 'BookOpen': return BookOpen;
      case 'Cpu': return Cpu;
      case 'HeartPulse': return HeartPulse;
      default: return Landmark;
    }
  };

  const categories = [
    { id: 'all', label: language === 'mr' ? 'सर्व योजना व सेवा (१२)' : 'All Services (12)' },
    { id: 'education', label: language === 'mr' ? '🎓 शिक्षण व प्रवेश' : '🎓 Education & Admissions' },
    { id: 'scholarship', label: language === 'mr' ? '💰 शिष्यवृत्ती' : '💰 Scholarships' },
    { id: 'certificates', label: language === 'mr' ? '📄 दाखले व प्रमाणपत्रे' : '📄 Certificates' },
    { id: 'skilling', label: language === 'mr' ? '💻 कौशल्य व तंत्रज्ञान' : '💻 Skilling & IT' },
    { id: 'health', label: language === 'mr' ? '🩺 आरोग्य व कल्याण' : '🩺 Health & Welfare' },
    { id: 'agriculture', label: language === 'mr' ? '🌾 कृषी व शेतकरी' : '🌾 Agriculture' },
    { id: 'startup', label: language === 'mr' ? '🚀 उद्योग व स्टार्टअप' : '🚀 Startups & MSME' },
    { id: 'housing', label: language === 'mr' ? '🏠 गृहनिर्माण व आवास' : '🏠 Housing & PMAY' },
  ];

  const filteredServices = services.filter(srv => {
    const mrInfo = serviceTranslationsMr[srv.serviceId] || {};
    const matchesSearch = srv.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          srv.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          srv.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (mrInfo.name && mrInfo.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (mrInfo.department && mrInfo.department.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (mrInfo.desc && mrInfo.desc.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (!categoryFilter || categoryFilter === 'all') return matchesSearch;
    if (categoryFilter === 'counselling' || categoryFilter === 'education') return matchesSearch && (srv.category.includes('Counselling') || srv.category.includes('Education') || srv.serviceId === 'SRV-FGB-01');
    if (categoryFilter === 'scholarship') return matchesSearch && srv.category.includes('Scholarship');
    if (categoryFilter === 'certificates') return matchesSearch && srv.category.includes('Certificate');
    if (categoryFilter === 'skilling') return matchesSearch && (srv.category.includes('Skill') || srv.serviceId === 'SRV-SKL-08');
    if (categoryFilter === 'health') return matchesSearch && (srv.category.includes('Health') || srv.serviceId === 'SRV-HLT-09');
    if (categoryFilter === 'agriculture') return matchesSearch && (srv.category.includes('Agriculture') || srv.serviceId === 'SRV-AGR-10');
    if (categoryFilter === 'startup') return matchesSearch && (srv.category.includes('Business') || srv.serviceId === 'SRV-ENT-11');
    if (categoryFilter === 'housing') return matchesSearch && (srv.category.includes('Housing') || srv.serviceId === 'SRV-HOU-12');
    return matchesSearch;
  });

  return (
    <div className="space-y-6 py-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-gov-700 font-bold text-xs uppercase tracking-wider">
            <FolderOpen className="w-4 h-4" />
            <span>{language === 'mr' ? 'शासकीय डिजिटल सेवा सूची' : 'Government Digital Service Directory'}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            {language === 'mr' ? 'शासकीय योजना व सेवा सूची' : 'Service Catalogue'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'mr'
              ? 'सिव्हिकब्रिज एआय आंतरकार्यक्षमता प्रणालीद्वारे जोडलेल्या १२ केंद्र व राज्य शासकीय योजनांचा लाभ घ्या.'
              : 'Discover 12 connected state and central government services powered by CivicBridge AI interoperability.'}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === 'mr' ? "योजनेचे नाव, विभाग, कीवर्ड शोधा..." : "Search service name, department, keywords..."}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-gov-600 focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSearchParams(cat.id === 'all' ? {} : { category: cat.id })}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              (categoryFilter === cat.id || (cat.id === 'all' && (!categoryFilter || categoryFilter === 'all')))
                ? 'bg-gov-700 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500">{language === 'mr' ? 'माहिती लोड होत आहे...' : 'Loading Service Directory...'}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => {
            const Icon = getIcon(service.icon);
            const srvName = (language === 'mr' && serviceTranslationsMr[service.serviceId]?.name) || service.serviceName;
            const srvDept = (language === 'mr' && serviceTranslationsMr[service.serviceId]?.department) || service.department;
            const srvDesc = (language === 'mr' && serviceTranslationsMr[service.serviceId]?.desc) || service.description;

            return (
              <div
                key={service.serviceId}
                className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-gov-500 hover:shadow-md transition-all flex flex-col justify-between p-6 space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-lg bg-gov-100 text-gov-700 flex items-center justify-center font-bold">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                      {language === 'mr' ? 'सक्रिय एपीआय (Connected)' : 'Connected API'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-gov-700 uppercase tracking-wider block">
                      {srvDept}
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      {srvName}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {srvDesc}
                  </p>

                  <div className="pt-2 border-t border-slate-100 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-slate-500">
                      <span>{language === 'mr' ? 'आवश्यक माहिती:' : 'Required Fields:'}</span>
                      <span className="font-semibold text-slate-700">
                        {language === 'mr' ? `${(service.requiredFields || []).length} बाबी` : `${(service.requiredFields || []).length} fields`}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-500">
                      <span>{language === 'mr' ? 'शासकीय कनेक्टर:' : 'Connector:'}</span>
                      <span className="font-mono text-[11px] text-gov-700">{service.apiConnector || 'DepartmentConnector'}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    to={`/services/${service.serviceId}`}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold text-center transition-colors"
                  >
                    {language === 'mr' ? 'तपशील पहा' : 'View Details'}
                  </Link>

                  <Link
                    to={`/services/${service.serviceId}/check-eligibility`}
                    className="flex-1 py-2 bg-gov-700 hover:bg-gov-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center space-x-1 transition-colors shadow-2xs"
                  >
                    <span>{language === 'mr' ? 'पात्रता तपासा' : 'Check Eligibility'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default ServiceCataloguePage;
