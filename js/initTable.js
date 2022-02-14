/**
 * @file создание таблицы, привязка данных и настройки отображения
 */

import Table from "./components/Table.js";
// import usersData from "../data/users.json" assert {type: 'json'}; //не работает для FireFox
import usersData from "../data/users.js";

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

export default table;
