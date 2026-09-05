import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, Database, ArrowLeftRight, CheckCircle, RefreshCw, Cpu, Layers, Sparkles } from 'lucide-react';

const DataMapperVisualizer = () => {
  const [mappingData, setMappingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSource, setSelectedSource] = useState(0);
  const [selectedTarget, setSelectedTarget] = useState(0);
  const { language } = useLanguage();

  useEffect(() => {
    fetchMappingDemo();
  }, []);

  const fetchMappingDemo = async () => {
    try {
      const res = await API.get('/mapping/demo');
      if (res.data.success) {
        setMappingData(res.data);
      }
    } catch (err) {
      console.error('Failed to load mapping demo:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-center bg-white rounded-xl shadow-sm border border-slate-200">
        <RefreshCw className="w-8 h-8 text-gov-600 animate-spin mx-auto mb-2" />
        <p className="text-sm font-medium text-slate-600">
          {language === 'mr' ? 'आंतरकार्यक्षमता मॅपिंग इंजिन लोड करत आहे...' : 'Loading Interoperability Mapping Engine...'}
        </p>
      </div>
    );
  }

  if (!mappingData) return null;

  const currentSource = mappingData.sources[selectedSource];
  const currentTarget = mappingData.targets[selectedTarget];

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-gradient-to-r from-gov-900 via-gov-800 to-slate-900 text-white rounded-xl p-6 shadow-md border border-gov-700">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <ArrowLeftRight className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl font-bold tracking-tight">
                {language === 'mr' 
                  ? 'डेटा आंतरकार्यक्षमता व क्षेत्र मानकीकरण इंजिन' 
                  : 'Data Interoperability & Field Standardization Engine'}
              </h2>
            </div>
            <p className="text-slate-300 text-xs mt-1 max-w-3xl">
              {language === 'mr'
                ? 'सिव्हिकब्रिज AI विविध शासकीय विभागांच्या विसंगत फील्ड नावांना एकाच प्रमाणित नागरिक डेटा मॉडेलमध्ये रूपांतरित करून अर्ज कसे स्वयंचलित भरते याचे प्रात्यक्षिक.'
                : 'Demonstrating how CivicBridge AI transforms non-standardized field names from independent legacy government APIs into a normalized Common Citizen Data Model, automatically auto-filling target department applications.'}
            </p>
          </div>
          <span className="hidden sm:inline-flex bg-amber-500/20 text-amber-300 border border-amber-400/40 text-xs font-mono px-3 py-1 rounded-full">
            {language === 'mr' ? 'परस्परसंवादी प्रात्यक्षिक' : 'Judge Interactive Visualizer'}
          </span>
        </div>
      </div>

      {/* Source & Target Selector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            {language === 'mr' ? 'स्रोत शासकीय API निवडा' : 'Select Source Government API'}
          </label>
          <div className="flex flex-wrap gap-2">
            {mappingData.sources.map((src, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedSource(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${selectedSource === idx ? 'bg-gov-700 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                {src.name.split(' (')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            {language === 'mr' ? 'लक्षित शासकीय विभाग अर्ज निवडा' : 'Select Target Department Application'}
          </label>
          <div className="flex flex-wrap gap-2">
            {mappingData.targets.map((tgt, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedTarget(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${selectedTarget === idx ? 'bg-indigo-700 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                {tgt.department.split(' (')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3-Column Interactive Flow: SOURCE -> COMMON MODEL -> TARGET */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMN 1: SOURCE SYSTEM RAW DATA */}
        <div className="bg-white rounded-xl border border-amber-200 shadow-sm overflow-hidden flex flex-col">
          <div className="bg-amber-50 border-b border-amber-200 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-amber-900 font-bold text-sm">
              <Database className="w-4 h-4 text-amber-600" />
              <span>{language === 'mr' ? 'स्रोत यंत्रणा:' : 'SOURCE:'} {currentSource.name}</span>
            </div>
            <span className="text-[10px] font-mono bg-amber-200 text-amber-900 px-2 py-0.5 rounded">
              {language === 'mr' ? 'मूळ डेटा पेलोड' : 'Raw Payload'}
            </span>
          </div>

          <div className="p-4 flex-1 space-y-3 font-mono text-xs">
            <p className="text-[11px] text-slate-500 font-sans italic">
              {language === 'mr' ? 'विभागानुसार विसंगत फील्ड नावे पहा:' : 'Notice heterogeneous legacy field names'} (उदा. <code className="bg-slate-100 px-1 text-slate-800">{Object.keys(currentSource.rawData)[2]}</code>)
            </p>
            <div className="bg-slate-900 text-emerald-400 p-3 rounded-lg overflow-x-auto text-[11px] leading-relaxed shadow-inner">
              <pre>{JSON.stringify(currentSource.rawData, null, 2)}</pre>
            </div>
          </div>
        </div>

        {/* COLUMN 2: COMMON DATA MODEL & MAPPING TRANSFORM */}
        <div className="bg-white rounded-xl border border-gov-300 shadow-md overflow-hidden flex flex-col relative">
          <div className="bg-gov-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2 font-bold text-sm">
              <Cpu className="w-4 h-4 text-amber-300" />
              <span>{language === 'mr' ? 'सामान्य नागरिक डेटा मॉडेल' : 'COMMON DATA MODEL'}</span>
            </div>
            <span className="text-[10px] font-mono bg-gov-900 text-amber-300 px-2 py-0.5 rounded border border-gov-600">
              {language === 'mr' ? 'प्रमाणित डेटा रचना' : 'Standardized Schema'}
            </span>
          </div>

          <div className="p-4 flex-1 space-y-3">
            <div className="bg-gov-50 border border-gov-200 p-3 rounded-lg text-xs space-y-2">
              <div className="flex items-center space-x-1.5 text-gov-800 font-semibold">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>{language === 'mr' ? 'क्षेत्र मानकीकरण सक्रिय' : 'Field Standardization Active'}</span>
              </div>
              <div className="text-[11px] text-slate-600 space-y-1">
                {Object.entries(currentSource.fieldMap).map(([rawKey, stdKey], i) => (
                  <div key={i} className="flex items-center justify-between font-mono bg-white p-1.5 rounded border border-slate-200">
                    <span className="text-rose-600">{rawKey}</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                    <span className="text-emerald-700 font-bold">{stdKey}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 text-amber-300 p-3 rounded-lg overflow-x-auto text-[11px] font-mono leading-relaxed shadow-inner">
              <pre>{JSON.stringify(mappingData.commonDataModel, null, 2)}</pre>
            </div>
          </div>
        </div>

        {/* COLUMN 3: TARGET DEPARTMENT AUTO-FILLED PAYLOAD */}
        <div className="bg-white rounded-xl border border-indigo-200 shadow-sm overflow-hidden flex flex-col">
          <div className="bg-indigo-50 border-b border-indigo-200 p-4 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-indigo-900 font-bold text-sm">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>{language === 'mr' ? 'लक्षित विभाग:' : 'TARGET:'} {currentTarget.department}</span>
            </div>
            <span className="text-[10px] font-mono bg-indigo-200 text-indigo-900 px-2 py-0.5 rounded">
              {language === 'mr' ? 'स्वयंचलित भरलेले' : 'Auto-Filled'}
            </span>
          </div>

          <div className="p-4 flex-1 space-y-3 font-mono text-xs">
            <p className="text-[11px] text-slate-500 font-sans italic">
              {language === 'mr' 
                ? 'लक्षित विभागाच्या अर्जासाठी आवश्यक त्या रचनेत अचूक रूपांतरीत.'
                : 'Mapped into target application requirement format seamlessly.'}
            </p>
            <div className="bg-slate-900 text-indigo-300 p-3 rounded-lg overflow-x-auto text-[11px] leading-relaxed shadow-inner">
              <pre>{JSON.stringify(currentTarget.payload, null, 2)}</pre>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DataMapperVisualizer;
