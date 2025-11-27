import React, { useState } from 'react';
import { Flashcard } from '../types';
import { X, Download, Check, ChevronLeft, ChevronRight, RotateCw, Layers } from 'lucide-react';

interface FlashcardModalProps {
  cards: Flashcard[];
  subjectName: string;
  topic: string;
  onClose: () => void;
  onSave?: () => void;
  isSaved?: boolean;
}

const FlashcardModal: React.FC<FlashcardModalProps> = ({ cards, subjectName, topic, onClose, onSave, isSaved = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [hasSaved, setHasSaved] = useState(isSaved);

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(c => c + 1), 150);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setIsFlipped(false);
      setTimeout(() => setCurrentIndex(c => c - 1), 150);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave();
      setHasSaved(true);
    }
  };

  const currentCard = cards[currentIndex];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] animate-scale-up">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                <Layers size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">{topic}</h3>
              <p className="text-xs text-gray-500 uppercase font-semibold">{subjectName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onSave && (
              <button 
                onClick={handleSave} 
                disabled={hasSaved}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    hasSaved ? 'bg-green-100 text-green-700' : 'bg-white border hover:bg-gray-50 text-gray-700'
                }`}
              >
                {hasSaved ? <Check size={16} /> : <Download size={16} />}
              </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6 md:p-10 flex-1 flex flex-col items-center justify-center bg-gray-100/50">
           <div 
             onClick={() => setIsFlipped(!isFlipped)}
             className="w-full aspect-[4/3] md:aspect-[16/9] cursor-pointer perspective-1000 group relative"
           >
             <div className={`relative w-full h-full duration-500 preserve-3d transition-all transform ${isFlipped ? 'rotate-y-180' : ''}`}>
               {/* Front */}
               <div className={`absolute inset-0 w-full h-full bg-white rounded-2xl shadow-xl border-b-4 border-gray-200 flex flex-col items-center justify-center p-8 text-center backface-hidden ${isFlipped ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                 <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Question</span>
                 <p className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed">
                   {currentCard.front}
                 </p>
                 <div className="absolute bottom-4 text-gray-400 text-xs flex items-center gap-1">
                   <RotateCw size={12} /> Tap to flip
                 </div>
               </div>

               {/* Back */}
               <div className={`absolute inset-0 w-full h-full bg-purple-600 rounded-2xl shadow-xl border-b-4 border-purple-800 flex flex-col items-center justify-center p-8 text-center backface-hidden ${isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                 <span className="text-xs font-bold text-purple-200 uppercase tracking-widest mb-4">Answer</span>
                 <p className="text-lg md:text-xl font-medium text-white leading-relaxed">
                   {currentCard.back}
                 </p>
                 <div className="absolute bottom-4 text-purple-200 text-xs flex items-center gap-1">
                   <RotateCw size={12} /> Tap to flip back
                 </div>
               </div>
             </div>
           </div>
        </div>

        {/* Footer / Controls */}
        <div className="p-4 border-t bg-white rounded-b-2xl flex items-center justify-between">
            <button 
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="p-3 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={24} />
            </button>

            <div className="text-sm font-medium text-gray-500">
              Card {currentIndex + 1} of {cards.length}
            </div>

            <button 
              onClick={handleNext}
              disabled={currentIndex === cards.length - 1}
              className="p-3 rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={24} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default FlashcardModal;