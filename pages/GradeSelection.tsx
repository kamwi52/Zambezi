import React from 'react';
import { GRADE_LEVELS } from '../constants';
import { GradeLevel } from '../types';
import { GraduationCap, ChevronRight, BookOpen } from 'lucide-react';

interface GradeSelectionProps {
  onSelect: (grade: GradeLevel) => void;
  userName?: string;
}

const GradeSelection: React.FC<GradeSelectionProps> = ({ onSelect, userName }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 shadow-sm">
            <GraduationCap size={40} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
             Select your Grade
          </h1>
          <p className="text-gray-500">
            Choose your current level to get the right study materials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {GRADE_LEVELS.map((grade) => (
            <button
              key={grade.level}
              onClick={() => onSelect(grade.level as GradeLevel)}
              className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:border-green-500 hover:shadow-md transition-all text-left group relative overflow-hidden"
            >
              <div className="absolute right-0 top-0 w-24 h-24 bg-green-50 rounded-bl-full -mr-4 -mt-4 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="relative z-10 flex justify-between items-center">
                <div>
                   <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                     <span className="bg-gray-100 text-gray-600 w-8 h-8 rounded-lg flex items-center justify-center text-sm">
                       {grade.level}
                     </span>
                     {grade.label}
                   </h3>
                   <p className="text-sm text-gray-500 mt-1 font-medium">{grade.subLabel}</p>
                </div>
                <div className="bg-gray-50 p-2 rounded-full text-gray-400 group-hover:bg-green-600 group-hover:text-white transition-colors">
                    <ChevronRight size={20} />
                </div>
              </div>
            </button>
          ))}
        </div>
        
        <div className="mt-8 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
           <BookOpen size={14} /> Based on the Zambian School Curriculum
        </div>
      </div>
    </div>
  );
};

export default GradeSelection;