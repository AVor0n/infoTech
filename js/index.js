import users from "../data/users.json" assert { type: "json" };

const countRows = 10;
let currentPage = 1;
const countPages = Math.ceil(users.length / countRows);

init();
goToPage(currentPage);

function init() {
  const maxPagesIndicator = document.querySelector(".page-switcher__max-page-index");
  maxPagesIndicator.textContent = countPages;

  const nextPageBtn = document.querySelector(".page-switcher__next");
  const prevPageBtn = document.querySelector(".page-switcher__prev");
  const currentPageIndicator = document.querySelector(".page-switcher__current-page-index");

  nextPageBtn.addEventListener("click", () => {
    if (currentPage < countPages) {
      currentPage++;
      goToPage(currentPage);
      currentPageIndicator.value = currentPage;

      prevPageBtn.disabled = false;

      if (currentPage === countPages) {
        nextPageBtn.disabled = true;
      }
    }
  });
  prevPageBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      goToPage(currentPage);
      currentPageIndicator.value = currentPage;

      nextPageBtn.disabled = false;

      if (currentPage === 1) {
        prevPageBtn.disabled = true;
      }
    }
  });

  currentPageIndicator.addEventListener("change", (e) => {
    const incomeValue = e.target.value;

    prevPageBtn.disabled = false;
    nextPageBtn.disabled = false;
    currentPage = incomeValue;

    if (incomeValue <= 1) {
      currentPage = 1;
      prevPageBtn.disabled = true;
    }
    if (incomeValue >= countPages) {
      currentPage = countPages;
      nextPageBtn.disabled = true;
    }

    goToPage(currentPage);
    currentPageIndicator.value = currentPage;
  });
}

function addRow(number, rowData) {
  const table = document.querySelector(".table__body");
  const row = document.createElement("tr");

  row.append(createTableCell(number));
  row.append(createTableCell(rowData.name.firstName));
  row.append(createTableCell(rowData.name.lastName));
  row.append(createTableCell(rowData.about, "about-cell"));
  row.append(createTableCell(rowData.eyeColor));

  table.append(row);
}

function createTableCell(textContent, className) {
  const cell = document.createElement("td");
  const content = document.createElement("div"); // нужен для правильного отображения границ ячеек в таблице
  content.textContent = textContent;
  cell.append(content);

  if (className) {
    content.classList.add(className);
  }
  return cell;
}

function cleanTable() {
  const table = document.querySelector(".table__body");
  while (table.firstChild) {
    table.removeChild(table.firstChild);
  }
}

function goToPage(pageNumber) {
  cleanTable();

  const startIdx = (pageNumber - 1) * countRows;
  const endIdx = startIdx + countRows;

  for (let i = startIdx; i < endIdx; i++) {
    addRow(i + 1, users[i]);
  }
}
