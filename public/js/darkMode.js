const head = document.head || document.getElementsByTagName('head');
const btn = document.querySelector('.dark-mode-btn');
const style = document.createElement('style');
style.setAttribute('id', 'dark-mode-style');
style.innerHTML = `
  :root {
  --MainText: #fff;
  --DMBBackground: #1f1f1f;
  --Shadow1: #0c0c0c;
  --Shadow2: #323232;
  --Background: #1f1f1f;
}

.dmb-light {
  display: none !important;
}

.dmb-dark {
  display: block !important;
  box-shadow: 4px 4px 10px var(--Shadow1),
    -2px 0 10px var(--Shadow2) !important;
}

input[type="date"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
  background-color: #fff;
  border-radius: .2em;
}

.home-link {
  background-image: url(../img/logoBranca.png);
}

.del-mod-display {
  border: 3px solid var(--MainText);
}
  `;

btn.addEventListener('click', e => {
  let el = e.target;
  if (el.classList.contains('dmb-cover')) toggleDarkMode();
});

const toggleDarkMode = () => {
  if (localStorage.getItem('isDarkMode') === 'true') {
    head.removeChild(document.getElementById('dark-mode-style'));
    localStorage.setItem('isDarkMode', 'false');
  } else {
    head.appendChild(style);
    localStorage.setItem('isDarkMode', 'true');
  }
};

const darkMode = () => {
  if (localStorage.getItem('isDarkMode') === 'true')
    head.appendChild(style);;
};
darkMode();
