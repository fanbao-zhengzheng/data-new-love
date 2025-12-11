import React from 'react';
import { Task, QuadrantInfo } from '../types';
import { ArrowUpCircle, Trash2, Clock } from 'lucide-react';

interface QuadrantViewProps {
  info: QuadrantInfo;
  tasks: Task[];
  onMoveToBasket: (task: Task) => void;
  onDelete: (id: string) => void;
  disabled: boolean;
}

export const QuadrantView: React.FC<QuadrantViewProps> = ({ info, tasks, onMoveToBasket, onDelete, disabled }) => {
  return (
    <div className={`flex flex-col h-full bg-white/60 backdrop-blur-sm rounded-xl border ${info.border} shadow-sm overflow-hidden`}>
      <div className={`p-3 border-b ${info.border} ${info.bg} flex justify-between items-center`}>
        <div>
          <h3 className={`font-bold ${info.color} text-sm uppercase tracking-wider`}>{info.title}</h3>
          <p className="text-xs text-gray-500">{info.subtitle}</p>
        </div>
        <span className={`text-xs font-bold ${info.color} bg-white px-2 py-0.5 rounded-full border ${info.border}`}>
          {tasks.length}
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {tasks.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 opacity-50">
            <span className="text-xs">Empty</span>
          </div>
        ) : (
          tasks.map(task => (
            <div key={task.id} className="group bg-white p-3 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="flex justify-between items-start">
                <h4 className="text-gray-800 font-medium text-sm leading-tight">{task.title}</h4>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onDelete(task.id)}
                    className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                  <button 
                    onClick={() => onMoveToBasket(task)}
                    disabled={disabled}
                    className={`p-1 rounded transition-colors ${
                      disabled 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-400 hover:text-indigo-600'
                    }`}
                    title={disabled ? "Basket full" : "Move to Focus Basket"}
                  >
                    <ArrowUpCircle size={14} />
                  </button>
                </div>
              </div>
              {task.description && (
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
              )}
              <div className="mt-2 flex items-center text-[10px] text-gray-400">
                <Clock size={10} className="mr-1" />
                {new Date(task.created_at).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};