/**
 * @file Подключение обработчиков к кнопкам постраничной навигации таблицы
 */

import table from "./initTable.js";

const currentPageInput = document.querySelector(".page-switcher__current-page");
const countPage = document.querySelector(".page-switcher__count-page");
const startBtn = document.querySelector(".page-switcher__start");
const prevBtn = document.querySelector(".page-switcher__prev");
const nextBtn = document.querySelector(".page-switcher__next");
const endBtn = document.querySelector(".page-switcher__end");

countPage.textContent = table.countPages;

currentPageInput.onchange = () => switchPage(currentPageInput.value);
startBtn.onclick = () => switchPage(1);
prevBtn.onclick = () => switchPage(table.currentPage - 1);
nextBtn.onclick = () => switchPage(table.currentPage + 1);
endBtn.onclick = () => switchPage(table.countPages);

function switchPage(pageNumber) {
  //обработчик допустимости значения не нужен, т.к. этим займется таблица.
  table.currentPage = pageNumber;
  //если в инпуте было некорректное некорректное значение, то исправить на допустимое.
  currentPageInput.value = table.currentPage;
}
