import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Loader2, ClipboardList, CheckCircle, Tag, BarChart3, Calendar, ChevronRight, X } from 'lucide-react';

const API_URL = 'http://localhost:5000/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 6;

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newTask.title) return;

    setLoading(true);
    try {
      await axios.post(API_URL, newTask);
      setNewTask({ title: '', description: '' });
      setShowPopup(false);
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    } finally {
      setLoading(false);
    }
  };

  // Pagination logic
  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);
  const totalPages = Math.ceil(tasks.length / tasksPerPage);

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-64 bg-gradient-to-b from-indigo-50/50 to-transparent -z-10 pointer-events-none" />

      {/* Header */}
      <header className="max-w-6xl mx-auto px-6 py-12 md:py-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
                <CheckCircle className="text-white" size={18} />
              </div>
              <span className="text-indigo-600 font-semibold tracking-wide uppercase text-xs">AI-Powered Workflow</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Smart Task <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Assistant</span>
            </h1>
            <p className="text-slate-500 mt-3 text-lg max-w-xl">
              Optimize your productivity with intelligent task categorization and difficulty estimation powered by Gemini.
            </p>
          </div>
          <div className="hidden md:block">
             <button
              onClick={() => setShowPopup(true)}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-2xl shadow-xl shadow-indigo-100 transition-all transform hover:-translate-y-1 active:scale-95 flex items-center gap-2 font-semibold"
            >
              <Plus size={22} />
              <span>New Task</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 pb-24">
        {loading && tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-100 border-dashed">
            <Loader2 className="animate-spin text-indigo-500 mb-4" size={48} />
            <p className="text-slate-400 font-medium">Brewing insights for your tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm">
            <div className="bg-indigo-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
              <ClipboardList className="text-indigo-600" size={36} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">Your task list is empty</h3>
            <p className="text-slate-500 mt-3 max-w-md mx-auto text-lg leading-relaxed">
              Ready to be more productive? Create your first task and let our AI analyze it for you!
            </p>
            <button
              onClick={() => setShowPopup(true)}
              className="mt-8 bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
            >
              Get Started
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentTasks.map((task) => (
              <div key={task._id} className="bg-white p-7 rounded-3xl border border-slate-50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)] transition-all group flex flex-col h-full relative overflow-hidden">
                {/* Decorative background element */}
                <div 
                  className="absolute top-0 right-0 w-24 h-24 opacity-5 -z-0 pointer-events-none translate-x-12 -translate-y-12 rounded-full"
                  style={{ backgroundColor: task.colorCode }}
                />

                <div className="flex-1 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="px-3 py-1 rounded-lg text-[10px] font-bold tracking-[0.1em] uppercase"
                      style={{ backgroundColor: `${task.colorCode}15`, color: task.colorCode }}
                    >
                      {task.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Calendar size={14} />
                      <span className="text-[11px] font-medium">{new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-900 mb-2 leading-snug group-hover:text-indigo-600 transition-colors">
                    {task.title}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-3">
                    {task.description || 'No description provided.'}
                  </p>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl">
                    <BarChart3 size={16} className="text-indigo-500" />
                    <span className="text-xs font-bold text-slate-700">Difficulty: {task.difficulty}/10</span>
                  </div>
                  <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all">
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-12">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-3 rounded-2xl border border-slate-100 bg-white disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm"
            >
              <ChevronRight size={20} className="rotate-180" />
            </button>
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
                    currentPage === i + 1 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' 
                    : 'bg-white text-slate-400 border border-slate-100 hover:border-indigo-200'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-3 rounded-2xl border border-slate-100 bg-white disabled:opacity-30 hover:bg-slate-50 transition-all shadow-sm"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </main>

      {/* Mobile Floating Action Button */}
      <button
        onClick={() => setShowPopup(true)}
        className="md:hidden fixed bottom-8 right-8 w-16 h-16 bg-indigo-600 text-white rounded-2xl shadow-2xl shadow-indigo-200 flex items-center justify-center transition-transform active:scale-90 z-40"
      >
        <Plus size={32} />
      </button>

      {/* Task Creation Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[6px] z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in slide-in-from-bottom-8 duration-300">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900">New Task</h2>
                <p className="text-slate-400 text-sm mt-0.5 font-medium">Gemini will analyze this for you</p>
              </div>
              <button 
                onClick={() => setShowPopup(false)} 
                className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700 ml-1">Task Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none text-slate-900 font-medium placeholder:text-slate-300"
                  placeholder="e.g. Design Marketing Campaign"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-bold text-slate-700 ml-1">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-500 transition-all outline-none h-36 text-slate-900 font-medium placeholder:text-slate-300 resize-none"
                  placeholder="What needs to be done?"
                />
              </div>
              <div className="pt-2 flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowPopup(false)}
                  className="flex-1 px-4 py-4 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-4 rounded-2xl shadow-xl shadow-indigo-100 transition-all font-bold flex justify-center items-center gap-2 disabled:opacity-70"
                >
                  {loading ? <Loader2 size={22} className="animate-spin" /> : 'Analyze & Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
