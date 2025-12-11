import React, { useState } from 'react';
import { QuadrantType } from '../types';
import { Plus, X } from 'lucide-react';

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (title: string, description: string, quadrant: QuadrantType) => Promise<void>;
}

export const NewTaskModal: React.FC<NewTaskModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [quadrant, setQuadrant] = useState<QuadrantType>(QuadrantType.Q1);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    setLoading(true);
    await onAdd(title, description, quadrant);
    setLoading(false);
    
    // Reset form
    setTitle('');
    setDescription('');
    setQuadrant(QuadrantType.Q1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="font-semibold text-lg text-gray-800">Add New Task</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
              autoFocus
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Description (Optional)</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none h-20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-2">Quadrant</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setQuadrant(QuadrantType.Q1)}
                className={`p-2 rounded-lg border text-left text-xs transition-all ${quadrant === QuadrantType.Q1 ? 'bg-red-50 border-red-200 ring-1 ring-red-400 text-red-700' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}
              >
                <div className="font-bold">Do First</div>
                <div className="opacity-75 text-[10px]">Urgent & Important</div>
              </button>
              <button
                type="button"
                onClick={() => setQuadrant(QuadrantType.Q2)}
                className={`p-2 rounded-lg border text-left text-xs transition-all ${quadrant === QuadrantType.Q2 ? 'bg-blue-50 border-blue-200 ring-1 ring-blue-400 text-blue-700' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}
              >
                <div className="font-bold">Schedule</div>
                <div className="opacity-75 text-[10px]">Not Urgent & Important</div>
              </button>
              <button
                type="button"
                onClick={() => setQuadrant(QuadrantType.Q3)}
                className={`p-2 rounded-lg border text-left text-xs transition-all ${quadrant === QuadrantType.Q3 ? 'bg-amber-50 border-amber-200 ring-1 ring-amber-400 text-amber-700' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}
              >
                <div className="font-bold">Delegate</div>
                <div className="opacity-75 text-[10px]">Urgent & Not Important</div>
              </button>
              <button
                type="button"
                onClick={() => setQuadrant(QuadrantType.Q4)}
                className={`p-2 rounded-lg border text-left text-xs transition-all ${quadrant === QuadrantType.Q4 ? 'bg-slate-50 border-slate-200 ring-1 ring-slate-400 text-slate-700' : 'border-gray-200 hover:bg-gray-50 text-gray-600'}`}
              >
                <div className="font-bold">Eliminate</div>
                <div className="opacity-75 text-[10px]">Not Urgent & Not Important</div>
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-2 rounded-lg font-medium hover:bg-black transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Plus size={18} /> Add Task
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};