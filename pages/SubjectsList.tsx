import React, { useState, useMemo } from 'react';
import { ZAMBIAN_SYLLABUS_SUBJECTS } from '../constants';
import * as LucideIcons from 'lucide-react';
import { Subject, GradeLevel } from '../types';
import { Search, ChevronRight, Book } from 'lucide-react';

interface SubjectsListProps {
  onSelectSubject: (subject: Subject) => void;
  grade: GradeLevel;
}

const SubjectsList: React.FC<SubjectsListProps> = ({ onSelectSubject, grade }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    
    const query = searchQuery.toLowerCase();
    const results: { subject: Subject; topic: string }[] = [];

    ZAMBIAN_SYLLABUS_SUBJECTS.forEach((subject) => {
      const topics = subject.topicsByGrade[grade] || [];
      
      // Check if subject name matches
      if (subject.name.toLowerCase().includes(query)) {
        // If subject matches, add a generic entry or just prioritize matches
        // For this implementation, we focus on topics, but let's include matching topics
      }

      topics.forEach((topic) => {
        if (topic.toLowerCase().includes(query)) {
          results.push({ subject, topic });
        }
      });
    });

    return results;
  }, [searchQuery, grade]);

  return (
    <div className="p-4 md:p-8 pb-24 md:pb-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-800">Select a Subject</h1>
           <span className="text-xs font-semibold px-3 py-1 bg-green-100 text-green-700 rounded-full border border-green-200 mt-1 inline-block">Grade {grade} Syllabus</span>
        </div>
        
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search size={18} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for topics..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl bg-white focus:border-green-500 focus:ring-2 focus:ring-green-100 outline-none transition-all text-sm"
          />
        </div>
      </div>
      
      {searchQuery.trim() ? (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Search Results ({searchResults.length})</h2>
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {searchResults.map((result, idx) => {
                 const IconComponent = (LucideIcons as any)[result.subject.icon] || LucideIcons.Book;
                 return (
                  <button
                    key={`${result.subject.id}-${idx}`}
                    onClick={() => onSelectSubject(result.subject)}
                    className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all text-left group"
                  >
                    <div className={`p-2 rounded-lg ${result.subject.color} text-white`}>
                      <IconComponent size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800 text-sm">{result.topic}</h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                        in <span className="font-medium text-gray-700">{result.subject.name}</span>
                      </p>
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-green-500 transition-colors" />
                  </button>
                 );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
              <div className="text-gray-300 mb-2"><Search size={32} className="mx-auto"/></div>
              <p className="text-gray-500">No topics found matching "{searchQuery}"</p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ZAMBIAN_SYLLABUS_SUBJECTS.map((subject) => {
            // Dynamic Icon Rendering
            const IconComponent = (LucideIcons as any)[subject.icon] || LucideIcons.Book;
            
            const gradeTopics = subject.topicsByGrade[grade] || [];

            return (
              <button
                key={subject.id}
                onClick={() => onSelectSubject(subject)}
                className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all text-left flex items-start gap-4 group"
              >
                <div className={`p-3 rounded-xl ${subject.color} text-white shadow-sm group-hover:scale-110 transition-transform`}>
                  <IconComponent size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                     <h3 className="font-bold text-gray-800 text-lg">{subject.name}</h3>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">{gradeTopics.length} topics available</p>
                  <div className="flex flex-wrap gap-1 mt-3">
                    {gradeTopics.slice(0, 2).map(t => (
                      <span key={t} className="text-[10px] px-2 py-1 bg-gray-50 text-gray-600 rounded-md border border-gray-100 truncate max-w-[100px]">
                        {t}
                      </span>
                    ))}
                    {gradeTopics.length > 2 && (
                      <span className="text-[10px] px-2 py-1 bg-gray-50 text-gray-400 rounded-md">
                        +{gradeTopics.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SubjectsList;