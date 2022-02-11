export class Table{
  constructor(cols, rows, options){
    this.cols = cols;
    this.rows = rows;
    this.rowsPerPage = options.rowsPerPage;
    this.currentPage = 1;
    this.selectedRow = null;
    this.countPages = Math.ceil(rows.length / this.rowsPerPage);

    this.table = this.#createTable();
  }



  #createTable(){
    const table = document.createElement('table');
    return table;
  }

  render(container){
    container.append(this.table);
  }
}