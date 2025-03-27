import axios from "axios";
import { useState } from "react";
import { useTodo } from './TodoBoard.jsx'
import { API_BASE_URL } from "../config.js";

export default function AddTask() {
  const { setTodos  } = useTodo();
  const [open, setOpen] = useState(false);
  const [ formData, setFormData ] = useState({
    title: "",
    description: "",
    priority: "medium",
    finishBy: "",
  });

  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData ((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try{
    if (!formData.title.trim()) return alert("Task name is required");
    setLoading(true)
    const res = await axios.post(`${API_BASE_URL}/api/tasks`, formData, { withCredentials: true });

    console.log(res.data)

    if(res.status === 201) {

      const newTodo = {
        id: res.data._id || res.data.id,
        text: res.data.title,
        description: res.data.description,
        status: res.data.status || "tood",
        finishBy: res.data.finishBy,
        priority: res.data.priority || "easy"
      }

      setTodos(prevTodos => [...prevTodos, newTodo])
        
        setFormData ({ title: "", description: "", priority: "medium", finishBy: "" });
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
              value={formData.title}
              onChange={handleChange}
              className="input input-bordered w-full mb-3"
            />
            <textarea
              name="description"
              placeholder="Task Description"
              value={formData.description}
              onChange={handleChange}
              className="textarea textarea-bordered w-full mb-3"
            />
            
            <select
              name="priority"
              value={formData.priority}
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
              value={formData.finishBy}
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