import React from 'react';
import { Task, QuadrantType } from '../types';
import { CheckCircle2, XCircle, Archive, AlertCircle } from 'lucide-react';

interface FocusBasketProps {
  activeTask: Task | null;
  onComplete: (task: Task) => void;
  onReturn: (task: Task) => void;
}

export const FocusBasket: React.FC<FocusBasketProps> = ({ activeTask, onComplete, onReturn }) => {
  const getQuadrantLabel = (q: QuadrantType) => {
    switch(q) {
      case QuadrantType.Q1: return { text: 'Urgent & Important', color: 'text-red-600 bg-red-50 border-red-200' };
      case QuadrantType.Q2: return { text: 'Not Urgent & Important', color: 'text-blue-600 bg-blue-50 border-blue-200' };
      case QuadrantType.Q3: return { text: 'Urgent & Not Important', color: 'text-amber-600 bg-amber-50 border-amber-200' };
      case QuadrantType.Q4: return { text: 'Not Urgent & Not Important', color: 'text-slate-600 bg-slate-50 border-slate-200' };
    }
  };

  if (!activeTask) {
    return (
      <div className="w-full max-w-md mx-auto mb-8">
        <div className="bg-white/40 border-2 border-dashed border-indigo-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center backdrop-blur-sm min-h-[200px] transition-all">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mb-4 text-indigo-300">
            <Archive size={32} />
          </div>
          <h2 className="text-xl font-semibold text-gray-600">The Basket is Empty</h2>
          <p className="text-sm text-gray-500 mt-2 max-w-xs">
            Select a task from the matrix below to enter Focus Mode. Only one task at a time.
          </p>
        </div>
      </div>
    );
  }

  const qLabel = getQuadrantLabel(activeTask.quadrant);

  return (
    <div className="w-full max-w-xl mx-auto mb-8 relative z-10">
      <div className="absolute -top-4 -right-4 -left-4 -bottom-4 bg-indigo-500/10 blur-2xl rounded-full z-0 pointer-events-none"></div>
      
      <div className="relative z-10 bg-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden transform transition-all hover:scale-[1.01]">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-1"></div>
        
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-start mb-4">
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border ${qLabel.color}`}>
              {qLabel.text}
            </span>
            <button 
              onClick={() => onReturn(activeTask)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Return to list"
            >
              <XCircle size={20} />
            </button>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3 leading-tight">
            {activeTask.title}
          </h1>
          
          {activeTask.description && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-6">
              <p className="text-gray-600 text-sm md:text-base leading-relaxed whitespace-pre-wrap">
                {activeTask.description}
              </p>
            </div>
          )}

          <div className="flex justify-center mt-6">
            <button
              onClick={() => onComplete(activeTask)}
              className="group flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-semibold shadow-lg shadow-indigo-200 transition-all active:scale-95"
            >
              <CheckCircle2 size={20} className="group-hover:scale-110 transition-transform" />
              <span>Complete Task</span>
            </button>
          </div>
        </div>
        
        <div className="bg-gray-50 px-6 py-2 text-center text-xs text-gray-400 border-t border-gray-100">
          Focus Mode • Do this now • Ignore the rest
        </div>
      </div>
    </div>
  );
};