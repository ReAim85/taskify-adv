import { useEffect, useState } from "react";
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

const initialTodos = [
  { id: "1", text: "Learn React", description: "Complete your react project after that",status: "todo" },
  { id: "2", text: "Build API", status: "todo" },
  { id: "3", text: "Test Features", status: "underChecking" },
  { id: "4", text: "Deploy App", status: "done" },
];

export default function KanbanBoard() {
  const [todos, setTodos] = useState(initialTodos);
  const [activeTodo, setActiveTodo] = useState(null);

  useEffect(() => {
    const fetchTodos = async () => {
   try{
    const res = await axios.get("http://localhost:5000/api/tasks", { withCredentials: true })

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
      await axios.put(`http://localhost:5000/api/tasks/${todoId}`, { status: newStatus }, { withCredentials: true })
    }catch(err){
      console.log(err)
    }
  }

  const handleDeleteTodo = async (todoId) => {
    try{
      console.log("Delete request initiated for todo ID: ", todoId);

      const response = await axios({
        method: "DELETE",
        url: `http://localhost:5000/api/tasks/${todoId}`,
        withCredentials: true,
        headers: {
          "Content-type": "application/json"
        }
      });

      console.log("Delete response: ", response);

      if(response.status === 200 || response.status === 204) {
        setTodos(prevTodo => prevTodo.filter(todo => todo.id !== todoId));
        console.log("Todo removed from state after successful deletion")
      }
    }catch(err){
      console.log(err)
    }
  };

  return (
    <DndContext
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 p-4">
        <TodoColumn title="Todo" todos={todos} status="todo" onDelete={handleDeleteTodo} />
        <TodoColumn title="In Progress" todos={todos} status="inProgress" onDelete={handleDeleteTodo} />
        <TodoColumn title="Under Checking" todos={todos} status="underChecking" onDelete={handleDeleteTodo} />
        <TodoColumn title="Done" todos={todos} status="done" onDelete={handleDeleteTodo} />
      </div>

      <DragOverlay>
        {activeTodo ? <TodoCard todo={activeTodo} isDragging={true} onDelete={handleDeleteTodo}/> : null}
      </DragOverlay>
    </DndContext>
  );
}

const TodoColumn = ({ title, todos, status, onDelete }) => {
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
          <TodoCard key={todo.id} todo={todo} onDelete={onDelete}/>
        ))}
      </SortableContext>
    </div>
  );
};

const TodoCard = ({ todo, onDelete, isDragging = false }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortableDragging } = useSortable({
      id: todo.id,
      data: todo,
      modifiers: [
        args => {
          if(args.event.target.closest('button[data-action="delete"]')){
            return { ...args, activatorEvent: null };
          }
          return args;
        }
      ]
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

    const handleDeleteClick = (e) => {
      e.preventDefault();
      e.stopPropogation();
      if(onDelete && todo.id){
        console.log("Explicitly calling delete for todo ID:", todo.id);
        onDelete(todo.id)
      }
    }

    const cardProps = {
      ref: setNodeRef,
      ...attributes,
      ...listeners,
      style,
      className: "bg-gray-800 rounded-lg p-4 mb-3 shadow-md cursor-grab border border-gray-700"
    }
  
    return (
      <div {...cardProps}>
        <h3 className="text-lg font-bold text-white mb-1">{todo.text}</h3>
        <p className="text-gray-400 text-sm mb-3">{todo.description || "Complete your task"}</p>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <span className="bg-red-600 text-white text-xs px-3 py-1 rounded-full mr-2">
              {todo.priority || "easy"}
            </span>
            <span className="flex items-center text-xs text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {finishByDate}
            </span>
          </div>
          
          <button 
            data-aciton="delete"
            onClick={handleDeleteClick}
            className="text-gray-400 hover:text-white p-2"
            aria-label="Delete task"
            onMouseDown={(e)=> e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    );
  };
