const TABLE_CLASS = "table";

const TABLE_HEAD_CLASS = "table__head";
const TABLE_HEAD_ROW_CLASS = "table__head-row";
const TABLE_HEAD_CELL_CLASS = "table__head-cell";

const TABLE_MENU_CLASS = "table__menu";
const TABLE_MENU_ITEM_CLASS = "table__menu-item";
const TABLE_MENU_CHECKBOX_CLASS = "table__menu-checkbox";
const TABLE_MENU_LABEL_CLASS = "table__menu-label";

const HEAD_CELL_MENU_BTN_CLASS = "head-cell__menu-btn";
const HEAD_CELL_SORT_BTN_CLASS = "head-cell__sort-btn";
const HEAD_CELL_SORT_DESC_BTN_CLASS = "head-cell__sort-btn--desc";
const HEAD_CELL_SORT_ASC_BTN_CLASS = "head-cell__sort-btn--asc";

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
    this.visibleColumns = cols;
    this.currentPage = currentPage;
    this.countPages = Math.ceil(rowsData.length / rowsPerPage);
    this.rowsPerPage = rowsPerPage;
    this.sort = {};

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

    this.menu = this.#createMenu();
    document.body.append(this.menu);

    return [table, thead, tbody];
  }

  #createHeadRow() {
    const headRow = document.createElement("tr");

    headRow.classList.add(TABLE_HEAD_ROW_CLASS);

    this.visibleColumns.forEach((col) => {
      const textContent = this.colsData[col];
      const className = `table__head-cell-${col}`;

      const headCell = this.#createHeadCell(textContent, className, col);
      headRow.append(headCell);
    });

    return headRow;
  }

  #createHeadCell(textContent, className, col) {
    const headCell = document.createElement("th");

    headCell.classList.add(TABLE_HEAD_CELL_CLASS);
    headCell.classList.add(className);
    headCell.textContent = textContent;

    const sortBtn = this.#createSortBtn(col);
    const menuBtn = this.#createMenuBtn();
    headCell.prepend(sortBtn);
    headCell.append(menuBtn);

    return headCell;
  }

  #createSortBtn(orderBy) {
    const sortBtn = document.createElement("button");

    sortBtn.classList.add(HEAD_CELL_SORT_BTN_CLASS);

    sortBtn.addEventListener("click", (e) => {
      let order = "asc"; //направление сортировки по-умолчанию

      //если к данному столбцу уже применена сортировка, то меняем направление
      if (this.sort.orderBy === orderBy) {
        order = this.sort.order === "asc" ? "desc" : "asc";
      }

      this.sort.order = order;
      this.sort.orderBy = orderBy;

      this.#sortBtnToggleClasses(sortBtn, this);
      this.#tableSort(order, orderBy, this);
      this.#updatePage();
    });

    return sortBtn;
  }

  #tableSort(order, orderBy, table) {
    const collator = new Intl.Collator("en");
    const comparator =
      order === "asc"
        ? (a, b) => collator.compare(a[orderBy], b[orderBy])
        : (a, b) => -collator.compare(a[orderBy], b[orderBy]);

    table.rowsData.sort(comparator);
  }

  #sortBtnToggleClasses(sortBtn, table) {
    const sortBtns = table.table.querySelectorAll(`.${HEAD_CELL_SORT_BTN_CLASS}`);

    sortBtns.forEach((btn) => {
      btn.classList.remove(HEAD_CELL_SORT_DESC_BTN_CLASS);
      btn.classList.remove(HEAD_CELL_SORT_ASC_BTN_CLASS);
    });

    if (table.sort.order === "desc") {
      sortBtn.classList.add(HEAD_CELL_SORT_DESC_BTN_CLASS);
    } else {
      sortBtn.classList.add(HEAD_CELL_SORT_ASC_BTN_CLASS);
    }
  }

  #createMenuBtn() {
    const menuBtn = document.createElement("button");

    menuBtn.classList.add(HEAD_CELL_MENU_BTN_CLASS);
    menuBtn.addEventListener("click", (e) => {
      this.#showMenu(e);
    });

    return menuBtn;
  }

  #createMenu() {
    const menu = document.createElement("div");

    menu.classList.add(TABLE_MENU_CLASS);
    menu.style.position = "absolute";
    menu.hidden = true;

    menu.addEventListener("mouseleave", () => {
      menu.hidden = true;
    });

    const columnIds = Object.keys(this.colsData);
    for (const columnId of columnIds) {
      menu.append(this.#createMenuItem(columnId));
    }

    return menu;
  }

  #createMenuItem(columnId) {
    const menuItem = document.createElement("div");
    menuItem.classList.add(TABLE_MENU_ITEM_CLASS);

    const checkBox = document.createElement("input");
    checkBox.classList.add(TABLE_MENU_CHECKBOX_CLASS);
    checkBox.type = "checkbox";
    checkBox.dataset.columnId = columnId;
    checkBox.checked = this.visibleColumns.includes(columnId);
    checkBox.addEventListener("change", (e) => this.#menuCheckboxHandler(e));

    const label = document.createElement("label");
    label.classList.add(TABLE_MENU_LABEL_CLASS);
    label.textContent = this.colsData[columnId];

    label.prepend(checkBox);
    menuItem.append(label);

    return menuItem;
  }

  #menuCheckboxHandler(event) {
    const checkBoxes = this.menu.querySelectorAll(`.${TABLE_MENU_CHECKBOX_CLASS}`);
    const visibleColumns = [];

    checkBoxes.forEach((checkBox) => {
      if (checkBox.checked) {
        visibleColumns.push(checkBox.dataset.columnId);
      }
    });

    if(visibleColumns.length === 0) {
      alert('Нельзя оставлять таблицу пустой')
      event.target.checked = true;
      return;
    }

    this.visibleColumns = visibleColumns;
    this.#rebuildTable();
  }

  #showMenu(clickEvent) {
    const { pageX, pageY } = clickEvent;

    //смещение в 5px сделано, чтобы menu оказалось в состоянии mouseover,
    //так его исчезновение привязано к mouseleave
    this.menu.style.left = pageX - 5 + "px";
    this.menu.style.top = pageY - 5 + "px";

    this.menu.hidden = false;
  }

  getDataFromRow(row) {
    const rowData = {};
    const cells = row.querySelectorAll(`.${TABLE_CELL_CONTENT_CLASS}`);

    for (let i = 0; i < cells.length; i++) {
      const key = this.visibleColumns[i];
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

    this.visibleColumns.forEach((colName) => {
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

  #updatePage() {
    this.goToPage(this.currentPage);
  }

  #rebuildTable() {
    const oldHeadRow = this.thead.querySelector(`.${TABLE_HEAD_ROW_CLASS}`);
    const newHeadRow = this.#createHeadRow();

    this.thead.replaceChild(newHeadRow, oldHeadRow);

    this.#updatePage();
  }
}
