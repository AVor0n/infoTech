/**
 * Привязка к имеющейся форме контроллера, который управляет видимостью полей и их содержимым.
 */

import FormController from "./components/FormController.js";

const form = document.querySelector(".form");

//Изначально форма пустая
const visibleFields = [];
const formData = {};

const formController = new FormController(form, visibleFields, formData);

export default formController;
