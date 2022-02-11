const TABLE_CLASS = "table";
const TABLE_HEAD_CLASS = "table__head";
const TABLE_HEAD_ROW_CLASS = "table__head-row";
const TABLE_HEAD_CELL_CLASS = "table__head-cell";
const TABLE_BODY_CLASS = "table__body";
const TABLE_ROW_CLASS = "table__row";
const TABLE_CELL_CLASS = "table__cell";

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

    [this.table, this.thead, this.tbody] = this.#createTable();
    this.#goToPage(currentPage);
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
      const headCell = this.#createHeadCell(col, this.colsData[col]);
      headRow.append(headCell);
    });

    return headRow;
  }

  #createHeadCell(key, textContent) {
    const headCell = document.createElement("th");

    headCell.classList.add(TABLE_HEAD_CELL_CLASS);
    headCell.setAttribute("data-key", key);
    headCell.textContent = textContent;

    return headCell;
  }

  #goToPage(page) {
    const startIdx = this.rowsPerPage * (page - 1);
    const endIdx = startIdx + this.rowsPerPage;

    this.tbody.innerHTML = "";

    for (let i = startIdx; i < endIdx; i++) {
      const rowData = this.rowsData[i];
      this.tbody.append(this.#createRow(rowData));
    }
  }

  #createRow(rowData) {
    const row = document.createElement("tr");

    row.classList.add(TABLE_ROW_CLASS);

    this.cols.forEach((colName) => {
      row.append(this.#createCell(rowData[colName]));
    });

    return row;
  }

  #createCell(textContent) {
    const cell = document.createElement("td");

    cell.classList.add(TABLE_CELL_CLASS);
    cell.textContent = textContent;

    return cell;
  }
}
