// Function to update the time each second'
function updateTime() {
    document.getElementById('time').innerHTML = new Date().toLocaleString();;
}

setInterval(updateTime, 1000);

// Function to make windows draggable
dragElement(document.getElementById("welcome"));
dragElement(document.getElementById("pawNotes"));

function dragElement(element) {
    var initialX = 0, initialY = 0; 
    var currentX = 0, currentY = 0;

    if (document.getElementById(element.id + "Header")) {
        document.getElementById(element.id + "Header").onmousedown = startDragging;
    } else {
        element.onmousedown = startDragging;
    }

    function startDragging(e) {
        e = e || window.event;
        e.preventDefault();

        initialX = e.clientX;
        initialY = e.clientY;

        document.onmouseup = stopDragging;
        document.onmousemove = dragElement;
    }

    function dragElement(e) {
        e = e || window.event;
        e.preventDefault();

        currentX = initialX - e.clientX;
        currentY = initialY - e.clientY;

        initialX = e.clientX;
        initialY = e.clientY;

        element.style.top = (element.offsetTop - currentY) + "px";
        element.style.left = (element.offsetLeft - currentX) + "px";
    }

    function stopDragging() {
        document.onmouseup = null;
        document.onmousemove = null;
    }

}

// Controls for the window
var welcomeScreen = document.getElementById('welcome');

function closeWindow(element) {
    element.style.display = "none";
}

function openWindow(element) {
    element.style.display = "block";
}

var welcomeScreenClose = document.getElementById('welcomeClose');
var welcomeScreenOpen = document.getElementById('welcomeOpen');

welcomeScreenClose.addEventListener("click", function() {
    closeWindow(welcomeScreen);
});

welcomeScreenOpen.addEventListener("click", function() {
    openWindow(welcomeScreen);
})

// App Selection
var selectedIcon = undefined;

function selectIcon(element) {
    element.classList.add("selected");
    selectedIcon = element;
}

function deselectIcon(element) {
    element.classList.remove("selected");
    selectedIcon = undefined;
}

function handleIconTap(element) {
    if (element.classList.contains("selcted")) {
        deselectIcon(element);
        openWindow(window);
    } else {
        selectIcon(element);
    }

}
