import React, { useState, useEffect } from 'react';
import { Activity, X, TrendingUp, Clock, Zap } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';

const PerformanceMonitor = ({ isOpen, onClose }) => {
  const { theme } = useEditorStore();
  const isDark = theme === 'vs-dark';
  const [metrics, setMetrics] = useState({
    fps: 60,
    memory: 0,
    loadTime: 0,
    codeExecutions: 0,
    avgExecutionTime: 0
  });

  useEffect(() => {
    if (!isOpen) return;

    // Monitor performance
    const interval = setInterval(() => {
      // Get memory usage (if available)
      const memory = (performance).memory 
        ? Math.round((performance).memory.usedJSHeapSize / 1048576)
        : 0;

      // Calculate FPS
      const fps = Math.round(1000 / (performance.now() % 1000) * 60);

      setMetrics(prev => ({
        ...prev,
        fps: Math.min(fps, 60),
        memory
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-lg shadow-2xl w-full max-w-2xl
        ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b
          ${isDark ? 'border-[#3c3c3c]' : 'border-gray-300'}`}>
          <div className="flex items-center gap-2">
            <Activity className="text-green-500" size={24} />
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              Performance Monitor
            </h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-md transition-colors
              ${isDark ? 'hover:bg-[#37373d] text-[#cccccc]' : 'hover:bg-gray-200 text-gray-600'}`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Metrics */}
        <div className="p-6 space-y-4">
          <MetricCard
            icon={<Zap size={20} />}
            label="Frame Rate"
            value={`${metrics.fps} FPS`}
            status={metrics.fps >= 55 ? 'good' : metrics.fps >= 30 ? 'warning' : 'poor'}
            isDark={isDark}
          />

          <MetricCard
            icon={<Activity size={20} />}
            label="Memory Usage"
            value={`${metrics.memory} MB`}
            status={metrics.memory < 100 ? 'good' : metrics.memory < 200 ? 'warning' : 'poor'}
            isDark={isDark}
          />

          <MetricCard
            icon={<Clock size={20} />}
            label="Load Time"
            value={`${(performance.now() / 1000).toFixed(2)}s`}
            status="good"
            isDark={isDark}
          />

          <MetricCard
            icon={<TrendingUp size={20} />}
            label="Code Executions"
            value={metrics.codeExecutions.toString()}
            status="good"
            isDark={isDark}
          />

          <div className={`p-4 rounded-lg border
            ${isDark ? 'bg-[#252526] border-[#3c3c3c]' : 'bg-blue-50 border-blue-200'}`}>
            <p className={`text-sm ${isDark ? 'text-[#cccccc]' : 'text-gray-700'}`}>
              <strong>Tip:</strong> Close unused tabs and files to improve performance.
              Clear browser cache if the IDE feels sluggish.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ icon, label, value, status, isDark }) => {
  const statusColors = {
    good: 'text-green-500',
    warning: 'text-yellow-500',
    poor: 'text-red-500'
  };

  return (
    <div className={`p-4 rounded-lg border flex items-center justify-between
      ${isDark ? 'bg-[#252526] border-[#3c3c3c]' : 'bg-gray-50 border-gray-300'}`}>
      <div className="flex items-center gap-3">
        <div className={statusColors[status]}>{icon}</div>
        <div>
          <div className={`text-sm ${isDark ? 'text-[#858585]' : 'text-gray-500'}`}>
            {label}
          </div>
          <div className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
            {value}
          </div>
        </div>
      </div>
      <div className={`px-3 py-1 rounded-full text-xs font-medium
        ${status === 'good' 
          ? 'bg-green-900 text-green-200' 
          : status === 'warning'
          ? 'bg-yellow-900 text-yellow-200'
          : 'bg-red-900 text-red-200'
        }`}>
        {status.toUpperCase()}
      </div>
    </div>
  );
};

export default PerformanceMonitor;
