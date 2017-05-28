import './Figures.less';

class CreateFigures { // Создаём боковую панель "Фигуры"

	constructor(options) {
		this.figures = options.figures; // массив из всех фигур
		this.alone = options.alone.slice(); // в этотм массиве лежат значения фигур, которые должны исчезнуть при переносе
		this.typeofLayout = options.typeofLayout;
	}

	init() {
		this.layout = document.createElement('div'),
		this.layout.classList.add('layout');
		this.layout.setAttribute('data-layout', this.typeofLayout);
		let line = "";

		for (let i = 0, len = this.figures.length; i < len; i++) {
			if (this.figures[i] == 'blackKing' || this.figures[i] == 'whiteKing') {
				line += '<div data-alone="true" data-role=' + this.figures[i] + ' class="figure js-draggable"></div>';
				continue;
			}
			line += '<div data-role=' + this.figures[i] + ' class="figure js-draggable"></div>';
		}

		this.layout.innerHTML = line; // Вставляем строку из фигур на подложку
		return this.layout;
	}

	move() {

		var that = this,
			whiteKing = "<div data-alone='true' data-role='whiteKing' class='figure js-draggable'></div>",
			blackKing = "<div data-alone='true' data-role='blackKing' class='figure js-draggable'></div>";

		var DragManager = new function() {

			var dragObject = {};

			var self = this; // для доступа к себе из обработчиков

			function onMouseDown(e) {

				var elem = e.target.closest('.js-draggable');

				// если клик правой кнопкой мыши, то он не запускает перенос
				// или не нашли, клик вне draggable-объекта
				if (e.which != 1 || !elem) return;

				dragObject.elem = elem; // запомнить переносимый объект

				// запомнить координаты, с которых начат перенос объекта
				dragObject.downX = e.pageX;
				dragObject.downY = e.pageY;

				return false;
			};

			function onMouseMove(e) {
				if (!dragObject.elem) return; // элемент не зажат

				if (!dragObject.avatar) { // элемент нажат, но пока не начали его двигать
					// начать перенос, присвоить dragObject.avatar = переносимый элемент

					// посчитать дистанцию, на которую переместился курсор мыши
					var moveX = e.pageX - dragObject.downX,
						moveY = e.pageY - dragObject.downY;

					// ничего не делать, мышь не передвинулась достаточно далеко
					if (Math.abs(moveX) < 3 && Math.abs(moveY) < 3) return;
					
					// начинаем перенос
					dragObject.avatar = createAvatar(e); // захватить элемент
					if (!dragObject.avatar) {
						dragObject = {}; // аватар создать не удалось, отмена переноса
						return; // возможно, нельзя захватить за эту часть элемента
					}

					// аватар создан успешно
					// создать вспомогательные свойства shiftX/shiftY
					var coords = getCoords(dragObject.avatar);

					dragObject.shiftX = dragObject.downX - coords.left;

					if (JSON.parse(dragObject.elem.getAttribute('data-alone')) !== true) { // так как строка, поэтому parse
						dragObject.shiftY = dragObject.downY - coords.top - dragObject.clone.offsetHeight/2;
					} else if (JSON.parse(dragObject.elem.getAttribute('data-alone')) == true) {
						dragObject.shiftY = dragObject.downY - coords.top;
					}

					startDrag(e); // отобразить начало переноса
				}

				dragObject.avatar.style.left = e.pageX - dragObject.shiftX + 'px';
				dragObject.avatar.style.top = e.pageY - dragObject.shiftY + 'px';

				return false;
			};

			function onMouseUp(e) {

				if (dragObject.avatar == undefined) return;

				// если перенос идет
				if (JSON.parse(dragObject.avatar.getAttribute('data-alone')) == true) {
					if (dragObject.avatar) finishDrag(e, true);
				} else if (JSON.parse(dragObject.avatar.getAttribute('data-alone')) !== true) {
					if (dragObject.avatar) finishDrag(e);
				}
				

				// в конце mouseup перенос либо завершился, либо даже не начинался
				// в любом случае очистим "состояние переноса" dragObject
				dragObject = {};
			};

			function createAvatar(e) {

				// запомнить старые свойства, чтобы вернуться к ним при отмене перенос
				var avatar = dragObject.elem,
					old = {
						parent: avatar.parentNode,
						nextSibling: avatar.nextSibling,
						position: avatar.position || '',
						left: avatar.left || '',
						top: avatar.top || '',
						zIndex: avatar.zIndex || ''
					};
				
				// Если это не король, то тогда мы не только вырезаем, но и вставляем, где эта фигура была

				if (JSON.parse(dragObject.elem.getAttribute('data-alone')) !== true) {
					dragObject.clone = dragObject.elem.cloneNode();
					dragObject.elem.parentNode.insertBefore(dragObject.clone, old.nextSibling);
					// функция для отмены переноса
					avatar.rollback = function() {
						dragObject.avatar.parentNode.removeChild(dragObject.avatar);
						delete dragObject.avatar;
					};
				} else if (JSON.parse(dragObject.elem.getAttribute('data-alone')) == true) {
					// функция для отмены переноса
					avatar.rollback = function() {
						old.parent.insertBefore(avatar, old.nextSibling);
						avatar.style.position = old.position;
						avatar.style.left = old.left;
						avatar.style.top = old.top;
						avatar.style.zIndex = old.zIndex
					};
				}

				return avatar;
			}

			function finishDrag(e, alone) {

				var dropElem = findDroppable(e);

				if (!dropElem) {
					self.onDragCancel(dragObject);
				} else {
					self.onDragEnd(dragObject, dropElem, alone);
				}
			}

			function findDroppable(event) {
				// спрячем переносимый элемент
				dragObject.avatar.hidden = true;

				// получить самый вложенный элемент под курсором мыши
				var elem = document.elementFromPoint(event.clientX, event.clientY);

				// показать переносимый элемент обратно
				dragObject.avatar.hidden = false;

				if (elem == null) {
					// такое возможно, если курсор мыши "вылетел" за границу окна
					return null;
				}

				return elem.closest('.js-droppable');
			}

			function startDrag(e) {
				var avatar = dragObject.avatar;

				document.body.appendChild(avatar);
				avatar.style.zIndex = 9999;
				avatar.style.position = 'absolute';
			}

			document.onmousedown = onMouseDown;
			document.onmousemove = onMouseMove;
			document.onmouseup = onMouseUp;

			this.onDragCancel = function(dragObject) {
				dragObject.avatar.rollback(); // откат переноса
			};

			this.onDragEnd = function(dragObject, dropElem, alone) {

				if (JSON.parse(dropElem.getAttribute('data-alone')) == true) {
					if (dropElem.getAttribute('data-role') == 'whiteKing') {
						let layout = document.querySelector('[data-layout="white"]');
							layout.innerHTML = whiteKing + layout.innerHTML;
					} else if (dropElem.getAttribute('data-role') == 'blackKing') {
						let layout = document.querySelector('[data-layout="black"]');
							layout.innerHTML = blackKing + layout.innerHTML;
					}

					if (JSON.parse(dropElem.getAttribute('data-alone')) !== true) {
						dropElem.setAttribute('data-alone', null);
					}

				} else if (JSON.parse(dropElem.getAttribute('data-alone')) !== true) {
					if (alone) dropElem.setAttribute('data-alone', true);
				}

				// успешный перенос, добавить в перенесенную ячейку data-role переносимой
				dropElem.setAttribute('data-role', dragObject.elem.getAttribute('data-role'));


				// скрыть/удалить переносимый объект
				dragObject.elem.hidden = true;
			};
		}

		function getCoords(elem) { // кроме IE8-
			var box = elem.getBoundingClientRect();

			return {
				top: box.top + pageYOffset,
				left: box.left + pageXOffset
			};

		}

	}

};

let BlackFigures = new CreateFigures({
	figures: [
		'blackKing', // Король
		'blackQueen', // Ферзь
		'blackRook', // Ладья
		'blackBishop', // Слон
		'blackKnight', // Конь
		'blackPawn' // Пешка
	],
	alone: [ // в этом массиве лежат значения фигур, которые должны исчезнуть при переносе
		'king'
	],
	typeofLayout: 'black'
});
BlackFigures.init();
BlackFigures.move();


let WhiteFigures = new CreateFigures({
	figures: [
		'whiteKing', // Король
		'whiteQueen', // Ферзь
		'whiteRook', // Ладья
		'whiteBishop', // Слон
		'whiteKnight', // Конь
		'whitePawn' // Пешка
	],
	alone: [ // в этом массиве лежат значения фигур, которые должны исчезнуть при переносе
		'king'
	],
	typeofLayout: 'white'
});
WhiteFigures.init();
WhiteFigures.move();


const WhiteLayout = WhiteFigures.layout,
	BlackLayout = BlackFigures.layout;

export {WhiteLayout, BlackLayout};