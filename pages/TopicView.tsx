import React, { useState } from 'react';
import { Subject, QuizQuestion } from '../types';
import { ArrowLeft, PlayCircle, BookOpen, BrainCircuit, Loader2 } from 'lucide-react';
import { generateQuiz } from '../services/gemini';
import QuizModal from '../components/QuizModal';

interface TopicViewProps {
  subject: Subject;
  grade: number;
  onBack: () => void;
  onUpdateScore: (score: number, subjectId: string) => void;
}

const TopicView: React.FC<TopicViewProps> = ({ subject, grade, onBack, onUpdateScore }) => {
  const [loadingQuiz, setLoadingQuiz] = useState<string | null>(null); // Topic name if loading
  const [quizData, setQuizData] = useState<QuizQuestion[] | null>(null);

  const handleStartQuiz = async (topic: string) => {
    setLoadingQuiz(topic);
    try {
      const questions = await generateQuiz(subject.name, topic, grade);
      if (questions && questions.length > 0) {
        setQuizData(questions);
      } else {
        alert("Could not generate quiz at this moment. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Error generating quiz.");
    } finally {
      setLoadingQuiz(null);
    }
  };

  const handleQuizComplete = (score: number) => {
    onUpdateScore(score, subject.id);
    setQuizData(null);
  };

  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8">
      {quizData && (
        <QuizModal 
          questions={quizData} 
          subjectName={subject.name} 
          onClose={() => setQuizData(null)} 
          onComplete={handleQuizComplete}
        />
      )}

      <button onClick={onBack} className="flex items-center text-gray-500 hover:text-gray-800 mb-6 font-medium">
        <ArrowLeft size={20} className="mr-2" /> Back to Subjects
      </button>

      <div className="flex items-center gap-4 mb-8">
        <div className={`p-4 rounded-2xl ${subject.color} text-white shadow-lg`}>
           {/* We don't have the icon component here easily without passing it, but generic icon works for header */}
           <BookOpen size={32} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{subject.name}</h1>
          <p className="text-gray-500">Grade {grade} Syllabus</p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-semibold text-gray-700 uppercase text-xs tracking-wider mb-2">Topics</h2>
        {subject.topics.map((topic, index) => (
          <div key={index} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-sm">
                {index + 1}
              </div>
              <span className="font-semibold text-gray-800 text-lg">{topic}</span>
            </div>
            
            <div className="flex gap-2">
              <button 
                onClick={() => handleStartQuiz(topic)}
                disabled={!!loadingQuiz}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-colors disabled:opacity-50"
              >
                {loadingQuiz === topic ? <Loader2 className="animate-spin" size={18} /> : <BrainCircuit size={18} />}
                {loadingQuiz === topic ? "Generating..." : "Take Quiz"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopicView;
