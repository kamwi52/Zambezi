import React, { useState } from 'react';
import { HashRouter } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import SubjectsList from './pages/SubjectsList';
import TutorChat from './pages/TutorChat';
import TopicView from './pages/TopicView';
import { INITIAL_PROGRESS } from './constants';
import { UserProgress, Subject } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [userProgress, setUserProgress] = useState<UserProgress>(INITIAL_PROGRESS);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  const handleUpdateScore = (score: number, subjectId: string) => {
    setUserProgress(prev => {
      // Simple mastery calculation logic for demo
      const currentMastery = prev.subjectMastery[subjectId] || 0;
      // Mastery increases by 5% per correct quiz, max 100%
      const newMastery = Math.min(100, currentMastery + 5); 
      
      return {
        ...prev,
        completedQuizzes: prev.completedQuizzes + 1,
        averageScore: Math.round((prev.averageScore * prev.completedQuizzes + (score * 20)) / (prev.completedQuizzes + 1)), // score is usually out of 5, so *20 for %
        subjectMastery: {
          ...prev.subjectMastery,
          [subjectId]: newMastery
        }
      };
    });
  };

  const renderContent = () => {
    if (selectedSubject) {
      return (
        <TopicView 
          subject={selectedSubject} 
          grade={userProgress.grade}
          onBack={() => setSelectedSubject(null)}
          onUpdateScore={handleUpdateScore}
        />
      );
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard progress={userProgress} onNavigate={setCurrentView} />;
      case 'subjects':
        return <SubjectsList onSelectSubject={setSelectedSubject} />;
      case 'tutor':
        return <TutorChat grade={userProgress.grade} />;
      case 'progress':
        // Reuse Dashboard for now as it has progress, but focused differently in a real app
        return <Dashboard progress={userProgress} onNavigate={setCurrentView} />;
      default:
        return <Dashboard progress={userProgress} onNavigate={setCurrentView} />;
    }
  };

  return (
    <HashRouter>
      <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans">
        <Navigation 
          currentView={selectedSubject ? 'subjects' : currentView} 
          onNavigate={(view) => {
            setCurrentView(view);
            setSelectedSubject(null);
          }} 
        />
        
        <main className="flex-1 md:ml-64 relative min-h-screen">
          {renderContent()}
        </main>
      </div>
    </HashRouter>
  );
};

export default App;
