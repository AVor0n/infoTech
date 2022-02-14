/**
 * Контроллер предназначен для управления видимостью полей формы,
 * содержимым полей и уведомлении об изменении данных.
 * @class
 */
export default class FormController {
  /**
   * Форма, к которой подключается контроллер
   * @type {HTMLFormElement}
   * @private
   */
  #form;
  /**
   * Объект формата {id поля: [Контейнер с полем, который будет скрываться, элемент отвечающий за ввод/вывод данных]}
   * @type {Map<string, [HTMLDivElement, HTMLInputElement|HTMLTextAreaElement]>}
   * @private
   */
  #fields;
  /**
   * Массив с id полей, которые будут видимыми
   * @type {Array<string>}
   * @private
   */
  #visibleFields;
  /**
   * @typedef {Object.<string, string|number|boolean>} FormData
   */
  /**
   * Данные формы для отображения. В формате {id поля: значение}
   * @type {FormData}
   * @private
   */
  #data;

  /**
   * Создает новый контроллер для имеющейся формы
   * @param {HTMLFormElement} form - форма, для контроля
   * @param {Array<string>} visibleFields - массив с id полей, которые будут видимыми
   * @param {FormData} data - объект с данными для отображения, формата {id: value}
   */
  constructor(form, visibleFields, data) {
    this.#form = form;
    this.#binding();

    this.visibleFields = visibleFields;
    this.data = data || {};
  }

  /**
   * Свойство доступа к массиву id полей, которые будут видимыми
   */
  get visibleFields() {
    return this.#visibleFields;
  }

  /**
   * Свойство доступа к массиву id полей, которые будут видимыми
   */
  set visibleFields(fieldIds) {
    this.#visibleFields = [];
    fieldIds.forEach((fieldId) => {
      if (this.#fields.has(fieldId)) {
        this.#visibleFields.push(fieldId);
      }
    });

    this.#updateForm();
  }

  /**
   * Свойство доступа к данным формы для отображения
   */
  get data() {
    return this.#data;
  }

  /**
   * Свойство доступа к данным формы для отображения
   */
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

  /**
   * Поиск в форме полей и элементов ввода, для сохранения ссылок на них
   * и возможности дальнейших манипуляций
   */
  #binding() {
    const fields = this.#form.querySelectorAll("[data-field-id]");
    this.#fields = new Map();

    fields.forEach((field) => {
      const fieldId = field.dataset.fieldId;
      const input = field.querySelector("input") || field.querySelector("textarea");

      this.#fields.set(fieldId, [field, input]);

      input.addEventListener("change", (e) => this.#fieldChangeHandler(e));
    });
  }

  /**
   * Обработчик, выполняемый при вводе нового значения в одно из полей ввода формы
   * @param {InputEvent} e
   */
  #fieldChangeHandler(e) {
    const formData = this.getDataFromForm();

    if (this.onChangeForm && typeof this.onChangeForm === "function") {
      this.onChangeForm(e, formData);
    }
  }

  /**
   * Функция, вызываемая при изменении данных формы, создана для переопределения.
   * @param {ChangeEvent} e
   * @param {object} formData - объект с данными формы
   */
  onChangeForm(e, formData) {}

  /**
   * Возвращает данные из видимых полей формы
   * @returns {FormData}
   */
  getDataFromForm() {
    const formData = {};

    this.#visibleFields.forEach((fieldId) => {
      const [_, input] = this.#fields.get(fieldId);

      formData[fieldId] = input.value;
    });

    return formData;
  }

  /**
   * Скрывает/отображает поля формы
   */
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
