// src/modules/storage.js
const createStorage = (Project, Todo) => {
  // Private helper to reconstruct projects with methods
  const reconstructProject = (projectData) => {
    const project = Project(projectData.name);
    project.id = projectData.id;
    project.todos = projectData.todos.map(reconstructTodo);
    return project;
  };

  // Private helper to reconstruct todos with methods
  const reconstructTodo = (todoData) => {
    const todo = Todo(
      todoData.title,
      todoData.description,
      todoData.dueDate,
      todoData.priority
    );
    
    // Preserve all properties
    Object.keys(todoData).forEach(key => {
      if (key !== 'id' && todoData[key] !== undefined) {
        todo[key] = todoData[key];
      }
    });
    
    // Ensure ID is preserved
    todo.id = todoData.id;
    return todo;
  };

  // Public API
  return {
    saveProjects(projects) {
      try {
        const serializedProjects = projects.map(project => ({
          id: project.id,
          name: project.name,
          todos: project.todos.map(todo => ({
            id: todo.id,
            title: todo.title,
            description: todo.description,
            dueDate: todo.dueDate,
            priority: todo.priority,
            completed: todo.completed,
            notes: todo.notes || [],
            checklist: todo.checklist || []
          }))
        }));
        
        localStorage.setItem('projects', JSON.stringify(serializedProjects));
        return true;
      } catch (error) {
        console.error('Failed to save projects:', error);
        return false;
      }
    },

    loadProjects() {
      try {
        const projectsData = localStorage.getItem('projects');
        if (!projectsData) return [];
        
        return JSON.parse(projectsData).map(reconstructProject);
      } catch (error) {
        console.error('Failed to load projects:', error);
        return [];
      }
    },

    saveActiveProject(projectId) {
      try {
        localStorage.setItem('activeProject', projectId);
        return true;
      } catch (error) {
        console.error('Failed to save active project:', error);
        return false;
      }
    },

    loadActiveProject() {
      try {
        return localStorage.getItem('activeProject');
      } catch (error) {
        console.error('Failed to load active project:', error);
        return null;
      }
    },

    clearAllData() {
      try {
        localStorage.removeItem('projects');
        localStorage.removeItem('activeProject');
        return true;
      } catch (error) {
        console.error('Failed to clear data:', error);
        return false;
      }
    },

    initializeWithSampleData() {
      if (localStorage.getItem('projects')) return;
      
      const personal = Project('Personal');
      personal.id = 'personal';
      personal.todos = [
        Todo(
          'Buy groceries',
          'Milk, eggs, bread, fruits',
          new Date().toISOString().split('T')[0],
          'medium'
        )
      ];
      
      const work = Project('Work');
      work.id = 'work';
      work.todos = [
        Todo(
          'Prepare presentation',
          'Quarterly review for stakeholders',
          new Date(Date.now() + 86400000).toISOString().split('T')[0],
          'high'
        )
      ];
      
      this.saveProjects([personal, work]);
      this.saveActiveProject('personal');
    }
  };
};

export default createStorage;