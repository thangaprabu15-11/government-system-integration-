import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { FileText, CheckCircle2, Upload, ShieldCheck, Download, Trash2, Eye } from 'lucide-react';

const docTypeTranslationsMr = {
  'HSC Marksheet': 'इयत्ता १२ वी (HSC) गुणपत्रिका',
  'Income Certificate': 'उत्पन्नाचा दाखला',
  'Community Certificate': 'जात / प्रवर्ग प्रमाणपत्र',
  'Aadhaar Card': 'आधार कार्ड (गुप्त)'
};

const DocumentsPage = () => {
  const { profile } = useAuth();
  const { language } = useLanguage();
  const [documents, setDocuments] = useState(profile?.documents || [
    { type: 'HSC Marksheet', name: 'HSC_Marksheet_2025.pdf', status: 'VERIFIED', uploadedAt: '2025-06-15' },
    { type: 'Income Certificate', name: 'Income_Cert_2025.pdf', status: 'VERIFIED', uploadedAt: '2025-07-20' },
    { type: 'Community Certificate', name: 'Community_Cert.pdf', status: 'VERIFIED', uploadedAt: '2024-03-10' },
    { type: 'Aadhaar Card', name: 'Aadhaar_Card_Masked.pdf', status: 'VERIFIED', uploadedAt: '2024-01-05' }
  ]);

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-gov-700 uppercase tracking-wider">
              <FileText className="w-4 h-4" />
              <span>{language === 'mr' ? 'डिजिटल दस्तऐवज लॉकर' : 'Digital Document Locker'}</span>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 mt-1">
              {language === 'mr' ? 'पडताळलेली प्रमाणपत्रे दालन' : 'Verified Document Vault'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'mr'
                ? 'विविध शासकीय सेवांच्या स्वयंचलित अर्जासाठी सुरक्षितपणे जतन केलेली पडताळणी प्रमाणपत्रे.'
                : 'Securely stored verified certificates for automatic cross-service application auto-filling.'}
            </p>
          </div>

          <button className="px-4 py-2.5 bg-gov-700 hover:bg-gov-800 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-sm transition-colors">
            <Upload className="w-4 h-4" />
            <span>{language === 'mr' ? 'नवीन प्रमाणपत्र अपलोड करा' : 'Upload New Certificate'}</span>
          </button>
        </div>

        {/* Document Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">{language === 'mr' ? 'दस्तऐवज प्रकार' : 'Document Type'}</th>
                <th className="py-3 px-4">{language === 'mr' ? 'फाइलचे नाव' : 'File Name'}</th>
                <th className="py-3 px-4">{language === 'mr' ? 'अपलोड तारीख' : 'Uploaded Date'}</th>
                <th className="py-3 px-4">{language === 'mr' ? 'पडताळणी स्थिती' : 'Verification Status'}</th>
                <th className="py-3 px-4 text-right">{language === 'mr' ? 'कृती' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {documents.map((doc, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {language === 'mr' && docTypeTranslationsMr[doc.type] ? docTypeTranslationsMr[doc.type] : doc.type}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">{doc.name}</td>
                  <td className="py-3.5 px-4 text-slate-500">{doc.uploadedAt}</td>
                  <td className="py-3.5 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 space-x-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>{language === 'mr' ? 'पडताळणी झाली' : doc.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button className="p-1 text-slate-500 hover:text-gov-700" title={language === 'mr' ? 'पहा' : 'View Document'}>
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-slate-500 hover:text-gov-700" title={language === 'mr' ? 'डाउनलोड करा' : 'Download'}>
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default DocumentsPage;
