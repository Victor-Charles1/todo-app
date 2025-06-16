import { format, isToday, isTomorrow } from 'date-fns';

export default class UI {
    static init() {
        // Create main application structure
        const app = document.getElementById('app');
        
        // Container
        const container = document.createElement('div');
        container.className = 'container';
        app.appendChild(container);
        
        // Sidebar
        const sidebar = document.createElement('aside');
        sidebar.className = 'sidebar';
        sidebar.innerHTML = `
            <h2>Projects</h2>
            <ul id="projects-list"></ul>
            <button id="add-project-btn">+ Add Project</button>
        `;
        container.appendChild(sidebar);
        
        // Main Content
        const content = document.createElement('main');
        content.className = 'content';
        content.innerHTML = `
            <h1 id="project-title">All Tasks</h1>
            <div id="todos-container" class="todos-grid"></div>
            <button id="add-todo-btn">+ New Task</button>
        `;
        container.appendChild(content);
        
        // Create modals
        this.createModal('project-modal', 'New Project', 'project-form', [
            { type: 'text', id: 'project-name', placeholder: 'Project name', required: true }
        ]);
        
        this.createModal('todo-modal', 'New Task', 'todo-form', [
            { type: 'text', id: 'todo-title', placeholder: 'Title', required: true },
            { type: 'textarea', id: 'todo-desc', placeholder: 'Description' },
            { type: 'date', id: 'todo-date', required: true },
            { 
                type: 'select', 
                id: 'todo-priority', 
                options: [
                    { value: 'low', text: 'Low' },
                    { value: 'medium', text: 'Medium' },
                    { value: 'high', text: 'High' }
                ]
            }
        ]);
        
        this.createModal('edit-modal', 'Edit Task', 'edit-form', [
            { type: 'hidden', id: 'edit-todo-id' },
            { type: 'text', id: 'edit-todo-title', placeholder: 'Title', required: true },
            { type: 'textarea', id: 'edit-todo-desc', placeholder: 'Description' },
            { type: 'date', id: 'edit-todo-date', required: true },
            { 
                type: 'select', 
                id: 'edit-todo-priority', 
                options: [
                    { value: 'low', text: 'Low' },
                    { value: 'medium', text: 'Medium' },
                    { value: 'high', text: 'High' }
                ]
            }
        ]);
    }

    static createModal(id, title, formId, fields) {
      const modal = document.createElement('div');
      modal.id = id;
      modal.className = 'modal';
      
      const modalContent = document.createElement('div');
      modalContent.className = 'modal-content';
      
      const titleEl = document.createElement('h2');
      titleEl.textContent = title;
      
      const form = document.createElement('form');
      form.id = formId;
      
      fields.forEach(field => {
          if (field.type === 'select') {
              const select = document.createElement('select');
              select.id = field.id;
              field.options.forEach(option => {
                  const optionEl = document.createElement('option');
                  optionEl.value = option.value;
                  optionEl.textContent = option.text;
                  select.appendChild(optionEl);
              });
              form.appendChild(select);
          } else {
              const isTextarea = field.type === 'textarea';
              const input = isTextarea 
                  ? document.createElement('textarea') 
                  : document.createElement('input');
              
              // Only set type for non-textarea elements
              if (!isTextarea) {
                  input.type = field.type;
              }
              
              input.id = field.id;
              if (field.placeholder) input.placeholder = field.placeholder;
              if (field.required) input.required = true;
              
              form.appendChild(input);
          }
      });
      
      const submitBtn = document.createElement('button');
      submitBtn.type = 'submit';
      submitBtn.textContent = formId === 'edit-form' 
          ? 'Update Task' 
          : (formId === 'project-form' ? 'Create' : 'Add Task');
      form.appendChild(submitBtn);
      
      modalContent.appendChild(titleEl);
      modalContent.appendChild(form);
      modal.appendChild(modalContent);
      
      document.body.appendChild(modal);
  }

    static renderProjects(projects, activeProjectId) {
        const projectsContainer = document.getElementById('projects-list');
        projectsContainer.innerHTML = '';

        projects.forEach(project => {
            const projectEl = document.createElement('li');
            projectEl.textContent = project.name;
            projectEl.dataset.id = project.id;
            projectEl.classList.toggle('active', project.id === activeProjectId);
            projectsContainer.appendChild(projectEl);
        });
    }

    static renderTodos(todos) {
        const todosContainer = document.getElementById('todos-container');
        todosContainer.innerHTML = '';

        if (todos.length === 0) {
            todosContainer.innerHTML = '<p class="empty-state">No tasks yet. Add your first task!</p>';
            return;
        }

        todos.forEach(todo => {
            const todoEl = document.createElement('div');
            todoEl.className = 'todo-card';
            todoEl.dataset.id = todo.id;
            
            const formattedDate = this.formatTodoDate(todo.dueDate);
            
            todoEl.innerHTML = `
    <div class="todo-header">
      <h3>${todo.title}</h3>
      <span class="priority-badge ${todo.priority}">${todo.priority}</span>
    </div>
    <p>${todo.description}</p>
    <div class="todo-footer">
      <span class="date">${formattedDate}</span>
      <div class="actions">
        <button class="complete-btn">${todo.completed ? 'Undo' : 'Complete'}</button>
        <!-- ... -->
      </div>
    </div>
  `;
  
  if (todo.completed) {
    todoEl.classList.add('completed');
  }
            
            todosContainer.appendChild(todoEl);
        });
    }

    static formatTodoDate(dateString) {
        const date = new Date(dateString);
        if (isToday(date)) return 'Today';
        if (isTomorrow(date)) return 'Tomorrow';
        return format(date, 'MMM dd, yyyy');
    }

    static clearForm(formId) {
        document.getElementById(formId).reset();
    }

    static showModal(modalId) {
        document.getElementById(modalId).classList.add('active');
    }

    static hideModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
    }
}