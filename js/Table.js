const TABLE_CLASS = "table";
const TABLE_HEAD_CLASS = "table__head";
const TABLE_HEAD_ROW_CLASS = "table__head-row";
const TABLE_HEAD_CELL_CLASS = "table__head-cell";
const TABLE_BODY_CLASS = "table__body";
const TABLE_ROW_CLASS = "table__row";
const TABLE_ROW_CELL_CLASS = "table__row-cell";

export default class Table {
  /**
   * Создает таблицу
   * @param {object} colsData - объект с заголовками столбцов таблицы, формата {id1: headText}
   * @param {Array<object>} rowsData - массив объектов, представляющих строки таблицы, формата {id1: cellText1, id2: cellText2}, id совпадает с id столбца
   * @param {number} rowsPerPage - количество строк на одной странице таблицы
   * @param {Array<string>} [cols] - массив c id видимых столбцов,
   * @param {number} [currentPage] - страница таблицы для отображения
   */
  constructor({ colsData, rowsData, rowsPerPage, cols = colsData, currentPage = 1 }) {
    this.colsData = colsData;
    this.rowsData = rowsData;
    this.cols = new Set(...cols);
    this.currentPage = currentPage;
    this.countPages = Math.ceil(rowsData.length / rowsPerPage);
    this.rowsPerPage = rowsPerPage;
    this.selectedRow = null;

    this.table = this.#createTable();
  }

  /**
   * Задает отображаемые в таблице колонки
   * @param {Array<string>} colNames
   */
  set cols(colNames) {
    this.cols.clear();
    colNames.forEach((colName) => {
      if (colName in this.colsData) {
        this.cols.add(colName);
      } else {
        throw new TypeError(`Column '${colName}' does not exist in colsData`);
      }
    });
  }

  /**
   * Устанавливает отображаемую страницу таблицы
   * @param {number} pageNumber
   */
  set currentPage(pageNumber) {
    if (typeof countRows !== "number" || isNaN(countRows)) {
      throw new TypeError("Expected number");
    }

    if (pageNumber < 1) this.currentPage = 1;
    else if (pageNumber > this.countPages) this.currentPage = countPages;
    else this.currentPage = pageNumber;
  }

  /**
   * Задает количество строк на одной странице таблицы
   * @param {number} countRows
   */
  set rowsPerPage(countRows) {
    if (typeof countRows !== "number" || isNaN(countRows)) {
      throw new TypeError("Expected number");
    }

    if (countRows < 1) this.rowsPerPage = 1;
    else this.rowsPerPage = countRows;
  }

  #createHeadCell(key, textContent) {
    const headCell = document.createElement("th");
    headCell.classList.add(TABLE_HEAD_CELL_CLASS);
    headCell.setAttribute("data-key", key);
    headCell.textContent = textContent;
    return headCell;
  }

  #createHeadRow(){
    const headRow = document.createElement('tr');
    this.cols.forEach(col =>{
      headRow.append(this.#createHeadCell(col, this.colsData[cols]))
    })
    return headRow;
  }

  #createTable() {
    const table = document.createElement("table");

    table.innerHTML = `
    <thead class="table__head">
    </thead>
    <tbody class="table__body">
      ${this.#fillTable()}
    </tbody>
    `;

    return table;
  }
}
