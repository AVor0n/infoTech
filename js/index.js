import table from './initTable.js';

const tableContainer = document.querySelector(".table__container");
tableContainer.prepend(table.table);

table.onRowClick = function (e){
  const row = table.getDataFromRow(table.selectedRow)

  row.firstName = '123';
  table.changeRowData(row);
}

const nextBtn = document.querySelector(".page-switcher__next");
const prevBtn = document.querySelector(".page-switcher__prev");

nextBtn.addEventListener('click', () => {
  table.rowsPerPage += 1;
})

prevBtn.addEventListener("click", () => {
  table.rowsPerPage -= 1;
});