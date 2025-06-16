import App from './modules/app.js';
import { saveToStorage, loadFromStorage } from './modules/storage.js';
import { renderProjects, renderTodos } from './modules/ui.js';
import './styles/main.css'
import UI from './modules/ui.js';

//UI.init();

document.addEventListener('DOMContentLoaded', () => {
    new App();
});

