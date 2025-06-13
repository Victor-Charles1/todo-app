// src/modules/todo.js
const Todo = (title, description, dueDate, priority) => {
    return {
      id: Date.now().toString(), // Unique identifier
      title,
      description,
      dueDate, // Date object (use date-fns to format)
      priority: priority || 'medium', // 'low', 'medium', 'high'
      notes: [],
      checklist: [],
      isComplete: false,
      toggleComplete() { this.isComplete = !this.isComplete; },
      updatePriority(newPriority) { this.priority = newPriority; },
    };
  };
  
  export default Todo;