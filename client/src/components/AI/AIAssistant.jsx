import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Copy, Check, RefreshCw, Lightbulb } from 'lucide-react';
import { useEditorStore } from '../../store/editorStore';
import { marked } from 'marked';

const AIAssistant = ({ isOpen, onClose }) => {
  const { theme, code, language } = useEditorStore();
  const isDark = theme === 'vs-dark';
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I\'m your AI coding assistant. I can help you:\n\n• Explain code\n• Fix bugs\n• Suggest improvements\n• Generate code\n• Answer questions\n\nHow can I help you today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      // Simulate AI response (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await getAIResponse(userMessage, code, language);
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const getAIResponse = async (prompt, code, language) => {
    // This is a placeholder - integrate with OpenAI, Anthropic, or local LLM
    const responses = {
      'explain': `Here's an explanation of your ${language} code:\n\n\`\`\`${language}\n${code.substring(0, 200)}...\n\`\`\`\n\nThis code demonstrates basic syntax and structure. Would you like me to explain any specific part in detail?`,
      'fix': 'I\'ve analyzed your code. Here are some potential improvements:\n\n1. Add error handling\n2. Optimize loops\n3. Use modern syntax\n\nWould you like me to show specific examples?',
      'improve': 'Here are some suggestions to improve your code:\n\n• **Performance**: Consider using more efficient algorithms\n• **Readability**: Add meaningful variable names\n• **Best Practices**: Follow the style guide for ' + language,
      'default': 'I understand you need help with your code. Could you please be more specific? For example:\n\n• "Explain this code"\n• "Find bugs in this code"\n• "How can I improve this?"\n• "Generate a function that does X"'
    };

    const lowerPrompt = prompt.toLowerCase();
    
    if (lowerPrompt.includes('explain')) return responses.explain;
    if (lowerPrompt.includes('fix') || lowerPrompt.includes('bug')) return responses.fix;
    if (lowerPrompt.includes('improve') || lowerPrompt.includes('better')) return responses.improve;
    
    return responses.default;
  };

  const quickActions = [
    { label: 'Explain Code', prompt: 'Explain this code to me' },
    { label: 'Find Bugs', prompt: 'Find potential bugs in this code' },
    { label: 'Optimize', prompt: 'How can I optimize this code?' },
    { label: 'Add Comments', prompt: 'Add helpful comments to this code' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`rounded-lg shadow-2xl w-full max-w-3xl h-[600px] flex flex-col
        ${isDark ? 'bg-[#1e1e1e]' : 'bg-white'}`}>
        
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b
          ${isDark ? 'border-[#3c3c3c]' : 'border-gray-300'}`}>
          <div className="flex items-center gap-2">
            <Sparkles className="text-purple-500" size={24} />
            <h2 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>
              AI Assistant
            </h2>
            <span className={`text-xs px-2 py-1 rounded-full
              ${isDark ? 'bg-purple-900 text-purple-200' : 'bg-purple-100 text-purple-700'}`}>
              Beta
            </span>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-md transition-colors
              ${isDark ? 'hover:bg-[#37373d] text-[#cccccc]' : 'hover:bg-gray-200 text-gray-600'}`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <Message key={index} message={message} isDark={isDark} />
          ))}
          {loading && (
            <div className="flex items-center gap-2 text-purple-500">
              <RefreshCw size={16} className="animate-spin" />
              <span className="text-sm">Thinking...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className={`px-4 py-2 border-t
          ${isDark ? 'border-[#3c3c3c]' : 'border-gray-300'}`}>
          <div className="flex gap-2 overflow-x-auto">
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={() => {
                  setInput(action.prompt);
                  handleSend();
                }}
                disabled={loading}
                className={`px-3 py-1.5 text-xs rounded-full whitespace-nowrap transition-colors
                  ${isDark 
                    ? 'bg-[#37373d] text-[#cccccc] hover:bg-[#4a4a4f]' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  } disabled:opacity-50`}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input */}
        <div className={`p-4 border-t
          ${isDark ? 'border-[#3c3c3c]' : 'border-gray-300'}`}>
          <div className={`flex items-center gap-2 p-2 rounded-lg border
            ${isDark ? 'bg-[#252526] border-[#3c3c3c]' : 'bg-white border-gray-300'}`}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything about your code..."
              disabled={loading}
              className={`flex-1 bg-transparent outline-none text-sm
                ${isDark ? 'text-white placeholder-[#858585]' : 'text-gray-800 placeholder-gray-400'}
                disabled:opacity-50`}
            />
            <button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              className="p-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Message = ({ message, isDark }) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === 'user';

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Convert markdown to HTML
  const htmlContent = marked(message.content);

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] rounded-lg p-3 ${
        isUser
          ? 'bg-purple-600 text-white'
          : (isDark ? 'bg-[#252526] text-[#cccccc]' : 'bg-gray-100 text-gray-800')
      }`}>
        {isUser ? (
          <p className="text-sm">{message.content}</p>
        ) : (
          <div className="relative group">
            <div 
              className="text-sm prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
              style={{
                color: isDark ? '#cccccc' : '#1f2937',
              }}
            />
            <button
              onClick={() => handleCopy(message.content)}
              className={`absolute top-0 right-0 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity
                ${isDark ? 'bg-[#37373d] text-[#cccccc]' : 'bg-gray-200 text-gray-700'}`}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;
