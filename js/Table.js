const TABLE_CLASS = "table";
const TABLE_HEAD_CLASS = "table__head";
const TABLE_HEAD_ROW_CLASS = "table__head-row";
const TABLE_HEAD_CELL_CLASS = "table__head-cell";
const TABLE_BODY_CLASS = "table__body";
const TABLE_ROW_CLASS = "table__row";
const TABLE_ROW_SELECTED_CLASS = "table__row--selected";
const TABLE_CELL_CLASS = "table__cell";
const TABLE_CELL_CONTENT_CLASS = "table__cell-content";

export default class Table {
  /**
   * Создает таблицу
   * @param {object} colsData - объект с заголовками столбцов таблицы, формата {id1: headText}
   * @param {Array<object>} rowsData - массив объектов, представляющих строки таблицы, формата {id1: cellText1, id2: cellText2}, id совпадает с id столбца
   * @param {number} rowsPerPage - количество строк на одной странице таблицы
   * @param {Array<string>} [cols] - массив c id видимых столбцов,
   * @param {number} [currentPage] - страница таблицы для отображения
   */
  constructor(colsData, rowsData, rowsPerPage, cols, currentPage = 1) {
    this.colsData = colsData;
    this.rowsData = rowsData;
    this.cols = cols;
    this.currentPage = currentPage;
    this.countPages = Math.ceil(rowsData.length / rowsPerPage);
    this.rowsPerPage = rowsPerPage;
    this.selectedRow = null;
    this.onRowClick = null;
    [this.table, this.thead, this.tbody] = this.#createTable();
    this.goToPage(currentPage);
  }

  #createTable() {
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    table.classList.add(TABLE_CLASS);
    thead.classList.add(TABLE_HEAD_CLASS);
    tbody.classList.add(TABLE_BODY_CLASS);

    thead.append(this.#createHeadRow());

    table.append(thead);
    table.append(tbody);

    return [table, thead, tbody];
  }

  #createHeadRow() {
    const headRow = document.createElement("tr");

    headRow.classList.add(TABLE_HEAD_ROW_CLASS);

    this.cols.forEach((col) => {
      const textContent = this.colsData[col];
      const className = `table__head-cell-${col}`;

      const headCell = this.#createHeadCell(textContent, className);
      headRow.append(headCell);
    });

    return headRow;
  }

  #createHeadCell(textContent, className) {
    const headCell = document.createElement("th");

    headCell.classList.add(TABLE_HEAD_CELL_CLASS);
    headCell.classList.add(className);
    headCell.textContent = textContent;

    return headCell;
  }

  getDataFromRow(row){
    const rowData = {};
    const cells = row.querySelectorAll(`.${TABLE_CELL_CONTENT_CLASS}`);

    for(let i = 0; i < cells.length; i++){
      const key = this.cols[i];
      const value = cells[i].textContent;

      rowData[key] = value;
    }

    return rowData;
  }
  rowClickHandler(event, row, table) {
    const rows = table.tbody.children;

    for (const r of rows) {
      r.classList.remove(TABLE_ROW_SELECTED_CLASS);
    }

    row.classList.add(TABLE_ROW_SELECTED_CLASS);
    table.selectedRow = row;
    table.selectedRowData = this.getDataFromRow(row);

    if (this.onRowClick) this.onRowClick(event);
  }

  #createRow(rowData) {
    const row = document.createElement("tr");
    row.classList.add(TABLE_ROW_CLASS);

    row.addEventListener("click", (e) => this.rowClickHandler(e, row, this));

    this.cols.forEach((colName) => {
      const textContent = rowData[colName];
      const className = `table__cell-${colName}`;

      row.append(this.#createCell(textContent, className));
    });

    return row;
  }

  #createCell(textContent, className) {
    const cell = document.createElement("td");
    const cellContent = document.createElement("div");

    //обертка cellContent необходима для корректного отображения границ ячейки таблицы
    //без обертки при добавлении к cell стиля {display: box}, граница ячейки станет толще, чем у других ячеек
    cellContent.classList.add(TABLE_CELL_CONTENT_CLASS);
    cellContent.classList.add(className);
    cellContent.textContent = textContent;

    cell.classList.add(TABLE_CELL_CLASS);
    cell.append(cellContent);

    return cell;
  }

  goToPage(page) {
    const startIdx = this.rowsPerPage * (page - 1);
    const endIdx = startIdx + this.rowsPerPage;

    this.tbody.innerHTML = "";

    for (let i = startIdx; i < endIdx; i++) {
      const rowData = this.rowsData[i];
      this.tbody.append(this.#createRow(rowData));
    }
  }
}
