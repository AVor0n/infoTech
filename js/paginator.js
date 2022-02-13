import table from "./initTable.js";

const prevBtn = document.querySelector(".page-switcher__prev");
const nextBtn = document.querySelector(".page-switcher__next");
const currentPageInput = document.querySelector(".page-switcher__current-page");
const countPage = document.querySelector(".page-switcher__count-page");

countPage.textContent = table.countPages;
updateView();

prevBtn.addEventListener("click", () => {
  table.currentPage -= 1;
  currentPageInput.value = table.currentPage;
  updateView();
});

nextBtn.addEventListener("click", () => {
  table.currentPage += 1;
  currentPageInput.value = table.currentPage;
  updateView();
});

currentPageInput.addEventListener("change", () => {
  table.currentPage = currentPageInput.value;
  currentPageInput.value = table.currentPage;
  updateView();
});

function updateView() {
  prevBtn.disabled = table.currentPage <= 1;
  nextBtn.disabled = table.currentPage >= table.countPages;
}
