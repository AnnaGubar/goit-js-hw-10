import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import countryCardTpl from '../src/templates/country.hbs';
import countriesCardTpl from '../src/templates/countries.hbs';
import { inputRef, countryListRef, countryRef, DEBOUNCE_DELAY, BASE_URL } from './js/start-data.js';
import './css/styles.css';

inputRef.addEventListener('input', debounce(inputHandler, DEBOUNCE_DELAY));

function inputHandler(e) {
  e.preventDefault();

  const inputValue = e.target.value;
  console.log('~ inputValue:', ` ~ ${inputValue} ~ `);

  if (inputValue.length === 0) {
    Notify.info(`Enter something`);
    clearCountryListCard();
    clearCountryCard();
  }

  fetch(`${BASE_URL}${inputValue}`)
    .then(res => {
      if (!res.ok) {
        Notify.info(`Oops, there is no country with that name`);
        clearCountryListCard();

        // throw Error(`is not ok: ` + res.status);
        return res.json().then(error => Promise.reject(error));
      }
      return res.json();
    })
    .then(countries => renderRequest(countries))
    .catch(error => {
      clearCountryCard();
      console.log(error);
    });
}

function renderRequest(countries) {
  console.log(`FOUND ${countries.length} match(-es) ✔`);

  if (countries.length > 10) {
    Notify.info(`Too many matches found. Please enter a more specific name.`);

    clearCountryListCard();
    return;
  }

  if (countries.length > 1) {
    clearCountryCard();
    countryListRef.innerHTML = countriesCardTpl(countries);

    console.group('⬇ List of found countries');
    countries.map(country => console.log(country.name.official));
    console.groupEnd();
  }

  if (countries.length === 1) {
    clearCountryListCard();
    countryRef.innerHTML = countryCardTpl(countries[0]);

    console.log('👉🏻', countries[0].name.official);
  }
}

function clearCountryListCard() {
  countryListRef.innerHTML = '';
}

function clearCountryCard() {
  countryRef.innerHTML = '';
}

// варианты отрисовки

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
