// simple task manager
let tasks = [];
let settings = {
    dailyTarget: 600,
    timeUnit: 'minutes'
};

const DEFAULT_TASKS = [
    {
        "id": "task_1701000001",
        "name": "Final Project UI Design",
        "dueDate": "2025-10-25",
        "duration": 240,
        "tag": "Project",
        "completed": false,
        "createdAt": "2025-10-10T10:00:00Z",
        "updatedAt": "2025-10-10T10:00:00Z"
    },
    {
        "id": "task_1701000002",
        "name": "Read Chapter 4 Notes",
        "dueDate": "2025-10-18",
        "duration": 60,
        "tag": "Study",
        "completed": false,
        "createdAt": "2025-10-11T12:00:00Z",
        "updatedAt": "2025-10-11T12:00:00Z"
    },
    {
        "id": "task_1701000003",
        "name": "Team Meeting Prep",
        "dueDate": "2025-10-16",
        "duration": 30,
        "tag": "Project",
        "completed": true,
        "createdAt": "2025-10-09T08:30:00Z",
        "updatedAt": "2025-10-15T15:10:00Z"
    },
    {
        "id": "task_1701000004",
        "name": "Grocery Shopping",
        "dueDate": "2025-10-17",
        "duration": 45,
        "tag": "Personal",
        "completed": false,
        "createdAt": "2025-10-14T18:00:00Z",
        "updatedAt": "2025-10-14T18:00:00Z"
    },
    {
        "id": "task_1701000005",
        "name": "Advanced Regex Practice",
        "dueDate": "2025-10-20",
        "duration": 90,
        "tag": "Study",
        "completed": false,
        "createdAt": "2025-10-15T09:00:00Z",
        "updatedAt": "2025-10-15T09:00:00Z"
    },
    {
        "id": "task_1701000006",
        "name": "Submit CV Application",
        "dueDate": "2025-11-01",
        "duration": 15,
        "tag": "Personal",
        "completed": false,
        "createdAt": "2025-10-01T14:40:00Z",
        "updatedAt": "2025-10-01T14:40:00Z"
    },
    {
        "id": "task_1701000007",
        "name": "Review Data Structures",
        "dueDate": "2025-10-22",
        "duration": 180,
        "tag": "Study",
        "completed": false,
        "createdAt": "2025-10-10T11:00:00Z",
        "updatedAt": "2025-10-10T11:00:00Z"
    },
    {
        "id": "task_1701000008",
        "name": "Library Visit for Books",
        "dueDate": "2025-10-19",
        "duration": 50,
        "tag": "Other",
        "completed": false,
        "createdAt": "2025-10-13T16:00:00Z",
        "updatedAt": "2025-10-13T16:00:00Z"
    },
    {
        "id": "task_1701000009",
        "name": "Semester Planning Session",
        "dueDate": "2026-01-15",
        "duration": 120,
        "tag": "Other",
        "completed": false,
        "createdAt": "2025-10-05T09:00:00Z",
        "updatedAt": "2025-10-05T09:00:00Z"
    },
    {
        "id": "task_1701000010",
        "name": "Quick email check",
        "dueDate": "2025-10-16",
        "duration": 10,
        "tag": "Personal",
        "completed": true,
        "createdAt": "2025-10-16T08:00:00Z",
        "updatedAt": "2025-10-16T08:05:00Z"
    }
];



// Load data when page starts
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    setupEventListeners();
    showSection('dashboard');
    updateDashboard();
    renderTasks();
});

// Set up all event listeners
function setupEventListeners() {

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            showSection(targetId);
        });
    });

    // Add task form
    document.getElementById('add-task-form').addEventListener('submit', addNewTask);

    // Sort buttons
    const sortDateBtn = document.getElementById('sort-date');
    const sortNameBtn = document.getElementById('sort-name');
    const sortDurationBtn = document.getElementById('sort-duration');

    if (sortDateBtn) sortDateBtn.addEventListener('click', () => sortTasks('dueDate'));
    if (sortNameBtn) sortNameBtn.addEventListener('click', () => sortTasks('name'));
    if (sortDurationBtn) sortDurationBtn.addEventListener('click', () => sortTasks('duration'));

    // Search
    const searchBtn = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');
    if (searchBtn) searchBtn.addEventListener('click', performSearch);
    if (searchInput) searchInput.addEventListener('input', performSearch);

    // Settings
    document.getElementById('daily-target').addEventListener('change', updateSettings);
    document.getElementById('time-unit').addEventListener('change', updateSettings);

    // Data management
    document.getElementById('export-btn').addEventListener('click', exportData);
    document.getElementById('import-btn').addEventListener('click', () => {
        document.getElementById('import-file').click();
    });
    document.getElementById('import-file').addEventListener('change', importData);
}

// Show different sections
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.add('hidden');
    });

    // Remove active class from all nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Show selected section and set active nav
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.remove('hidden');
    }

    const activeLink = document.querySelector(`[href="#${sectionId}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }

    // Clear search results when navigating away from the tasks section
    if (sectionId !== 'record') {
        const searchInput = document.getElementById('search-input');
        const searchResults = document.getElementById('search-results');
        if(searchInput) searchInput.value = '';
        if(searchResults) searchResults.innerHTML = '';
        renderTasks();
    } else {
        // Re-render tasks when navigating to the record section
        renderTasks();
    }
}



function showWebMessage(message, elementId, duration = 3000) {
    const confirmMessage = document.getElementById(elementId);
    if (confirmMessage) {
        confirmMessage.textContent = message;
        confirmMessage.classList.remove('hidden');

        // Hide message after the specified duration
        setTimeout(() => {
            confirmMessage.classList.add('hidden');
        }, duration);
    }
}



// Add new task
function addNewTask(e) {
    e.preventDefault();

    const nameInput = document.getElementById('task-name');
    const dueDateInput = document.getElementById('task-dueDate');
    const durationInput = document.getElementById('task-duration');
    const tagInput = document.getElementById('task-tag');

    const name = nameInput.value;
    const dueDate = dueDateInput.value;
    const duration = parseInt(durationInput.value);
    const tag = tagInput.value;
    const now = new Date().toISOString();

    // Validate input
    if (!validateTask(name, dueDate, duration)) {
        return;
    }

    const cleanName = name.trim().replace(/\s\s+/g, ' ');


    const newTask = {
        id: 'task_' + Date.now(),
        name: cleanName,
        dueDate: dueDate,
        duration: duration,
        tag: tag,
        completed: false,
        createdAt: now,
        updatedAt: now
    };

    tasks.push(newTask);
    saveData();
    updateDashboard();


    document.getElementById('add-task-form').reset();


    const successMessage = `Task "${cleanName}" added successfully! Navigate to My Tasks to view it.`;
    showWebMessage(successMessage, 'task-confirmation-message', 3000);

}


function validateTask(name, date, duration) {
    let isValid = true;


    const setError = (id, message) => {
        const element = document.getElementById(id);
        if(element) element.textContent = message;
        isValid = false;
    };
    const clearError = (id) => {
        const element = document.getElementById(id);
        if(element) element.textContent = '';
    };

    // Clear all errors before re-validation
    clearError('name-error');
    clearError('date-error');
    clearError('duration-error');


    if (!name.trim()) {
        setError('name-error', 'Task name is required.');
    } else if (name !== name.trim()) {
        setError('name-error', 'Task name cannot have leading or trailing spaces.');
    } else if (/\s\s+/.test(name)) { // Check for double spaces
        setError('name-error', 'Task name should not have consecutive spaces.');
    } else {

        const duplicateWords = /(\b\w+\b)\s+\1/i;
        if (duplicateWords.test(name)) {
            if (!confirm('Warning: Task name has duplicate words. Continue anyway?')) {
                isValid = false;
            }
        }
    }


    const datePattern = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
    if (!datePattern.test(date)) {
        setError('date-error', 'Please enter a valid date in YYYY-MM-DD format (e.g., 2025-10-15).');
    }


    const durationPattern = /^[1-9]\d*$/;
    if (isNaN(duration) || duration <= 0 || !durationPattern.test(String(duration))) {
        setError('duration-error', 'Duration must be a positive whole number (1 or more).');
    }


    return isValid;
}


// Display all tasks
function renderTasks(filterTasks = tasks) {
    const container = document.getElementById('tasks-list');
    const noTasksMessage = document.getElementById('no-tasks-message');

    if (!container) return;

    if (filterTasks.length === 0) {
        if(noTasksMessage) noTasksMessage.classList.remove('hidden');
        container.innerHTML = '';
        return;
    }

    if(noTasksMessage) noTasksMessage.classList.add('hidden');

    let html = '';
    filterTasks.forEach(task => {
        const durationDisplay = settings.timeUnit === 'hours'
            ? (task.duration / 60).toFixed(1) + ' hours'
            : task.duration + ' mins';

        html += `
            <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}" tabindex="0">
                <div class="task-details">
                    <h3 class="task-name">${task.name}</h3>
                    <p class="task-info">
                        <span>Due: ${task.dueDate}</span>
                        <span>Duration: ${durationDisplay}</span>
                        <span class="task-tag">${task.tag}</span>
                    </p>
                </div>
                <div class="task-actions">
                    <button class="toggle-complete-btn secondary-button" onclick="toggleComplete('${task.id}')">
                        ${task.completed ? 'Undo' : 'Complete'}
                    </button>
                    <button class="edit-btn secondary-button" onclick="editTask('${task.id}')">Edit</button>
                    <button class="delete-btn primary-button" onclick="deleteTask('${task.id}', '${task.name}')">Delete</button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}


function toggleComplete(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        task.updatedAt = new Date().toISOString();
        saveData();
        renderTasks();
        updateDashboard();
    }
}


function deleteTask(taskId, taskName) {
    if (confirm(`Are you sure you want to delete the task: "${taskName}"?`)) {


        tasks = tasks.filter(t => t.id !== taskId);
        // Save and Update UI
        saveData();
        renderTasks();
        updateDashboard();


        showWebMessage(`Task "${taskName}" deleted successfully!`, 'deletion-confirmation-message');


    }
}

// Simple task editing
function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    const newName = prompt('Edit task name:', task.name);
    if (newName !== null) {
        const cleanNewName = newName.trim().replace(/\s\s+/g, ' ');
        if (cleanNewName !== '' && cleanNewName !== task.name) {
            if (!validateTask(newName, task.dueDate, task.duration)) {
                alert('Invalid name format. Edit cancelled.');
                return;
            }
            task.name = cleanNewName;
            task.updatedAt = new Date().toISOString();
            saveData();
            renderTasks();
            updateDashboard();
        } else if (cleanNewName === '') {
            alert('Task name cannot be empty.');
        }
    }
}

// Sort tasks
function sortTasks(by) {
    tasks.sort((a, b) => {
        if (by === 'name') {
            return a.name.localeCompare(b.name);
        } else if (by === 'duration') {
            return a.duration - b.duration;
        } else if (by === 'dueDate') {
            return new Date(a.dueDate) - new Date(b.dueDate);
        }
        return 0;
    });

    renderTasks();


    const targetStatus = document.getElementById('target-status');
    if (targetStatus) {
        targetStatus.setAttribute('aria-live', 'polite');
        targetStatus.textContent = `Tasks sorted by ${by}.`;
    }
}





function compileRegex(input, flags='i') {
    try {
        return input ? new RegExp(input, flags) : null;
    } catch (e) {
        console.error('Invalid regex pattern:', e);
        return null;
    }
}

// Search tasks with regex 
function performSearch() {
    const searchInput = document.getElementById('search-input');
    const caseSensitive = document.getElementById('case-sensitive');
    const tasksListContainer = document.getElementById('tasks-list');
    const resultsContainer = document.getElementById('search-results');

    if (!searchInput || !resultsContainer || !tasksListContainer) return;

    const pattern = searchInput.value.trim();

    if (!pattern) {
        resultsContainer.innerHTML = '';
        renderTasks(tasks);
        return;
    }

    const flags = caseSensitive.checked ? '' : 'i';
    const regex = compileRegex(pattern, flags);

    if (!regex) {
        resultsContainer.innerHTML = '<p class="error-message">Invalid search pattern. Please check your regex syntax.</p>';
        renderTasks(tasks);
        return;
    }

    const matches = tasks.filter(task => regex.test(task.name) || regex.test(task.tag));

    if (matches.length === 0) {
        resultsContainer.innerHTML = '<p>No tasks found matching your pattern.</p>';
        tasksListContainer.innerHTML = '';
    } else {
        let html = '';
        matches.forEach(task => {
            const highlight = (text, re) => text.replace(re, match => `<mark>${match}</mark>`);

            const highlightedName = highlight(task.name, regex);
            const highlightedTag = highlight(task.tag, regex);

            const durationDisplay = settings.timeUnit === 'hours'
                ? (task.duration / 60).toFixed(1) + ' hours'
                : task.duration + ' mins';

            html += `
                <div class="task-item ${task.completed ? 'completed' : ''}" data-id="${task.id}" tabindex="0">
                    <div class="task-details">
                        <h3 class="task-name">${highlightedName}</h3>
                        <p class="task-info">
                            <span>Due: ${task.dueDate}</span>
                            <span>Duration: ${durationDisplay}</span>
                            <span class="task-tag">${highlightedTag}</span>
                        </p>
                    </div>
                </div>
             `;
        });
        resultsContainer.innerHTML = `<h4>Search Results (${matches.length} found):</h4>` + html;
        tasksListContainer.innerHTML = '';
    }
}





function updateDashboard() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const totalDuration = tasks.reduce((sum, task) => sum + task.duration, 0);

    const durationDisplay = settings.timeUnit === 'hours'
        ? (totalDuration / 60).toFixed(1) + ' hours'
        : totalDuration + ' mins';


    const tagCounts = tasks.reduce((acc, task) => {
        acc[task.tag] = (acc[task.tag] || 0) + 1;
        return acc;
    }, {});

    let topTag = 'None';
    let maxCount = 0;
    for (const tag in tagCounts) {
        if (tagCounts[tag] > maxCount) {
            maxCount = tagCounts[tag];
            topTag = tag;
        }
    }

    // Update Dashboard DOM elements
    document.getElementById('total-tasks-value').textContent = totalTasks;
    document.getElementById('completed-tasks-value').textContent = completedTasks;
    document.getElementById('pending-tasks-value').textContent = pendingTasks;
    document.getElementById('total-duration-value').textContent = durationDisplay;
    document.getElementById('top-category-value').textContent = topTag;

    const dailyTargetValue = settings.timeUnit === 'hours'
        ? (settings.dailyTarget / 60).toFixed(1) + ' hours'
        : settings.dailyTarget + ' mins';

    document.getElementById('daily-target-display').textContent = dailyTargetValue;


    // Cap/Target: ARIA live message (Rubric E)
    const targetStatus = document.getElementById('target-status');
    const remaining = settings.dailyTarget - totalDuration;

    if (targetStatus) {
        if (remaining >= 0) {
            targetStatus.textContent = `You have ${remaining} minutes remaining to meet your target.`;
            targetStatus.setAttribute('aria-live', 'polite');
            targetStatus.style.backgroundColor = '#dae6dc';
            targetStatus.style.color = 'black';
        } else {
            targetStatus.textContent = `You are ${Math.abs(remaining)} minutes OVER your target!`;
            targetStatus.setAttribute('aria-live', 'assertive');
            targetStatus.style.backgroundColor = '#1e4e21';
            targetStatus.style.color = 'red';
        }
    }
}

// Update app settings
function updateSettings() {
    settings.dailyTarget = Math.max(0, parseInt(document.getElementById('daily-target').value) || 0);
    settings.timeUnit = document.getElementById('time-unit').value;
    saveData();
    updateDashboard();
    renderTasks();
}




// Save to browser storage
function saveData() {
    const data = {
        tasks: tasks,
        settings: settings
    };
    localStorage.setItem('campusPlanner', JSON.stringify(data));
}

// Load from browser storage
function loadData() {
    const saved = localStorage.getItem('campusPlanner');


    if (saved) {
        try {
            const data = JSON.parse(saved);
            tasks = data.tasks || [];
            settings = data.settings || { dailyTarget: 600, timeUnit: 'minutes' };

        } catch (e) {
     
            console.error("Error loading data from localStorage. Loading seed data.", e);
            alert("Corrupted data detected in local storage. Loading default tasks.");
            tasks = DEFAULT_TASKS; 
            settings = { dailyTarget: 600, timeUnit: 'minutes' };
        }
    } else {

        tasks = DEFAULT_TASKS;
        settings = { dailyTarget: 600, timeUnit: 'minutes' };
    }

  
    tasks = tasks.map(task => ({
        id: task.id || 'task_' + Date.now() + Math.random(),
        name: task.name,
        dueDate: task.dueDate,
        duration: task.duration,
        tag: task.tag,
        completed: task.completed || false,
        createdAt: task.createdAt || new Date().toISOString(),
        updatedAt: task.updatedAt || task.createdAt || new Date().toISOString()
    }));


    const dailyTargetInput = document.getElementById('daily-target');
    const timeUnitSelect = document.getElementById('time-unit');

    if(dailyTargetInput) dailyTargetInput.value = settings.dailyTarget;
    if(timeUnitSelect) timeUnitSelect.value = settings.timeUnit;

  
    saveData();
}

function exportData() {
    const data = {
        tasks: tasks,
        settings: settings
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'campus-planner-data.json';
    a.click();
    URL.revokeObjectURL(url);

    alert('Data exported successfully! Check your downloads.');
}

// Import data from JSON file
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);


            const isValidImport = data.tasks && Array.isArray(data.tasks) && data.tasks.every(t =>
                t.id && t.name && t.dueDate && typeof t.duration === 'number' && t.tag && typeof t.completed === 'boolean'
            );

            if (isValidImport) {
                tasks = data.tasks;
                settings = data.settings || settings;


                const dailyTargetInput = document.getElementById('daily-target');
                const timeUnitSelect = document.getElementById('time-unit');

                if(dailyTargetInput) dailyTargetInput.value = settings.dailyTarget;
                if(timeUnitSelect) timeUnitSelect.value = settings.timeUnit;

                saveData();
                renderTasks();
                updateDashboard();
                alert('Data imported successfully!');
            } else {
                alert('Invalid file format or missing required task fields (id, name, duration, tag, completed).');
            }
        } catch (error) {
            alert('Error reading file. Ensure it is a valid JSON format.');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}



window.toggleComplete = toggleComplete;
window.deleteTask = deleteTask;
window.editTask = editTask;