import React from 'react';
import { ZAMBIAN_SYLLABUS_SUBJECTS } from '../constants';
import * as LucideIcons from 'lucide-react';
import { Subject } from '../types';

interface SubjectsListProps {
  onSelectSubject: (subject: Subject) => void;
}

const SubjectsList: React.FC<SubjectsListProps> = ({ onSelectSubject }) => {
  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Select a Subject</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ZAMBIAN_SYLLABUS_SUBJECTS.map((subject) => {
          // Dynamic Icon Rendering
          const IconComponent = (LucideIcons as any)[subject.icon] || LucideIcons.Book;
          
          return (
            <button
              key={subject.id}
              onClick={() => onSelectSubject(subject)}
              className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all text-left flex items-start gap-4 group"
            >
              <div className={`p-3 rounded-xl ${subject.color} text-white shadow-sm group-hover:scale-110 transition-transform`}>
                <IconComponent size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg">{subject.name}</h3>
                <p className="text-sm text-gray-500 mt-1">{subject.topics.length} topics available</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {subject.topics.slice(0, 2).map(t => (
                    <span key={t} className="text-[10px] px-2 py-1 bg-gray-50 text-gray-600 rounded-md border border-gray-100">
                      {t}
                    </span>
                  ))}
                  {subject.topics.length > 2 && (
                    <span className="text-[10px] px-2 py-1 bg-gray-50 text-gray-400 rounded-md">
                      +{subject.topics.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SubjectsList;
