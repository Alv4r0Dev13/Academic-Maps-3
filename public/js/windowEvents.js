import Login from "./modules/Login.js";

const body = document.body;

const mapWindow = document.querySelector('.map-window');
const eventsButton = document.getElementById('events-button');
const searchBar = document.getElementById('search-bar');
const eventList = document.getElementsByClassName('event');
const delModal = document.querySelector('.del-mod-window');
const delEvtId = document.getElementById('del-evt-id');
const allEvtTab = document.getElementById('all-events');
const tabContent = [...document.getElementsByClassName('tab-content')];
const tabLinks = [...document.getElementsByClassName('tab-link')];
const allEvtContent = document.getElementById('all-evt-content');
const subEvtTab = document.getElementById('sub-events');
const subEvtContent = document.getElementById('sub-evt-content');
const recommended = document.getElementById('recommended');
const recContent = document.getElementById('rec-content');

let isExpanded = false;

if (eventsButton) eventsButton.addEventListener('click', () => {
  mapWindow.classList.toggle('shrunk');
});


// searchBar.addEventListener('keyup', e => {
//   const text = e.target.value.toLowerCase();
//   [...eventList].forEach(event =>
//     event.querySelector('.event-title').textContent.toLowerCase().startsWith(text)
//       ? event.classList.remove('hidden')
//       : event.classList.add('hidden')
//   );
// });

document.addEventListener('click', e => {
  const el = e.target;
  if (el.classList.contains('del-btn-cover')) {
    console.log(el.parentNode.childNodes[1].textContent);
    delEvtId.setAttribute('value', el.parentNode.childNodes[1].textContent);
    delModal.classList.remove('hidden');
  };
  if (el.classList.contains('cancel-btn')) {
    delModal.classList.add('hidden');
  }
  if (el === allEvtTab) {
    if (el.classList.contains('closed')) {
      tabLinks.forEach(elem => elem.classList.add('closed'));
      tabContent.forEach(elem => elem.classList.add('hidden'));
      el.classList.remove('closed');
      allEvtContent.classList.remove('hidden');
    }
  }
  if (el === subEvtTab) {
    if (el.classList.contains('closed')) {
      tabLinks.forEach(elem => elem.classList.add('closed'));
      tabContent.forEach(elem => elem.classList.add('hidden'));
      el.classList.remove('closed');
      subEvtContent.classList.remove('hidden');
    }
  }
  if (el === recommended) {
    if (el.classList.contains('closed')) {
      tabLinks.forEach(elem => elem.classList.add('closed'));
      tabContent.forEach(elem => elem.classList.add('hidden'));
      el.classList.remove('closed');
      recContent.classList.remove('hidden');
    }
  }
});

const login = new Login('.login-form');
const signin = new Login('.signin-form');
login.init();
signin.init();