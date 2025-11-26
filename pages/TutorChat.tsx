import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, GradeLevel } from '../types';
import { Send, User, Bot, Sparkles, Loader2 } from 'lucide-react';
import { generateTutorResponse } from '../services/gemini';
import ReactMarkdown from 'react-markdown';

interface TutorChatProps {
  grade: GradeLevel;
}

const TutorChat: React.FC<TutorChatProps> = ({ grade }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `Hello! I'm your Zambezi AI Tutor. I can help you with your Grade ${grade} studies. What topic are you working on today?`,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const responseText = await generateTutorResponse(messages, inputText, grade);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "I'm having trouble connecting to the knowledge base. Please check your internet connection or try again later.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4 shadow-sm flex items-center gap-3">
        <div className="bg-green-100 p-2 rounded-full">
          <Sparkles className="text-green-600" size={20} />
        </div>
        <div>
          <h2 className="font-bold text-gray-800">AI Tutor</h2>
          <p className="text-xs text-green-600 font-medium">Online • Grade {grade}</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-24 md:pb-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              msg.role === 'user' ? 'bg-gray-200 text-gray-600' : 'bg-green-600 text-white'
            }`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            
            <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl shadow-sm text-sm md:text-base ${
              msg.role === 'user' 
                ? 'bg-white text-gray-800 rounded-tr-none' 
                : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
            }`}>
              <ReactMarkdown 
                className="prose prose-sm max-w-none prose-p:mb-2 prose-strong:text-green-700 prose-headings:text-green-800"
                components={{
                  // Enhance list styling
                  ul: ({node, ...props}) => <ul className="list-disc pl-4 space-y-1" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-4 space-y-1" {...props} />
                }}
              >
                {msg.text}
              </ReactMarkdown>
              <div className="text-[10px] text-gray-400 mt-2 text-right">
                {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex items-start gap-3">
             <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">
              <Bot size={16} />
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex items-center gap-2">
              <Loader2 className="animate-spin text-green-600" size={16} />
              <span className="text-sm text-gray-500">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t safe-area-bottom mb-16 md:mb-0">
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2 border border-transparent focus-within:border-green-500 focus-within:bg-white focus-within:shadow-md transition-all">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask a question about your subjects..."
            className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 py-2"
          />
          <button 
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
            className={`p-2 rounded-full transition-colors ${
              inputText.trim() && !isLoading ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-200 text-gray-400'
            }`}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TutorChat;
