import users from "../data/users.json" assert { type: "json" };

const countRows = 10;
let currentPage = 1;
const countPages = Math.ceil(users.length / countRows);
let selectedEntry;

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
    if (incomeValue === currentPage) return;

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

  const firstName = document.getElementById("first-name");
  const lastName = document.getElementById("last-name");
  const about = document.getElementById("about");
  const eyeColor = document.getElementById("eye-color");

  [firstName, lastName, about, eyeColor].forEach((input) =>
    input.addEventListener("change", updateField)
  );
}

function addRow(number, rowData) {
  const table = document.querySelector(".table__body");
  const row = document.createElement("tr");
  row.classList.add("table__row");

  row.append(createTableCell(number));
  row.append(createTableCell(rowData.name.firstName));
  row.append(createTableCell(rowData.name.lastName));
  row.append(createTableCell(rowData.about, "about-cell"));
  row.append(createTableCell(rowData.eyeColor));

  row.addEventListener("click", () => {
    selectedEntry = number - 1;
    showEditor(selectedEntry);

    for (const r of table.children) {
      r.classList.remove("active");
    }
    row.classList.add("active");
  });

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

  hideEditor();
}

function hideEditor() {
  const form = document.querySelector(".form");
  form.hidden = true;
}

function showEditor(entryIdx) {
  const form = document.querySelector('.form')
  form.hidden = false;

  const user = users[entryIdx];

  const firstName = document.getElementById("first-name");
  const lastName = document.getElementById("last-name");
  const about = document.getElementById("about");
  const eyeColor = document.getElementById("eye-color");

  firstName.value = user.name.firstName;
  lastName.value = user.name.lastName;
  about.value = user.about;
  eyeColor.value = user.eyeColor;
}

function updateField(event) {
  const input = event.target;

  switch (input.id) {
    case "first-name":
      users[selectedEntry].name.firstName = input.value;
      break;
    case "last-name":
      users[selectedEntry].name.lastName = input.value;
      break;
    case "about":
      users[selectedEntry].about = input.value;
      break;
    case "eye-color":
      users[selectedEntry].eyeColor = input.value;
      break;
  }
  goToPage(currentPage);
}
