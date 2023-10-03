'use strict';

//Traigo las elementos del HTML

const btnSearch = document.querySelector('.js-btnSearch');
const showList = document.querySelector('.js-list');
const inputSearch = document.querySelector('.js-search');
const favList = document.querySelector('.js-listFavorites');
const btnLog = document.querySelector('.js-btnLog');
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
        //  localStorage.setItem('show', JSON.stringify(showTv));
      }

      //funcion que pinta la lista de las series
      paintCard(showTv, showList);
    });
}

//Funcion al darle click al botón BUSCAR

function handleClickSearch(event) {
  event.preventDefault();
  showResults();
}
//2- para obtener las favoritas de la usuaria
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

//para pintar

function getShowHtml(show) {
  const name = show.name;
  const summary = show.summary;
  const status = show.status;
  const id = show.id;
  const image =
    show.image?.medium ||
    'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
  const genres = show.genres;

  //   let imageUrl = '';
  //   if (image) {
  //     imageUrl = image.medium;
  //   } else {
  //     imageUrl = 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
  //   }

  let liFavorites = 'card liItem';
  const favoriteShowFound = favoritesShow.findIndex((favorite) => {
    return favorite.id === id;
  });

  if (favoriteShowFound !== -1) {
    liFavorites += 'chosenCard';
  }
  let genre = '';
  for (let item of genres) {
    genre += item + ' ';
  }
  if (genre == '') genre = 'Sin clasificar';

  return `<div class="cardBox">
      <div class="tittleBox">${name}</div>
      <div class="bodyBox">
      <img id=${id} class ="card" src="${image}"alt="${name}">
      <p class="summary">${summary} ${status}</p>
      </div>
      <div class="footerBox">
      <h3>${genre}</h3>
    </div>
  </div>`;
}

//Evento para cada tarjeta que se dibuja en pantalla

function addHandlerList(showArray, showListHtml) {
  const allShowHtml = showListHtml.querySelectorAll('.card');
  for (let card of allShowHtml) {
    card.addEventListener('click', (event) => {
      console.log('card', allShowHtml);
      handleClickScreen(event, showArray);
    });
  }
}

//Funcion para cada uno de los objetos show

function handleClickScreen(ev, showArray) {
  const clickedLi = ev.currentTarget.id; // aisgna el valor del id a la variable
  const clickedId = parseInt(clickedLi);
  const clickedObject = showArray.find((show) => {
    return show.id === clickedId;
  });

  updateFavList(clickedObject);
  paintCard(favoritesShow, favList);
  paintCard(showTv, showList);

  localStorage.setItem('favoritesShow', JSON.stringify(favoritesShow));
}

function updateFavList(clickedObject) {
  const favoriteShowFound = favoritesShow.findIndex((favorite) => {
    return favorite.id === clickedObject.id;
  });
  if (favoriteShowFound === -1) {
    favoritesShow.push(clickedObject);
  } else {
    favoritesShow.splice(favoriteShowFound, 1);
  }
}

function handleClickDelete(ev, deleteListHtml) {
  const deleteShowHtml = deleteListHtml.querySelectorAll('.delete');
  for (let item of deleteShowHtml) {
    item.addEventListener('click', (event) => {
      deleteShow(event, deleteListHtml);
    });
  }
}

favoritesResults();

btnSearch.addEventListener('click', handleClickSearch);
btnLog.addEventListener('click', (event) => {
  event.preventDefault();
  for (let item of favoritesShow) {
    console.log(item.name);
  }
});
