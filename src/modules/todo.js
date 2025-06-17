// src/modules/todo.js

  
//   export default Todo;
const Todo = (title, description, dueDate, priority) => {
  return {
    id: Date.now().toString(),
    title,
    description,
    dueDate, // Store as string (YYYY-MM-DD format)
    priority: priority || 'medium',
    completed: true,
    notes: [],
    checklist: [],
    
    
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

export const sampleTodo = Todo(
  'Buy groceries',
  'Milk, eggs, bread, fruits',
  new Date().toISOString().split('T')[0],
  'medium',false,
);

export default Todo;