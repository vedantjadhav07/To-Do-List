import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [deadline, setDeadline] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Function to add a new task
  const addTask = () => {
    if (taskText.trim() === "" || deadline.trim() === "") return;

    const newTask = {
      id: Date.now().toString(),
      text: taskText,
      deadline: new Date(deadline),
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setTaskText("");
    setDeadline("");
  };

  
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

 
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedTasks = [...tasks];
    const [movedTask] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, movedTask);
    setTasks(reorderedTasks);
  };

 
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  
  useEffect(() => {
    const interval = setInterval(() => {
      tasks.forEach((task) => {
        const timeLeft = new Date(task.deadline) - new Date();
        if (timeLeft > 0 && timeLeft < 5 * 60 * 1000) { // 5 mins before
          toast.warning(`⏳ Reminder: Task "${task.text}" is due soon!`);
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [tasks]);

  return (
    <div className={darkMode ? "dark-mode" : "light-mode"}>
      <ToastContainer position="top-right" autoClose={5000} />
      <button className="toggle-btn" onClick={toggleDarkMode}>
        {darkMode ? "Light Mode" : "Dark Mode"}
      </button>

      <h1>📝 To-Do List</h1>
      <div className="input-container">
        <input
          type="text"
          placeholder="Enter task"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
        />
        <input
          type="datetime-local"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <button onClick={addTask}>➕ Add Task</button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tasks">
          {(provided) => (
            <ul className="task-list" {...provided.droppableProps} ref={provided.innerRef}>
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="task-item"
                    >
                      <span>{task.text} (Due: {new Date(task.deadline).toLocaleString()})</span>
                      <button onClick={() => deleteTask(task.id)}>❌</button>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default App;
