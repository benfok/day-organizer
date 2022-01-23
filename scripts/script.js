// Set date in header
let dayModifier = 0;
let shortDate = moment().add(dayModifier, 'days').format('MMDDYY');

let currentHour = moment().hour();
// let currentHour = 11; used for testing functionality
let workDayStart = 8;
let workDayEnd = 16;

// functions to set the date (today by default) and then adjust the event cell <td> ids based on the date chosen. These ids ensure unique identifers per day for local storage of events. This allows the user to change the date but to retain date and time specific events
function setDate (){
    document.getElementById('today').textContent = moment().add(dayModifier, 'days').format('dddd, MMMM Do YYYY');
    setIds();
};

function setIds() {
    let $dateIds = $('.event');
    $dateIds.each(function(){
        this.id= moment().add(dayModifier, 'days').format('MMDDYY') + this.parentNode.id;
    })
};

// called when moving between dates; clearing the planner prior to event population by date
function clearEvents(){
    let $events = $('.event');
    $events.each(function(){
        this.textContent = '';
    })
};

// functions called and event listeners for incrementing or decrementing the date. Adjusts the dateModifier variable (0 = today) 
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
});

document.getElementById('prevDay').addEventListener('click', function(event){
    event.preventDefault();
    decDay();
});



// get events from localStorage and populate the planner. Runs on page load and when the date is changed
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

// function to set the event cell background color based on the date and time relation to the current time, and considering the user preference for work day hours
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
            if (tableRow.id < hour && tableRow.id >= workDayStart && tableRow.id < workDayEnd) {
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
    


// setting save button as a jQuery variable in order to run save function across all buttons. Alert prevents a blank cell from being saved.
let $saveCell = $('.save');

$saveCell.on('click', function(event) {
    eventId = event.currentTarget.parentElement.parentElement.children[1].id;
    eventText = event.currentTarget.parentElement.parentElement.children[1].textContent;
    // console.log (event);
    if (!eventText) {
        alert('There is nothing to save. Please enter an event into the planner');
        return;
    } 
    // save to local storage
    localStorage.setItem(eventId, eventText);
    });

// functions that run on window load to setup the planner
window.addEventListener('load', function(){
    setDate();
    setIds();
    eventLoop();
    setBackground(currentHour);
});


// function to change the work day start and end time. Work day must be at least 4 hours long. This ensures valid entries are selected and applied
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

// function to clear all events from the calendar by clearing local storage
document.querySelector('#clear-events').addEventListener('click', function(event){
    event.preventDefault();
    clearEvents();
    localStorage.clear();
    alert('All events have been removed from the calendar');
});
