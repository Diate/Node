/* eslint-disable */
import '@babel/polyfill';
import { loginfuc, logout } from './login';

const loginform = document.querySelector('.form');
const loginbtn = document.querySelector('.nav__el--logout');

if (loginform) {
  loginform.addEventListener('submit', (e) => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    e.preventDefault();
    loginfuc(email, password);
  });
}

if (loginbtn) loginbtn.addEventListener('click', logout);
