import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { useLanguage } from '../context/LanguageContext';
import { serviceTranslationsMr } from '../locales/translations';
import { FileText, Search, RefreshCw, ChevronRight, ArrowRight, FolderOpen } from 'lucide-react';

const MyApplicationsPage = () => {
  const { t, language } = useLanguage();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await API.get('/applications');
      if (res.data.success) {
        setApplications(res.data.applications);
      }
    } catch (err) {
      console.error('Failed to load applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredApps = applications.filter(app => {
    const mrInfo = serviceTranslationsMr[app.serviceId] || {};
    return app.applicationId.toLowerCase().includes(searchTerm.toLowerCase()) ||
           app.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (mrInfo.name && mrInfo.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
           app.status.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-gov-700 font-bold text-xs uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>{language === 'mr' ? 'एकात्मिक शासकीय सेवा अर्ज मागोवा' : 'Unified Government Service Tracking'}</span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
            {language === 'mr' ? 'माझे सादर केलेले अर्ज' : 'My Submitted Applications'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {language === 'mr'
              ? 'जोडलेल्या शासकीय विभागांमधील अर्जांची थेट अद्ययावत स्थिती.'
              : 'Real-time status tracking across connected government department APIs.'}
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={language === 'mr' ? 'अर्ज क्रमांक किंवा योजनेचे नाव शोधा...' : 'Search by ID or service name...'}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-gov-600 focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500">
          {language === 'mr' ? 'अर्जांची माहिती लोड होत आहे...' : 'Loading Application Tracking Registry...'}
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
          <FolderOpen className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-800 text-base">
            {language === 'mr' ? 'कोणतेही अर्ज सापडले नाहीत.' : 'No applications found.'}
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {language === 'mr' ? 'शासकीय योजना सूचीमधून आपला पहिला अर्ज सादर करा.' : 'Apply for your first government service from the catalogue.'}
          </p>
          <div className="pt-2">
            <Link to="/services" className="inline-flex items-center space-x-1.5 px-4 py-2 bg-gov-700 text-white rounded-lg text-xs font-bold hover:bg-gov-800 transition-colors">
              <span>{language === 'mr' ? 'शासकीय योजना पहा' : 'Explore Services'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3.5 px-4">{language === 'mr' ? 'अर्ज क्रमांक' : 'Application ID'}</th>
                  <th className="py-3.5 px-4">{language === 'mr' ? 'योजनेचे नाव' : 'Service Name'}</th>
                  <th className="py-3.5 px-4">{language === 'mr' ? 'शासकीय विभाग' : 'Department'}</th>
                  <th className="py-3.5 px-4">{language === 'mr' ? 'अर्जाची तारीख' : 'Applied Date'}</th>
                  <th className="py-3.5 px-4">{language === 'mr' ? 'स्थिती' : 'Status'}</th>
                  <th className="py-3.5 px-4 text-right">{language === 'mr' ? 'कृती' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApps.map((app) => {
                  const srvName = (language === 'mr' && serviceTranslationsMr[app.serviceId]?.name) || app.serviceName;
                  const srvDept = (language === 'mr' && serviceTranslationsMr[app.serviceId]?.department) || app.department;
                  return (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-gov-700">{app.applicationId}</td>
                      <td className="py-4 px-4 font-bold text-slate-900">{srvName}</td>
                      <td className="py-4 px-4 text-slate-600">{srvDept}</td>
                      <td className="py-4 px-4 font-medium text-slate-600">
                        {new Date(app.appliedDate).toLocaleDateString(language === 'mr' ? 'mr-IN' : 'en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-4 px-4">
                        <StatusBadge status={app.status} />
                      </td>
                      <td className="py-4 px-4 text-right">
                        <Link
                          to={`/my-applications/${app.id}`}
                          className="px-3 py-1.5 bg-gov-50 hover:bg-gov-100 text-gov-700 rounded-lg text-xs font-semibold inline-flex items-center space-x-1 transition-colors"
                        >
                          <span>{language === 'mr' ? 'तपशील पहा' : 'View Details'}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyApplicationsPage;
