export default class Login {
  constructor(formClass) {
    this.form = document.querySelector(formClass);
  }

  init() {
    this.events();
  }

  events() {
    if (!this.form) return;
    this.form.addEventListener('submit', e => {
      e.preventDefault();
      const passwordErr = document.querySelector('#password-err');
      const passwordRepErr = document.querySelector('#password-repeat-err');

      this.cleanErrMsg(passwordErr);

      this.validate(e, passwordErr, passwordRepErr);
    });
  }

  validate(e, ...errs) {
    const el = e.target;
    const password = el.querySelector('#password').value;
    const passwordRep = el.querySelector('#password-repeat').value;
    let error = false;

    if (password.length < 8 || password.length > 20) {
      this.setError(errs[0]);
      error = true;
    }

    if (this.form.classList.contains('.signin-form'))
      if (password !== passwordRep) {
        console.log(password, passwordRep);
        this.setError(errs[1]);
        error = true;
      }

    if (!error) el.submit();
  }

  setError(el) {
    el.classList.remove('hidden');
  }

  cleanErrMsg(el) {
    if (!el.classList.contains('hidden')) el.classList.add('hidden');
  }
}