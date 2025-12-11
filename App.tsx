import React, { useEffect, useState } from 'react';
import { supabase, isConfigured } from './services/supabase';
import { Task, TaskStatus, QuadrantType, QuadrantInfo } from './types';
import { QuadrantView } from './components/QuadrantView';
import { FocusBasket } from './components/FocusBasket';
import { NewTaskModal } from './components/NewTaskModal';
import { Plus, LayoutGrid, AlertTriangle, RefreshCcw } from 'lucide-react';

const QUADRANTS: QuadrantInfo[] = [
  { id: QuadrantType.Q1, title: 'Do First', subtitle: 'Urgent & Important', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
  { id: QuadrantType.Q2, title: 'Schedule', subtitle: 'Not Urgent & Important', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
  { id: QuadrantType.Q3, title: 'Delegate', subtitle: 'Urgent & Not Important', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
  { id: QuadrantType.Q4, title: 'Eliminate', subtitle: 'Not Urgent & Not Important', color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-100' },
];

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [configured, setConfigured] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isConfigured()) {
      setConfigured(false);
      setLoading(false);
      return;
    }
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTasks(data as Task[] || []);
    } catch (err: any) {
      console.error('Error fetching tasks:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (title: string, description: string, quadrant: QuadrantType) => {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{
        title,
        description,
        quadrant,
        status: TaskStatus.BACKLOG
      }])
      .select();

    if (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task');
    } else if (data) {
      setTasks([data[0] as Task, ...tasks]);
    }
  };

  const handleMoveToBasket = async (task: Task) => {
    // Optimistic update
    const updatedTasks = tasks.map(t => 
      t.id === task.id ? { ...t, status: TaskStatus.BASKET } : t
    );
    setTasks(updatedTasks);

    const { error } = await supabase
      .from('tasks')
      .update({ status: TaskStatus.BASKET })
      .eq('id', task.id);

    if (error) {
      console.error('Error updating task:', error);
      fetchTasks(); // Revert on error
    }
  };

  const handleReturnToMatrix = async (task: Task) => {
    const updatedTasks = tasks.map(t => 
      t.id === task.id ? { ...t, status: TaskStatus.BACKLOG } : t
    );
    setTasks(updatedTasks);

    const { error } = await supabase
      .from('tasks')
      .update({ status: TaskStatus.BACKLOG })
      .eq('id', task.id);

    if (error) fetchTasks();
  };

  const handleCompleteTask = async (task: Task) => {
    const updatedTasks = tasks.map(t => 
      t.id === task.id ? { ...t, status: TaskStatus.COMPLETED } : t
    );
    setTasks(updatedTasks);

    const { error } = await supabase
      .from('tasks')
      .update({ status: TaskStatus.COMPLETED })
      .eq('id', task.id);

    if (error) fetchTasks();
  };

  const handleDeleteTask = async (id: string) => {
    const updatedTasks = tasks.filter(t => t.id !== id);
    setTasks(updatedTasks);

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (error) fetchTasks();
  };

  if (!configured) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center">
          <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Setup Required</h1>
          <p className="text-gray-600 mb-6">
            Please configure your Supabase URL and Key in <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">services/supabase.ts</code> to start using ZenFocus.
          </p>
          <div className="text-xs text-left bg-gray-50 p-4 rounded border border-gray-200 font-mono overflow-x-auto">
            {`const SUPABASE_URL = 'your-url';
const SUPABASE_ANON_KEY = 'your-key';`}
          </div>
        </div>
      </div>
    );
  }

  const activeTask = tasks.find(t => t.status === TaskStatus.BASKET) || null;
  const backlogTasks = tasks.filter(t => t.status === TaskStatus.BACKLOG);

  return (
    <div className="min-h-screen flex flex-col font-sans text-gray-800 pb-10">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <LayoutGrid size={18} />
            </div>
            <span className="font-bold text-lg tracking-tight">ZenFocus</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
             {loading && <RefreshCcw className="animate-spin" size={16} />}
             <button 
               onClick={() => setIsModalOpen(true)}
               className="bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
             >
               <Plus size={16} /> New Task
             </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
        
        {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
                <AlertTriangle size={18} />
                <span>Error: {error}</span>
            </div>
        )}

        {/* Focus Basket Area */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4 text-indigo-900/50 uppercase tracking-widest text-xs font-bold pl-1">
            Current Focus
          </div>
          <FocusBasket 
            activeTask={activeTask} 
            onComplete={handleCompleteTask}
            onReturn={handleReturnToMatrix}
          />
        </section>

        {/* The Matrix */}
        <section>
          <div className="flex items-center gap-2 mb-4 text-gray-400 uppercase tracking-widest text-xs font-bold pl-1">
            Task Matrix
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[600px] md:h-[500px]">
            {QUADRANTS.map(q => (
              <QuadrantView 
                key={q.id}
                info={q}
                tasks={backlogTasks.filter(t => t.quadrant === q.id)}
                onMoveToBasket={handleMoveToBasket}
                onDelete={handleDeleteTask}
                disabled={!!activeTask}
              />
            ))}
          </div>
        </section>

        {/* Completed Footer */}
        <div className="mt-12 text-center">
            <p className="text-gray-400 text-sm">
                {tasks.filter(t => t.status === TaskStatus.COMPLETED).length} tasks completed today
            </p>
        </div>
      </main>

      <NewTaskModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddTask}
      />
    </div>
  );
}

export default App;