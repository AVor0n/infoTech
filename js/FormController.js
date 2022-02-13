export default class Form {
  #form;
  #fields;
  #visibleFields;
  #data;

  constructor(form, visibleFields, data) {
    this.#form = form;
    this.#binding();

    this.visibleFields = visibleFields;
    this.data = data || {};
  }

  get visibleFields() {
    return this.#visibleFields;
  }

  set visibleFields(fieldIds) {
    this.#visibleFields = [];
    fieldIds.forEach((fieldId) => {
      if (this.#fields.has(fieldId)) {
        this.#visibleFields.push(fieldId);
      }
    });

    this.#updateForm();
  }

  get data() {
    return this.#data;
  }

  set data(data) {
    if (typeof data !== "object") {
      throw new TypeError(`Expected object`);
    }

    for (const [key, value] of Object.entries(data)) {
      if (this.#fields.has(key)) {
        const [_, input] = this.#fields.get(key);
        input.value = value;
      }
    }
  }

  #binding() {
    const fields = this.#form.querySelectorAll("[data-field-id]");
    this.#fields = new Map();

    fields.forEach((field) => {
      const fieldId = field.dataset.fieldId;
      const input = field.querySelector("input") || field.querySelector("textarea");

      input.addEventListener("change", (e) => this.#fieldChangeHandler(e));

      this.#fields.set(fieldId, [field, input]);
    });
  }

  #fieldChangeHandler(e) {
    const formData = this.getDataFromForm();

    if (this.onChangeForm && typeof this.onChangeForm === "function") {
      this.onChangeForm(e, formData);
    }
  }

  /**
   * Функция-обработчик, вызываемая при изменении данных формы
   * @param {ChangeEvent} e
   * @param {object} formData - объект с данными формы
   */
  onChangeForm(e,formData) {}

  getDataFromForm() {
    const formData = {};

    this.#visibleFields.forEach((fieldId) => {
      const [_, input] = this.#fields.get(fieldId);

      formData[fieldId] = input.value;
    });

    return formData;
  }

  #updateForm() {
    for (const [fieldId, [field, _]] of this.#fields.entries()) {
      if (this.visibleFields.includes(fieldId)) {
        field.style.display = "";
      } else {
        field.style.display = "none";
      }
    }
  }
}
