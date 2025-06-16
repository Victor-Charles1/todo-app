// src/modules/todo.js
// import { parseISO } from "date-fns";
// const Todo = (title, description, dueDate, priority) => {
//   // Convert string to Date object if needed
//   const parsedDueDate = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
//     return {
//       id: Date.now().toString(), // Unique identifier
//       title,
//       description,
//       dueDate, // Date object (use date-fns to format)
//       priority: priority || 'medium', // 'low', 'medium', 'high'
//       notes: [],
//       checklist: [],
//       isComplete: false,
//       toggleComplete() { this.isComplete = !this.isComplete; },
//       updatePriority(newPriority) { this.priority = newPriority; },
//     };
//   };
  
//   export default Todo;
const Todo = (title, description, dueDate, priority) => {
  return {
    id: Date.now().toString(),
    title,
    description,
    dueDate, // Store as string (YYYY-MM-DD format)
    priority: priority || 'medium',
    notes: [],
    checklist: [],
    completed: false,
    
    // Methods
    toggleCompleted() {
      this.completed = !this.completed;
    },
    updatePriority(newPriority) {
      this.priority = newPriority;
    },
    update(newData) {
      Object.keys(newData).forEach(key => {
        if (this.hasOwnProperty(key) && key !== 'id') {
          this[key] = newData[key];
        }
      });
    }
  };
};

export default Todo;