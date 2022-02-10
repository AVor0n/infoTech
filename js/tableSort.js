const columnsWithSort = document.querySelectorAll(".table__head-cell[data-sort-key]");
console.log(columnsWithSort);

export function init(users, cb) {
  for (const column of columnsWithSort) {
    column.addEventListener("click", () => {
      const sortDirection = column.classList.contains("sort--up") ? "down" : "up";

      for (const col of columnsWithSort) {
        col.classList.remove("sort--up", "sort--down");
      }

      column.classList.add(`sort--${sortDirection}`);
      sortUsers(column.dataset.sortKey, sortDirection, users);
      cb();
    });
  }
}

export function sortUsers(key, direct, users) {
  const collator = new Intl.Collator("en");

  switch (direct) {
    case "up": {
      if (key === "firstName") {
        users.sort((user1, user2) => collator.compare(user1.name.firstName, user2.name.firstName));
      }
      if (key === "lastName") {
        users.sort((user1, user2) => collator.compare(user1.name.lastName, user2.name.lastName));
      }
      if (key === "about") {
        users.sort((user1, user2) => collator.compare(user1.about, user2.about));
      }
      if (key === "eyeColor") {
        users.sort((user1, user2) => collator.compare(user1.eyeColor, user2.eyeColor));
      }
      return;
    }
    case "down": {
      if (key === "firstName") {
        users.sort((user2, user1) => collator.compare(user1.name.firstName, user2.name.firstName));
      }
      if (key === "lastName") {
        users.sort((user2, user1) => collator.compare(user1.name.lastName, user2.name.lastName));
      }
      if (key === "about") {
        users.sort((user2, user1) => collator.compare(user1.about, user2.about));
      }
      if (key === "eyeColor") {
        users.sort((user2, user1) => collator.compare(user1.eyeColor, user2.eyeColor));
      }
      return;
    }
  }
}
