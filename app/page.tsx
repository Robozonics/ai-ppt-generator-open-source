"use client";

import { useState, useEffect } from "react";
import { useDeckStore } from "@/lib/store";
import { PresentationCanvas } from "@/components/viewer/PresentationCanvas";
import { AIChatSidebar } from "@/components/editor/AIChatSidebar";
import { GeneratingOverlay } from "@/components/editor/GeneratingOverlay";
import { Loader2, Sparkles, Wand2, Layers, AlignLeft, Palette, Check, Download, FileText, Play, Brain, Zap } from "lucide-react";

type Verbosity = "short" | "medium" | "detailed";

export default function LandingPage() {
  const [prompt, setPrompt] = useState("");
  const [slideCount, setSlideCount] = useState<number>(6);
  const [verbosity, setVerbosity] = useState<Verbosity>("medium");
  const [theme, setTheme] = useState<string>("nebula_dark");
  const [imageSource, setImageSource] = useState<string>("ai");
  const [isPresentMode, setIsPresentMode] = useState(false);
  const [isExportingPPTX, setIsExportingPPTX] = useState(false);
  
  const { deck, setDeck, isLoading, setIsLoading, activeCardId, updateCard, setActiveCard, animationsEnabled, toggleAnimations, changeTheme } = useDeckStore();
  const [error, setError] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);

  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;
    setIsEnhancing(true);
    try {
      const res = await fetch("/api/enhance-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error("Failed to enhance prompt");
      const data = await res.json();
      if (data.enhancedPrompt) {
        setPrompt(data.enhancedPrompt);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          topic: prompt,
          slideCount,
          verbosity,
          theme,
          imageSource
        }),
      });
      
      if (!res.ok) {
        if (res.status === 504) {
          throw new Error("Generation timed out (504). Please try again — the AI server took too long.");
        }
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Generation failed (HTTP ${res.status})`);
      }

      const data = await res.json();
      setDeck(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModifyCard = async (instruction: string) => {
    if (!activeCardId || !deck) throw new Error("No card selected.");
    const currentCard = deck.cards.find((c) => c.id === activeCardId);
    if (!currentCard) throw new Error("Card not found.");

    const res = await fetch("/api/modify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ instruction, currentCard, colorPalette: deck.colorPalette, imageSource: deck.imageSource }),
    });
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || "Modification failed.");
    }
    const data = await res.json();
    if (data.modifiedCard) {
      updateCard(activeCardId, data.modifiedCard);
    }
  };

  const handleExportPPTX = async () => {
    if (!deck) return;
    setIsExportingPPTX(true);
    try {
      const res = await fetch("/api/export-pptx", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(deck),
      });

      if (!res.ok) throw new Error("Export failed");
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${deck.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pptx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Failed to export PPTX.");
    } finally {
      setIsExportingPPTX(false);
    }
  };

  const togglePresentMode = () => {
    setActiveCard(null); // Deselect any cards
    if (!isPresentMode) {
      document.documentElement.requestFullscreen().catch(err => console.log(err));
    } else {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => console.log(err));
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsPresentMode(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!document.fullscreenElement) return;
      if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;

      const track = document.querySelector('.presentation-track');
      if (!track) return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        track.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        track.scrollBy({ top: -window.innerHeight, behavior: 'smooth' });
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  if (deck) {
    return (
      <main className="w-full h-screen flex flex-col relative overflow-hidden" style={{ backgroundColor: deck.colorPalette?.background || '#0b0f19' }}>
        <GeneratingOverlay isVisible={isLoading} />
        
        {/* Navbar */}
        {!isPresentMode && (
          <header className="h-16 border-b border-white/10 flex items-center justify-between px-6 bg-[#0b0f19]/80 backdrop-blur-md shrink-0 z-50 no-print">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Sparkles className="text-pink-400 w-5 h-5" />
                <span className="font-bold text-white tracking-tight">AIPPT / @Robozonics</span>
              </div>
              <div className="w-px h-6 bg-white/10 mx-2" />
              <button 
                onClick={() => setDeck(null as any)}
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                ← Back
              </button>
            </div>

            <div className="flex items-center gap-3">
              {/* Theme Live Switcher */}
              <div className="flex items-center gap-1.5 bg-slate-800/90 border border-white/10 rounded-lg px-2.5 py-1.5">
                <Palette className="w-3.5 h-3.5 text-pink-400" />
                <select
                  value={deck.theme || "nebula_dark"}
                  onChange={(e) => changeTheme(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-slate-200 outline-none cursor-pointer"
                  title="Switch Visual Theme"
                >
                  <option value="nebula_dark" className="bg-slate-900">🎨 Nebula Cyber</option>
                  <option value="neon_tokyo" className="bg-slate-900">⚡ Neon Tokyo</option>
                  <option value="hyper_sunset" className="bg-slate-900">🌅 Hyper Sunset</option>
                  <option value="acid_matrix" className="bg-slate-900">🧪 Acid Matrix</option>
                  <option value="y2k_vaporwave" className="bg-slate-900">📼 Y2K Vaporwave</option>
                  <option value="aurora_glass" className="bg-slate-900">🌌 Aurora Dream</option>
                  <option value="stealth_mono" className="bg-slate-900">🖤 Stealth Carbon</option>
                  <option value="liquid_chrome" className="bg-slate-900">💿 Liquid Chrome</option>
                </select>
              </div>

              {/* Animation Motion Toggle */}
              <button
                onClick={toggleAnimations}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                  animationsEnabled
                    ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/25"
                    : "bg-slate-800 border-white/10 text-slate-400 hover:text-white"
                }`}
                title={animationsEnabled ? "Animations: ON (Click to turn OFF)" : "Animations: OFF (Click to turn ON)"}
              >
                <Zap className={`w-3.5 h-3.5 ${animationsEnabled ? "text-cyan-400 fill-cyan-400" : "text-slate-500"}`} />
                <span>{animationsEnabled ? "Motion ON" : "Motion OFF"}</span>
              </button>

              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors"
              >
                <FileText className="w-4 h-4" />
                Export PDF
              </button>
              
              <button
                onClick={handleExportPPTX}
                disabled={isExportingPPTX}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              >
                {isExportingPPTX ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                Export PPTX
              </button>

              <button
                onClick={togglePresentMode}
                className="flex items-center gap-2 px-5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold transition-colors shadow-lg shadow-indigo-500/20 ml-1"
              >
                <Play className="w-4 h-4" />
                Present
              </button>
            </div>
          </header>
        )}

        {/* Present Mode Exit Button (only visible when presenting and hovered near top) */}
        {isPresentMode && (
          <div className="absolute top-0 inset-x-0 h-16 flex justify-center items-start opacity-0 hover:opacity-100 transition-opacity duration-300 z-50 pt-4 no-print">
            <button 
              onClick={togglePresentMode}
              className="bg-black/50 backdrop-blur-md text-white px-6 py-2 rounded-full text-sm font-medium border border-white/10 hover:bg-black/70"
            >
              Exit Present Mode (Esc)
            </button>
          </div>
        )}

        <div className="flex-1 overflow-hidden relative">
          <PresentationCanvas isPresentMode={isPresentMode} />
        </div>
        
        {!isPresentMode && (
          <div className="no-print">
            <AIChatSidebar activeCardId={activeCardId} onModifyCard={handleModifyCard} />
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="min-h-screen relative overflow-x-hidden overflow-y-auto flex flex-col items-center p-6 selection:bg-pink-500/30 bg-[#050505]">
      <GeneratingOverlay isVisible={isLoading} />
      
      {/* Colorful Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-pink-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-purple-600/20 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-4xl space-y-10 relative z-10 my-auto py-12">
        
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-500/10 to-pink-500/10 border border-white/10 text-pink-300 text-sm font-semibold mb-2 shadow-lg shadow-pink-500/5">
            <Sparkles className="w-4 h-4" />
            AIPPT Next-Gen Engine
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-indigo-100 to-pink-200 drop-shadow-sm">
            Ideas to Documents. <br className="hidden md:block"/> In seconds.
          </h1>
          
          <p className="text-xl text-indigo-100/70 max-w-2xl mx-auto leading-relaxed font-medium">
            The first web-native presentation engine built for structured intelligence. Powered by Groq.
          </p>
        </div>

        {/* Input Area */}
        <div className="relative group max-w-3xl mx-auto mt-12">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 to-pink-500/30 blur-xl group-focus-within:opacity-100 opacity-60 transition-opacity rounded-3xl" />
          
          <div className="relative bg-[#0f111a]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6">
            
            <div className="relative">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="What do you want to present about?"
                className="w-full bg-black/40 border border-white/5 rounded-2xl outline-none text-xl pl-6 pr-32 py-5 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-pink-500/50 transition-all shadow-inner"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleGenerate();
                }}
              />
              <button
                onClick={handleEnhancePrompt}
                disabled={isEnhancing || !prompt.trim()}
                title="Enhance & Correct Prompt"
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-pink-300 p-2 rounded-xl transition-all flex items-center gap-2 text-sm font-medium"
              >
                {isEnhancing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span className="hidden sm:inline">Enhance</span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              
              {/* Slide Count Control */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4" /> Slide Count
                </label>
                <div className="flex bg-black/40 rounded-xl p-1 border border-white/5 shadow-inner">
                  {[4, 6, 8, 10].map(num => (
                    <button
                      key={num}
                      onClick={() => setSlideCount(num)}
                      className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                        slideCount === num 
                          ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/20' 
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Verbosity Control */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-pink-300 uppercase tracking-wider flex items-center gap-2">
                  <AlignLeft className="w-4 h-4" /> Detail Level
                </label>
                <div className="flex bg-black/40 rounded-xl p-1 border border-white/5 shadow-inner">
                  {(['short', 'medium', 'detailed'] as Verbosity[]).map(level => (
                    <button
                      key={level}
                      onClick={() => setVerbosity(level)}
                      className={`flex-1 py-2 text-sm font-medium rounded-lg capitalize transition-all ${
                        verbosity === level 
                          ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/20' 
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Control */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-purple-300 uppercase tracking-wider flex items-center gap-2">
                  <Palette className="w-4 h-4" /> Visual Theme
                </label>
                <div className="relative">
                  <select 
                    value={theme}
                    onChange={(e) => setTheme(e.target.value)}
                    className="w-full appearance-none bg-black/40 border border-white/5 rounded-xl outline-none text-sm px-4 py-3 text-white focus:ring-1 focus:ring-purple-500/50 transition-all shadow-inner cursor-pointer"
                  >
                    <option value="nebula_dark">🎨 AI Auto Choose (Recommended)</option>
                    <option value="neon_tokyo">⚡ Neon Tokyo 2077 (Cyberpunk)</option>
                    <option value="hyper_sunset">🌅 Hyper Sunset (Velvet &amp; Coral)</option>
                    <option value="acid_matrix">🧪 Acid Matrix Hype (Toxic Lime &amp; Aqua)</option>
                    <option value="y2k_vaporwave">📼 Y2K Vaporwave (Pastel Bubblegum)</option>
                    <option value="aurora_glass">🌌 Aurora Dream (Nordic Teal &amp; Crystal)</option>
                    <option value="stealth_mono">🖤 Stealth Carbon (Luxury Platinum)</option>
                    <option value="liquid_chrome">💿 Liquid Chrome (Holographic Silver)</option>
                    <option value="cyber_obsidian">🔮 Cyber Obsidian (Obsidian &amp; Violet)</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Check className="w-4 h-4 text-purple-400 opacity-50" />
                  </div>
                </div>
              </div>

              {/* Image Source Control */}
              <div className="space-y-3">
                <label className="text-xs font-semibold text-teal-300 uppercase tracking-wider flex items-center gap-2">
                  <Palette className="w-4 h-4" /> Image Source
                </label>
                <div className="relative">
                  <select 
                    value={imageSource}
                    onChange={(e) => setImageSource(e.target.value)}
                    className="w-full appearance-none bg-black/40 border border-white/5 rounded-xl outline-none text-sm px-4 py-3 text-white focus:ring-1 focus:ring-teal-500/50 transition-all shadow-inner cursor-pointer"
                  >
                    <option value="ai">AI Images</option>
                    <option value="web">Web Pictures</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Check className="w-4 h-4 text-teal-400 opacity-50" />
                  </div>
                </div>
              </div>

            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5">
              {/* Animation Toggle on Landing Page */}
              <button
                type="button"
                onClick={toggleAnimations}
                className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-2 ${
                  animationsEnabled
                    ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20"
                    : "bg-black/30 border-white/10 text-slate-400 hover:text-white"
                }`}
                title="Toggle slide transition and fluid ambient animations"
              >
                <Zap className={`w-4 h-4 ${animationsEnabled ? "text-cyan-400 fill-cyan-400 animate-pulse" : "text-slate-500"}`} />
                <span>{animationsEnabled ? "Animations: ON" : "Animations: OFF"}</span>
              </button>

              <button
                onClick={handleGenerate}
                disabled={isLoading || !prompt.trim()}
                className="w-full sm:w-auto min-w-[240px] justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-400 hover:via-purple-400 hover:to-pink-400 disabled:opacity-50 disabled:grayscale text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-pink-500/25"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Generating Magic...
                  </>
                ) : (
                  <>
                    Generate Presentation
                    <Wand2 className="w-6 h-6" />
                  </>
                )}
              </button>
            </div>

          </div>
          {error && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center">
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Gen Z Footer Credits */}
        <div className="mt-20 pt-10 border-t border-white/10 text-center flex flex-col items-center space-y-4 relative z-20">
          {/* A product of Robozonics */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/[0.06] border border-white/15 backdrop-blur-xl shadow-lg shadow-pink-500/10 transition-transform hover:scale-105">
            <Sparkles className="w-4 h-4 text-pink-400 animate-pulse" />
            <span className="text-xs md:text-sm font-bold tracking-widest uppercase text-pink-300">
              A product of <span className="text-white font-black drop-shadow">Robozonics</span>
            </span>
          </div>

          {/* Crafted & Developed by Rehan RS */}
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight bg-gradient-to-r from-[#FF007A] via-[#A855F7] via-[#00F0FF] to-[#FF3366] bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(255,0,122,0.4)] transition-all duration-300 hover:scale-[1.02]">
            Crafted &amp; Developed by Rehan RS
          </h2>

          {/* Powered by the Brain of Gemini */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-purple-500/15 via-indigo-500/15 to-cyan-500/15 border border-purple-500/30 backdrop-blur-xl shadow-lg shadow-purple-500/15">
            <Brain className="w-5 h-5 text-cyan-400 animate-pulse" />
            <span className="text-sm md:text-base font-semibold text-slate-200 tracking-wide flex items-center gap-1.5">
              Powered by the <span className="bg-gradient-to-r from-cyan-400 via-purple-300 to-pink-400 bg-clip-text text-transparent font-extrabold">Brain of Gemini</span>
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400 inline-block" />
            </span>
          </div>
        </div>

      </div>
    </main>
  );
}
