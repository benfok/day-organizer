// Set date in header
let dayModifier = 0;
let shortDate = moment().add(dayModifier, 'days').format('MMDDYY');

// let currentHour = moment().hour();
let currentHour = 11;
let workDayStart = 8;
let workDayEnd = 16;

function setDate (){
    document.getElementById('today').textContent = moment().add(dayModifier, 'days').format('dddd, MMMM Do YYYY');
    setIds();
};

function clearEvents(){
    let $events = $('.event');
    $events.each(function(){
        this.textContent = '';
    })
};

function incDay (){
    dayModifier++;
    setDate(); 
    clearEvents();
    eventLoop();
    setBackground(currentHour);
};

function decDay (){
    dayModifier--;
    setDate();
    clearEvents(); 
    eventLoop();
    setBackground(currentHour);
};

document.getElementById('nextDay').addEventListener('click', function(event){
    event.preventDefault();
    incDay();
    console.log(dayModifier);
});

document.getElementById('prevDay').addEventListener('click', function(event){
    event.preventDefault();
    decDay();
    console.log(dayModifier);
});

function setIds() {
    let $dateIds = $('.event');
    $dateIds.each(function(){
        this.id= moment().add(dayModifier, 'days').format('MMDDYY') + this.parentNode.id;
    })
};


// get from localStorage
function getEvents(eventId) {
    if (localStorage.getItem(eventId)) {
        let eventText = localStorage.getItem(eventId);
        document.getElementById(eventId).textContent = eventText;
    };
};

function eventLoop() {
    for (i=0; i < 24; i++) {
        let eventId = moment().add(dayModifier, 'days').format('MMDDYY') + i; 
        getEvents(eventId);
    };
};

function setBackground(hour) {
    for (i = 5; i < 21; i++) {
        let tableRow = document.getElementById(i);
        if (dayModifier < 0) {
            if (tableRow.id < workDayStart || tableRow.id >= workDayEnd) {
                tableRow.children[1].className = 'event';
                } else {tableRow.children[1].className = 'event past'}
        };
        if (dayModifier === 0) {
            if (tableRow.id < workDayStart || tableRow.id >= workDayEnd) {
                tableRow.children[1].className = 'event';
                }
            if (tableRow.id < hour && tableRow.id >= workDayStart) {
                tableRow.children[1].className = 'event past';
                }
            if (tableRow.id == hour) {
                tableRow.children[1].className = 'event present';
                }
            if (tableRow.id > hour && tableRow.id < workDayEnd && tableRow.id >= workDayStart) {
                tableRow.children[1].className = 'event future';
                }
        };
        if (dayModifier > 0) {
            if (tableRow.id < workDayStart || tableRow.id >= workDayEnd) {
                tableRow.children[1].className = 'event';
                } else {tableRow.children[1].className = 'event future'}
        };
        };
    };
    


// setting save button as a jQuery variable
let $saveCell = $('.save');

$saveCell.on('click', function(event) {
    eventText = event.originalEvent.path[3].children[1].textContent;
    if (!eventText) {
        alert('There is nothing to save. Please enter an event into the planner');
        return;
    } 
    // save to local storage
    localStorage.setItem(event.originalEvent.path[3].children[1].id, event.originalEvent.path[3].children[1].textContent);
});

window.addEventListener('load', function(){
    setDate();
    setIds();
    eventLoop();
    setBackground(currentHour);
});


// function to change the work day start and end time
document.querySelector('.submit').addEventListener('click', function(event){
    event.preventDefault();
    let startTime = Number(document.querySelector('#startTime').value);
    let endTime = Number(document.querySelector('#endTime').value);
    let workDay = endTime - startTime;
        if (workDay >= 4) {
            workDayStart = startTime;
            workDayEnd = endTime;
            setBackground(currentHour);
            setIds();
        } else {
            alert('The work day must be at least 4 hours long');
        }
    });


document.querySelector('#clear-events').addEventListener('click', function(event){
    event.preventDefault();
    clearEvents();
    localStorage.clear();
    alert('All events have been removed from the calendar');
});
