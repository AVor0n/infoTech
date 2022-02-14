/**
 * @file Связывание таблицы и формы, подключение постраничной навигации
 */

import formController from './initFormController.js';
import table from './initTable.js';
import './initPaginator.js';

//При выборе новой строки в таблице, отобразить данные в форме редактирования
table.onChangeSelectedRow = () => {
  formController.visibleFields = table.visibleColumns;
  formController.data = table.getDataFromRow(table.selectedRow);
};

//При изменении данных в форме, изменить данные в таблице
formController.onChangeForm = (_event, formData) => {
  const rowData = table.getDataFromRow(table.selectedRow);
  const newRowData = {...rowData, ...formData};
  table.changeRowData(newRowData)
}