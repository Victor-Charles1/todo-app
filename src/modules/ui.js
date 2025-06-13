// src/modules/ui.js
import { format } from 'date-fns';

const renderTodo = (todo) => {
  const todoElement = document.createElement('div');
  todoElement.innerHTML = `
    <h3>${todo.title}</h3>
    <p>Due: ${format(todo.dueDate, 'MM/dd/yyyy')}</p>
    <p class="priority-${todo.priority}">Priority: ${todo.priority}</p>
  `;
  return todoElement;
};

const renderProjects = (projects, activeProjectId) => {
  // Render project list with active project highlighted
};

export { renderTodo, renderProjects };