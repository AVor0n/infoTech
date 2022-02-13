import table from "./initTable.js";

const currentPageInput = document.querySelector(".page-switcher__current-page");
const countPage = document.querySelector(".page-switcher__count-page");
const startBtn = document.querySelector(".page-switcher__start");
const prevBtn = document.querySelector(".page-switcher__prev");
const nextBtn = document.querySelector(".page-switcher__next");
const endBtn = document.querySelector(".page-switcher__end");

countPage.textContent = table.countPages;
currentPageInput.onchange = () => switchPage(currentPageInput.value);
prevBtn.onclick = () => switchPage(table.currentPage - 1);
nextBtn.onclick = () => (switchPage(table.currentPage + 1));
endBtn.onclick = () => (switchPage(table.countPages));
startBtn.onclick = () => switchPage(1);

function switchPage(pageNumber) {
  table.currentPage = pageNumber;
  currentPageInput.value = table.currentPage;
}
