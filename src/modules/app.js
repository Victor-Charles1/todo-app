// src/modules/app.js
import { DefaultProject } from './project.js';

const App = () => {
  let projects = [DefaultProject];
  let activeProject = DefaultProject;

  return {
    getProjects: () => projects,
    createProject: (name) => {
      const newProject = Project(name);
      projects.push(newProject);
      return newProject;
    },
    setActiveProject: (project) => { activeProject = project; },
    getActiveProject: () => activeProject,
  };
};

export default App;