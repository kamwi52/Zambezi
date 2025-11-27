import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Subject, QuizQuestion, SavedMaterial, Flashcard } from '../types';
import { ArrowLeft, BrainCircuit, Loader2, FileText, WifiOff, Download, Play, BookOpen, Layers, Upload, Search } from 'lucide-react';
import { generateQuiz, generateStudyNotes, generateFlashcards } from '../services/gemini';
import { saveMaterial, getMaterialsForTopic } from '../services/storage';
import QuizModal from '../components/QuizModal';
import StudyNoteModal from '../components/StudyNoteModal';
import FlashcardModal from '../components/FlashcardModal';
import PDFModal from '../components/PDFModal';

interface TopicViewProps {
  subject: Subject;
  grade: number;
  onBack: () => void;
  onUpdateScore: (score: number, subjectId: string) => void;
}

const TopicView: React.FC<TopicViewProps> = ({ subject, grade, onBack, onUpdateScore }) => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null); // 'quiz-topic', 'note-topic', or 'flash-topic'
  const [activeQuiz, setActiveQuiz] = useState<{data: QuizQuestion[], topic: string, fromSaved: boolean} | null>(null);
  const [activeNote, setActiveNote] = useState<{data: string, topic: string, fromSaved: boolean} | null>(null);
  const [activeFlashcards, setActiveFlashcards] = useState<{data: Flashcard[], topic: string, fromSaved: boolean} | null>(null);
  const [activePDF, setActivePDF] = useState<{data: string, topic: string, title: string} | null>(null);
  
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [savedItems, setSavedItems] = useState<SavedMaterial[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingTopic, setUploadingTopic] = useState<string | null>(null);

  // Monitor online status
  useEffect(() => {
    const handleStatusChange = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  const refreshSavedItems = () => {
    const all = localStorage.getItem('zambezi_offline_content');
    if (all) {
      const parsed: SavedMaterial[] = JSON.parse(all);
      setSavedItems(parsed.filter(p => p.subjectId === subject.id));
    }
  };

  useEffect(() => {
    refreshSavedItems();
  }, [subject.id]);

  // Get topics specifically for this grade
  const allTopics = subject.topicsByGrade[grade] || [];
  
  const filteredTopics = useMemo(() => {
    if (!searchQuery.trim()) return allTopics;
    return allTopics.filter(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [allTopics, searchQuery]);

  const handleGenerateQuiz = async (topic: string) => {
    if (!isOnline) return;
    setLoadingAction(`quiz-${topic}`);
    try {
      const questions = await generateQuiz(subject.name, topic, grade);
      if (questions && questions.length > 0) {
        setActiveQuiz({ data: questions, topic, fromSaved: false });
      } else {
        alert("Could not generate quiz. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Error generating quiz.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleGenerateNotes = async (topic: string) => {
    if (!isOnline) return;
    setLoadingAction(`note-${topic}`);
    try {
      const notes = await generateStudyNotes(subject.name, topic, grade);
      if (notes) {
        setActiveNote({ data: notes, topic, fromSaved: false });
      }
    } catch (error) {
      console.error(error);
      alert("Error generating notes.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleGenerateFlashcards = async (topic: string) => {
    if (!isOnline) return;
    setLoadingAction(`flash-${topic}`);
    try {
      const cards = await generateFlashcards(subject.name, topic, grade);
      if (cards && cards.length > 0) {
        setActiveFlashcards({ data: cards, topic, fromSaved: false });
      } else {
        alert("Could not generate flashcards. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Error generating flashcards.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleUploadClick = (topic: string) => {
    setUploadingTopic(topic);
    if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Reset
        fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && uploadingTopic) {
        if (file.type !== 'application/pdf') {
            alert("Please upload a PDF file.");
            return;
        }
        if (file.size > 2 * 1024 * 1024) { // 2MB limit for localStorage safety
            alert("File is too large. Please upload a PDF smaller than 2MB.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64 = event.target?.result as string;
            saveMaterial({
                id: Date.now().toString(),
                type: 'pdf',
                subjectId: subject.id,
                subjectName: subject.name,
                topic: uploadingTopic,
                grade: grade,
                title: file.name, // Use filename as title
                content: base64,
                timestamp: Date.now()
            });
            refreshSavedItems();
            setUploadingTopic(null);
            alert("PDF uploaded and saved successfully!");
        };
        reader.readAsDataURL(file);
    }
  };

  const handleSaveQuiz = (topic: string, data: QuizQuestion[]) => {
    saveMaterial({
      id: Date.now().toString(),
      type: 'quiz',
      subjectId: subject.id,
      subjectName: subject.name,
      topic: topic,
      grade: grade,
      title: `${topic} Quiz`,
      content: data,
      timestamp: Date.now()
    });
    refreshSavedItems();
  };

  const handleSaveNote = (topic: string, data: string) => {
    saveMaterial({
      id: Date.now().toString(),
      type: 'note',
      subjectId: subject.id,
      subjectName: subject.name,
      topic: topic,
      grade: grade,
      title: `${topic} Notes`,
      content: data,
      timestamp: Date.now()
    });
    refreshSavedItems();
  };

  const handleSaveFlashcards = (topic: string, data: Flashcard[]) => {
    saveMaterial({
      id: Date.now().toString(),
      type: 'flashcard',
      subjectId: subject.id,
      subjectName: subject.name,
      topic: topic,
      grade: grade,
      title: `${topic} Flashcards`,
      content: data,
      timestamp: Date.now()
    });
    refreshSavedItems();
  };

  const openSavedItem = (item: SavedMaterial) => {
    if (item.type === 'quiz') {
      setActiveQuiz({ data: item.content, topic: item.topic, fromSaved: true });
    } else if (item.type === 'note') {
      setActiveNote({ data: item.content, topic: item.topic, fromSaved: true });
    } else if (item.type === 'flashcard') {
      setActiveFlashcards({ data: item.content, topic: item.topic, fromSaved: true });
    } else if (item.type === 'pdf') {
        setActivePDF({ data: item.content, topic: item.topic, title: item.title });
    }
  };

  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="application/pdf"
      />

      {/* Quiz Modal */}
      {activeQuiz && (
        <QuizModal 
          questions={activeQuiz.data} 
          subjectName={subject.name} 
          onClose={() => setActiveQuiz(null)} 
          onComplete={(score) => {
            onUpdateScore(score, subject.id);
            if(activeQuiz.fromSaved) setActiveQuiz(null); // Just close if it was saved
          }}
          isSaved={activeQuiz.fromSaved}
          onSave={!activeQuiz.fromSaved ? () => handleSaveQuiz(activeQuiz.topic, activeQuiz.data) : undefined}
        />
      )}

      {/* Note Modal */}
      {activeNote && (
        <StudyNoteModal
          title={`Study Notes: ${activeNote.topic}`}
          content={activeNote.data}
          subjectName={subject.name}
          onClose={() => setActiveNote(null)}
          isSaved={activeNote.fromSaved}
          onSave={!activeNote.fromSaved ? () => handleSaveNote(activeNote.topic, activeNote.data) : undefined}
        />
      )}

      {/* Flashcard Modal */}
      {activeFlashcards && (
        <FlashcardModal
          cards={activeFlashcards.data}
          topic={activeFlashcards.topic}
          subjectName={subject.name}
          onClose={() => setActiveFlashcards(null)}
          isSaved={activeFlashcards.fromSaved}
          onSave={!activeFlashcards.fromSaved ? () => handleSaveFlashcards(activeFlashcards.topic, activeFlashcards.data) : undefined}
        />
      )}

      {/* PDF Modal */}
      {activePDF && (
        <PDFModal
          title={activePDF.title}
          content={activePDF.data}
          subjectName={subject.name}
          onClose={() => setActivePDF(null)}
        />
      )}

      <button onClick={onBack} className="flex items-center text-gray-500 hover:text-gray-800 mb-6 font-medium">
        <ArrowLeft size={20} className="mr-2" /> Back to Subjects
      </button>

      <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-2xl ${subject.color} text-white shadow-lg`}>
             <BookOpen size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{subject.name}</h1>
            <p className="text-gray-500">Grade {grade} Syllabus</p>
          </div>
        </div>
        {!isOnline && (
          <div className="bg-orange-100 text-orange-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
            <WifiOff size={16} /> Offline Mode
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-end mb-4 gap-4">
        <h2 className="font-semibold text-gray-700 uppercase text-xs tracking-wider">Topics ({filteredTopics.length})</h2>
        
        {/* Topic Search Bar */}
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search topics..."
            className="block w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all text-sm"
          />
        </div>
      </div>
      
      <div className="space-y-4">
        {filteredTopics.length > 0 ? (
          filteredTopics.map((topic, index) => {
            const topicSavedItems = savedItems.filter(i => i.topic === topic);
            const hasSavedQuiz = topicSavedItems.some(i => i.type === 'quiz');
            const hasSavedNote = topicSavedItems.some(i => i.type === 'note');
            const hasSavedFlash = topicSavedItems.some(i => i.type === 'flashcard');
            const savedPDF = topicSavedItems.find(i => i.type === 'pdf');

            return (
              <div key={index} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-sm flex-shrink-0">
                    {/* Maintain original index number if needed, but here filtered list makes index dynamic */}
                    {allTopics.indexOf(topic) + 1}
                  </div>
                  <span className="font-semibold text-gray-800 text-lg">{topic}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:pl-12">
                  {/* Quiz Action */}
                  {isOnline ? (
                    <button 
                      onClick={() => handleGenerateQuiz(topic)}
                      disabled={!!loadingAction}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg font-medium hover:bg-purple-100 transition-colors disabled:opacity-50 text-sm"
                    >
                      {loadingAction === `quiz-${topic}` ? <Loader2 className="animate-spin" size={16} /> : <BrainCircuit size={16} />}
                      {loadingAction === `quiz-${topic}` ? "Generating..." : "Take Quiz"}
                    </button>
                  ) : (
                    hasSavedQuiz ? (
                      <button 
                        onClick={() => openSavedItem(topicSavedItems.find(i => i.type === 'quiz')!)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg font-medium hover:bg-purple-100 transition-colors text-sm"
                      >
                        <Play size={16} /> Play Saved Quiz
                      </button>
                    ) : (
                      <button disabled className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 text-gray-400 rounded-lg font-medium border border-gray-100 text-sm cursor-not-allowed">
                         <WifiOff size={14} /> Quiz Unavailable
                      </button>
                    )
                  )}

                  {/* Notes Action */}
                  {isOnline ? (
                    <button 
                      onClick={() => handleGenerateNotes(topic)}
                      disabled={!!loadingAction}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-colors disabled:opacity-50 text-sm"
                    >
                       {loadingAction === `note-${topic}` ? <Loader2 className="animate-spin" size={16} /> : <FileText size={16} />}
                       {loadingAction === `note-${topic}` ? "Writing..." : "Study Notes"}
                    </button>
                  ) : (
                    hasSavedNote ? (
                       <button 
                        onClick={() => openSavedItem(topicSavedItems.find(i => i.type === 'note')!)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-colors text-sm"
                      >
                        <BookOpen size={16} /> Read Saved Notes
                      </button>
                    ) : (
                      <button disabled className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 text-gray-400 rounded-lg font-medium border border-gray-100 text-sm cursor-not-allowed">
                         <WifiOff size={14} /> Notes Unavailable
                      </button>
                    )
                  )}

                   {/* Flashcards Action */}
                   {isOnline ? (
                    <button 
                      onClick={() => handleGenerateFlashcards(topic)}
                      disabled={!!loadingAction}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-lg font-medium hover:bg-orange-100 transition-colors disabled:opacity-50 text-sm"
                    >
                       {loadingAction === `flash-${topic}` ? <Loader2 className="animate-spin" size={16} /> : <Layers size={16} />}
                       {loadingAction === `flash-${topic}` ? "Creating..." : "Flashcards"}
                    </button>
                  ) : (
                    hasSavedFlash ? (
                       <button 
                        onClick={() => openSavedItem(topicSavedItems.find(i => i.type === 'flashcard')!)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 rounded-lg font-medium hover:bg-orange-100 transition-colors text-sm"
                      >
                        <Layers size={16} /> Open Flashcards
                      </button>
                    ) : (
                      <button disabled className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 text-gray-400 rounded-lg font-medium border border-gray-100 text-sm cursor-not-allowed">
                         <WifiOff size={14} /> Cards Unavailable
                      </button>
                    )
                  )}

                  {/* PDF Upload / Open Action */}
                  {savedPDF ? (
                     <button 
                        onClick={() => openSavedItem(savedPDF)}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg font-medium hover:bg-red-100 transition-colors text-sm"
                      >
                        <FileText size={16} /> Open PDF
                      </button>
                  ) : (
                      <button 
                          onClick={() => handleUploadClick(topic)}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm border border-gray-200"
                      >
                          <Upload size={16} /> Upload PDF
                      </button>
                  )}
                </div>

                {/* Saved Indicators */}
                {(hasSavedQuiz || hasSavedNote || hasSavedFlash || savedPDF) && (
                  <div className="md:pl-12 flex flex-wrap gap-2">
                    {hasSavedQuiz && <span className="inline-flex items-center gap-1 text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded border border-green-100"><Download size={10} /> Quiz Saved</span>}
                    {hasSavedNote && <span className="inline-flex items-center gap-1 text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded border border-green-100"><Download size={10} /> Notes Saved</span>}
                    {hasSavedFlash && <span className="inline-flex items-center gap-1 text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded border border-green-100"><Download size={10} /> Cards Saved</span>}
                    {savedPDF && <span className="inline-flex items-center gap-1 text-[10px] bg-green-50 text-green-700 px-2 py-1 rounded border border-green-100"><Download size={10} /> PDF Saved</span>}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-center p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            {searchQuery ? (
                <p className="text-gray-500">No topics found matching "{searchQuery}"</p>
            ) : (
                <p className="text-gray-500">No specific topics found for Grade {grade}.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TopicView;