'use strict'

/**
  * Создание таблицы
  * 
  * @param {string []} captions - массив заголовков
  * @param {Object} icons - svg иконки
  * @param {Object []} data - данные
  * @param {Object} hidden - информация о состоянии заголовков 
  * @param {number} startIndex - стартовая позиция
  */
const createTable = (captions, icons, data, hidden, startIndex) => { 

	const theadTh = thead || `<tr>` + captions.reduce( (prev, caption) => prev + `
		<th>${caption}
		<div class="button-area">
			<button class="svg-button hide" onclick="hideColumn(${captions.indexOf(caption)})">
            ${icons.hideIcon}
          </button>
          <button class="svg-button sort" onclick="sortColumn(${captions.indexOf(caption)})">
            ${icons.sortIcon}
          </button>
		</div></th>`, '') 

	// генерация заголовков скрытых столбцов взамен текущих
	const theadSideTh = thead || captions.reduce((prev, caption) => prev + `
		<th class="side-${caption.split(' ').join('')} visually-hidden th-hide">${caption}
		<div class="button-area">
			<button class="svg-button hide" onclick="hideColumn(${captions.indexOf(caption)})">
            ${icons.hideIconSplash}
          </button>
		</div></th>`, theadTh) + `</tr>`

	document.querySelector('.table').innerHTML = `
		<table><thead>
				${theadSideTh}
		</thead>
		<tbody>
		</tbody>
		</table>
		<div class="button-area navigation">
			<button class="svg-button" onclick="changePage('left')">
            	${icons.left}
			</button>
			<button class="svg-button sort" onclick="changePage('right')">
				${icons.right}
			</button>
		</div>
			<button class="edit" onclick="makeOriginal()">
				replace with the original data
			</button>`


	createTableBody(refresh('data', data), refresh('hidden', hidden), refresh('startIndex', startIndex))
}

/**
  * Создание тела таблицы
  * 
  * @param {Object []} data - данные
  * @param {Object} hidden - информация о состоянии заголовков 
  * @param {number} startIndex - стартовая позиция
  * @param {number} count - количество строк на странице
  */
const createTableBody = (data, hidden, startInde, count=10) => {
	document.querySelector('tbody').innerHTML = data.slice(startIndex, startIndex+count)
													.reduce( (prev, elem) => prev +  `
  		<tr>
      		<td class="${hidden['firstName']}">${elem.name.firstName}</td>
      		<td class="${hidden['lastName']}">${elem.name.lastName}</td>
      		<td class="${hidden['about']}">
	      		<span class="clip">${elem.about}</span>	
	      	</td>
      		<td class="${hidden['eyeColor']}">
      			<div class="color" style="background-color: ${elem.eyeColor};">
      				<span>${elem.eyeColor}</span>
      			</div>
      		</td>
      	</tr>`, '')
}

/**
  * Сортировка столбца
  * 
  * @param {number} captionIndex - индекс заголовка
  */
const sortColumn = captionIndex => {
	const caption = captions[captionIndex].split(' ').join('')
	const sortIcon = document.querySelector(`.table thead th:nth-child(${captionIndex+1}) .sort`)
	const isAlphaSort = [...sortIcon.classList].indexOf('sort-rotate') === -1 ? false : true // флаг направления сортировки 

	data = bubbleSort(data, caption, isAlphaSort)

	createTableBody(refresh('data', data), refresh('hidden', hidden), refresh('startIndex', startIndex))
	sortIcon.classList.toggle('sort-rotate') // поворот иконки сортировки
	thead = document.querySelector('thead').innerHTML
	refresh('thead', thead)
	rowIndex = 0 // обнуление текущего индекса строки
	handleTbody()
}

/**
  * Сортировка данных
  * 
  * @param {Object []} data - данные
  * @param {string} caption - заголовок
  * @param {boolean} isAlphaSort - направление сортировки
  * @returns {Object []}
  */
const bubbleSort = (data, caption, isAlphaSort) => {
	const len = data.length - 1
	for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - i; j++) {
        	let current = data[j][caption] || data[j].name[caption]
        	let next = data[j + 1][caption] || data[j + 1].name[caption] 
        	if (isAlphaSort) {
				if (current > next) {
	                let swap = data[j]
	                data[j] = data[j + 1]
	                data[j + 1] = swap
	            }
        	} else {
        		if (current < next) {
	                let swap = data[j]
	                data[j] = data[j + 1]
	                data[j + 1] = swap
	            }
        	}     
        }
    }
    return data
}

/**
  * Скрытие столбца
  * 
  * @param {number} captionIndex - индекс заголовка
  */
const hideColumn = captionIndex => {
	const caption = captions[captionIndex].split(' ').join('')
	hidden[caption] === 'visually-hidden' ? hidden[caption] = '' : hidden[caption] = 'visually-hidden'

	const columnToHide = document.querySelector(`.table thead th:nth-child(${captionIndex+1})`)
	columnToHide.classList.toggle('visually-hidden')

	const columnToShow = document.querySelector(`th.side-${caption}`)
	columnToShow.classList.toggle('visually-hidden')
	
	thead = document.querySelector('thead').innerHTML
	refresh('thead', thead)

	createTableBody(refresh('data', data), refresh('hidden', hidden), refresh('startIndex', startIndex))
}

/**
  * Скрытие формы редактирования
  * 
  */
const closeChangeDataDiv = () => changeDataDiv.style.display = refresh('formDisplay', 'none')

/**
  * Получение данных из формы редактирования
  * 
  * @returns {boolean}
  */
const handleChangeDataDiv = () => {
	const form = document.querySelector('.change-data form')
	const newValues = [...form.querySelectorAll('input'), form.querySelector('textarea')]

	newValues.map( caption => {
		!!data[rowIndex + startIndex][caption.id] // проверка на сущестоввание поля
			? data[rowIndex + startIndex][caption.id] = caption.value
			: data[rowIndex + startIndex].name[caption.id] = caption.value
	})

	createTableBody(refresh('data', data), refresh('hidden', hidden), refresh('startIndex', startIndex))
	handleTbody()

	return false // возврат false, чтобы отменить обновление страницы
}

/**
  * Постраничный вывод данных
  * 
  * @param {string} side - направление перелистывания
  * @param {number} count - количество строк на странице
  */
const changePage = (side, count=10) => {
	side === 'right'
		? startIndex + count > data.length-1 ? startIndex = 0 : startIndex += count
		: startIndex - count < 0 ? startIndex = data.length-count : startIndex -= count
	createTableBody(refresh('data', data), refresh('hidden', hidden), refresh('startIndex', startIndex))
	rowIndex = 0
	handleTbody()
}

/**
  * Обновление хранилища данных
  * 
  * @param {string} key - ключ 
  * @param {*} item - новое значение
  * @returns {*}
  */
const refresh = (key, item) => {
	typeof item === 'object' ? localStorage.setItem(key, JSON.stringify(item)) : localStorage.setItem(key, item)

	return typeof item === 'object' ? JSON.parse(localStorage.getItem(key)) : localStorage.getItem(key)
}

/**
  * Возврат значений таблицы к первоначальным данным
  * 
  */
const makeOriginal = () => {
	localStorage.removeItem('data')
	localStorage.removeItem('thead')
	localStorage.removeItem('startIndex')
	localStorage.removeItem('hidden')

	data = JSON.parse(json) 
	startIndex = 0  
	hidden = {'firstName': '','lastName': '','about': '','eyeColor': ''}
	thead = ''
	
	createTable(captions, icons, data, hidden, startIndex)
	
	// обновление тела таблицы и его обработчика
	tbody = document.querySelector('tbody')
	tbody.onclick = evt => {
		refresh('formDisplay', 'block')
		handleTbody(evt)
	} 
	rowIndex = 0 // обнуление текущего индекса строки
	handleTbody()
}

/**
  * Заполнение формы данными из строки по клику
  * 
  * @param {Object} evt - событие 
  */
const handleTbody = evt => {
  	rowIndex = evt && ((evt.target.parentNode.rowIndex || evt.target.parentNode.parentNode.rowIndex) - 1) || rowIndex
	const form = document.querySelector('.change-data form')
	const inputs = [...form.querySelectorAll('input'), ...form.querySelectorAll('textarea')]
	inputs.map( input => {
		input.value = data[rowIndex + startIndex].name[input.id] || data[rowIndex + startIndex][input.id]
	})
	changeDataDiv.style.display = localStorage.getItem('formDisplay') || 'none'
}


// инициализация данных или получение старых из хранилища
// "||" для страховки от некорректных значений

let data = JSON.parse(localStorage.getItem('data') || json)
let startIndex = parseInt(localStorage.getItem('startIndex')) || 0 // позиция, с которой нужно показать постраничный вывод
let hidden = JSON.parse(localStorage.getItem('hidden')) || 		   // информация о состоянии заголовков 
			{'firstName': '','lastName': '','about': '','eyeColor': ''}
let thead = localStorage.getItem('thead') || '' 				   // состояние шапки таблицы
let rowIndex = 0 												   // индекс строки тела таблицы, на которой произошел клик, по умолчанию - первая


const re = new RegExp('(?=[A-Z])') 		   // regExp для разделения названий через заглавную
const captions = Object.keys(data[0].name) // создание массива заголовков 
	.concat(Object.keys(data[0]).slice(-2))
	.map( caption => {
		return caption.split(re).join(' ')
	})

createTable(captions, icons, data, hidden, startIndex) 		 // создание и наполнение таблицы
const changeDataDiv = document.querySelector('.change-data') // получаем форму редактирования


let tbody = document.querySelector('tbody') // получение тела таблицы
tbody.onclick = evt => {					// заполнение формы данными из строки по клику
	refresh('formDisplay', 'block')
	handleTbody(evt)
} 
handleTbody() // дефолтное заполнение формы данными
