import React from 'react';
import { UserProgress } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { Flame, Trophy, Target } from 'lucide-react';
import { ZAMBIAN_SYLLABUS_SUBJECTS } from '../constants';

interface DashboardProps {
  progress: UserProgress;
  onNavigate: (view: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ progress, onNavigate }) => {
  const chartData = ZAMBIAN_SYLLABUS_SUBJECTS.map(subject => ({
    name: subject.name.split(' ')[0], // Short name
    score: progress.subjectMastery[subject.id] || 0,
    color: subject.color.replace('bg-', '') // Rudimentary, better to map real hex codes
  }));

  // Helper for hex colors since we can't extract easily from Tailwind classes in runtime without mapping
  const getColor = (colorClass: string) => {
    if(colorClass.includes('blue')) return '#3b82f6';
    if(colorClass.includes('green')) return '#16a34a';
    if(colorClass.includes('red')) return '#ef4444';
    if(colorClass.includes('yellow')) return '#eab308';
    if(colorClass.includes('teal')) return '#14b8a6';
    if(colorClass.includes('indigo')) return '#6366f1';
    return '#8884d8';
  };

  return (
    <div className="p-4 md:p-8 space-y-6 pb-24 md:pb-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Welcome back!</h1>
          <p className="text-gray-500">Grade {progress.grade} Student</p>
        </div>
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-xl">
          👨🏾‍🎓
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100 text-center">
          <div className="flex justify-center mb-1 text-orange-500"><Flame size={20} /></div>
          <div className="text-xl font-bold text-gray-800">{progress.streakDays}</div>
          <div className="text-[10px] uppercase font-bold text-orange-400">Day Streak</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 text-center">
          <div className="flex justify-center mb-1 text-blue-500"><Trophy size={20} /></div>
          <div className="text-xl font-bold text-gray-800">{progress.completedQuizzes}</div>
          <div className="text-[10px] uppercase font-bold text-blue-400">Quizzes</div>
        </div>
        <div className="bg-green-50 p-4 rounded-2xl border border-green-100 text-center">
          <div className="flex justify-center mb-1 text-green-600"><Target size={20} /></div>
          <div className="text-xl font-bold text-gray-800">{progress.averageScore}%</div>
          <div className="text-[10px] uppercase font-bold text-green-500">Avg Score</div>
        </div>
      </div>

      {/* Progress Chart */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4 text-gray-800">Subject Mastery</h2>
        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 10, fill: '#94a3b8'}} 
                interval={0}
              />
              <YAxis hide domain={[0, 100]} />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(ZAMBIAN_SYLLABUS_SUBJECTS[index].color)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10"></div>
        <div className="relative z-10">
          <h3 className="font-bold text-lg mb-1">Prepare for exams?</h3>
          <p className="text-gray-300 text-sm mb-4">Chat with our AI Tutor to clear your doubts instantly.</p>
          <button 
            onClick={() => onNavigate('tutor')}
            className="bg-white text-gray-900 px-5 py-2 rounded-lg font-semibold text-sm hover:bg-gray-100 transition"
          >
            Start Learning
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
