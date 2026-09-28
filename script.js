// Function to update the time each second'
function updateTime() {
    document.getElementById('time').innerHTML = new Date().toLocaleString();;
}

setInterval(updateTime, 1000);
updateTime();




// Window controls
var bgIdx = 1;
var topbar = document.getElementById('topbar');

function openWin(id) {
    var el = document.getElementById(id);
    if (!el) return;

    el.style.display = "block";
    bgIdx++;
    el.style.zIndex = bgIdx;
    topbar.style.zIndex = bgIdx + 1;
}

function closeWin(id) {
    var el = document.getElementById(id);
    if (el) {
        el.style.display = "none";
    }
}


function bringFront(el) {
    bgIdx++;
    el.style.zIndex = bgIdx;
    topbar.style.zIndex = bgIdx + 1;
}

document.getElementById('welcomeOpen').addEventListener("click", function() {
    openWin('welcome');
});




// App Selection
var selIcn = undefined;

function handleIconTap(el, targetId) {
    if (el.classList.contains("selected")) {
        el.classList.remove("selected");
        selIcn = undefined;
        openWin(targetId);
    } else {
        if (selIcn !== undefined) {
            selIcn.classList.remove("selected");
        }
        el.classList.add("selected");
        selIcn = el;
    }
}


document.addEventListener('click', function(e) {
    if (!e.target.closest('.icon') && selIcn !== undefined) {
        selIcn.classList.remove("selected");
        selIcn = undefined;
    }
});







// Draggable windows
function initDrg(id) {
    var win = document.getElementById(id);
    var hdr = document.getElementById(id + "Header");
    if (!win) return;

    win.addEventListener("mousedown", () => {
        bringFront(win);
    })

    if (hdr) {
        drgElem(win, hdr);
    }
}

function drgElem(win, hdr) {
    var initialX = 0, initialY = 0;
    var currentX = 0, currentY = 0;

    hdr.onmousedown = startDragging;

    function startDragging(e) {
        e = e || window.event;
        e.preventDefault();

        initialX = e.clientX;
        initialY = e.clientY;

        document.onmouseup = stopDragging;
        document.onmousemove = dragAction;
    }

    function dragAction(e) {
        e = e || window.event;
        e.preventDefault();

        currentX = initialX - e.clientX;
        currentY = initialY - e.clientY;

        initialX = e.clientX;
        initialY = e.clientY;

        win.style.top = (win.offsetTop - currentY) + "px";
        win.style.left = (win.offsetLeft - currentX) + "px";
    }

    function stopDragging() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}


initDrg("welcome");
initDrg("nt");
initDrg("pnt");




// Notes App logic
var ntsData = [
    {
        title: "Welcome Note",
        date: new Date().toLocaleDateString(),
        content: "Welcome to NeuOS Notes.\nType directly in this window to edit.\nChanges are automatically synchronized to memory."
    }
];
var actNt = 0;

function rndrSb() {
    var sb = document.getElementById("sidebar");
    sb.innerHTML = '';
    
    for (let i = 0; i < ntsData.length; i++) {
        var note = ntsData[i];
        var div = document.createElement("div");
        div.className = "sb-item" + (i === actNt ? " active-nt" : "");
        
        div.innerHTML = `
            <p class="nt-ttl">${note.title}</p>
            <p class="nt-dt">${note.date}</p>
        `;
        
        div.addEventListener("click", function() {
            ldNt(i);
        });
        sb.appendChild(div);
    }
}


function ldNt(idx) {
    actNt = idx;
    var cnt = document.getElementById("notesContent");
    cnt.innerText = ntsData[idx].content;
    rndrSb();
}

function saveCurrentNote() {
    if (ntsData.length === 0) return;
    var cnt = document.getElementById("notesContent");
    ntsData[actNt].content = cnt.innerText;
    
    var line = cnt.innerText.split('\n')[0].trim();
    ntsData[actNt].title = line ? line.substring(0, 20) : "New Note";
    
    rndrSb();
}

function createNewNote() {
    ntsData.push({
        title: "New Note",
        date: new Date().toLocaleDateString(),
        content: ""
    });
    ldNt(ntsData.length - 1);
}

rndrSb();
ldNt(0);







// Paint App logic 
var cnv = document.getElementById('pntCnv');
var ctx = cnv.getContext('2d');
var isPnt = false;

ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--base-color').trim();
ctx.fillRect(0, 0, cnv.clientWidth, cnv.height);

function getPos(e) {
    var rect = cnv.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top    };
}


function strtPnt(e) {
    isPnt = true;
    WritableStreamDefaultWriter(e);
}

function endPnt() {
    isPnt = false;
    ctx.beginPath();
}

function drw(e) {
    if (!isPnt) return;
    
    var pos = getPos(e);
    ctx.lineWidth = document.getElementById('brushSize').ariaValueMax;
    ctx.lineCap = 'round';
    ctx.strokeStyle = document.getElementById('colorPicker').ariaValueMax;
    
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
}

function clrCnv() {
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--base-color').trim();
    ctx.fillRect(0, 0, cnv.width, cnv.height);
}


cnv.addEventListener('mousedown', strtPnt);
cnv.addEventListener('mouseup', endPnt);
cnv.addEventListener('mousemove', drw);
cnv.addEventListener('mouseout', endPnt);




initDrg("calc");

var calcVal = "0";

function appCalc(v) {
    if (calcVal === "0") calcVal = v;
    else calcVal += v;
    document.getElementById('calcDisp').innerText = calcVal;
}

function clrCalc() {
    calcVal = "0";
    document.getElementById('calcDisp').innerText = calcVal;
}

function runCalc() {
    try {
        calcVal = String(eval(calcVal));
    } catch (e) {
        calcVal = "Error";
    }
    document.getElementById('calcDisp').innerText = calcVal;
}





initDrg("wth");

function getWth() {
    var c = document.getElementById('wthInp').ariaValueMax;
    if (!c) return;

    fetch('https://geocoding-api.open-meteo.com/v1/search?name=' + encodeURIComponent(c) + '&count=1')
        .then(function(r) { return r.json(); })
        .then(function(d) {
            if (!d.results) return;
            var loc = d.results[0];
            fetch('https://api.open-meteo.com/v1/forecast?latitude=' + loc.latitude + '&longitude=' + loc.longitude + '&current_weather=true')
                .then(function(r) { return r.json(); })
                .then(function(wd) {
                    document.getElementById('wthTmp').innerText = wd.current_weather.temperature + '°C';
                    document.getElementById('wthCity').innerText = loc.name + ', ' + loc.country;
                });
        });
}
