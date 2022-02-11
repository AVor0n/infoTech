export default class UsersDataAdapter {
  /**
   * Вешает обработчик userHandler, на все элементы массива users
   */
  static #usersHandler = {
    get(target, prop) {
      const isIndex = (str) => /^\d+$/.test(str);

      if (isIndex(prop) && prop in target) {
        return new Proxy(target[prop], UsersDataAdapter.#userHandler);
      }

      return target[prop];
    },
  };

  /**
   * Перенаправляет обращения вида user.firstName на user.name.firstName
   */
  static #userHandler = {
    get(target, prop) {
      switch (prop) {
        case "firstName":
          return target.name.firstName;
        case "lastName":
          return target.name.lastName;
        default:
          return target[prop];
      }
    },
  };

  /**
   * Оборачивает массив users в Proxy, для унификации обращения к свойствам элементов массива
   * @param {Array<User>} users массив с данными о пользователях
   * @example
   * // returns users[2].name.firstName
   * users[2].firstName;
   * @example
   * // returns users[1].name.lastName
   * users[1].lastName;
   * @returns {Array<User>} исходный массив, обернутый в Proxy
   */
  static connect(users) {
    return new Proxy(users, UsersDataAdapter.#usersHandler);
  }
}
