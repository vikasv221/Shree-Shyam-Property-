/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Phone, 
  MapPin, 
  Maximize2, 
  Trash2, 
  Edit2, 
  X, 
  Camera,
  MessageCircle,
  Filter,
  ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Plot } from './types';

const CONTACT_INFO = {
  mobile: "8302443961",
  whatsapp: "918302443961"
};

const INITIAL_PLOTS: Plot[] = [
  {
    id: '1',
    colony: 'New Diamond Colony',
    village: 'Arnod Road',
    area: '1000 sqft',
    price: '₹25,00,000',
    description: 'Prime location plot near the main road with all amenities.',
    photo: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800',
    createdAt: Date.now()
  },
  {
    id: '2',
    colony: 'Shyam Vihar',
    village: 'Pratapgarh',
    area: '1200 sqft',
    price: '₹18,50,000',
    description: 'Peaceful residential area, perfect for building your dream home.',
    photo: 'https://images.unsplash.com/photo-1524813685485-3de5f7eaad0c?auto=format&fit=crop&q=80&w=800',
    createdAt: Date.now() - 86400000
  }
];

export default function App() {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlot, setEditingPlot] = useState<Plot | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    colony: '',
    village: '',
    area: '',
    price: '',
    description: '',
    photo: ''
  });

  useEffect(() => {
    const savedPlots = localStorage.getItem('shyam_plots');
    if (savedPlots) {
      setPlots(JSON.parse(savedPlots));
    } else {
      setPlots(INITIAL_PLOTS);
      localStorage.setItem('shyam_plots', JSON.stringify(INITIAL_PLOTS));
    }
  }, []);

  const savePlots = (newPlots: Plot[]) => {
    setPlots(newPlots);
    localStorage.setItem('shyam_plots', JSON.stringify(newPlots));
  };

  const filteredPlots = useMemo(() => {
    return plots.filter(plot => 
      plot.colony.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plot.village.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plot.area.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [plots, searchTerm]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddOrEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPlot) {
      const updatedPlots = plots.map(p => 
        p.id === editingPlot.id ? { ...p, ...formData } : p
      );
      savePlots(updatedPlots);
    } else {
      const newPlot: Plot = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        createdAt: Date.now()
      };
      savePlots([newPlot, ...plots]);
    }
    closeModal();
  };

  const handleDelete = (id: string) => {
    if (window.confirm('क्या आप वाकई इस प्लॉट को हटाना चाहते हैं?')) {
      savePlots(plots.filter(p => p.id !== id));
    }
  };

  const openModal = (plot?: Plot) => {
    if (plot) {
      setEditingPlot(plot);
      setFormData({
        colony: plot.colony,
        village: plot.village,
        area: plot.area,
        price: plot.price,
        description: plot.description,
        photo: plot.photo
      });
    } else {
      setEditingPlot(null);
      setFormData({
        colony: '',
        village: '',
        area: '',
        price: '',
        description: '',
        photo: ''
      });
    }
    setIsModalOpen(true);
  };

  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPlot(null);
    setSelectedPlot(null);
  };

  const openViewModal = (plot: Plot) => {
    setSelectedPlot(plot);
    setIsModalOpen(false); // Ensure admin modal is closed
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 group cursor-pointer">
            <div className="relative">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-400 shadow-xl group-hover:scale-105 transition-transform duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=100" 
                  alt="Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full"></div>
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tighter text-slate-900 leading-none">
                SHREE <span className="text-orange-600">SHYAM</span>
              </h1>
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 mt-1">Premium Property</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <nav className="flex items-center gap-6 mr-6 border-r border-slate-200 pr-8">
              <a href="#" className="text-sm font-bold text-slate-900">Home</a>
              <a href="#plots" className="text-sm font-bold text-slate-500 hover:text-orange-600 transition-colors">Plots</a>
              <a href="#contact" className="text-sm font-bold text-slate-500 hover:text-orange-600 transition-colors">Contact</a>
            </nav>
            <a href={`tel:${CONTACT_INFO.mobile}`} className="flex items-center gap-2 text-slate-900 hover:text-orange-600 transition-colors font-bold">
              <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center text-orange-600">
                <Phone size={14} />
              </div>
              <span>{CONTACT_INFO.mobile}</span>
            </a>
            <button 
              onClick={() => setIsAdmin(!isAdmin)}
              className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                isAdmin 
                ? 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
                : 'bg-orange-600 text-white shadow-xl shadow-orange-200 hover:bg-orange-700'
              }`}
            >
              {isAdmin ? 'Admin Mode On' : 'Admin Login'}
            </button>
          </div>

          <div className="md:hidden">
            <button 
              onClick={() => setIsAdmin(!isAdmin)}
              className="p-2 text-slate-600"
            >
              <Edit2 size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 md:pt-32 md:pb-48 overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-orange-100/30 blur-[120px] rounded-full -z-10"></div>
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-100/20 blur-[100px] rounded-full -z-10"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm mb-8">
                  <span className="flex h-2 w-2 rounded-full bg-orange-600 animate-pulse"></span>
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">Premium Property Listings</span>
                </div>
                
                <h2 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tight leading-[0.9] mb-8">
                  आपके सपनों का <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">प्लॉट</span> <br />
                  <span className="text-3xl md:text-5xl block mt-4 font-bold text-slate-400">सिर्फ एक क्लिक दूर</span>
                </h2>
                
                <p className="text-xl text-slate-500 font-medium mb-12 max-w-2xl mx-auto leading-relaxed">
                  बेहतरीन लोकेशन पर अपने भविष्य का निवेश करें। हम आपको पारदर्शी और विश्वसनीय प्रॉपर्टी सेवाएं प्रदान करते हैं।
                </p>

                {/* Enhanced Search Bar */}
                <div className="max-w-3xl mx-auto relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-amber-500 rounded-[2.5rem] blur opacity-25 group-focus-within:opacity-50 transition duration-1000 group-focus-within:duration-200"></div>
                  <div className="relative flex items-center bg-white rounded-[2rem] shadow-2xl overflow-hidden p-2 border border-slate-100">
                    <div className="flex-grow flex items-center pl-6">
                      <Search className="text-orange-500" size={24} />
                      <input
                        type="text"
                        placeholder="Search by colony, village, or area..."
                        className="w-full px-4 py-5 bg-transparent focus:outline-none text-xl font-medium text-slate-900 placeholder:text-slate-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <button className="hidden sm:flex items-center gap-2 bg-slate-900 text-white px-8 py-5 rounded-[1.5rem] font-bold hover:bg-slate-800 transition-all active:scale-95">
                      Find Property
                      <ArrowRight size={20} />
                    </button>
                  </div>
                  
                  {/* Popular Tags */}
                  <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                    <span className="text-sm font-bold text-slate-400">Popular:</span>
                    {['New Diamond', 'Shyam Vihar', '1000 sqft', 'Pratapgarh'].map((tag) => (
                      <button 
                        key={tag}
                        onClick={() => setSearchTerm(tag)}
                        className="px-4 py-1.5 bg-slate-100 hover:bg-orange-50 hover:text-orange-600 rounded-full text-xs font-bold text-slate-500 transition-all"
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { label: 'Verified Plots', value: '500+' },
              { label: 'Happy Clients', value: '1200+' },
              { label: 'Years Exp.', value: '15+' },
              { label: 'Locations', value: '25+' },
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 md:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 text-center"
              >
                <p className="text-3xl md:text-4xl font-black text-slate-900 mb-1">{stat.value}</p>
                <p className="text-xs md:text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Plots Grid */}
        <section id="plots" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">उपलब्ध प्लॉट्स</h3>
              <p className="text-slate-500">{filteredPlots.length} प्लॉट्स मिले</p>
            </div>
            {isAdmin && (
              <button
                onClick={() => openModal()}
                className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all active:scale-95"
              >
                <Plus size={20} />
                नया प्लॉट जोड़ें
              </button>
            )}
          </div>

          {filteredPlots.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredPlots.map((plot) => (
                  <motion.div
                    key={plot.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200 transition-all duration-300"
                  >
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={plot.photo || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800'}
                        alt={plot.colony}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-slate-900 rounded-full text-xs font-bold shadow-sm">
                          {plot.area}
                        </span>
                      </div>
                      {isAdmin && (
                        <div className="absolute top-4 right-4 flex gap-2">
                          <button
                            onClick={() => openModal(plot)}
                            className="p-2 bg-white/90 backdrop-blur-sm text-blue-600 rounded-full hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(plot.id)}
                            className="p-2 bg-white/90 backdrop-blur-sm text-red-600 rounded-full hover:bg-red-600 hover:text-white transition-all shadow-sm"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-xl font-bold text-slate-900">{plot.colony}</h4>
                        <span className="text-orange-600 font-bold text-lg">{plot.price}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 text-sm mb-4">
                        <MapPin size={14} />
                        <span>{plot.village}</span>
                      </div>
                      <p className="text-slate-600 text-sm line-clamp-2 mb-6">
                        {plot.description || 'No description provided.'}
                      </p>
                      <div className="flex flex-col gap-3">
                        <button
                          onClick={() => openViewModal(plot)}
                          className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
                        >
                          <Maximize2 size={18} />
                          और जानकारी
                        </button>
                        <div className="flex items-center gap-3">
                          <a
                            href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=I am interested in the plot at ${plot.colony}, ${plot.village}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-grow flex items-center justify-center gap-2 bg-emerald-500 text-white py-3 rounded-xl font-bold hover:bg-emerald-600 transition-colors"
                          >
                            <MessageCircle size={18} />
                            WhatsApp
                          </a>
                          <a
                            href={`tel:${CONTACT_INFO.mobile}`}
                            className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
                          >
                            <Phone size={18} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                <Search size={32} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 mb-2">कोई प्लॉट नहीं मिला</h4>
              <p className="text-slate-500">कृपया अपनी खोज बदलें या बाद में प्रयास करें।</p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400">
                  <img 
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=100" 
                    alt="Logo" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h1 className="text-xl font-bold">SHREE <span className="text-orange-600">SHYAM</span></h1>
              </div>
              <p className="text-slate-400 leading-relaxed">
                हमारा उद्देश्य आपको आपके सपनों का घर बनाने के लिए सबसे उपयुक्त और किफायती प्लॉट उपलब्ध कराना है। विश्वास ही हमारी पहचान है।
              </p>
            </div>
            
            <div>
              <h5 className="text-lg font-bold mb-6">संपर्क जानकारी</h5>
              <ul className="space-y-4">
                <li className="flex items-center gap-3 text-slate-400">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-orange-500">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Mobile</p>
                    <p className="text-white font-medium">{CONTACT_INFO.mobile}</p>
                  </div>
                </li>
                <li className="flex items-center gap-3 text-slate-400">
                  <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-orange-500">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Location</p>
                    <p className="text-white font-medium">Pratapgarh, Rajasthan</p>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="text-lg font-bold mb-6">क्विक लिंक्स</h5>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="px-4 py-2 bg-slate-800 rounded-lg text-sm hover:bg-slate-700 transition-colors">Home</button>
                <a href={`tel:${CONTACT_INFO.mobile}`} className="px-4 py-2 bg-slate-800 rounded-lg text-sm hover:bg-slate-700 transition-colors">Contact</a>
                <a href={`https://wa.me/${CONTACT_INFO.whatsapp}`} className="px-4 py-2 bg-emerald-600/20 text-emerald-400 border border-emerald-600/30 rounded-lg text-sm hover:bg-emerald-600/30 transition-colors">WhatsApp</a>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-800 text-center text-slate-500 text-sm">
            <p>© {new Date().getFullYear()} Shree Shyam Property. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* View Details Modal */}
      <AnimatePresence>
        {selectedPlot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="absolute top-4 right-4 z-10">
                <button onClick={closeModal} className="p-2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full shadow-lg transition-all">
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col md:flex-row">
                <div className="md:w-1/2 h-64 md:h-auto">
                  <img
                    src={selectedPlot.photo || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800'}
                    alt={selectedPlot.colony}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="md:w-1/2 p-8">
                  <div className="mb-6">
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase mb-4 inline-block">
                      Plot Details
                    </span>
                    <h3 className="text-3xl font-bold text-slate-900 mb-2">{selectedPlot.colony}</h3>
                    <div className="flex items-center gap-2 text-slate-500 font-medium">
                      <MapPin size={18} />
                      <span>{selectedPlot.village}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Area</p>
                      <p className="text-lg font-bold text-slate-900">{selectedPlot.area}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Price</p>
                      <p className="text-lg font-bold text-orange-600">{selectedPlot.price}</p>
                    </div>
                  </div>

                  <div className="mb-8">
                    <p className="text-sm font-bold text-slate-700 mb-2">Description</p>
                    <p className="text-slate-600 leading-relaxed">
                      {selectedPlot.description || 'No additional details available for this plot.'}
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <a
                      href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=I am interested in the plot at ${selectedPlot.colony}, ${selectedPlot.village}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 bg-emerald-500 text-white py-4 rounded-2xl font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-200"
                    >
                      <MessageCircle size={20} />
                      WhatsApp
                    </a>
                    <a
                      href={`tel:${CONTACT_INFO.mobile}`}
                      className="flex-1 flex items-center justify-center gap-2 bg-orange-600 text-white py-4 rounded-2xl font-bold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200"
                    >
                      <Phone size={20} />
                      Call Now
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-2xl font-bold text-slate-900">
                  {editingPlot ? 'प्लॉट संपादित करें' : 'नया प्लॉट जोड़ें'}
                </h3>
                <button onClick={closeModal} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddOrEdit} className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">कॉलोनी का नाम</label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                      placeholder="e.g. New Diamond Colony"
                      value={formData.colony}
                      onChange={(e) => setFormData({ ...formData, colony: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">गांव / क्षेत्र</label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                      placeholder="e.g. Arnod Road"
                      value={formData.village}
                      onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">क्षेत्रफल (Area)</label>
                    <input
                      required
                      type="text"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                      placeholder="e.g. 1000 sqft"
                      value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">कीमत (Price)</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                      placeholder="e.g. ₹25,00,000"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">प्लॉट फोटो (Upload File or Album)</label>
                    <div className="flex items-center gap-4">
                      <label className="flex-grow flex items-center justify-center gap-2 px-4 py-4 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-all group">
                        <Camera className="text-slate-400 group-hover:text-orange-500" size={20} />
                        <span className="text-sm font-bold text-slate-500 group-hover:text-orange-600">
                          {formData.photo ? 'फोटो बदलें' : 'फोटो अपलोड करें'}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                      {formData.photo && (
                        <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200">
                          <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">या फोटो URL (Optional)</label>
                    <div className="relative">
                      <input
                        type="text"
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                        placeholder="https://images.unsplash.com/..."
                        value={formData.photo}
                        onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                      />
                      <Camera className="absolute left-3 top-3.5 text-slate-400" size={18} />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-8">
                  <label className="text-sm font-bold text-slate-700">विवरण (Description)</label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all resize-none"
                    placeholder="प्लॉट के बारे में कुछ जानकारी लिखें..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                  >
                    रद्द करें
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-4 bg-orange-600 text-white rounded-2xl font-bold shadow-lg shadow-orange-200 hover:bg-orange-700 transition-all active:scale-95"
                  >
                    {editingPlot ? 'अपडेट करें' : 'प्लॉट जोड़ें'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Contact Button (Mobile) */}
      <div className="md:hidden fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        <a
          href={`https://wa.me/${CONTACT_INFO.whatsapp}`}
          className="w-14 h-14 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-xl shadow-emerald-200 active:scale-90 transition-transform"
        >
          <MessageCircle size={28} />
        </a>
        <a
          href={`tel:${CONTACT_INFO.mobile}`}
          className="w-14 h-14 bg-orange-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-orange-200 active:scale-90 transition-transform"
        >
          <Phone size={24} />
        </a>
      </div>
    </div>
  );
}
