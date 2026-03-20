/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Label
} from 'recharts';
import {
  ShieldAlert, FileCode, Search, ChevronDown, Terminal, AlertCircle, Info,
  Code2, ShieldCheck, Zap, Copy, X
} from 'lucide-react';
import { useState, useMemo } from 'react';

interface Issue {
  file: string;
  line?: number;
  language?: string;
  severity: string;
  message: string;
  risk?: string;
  suggestion?: string;
  tool: string;
  snippet?: string;
}

interface AnalysisResult {
  status: string;
  total_files_found: number;
  total_files_scanned: number;
  issues: Issue[];
}

const SEVERITY_COLORS: Record<string, string> = {
  CRITICAL: '#be123c',
  HIGH: '#f43f5e',
  MEDIUM: '#fbbf24',
  LOW: '#38bdf8',
  INFO: '#94a3b8',
};

// Helper to normalize tool output to our 3 filter categories
const normalizeSeverity = (sev: string): "HIGH" | "MEDIUM" | "LOW" | "INFO" => {
  const s = sev.toUpperCase();
  if (s === 'CRITICAL' || s === 'HIGH' || s === 'ERROR') return 'HIGH';
  if (s === 'MEDIUM' || s === 'WARNING') return 'MEDIUM';
  if (s === 'LOW' || s === 'INFO') return 'LOW';
  return 'LOW';
};

export default function ResultsDashboard({ data }: { data: AnalysisResult }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeverity, setFilterSeverity] = useState<string | null>(null);
  
  const issues = data.issues || [];

  // --- FIXED FILTER LOGIC ---
  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      const matchesSearch = 
        issue.message.toLowerCase().includes(searchTerm.toLowerCase()) || 
        issue.file.toLowerCase().includes(searchTerm.toLowerCase());
      
      const normalizedIssueSev = normalizeSeverity(issue.severity);
      const matchesSeverity = filterSeverity ? normalizedIssueSev === filterSeverity : true;

      return matchesSearch && matchesSeverity;
    });
  }, [issues, searchTerm, filterSeverity]);

  // Data Normalization for Charts
  const { severityData, toolData, healthScore } = useMemo(() => {
    const sCounts = { HIGH: 0, MEDIUM: 0, LOW: 0 };
    const tCounts: Record<string, number> = {};

    issues.forEach((issue) => {
      const normalized = normalizeSeverity(issue.severity);
      sCounts[normalized as keyof typeof sCounts] += 1;

      const tool = issue.tool.split('-')[0].toUpperCase();
      tCounts[tool] = (tCounts[tool] || 0) + 1;
    });

    const sData = [
      { name: 'High', value: sCounts.HIGH, color: SEVERITY_COLORS.HIGH },
      { name: 'Medium', value: sCounts.MEDIUM, color: SEVERITY_COLORS.MEDIUM },
      { name: 'Low', value: sCounts.LOW, color: SEVERITY_COLORS.LOW },
    ].filter(d => d.value > 0);

    const tData = Object.entries(tCounts).map(([name, count]) => ({ name, count }));
    
    const penalty = (sCounts.HIGH * 15) + (sCounts.MEDIUM * 4);
    const score = issues.length === 0 ? 100 : Math.max(0, 100 - penalty);

    return { severityData: sData, toolData: tData, healthScore: score };
  }, [issues]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Files" value={data.total_files_found} icon={<FileCode size={20} />} color="text-slate-500 bg-slate-50" />
        <StatCard title="Analyzed" value={data.total_files_scanned} icon={<Search size={20} />} color="text-indigo-500 bg-indigo-50" />
        <StatCard title="Issues Found" value={issues.length} icon={<ShieldAlert size={20} />} color="text-rose-500 bg-rose-50" />
        <HealthStatCard value={healthScore} />
      </div>

      {issues.length > 0 ? (
        <>
          {/* CHARTS SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <ChartCard title="Risk Distribution">
              <div className="h-[250px] w-full">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={severityData} dataKey="value" innerRadius={60} outerRadius={85} paddingAngle={5} stroke="none">
                      {severityData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                      <Label value={issues.length} position="center" className="fill-slate-800 font-black text-2xl" />
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>

            <ChartCard title="Detection Sources" className="lg:col-span-2">
              <div className="h-[250px] w-full">
                <ResponsiveContainer>
                  <BarChart data={toolData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                    <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </div>

          {/* SEARCH & FILTER BAR */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-3xl border border-slate-200 shadow-sm">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                placeholder="Search by file or vulnerability..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
              {['HIGH', 'MEDIUM', 'LOW'].map((sev) => (
                <button
                  key={sev}
                  onClick={() => setFilterSeverity(filterSeverity === sev ? null : sev)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all border ${
                    filterSeverity === sev 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-lg' 
                    : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {sev}
                </button>
              ))}
              {filterSeverity && (
                <button onClick={() => setFilterSeverity(null)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg">
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* AUDIT LOG */}
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Security Audit Log</h3>
                <p className="text-xs text-slate-500 font-medium italic">
                  Showing {filteredIssues.length} of {issues.length} findings
                </p>
              </div>
            </div>
            <div className="divide-y divide-slate-100">
              {filteredIssues.map((issue, idx) => (
                <IssueAccordion 
                  key={idx} 
                  issue={issue} 
                  isOpen={openIndex === idx} 
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)} 
                />
              ))}
              {filteredIssues.length === 0 && (
                <div className="p-20 text-center text-slate-400 font-medium">
                  No issues match your current filters.
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}

// --- SUB-COMPONENTS ---

function StatCard({ title, value, icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-2xl transition-transform group-hover:scale-110 ${color}`}>
          {icon}
        </div>
        <div>
          <div className="text-2xl font-black text-slate-900 tracking-tight">{value}</div>
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</div>
        </div>
      </div>
    </div>
  );
}

function HealthStatCard({ value }: { value: number }) {
  const status = value > 85 ? 'Secure' : value > 60 ? 'Warning' : 'Critical';
  const color = value > 85 ? 'text-emerald-500' : value > 60 ? 'text-amber-500' : 'text-rose-500';
  
  return (
    <div className="bg-slate-900 p-6 rounded-3xl shadow-lg relative overflow-hidden group">
      <Zap size={60} className="absolute -right-4 -top-4 text-white/5 group-hover:rotate-12 transition-transform duration-500" />
      <div className="relative z-10">
        <div className="flex items-baseline gap-2">
           <div className={`text-2xl font-black ${color}`}>{value}%</div>
           <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">({status})</span>
        </div>
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Repository Health</div>
      </div>
    </div>
  );
}

function ChartCard({ title, children, className = "" }: any) {
  return (
    <div className={`bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm ${className}`}>
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">{title}</h3>
      {children}
    </div>
  );
}

function IssueAccordion({ issue, isOpen, onClick }: any) {
  const sev = normalizeSeverity(issue.severity);
  const config = sev === 'HIGH' 
    ? { text: "text-rose-600", border: "border-rose-100", icon: <AlertCircle size={18} /> }
    : sev === 'MEDIUM'
    ? { text: "text-amber-600", border: "border-amber-100", icon: <AlertCircle size={18} /> }
    : { text: "text-sky-600", border: "border-sky-100", icon: <Info size={18} /> };

  const copyToClipboard = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (issue.snippet) {
      navigator.clipboard.writeText(issue.snippet);
      alert("Snippet copied to clipboard!");
    }
  };

  return (
    <div className={`transition-all ${isOpen ? 'bg-indigo-50/30' : 'hover:bg-slate-50/50'}`}>
      <div className="p-6 cursor-pointer flex justify-between items-center gap-4" onClick={onClick}>
        <div className="flex items-start gap-4 flex-1">
          <div className={`mt-1 p-2 rounded-lg border bg-white shadow-sm ${config.text} ${config.border}`}>
            {config.icon}
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-slate-800 text-sm md:text-base leading-tight">{issue.message}</h4>
            <div className="flex flex-wrap gap-3 text-[10px] font-bold uppercase tracking-wider">
              <span className="text-slate-400 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md"><FileCode size={12}/> {issue.file.split('/').pop()}</span>
              {issue.line && <span className="text-slate-400 flex items-center gap-1 bg-slate-100 px-2 py-0.5 rounded-md"><Terminal size={12}/> Line {issue.line}</span>}
              <span className={`${config.text} bg-white border border-current px-2 py-0.5 rounded-md`}>{issue.tool}</span>
            </div>
          </div>
        </div>
        <ChevronDown size={20} className={`text-slate-300 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-500' : ''}`} />
      </div>

      {isOpen && (
        <div className="px-6 pb-8 ml-14 space-y-6 animate-in slide-in-from-top-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-2">
              <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Risk Analysis</span>
              <p className="text-sm text-slate-600 leading-relaxed font-medium">{issue.risk || "Pattern identified as potentially exploitable."}</p>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-2">
              <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Suggested Fix</span>
              <p className="text-sm text-slate-600 leading-relaxed font-medium italic">{issue.suggestion || "Review access controls or sanitize inputs."}</p>
            </div>
          </div>

          {issue.snippet && (
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-lg">
              <div className="bg-slate-800 px-4 py-3 flex justify-between items-center">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Code2 size={12} className="text-indigo-400" /> Source Context
                </span>
                <button 
                  onClick={copyToClipboard}
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-1 text-[10px] font-bold"
                >
                  <Copy size={12} /> Copy
                </button>
              </div>
              <pre className="bg-slate-900 p-5 overflow-x-auto text-[13px] font-mono text-indigo-100/90 leading-relaxed">
                <code>{issue.snippet}</code>
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-white border border-slate-100 rounded-[3rem] p-20 text-center shadow-xl">
      <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce shadow-inner">
        <ShieldCheck size={48} />
      </div>
      <h3 className="text-3xl font-black text-slate-900 mb-3">Codebase Secure</h3>
      <p className="text-slate-500 max-w-sm mx-auto font-medium text-lg leading-relaxed">
        No critical vulnerabilities found.
      </p>
    </div>
  );
}