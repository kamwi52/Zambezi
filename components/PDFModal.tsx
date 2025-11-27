import React from 'react';
import { X, Check, Download, FileText } from 'lucide-react';

interface PDFModalProps {
  title: string;
  content: string; // Base64 data URI
  subjectName: string;
  onClose: () => void;
  onSave?: () => void;
  isSaved?: boolean;
}

const PDFModal: React.FC<PDFModalProps> = ({ title, content, subjectName, onClose, onSave, isSaved = true }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col h-[90vh] animate-scale-up">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg text-red-600">
                <FileText size={20} />
            </div>
            <div className="overflow-hidden">
              <h3 className="font-bold text-gray-800 truncate max-w-xs md:max-w-md">{title}</h3>
              <p className="text-xs text-gray-500 uppercase font-semibold">{subjectName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
             {onSave && (
              <button 
                onClick={onSave} 
                disabled={isSaved}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isSaved ? 'bg-green-100 text-green-700' : 'bg-white border hover:bg-gray-50 text-gray-700'
                }`}
              >
                {isSaved ? <><Check size={16} /> Saved</> : <><Download size={16} /> Save</>}
              </button>
            )}
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
              <X size={20} className="text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 bg-gray-100 p-1 md:p-4 overflow-hidden flex flex-col">
            <iframe 
                src={content} 
                className="w-full h-full rounded-lg border border-gray-200 bg-white" 
                title={title}
            />
        </div>
      </div>
    </div>
  );
};

export default PDFModal;