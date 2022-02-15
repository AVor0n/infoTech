/**
 * @file создание таблицы, привязка данных и настройки отображения
 */

import Table from "./components/Table.js";
// import usersData from "../data/users.json" assert {type: 'json'}; //не работает для FireFox
import usersData from "../data/users.js";
import { colorName2hex, getContrast } from "./utils/colors.js";

const visibleCols = ["firstName", "lastName", "about", "eyeColor"];

const rowsPerPage = 10;

const colsData = {
  firstName: "First name",
  lastName: "Last name",
  phone: "Phone",
  about: "About",
  eyeColor: "Eye color",
};

const rowsData = usersData.map((user) => ({
  id: user.id,
  firstName: user.name.firstName,
  lastName: user.name.lastName,
  phone: user.phone,
  about: user.about,
  eyeColor: user.eyeColor,
}));

const table = new Table(colsData, rowsData, rowsPerPage, visibleCols);

const tableContainer = document.querySelector(".table__container");
tableContainer.prepend(table.table);

//Добавление цветного фона для ячеек eyeColor при обновлении данных в таблице
colorizeEyeColorCells();
table.onUpdate = colorizeEyeColorCells;

function colorizeEyeColorCells() {
  const eyeColorCells = document.querySelectorAll(".table__cell-eyeColor");

  eyeColorCells.forEach((eyeColorCell) => {
    const color = eyeColorCell.textContent;
    eyeColorCell.style.background = color;
    eyeColorCell.style.color = getContrast(colorName2hex(color))
  });
}

export default table;
