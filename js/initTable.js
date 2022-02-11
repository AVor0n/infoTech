import usersData from "../data/users.json" assert {type: 'json'};
import Table from "./Table.js";

const colsData = {
  firstName: "Brooks",
  lastName: "Stone",
  phone: "+7 (843) 431-2190",
  about:
    "Qui aliquip esse occaecat voluptate cillum laborum do adipisicing ea. Lorem dolor pariatur exercitation et Lorem voluptate reprehenderit. Culpa nisi sunt laborum culpa eu et nulla aute aliqua commodo cupidatat culpa. Eu laboris dolor enim officia mollit labore proident proident tempor ex minim magna dolor. Ipsum cillum officia irure amet enim voluptate consequat deserunt laborum nulla excepteur pariatur voluptate incididunt. In excepteur adipisicing dolor ea occaecat elit. Irure dolor quis cillum minim voluptate.",
  eyeColor: "blue",
};

const rowsData = usersData.forEach((user) => ({
  firstName: user.name.firstName,
  lastName: user.name.lastName,
  phone: user.phone,
  about: user.about,
  eyeColor: user.eyeColor,
}));

const visibleCols = ["firstName", "lastName", "about", "eyeColor"];

const table = new Table(colsData, rowsData, 10, visibleCols);

const tableContainer = document.querySelector('.table__container');
tableContainer.prepend(table);


const BASE_URL = "https://kinopoiskapiunofficial.tech/api/v2.1/films/";

getData(id);

function getData(id) {
  const url = BASE_URL + id;
  fetch(url, {
    method: "GET",
    ...