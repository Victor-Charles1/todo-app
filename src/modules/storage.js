// src/modules/storage.js
export const saveToStorage = (projects) => {
    const data = JSON.stringify(projects);
    localStorage.setItem('todoData', data);
  };
  
  export const loadFromStorage = () => {
    const data = localStorage.getItem('todoData');
    return data ? JSON.parse(data) : null;
  };
  
  // Handle date serialization/deserialization (date-fns)