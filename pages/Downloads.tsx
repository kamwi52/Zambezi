import React, { useEffect, useState } from 'react';
import { getMaterials, deleteMaterial, updateMaterial } from '../services/storage';
import { SavedMaterial, QuizQuestion, Flashcard } from '../types';
import { Trash2, FileText, BrainCircuit, Calendar, ChevronRight, Layers, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { generateQuiz, generateStudyNotes, generateFlashcards } from '../services/gemini';
import QuizModal from '../components/QuizModal';
import StudyNoteModal from '../components/StudyNoteModal';
import FlashcardModal from '../components/FlashcardModal';
import PDFModal from '../components/PDFModal';

const Downloads: React.FC = () => {
  const [materials, setMaterials] = useState<SavedMaterial[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<SavedMaterial | null>(null);
  const [activeNote, setActiveNote] = useState<SavedMaterial | null>(null);
  const [activeFlash, setActiveFlash] = useState<SavedMaterial | null>(null);
  const [activePDF, setActivePDF] = useState<SavedMaterial | null>(null);
  
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadMaterials = () => {
    setMaterials(getMaterials());
  };

  useEffect(() => {
    loadMaterials();
    
    const handleStatusChange = () => setIsOnline(navigator.onLine);
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    return () => {
        window.removeEventListener('online', handleStatusChange);
        window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this item?")) {
      deleteMaterial(id);
      loadMaterials();
    }
  };

  const handleUpdate = async (e: React.MouseEvent, item: SavedMaterial) => {
    e.stopPropagation();
    if (!isOnline) return;
    if (item.type === 'pdf') return; // Cannot regenerate PDF

    if (!window.confirm(`Update "${item.title}"? This will regenerate the content using AI.`)) {
        return;
    }

    setUpdatingId(item.id);
    try {
        let newContent = null;
        if (item.type === 'quiz') {
            newContent = await generateQuiz(item.subjectName, item.topic, item.grade);
        } else if (item.type === 'note') {
            newContent = await generateStudyNotes(item.subjectName, item.topic, item.grade);
        } else if (item.type === 'flashcard') {
            newContent = await generateFlashcards(item.subjectName, item.topic, item.grade);
        }

        if (newContent) {
             updateMaterial(item.id, newContent);
             loadMaterials();
        } else {
            alert("Could not generate new content. Please try again.");
        }
    } catch (error) {
        console.error("Update failed", error);
        alert("Failed to update material. Please check your connection.");
    } finally {
        setUpdatingId(null);
    }
  };

  const handleOpen = (item: SavedMaterial) => {
    if (item.type === 'quiz') {
      setActiveQuiz(item);
    } else if (item.type === 'note') {
      setActiveNote(item);
    } else if (item.type === 'flashcard') {
      setActiveFlash(item);
    } else if (item.type === 'pdf') {
      setActivePDF(item);
    }
  };

  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
            <h1 className="text-2xl font-bold text-gray-800">Downloaded Materials</h1>
            <span className="text-sm text-gray-500">{materials.length} items saved</span>
        </div>
        {!isOnline && (
             <div className="flex items-center gap-1 text-orange-600 bg-orange-50 px-3 py-1 rounded-full text-xs font-medium border border-orange-100">
                <WifiOff size={14} /> Offline
             </div>
        )}
      </div>

      {materials.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-2xl border border-dashed border-gray-300">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
            <FileText size={32} />
          </div>
          <p className="text-gray-500 font-medium">No downloads yet.</p>
          <p className="text-sm text-gray-400 mt-1">Generate quizzes, notes, or flashcards to save them here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {materials.map((item) => (
            <div 
              key={item.id}
              onClick={() => handleOpen(item)}
              className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group relative"
            >
              <div className="flex justify-between items-start mb-3">
                <div className={`p-2.5 rounded-xl ${
                    item.type === 'quiz' ? 'bg-purple-100 text-purple-600' : 
                    item.type === 'note' ? 'bg-blue-100 text-blue-600' :
                    item.type === 'flashcard' ? 'bg-orange-100 text-orange-600' :
                    'bg-red-100 text-red-600'
                }`}>
                  {item.type === 'quiz' ? <BrainCircuit size={20} /> : 
                   item.type === 'note' ? <FileText size={20} /> : 
                   item.type === 'flashcard' ? <Layers size={20} /> :
                   <FileText size={20} />}
                </div>
                <div className="flex items-center gap-1">
                    {/* Update Button (Only when online and not PDF) */}
                    {isOnline && item.type !== 'pdf' && (
                        <button
                            onClick={(e) => handleUpdate(e, item)}
                            disabled={!!updatingId}
                            className={`p-2 rounded-full transition-colors ${
                                updatingId === item.id 
                                    ? 'text-blue-500 bg-blue-50 animate-spin' 
                                    : 'text-gray-300 hover:text-blue-500 hover:bg-blue-50'
                            }`}
                            title="Update Content (Regenerate)"
                        >
                            <RefreshCw size={18} />
                        </button>
                    )}
                    <button 
                      onClick={(e) => handleDelete(e, item.id)}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                </div>
              </div>
              
              <h3 className="font-bold text-gray-800 mb-1 line-clamp-1">{item.title}</h3>
              <p className="text-xs text-green-600 font-semibold uppercase tracking-wide mb-3">{item.subjectName}</p>
              
              <div className="flex items-center text-gray-400 text-xs gap-3 pt-3 border-t border-gray-50">
                <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>{new Date(item.timestamp).toLocaleDateString()}</span>
                </div>
                <div className="ml-auto flex items-center gap-1 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
                    Open <ChevronRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Render Modals if active */}
      {activeQuiz && (
        <QuizModal
          questions={activeQuiz.content as QuizQuestion[]}
          subjectName={activeQuiz.subjectName}
          onClose={() => setActiveQuiz(null)}
          onComplete={() => {}} // No scoring update for offline/review mode
          isSaved={true}
        />
      )}

      {activeNote && (
        <StudyNoteModal
            title={activeNote.title}
            content={activeNote.content as string}
            subjectName={activeNote.subjectName}
            onClose={() => setActiveNote(null)}
            isSaved={true}
        />
      )}

      {activeFlash && (
        <FlashcardModal
          cards={activeFlash.content as Flashcard[]}
          subjectName={activeFlash.subjectName}
          topic={activeFlash.topic}
          onClose={() => setActiveFlash(null)}
          isSaved={true}
        />
      )}

      {activePDF && (
        <PDFModal
          title={activePDF.title}
          content={activePDF.content as string}
          subjectName={activePDF.subjectName}
          onClose={() => setActivePDF(null)}
          isSaved={true}
        />
      )}
    </div>
  );
};

export default Downloads;