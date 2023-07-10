import Login from "./modules/Login.js";

const body = document.body;

const mapWindow = document.querySelector('.map-window');
const eventsButton = document.getElementById('events-button');
const searchBar = document.getElementById('search-bar');
const eventList = document.getElementsByClassName('event');
const delModal = document.querySelector('.del-mod-window');
const delEvtId = document.getElementById('del-evt-id');
const allEvtTab = document.getElementById('all-events');
const allEvtContent = document.getElementById('all-evt-content');
const subEvtTab = document.getElementById('sub-events');
const subEvtContent = document.getElementById('sub-evt-content');

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
    if (allEvtContent.classList.contains('hidden')) {
      allEvtContent.classList.remove('hidden');
      subEvtContent.classList.add('hidden');
    }
  }
  if (el === subEvtTab) {
    if (subEvtContent.classList.contains('hidden')) {
      subEvtContent.classList.remove('hidden');
      allEvtContent.classList.add('hidden');
    }
  }
});

const login = new Login('.login-form');
const signin = new Login('.signin-form');
login.init();
signin.init();