import React, { useState } from 'react';
import { X, Download, Check, BookOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface StudyNoteModalProps {
  title: string;
  content: string;
  subjectName: string;
  onClose: () => void;
  onSave?: () => void;
  isSaved?: boolean;
}

const StudyNoteModal: React.FC<StudyNoteModalProps> = ({ title, content, subjectName, onClose, onSave, isSaved = false }) => {
  const [hasSaved, setHasSaved] = useState(isSaved);

  const handleSave = () => {
    if (onSave) {
      onSave();
      setHasSaved(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <BookOpen size={20} />
            </div>
            <div>
              <h3 className="font-bold text-gray-800">{title}</h3>
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
                {hasSaved ? <><Check size={16} /> Saved</> : <><Download size={16} /> Save</>}
              </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-white">
          <article className="prose prose-sm md:prose-base max-w-none prose-headings:text-gray-800 prose-p:text-gray-600 prose-a:text-blue-600 prose-strong:text-gray-900 prose-li:text-gray-600">
            <ReactMarkdown>{content}</ReactMarkdown>
          </article>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 rounded-b-2xl flex justify-end">
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-900"
            >
              Close
            </button>
        </div>
      </div>
    </div>
  );
};

export default StudyNoteModal;