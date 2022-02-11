const columnsWithSort = document.querySelectorAll(".table__head-cell[data-sort-key]");

export function init(users, cb) {
  for (const column of columnsWithSort) {
    column.addEventListener("click", () => {
      const order = column.classList.contains("sort--asc") ? "desc" : "asc";

      for (const col of columnsWithSort) {
        col.classList.remove("sort--asc", "sort--desc");
      }

      column.classList.add(`sort--${order}`);

      users.sort(getComparator(order, column.dataset.sortKey))
      cb();
    });
  }
}

function getComparator(order, orderBy) {
  return order === "asc"
    ? (a, b) => ascendingComparator(a, b, orderBy)
    : (a, b) => -ascendingComparator(a, b, orderBy);
}
function ascendingComparator(a, b, orderBy) {
  const collator = new Intl.Collator("en");
  return collator.compare(a[orderBy], b[orderBy])
}
