import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import countryCardTpl from '../src/templates/country.hbs';
import countriesCardTpl from '../src/templates/countries.hbs';
import './css/styles.css';

// import * as k from './js/js.js';

const inputRef = document.querySelector('#search-box');
const countryListRef = document.querySelector('.country-list');
const countryRef = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;
const BASE_URL = 'https://restcountries.com/v3.1/name/';

inputRef.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));

function inputHandler(e) {
  e.preventDefault();

  const inputValue = e.target.value;
  console.log('~ inputValue:', ` ~ ${inputValue} ~ `);

  if (inputValue.length === 0) {
    Notify.info(`Enter something`);
    countryListRef.innerHTML = '';
  }

  if (inputValue.length >= 1) {
    fetch(`${BASE_URL}${inputValue}`)
      .then(res => {
        if (!res.ok) {
          Notify.info(`There is nothing like that`);
          countryListRef.innerHTML = '';
          return res.json().then(error => Promise.reject(error));
        }
        return res.json();
      })
      .then(countries => {
        console.log(`found ${countries.length} match(-es) ✔`);

        if (countries.length > 10) {
          Notify.info(`Too many matches found. Please enter a more specific name.`);
          countryListRef.innerHTML = '';
          return;
        }

        if (countries.length >= 2) {
          countryRef.innerHTML = '';

          console.group('⬇ List of found countries');
          countries.map(country => console.log(country.name.official));
          console.groupEnd();

          countryListRef.innerHTML = countriesCardTpl(countries);
        }

        if (countries.length === 1) {
          console.log('👉🏻', countries[0].name.official);
          countryListRef.innerHTML = '';
          countryRef.innerHTML = countryCardTpl(countries[0]);
        }
      })
      .catch(error => console.log(error));
  }
}

// function x([...countries]) {
//   countries.map(country => {
//     console.log(country.name.official);

//     let liEl = document.createElement('li');
//     liEl.textContent = country.name.official;
//     countryListRef.append(liEl);
//   });
// }

// console.log(
//   (countryListRef.innerHTML = countries
//     .map(({ name, flags }) => {
//       console.log(name.official);
//       // return country.name.official;
//       return `
//       <img src=${flags.svg} alt='flag' width='30' height='30'/>
//       <h2>${name.official}</h2>
//       `;
//     })
//     .join('')),
// );
