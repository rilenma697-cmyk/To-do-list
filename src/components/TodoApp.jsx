import { useState, useEffect } from "react";

export default function TodoApp() {
  const [tasks, setTasks] = useState(() => {
    try {
      const savedTasks = localStorage.getItem("todos");
      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch (error) {
      console.error("Error loading todos:", error);
      return [];
    }
  });

  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");

  // Save to Local Storage
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!input.trim()) return;

    const newTask = {
      id: Date.now(),
      text: input.trim(),
      completed: false,
    };

    setTasks((prev) => [...prev, newTask]);
    setInput("");
  };

  const deleteTask = (id) => {
    setTasks((prev) =>
      prev.filter((task) => task.id !== id)
    );
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
            ...task,
            completed: !task.completed,
          }
          : task
      )
    );
  };

  const editTask = (id) => {
    const task = tasks.find((t) => t.id === id);

    if (!task) return;

    const newText = prompt("Edit Task", task.text);

    if (!newText?.trim()) return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? {
            ...task,
            text: newText.trim(),
          }
          : task
      )
    );
  };

  const clearCompleted = () => {
    setTasks((prev) =>
      prev.filter((task) => !task.completed)
    );
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  const activeCount = tasks.filter(
    (task) => !task.completed
  ).length;

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-white">
          Today
        </h1>
        <p className="text-slate-300 mt-4">
          Stay focused, task plan everyday.
        </p>
      </div>

      {/* Create Task */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm mb-6 w-200 h-50">
        <div className="flex items-center gap-4 mb-5">
          <button className="text-indigo-600 text-xl font-bold">
            +
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && addTask()
            }
            placeholder="What's your task today?"
            className="flex-1 outline-none text-lg font-medium placeholder:text-slate-300"
          />
        </div>

        <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
          {/* <div className="flex gap-2 flex-wrap">
            <button className="px-3 py-1 text-xs rounded-full border border-slate-300 bg-white">
              📅 Due Date
            </button>

            <button className="px-3 py-1 text-xs rounded-full border border-slate-300 bg-white">
              🚩 Priority
            </button>

            <button className="px-3 py-1 text-xs rounded-full border border-slate-300 bg-white">
              🏷 Labels
            </button>
          </div> */}

          <button
            onClick={addTask}
            className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium"
          >
            Add Task
          </button>
        </div>
      </div>

      {/* Tasks */}
      <div className="space-y-3">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                  className="mt-1 w-5 h-5"
                />

                <div>
                  <h3
                    className={`font-semibold text-slate-800 ${task.completed
                        ? "line-through opacity-50"
                        : ""
                      }`}
                  >
                    {task.text}
                  </h3>

                  <div className="flex gap-2 mt-2 flex-wrap">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${task.completed
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                        }`}
                    >
                      {task.completed
                        ? "Completed"
                        : "High"}
                    </span>

                    <span className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-600">
                      Today
                    </span>

                    <span className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-600">
                      Work
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => editTask(task.id)}
                  className="px-3 py-1 text-sm bg-amber-500 text-white rounded-lg"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteTask(task.id)}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 flex justify-between items-center">
        <span className="text-white">
          {activeCount} tasks 
        </span>

        <button
          onClick={clearCompleted}
          className="px-4 py-2 rounded-lg bg-red-500 text-white"
        >
          Clear Completed
        </button>
      </div>
    </div>
  );
}