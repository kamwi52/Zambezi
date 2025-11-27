import React, { useState, useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import SubjectsList from './pages/SubjectsList';
import TutorChat from './pages/TutorChat';
import TopicView from './pages/TopicView';
import Downloads from './pages/Downloads';
import Login from './pages/Login';
import Payment from './pages/Payment';
import ProfileSetup from './pages/ProfileSetup';
import { INITIAL_PROGRESS } from './constants';
import { UserProgress, Subject, User, GradeLevel } from './types';
import { Wifi, WifiOff } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [userProgress, setUserProgress] = useState<UserProgress>(INITIAL_PROGRESS);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showToast, setShowToast] = useState<{message: string, type: 'success' | 'warning'} | null>(null);
  
  // Auth State
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('zambezi_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Sync user grade to progress
  useEffect(() => {
    if (user?.grade) {
      setUserProgress(prev => ({ ...prev, grade: user.grade! }));
    }
  }, [user]);

  useEffect(() => {
    const handleOnline = () => {
        setIsOnline(true);
        setShowToast({ message: "You are back online. Downloads can now be updated.", type: 'success' });
        setTimeout(() => setShowToast(null), 4000);
    };
    const handleOffline = () => {
        setIsOnline(false);
        setShowToast({ message: "You are offline. Showing downloaded materials only.", type: 'warning' });
        setTimeout(() => setShowToast(null), 4000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleUpdateScore = (score: number, subjectId: string) => {
    setUserProgress(prev => {
      const currentMastery = prev.subjectMastery[subjectId] || 0;
      const newMastery = Math.min(100, currentMastery + 5); 
      
      return {
        ...prev,
        completedQuizzes: prev.completedQuizzes + 1,
        averageScore: Math.round((prev.averageScore * prev.completedQuizzes + (score * 20)) / (prev.completedQuizzes + 1)), 
        subjectMastery: {
          ...prev.subjectMastery,
          [subjectId]: newMastery
        }
      };
    });
  };

  const handleLogin = (phoneNumber: string) => {
    // Check "Database" for existing user info
    const db = JSON.parse(localStorage.getItem('zambezi_users_db') || '{}');
    const existingUser = db[phoneNumber];

    const userData: User = {
        phoneNumber,
        hasPaid: existingUser ? existingUser.hasPaid : false,
        subscriptionDate: existingUser ? existingUser.subscriptionDate : undefined,
        grade: existingUser ? existingUser.grade : undefined,
        name: existingUser ? existingUser.name : undefined,
        nickname: existingUser ? existingUser.nickname : undefined,
        profileSetupComplete: existingUser ? existingUser.profileSetupComplete : false
    };

    setUser(userData);
    localStorage.setItem('zambezi_user', JSON.stringify(userData));
  };

  const handlePayment = () => {
    if (!user) return;
    
    const updatedUser: User = {
        ...user,
        hasPaid: true,
        subscriptionDate: Date.now()
    };

    setUser(updatedUser);
    localStorage.setItem('zambezi_user', JSON.stringify(updatedUser));
    updateUserInDb(updatedUser);
  };

  const handleProfileComplete = (data: Partial<User>) => {
    if (!user) return;
    const updatedUser: User = {
      ...user,
      ...data,
      profileSetupComplete: true
    };
    setUser(updatedUser);
    localStorage.setItem('zambezi_user', JSON.stringify(updatedUser));
    updateUserInDb(updatedUser);
    setCurrentView('dashboard'); // Ensure we land on dashboard
  };

  const updateUserInDb = (updatedUser: User) => {
    const db = JSON.parse(localStorage.getItem('zambezi_users_db') || '{}');
    db[updatedUser.phoneNumber] = updatedUser;
    localStorage.setItem('zambezi_users_db', JSON.stringify(db));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('zambezi_user');
    setCurrentView('dashboard');
    setSelectedSubject(null);
  };

  // Auth & Onboarding Flow
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  if (!user.hasPaid) {
    return <Payment user={user} onPaymentSuccess={handlePayment} onLogout={handleLogout} />;
  }

  if (!user.profileSetupComplete) {
    return <ProfileSetup user={user} onComplete={handleProfileComplete} />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navigation 
        currentView={currentView} 
        onNavigate={(view) => {
          setCurrentView(view);
          if(view !== 'subjects') setSelectedSubject(null);
        }} 
        onLogout={handleLogout}
      />

      <main className="flex-1 md:ml-64 relative">
        {/* Mobile Header Spacer */}
        <div className="md:hidden h-16"></div>

        {/* Offline Toast */}
        {showToast && (
          <div className={`fixed top-4 right-4 z-[60] px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 animate-fade-in ${
            showToast.type === 'success' ? 'bg-green-600 text-white' : 'bg-orange-500 text-white'
          }`}>
             {showToast.type === 'success' ? <Wifi size={20} /> : <WifiOff size={20} />}
             <span className="text-sm font-medium">{showToast.message}</span>
          </div>
        )}

        {currentView === 'dashboard' && (
          <Dashboard 
            progress={userProgress} 
            onNavigate={setCurrentView} 
            userName={user.nickname || user.name}
          />
        )}

        {currentView === 'subjects' && !selectedSubject && (
          <SubjectsList 
            onSelectSubject={(subject) => {
              setSelectedSubject(subject);
              // View stays 'subjects' but renders TopicView conditionally below
            }} 
            grade={user.grade!}
          />
        )}

        {currentView === 'subjects' && selectedSubject && (
          <TopicView 
            subject={selectedSubject}
            grade={user.grade!}
            onBack={() => setSelectedSubject(null)}
            onUpdateScore={handleUpdateScore}
          />
        )}

        {currentView === 'tutor' && (
          <TutorChat grade={user.grade!} />
        )}

        {currentView === 'downloads' && (
          <Downloads />
        )}
      </main>
    </div>
  );
};

export default App;