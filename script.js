// ==========================================
// SYSTEM CLOCK
// ==========================================
function updateTime() {
    document.getElementById('time').innerHTML = new Date().toLocaleString();
}
setInterval(updateTime, 1000);
updateTime();

// ==========================================
// WINDOW MANAGER INTERFACE
// ==========================================
let biggestIndex = 1;
const topbar = document.getElementById('topbar');

function openWindow(windowId) {
    const element = document.getElementById(windowId);
    if (!element) return;
    
    element.style.display = "block";
    biggestIndex++;
    element.style.zIndex = biggestIndex;
    topbar.style.zIndex = biggestIndex + 1;
}

function closeWindow(windowId) {
    const element = document.getElementById(windowId);
    if (element) {
        element.style.display = "none";
    }
}

function bringToFront(element) {
    biggestIndex++;
    element.style.zIndex = biggestIndex;
    topbar.style.zIndex = biggestIndex + 1;
}

document.getElementById('welcomeOpen').addEventListener("click", () => openWindow('welcome'));

// ==========================================
// DESKTOP INTERFACE
// ==========================================
let selectedIcon = null;

function handleIconTap(element, targetWindowId) {
    if (element.classList.contains("selected")) {
        element.classList.remove("selected");
        selectedIcon = null;
        openWindow(targetWindowId);
    } else {
        if (selectedIcon) selectedIcon.classList.remove("selected");
        element.classList.add("selected");
        selectedIcon = element;
    }
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.icon') && selectedIcon) {
        selectedIcon.classList.remove("selected");
        selectedIcon = null;
    }
});

// ==========================================
// PHYSICS DRAG ENGINE
// ==========================================
function initializeDraggable(windowId) {
    const windowElement = document.getElementById(windowId);
    const headerElement = document.getElementById(windowId + "Header");
    if (!windowElement) return;

    windowElement.addEventListener("mousedown", () => bringToFront(windowElement));

    if (headerElement) {
        dragElement(windowElement, headerElement);
    }
}

function dragElement(windowElement, headerElement) {
    let initialX = 0, initialY = 0, currentX = 0, currentY = 0;

    headerElement.onmousedown = startDragging;

    function startDragging(e) {
        e.preventDefault();
        initialX = e.clientX;
        initialY = e.clientY;
        document.onmouseup = stopDragging;
        document.onmousemove = dragAction;
    }

    function dragAction(e) {
        e.preventDefault();
        currentX = initialX - e.clientX;
        currentY = initialY - e.clientY;
        initialX = e.clientX;
        initialY = e.clientY;
        
        windowElement.style.top = (windowElement.offsetTop - currentY) + "px";
        windowElement.style.left = (windowElement.offsetLeft - currentX) + "px";
    }

    function stopDragging() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

initializeDraggable("welcome");
initializeDraggable("note");
initializeDraggable("paint");

// ==========================================
// NOTES APPLICATION LOGIC
// ==========================================
let notesData = [
    {
        title: "Welcome Note",
        date: new Date().toLocaleDateString(),
        content: "Welcome to NeuOS Notes.\nType directly in this window to edit.\nChanges are automatically synchronized to memory."
    }
];
let activeNoteIndex = 0;

function renderSidebar() {
    const sidebar = document.getElementById("sidebar");
    sidebar.innerHTML = '';
    
    notesData.forEach((note, index) => {
        const noteDiv = document.createElement("div");
        noteDiv.className = `sidebar-note-item ${index === activeNoteIndex ? 'active-note' : ''}`;
        
        noteDiv.innerHTML = `
            <p class="note-title">${note.title}</p>
            <p class="note-date">${note.date}</p>
        `;
        
        noteDiv.addEventListener("click", () => loadNote(index));
        sidebar.appendChild(noteDiv);
    });
}

function loadNote(index) {
    activeNoteIndex = index;
    const contentArea = document.getElementById("notesContent");
    contentArea.innerText = notesData[index].content;
    renderSidebar();
}

function saveCurrentNote() {
    if (notesData.length === 0) return;
    const contentArea = document.getElementById("notesContent");
    notesData[activeNoteIndex].content = contentArea.innerText;
    
    // Dynamically update title based on first line of content
    const firstLine = contentArea.innerText.split('\n')[0].trim();
    notesData[activeNoteIndex].title = firstLine ? firstLine.substring(0, 20) : "New Note";
    
    renderSidebar();
}

function createNewNote() {
    notesData.push({
        title: "New Note",
        date: new Date().toLocaleDateString(),
        content: ""
    });
    loadNote(notesData.length - 1);
}

// Initialize Notes App
renderSidebar();
loadNote(0);

// ==========================================
// PAINT APPLICATION LOGIC
// ==========================================
const canvas = document.getElementById('paintCanvas');
const ctx = canvas.getContext('2d');
let isPainting = false;

// Solidify background for clean neumorphic look
ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--base-color').trim();
ctx.fillRect(0, 0, canvas.width, canvas.height);

function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

function startPosition(e) {
    isPainting = true;
    draw(e);
}

function endPosition() {
    isPainting = false;
    ctx.beginPath();
}

function draw(e) {
    if (!isPainting) return;
    
    const pos = getMousePos(e);
    ctx.lineWidth = document.getElementById('brushSize').value;
    ctx.lineCap = 'round';
    ctx.strokeStyle = document.getElementById('colorPicker').value;
    
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

function clearCanvas() {
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--base-color').trim();
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

canvas.addEventListener('mousedown', startPosition);
canvas.addEventListener('mouseup', endPosition);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseout', endPosition);