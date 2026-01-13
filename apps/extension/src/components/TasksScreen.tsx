import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Clock, Plus, Trash2, CheckCircle, AlertCircle } from "lucide-react";
import api from "../services/api"; // Assuming api service exists
import { useAuth } from "../hooks/useAuth";

interface Task {
  id: number;
  type: string;
  frequency: string;
  time: string;
  status: string;
}

function TasksScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [newTask, setNewTask] = useState({
    type: "morning-briefing",
    frequency: "daily",
    time: "08:00",
  });
  const [activities, setActivities] = useState<any[]>([]);
  const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null);

  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      fetchTasks();
      fetchActivities();
    }
  }, [token]);

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchActivities = async () => {
    try {
      const res = await api.get("/dashboard/activity?limit=10");
      setActivities(res.data.activity || []);
    } catch (err) {
      console.error("Failed to fetch activities", err);
    }
  };

  const handleCreateTask = async () => {
    try {
      await api.post("/tasks", newTask);
      setShowModal(false);
      fetchTasks();
    } catch (err) {
      console.error("Failed to create task", err);
    }
  };

  const handleDeleteTask = async (id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    try {
      await api.delete(`/tasks/${id}`);
    } catch (err) {
      console.error("Failed to delete task", err);
      fetchTasks();
    }
  };

  const getLatestResultForTask = (type: string) => {
    return activities.find(a => a.action === (type === 'morning-briefing' ? 'digest' : type));
  };

  return (
    <div className="flex flex-col h-screen bg-[#121212] text-white p-8 overflow-y-auto w-full scrollbar-thin scrollbar-thumb-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#22d3ee]">Tasks & Schedules</h1>
          <p className="text-sm text-gray-400 mt-1">
            Manage your automated email briefings and reminders.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 bg-[#22d3ee] text-black px-4 py-2 rounded-xl font-semibold text-sm hover:bg-[#1bbccf] transition-all shadow-[0_0_15px_rgba(34,211,238,0.2)]"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Task List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center mt-20 gap-4">
          <div className="w-8 h-8 border-2 border-[#22d3ee] border-t-transparent rounded-full animate-spin"></div>
          <div className="text-gray-500 font-medium">Fetching your schedules...</div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center border border-[#262626] rounded-2xl p-10 bg-[#171717]/50 backdrop-blur-sm shadow-xl">
          <div className="text-center max-w-xs">
            <div className="w-16 h-16 bg-[#262626] rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Clock className="w-8 h-8 text-gray-500" />
            </div>
            <h2 className="text-gray-200 text-lg font-semibold mb-2">
              No active tasks
            </h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              Schedule your Morning Briefing or Follow-up Reminders to save hours every week.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-[#22d3ee] text-black px-6 py-2.5 rounded-xl hover:bg-[#1bbccf] transition-all text-sm font-bold shadow-[0_0_20px_rgba(34,211,238,0.3)]"
            >
              Get Started
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 pb-20">
          {tasks.map((task) => {
            const latestResult = getLatestResultForTask(task.type);
            const isExpanded = expandedTaskId === task.id;

            return (
              <motion.div
                key={task.id}
                layout
                className="bg-[#171717] rounded-3xl p-6 border border-[#262626] shadow-lg hover:border-[#22d3ee]/30 transition-all group overflow-hidden"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1 capitalize text-gray-100 flex items-center gap-3">
                      {task.type.replace("-", " ")}
                      <span className={`px-2 py-0.5 rounded-full text-[9px] uppercase font-black tracking-widest ${task.status === 'active' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gray-800 text-gray-500 border border-gray-700'}`}>
                        {task.status}
                      </span>
                    </h3>

                    <div className="flex items-center gap-4 text-gray-400 text-xs mt-2">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#22d3ee]" />
                        <span>{task.time}</span>
                      </div>
                      <div className="flex items-center gap-1.5 uppercase tracking-tighter">
                        <div className="w-1 h-1 rounded-full bg-gray-600"></div>
                        <span>{task.frequency}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                    title="Delete task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Latest Result Snippet */}
                {latestResult && (
                  <div className="mt-5 pt-5 border-t border-[#262626]">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">Latest Briefing Ready</span>
                      </div>
                      <button
                        onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                        className="text-[11px] font-bold text-[#22d3ee] hover:underline uppercase tracking-widest"
                      >
                        {isExpanded ? 'Hide Result' : 'View Result'}
                      </button>
                    </div>

                    <AnimatePresence mode="wait">
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="bg-[#121212] rounded-2xl p-4 border border-[#262626] text-xs text-gray-300 leading-relaxed whitespace-pre-wrap font-sans max-h-60 overflow-y-auto mt-2 custom-scrollbar">
                            {latestResult.metadata?.summary || latestResult.description}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {!isExpanded && (
                      <p className="text-[11px] text-gray-500 italic mt-1 line-clamp-1">
                        {new Date(latestResult.timestamp).toLocaleDateString()} • {latestResult.description}
                      </p>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create Task Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-md z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#171717] text-white rounded-2xl p-6 w-[90%] md:w-[480px] border border-[#262626] shadow-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Schedule New Task</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 rounded-lg hover:bg-[#262626] transition"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-white" />
                </button>
              </div>

              {/* Task Type */}
              <div className="mb-4">
                <label className="block text-xs text-gray-400 mb-1">Task Type</label>
                <select
                  value={newTask.type}
                  onChange={(e) => setNewTask({ ...newTask, type: e.target.value })}
                  className="w-full bg-[#121212] p-2 rounded-lg outline-none border border-[#333] text-sm text-gray-200 focus:ring-1 focus:ring-[#22d3ee] transition"
                >
                  <option value="morning-briefing">Morning Briefing</option>
                  <option value="check-reply">Check Reply (Follow-up)</option>
                </select>
              </div>

              {/* Frequency */}
              <div className="mb-4">
                <label className="block text-xs text-gray-400 mb-1">Frequency</label>
                <div className="flex gap-2">
                  {["daily", "once", "weekly"].map((freq) => (
                    <button
                      key={freq}
                      onClick={() => setNewTask({ ...newTask, frequency: freq })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${newTask.frequency === freq
                        ? "bg-[#22d3ee] text-black"
                        : "bg-[#262626] text-gray-300 hover:bg-[#333]"
                        }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time */}
              <div className="mb-6">
                <label className="block text-xs text-gray-400 mb-1">
                  {newTask.frequency === 'daily' ? 'Time of Day' : 'Date & Time'}
                </label>
                <input
                  type={newTask.frequency === 'daily' ? "time" : "datetime-local"}
                  value={newTask.time}
                  onChange={(e) => setNewTask({ ...newTask, time: e.target.value })}
                  className="w-full bg-[#121212] p-2 rounded-lg outline-none border border-[#333] text-sm text-gray-200 focus:ring-1 focus:ring-[#22d3ee] transition"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleCreateTask}
                  className="bg-[#22d3ee] text-black px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#1bbccf] transition-all w-full"
                >
                  Create Schedule
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default TasksScreen;
