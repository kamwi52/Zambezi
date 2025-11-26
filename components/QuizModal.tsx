import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { CheckCircle, XCircle, ChevronRight, RefreshCw, X } from 'lucide-react';

interface QuizModalProps {
  questions: QuizQuestion[];
  subjectName: string;
  onClose: () => void;
  onComplete: (score: number) => void;
}

const QuizModal: React.FC<QuizModalProps> = ({ questions, subjectName, onClose, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleOptionSelect = (index: number) => {
    if (isSubmitted) return;
    setSelectedOption(index);
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    setIsSubmitted(true);
    if (selectedOption === questions[currentIndex].correctAnswerIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setShowResult(true);
      onComplete(score + (selectedOption === questions[currentIndex].correctAnswerIndex ? 0 : 0)); // Score is already updated
    }
  };

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-md p-6 text-center shadow-xl animate-scale-up">
          <div className="mb-4 flex justify-center">
            {percentage >= 70 ? (
               <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                 <CheckCircle size={40} />
               </div>
            ) : (
               <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
                 <RefreshCw size={40} />
               </div>
            )}
          </div>
          <h2 className="text-2xl font-bold mb-2">{percentage >= 70 ? "Great Job!" : "Keep Practicing!"}</h2>
          <p className="text-gray-500 mb-6">You scored {score} out of {questions.length} in {subjectName}.</p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200"
            >
              Close
            </button>
            <button 
              onClick={onClose} // Simplified reset logic by just closing for now
              className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
            >
              Finish
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center">
          <div>
            <span className="text-xs font-bold text-green-600 uppercase tracking-wide">{subjectName} Quiz</span>
            <div className="text-gray-400 text-xs">Question {currentIndex + 1} of {questions.length}</div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 leading-relaxed">
            {currentQ.question}
          </h3>

          <div className="space-y-3">
            {currentQ.options.map((option, idx) => {
              let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all flex justify-between items-center ";
              if (isSubmitted) {
                if (idx === currentQ.correctAnswerIndex) {
                  btnClass += "border-green-500 bg-green-50 text-green-800";
                } else if (idx === selectedOption) {
                  btnClass += "border-red-400 bg-red-50 text-red-800";
                } else {
                  btnClass += "border-gray-100 bg-gray-50 text-gray-400 opacity-60";
                }
              } else {
                if (selectedOption === idx) {
                  btnClass += "border-green-500 bg-green-50 text-green-900 shadow-sm";
                } else {
                  btnClass += "border-gray-200 hover:border-green-300 hover:bg-gray-50 text-gray-700";
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  disabled={isSubmitted}
                  className={btnClass}
                >
                  <span className="font-medium">{option}</span>
                  {isSubmitted && idx === currentQ.correctAnswerIndex && <CheckCircle size={18} className="text-green-600"/>}
                  {isSubmitted && idx === selectedOption && idx !== currentQ.correctAnswerIndex && <XCircle size={18} className="text-red-500"/>}
                </button>
              );
            })}
          </div>

          {isSubmitted && (
            <div className="mt-6 p-4 bg-blue-50 text-blue-800 rounded-xl text-sm leading-relaxed border border-blue-100">
              <strong>Explanation:</strong> {currentQ.explanation}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 rounded-b-2xl">
          {!isSubmitted ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={selectedOption === null}
              className="w-full py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Submit Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold shadow-lg hover:bg-gray-800 flex items-center justify-center gap-2 transition-all"
            >
              {currentIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"} <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
