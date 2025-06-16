// src/modules/project.js
const Project = (name) => {
    return {
      id: Date.now().toString(),
      name,
      todos: [],
      addTodo(todo) { this.todos.push(todo); },
      removeTodo(todoId) {
        this.todos = this.todos.filter(todo => todo.id !== todoId);
      },
      findTodo(todoId) {
        return this.todos.find(todo => todo.id === todoId);
    }
    };
  };
  
  // Default project
  const DefaultProject = Project('Personal');
  export { Project, DefaultProject };