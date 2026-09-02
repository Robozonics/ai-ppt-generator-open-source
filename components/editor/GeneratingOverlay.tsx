import { useState, useEffect } from "react";
import { Sparkles, Layers, Wand2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const LOADING_PHASES = [
  "Analyzing topic and target audience...",
  "Structuring presentation narrative...",
  "Drafting elite slide outlines...",
  "Designing layout geometry...",
  "Applying professional color palette...",
  "Polishing typography and formatting...",
  "Finalizing presentation deck..."
];

export function GeneratingOverlay({ isVisible }: { isVisible: boolean }) {
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isVisible) {
      setPhaseIndex(0);
      setProgress(0);
      return;
    }

    // Simulate progress bar (0 to 100% over ~15 seconds)
    const duration = 15000;
    const intervalTime = 50;
    const step = 100 / (duration / intervalTime);

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + step, 99));
    }, intervalTime);

    // Cycle through text phases
    const phaseInterval = setInterval(() => {
      setPhaseIndex((prev) => (prev < LOADING_PHASES.length - 1 ? prev + 1 : prev));
    }, duration / LOADING_PHASES.length);

    return () => {
      clearInterval(progressInterval);
      clearInterval(phaseInterval);
    };
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(24px)" }}
          exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#050505]/80 overflow-hidden"
        >
          {/* Animated Background Grid & Glows */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30">
            <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15),transparent_70%)]" />
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.1, 1] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] rounded-full border border-white/5 border-dashed"
            />
            <motion.div
              animate={{ rotate: -360, scale: [1, 1.2, 1] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full border border-indigo-500/10 border-dotted"
            />
          </div>

          {/* Core Loading Modal */}
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative z-10 w-full max-w-lg bg-[#0a0a0f]/90 border border-white/10 rounded-3xl p-10 shadow-2xl shadow-indigo-500/20 backdrop-blur-3xl overflow-hidden"
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent w-[200%] animate-shimmer" />

            <div className="relative flex flex-col items-center">
              
              {/* Dynamic Icon */}
              <div className="relative w-20 h-20 mb-8 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border border-dashed border-indigo-500/50"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-2 rounded-full bg-indigo-500/20 blur-md"
                />
                <motion.div
                  key={phaseIndex}
                  initial={{ scale: 0, rotate: -90 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="relative z-10 text-white"
                >
                  {phaseIndex % 3 === 0 ? <Sparkles className="w-8 h-8 text-pink-400" /> : 
                   phaseIndex % 3 === 1 ? <Layers className="w-8 h-8 text-indigo-400" /> : 
                   <Wand2 className="w-8 h-8 text-purple-400" />}
                </motion.div>
              </div>

              {/* Dynamic Text */}
              <div className="h-14 relative flex flex-col items-center justify-center w-full overflow-hidden text-center">
                <AnimatePresence mode="wait">
                  <motion.h3
                    key={phaseIndex}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-indigo-300"
                  >
                    {LOADING_PHASES[phaseIndex]}
                  </motion.h3>
                </AnimatePresence>
              </div>

              {/* Progress Bar Container */}
              <div className="w-full mt-10 space-y-3">
                <div className="flex justify-between text-xs font-semibold uppercase tracking-widest text-slate-400">
                  <span>Generating Deck</span>
                  <span className="text-indigo-400">{Math.floor(progress)}%</span>
                </div>
                
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden relative">
                  <motion.div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
                    style={{ width: `${progress}%` }}
                    layout
                  />
                  {/* Highlight scanning across progress bar */}
                  <div className="absolute top-0 left-0 h-full w-20 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
                </div>
              </div>

              <p className="mt-8 text-sm text-slate-500 max-w-[280px] text-center">
                Our AI engine is currently crafting your bespoke slide layouts and content.
              </p>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
