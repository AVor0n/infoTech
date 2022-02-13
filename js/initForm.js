import FormController from "./FormController.js";

const form = document.querySelector(".form");

const visibleFields = [];

const formData = {};

const formController = new FormController(form, visibleFields, formData);

export default formController;
