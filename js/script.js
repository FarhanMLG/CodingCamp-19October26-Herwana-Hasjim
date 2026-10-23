// --- 1. CHALLENGE: Light/Dark Mode ---
const themeToggleBtn = document.getElementById('theme-toggle');
let currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);

themeToggleBtn.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
});

// --- 2. Greeting & Clock & CHALLENGE: Custom Name ---
const timeDisplay = document.getElementById('time-display');
const dateDisplay = document.getElementById('date-display');
const greetingDisplay = document.getElementById('greeting-display');
const userNameSpan = document.getElementById('user-name');
const editNameBtn = document.getElementById('edit-name-btn');

function updateClock() {
    const now = new Date();
    timeDisplay.textContent = now.toLocaleTimeString('en-US', { hour12: false });
    dateDisplay.textContent = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    const hour = now.getHours();
    let greeting = 'Good Evening';
    if (hour < 12) greeting = 'Good Morning';
    else if (hour < 18) greeting = 'Good Afternoon';
    
    // update greeting text node (first child) without removing the span
    greetingDisplay.childNodes[0].textContent = greeting + ", ";
}
setInterval(updateClock, 1000);
updateClock();

// Custom Name Logic
let userName = localStorage.getItem('username') || 'User';
userNameSpan.textContent = userName;

editNameBtn.addEventListener('click', () => {
    const newName = prompt('Enter your name:', userName);
    if (newName && newName.trim() !== '') {
        userName = newName.trim();
        localStorage.setItem('username', userName);
        userNameSpan.textContent = userName;
    }
});

// --- 3. Focus Timer ---
let timerInterval;
let timeLeft = 25 * 60; // 25 minutes in seconds
let isRunning = false;

const timerDisplay = document.getElementById('timer-display');
const startBtn = document.getElementById('start-timer');
const stopBtn = document.getElementById('stop-timer');
const resetBtn = document.getElementById('reset-timer');

function formatTime(seconds) {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

startBtn.addEventListener('click', () => {
    if (!isRunning) {
        isRunning = true;
        timerInterval = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                timerDisplay.textContent = formatTime(timeLeft);
            } else {
                clearInterval(timerInterval);
                alert("Focus session complete!");
                isRunning = false;
            }
        }, 1000);
    }
});

stopBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    isRunning = false;
});

resetBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    isRunning = false;
    timeLeft = 25 * 60;
    timerDisplay.textContent = formatTime(timeLeft);
});

// --- 4. To-Do List & CHALLENGE: Prevent Duplicate ---
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        if (task.done) li.classList.add('done');
        
        li.innerHTML = `
            <span>${task.text}</span>
            <div class="task-actions">
                <button onclick="toggleTask(${index})">✔️</button>
                <button onclick="editTask(${index})">✏️</button>
                <button class="danger-btn" onclick="deleteTask(${index})">❌</button>
            </div>
        `;
        taskList.appendChild(li);
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

addTaskBtn.addEventListener('click', () => {
    const text = taskInput.value.trim();
    if (text === '') return;

    // Challenge: Prevent Duplicate
    const isDuplicate = tasks.some(task => task.text.toLowerCase() === text.toLowerCase());
    if (isDuplicate) {
        alert("This task already exists!");
        return;
    }

    tasks.push({ text: text, done: false });
    taskInput.value = '';
    renderTasks();
});

window.toggleTask = (index) => {
    tasks[index].done = !tasks[index].done;
    renderTasks();
};

window.editTask = (index) => {
    const newText = prompt('Edit task:', tasks[index].text);
    if (newText && newText.trim() !== '') {
        // Check duplicate for edit as well
        const isDuplicate = tasks.some((task, i) => i !== index && task.text.toLowerCase() === newText.trim().toLowerCase());
        if (isDuplicate) {
            alert("This task already exists!");
            return;
        }
        tasks[index].text = newText.trim();
        renderTasks();
    }
};

window.deleteTask = (index) => {
    tasks.splice(index, 1);
    renderTasks();
};
renderTasks();

// --- 5. Quick Links ---
const linkNameInput = document.getElementById('link-name');
const linkUrlInput = document.getElementById('link-url');
const addLinkBtn = document.getElementById('add-link-btn');
const linksContainer = document.getElementById('links-container');

let links = JSON.parse(localStorage.getItem('links')) || [];

function renderLinks() {
    linksContainer.innerHTML = '';
    links.forEach((link, index) => {
        const div = document.createElement('div');
        div.className = 'link-item';
        div.innerHTML = `
            <a href="${link.url}" target="_blank">${link.name}</a>
            <button class="danger-btn" onclick="deleteLink(${index})">X</button>
        `;
        linksContainer.appendChild(div);
    });
    localStorage.setItem('links', JSON.stringify(links));
}

addLinkBtn.addEventListener('click', () => {
    const name = linkNameInput.value.trim();
    let url = linkUrlInput.value.trim();
    
    if (name === '' || url === '') {
        alert("Please enter both Name and URL");
        return;
    }

    // Auto add https:// if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
    }

    links.push({ name: name, url: url });
    linkNameInput.value = '';
    linkUrlInput.value = '';
    renderLinks();
});

window.deleteLink = (index) => {
    links.splice(index, 1);
    renderLinks();
};
renderLinks();