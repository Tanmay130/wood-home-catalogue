'use client';

import React, { useState, useEffect } from 'react';
import { Lock, Upload, CheckCircle2, LogOut, ArrowLeft, Loader2, Image as ImageIcon } from 'lucide-react';
import { catalogueRepository, Category, STORE_CONFIG } from '@/app/lib/catalogue';
import Link from 'next/link';

// Simple passcode for your father (Change "1234" to any pin you prefer)
const ADMIN_PIN = "1234"; 

export default function AdminUploadPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [pinError, setPinError] = useState<boolean>(false);

  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Check persistent login state on load
  useEffect(() => {
    const savedAuth = localStorage.getItem('wood_home_admin_authed');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
    setCategories(catalogueRepository.getAllCategories());
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === ADMIN_PIN) {
      localStorage.setItem('wood_home_admin_authed', 'true');
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('wood_home_admin_authed');
    setIsAuthenticated(false);
    setPinInput('');
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFolder || !selectedFiles || selectedFiles.length === 0) {
      setUploadError('Please choose a category and select photos or videos.');
      return;
    }

    setIsUploading(true);
    setUploadSuccess(null);
    setUploadError(null);

    const formData = new FormData();
    formData.append('folderName', selectedFolder);
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('files', selectedFiles[i]);
    }

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setUploadSuccess(`Successfully uploaded ${data.count} media file(s)!`);
        setSelectedFiles(null);
        // Reset file input element
        const fileInput = document.getElementById('file-upload-input') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        setUploadError(data.error || 'Failed to upload media.');
      }
    } catch {
      setUploadError('Network error. Please try uploading again.');
    } finally {
      setIsUploading(false);
    }
  };

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1C120C] text-[#FCFAF7] flex items-center justify-center p-6 antialiased">
        <div className="w-full max-w-md bg-[#2A1B12] rounded-3xl p-8 border border-amber-900/40 shadow-2xl text-center space-y-6">
          <div className="w-16 h-16 bg-[#C5A059] text-[#1C120C] rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold font-serif">
            W
          </div>

          <div>
            <h1 className="text-2xl font-bold font-serif text-[#FCFAF7]">Store Admin Login</h1>
            <p className="text-sm text-amber-200/70 mt-1">{STORE_CONFIG.primaryName} {STORE_CONFIG.secondaryName}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500/70" size={20} />
              <input
                type="password"
                placeholder="Enter PIN (e.g. 1234)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="w-full bg-[#150D08] border border-amber-900/60 rounded-xl pl-12 pr-4 py-4 text-lg text-[#FCFAF7] focus:outline-none focus:border-[#C5A059]"
              />
            </div>

            {pinError && (
              <p className="text-red-400 text-sm font-semibold">Incorrect PIN code. Try again.</p>
            )}

            <button
              type="submit"
              className="w-full bg-[#C5A059] text-[#1C120C] font-bold text-lg py-4 rounded-xl shadow-lg hover:bg-amber-400 transition-colors"
            >
              Login & Remember Me
            </button>
          </form>

          <Link href="/" className="inline-flex items-center text-xs text-amber-200/60 hover:text-white space-x-1 pt-2">
            <ArrowLeft size={14} />
            <span>Back to Public Catalogue</span>
          </Link>
        </div>
      </div>
    );
  }

  // ADMIN UPLOAD INTERFACE
  return (
    <div className="min-h-screen bg-[#FCFAF7] text-[#1C120C] flex flex-col antialiased">
      {/* HEADER */}
      <header className="bg-[#1C120C] text-[#FCFAF7] px-6 py-5 border-b border-[#2A1B12] flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded bg-[#C5A059] flex items-center justify-center font-serif font-bold text-[#1C120C] text-xl">
            W
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg leading-tight">Admin Upload Portal</h1>
            <p className="text-xs text-amber-200/70 uppercase">Wood Home Furniture House</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link href="/" className="p-2 text-amber-200/80 hover:text-white text-sm font-medium">
            View Website
          </Link>
          <button
            onClick={handleLogout}
            className="p-2.5 text-red-400 hover:text-red-300 rounded-lg bg-[#2A1B12]"
            title="Log Out"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* FORM BODY */}
      <main className="flex-1 max-w-2xl w-full mx-auto p-6 sm:p-10 space-y-8">
        <div className="bg-white rounded-3xl p-8 border border-[#EAE3D9] shadow-md space-y-6">
          <div className="border-b border-[#EAE3D9] pb-4">
            <h2 className="font-serif text-2xl font-bold text-[#1C120C]">Upload New Photos or Videos</h2>
            <p className="text-sm text-zinc-600 mt-1">Select furniture category, tap choose photos, and upload directly from your camera roll.</p>
          </div>

          <form onSubmit={handleUpload} className="space-y-6">
            {/* CATEGORY SELECTION */}
            <div className="space-y-2">
              <label className="block text-sm font-bold uppercase tracking-wider text-amber-900">
                1. Select Furniture Category
              </label>
              <select
                value={selectedFolder}
                onChange={(e) => setSelectedFolder(e.target.value)}
                className="w-full bg-[#FCFAF7] border-2 border-[#EAE3D9] text-[#1C120C] font-semibold rounded-xl p-4 text-base focus:outline-none focus:border-[#C5A059]"
              >
                <option value="">-- Choose Category --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.folderName || `0${cat.id}-${cat.slug}`}>
                    [{cat.numberStr}] {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* FILE SELECTION */}
            <div className="space-y-2">
              <label className="block text-sm font-bold uppercase tracking-wider text-amber-900">
                2. Select Photos or Videos
              </label>
              <div className="border-2 border-dashed border-[#C5A059] bg-amber-50/50 rounded-2xl p-8 text-center cursor-pointer hover:bg-amber-50 transition-colors">
                <input
                  id="file-upload-input"
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={(e) => setSelectedFiles(e.target.files)}
                  className="hidden"
                />
                <label htmlFor="file-upload-input" className="cursor-pointer space-y-3 block">
                  <div className="w-16 h-16 bg-[#C5A059]/20 text-[#C5A059] rounded-full flex items-center justify-center mx-auto">
                    <ImageIcon size={32} />
                  </div>
                  <div>
                    <span className="font-bold text-lg text-[#1C120C] block">
                      {selectedFiles && selectedFiles.length > 0
                        ? `${selectedFiles.length} file(s) selected`
                        : 'Tap here to pick photos / videos'}
                    </span>
                    <span className="text-xs text-zinc-500 mt-1 block">
                      Accepts JPG, PNG, HEIC, MP4, MOV & any video format
                    </span>
                  </div>
                </label>
              </div>
            </div>

            {/* FEEDBACK NOTIFICATIONS */}
            {uploadSuccess && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold flex items-center space-x-2">
                <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                <span>{uploadSuccess}</span>
              </div>
            )}

            {uploadError && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm font-bold">
                {uploadError}
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={isUploading}
              className="w-full bg-[#1C120C] hover:bg-[#2A1B12] text-[#C5A059] font-bold text-xl py-5 rounded-2xl shadow-xl flex items-center justify-center space-x-3 transition-all disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <Loader2 size={24} className="animate-spin text-[#C5A059]" />
                  <span>Uploading Media...</span>
                </>
              ) : (
                <>
                  <Upload size={24} />
                  <span>Upload To Catalogue</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}