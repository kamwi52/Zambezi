import React from 'react';
import { Home, BookOpen, MessageCircle, BarChart2 } from 'lucide-react';

interface NavigationProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'subjects', label: 'Subjects', icon: BookOpen },
    { id: 'tutor', label: 'AI Tutor', icon: MessageCircle },
    { id: 'progress', label: 'Progress', icon: BarChart2 },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r h-screen fixed left-0 top-0 z-10">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-green-700 flex items-center gap-2">
            <span className="text-3xl">🇿🇲</span> Zambezi
          </h1>
          <p className="text-xs text-gray-500 mt-1">Smart Learning App</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all font-medium ${
                currentView === item.id
                  ? 'bg-green-100 text-green-800'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom pb-safe">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${
                currentView === item.id ? 'text-green-600' : 'text-gray-400'
              }`}
            >
              <item.icon size={20} strokeWidth={currentView === item.id ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  );
};

export default Navigation;
