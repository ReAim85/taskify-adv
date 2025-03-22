import axios from "axios";
import { useState } from "react";

export default function AddTask({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    finishBy: "",
  });

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try{
    if (!task.title.trim()) return alert("Task name is required");
    setLoading(true)
    const res = await axios.post("http://localhost:5000/api/tasks", task, { withCredentials: true });

    console.log(res.data)

    if(res.status === 201) {
        
        setTask({ title: "", description: "", priority: "medium", finishBy: "" });
        setOpen(false);
    }
} catch(err) {
    console.log("Task creating failed", err)
} finally {
    setLoading(false)
}
  };

  return (
    <>
      <button className="btn btn-primary" onClick={() => setOpen(true)}>
        Add Task
      </button>
      {open && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
          <div className="bg-base-200/90 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add New Task</h2>
            
            <input
              type="text"
              name="title"
              placeholder="Task Name"
              value={task.title}
              onChange={handleChange}
              className="input input-bordered w-full mb-3"
            />
            <textarea
              name="description"
              placeholder="Task Description"
              value={task.description}
              onChange={handleChange}
              className="textarea textarea-bordered w-full mb-3"
            />
            
            <select
              name="priority"
              value={task.priority}
              onChange={handleChange}
              className="select select-bordered w-full mb-3"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            
            <input
              type="date"
              name="finishBy"
              value={task.finishBy}
              onChange={handleChange}
              className="input input-bordered w-full mb-3"
            />
            
            <div className="flex justify-end gap-3">
              <button className="btn btn-outline" onClick={() => setOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit}>{(loading) ? "Adding..." : "Add"}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}