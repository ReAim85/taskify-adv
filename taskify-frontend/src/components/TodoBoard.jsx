// heavily relied on AI for this specific file.

import { createContext, useContext, useEffect, useState } from "react";
import { API_BASE_URL } from "../config";
import {
  DndContext,
  DragOverlay,
  useDroppable,
  pointerWithin,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import axios from "axios";

const TodoContext = createContext(null);

export const useTodo = () => {
  const context = useContext(TodoContext)
  if(context === undefined || context === null) {
  throw new Error("useTodo must be used withing a todoProvider")
}
return context
}

export const KanbanBoard = ({children}) => {
  const [todos, setTodos] = useState([]);
  const [activeTodo, setActiveTodo] = useState(null);
  const [selectedTodo, setSelectedTodo] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchTodos = async () => {
   try{
    const res = await axios.get(`${API_BASE_URL}/api/tasks`, { withCredentials: true })

    const formatedTodos = res.data.map(data => ({
      id: data._id || data.id,
      text: data.title,
      description: data.description,
      status: data.status || "todo",
      finishBy: data.finishBy,
      priority: data.priority || "easy"
    }));

    if(formatedTodos.length > 0) {
      setTodos(formatedTodos);
    }
   } catch(err) {
    console.log(err)
   }
  }

  fetchTodos();
  }, [])

  const handleDragStart = (event) => {
    const { active } = event;
    const draggedTodo = todos.find(todo => todo.id === active.id);
    setActiveTodo(draggedTodo);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    console.log("Dragging:", active.id, "Over:", over.id);

    if(over.id === "deleteZone") {
      setSelectedTodo(todos.find(todo => todo.id === active.id));
      setShowDeleteConfirm(true);
      return;
    }

    const isColumn = ["todo", "inProgress", "underChecking", "done"].includes(over.id);
    
    if (isColumn) {
      setTodos(prevTodos => {
        return prevTodos.map(todo =>
          todo.id === active.id ? { ...todo, status: over.id } : todo
        );
      });
      updateTodoStatus(active.id, over.id)
    } else {
      const overTodo = todos.find(todo => todo.id === over.id);
      if (overTodo) {
        setTodos(prevTodos => {
          return prevTodos.map(todo =>
            todo.id === active.id ? { ...todo, status: overTodo.status } : todo
          );
        });
        updateTodoStatus(active.id, overTodo.status)
      }
    }

    setActiveTodo(null);
  };

  const updateTodoStatus = async (todoId, newStatus) => {
    try{
      await axios.put(`${API_BASE_URL}/api/tasks/${todoId}`, { status: newStatus }, { withCredentials: true })
    }catch(err){
      console.log(err)
    }
  }

  const handleDeleteTodo = async (todoId) => {
    if(!selectedTodo) return;
    try{
      await axios({
        method: "DELETE",
        url: `${API_BASE_URL}/api/tasks/${selectedTodo.id}`,
        withCredentials: true
      });

      setTodos(prevTodos => prevTodos.filter(todo=> todo.id !== selectedTodo.id));
      setShowDeleteConfirm(false)
      setSelectedTodo(null);
    }catch (err){
      console.error("Error deleting todo:", err);
    }
  };

  const handleSelectTodo = (todo) => {
    setSelectedTodo(todo);
    setShowDeleteConfirm(true);
  }

  return (
      <TodoContext.Provider value={{ setTodos }}>
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full">
              <h3 className="text-xl font-bold text-white mb-4">Confirm Delete</h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to delete "{selectedTodo?.text}"
              </p>
              <div className="flex justify-end space-x-4">
                <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition"
                >
                  Cancel
                </button>
                <button
                onClick={handleDeleteTodo}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
        <div>
        <DndContext
          collisionDetection={pointerWithin}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          
          <div className="flex justify-center container mx-auto">
            <div>
            {children}
            </div>
            <div className="divider lg:divider-horizontal"></div>
            <div className="tooltip tooltip-top" data-tip="Drag a Todo here to Delete">
              <DeleteZone/>
            </div>
          </div>

          <div className="flex gap-4 p-4">
            <TodoColumn title="Todo" todos={todos} status="todo" onSelectTodo={handleSelectTodo} />
            <TodoColumn title="In Progress" todos={todos} status="inProgress" onSelectTodo={handleSelectTodo} />
            <TodoColumn title="Under Checking" todos={todos} status="underChecking" onSelectTodo={handleSelectTodo} />
            <TodoColumn title="Done" todos={todos} status="done" onSelectTodo={handleSelectTodo} />
          </div>
          <DragOverlay>
            {activeTodo ? <TodoCard todo={activeTodo} isDragging={true} onSelectTodo={handleSelectTodo}/> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </TodoContext.Provider>
  );
}

const DeleteZone = () => {
  const {setNodeRef, isOver} = useDroppable({id: "deleteZone"});

  return(
    <div
    ref={setNodeRef}
    className={`w-35 h-11 rounded-lg flex items-center justify-center ${isOver ? "bg-red-600" : "bg-red-800"} transition-color duration-200 border-2 border-dashed border-red-500`}
    >
      <div className="flex items-center text-white font-medium">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5 mr-2" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" 
          />
        </svg>
        DELETE TASK
      </div>
    </div>
  )
}

const TodoColumn = ({ title, todos, status, onSelectTodo }) => {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  const filteredTodos = todos.filter((todo) => todo.status === status);

  return (
    <div 
      ref={setNodeRef} 
      id={status} 
      className={`w-1/4 bg-base p-4 rounded-lg min-h-[200px] ${isOver ? 'bg-base-700' : ''}`}
    >
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <SortableContext 
        items={filteredTodos.map((todo) => todo.id)}
        strategy={verticalListSortingStrategy}
      >
        {filteredTodos.map((todo) => (
          <TodoCard key={todo.id} todo={todo} onSelectTodo={onSelectTodo}/>
        ))}
      </SortableContext>
    </div>
  );
};

const TodoCard = ({ todo, onSelectTodo, isDragging = false }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortableDragging } = useSortable({
      id: todo.id,
      data: todo,
    });
  
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging || isSortableDragging ? 0.5: 1
    };

    const finishByDate = todo.finishBy ? new Date(todo.finishBy).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    }) : new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    })


    const handleColorPriority = () => {
      if (todo.priority === "low") {
        return "bg-green-600";
      } else if (todo.priority === "medium") {
        return "bg-yellow-600";
      } else {
        return "bg-red-600";
      }
    };
    
  
    return (
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        className="bg-gray-800 rounded-lg p-4 mb-3 shadow-md cursor-grab border border-gray-700"
        style={style}
        onClick={() => onSelectTodo(todo)}
      >
        <h3 className="text-lg font-bold text-white mb-1">{todo.text}</h3>
        <p className="text-gray-400 text-sm mb-3">{todo.description || "Complete your task"}</p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className={`${handleColorPriority()} font-bold text-white text-xs px-3 py-1 rounded-full mr-2`}>
              {todo.priority.toUpperCase() || "EASY"}
            </span>
            <span className="flex items-center text-xs text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {finishByDate}
            </span>
          </div>
        </div>
      </div>
    );
  };
