import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, ChevronLeft, ChevronRight, Filter, ArrowUpDown, X, User, Mail, Phone, Building, Briefcase, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://crm-project-4.onrender.com/api";

interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: string;
  notes: string;
  createdAt: string;
}

const STATUSES = ['New', 'Qualified', 'Contacted', 'Converted', 'Lost'];

const STATUS_COLORS: Record<string, string> = {
  New: 'border-blue-400/50 bg-blue-500/20 text-blue-200',
  Qualified: 'border-purple-400/50 bg-purple-500/20 text-purple-200',
  Contacted: 'border-amber-400/50 bg-amber-500/20 text-amber-200',
  Converted: 'border-emerald-400/50 bg-emerald-500/20 text-emerald-200',
  Lost: 'border-rose-400/50 bg-rose-500/20 text-rose-200'
};

const STAT_ICONS: Record<string, React.ReactNode> = {
  New: <User size={24} className="text-blue-300" />,
  Qualified: <Briefcase size={24} className="text-purple-300" />,
  Contacted: <Mail size={24} className="text-amber-300" />,
  Converted: <Building size={24} className="text-emerald-300" />,
  Lost: <Trash2 size={24} className="text-rose-300" />
};

export default function App() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [total, setTotal] = useState(0);
  
  // Controls state
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [order, setOrder] = useState<'desc'|'asc'>('desc');
  const [page, setPage] = useState(1);
  const limit = 10;

  // UI state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  // Form state
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', company: '', status: 'New', notes: '' });

  const carouselImages = [
    { url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80', title: 'Empower Your Network', sub: 'Transform connections into lasting partnerships' },
    { url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80', title: 'Data-Driven Insights', sub: 'Make informed decisions with real-time analytics' },
    { url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80', title: 'Collaborate Seamlessly', sub: 'Align your team around a single source of truth' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide(p => (p + 1) % carouselImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  const fetchData = async () => {
  try {
    const qs = new URLSearchParams({
      search,
      status: statusFilter,
      sortBy,
      order,
      page: page.toString(),
      limit: limit.toString(),
    });

    const leadsRes = await fetch(`${API_URL}/leads?${qs}`);

    const leadsData = await leadsRes.json();

    setLeads(leadsData.leads || []);
    setTotal(leadsData.total || 0);

    // safe fallback if stats route doesn't exist
    const statsRes = await fetch(`${API_URL}/leads/stats`).catch(() => null);

    if (statsRes && statsRes.ok) {
      const statsData = await statsRes.json();
      setStats(statsData || {});
    }
  } catch (err) {
    console.error("Failed to fetch data", err);
  }
};

  useEffect(() => {
    fetchData();
  }, [search, statusFilter, sortBy, order, page]);
const handleSave = async (e: React.FormEvent) => {
  e.preventDefault();

  const method = editingLead ? "PUT" : "POST";
  const url = editingLead
    ? `${API_URL}/leads/${editingLead._id}`
    : `${API_URL}/leads`;

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Failed to save lead");
      return;
    }

    setIsModalOpen(false);
    setEditingLead(null);

    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      status: "New",
      notes: "",
    });

    fetchData();
  } catch (err) {
    console.error("Network error:", err);
    alert("Backend not reachable");
  }
};

  const handleDelete = async (id: string) => {
    if(!confirm('Are you sure you want to delete this lead?')) return;
    try {
      await fetch(`${API_URL}/leads/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  const openForm = (lead?: Lead) => {
    if (lead) {
      setEditingLead(lead);
      setFormData({ name: lead.name, email: lead.email, phone: lead.phone, company: lead.company, status: lead.status, notes: lead.notes || '' });
    } else {
      setEditingLead(null);
      setFormData({ name: '', email: '', phone: '', company: '', status: 'New', notes: '' });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-purple-500/30">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px]" />
        <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-emerald-600/10 blur-[100px]" />
      </div>

      {/* Hero Carousel */}
      <div className="relative h-[250px] md:h-[400px] w-full overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={activeSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-0"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-slate-950 z-10" />
            <img src={carouselImages[activeSlide].url} alt="Hero" className="object-cover w-full h-full" />
            
            <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center p-4 pt-10">
              <motion.h1 
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
                className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-indigo-100 drop-shadow-sm mb-4"
              >
                {carouselImages[activeSlide].title}
              </motion.h1>
              <motion.p 
                initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
                className="text-lg md:text-xl text-slate-300 max-w-2xl font-light"
              >
                {carouselImages[activeSlide].sub}
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Carousel Indicators */}
        <div className="absolute bottom-16 md:bottom-24 left-0 right-0 flex justify-center gap-2 z-20">
          {carouselImages.map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === activeSlide ? 'w-8 bg-purple-400' : 'w-4 bg-white/30'}`} />
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 -mt-16 md:-mt-24 pb-20">
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-8">
          {STATUSES.map(stat => (
             <div 
               key={stat} 
               onClick={() => { setStatusFilter(prev => prev === stat ? '' : stat); setPage(1); }}
               className={`glass-panel cursor-pointer rounded-2xl p-4 flex flex-col items-center sm:items-start text-center sm:text-left transition-all duration-300 hover:-translate-y-1 ${statusFilter === stat ? 'ring-2 ring-purple-400 bg-white/20 shadow-[0_0_20px_rgba(168,85,247,0.3)]' : ''}`}
             >
               <div className="flex items-center gap-3 w-full justify-center sm:justify-start mb-2">
                 <div className={`p-2 rounded-full border ${STATUS_COLORS[stat]} bg-opacity-10 backdrop-blur-md`}>
                   {STAT_ICONS[stat]}
                 </div>
                 <h3 className="text-slate-400 text-sm hidden sm:block font-medium uppercase tracking-wider">{stat}</h3>
               </div>
               <div className="flex flex-col sm:flex-row items-baseline gap-2 w-full justify-center sm:justify-start">
                   <h3 className="text-slate-400 text-xs sm:hidden font-medium uppercase tracking-wider">{stat}</h3>
                   <span className="text-3xl md:text-4xl font-bold text-white drop-shadow-md">{stats[stat] || 0}</span>
               </div>
             </div>
          ))}
        </div>

        {/* Controls Row */}
        <div className="glass-panel rounded-2xl p-2 md:p-3 mb-6 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex-1 relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-400 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search leads by name, email, or company..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2.5 glass-input rounded-xl"
            />
          </div>
          
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {statusFilter && (
              <button
                onClick={() => { setStatusFilter(''); setPage(1); }}
                className="glass-button px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 group text-sm font-medium border-rose-500/30 text-rose-200 hover:bg-rose-500/20"
              >
                <X size={16} /> All Leads
              </button>
            )}

            <div className="relative flex-1 md:w-56 border border-white/10 rounded-xl bg-black/20 overflow-hidden backdrop-blur-sm group hover:border-white/20 transition-colors">
              <select 
                value={`${sortBy}_${order}`} 
                onChange={(e) => { 
                  const [s, o] = e.target.value.split('_'); 
                  setSortBy(s); 
                  setOrder(o as 'asc'|'desc'); 
                  setPage(1); 
                }}
                className="w-full appearance-none bg-transparent py-2.5 pl-3 pr-8 text-white focus:outline-none cursor-pointer text-sm"
              >
                <option value="name_asc" className="bg-slate-800 text-white">Alphabetical (A to Z)</option>
                <option value="name_desc" className="bg-slate-800 text-white">Alphabetical (Z to A)</option>
                <option value="createdAt_desc" className="bg-slate-800 text-white">Newly Added</option>
                <option value="createdAt_asc" className="bg-slate-800 text-white">Oldest Added</option>
              </select>
              <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-hover:text-white transition-colors" size={16} />
            </div>

            <button 
              onClick={() => openForm()}
              className="bg-purple-600 hover:bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] hover:shadow-[0_0_25px_rgba(168,85,247,0.6)] text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 font-medium whitespace-nowrap"
            >
              <Plus size={18} /> <span className="hidden sm:inline">Add Lead</span>
            </button>
          </div>
        </div>

        {/* Desktop Table / Mobile Grid */}
        <div className="glass-panel rounded-2xl overflow-hidden mb-6">
          {/* Desktop View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 bg-black/20 text-xs uppercase tracking-wider text-slate-400 font-medium font-mono">
                  <th className="p-4 cursor-pointer hover:text-white" onClick={() => {setSortBy('name'); setOrder(order==='asc'?'desc':'asc')}}>Contact Info</th>
                  <th className="p-4 cursor-pointer hover:text-white" onClick={() => {setSortBy('company'); setOrder(order==='asc'?'desc':'asc')}}>Company</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 cursor-pointer hover:text-white" onClick={() => {setSortBy('createdAt'); setOrder(order==='asc'?'desc':'asc')}}>Added</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leads.map(lead => (
                  <tr key={lead._id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <div className="font-medium text-white group-hover:text-purple-300 transition-colors">{lead.name}</div>
                      <div className="text-sm text-slate-400 flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1"><Mail size={12}/>{lead.email}</span>
                        <span className="flex items-center gap-1"><Phone size={12}/>{lead.phone}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-slate-200">{lead.company}</div>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_COLORS[lead.status]}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-slate-400 flex items-center gap-1.5"><Calendar size={14}/> {format(new Date(lead.createdAt), 'MMM d, yyyy')}</div>
                    </td>
                    <td className="p-4 text-right overflow-hidden">
                      <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openForm(lead)} className="p-2 rounded-lg glass-button text-slate-300 hover:text-white hover:border-purple-400/50 group/edit" title="Edit">
                          <Edit2 size={16} className="group-hover/edit:scale-110 transition-transform"/>
                        </button>
                        <button onClick={() => handleDelete(lead._id)} className="p-2 rounded-lg glass-button text-slate-300 hover:text-white hover:border-rose-400/50 group/del" title="Delete">
                          <Trash2 size={16} className="group-hover/del:scale-110 transition-transform" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {leads.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-500 font-light">
                      No leads found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden divide-y divide-white/5">
            {leads.map(lead => (
              <div key={lead._id} className="p-4 hover:bg-white/5 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium text-white text-lg">{lead.name}</div>
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium border uppercase tracking-wider ${STATUS_COLORS[lead.status]}`}>
                    {lead.status}
                  </span>
                </div>
                <div className="space-y-1 mb-3 text-sm text-slate-300">
                  <div className="flex items-center gap-2"><Building size={14} className="text-slate-500"/> {lead.company}</div>
                  <div className="flex items-center gap-2"><Mail size={14} className="text-slate-500"/> {lead.email}</div>
                  <div className="flex items-center gap-2"><Phone size={14} className="text-slate-500"/> {lead.phone}</div>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="text-xs text-slate-500 flex items-center gap-1.5"><Calendar size={12}/> {format(new Date(lead.createdAt), 'MMM d, yy')}</div>
                  <div className="flex gap-2">
                    <button onClick={() => openForm(lead)} className="p-2 rounded-lg glass-button text-slate-300">
                      <Edit2 size={14} />
                    </button>
                    <button onClick={() => handleDelete(lead._id)} className="p-2 rounded-lg glass-button text-slate-300">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {leads.length === 0 && (
              <div className="p-8 text-center text-slate-500 font-light">
                No leads found.
              </div>
            )}
          </div>
        </div>

        {/* Pagination Controls */}
        {total > 0 && (
          <div className="flex justify-between items-center glass-panel px-4 py-3 rounded-xl text-sm">
            <span className="text-slate-400 font-medium">
              Showing <span className="text-white">{(page - 1) * limit + 1}</span> to <span className="text-white">{Math.min(page * limit, total)}</span> of <span className="text-white">{total}</span>
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg glass-button disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 pr-3"
              >
                <ChevronLeft size={16} /> Prev
              </button>
              <button 
                onClick={() => setPage(p => p + 1)}
                disabled={page * limit >= total}
                className="p-1.5 rounded-lg glass-button disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 pl-3"
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Glass Modal for Add/Edit */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
              className="relative w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-6 overflow-hidden"
            >
              {/* Modal Blur Decor */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/30 rounded-full blur-[60px]" />
              
              <div className="flex justify-between items-center mb-6 relative z-10">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-200">
                  {editingLead ? 'Edit Lead' : 'New Lead'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10">
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSave} className="space-y-4 relative z-10">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">Full Name *</label>
                  <input required type="text" className="w-full glass-input p-3" placeholder="Jane Doe" 
                    value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                     <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">Email *</label>
                     <input required type="email" className="w-full glass-input p-3" placeholder="jane@co.com" 
                       value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                     />
                  </div>
                  <div className="space-y-1">
                     <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">Phone *</label>
                     <input required type="tel" className="w-full glass-input p-3" placeholder="+1 (555)" 
                       value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                     />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                     <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">Company *</label>
                     <input required type="text" className="w-full glass-input p-3" placeholder="Acme Inc" 
                       value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})}
                     />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">Status</label>
                    <select className="w-full glass-input p-3 appearance-none cursor-pointer"
                      value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                    >
                      {STATUSES.map(s => <option key={s} value={s} className="bg-slate-800 text-white">{s}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                   <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider pl-1">Notes</label>
                   <textarea className="w-full glass-input p-3 h-24 resize-none" placeholder="Any additional context..." 
                     value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}
                   />
                </div>

                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-3 rounded-xl glass-button text-white font-medium">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] text-white font-medium transition-all duration-300">
                    Save Lead
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
