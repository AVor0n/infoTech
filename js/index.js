/**
 * @file Связывание таблицы и формы, подключение постраничной навигации
 */

import { getNearbyColor, colorName2hex } from "./utils/colors.js";
import formController from "./initFormController.js";
import table from "./initTable.js";
import "./initPaginator.js";

// адаптеры для передачи данных из таблицы в форму и обратно
// необходимы, т.к. в таблице eyeColor - строка с названием цвета,
// а в форме eyeColor - это hex-значение цвета
function tableRow2Form(tableRowData) {
  const formData = { ...tableRowData };
  formData.eyeColor = colorName2hex(tableRowData.eyeColor);
  return formData;
}

function form2TableRow(formData) {
  const tableRowData = { ...formData };
  tableRowData.eyeColor = getNearbyColor(formData.eyeColor);
  return tableRowData;
}

//При выборе новой строки в таблице, отобразить данные в форме редактирования
table.onChangeSelectedRow = (selectedRow) => {
  formController.visibleFields = table.visibleColumns;
  const tableRowData = table.getDataFromRow(selectedRow);
  formController.data = tableRow2Form(tableRowData);
};

//При изменении данных в форме, изменить данные в таблице
formController.onChangeForm = (_event, formData) => {
  const tableRowData = table.getDataFromRow(table.selectedRow);
  const newTableRowData = { ...tableRowData, ...form2TableRow(formData) };
  table.changeRowData(newTableRowData);
};
