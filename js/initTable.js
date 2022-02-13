import usersData from "../data/users.json" assert {type: 'json'};
import Table from "./Table.js";

const colsData = {
  firstName: "First name",
  lastName: "Last name",
  phone: "Phone",
  about: 'About',
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

const visibleCols = ["firstName", "lastName", "about", "eyeColor"];

const rowsPerPage = 5;

const table = new Table(colsData, rowsData, rowsPerPage, visibleCols);

export default table;