import Table from './components/Table.jsx';
import {WhiteLayout, BlackLayout} from './components/Figures.jsx';

const whiteLayoutString = WhiteLayout.innerHTML;
const blackLayoutString = BlackLayout.innerHTML;

const body = document.body,
	root = body.querySelector('#root'),
	wrap = document.createElement('div');

const WrapLine = document.createElement('div');
WrapLine.classList.add('line');

const LoadLine = document.createElement('div');
LoadLine.classList.add('line');

const Textarea = document.createElement('input');
Textarea.classList.add('textarea', 'js-name');
Textarea.placeholder = 'Введите название этюда:';

const SendBtn = document.createElement('div');
SendBtn.innerHTML = 'Сохранить этюд';
SendBtn.classList.add('btn', 'js-send');

const heading = document.createElement('div');
heading.innerHTML = 'Загрузить этюд:';
heading.classList.add('heading', 'js-load');

SendBtn.addEventListener('click', function() {

	if (Textarea.value == "") {
		Textarea.classList.add('error');
		return;
	}

	if (!document.querySelector('.js-table').querySelector('[data-role]')) {

		let squares = document.querySelectorAll('.js-draggable');

		for (let i = 0; i < squares.length; i++) {
			squares[i].classList.add('error');
		}
		
		setTimeout(function() {
			for (let i = 0; i < squares.length; i++) {
				squares[i].classList.remove('error');
			}
		}, 1000);
		return;
	}

	if (Textarea.classList.contains('error')) {
		Textarea.classList.remove('error');
	}

	let chessLS = JSON.parse(localStorage.getItem('chess')) || [], // берем данные из localStorage
		data = [],
		params = {
			name: Textarea.value,
			data: data
		};

	const item = document.querySelector('.js-table').childNodes,
		len = item.length;

	for (let i = 0; i < len; i++) {
		if (item[i].hasAttribute('data-role')) {
			data.push({
				role: item[i].getAttribute('data-role'),
				position: i
			});
		}
	}

	chessLS.push(params);
	
	localStorage.setItem('chess', JSON.stringify(chessLS)); // отправляем его в localStorage

	// Если есть сервер
	// let xmlhttp = new XMLHttpRequest();
	// xmlhttp.open("POST", "chess.json", true);
	// xmlhttp.send(params);

	// Если сервера нету, то можно отправить в localStorage

	location.reload();

});

root.appendChild(wrap).classList.add('wrap');
root.insertBefore(WrapLine, wrap);
WrapLine.appendChild(Textarea);
WrapLine.appendChild(SendBtn);
root.insertBefore(LoadLine, wrap);


// Берём рекорды из localStorage
let chessLS = JSON.parse(localStorage.getItem('chess')),
	list = document.createElement('ul'),
	items = "";

if (chessLS !== null) {
	LoadLine.appendChild(heading);
	for (let i = 0; i < chessLS.length; i++) {
		items += '<li data-id='+i+' class="name js-getPlay">'+chessLS[i].name+'</li>';
	}
	list.innerHTML = items;
	LoadLine.appendChild(list);
	list.classList.add('list');
}




let play = document.querySelectorAll('.js-getPlay');

for (let j = 0; j < play.length; j++) {

	play[j].addEventListener('click', function() {

		let arr = chessLS[this.getAttribute('data-id')].data,
			arrLen = arr.length;

		const item = document.querySelector('.js-table').childNodes,
			len = item.length;

		for (let i = 0; i < len; i++) {
			if (item[i].hasAttribute('data-alone')) item[i].removeAttribute('data-alone');
			if (item[i].hasAttribute('data-role')) item[i].removeAttribute('data-role');
		}

		WhiteLayout.innerHTML = whiteLayoutString;
		BlackLayout.innerHTML = blackLayoutString;

		for (let i = 0; i < arrLen; i++) {

			item[arr[i].position].setAttribute('data-role', arr[i].role);
			
			if (arr[i].role == 'whiteKing') {
				item[arr[i].position].setAttribute('data-alone', true);
				let whiteLayout = document.querySelector('[data-layout="white"]');
				if (whiteLayout.querySelector('[data-role="whiteKing"]')) {
					whiteLayout.querySelector('[data-role="whiteKing"]').remove();
				}
			}

			if (arr[i].role == 'blackKing') {
				item[arr[i].position].setAttribute('data-alone', true);
				let blackLayout = document.querySelector('[data-layout="black"]');
				if (blackLayout.querySelector('[data-role="blackKing"]')) {
					blackLayout.querySelector('[data-role="blackKing"]').remove();
				}
			}
			
		}

	});

}

wrap.appendChild(WhiteLayout);
wrap.appendChild(Table);
wrap.appendChild(BlackLayout);