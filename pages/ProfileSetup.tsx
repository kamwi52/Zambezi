import React, { useState } from 'react';
import { GRADE_LEVELS } from '../constants';
import { GradeLevel, User } from '../types';
import { GraduationCap, ChevronRight, BookOpen, User as UserIcon, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';

interface ProfileSetupProps {
  user: User;
  onComplete: (data: Partial<User>) => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ user, onComplete }) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState({
    name: user.name || '',
    nickname: user.nickname || '',
    grade: user.grade || undefined as GradeLevel | undefined
  });

  const handleNext = () => {
    if (step === 1 && formData.name.trim()) {
      setStep(2);
    } else if (step === 2 && formData.grade) {
      setStep(3);
    }
  };

  const handleFinish = () => {
    onComplete({
      name: formData.name,
      nickname: formData.nickname,
      grade: formData.grade,
      profileSetupComplete: true
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl overflow-hidden min-h-[500px] flex flex-col">
        {/* Progress Bar */}
        <div className="h-2 bg-gray-100 w-full">
          <div 
            className="h-full bg-green-500 transition-all duration-500 ease-out"
            style={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}
          ></div>
        </div>

        <div className="flex-1 p-8 flex flex-col">
          {step === 1 && (
            <div className="flex-1 flex flex-col justify-center animate-fade-in">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600">
                  <UserIcon size={32} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Let's set up your profile</h1>
                <p className="text-gray-500">Tell us a bit about yourself so we can personalize your experience.</p>
              </div>

              <div className="space-y-4 max-w-sm mx-auto w-full">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter your name"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 outline-none"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nickname (Optional)</label>
                  <input
                    type="text"
                    value={formData.nickname}
                    onChange={(e) => setFormData({...formData, nickname: e.target.value})}
                    placeholder="What should we call you?"
                    className="w-full p-3 border border-gray-300 rounded-xl focus:ring-green-500 focus:border-green-500 outline-none"
                  />
                </div>
              </div>

              <div className="mt-8 max-w-sm mx-auto w-full">
                <button
                  onClick={handleNext}
                  disabled={!formData.name.trim()}
                  className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Next Step <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex-1 flex flex-col animate-fade-in">
              <div className="text-center mb-6">
                 <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
                  <GraduationCap size={32} />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Select your Grade</h1>
                <p className="text-gray-500">Based on the Zambian School Curriculum.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto max-h-[400px] p-2">
                {GRADE_LEVELS.map((grade) => (
                  <button
                    key={grade.level}
                    onClick={() => setFormData({...formData, grade: grade.level as GradeLevel})}
                    className={`p-4 rounded-xl border-2 transition-all text-left group relative ${
                      formData.grade === grade.level 
                      ? 'border-green-500 bg-green-50 shadow-md' 
                      : 'border-gray-100 bg-white hover:border-green-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className={`text-lg font-bold flex items-center gap-2 ${formData.grade === grade.level ? 'text-green-800' : 'text-gray-700'}`}>
                          <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs ${formData.grade === grade.level ? 'bg-green-200 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
                            {grade.level}
                          </span>
                          {grade.label}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">{grade.subLabel}</p>
                      </div>
                      {formData.grade === grade.level && (
                        <CheckCircle size={20} className="text-green-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 flex gap-3">
                 <button
                  onClick={() => setStep(1)}
                  className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all"
                >
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!formData.grade}
                  className="flex-1 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Continue <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex-1 flex flex-col justify-center items-center text-center animate-scale-up">
              <div className="w-24 h-24 bg-gradient-to-tr from-green-400 to-blue-500 rounded-full flex items-center justify-center mb-6 text-white shadow-xl shadow-green-200">
                <Sparkles size={40} />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">You're All Set, {formData.nickname || formData.name}!</h1>
              <p className="text-gray-600 max-w-md mb-8">
                We've customized the app for <strong>Grade {formData.grade}</strong>. 
                Your learning journey starts now.
              </p>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 w-full max-w-xs mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="text-sm text-gray-700">Account Activated</span>
                </div>
                <div className="flex items-center gap-3 mb-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="text-sm text-gray-700">Syllabus Loaded</span>
                </div>
                 <div className="flex items-center gap-3">
                    <CheckCircle size={16} className="text-green-500" />
                    <span className="text-sm text-gray-700">AI Tutor Ready</span>
                </div>
              </div>

              <button
                onClick={handleFinish}
                className="w-full max-w-sm py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-all shadow-lg shadow-green-200 hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <BookOpen size={24} /> Let's Learn
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;