'use strict';

//Traigo las constantes del HTML

const btnSearch = document.querySelector('.js-btnSearch');
const showList = document.querySelector('.js-list');
const inputSearch = document.querySelector('.js-search');
const favList = document.querySelector('.js-listFavorites');

//VARIABLES
//1.- Resultados de la búsqueda
let showTv = [];
//2.- Resultados favoritos
let favoritesShow = [];

//Promises

function showResults() {
  let userSearch = inputSearch.value;
  fetch(`//api.tvmaze.com/search/shows?q=${userSearch}`)
    .then((response) => response.json())
    .then((results) => {
      showTv = [];
      for (let items of results) {
        const show = items.show;
        showTv.push(show);
      }

      //funcion que pinta la lista de las series
      paintCard(showTv, showList);
    });
}

//Funcion al darle click al botón BUSCAR

function handleClick(event) {
  event.preventDefault();
  showResults();
}
//2- para guardar las favoritas de la usuaria
function favoritesResults() {
  const savedFavorites = localStorage.getItem('favoritesShow');
  if (savedFavorites) {
    favoritesShow = JSON.parse(savedFavorites);
    paintCard(favoritesShow, favList);
  }
}
//recorre el listado de series

function paintCard(showArray, showListHtml) {
  let html = '';
  for (let show of showArray) {
    html += getShowHtml(show);
  }
  showListHtml.innerHTML = html;
  addHandlerList(showArray, showListHtml);
}

//para pintar el html

function getShowHtml(show) {
  // console.log(show);

  const name = show.name;
  const image = show.image;
  const id = show.image;
  const genres = show.genres;

  let genre = '';
  for (let item of genres) {
    genre += item + ' ';
  }

  console.log(genres);

  let imageUrl = '';
  if (image) {
    imageUrl = image.medium;
  } else {
    imageUrl = 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
  }

  let liFavorites = 'card liItem';
  const favoriteShowFound = favoritesShow.findIndex((favorite) => {
    return favorite.id === id;
  });

  if (favoriteShowFound !== -1) {
    liFavorites += 'chosenCard';
  }
  return `<liFavorites="${liFavorites}"id="${id}">
  <h3 class >${name}</h3>
  <img src="${imageUrl}"></li>`;
}

//Evento para cada tarjeta que se dibuja en pantalla

function addHandlerList(showArray, showListHtml) {
  const allShowHtml = showListHtml.querySelectorAll('.card');
  for (let card of allShowHtml) {
    card.addEventListener('click', (event) => {
      handleClickScreen(event, showArray);
    });
  }
}

//Funcion para cada uno de los objetos show

function handleClickScreen(ev, showArray) {
  const clickedLi = ev.currentTarget.id; //escucha el evento
  const clickedId = parseInt(clickedLi.id);
  const clickedObject = showArray.find((show) => {
    return show.id === clickedId;
  });

  updateFavList(clickedShow);
  paintCard(favoritesShow, favList);
  paintCard(showTv, showList);

  localStorage.setItem('favoritesShow', JSON.stringify(favoritesShow));
}

function updateFavList(clickedShow) {
  const favoriteShowFound = favoritesShow.findIndex((favorite) => {
    return favorite.id === clickedShow.id;
  });
  if (favoriteShowFound === -1) {
    favoritesShow.push(clickedShow);
  } else {
    favoritesShow.splice(favoriteShowFound, 1);
  }
}
favoritesResults();

btnSearch.addEventListener('click', handleClick);
