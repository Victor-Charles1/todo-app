import Todo from './todo.js';
import {Project, DefaultProject } from './project.js';
import createStorage from './storage.js';
import UI from './ui.js';

// Create storage instance
const Storage = createStorage(Project, Todo);

// Initialize with sample data if needed
// Storage.initializeWithSampleData();

export default class App {
    constructor() {
        this.projects = [];
        this.activeProjectId = null;
        
        // Initialize the application
        
        this.projects = Storage.loadProjects();
        this.activeProjectId = Storage.loadActiveProject();
        this.init();
      }
    

    init() {
        // Initialize UI first to create DOM elements
        UI.init();
        
        // Load data and setup event listeners
        this.loadData();
        this.setupEventListeners();
        this.render();
    }

    loadData() {
      const savedProjects = Storage.loadProjects();
      
      if (savedProjects.length === 0) {
        this.projects = [DefaultProject];
        this.activeProjectId = DefaultProject.id;
        this.saveData();
        return;
      }
    
      this.projects = savedProjects.map(projectData => {
        const project = Project(projectData.name);
        project.id = projectData.id;
        project.todos = projectData.todos.map(todoData => {
          // Use factory without 'new'
          const todo = Todo(
            todoData.title,
            todoData.description,
            todoData.dueDate,
            todoData.priority
          );
          
          // Set additional properties
          todo.id = todoData.id;
          todo.completed = todoData.completed;
          todo.notes = todoData.notes || [];
          todo.checklist = todoData.checklist || [];
          
          return todo;
        });
        return project;
      });

        // Load active project
        this.activeProjectId = Storage.loadActiveProject();
        if (!this.activeProjectId && this.projects.length > 0) {
            this.activeProjectId = this.projects[0].id;
        }
    }

    saveData() {
        Storage.saveProjects(this.projects);
        Storage.saveActiveProject(this.activeProjectId);
    }

    getActiveProject() {
        return this.projects.find(project => project.id === this.activeProjectId);
    }

    render() {
        const activeProject = this.getActiveProject();
        UI.renderProjects(this.projects, this.activeProjectId);

        const deleteBtn = document.getElementById('delete-project-btn');
        
        if (activeProject) {
            UI.renderTodos(activeProject.todos);
            document.getElementById('project-title').textContent = activeProject.name;
        } else {
            document.getElementById('project-title').textContent = 'No Projects';
            document.getElementById('todos-container').innerHTML = 
                '<p class="empty-state">Create a project to get started!</p>';
                 deleteBtn.classList.add('hidden');
        }
         // Show "No Projects" state if default project was cleared
    if (!activeProject && this.projects.length === 0) {
      document.getElementById('project-title').textContent = 'No Projects';
      document.getElementById('todos-container').innerHTML = 
          '<p class="empty-state">Create a project to get started!</p>';
  }
    }

    setupEventListeners() {
        // Project selection
        document.getElementById('projects-list').addEventListener('click', e => {
            if (e.target.tagName === 'LI') {
                this.activeProjectId = e.target.dataset.id;
                this.saveData();
                this.render();
            }
        });

        // Add new project
        document.getElementById('add-project-btn').addEventListener('click', () => {
            UI.showModal('project-modal');
        });
       

        document.getElementById('project-form').addEventListener('submit', e => {
            e.preventDefault();
            const name = document.getElementById('project-name').value;
            this.createProject(name);
            UI.hideModal('project-modal');
            UI.clearForm('project-form');
        });

        //Delete Project Btn
        document.getElementById('delete-project-btn').addEventListener('click', () => {
          this.deleteProject();
      });

      // Clear storage button
    document.getElementById('clear-storage-btn').addEventListener('click', () => {
      if (confirm('Are you sure you want to clear ALL data? This action cannot be undone!')) {
          Storage.clearAllData();
          
          // Reset application state
          this.projects = [DefaultProject];
          this.activeProjectId = DefaultProject.id;
          
          // Save and render
          this.saveData();
          this.render();
          
          alert('All data has been cleared. Application reset to default state.');
      }
  });

        // Add new todo
        document.getElementById('add-todo-btn').addEventListener('click', () => {
            if (!this.activeProjectId) {
                alert('Please select or create a project first!');
                return;
            }
            UI.showModal('todo-modal');
        });

        document.getElementById('todo-form').addEventListener('submit', e => {
            e.preventDefault();
            const title = document.getElementById('todo-title').value;
            const description = document.getElementById('todo-desc').value;
            const dueDate = document.getElementById('todo-date').value;
            const priority = document.getElementById('todo-priority').value;
            
            this.createTodo(title, description, dueDate, priority);
            UI.hideModal('todo-modal');
            UI.clearForm('todo-form');
        });
        
        // Todo actions (complete/edit/delete)
        document.getElementById('todos-container').addEventListener('click', e => {
            const todoCard = e.target.closest('.todo-card');
            if (!todoCard) return;
            
            const todoId = todoCard.dataset.id;
            const activeProject = this.getActiveProject();
            if (!activeProject) return;
            
            const todo = activeProject.findTodo(todoId);
            if (!todo) return;
            
            if (e.target.classList.contains('complete-btn')) {
                todo.toggleCompleted();
                this.saveData();
                this.render();
            }
            
            if (e.target.classList.contains('delete-btn')) {
                activeProject.removeTodo(todoId);
                this.saveData();
                this.render();
            }
            
            if (e.target.classList.contains('edit-btn')) {
                // Populate form with existing values
                document.getElementById('edit-todo-title').value = todo.title;
                document.getElementById('edit-todo-desc').value = todo.description;
                document.getElementById('edit-todo-date').value = todo.dueDate;
                document.getElementById('edit-todo-priority').value = todo.priority;
                document.getElementById('edit-todo-id').value = todo.id;
                
                UI.showModal('edit-modal');
            }
        });

        // Edit todo form
        document.getElementById('edit-form').addEventListener('submit', e => {
            e.preventDefault();
            const id = document.getElementById('edit-todo-id').value;
            const title = document.getElementById('edit-todo-title').value;
            const description = document.getElementById('edit-todo-desc').value;
            const dueDate = document.getElementById('edit-todo-date').value;
            const priority = document.getElementById('edit-todo-priority').value;
            
            this.updateTodo(id, { title, description, dueDate, priority });
            UI.hideModal('edit-modal');
        });

        // Close modals when clicking outside
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', e => {
                if (e.target === modal) {
                    UI.hideModal(modal.id);
                }
            });
        });
    }

    createProject(name) {
        const project = Project(name);
        this.projects.push(project);
        
        // Set as active if first project
        if (!this.activeProjectId) {
            this.activeProjectId = project.id;
        }
        
        this.saveData();
        this.render();
    }

    createTodo(title, description, dueDate, priority) {
      const activeProject = this.getActiveProject();
      if (!activeProject) return;
      
      // Use factory without 'new'
      const todo = Todo(title, description, dueDate, priority);
      activeProject.addTodo(todo);
      this.saveData();
      this.render();
    }

    updateTodo(todoId, newData) {
      const activeProject = this.getActiveProject();
      if (!activeProject) return;
      
      const todo = activeProject.findTodo(todoId);
      if (todo) {
        todo.update(newData);
        this.saveData();
        this.render();
      }
    }

    deleteProject() {
      if (!this.activeProjectId) return;
      
      // Confirm deletion
      if (!confirm('Are you sure you want to delete this project and all its tasks?')) {
          return;
      }
      
      // Find project index
      const projectIndex = this.projects.findIndex(p => p.id === this.activeProjectId);
      if (projectIndex === -1) return;
      
      // Remove project
      this.projects.splice(projectIndex, 1);
      
      // Update active project
      this.activeProjectId = this.projects.length > 0 ? this.projects[0].id : null;
      
      // Save and render
      this.saveData();
      this.render();
  }
}