import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Menu, 
  X, 
  ChevronRight, 
  Filter, 
  Info, 
  Phone, 
  Mail, 
  MapPin,
  ArrowRight,
  Check
} from 'lucide-react';

interface Tile {
  id: number;
  name: string;
  category: string;
  size: string;
  finish: string;
  image_url: string;
  description: string;
}

const Logo = ({ className = "h-10" }: { className?: string }) => (
  <div className={`flex flex-col items-center ${className}`}>
    <div className="flex items-baseline gap-0.5">
      <span className="text-4xl font-black italic tracking-tighter flex items-center">
        <span className="text-5xl mr-[-4px]">B</span>rand
        <span className="relative">
          i<span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-[#f27d26] rounded-full"></span>
        </span>
        x
      </span>
    </div>
    <div className="flex items-center w-full gap-2 -mt-1">
      <div className="h-[1px] flex-1 bg-black"></div>
      <span className="text-sm font-serif tracking-[0.2em] uppercase">Ceramic</span>
      <div className="h-[1px] flex-1 bg-black"></div>
    </div>
  </div>
);

export default function App() {
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);
  const [calculator, setCalculator] = useState({ width: 0, length: 0, tileSize: 0.36 }); // Default 60x60cm
  const [calcResult, setCalcResult] = useState<number | null>(null);

  const calculateTiles = () => {
    if (calculator.width > 0 && calculator.length > 0) {
      const area = calculator.width * calculator.length;
      const tilesNeeded = Math.ceil(area / calculator.tileSize);
      const withWastage = Math.ceil(tilesNeeded * 1.1); // 10% wastage
      setCalcResult(withWastage);
    }
  };

  useEffect(() => {
    fetch('/api/tiles')
      .then(res => res.json())
      .then(data => {
        setTiles(data);
        setLoading(false);
      });
  }, []);

  const categories = ['All', ...new Set(tiles.map(t => t.category))];

  const filteredTiles = tiles.filter(tile => {
    const matchesSearch = tile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tile.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || tile.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInquiry = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');
    const projectType = formData.get('projectType');
    const message = formData.get('message');

    const whatsappMsg = `*New Inquiry from Brandix Ceramic Website*%0A%0A*Name:* ${name}%0A*Email:* ${email}%0A*Project:* ${projectType}%0A*Message:* ${message}`;
    
    window.open(`https://wa.me/917016753977?text=${whatsappMsg}`, '_blank');
    
    setInquirySent(true);
    setTimeout(() => setInquirySent(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#fdfcfb] text-[#2d2a26] font-sans">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#e5e1da]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Logo className="h-12 scale-75 origin-left" />
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-lg font-serif italic">
              <button 
                onClick={() => setIsCatalogOpen(true)}
                className="hover:text-[#8b7e6a] transition-colors"
              >
                Our Collection
              </button>
              <a href="#calculator" className="hover:text-[#8b7e6a] transition-colors">Showroom</a>
              <a href="#contact" className="hover:text-[#8b7e6a] transition-colors">About</a>
              <a href="#contact" className="hover:text-[#8b7e6a] transition-colors">Contact</a>
            </div>

            <div className="flex items-center gap-4">
              <button className="md:hidden p-2 hover:bg-[#f5f2ed] rounded-full">
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/glossy-2023/1920/1080" 
            alt="Glossy Collection 2023" 
            className="w-full h-full object-cover brightness-50"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-3xl text-white"
          >
            <div className="inline-block px-4 py-1 border border-white/30 rounded-full text-[10px] uppercase tracking-[0.3em] mb-6 backdrop-blur-sm">
              Glossy Collection 2023
            </div>
            <h1 className="text-6xl md:text-8xl font-serif italic mb-8 leading-[0.9]">
              The New <br /> <span className="text-[#d4c5b0]">Glossy</span> Standard.
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-10 font-light max-w-xl leading-relaxed">
              Experience the 300 x 450 MM collection. 
              Where technological innovation meets artisanal craft.
            </p>
            <div className="flex flex-wrap gap-6">
              <button 
                onClick={() => setIsCatalogOpen(true)}
                className="bg-white text-[#2d2a26] px-10 py-5 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-[#d4c5b0] transition-all flex items-center gap-3 shadow-2xl"
              >
                View Catalog <ArrowRight size={18} />
              </button>
              <button 
                onClick={() => document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth' })}
                className="border border-white/40 backdrop-blur-md text-white px-10 py-5 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-white/10 transition-all"
              >
                Tile Calculator
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-12 border-b border-[#e5e1da]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
            <div>
              <p className="text-3xl font-serif italic mb-1">25+</p>
              <p className="text-[10px] uppercase tracking-widest text-[#8b7e6a] font-bold">Years Experience</p>
            </div>
            <div>
              <p className="text-3xl font-serif italic mb-1">500+</p>
              <p className="text-[10px] uppercase tracking-widest text-[#8b7e6a] font-bold">Designs</p>
            </div>
            <div>
              <p className="text-3xl font-serif italic mb-1">10k+</p>
              <p className="text-[10px] uppercase tracking-widest text-[#8b7e6a] font-bold">Happy Clients</p>
            </div>
            <div>
              <p className="text-3xl font-serif italic mb-1">Fast</p>
              <p className="text-[10px] uppercase tracking-widest text-[#8b7e6a] font-bold">Local Delivery</p>
            </div>
            <div>
              <p className="text-3xl font-serif italic mb-1">Global</p>
              <p className="text-[10px] uppercase tracking-widest text-[#8b7e6a] font-bold">Export Reach</p>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Section */}
      <section id="catalog" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div>
            <h2 className="text-4xl font-serif italic mb-2 uppercase tracking-tight">Our Premium Collection</h2>
            <p className="text-[#8b7e6a] uppercase text-xs tracking-[0.2em] font-bold">Browse by category or search</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8b7e6a]" size={16} />
              <input 
                type="text" 
                placeholder="Search tiles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-[#e5e1da] rounded-full text-sm focus:outline-none focus:border-[#8b7e6a] w-64"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all ${
                    selectedCategory === cat 
                    ? 'bg-[#8b7e6a] text-white' 
                    : 'bg-white border border-[#e5e1da] text-[#8b7e6a] hover:border-[#8b7e6a]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="animate-pulse">
                <div className="bg-[#f5f2ed] aspect-square rounded-2xl mb-4"></div>
                <div className="h-4 bg-[#f5f2ed] w-3/4 rounded mb-2"></div>
                <div className="h-4 bg-[#f5f2ed] w-1/2 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredTiles.map((tile) => (
                <motion.div
                  layout
                  key={tile.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ y: -4 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedTile(tile)}
                >
                  <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#f5f2ed] mb-4">
                    <img 
                      src={tile.image_url} 
                      alt={tile.name} 
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 right-4">
                      <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                        {tile.category}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-lg font-serif italic mb-1">{tile.name}</h3>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-[#8b7e6a]">{tile.size} • {tile.finish}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* Tile Detail Modal */}
      <AnimatePresence>
        {selectedTile && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTile(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              layoutId={`tile-${selectedTile.id}`}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              <button 
                onClick={() => setSelectedTile(null)}
                className="absolute top-6 right-6 z-10 p-2 bg-white/80 backdrop-blur-md rounded-full hover:bg-white transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="w-full md:w-1/2 aspect-square md:aspect-auto">
                <img 
                  src={selectedTile.image_url} 
                  alt={selectedTile.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto max-h-[70vh] md:max-h-none">
                <span className="text-[#8b7e6a] uppercase text-[10px] font-bold tracking-[0.2em] mb-4 block">
                  {selectedTile.category} Collection
                </span>
                <h2 className="text-4xl font-serif italic mb-8">{selectedTile.name}</h2>
                
                <div className="space-y-6 mb-12">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-[#fdfcfb] border border-[#e5e1da] rounded-xl">
                      <p className="text-[10px] uppercase text-[#8b7e6a] font-bold mb-1">Dimensions</p>
                      <p className="font-medium">{selectedTile.size}</p>
                    </div>
                    <div className="p-4 bg-[#fdfcfb] border border-[#e5e1da] rounded-xl">
                      <p className="text-[10px] uppercase text-[#8b7e6a] font-bold mb-1">Finish</p>
                      <p className="font-medium">{selectedTile.finish}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-[#8b7e6a] font-bold mb-2">Description</p>
                    <p className="text-[#5a5651] leading-relaxed">{selectedTile.description}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button 
                    onClick={() => {
                      const whatsappMsg = `*Inquiry for ${selectedTile.name}* (${selectedTile.size})%0A%0AI would like to know more about this design.`;
                      window.open(`https://wa.me/917016753977?text=${whatsappMsg}`, '_blank');
                    }}
                    className="flex-1 bg-[#2d2a26] text-white py-4 rounded-full font-medium hover:bg-black transition-all flex items-center justify-center gap-2"
                  >
                    Inquiry via WhatsApp
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Tile Calculator Section */}
      <section id="calculator" className="py-24 bg-white border-y border-[#e5e1da]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#fdfcfb] rounded-[3rem] p-8 md:p-16 border border-[#e5e1da] flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-4xl font-serif italic mb-6">Smart Tile Calculator</h2>
              <p className="text-[#5a5651] mb-8 leading-relaxed">
                Not sure how many tiles you need? Enter your room dimensions below, and we'll calculate the exact quantity required, including a recommended 10% wastage buffer.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#8b7e6a] mb-2">Room Width (meters)</label>
                  <input 
                    type="number" 
                    value={calculator.width || ''} 
                    onChange={(e) => setCalculator({...calculator, width: parseFloat(e.target.value)})}
                    className="w-full px-4 py-4 bg-white border border-[#e5e1da] rounded-2xl focus:outline-none focus:border-[#8b7e6a]" 
                    placeholder="e.g. 4.5"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#8b7e6a] mb-2">Room Length (meters)</label>
                  <input 
                    type="number" 
                    value={calculator.length || ''} 
                    onChange={(e) => setCalculator({...calculator, length: parseFloat(e.target.value)})}
                    className="w-full px-4 py-4 bg-white border border-[#e5e1da] rounded-2xl focus:outline-none focus:border-[#8b7e6a]" 
                    placeholder="e.g. 6.0"
                  />
                </div>
              </div>
              <button 
                onClick={calculateTiles}
                className="w-full md:w-auto bg-[#2d2a26] text-white px-12 py-5 rounded-full font-bold uppercase text-xs tracking-widest hover:bg-black transition-all"
              >
                Calculate Now
              </button>
            </div>
            
            <div className="lg:w-1/2 w-full">
              <div className="bg-[#8b7e6a] text-white p-12 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-serif italic mb-8 opacity-80 text-center">Estimation Result</h3>
                  <div className="text-center">
                    <p className="text-7xl font-serif italic mb-2">{calcResult || '0'}</p>
                    <p className="text-xs uppercase tracking-[0.3em] font-bold opacity-60">Total Tiles Required</p>
                  </div>
                  <div className="mt-12 pt-8 border-t border-white/20 grid grid-cols-2 gap-8 text-center">
                    <div>
                      <p className="text-sm font-bold">{(calculator.width * calculator.length).toFixed(2)} m²</p>
                      <p className="text-[10px] uppercase opacity-60">Total Area</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold">10%</p>
                      <p className="text-[10px] uppercase opacity-60">Wastage Buffer</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-[#f5f2ed]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl font-serif italic mb-6">About Our <br /> Glossy Collection.</h2>
              <p className="text-[#5a5651] mb-12 max-w-md">
                The ceramic wall tiles market is witnessing huge growth. Our company's expansion is driven by technological changes involving process invention and adoption in the ceramic industry.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-xl border border-[#e5e1da]">
                    <MapPin size={20} className="text-[#8b7e6a]" />
                  </div>
                  <div>
                    <p className="font-bold uppercase text-[10px] tracking-widest text-[#8b7e6a] mb-1">Showroom</p>
                    <p className="text-sm">Latest Business Center, Shop No. 311, Third Floor,<br />Near Mahendranagar Chowkdi, Morbi, Gujarat-363642.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-xl border border-[#e5e1da]">
                    <Phone size={20} className="text-[#8b7e6a]" />
                  </div>
                  <div>
                    <p className="font-bold uppercase text-[10px] tracking-widest text-[#8b7e6a] mb-1">Call Us (Rutvik Patel)</p>
                    <p className="text-sm">+91 76220 46777<br />+91 70167 53977</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white rounded-xl border border-[#e5e1da]">
                    <Mail size={20} className="text-[#8b7e6a]" />
                  </div>
                  <div>
                    <p className="font-bold uppercase text-[10px] tracking-widest text-[#8b7e6a] mb-1">Email</p>
                    <p className="text-sm">brandixceramic@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-[#e5e1da]">
              <form onSubmit={handleInquiry} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#8b7e6a] mb-2">Full Name</label>
                    <input name="name" type="text" required className="w-full px-4 py-3 bg-[#fdfcfb] border border-[#e5e1da] rounded-xl focus:outline-none focus:border-[#8b7e6a]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-[#8b7e6a] mb-2">Email Address</label>
                    <input name="email" type="email" required className="w-full px-4 py-3 bg-[#fdfcfb] border border-[#e5e1da] rounded-xl focus:outline-none focus:border-[#8b7e6a]" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#8b7e6a] mb-2">Project Type</label>
                  <select name="projectType" className="w-full px-4 py-3 bg-[#fdfcfb] border border-[#e5e1da] rounded-xl focus:outline-none focus:border-[#8b7e6a]">
                    <option>Residential Renovation</option>
                    <option>Commercial Project</option>
                    <option>New Build</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-[#8b7e6a] mb-2">Message</label>
                  <textarea name="message" rows={4} required className="w-full px-4 py-3 bg-[#fdfcfb] border border-[#e5e1da] rounded-xl focus:outline-none focus:border-[#8b7e6a]"></textarea>
                </div>
                <button 
                  type="submit"
                  disabled={inquirySent}
                  className={`w-full py-4 rounded-full font-medium transition-all flex items-center justify-center gap-2 ${
                    inquirySent ? 'bg-green-500 text-white' : 'bg-[#2d2a26] text-white hover:bg-black'
                  }`}
                >
                  {inquirySent ? (
                    <><Check size={18} /> Inquiry Sent!</>
                  ) : (
                    'Send Inquiry'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Modal */}
      <AnimatePresence>
        {isCatalogOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCatalogOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-5xl bg-white rounded-[2rem] overflow-hidden shadow-2xl flex flex-col h-[90vh]"
            >
              <div className="p-6 border-b border-[#e5e1da] flex justify-between items-center bg-white sticky top-0 z-10">
                <div>
                  <h2 className="text-2xl font-serif italic">Digital Catalog</h2>
                  <p className="text-xs text-[#8b7e6a] uppercase tracking-widest mt-1">Glossy & Parking Collections</p>
                </div>
                <button onClick={() => setIsCatalogOpen(false)} className="p-2 hover:bg-[#f5f2ed] rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 space-y-12 bg-[#fdfcfb]">
                {[
                  { 
                    title: "Wall Tiles (300x450mm)", 
                    category: "Wall", 
                    items: [
                      { name: "Blue Marble Glossy", seed: "blue-marble-tile" },
                      { name: "Design 31096 Set", seed: "marble-set-tile" }
                    ] 
                  },
                  { 
                    title: "Marble Collection (600x1200mm)", 
                    category: "Marble", 
                    items: [
                      { name: "Design 113 (E)", seed: "large-marble-tile" }
                    ] 
                  },
                  { 
                    title: "Parking Tiles", 
                    category: "Parking", 
                    items: [
                      { name: "Pearl-11211 (400x400)", seed: "pearl-11211" },
                      { name: "Grey Grid Punch", seed: "grey-grid-tile" },
                      { name: "Grey Stone Waves", seed: "stone-waves-tile" },
                      { name: "Brown Textured Stone", seed: "brown-stone-tile" }
                    ] 
                  }
                ].map((cat) => (
                  <section key={cat.category}>
                    <h3 className="text-xl font-serif italic mb-6 border-b border-[#e5e1da] pb-2">{cat.title}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {cat.items.map(item => (
                        <div key={item.seed} className="aspect-[3/4] bg-white rounded-xl shadow-sm border border-[#e5e1da] overflow-hidden group relative">
                          <img 
                            src={`https://picsum.photos/seed/${item.seed}/600/800`} 
                            alt={item.name} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="text-white text-xs font-bold uppercase tracking-widest">{item.name}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                ))}
              </div>

              <div className="p-6 border-t border-[#e5e1da] bg-white flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-[#5a5651]">Contact us for the full high-resolution PDF catalog.</p>
                <button 
                  onClick={() => window.open(`https://wa.me/917016753977?text=I would like to receive the full PDF catalog.`, '_blank')}
                  className="bg-[#2d2a26] text-white px-8 py-3 rounded-full font-medium hover:bg-black transition-all flex items-center gap-2"
                >
                  Request Full PDF <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-[#2d2a26] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <Logo className="h-10 scale-75 origin-left invert" />
            </div>
            <div className="flex gap-8 text-xs uppercase tracking-widest text-white/50">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Shipping Info</a>
            </div>
            <p className="text-xs text-white/30">© 2026 Brandix Ceramic. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
