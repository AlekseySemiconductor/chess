import '../styles/main.less';
import './Table.less';

class CreateTable { // Создаём доску
	constructor(options) {
		this.row = options.row;
		this.col = options.col;
		this.cellWidth = options.cellWidth;
		this.maxCell = this.row * this.col; // Количество ячеек в таблице
	}

	init() {
		this.table = document.createElement('div'), // Создаём таблицу
		this.table.classList.add('table', 'js-table'); // Даём таблице класс table, чтобы стилизовать её

		const cell = "<div class='table__cell js-droppable'></div>",
			cellEven = "<div class='table__cell table__cell_dark js-droppable'></div>";

		let cells = '', // Это строка, в которую будем вписывать ячейки
			flag = true, // Эту переменную будем менять при переходе на новую строку в таблицах,
						 // где в линии четное количество ячеек и в зависимости от того true она
						 // или false будет по-разному закрашиваться линия
			even; // Эта переменная нужна только для проверки на четность количество ячеек в линии
		
		// Возможно кто-то захочет сделать таблицу не 8x8, а больше,
		// Тогда нам нужно будет проверять четное число ячеек в строке или нет
		// Если четное, то при переходе на новую строку первая ячейка должна быть другого цвета 
		if (this.col%2 == 0) even = true;
		
		// Запускаем цикл, в котором будем вставлять ячейки в строку
		// Проверяем, если четное количество ячеек в линии, то запускаем 
		if (even) {
			for (let i = 1, len = this.maxCell; i <= len; i++ ) {
				if (flag) {
					if (i%2 == 0) {
						cells += cellEven;
						if (i%this.col == 0) flag = !flag; // При переходе на новую линию меняем флаг
						continue;
					}
					cells += cell;
				} else {
					if (i%2 == 0) {
						cells += cell;
						if (i%this.col == 0) flag = !flag; // При переходе на новую линию меняем флаг
						continue;
					}
					cells += cellEven;
				}
			}
		} else {
			for (let i = 1, len = this.maxCell; i <= len; i++ ) {
				if (i%2 == 0) {
					cells += cellEven;
					continue;
				}
				cells += cell;
			}
		}
		
		this.table.innerHTML = cells; // Вставляем строку из ячеек в таблицу
		// Задаем таблице ширину:
		this.table.style.width = this.cellWidth * this.col + 'px';
		return this.table;
	}
};

const Table = new CreateTable({
	row: 8, // количество рядов
	col: 8, // количество колонок
	cellWidth: 60 // ширина одной ячейки
});
Table.init();

export default Table.table;