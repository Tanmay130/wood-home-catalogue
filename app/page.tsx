'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, Share2, X, ChevronLeft, ChevronRight, Menu, Grid, Check, 
  MapPin, Image as ImageIcon, Play, RotateCw, ShieldCheck
} from 'lucide-react';

import { catalogueRepository, STORE_CONFIG, Category } from '@/app/lib/catalogue';

export default function CatalogueApp() {
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [copiedToast, setCopiedToast] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [rotation, setRotation] = useState<number>(0);

  const categories = useMemo(() => catalogueRepository.searchCategories(searchQuery), [searchQuery]);

  const currentCategory: Category | null = useMemo(() => {
    if (!selectedSlug) return null;
    return catalogueRepository.getCategoryBySlug(selectedSlug) || null;
  }, [selectedSlug]);

  useEffect(() => {
    if (searchQuery.trim() !== "" && categories.length > 0) {
      if (!currentCategory || !categories.some(c => c.slug === currentCategory.slug)) {
        setSelectedSlug(categories[0].slug);
      }
    }
  }, [searchQuery, categories, currentCategory]);

  useEffect(() => {
    setRotation(0);
  }, [lightboxIndex]);

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleShare = async (title: string, text: string) => {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: shareUrl });
      } catch {
        // Share dismissed
      }
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFAF7] text-[#1C120C] flex flex-col antialiased selection:bg-[#C5A059] selection:text-white text-base">
      
      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-[#1C120C] text-[#FCFAF7] border-b border-[#2A1B12] shadow-md">
        <div className="max-w-[1800px] mx-auto px-6 lg:px-10 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="lg:hidden p-2 text-[#C5A059] hover:text-white transition-colors"
              aria-label="Toggle Index"
            >
              <Menu size={28} />
            </button>
            
            <div 
              onClick={() => { setSelectedSlug(null); setSearchQuery(""); }}
              className="cursor-pointer group flex items-center space-x-3.5"
            >
              <div className="w-10 h-10 rounded bg-[#C5A059] flex items-center justify-center font-serif font-bold text-[#1C120C] text-2xl">
                W
              </div>
              <div>
                <div className="font-serif font-bold tracking-wider text-lg lg:text-xl leading-none text-[#FCFAF7] group-hover:text-[#C5A059] transition-colors">
                  {STORE_CONFIG.primaryName} <span className="text-[#C5A059] font-normal">{STORE_CONFIG.secondaryName}</span>
                </div>
                <div className="text-xs tracking-widest text-amber-200/70 uppercase font-light mt-1">
                  {STORE_CONFIG.location}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-sm font-medium text-amber-100/80 border border-amber-900/60 bg-[#2A1B12] px-4 py-1.5 rounded-md hidden sm:block">
              Catalogue V1.0 • 39 Categories
            </div>

            {/* ADMIN ACCESS LINK */}
            <Link
              href="/admin"
              className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-wider px-3.5 py-2 rounded-md bg-[#2A1B12] hover:bg-[#382418] text-[#C5A059] border border-amber-900/50 transition-colors"
              title="Store Admin Panel"
            >
              <ShieldCheck size={16} />
              <span className="hidden md:inline">Admin Login</span>
            </Link>
          </div>
        </div>
      </header>

      {/* WORKSPACE LAYOUT */}
      <div className="flex-1 max-w-[1800px] w-full mx-auto flex overflow-hidden relative">
        
        {/* MOBILE SIDEBAR BACKDROP */}
        {isMobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* LEFT INDEX SIDEBAR */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50 lg:z-0
          w-88 lg:w-[420px] bg-[#150D08] border-r border-[#2A1B12]
          flex flex-col transform transition-transform duration-300 ease-in-out
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          h-[calc(100vh-5rem)] sticky top-20
        `}>
          <div className="p-5 border-b border-[#2A1B12] bg-[#1C120C]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm uppercase font-bold tracking-widest text-[#C5A059] flex items-center space-x-2">
                <Grid size={18} />
                <span>Catalogue Index ({categories.length})</span>
              </span>
              <button 
                onClick={() => setIsMobileSidebarOpen(false)}
                className="lg:hidden text-zinc-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
              <input
                type="text"
                placeholder="Search category name or #..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#2A1B12] text-base text-[#FCFAF7] placeholder-zinc-400 pl-11 pr-10 py-3 rounded-lg border border-amber-900/40 focus:outline-none focus:border-[#C5A059] transition-colors"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>

          {/* VERTICAL CATEGORY LIST */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#2A1B12]/60">
            {categories.length === 0 ? (
              <div className="p-8 text-center text-zinc-400 text-base">
                No categories match "{searchQuery}"
              </div>
            ) : (
              categories.map((cat) => {
                const isSelected = currentCategory?.slug === cat.slug;
                return (
                  <button
                    key={cat.slug}
                    onClick={() => {
                      setSelectedSlug(cat.slug);
                      setIsMobileSidebarOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`
                      w-full text-left px-6 py-4 flex items-center justify-between transition-all group
                      ${isSelected 
                        ? 'bg-[#C5A059] text-[#1C120C] font-bold shadow-inner' 
                        : 'text-zinc-200 hover:bg-[#2A1B12] hover:text-[#FCFAF7]'
                      }
                    `}
                  >
                    <div className="flex items-center space-x-4 min-w-0">
                      <span className={`
                        font-mono text-sm px-2.5 py-1 rounded font-bold
                        ${isSelected ? 'bg-[#1C120C] text-[#C5A059]' : 'bg-[#2A1B12] text-[#C5A059] group-hover:bg-[#382418]'}
                      `}>
                        {cat.numberStr}
                      </span>
                      <span className="text-base sm:text-lg tracking-wide truncate font-medium">
                        {cat.name}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2.5">
                      <span className={`text-xs font-mono font-semibold ${isSelected ? 'text-[#1C120C]' : 'text-zinc-400'}`}>
                        {cat.media.length}
                      </span>
                      <ChevronRight size={18} className={`
                        transition-transform
                        ${isSelected ? 'text-[#1C120C] translate-x-1' : 'text-zinc-500 group-hover:text-zinc-200'}
                      `} />
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* WORKSPACE CONTENT AREA */}
        <main className="flex-1 min-w-0 bg-[#FCFAF7] p-6 sm:p-8 lg:p-12 overflow-y-auto">
          {currentCategory ? (
            <div className="max-w-7xl mx-auto space-y-8">
              
              {/* CATEGORY BAR */}
              <div className="bg-white rounded-xl p-8 border border-[#EAE3D9] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="font-mono text-sm px-3 py-1 rounded-md bg-[#1C120C] text-[#C5A059] font-bold">
                      CATEGORY {currentCategory.numberStr}
                    </span>
                    <span className="text-xs sm:text-sm text-amber-900/80 uppercase tracking-widest font-semibold">
                      Wood Home Furniture House
                    </span>
                  </div>
                  <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1C120C] font-bold tracking-tight">
                    {currentCategory.name}
                  </h1>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleShare(
                      `${currentCategory.name} - ${STORE_CONFIG.primaryName}`,
                      `Explore ${currentCategory.name} at Wood Home Furniture House, Ajmer.`
                    )}
                    className="inline-flex items-center space-x-2.5 text-sm font-bold uppercase tracking-wider px-5 py-3 rounded-lg border border-zinc-300 hover:border-zinc-800 text-zinc-800 hover:bg-zinc-900 hover:text-white transition-all shadow-sm"
                  >
                    <Share2 size={18} />
                    <span>Share Gallery</span>
                  </button>

                  <div className="text-sm font-semibold text-amber-900 bg-amber-50 px-4 py-3 rounded-lg border border-amber-200/80">
                    {currentCategory.media.length} Media Items
                  </div>
                </div>
              </div>

              {/* MEDIA GALLERY OR EMPTY STATE */}
              {currentCategory.media.length > 0 ? (
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
                  {currentCategory.media.map((item, idx) => (
                    <div
                      key={item.id}
                      onClick={() => setLightboxIndex(idx)}
                      className="break-inside-avoid relative group rounded-xl overflow-hidden bg-zinc-100 cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 border border-[#EAE3D9]"
                    >
                      {item.type === 'video' ? (
                        <div className="relative w-full">
                          <video
                            src={item.url}
                            className="w-full h-auto object-cover rounded-xl"
                            muted
                            playsInline
                            loop
                            autoPlay
                          />
                          <div className="absolute top-3 right-3 bg-black/70 text-[#C5A059] p-2 rounded-full backdrop-blur-sm">
                            <Play size={16} fill="#C5A059" />
                          </div>
                        </div>
                      ) : (
                        <img
                          src={item.url}
                          alt={`Wood Home Furniture House ${currentCategory.name}`}
                          loading="lazy"
                          className="w-full h-auto object-contain group-hover:scale-102 transition-transform duration-300"
                        />
                      )}

                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                        <div className="text-sm font-mono font-bold text-[#C5A059]">
                          {item.type === 'video' ? 'Video' : 'Photo'} {idx + 1} of {currentCategory.media.length}
                        </div>
                        <div className="text-xs text-zinc-300 mt-1">
                          Click to view in fullscreen
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-16 border border-[#EAE3D9] text-center max-w-xl mx-auto my-12 space-y-5 shadow-sm">
                  <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-[#C5A059]">
                    <ImageIcon size={40} />
                  </div>
                  <h3 className="font-serif font-bold text-2xl text-[#1C120C]">
                    Media Coming Soon
                  </h3>
                  <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
                    We are currently uploading images and videos for {currentCategory.name}. Please contact our Ajmer showroom for immediate catalog inquiries.
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* HOME COVER STATE */
            <div className="max-w-4xl mx-auto py-12 sm:py-20 space-y-8">
              <div className="relative rounded-3xl overflow-hidden bg-[#1C120C] text-[#FCFAF7] shadow-2xl border border-amber-900/30 p-10 sm:p-20 text-center">
                <div className="space-y-8">
                  <div className="inline-flex items-center space-x-2 text-sm font-semibold uppercase tracking-widest text-[#C5A059] bg-[#2A1B12] px-5 py-2 rounded-full border border-amber-900/50">
                    <MapPin size={16} />
                    <span>Ajmer, Rajasthan • Digital Showcase</span>
                  </div>

                  <div className="space-y-3">
                    <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#FCFAF7]">
                      {STORE_CONFIG.primaryName}
                    </h1>
                    <h2 className="font-serif text-2xl sm:text-3xl text-[#C5A059] tracking-widest font-light uppercase">
                      {STORE_CONFIG.secondaryName}
                    </h2>
                  </div>

                  <p className="max-w-2xl mx-auto text-zinc-200 text-base sm:text-xl font-light leading-relaxed">
                    Select a furniture category from the index list on the left to view high-definition photographs and video clips of our home, office, and institutional collections.
                  </p>

                  <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      onClick={() => setIsMobileSidebarOpen(true)}
                      className="w-full sm:w-auto lg:hidden bg-[#C5A059] text-[#1C120C] text-lg font-bold px-8 py-4 rounded-xl shadow-lg flex items-center justify-center space-x-3"
                    >
                      <Grid size={22} />
                      <span>Browse 39 Categories</span>
                    </button>

                    <Link
                      href="/admin"
                      className="w-full sm:w-auto bg-[#2A1B12] hover:bg-[#382418] text-[#C5A059] border border-amber-900/60 text-lg font-bold px-8 py-4 rounded-xl shadow-lg flex items-center justify-center space-x-3 transition-colors"
                    >
                      <ShieldCheck size={22} />
                      <span>Admin Upload Portal</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* FULLSCREEN LIGHTBOX */}
      {lightboxIndex !== null && currentCategory && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-6 sm:p-8 backdrop-blur-md select-none">
          <div className="flex items-center justify-between text-white z-10">
            <div className="flex items-center space-x-4">
              <span className="font-mono text-sm text-[#C5A059] bg-[#2A1B12] px-3 py-1.5 rounded-md font-bold">
                {currentCategory.numberStr}
              </span>
              <div className="font-serif font-bold text-lg sm:text-xl">{currentCategory.name}</div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={handleRotate}
                className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-zinc-200 hover:text-white rounded-lg bg-zinc-900 hover:bg-zinc-800 transition-colors border border-zinc-800"
                title="Rotate 90 degrees"
              >
                <RotateCw size={18} className="text-[#C5A059]" />
                <span className="hidden sm:inline">Rotate</span>
              </button>
              <button
                onClick={() => setLightboxIndex(null)}
                className="p-3 text-zinc-300 hover:text-white rounded-full bg-zinc-900"
              >
                <X size={28} />
              </button>
            </div>
          </div>

          <div className="relative flex-1 flex items-center justify-center my-6 overflow-hidden">
            {currentCategory.media[lightboxIndex].type === 'video' ? (
              <video
                src={currentCategory.media[lightboxIndex].url}
                controls
                autoPlay
                style={{ transform: `rotate(${rotation}deg)` }}
                className="max-h-[80vh] max-w-full rounded-lg shadow-2xl transition-transform duration-300 ease-in-out"
              />
            ) : (
              <img
                src={currentCategory.media[lightboxIndex].url}
                alt={currentCategory.name}
                style={{ transform: `rotate(${rotation}deg)` }}
                className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl transition-transform duration-300 ease-in-out"
              />
            )}

            {currentCategory.media.length > 1 && (
              <>
                <button
                  onClick={() => setLightboxIndex((lightboxIndex - 1 + currentCategory.media.length) % currentCategory.media.length)}
                  className="absolute left-4 p-4 rounded-full bg-black/70 text-white hover:bg-black/90 transition-all"
                >
                  <ChevronLeft size={28} />
                </button>
                <button
                  onClick={() => setLightboxIndex((lightboxIndex + 1) % currentCategory.media.length)}
                  className="absolute right-4 p-4 rounded-full bg-black/70 text-white hover:bg-black/90 transition-all"
                >
                  <ChevronRight size={28} />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* SHARE TOAST */}
      {copiedToast && (
        <div className="fixed bottom-8 right-8 z-50 bg-[#1C120C] text-[#C5A059] border border-[#C5A059] px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 text-sm font-semibold">
          <Check size={18} />
          <span>Category link copied to clipboard!</span>
        </div>
      )}

    </div>
  );
}