import table from './initTable.js';
import formController from './initForm.js';

const tableContainer = document.querySelector(".table__container");
tableContainer.prepend(table.table);

table.onRowClick = () => {
  formController.visibleFields = table.visibleColumns;
  formController.data = table.getDataFromRow(table.selectedRow)
}

formController.onChangeForm = (_, formData) => {
  const rowData = table.getDataFromRow(table.selectedRow);
  const newRowData = {...rowData, ...formData};
  table.changeRowData(newRowData)
}