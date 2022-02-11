import table from './initTable.js';

const tableContainer = document.querySelector(".table__container");
tableContainer.prepend(table.table);

table.onRowClick = function (e){
  console.log(table.selectedRowData)
}