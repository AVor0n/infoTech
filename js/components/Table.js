//CSS-классы для создаваемых HTML-элементов
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

/**
 * @class Таблица, с возможностью сортировки столбцов и постраничной навигацией
 */
export default class Table {
  /**
   * Номер отображаемой страницы таблицы
   * @type {number}
   */
  #currentPage = 1;

  /**
   * Общее количество страниц у таблицы
   * @type {number}
   */
  #countPages;

  /**
   * Количество строк на одной странице таблицы
   * @type {number}
   */
  #rowsPerPage;

  /**
   * Объект с данными заголовков таблицы.  Формат {id столбца 1: заголовок 1, id столбца 2: заголовок 2}
   * @type {Object.<string, string>}
   */
  #colsData;

  /**
   * Массив с данными строк формата {id столбца 1: текст ячейки 1, id столбца 2: текст ячейки 2}
   * @type {Array<Object.<string, string>>}
   */
  #rowsData;

  /**
   * Массив с id видимых столбцов
   * @type {string[]}
   */
  #visibleColumns;

  /**
   * выделенная строка
   * @type {HTMLRowElement}
   */
  #selectedRow;

  /**
   * таблица
   * @type {HTMLTableElement}
   */
  table;

  /**
   * Создает таблицу
   * @param {Object.<string, string>} colsData объект с заголовками столбцов таблицы, формата {id столбца: заголовок столбца}
   * @param {Array<Object.<string, string>>} rowsData массив объектов, представляющих строки таблицы,
   * формата {id столбца 1: значение ячейки 1, id столбца 2: значение ячейки 2}
   * @param {number} rowsPerPage - количество строк на одной странице таблицы
   * @param {Array<string>} cols - массив c id видимых столбцов,
   */
  constructor(colsData, rowsData, rowsPerPage, cols) {
    this.#colsData = colsData;
    this.#rowsData = rowsData;
    this.#visibleColumns = cols;
    this.#countPages = Math.ceil(rowsData.length / rowsPerPage);
    this.#rowsPerPage = rowsPerPage;
    this.sort = {};

    this.table = this.#createTable();
    this.#updatePage();
  }

  /**
   * Свойство доступа к выделенной строке
   * @readonly
   */
  get selectedRow() {
    return this.#selectedRow;
  }

  /**
   * Свойство доступа к данным заголовков столбцов
   * @readonly
   */
  get colsData() {
    return this.#colsData;
  }

  /**
   * Свойство доступа к данным строк
   * @readonly
   */
  get rowsData() {
    return this.#rowsData;
  }

  /**
   * Свойство доступа к массиву id видимых столбцов
   */
  get visibleColumns() {
    return this.#visibleColumns;
  }

  /**
   * Свойство доступа к массиву id видимых столбцов
   * При смене данного свойства происходит перестроение таблицы
   */
  set visibleColumns(colNames) {
    this.#visibleColumns = [];
    colNames.forEach((colName) => {
      if (colName in this.colsData) {
        this.#visibleColumns.push(colName);
      } else {
        throw new TypeError(`Column ${colName} don't exist in table`);
      }
    });

    this.#rebuildTable();
  }

  /**
   * Свойство доступа к количеству строк отображаемых на одной странице таблицы
   */
  get rowsPerPage() {
    return this.#rowsPerPage;
  }

  /**
   * Свойство доступа к количеству строк отображаемых на одной странице таблицы
   * При смене данного свойства происходит перестроение страницы
   */
  set rowsPerPage(countRows) {
    if (countRows < 1) {
      this.#rowsPerPage = 1;
    } else if (countRows > this.rowsData.length) {
      this.#rowsPerPage = this.rowsData.length;
    } else {
      this.#rowsPerPage = countRows;
    }

    this.#updatePage();
  }

  /**
   * Свойство доступа к количеству страниц у таблицы
   * @readonly
   */
  get countPages() {
    return this.#countPages;
  }

  /**
   * Свойство доступа к номеру текущей страницы.
   */
  get currentPage() {
    return this.#currentPage;
  }

  /**
   * Свойство доступа к номеру текущей страницы.
   * При смене данного свойства происходит переход на другую страницу
   */
  set currentPage(pageNumber) {
    if (pageNumber < 1) {
      this.#currentPage = 1;
    } else if (pageNumber > this.countPages) {
      this.#currentPage = this.countPages;
    } else {
      this.#currentPage = pageNumber;
    }

    this.#goToPage(this.#currentPage);
  }

  /**
   * Создаёт таблицу
   * @return {HTMLTableElement} table
   */
  #createTable() {
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");

    table.classList.add(TABLE_CLASS);
    thead.classList.add(TABLE_HEAD_CLASS);
    tbody.classList.add(TABLE_BODY_CLASS);

    this.thead = thead;
    this.tbody = tbody;
    this.menu = this.#createMenu();

    thead.append(this.#createHeadRow());
    table.append(thead);
    table.append(tbody);

    //меню позиционируется абсолютно, поэтому добавляется в document
    document.body.append(this.menu);

    return table;
  }

  /**
   * Создает строку с заголовками столбцов
   * @return {HTMLTableRowElement}
   */
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

  /**
   * Создаёт ячейку в заголовке столбца
   * @param {string} textContent - текст ячейки
   * @param {string} className - css класс основанный на id для стилизации отдельных столбцов
   * @param {string} columnId - id столбца
   * @returns {HTMLTableCellElement}
   */
  #createHeadCell(textContent, className, columnId) {
    const headCell = document.createElement("th");

    headCell.classList.add(TABLE_HEAD_CELL_CLASS);
    headCell.classList.add(className);
    headCell.textContent = textContent;

    const sortBtn = this.#createSortBtn(columnId);
    const menuBtn = this.#createMenuBtn();
    headCell.prepend(sortBtn);
    headCell.append(menuBtn);

    return headCell;
  }

  /**
   * Создает кнопку, которая будет запускать сортировку
   * @param {String} orderBy - id столбца, по которому будет происходить сортировка
   */
  #createSortBtn(orderBy) {
    const sortBtn = document.createElement("button");

    sortBtn.classList.add(HEAD_CELL_SORT_BTN_CLASS);

    sortBtn.addEventListener("click", () => {
      let order = "asc"; //направление сортировки по-умолчанию

      //если к данному столбцу уже применена сортировка, то меняем направление
      if (this.sort.orderBy === orderBy) {
        order = this.sort.order === "asc" ? "desc" : "asc";
      }

      this.sort.order = order;
      this.sort.orderBy = orderBy;

      this.#sortBtnToggleClasses(sortBtn);
      this.#tableSort(order, orderBy);
      this.#updatePage();
    });

    return sortBtn;
  }

  /**
   * Сортирует данные таблицы в указанном порядке и по указанному столбцу
   * @param {'desc'|'asc'} order - порядок сортировки
   * @param {string} orderBy - id столбца, по которому происходит сортировка
   */
  #tableSort(order, orderBy) {
    const collator = new Intl.Collator("en");
    const comparator =
      order === "asc"
        ? (a, b) => collator.compare(a[orderBy], b[orderBy])
        : (a, b) => -collator.compare(a[orderBy], b[orderBy]);

    this.rowsData.sort(comparator);
  }

  /**
   * Меняет классы у кнопок сортировки, чтобы активный класс был только у одной кнопки
   */
  #sortBtnToggleClasses(sortBtn) {
    const sortBtns = this.table.querySelectorAll(`.${HEAD_CELL_SORT_BTN_CLASS}`);

    sortBtns.forEach((btn) => {
      btn.classList.remove(HEAD_CELL_SORT_DESC_BTN_CLASS);
      btn.classList.remove(HEAD_CELL_SORT_ASC_BTN_CLASS);
    });

    if (this.sort.order === "desc") {
      sortBtn.classList.add(HEAD_CELL_SORT_DESC_BTN_CLASS);
    } else {
      sortBtn.classList.add(HEAD_CELL_SORT_ASC_BTN_CLASS);
    }
  }

  /**
   * Создает кнопку, которая будет вызывать меню для добавления/удаления столбцов
   * @returns {HTMLButtonElement} menuBtn
   */
  #createMenuBtn() {
    const menuBtn = document.createElement("button");

    menuBtn.classList.add(HEAD_CELL_MENU_BTN_CLASS);
    menuBtn.addEventListener("click", (e) => {
      this.#showMenu(e);
    });

    return menuBtn;
  }

  /**
   * Создает меню для добавления/удаления столбцов
   * @returns {HTMLDivElement} menu
   */
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

  /**
   * Создает строчку в меню добавления/удаления столбцов.
   * Каждая строчка содержит checkbox и название столбца
   * @param {string} columnId - id столбца, для получения данных о его текущем состоянии
   * @return {HTMLDivElement} - контейнер со строчкой меню
   */
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

  /**
   * Обработчик checkbox по добавлению/удалению столбцов
   * @param {InputEvent} event - событие изменения значения checkbox
   */
  #menuCheckboxHandler(event) {
    const checkBoxes = [...this.menu.querySelectorAll(`.${TABLE_MENU_CHECKBOX_CLASS}`)];
    const checkedCheckBoxes = checkBoxes.filter((checkBox) => checkBox.checked);
    const visibleColumns = checkedCheckBoxes.map((checkBox) => checkBox.dataset.columnId);

    //Если удалить все столбцы, не получится вернуть их обратно,
    //т.к. исчезнут кнопки по их добавлению, которые находятся в заголовках столбцов.
    if (visibleColumns.length === 0) {
      alert("Нельзя оставлять таблицу пустой");
      event.target.checked = true;
      return;
    }

    this.visibleColumns = visibleColumns;
  }

  /**
   * Обработчик клика по кнопке меню.
   * Отображает меню для добавлению/удалению столбцов таблицы
   * @param {MouseEvent} clickEvent - событие клика
   */
  #showMenu(clickEvent) {
    const { pageX, pageY } = clickEvent;

    //смещение в 5px сделано, чтобы menu оказалось в состоянии mouseover,
    //так его исчезновение привязано к mouseleave
    this.menu.style.left = pageX - 5 + "px";
    this.menu.style.top = pageY - 5 + "px";

    this.menu.hidden = false;
  }

  /**
   * Формирует объект с данными строки. Данные собираются только из видимых столбцов + id столбца.
   * @param {HTMLTableRowElement} row - строка таблицы для получения данных
   * @returns {Object.<string, string>} rowData - Данные строки формата {id столбца 1: текст ячейки 1, ...}
   */
  getDataFromRow(row) {
    const rowData = {};
    const cells = row.querySelectorAll(`.${TABLE_CELL_CONTENT_CLASS}`);

    for (let i = 0; i < cells.length; i++) {
      const key = this.visibleColumns[i];
      const value = cells[i].textContent;

      rowData[key] = value;
    }

    rowData.id = row.dataset.id;

    return rowData;
  }

  /**
   * Обработчик, вызываемый при клике по строке таблицы
   * @param {MouseEvent} _event - событие клика. Target указывает на ячейку таблицы
   * @param {HTMLTableRowElement} row - строка, по которой осуществился клик
   */
  #rowClickHandler(_event, row) {
    const rows = this.tbody.children;

    for (const r of rows) {
      r.classList.remove(TABLE_ROW_SELECTED_CLASS);
    }

    this.#setSelectedRow(row);
  }

  /**
   * Функция-обработчик, вызываемая при клике по строке таблицы
   * @param {HTMLTableRowElement} _selectedRow - выделенная строка
   */
  onChangeSelectedRow(_selectedRow) {}

  /**
   * Сохраняет ссылку на выделенную строку
   * @param {HTMLTableRowElement} row - выделенная строка
   */
  #setSelectedRow(row) {
    this.#selectedRow = row;
    row.classList.add(TABLE_ROW_SELECTED_CLASS);

    if (this.onChangeSelectedRow && typeof this.onChangeSelectedRow === "function") {
      this.onChangeSelectedRow(this.#selectedRow);
    }
  }

  /**
   * Создает строку для тела таблицы
   * @param {Object.<string, string} rowData - данные строки формата {id столбца1: текст ячейки 1, id столбца2: текст ячейки 2}
   */
  #createRow(rowData) {
    const row = document.createElement("tr");
    row.dataset.id = rowData.id;
    row.classList.add(TABLE_ROW_CLASS);

    row.addEventListener("click", (e) => this.#rowClickHandler(e, row));

    //строка таблицы содержит только видимые столбцы
    this.visibleColumns.forEach((colName) => {
      const textContent = rowData[colName];
      const className = `table__cell-${colName}`;

      row.append(this.#createCell(textContent, className));
    });

    //восстановление выделения строки, которое слетает в случае перестроения таблицы
    if (this.selectedRow && this.selectedRow.dataset.id === rowData.id) {
      this.#setSelectedRow(row);
    }

    return row;
  }

  /**
   * Создает ячейку таблицы
   * @param {string} textContent - текст для отображения внутри ячейки
   * @param {string} className - css-класс, соответствующий id столбца, для стилизации отдельных столбцов
   * @return {HTMLTableCellElement}
   */
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

  /**
   * Перестраивает тело таблицы для отображения данных с соответствующей страницы
   * @param {number} page - номер страницы для отображения
   */
  #goToPage(page) {
    const startIdx = this.rowsPerPage * (page - 1);
    const endIdx = startIdx + this.rowsPerPage;

    this.tbody.innerHTML = "";

    for (let i = startIdx; i < endIdx; i++) {
      const rowData = this.rowsData[i];
      this.tbody.append(this.#createRow(rowData));
    }

    if (this.onUpdate && typeof this.onUpdate === "function") {
      this.onUpdate();
    }
  }

  /**
   * Функция-обработчик, после обновления таблицы
   */
  onUpdate() {}

  /**
   * Перестраивает тело таблицы. выполняется при редактировании данных таблицы.
   */
  #updatePage() {
    this.#goToPage(this.currentPage);
  }

  /**
   * Перестраивает всю таблицу. Выполняется при добавлении/удалении столбцов
   */
  #rebuildTable() {
    const oldHeadRow = this.thead.querySelector(`.${TABLE_HEAD_ROW_CLASS}`);
    const newHeadRow = this.#createHeadRow();

    this.thead.replaceChild(newHeadRow, oldHeadRow);

    this.#updatePage();
  }

  /**
   * Заменяет строку в таблице новыми данными
   * @param {Object.<string, string>} newRowData - новые данные для строки
   * @param {string} newRowData.id - идентификатор строки
   */
  changeRowData(newRowData) {
    const id = newRowData.id;
    const index = this.rowsData.findIndex((row) => row.id === id);

    this.rowsData[index] = { ...this.rowsData[index], ...newRowData };

    this.#updatePage();
  }
}
