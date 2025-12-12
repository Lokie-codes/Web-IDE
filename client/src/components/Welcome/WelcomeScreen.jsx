import React, { useState } from 'react';
import { FileCode, Folder, Zap, X, Code2, Globe, Laptop, ChevronRight, Calculator, Terminal } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';

const WelcomeScreen = ({ onClose }) => {
  const { theme, setMode } = useEditorStore();
  const isDark = theme === 'vs-dark';
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleStartCoding = (mode) => {
    setMode(mode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
      {/* Backdrop with Blur */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Main Modal Container */}
      <div className={`m-10  relative w-full max-w-5xl h-[600px] flex rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 animate-in zoom-in-95 duration-300
        ${isDark ? 'bg-[#18181b]' : 'bg-white'}`}>

        {/* Left Section - Hero/Branding */}
        <div className="hidden md:flex flex-col justify-between w-[40%] p-10 relative overflow-hidden">
          {/* Animated Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 opacity-90" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

          {/* Decorative Circles */}
          <div className="absolute top-[-50px] left-[-50px] w-64 h-64 bg-blue-400 rounded-full blur-[100px] opacity-30 animate-pulse" />
          <div className="absolute bottom-[-50px] right-[-50px] w-64 h-64 bg-purple-400 rounded-full blur-[100px] opacity-30 animate-pulse delay-700" />

          {/* Content */}
          <div className="relative z-10 text-white">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                <Terminal size={32} className="text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight">CodeForge</span>
            </div>

            <h1 className="text-4xl font-bold leading-tight mb-6">
              Code, Create, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-cyan-200">
                Collaborate.
              </span>
            </h1>

            <p className="text-blue-100 text-lg font-light leading-relaxed max-w-xs">
              Experience the next generation of web-based development. Powerful, fast, and designed for you.
            </p>
          </div>

          <div className="relative z-10">
            <div className="space-y-4">
              <FeatureItem icon={<Zap size={20} />} text="Instant Execution" />
              <FeatureItem icon={<Globe size={20} />} text="Cloud-Powered" />
              <FeatureItem icon={<Laptop size={20} />} text="Works Everywhere" />
            </div>
          </div>

          <div className="relative z-10 pt-8 border-t border-white/10 mt-auto">
            <p className="text-xs text-blue-200 font-medium tracking-wide uppercase">
              v1.0.0 • Stable Release
            </p>
          </div>
        </div>

        {/* Right Section - Selection */}
        <div className={`flex-1 p-8 md:p-12 flex flex-col relative overflow-y-auto
           ${isDark ? 'bg-[#18181b]' : 'bg-white'}`}>

          <button
            onClick={onClose}
            className={`absolute top-6 right-6 p-2 rounded-full transition-all duration-200
              ${isDark
                ? 'hover:bg-zinc-800 text-zinc-400 hover:text-white'
                : 'hover:bg-gray-100 text-gray-500 hover:text-gray-900'}`}
          >
            <X size={24} />
          </button>

          <div className="mt-4 mb-10">
            <h2 className={`text-3xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Get Started
            </h2>
            <p className={`text-lg ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
              Select a workspace mode to begin your journey
            </p>
          </div>

          <div className="grid gap-6 flex-1">
            <SelectionCard
              icon={<Code2 size={40} />}
              title="Single File Mode"
              description="Perfect for quick scripts, algorithm testing, and code snippets."
              badge="Fastest"
              onClick={() => handleStartCoding('single')}
              isDark={isDark}
              isHovered={hoveredCard === 'single'}
              onMouseEnter={() => setHoveredCard('single')}
              onMouseLeave={() => setHoveredCard(null)}
              color="blue"
            />

            <SelectionCard
              icon={<Folder size={40} />}
              title="Project Mode"
              description="Full file system access, multiple files, and directory management."
              badge="Powerful"
              onClick={() => handleStartCoding('project')}
              isDark={isDark}
              isHovered={hoveredCard === 'project'}
              onMouseEnter={() => setHoveredCard('project')}
              onMouseLeave={() => setHoveredCard(null)}
              color="purple"
            />
          </div>

          <div className="mt-8 text-center">
            <p className={`text-sm ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
              You can switch modes anytime from the toolbar
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureItem = ({ icon, text }) => (
  <div className="flex items-center gap-3 text-blue-100/80">
    <div className="p-1.5 rounded-lg bg-blue-500/20">
      {icon}
    </div>
    <span className="font-medium">{text}</span>
  </div>
);

const SelectionCard = ({ icon, title, description, badge, onClick, isDark, isHovered, onMouseEnter, onMouseLeave, color }) => {
  const colorStyles = {
    blue: {
      border: 'hover:border-blue-500/50',
      bg: 'hover:bg-blue-500/5',
      icon: 'text-blue-500',
      badge: isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-700'
    },
    purple: {
      border: 'hover:border-purple-500/50',
      bg: 'hover:bg-purple-500/5',
      icon: 'text-purple-500',
      badge: isDark ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-100 text-purple-700'
    }
  };

  const themeStyle = colorStyles[color];

  return (
    <button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`relative w-full p-6 text-left rounded-2xl border-2 transition-all duration-300 group
        ${isDark
          ? `bg-[#202023] border-zinc-800 ${themeStyle.border} ${themeStyle.bg}`
          : `bg-white border-gray-100 shadow-sm hover:shadow-md ${themeStyle.border} ${themeStyle.bg}`
        }
        ${isHovered ? '-translate-y-1 shadow-lg' : ''}
      `}
    >
      <div className="flex items-start gap-6">
        <div className={`p-4 rounded-xl transition-all duration-300
          ${isDark ? 'bg-zinc-900' : 'bg-gray-50'}
          ${isHovered ? 'scale-110 rotate-3' : ''}
          ${themeStyle.icon}
        `}>
          {icon}
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {title}
            </h3>
            {badge && (
              <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide ${themeStyle.badge}`}>
                {badge}
              </span>
            )}
          </div>
          <p className={`mb-4 text-sm leading-relaxed ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
            {description}
          </p>

          <div className={`flex items-center gap-2 text-sm font-semibold transition-all
             ${isDark ? 'text-zinc-500' : 'text-gray-400'}
             ${isHovered ? themeStyle.icon : ''}
          `}>
            <span>Select Mode</span>
            <ChevronRight size={16} className={`transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`} />
          </div>
        </div>
      </div>
    </button>
  );
};


export default WelcomeScreen;
