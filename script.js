'use strict'

const createTable = (captions, icons, data, hidden, startIndex) => { 

	const theadTh = thead || captions.reduce( (prev, caption) => prev + `
		<th>${caption}
		<div class="button-area">
			<button class="svg-button hide" onclick="hideColumn(${captions.indexOf(caption)})">
            ${icons.hideIcon}
          </button>
          <button class="svg-button sort" onclick="sortColumn(${captions.indexOf(caption)})">
            ${icons.sortIcon}
          </button>
		</div>
          
        </th>`, '')

	document.querySelector('.table').innerHTML = `
		<table><thead>
			<tr> 
				${theadTh}
			</tr>
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
				<button class="edit" onclick="makeOriginal()">replace with the original data</button>`

	// refresh('thead', thead)
	createTableBody(refresh('data', data), refresh('hidden', hidden), refresh('startIndex', startIndex))
}

const createTableBody = (data, hidden, start) => {
	document.querySelector('tbody').innerHTML = data.slice(startIndex, startIndex+10).reduce( (prev, elem) => prev +  `
  		<tr>
      		<td class="${hidden['firstName']}">${elem.name.firstName}</td>
      		<td class="${hidden['lastName']}">${elem.name.lastName}</td>
      		<td class="about ${hidden['about']}"><span class="clip ${hidden['about']}">${elem.about}</span><span class="ellipsis ${hidden['about']}">...</span></td>
      		<td class="${hidden['eyeColor']}">
      			<div class="color" style="background-color: ${elem.eyeColor};">
      				<span>${elem.eyeColor}</span>
      			</div>
      		</td>
      	</tr>`, '')
}

const sortColumn = (captionIndex) => {
	changeDataDiv.style.display = 'none'
	const caption = captions[captionIndex].split(' ').join('')
	const sortIcon = document.querySelector(`.table thead th:nth-child(${captionIndex+1}) .sort`)
	const isAlphaSort = [...sortIcon.classList].indexOf('sort-rotate') === -1 ? false : true // флаг направления сортировки 

	data = bubbleSort(data, caption, isAlphaSort)

	createTableBody(refresh('data', data), refresh('hidden', hidden), refresh('startIndex', startIndex))
	sortIcon.classList.toggle('sort-rotate') // поворот иконки сортировки
	thead = document.querySelector('thead').innerHTML
	refresh('thead', thead)
}

const bubbleSort = (data, caption, isAlphaSort) => {
	const len = data.length - 1
	for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - i; j++) {
        	let current = data[j][caption] || data[j].name[caption] // страховка от undefind
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

const hideColumn = captionIndex => {
	changeDataDiv.style.display = 'none'
	const caption = captions[captionIndex].split(' ').join('')
	const hideIcon = document.querySelector(`.table thead th:nth-child(${captionIndex+1}) .hide`)
	hideIcon.innerHTML.trim() === icons.hideIcon ? hideIcon.innerHTML = icons.hideIconSplash : hideIcon.innerHTML = icons.hideIcon
	hideIcon.classList.toggle('hide-splash')

	hidden[caption] === 'visually-hidden' ? hidden[caption] = '' : hidden[caption] = 'visually-hidden'

	const columnToHide = document.querySelector(`.table thead th:nth-child(${captionIndex+1})`)
	// const hiddenCaption = document.querySelector(`.table wrapper div:nth-child(${captionIndex+1})`)

	// const columns = [...document.querySelectorAll(`.table thead th`)]
	// columnToHide.style.left = `${100 / 4}%`
	// for(let i = captionIndex+1; i < columns.length; i++){
	// 	columns[i].style.left = `-${100 / 4}%`
	// }
	// console.log(captionIndex)

	columnToHide.querySelectorAll('button')[1].classList.toggle('visually-hidden') // 
	columnToHide.classList.toggle('th-hide')
	// hiddenCaption.classList.toggle('th-hide')
	// hiddenCaption.classList.toggle('visually-hidden')
	thead = document.querySelector('thead').innerHTML
	refresh('thead', thead)

	createTableBody(refresh('data', data), refresh('hidden', hidden), refresh('startIndex', startIndex))
}

const closeChangeDataDiv = () => changeDataDiv.style.display = 'none'

const handleInput = () => {
	const form = document.querySelector('.change-data form')
	const newValues = [...form.querySelectorAll('input'), form.querySelector('textarea')]
	newValues.map( caption => {
		!!data[rowIndex + startIndex][caption.id] 
			? data[rowIndex + startIndex][caption.id] = caption.value
			: data[rowIndex + startIndex].name[caption.id] = caption.value
	})

	createTableBody(refresh('data', data), refresh('hidden', hidden), refresh('startIndex', startIndex))
}

const changePage = (side) => {
	side === 'right'
		? startIndex + 10 > data.length-1 ? startIndex = 0 : startIndex += 10
		: startIndex - 10 < 0 ? startIndex = data.length-10 : startIndex -= 10
	createTableBody(refresh('data', data), refresh('hidden', hidden), refresh('startIndex', startIndex))
}

const refresh = (key, item) => {
	typeof item === 'object' ? localStorage.setItem(key, JSON.stringify(item)) : localStorage.setItem(key, item)

	return typeof item === 'object' ? JSON.parse(localStorage.getItem(key)) : localStorage.getItem(key)
}

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
}


let data = JSON.parse(localStorage.getItem('data') || json) // 
let startIndex = parseInt(localStorage.getItem('startIndex')) || 0 // позиция, с которой нужно показать постраничный вывод
// 
let hidden = JSON.parse(localStorage.getItem('hidden')) || {'firstName': '','lastName': '','about': '','eyeColor': ''}
let thead = localStorage.getItem('thead') || ''
let rowIndex = -1 // 

const re = new RegExp('(?=[A-Z])') // regExp для разделения названий через заглавную
const captions = Object.keys(data[0].name).concat(Object.keys(data[0]).slice(-2)).map( caption => {
	return caption.split(re).join(' ')
})

createTable(captions, icons, data, hidden, startIndex) // создаем и наполняем таблицу
const changeDataDiv = document.querySelector('.change-data') // получаем форму редактирования

// заполнение формы данными из строки
document.querySelector('tbody').onclick = (evt) => {
	rowIndex = (evt.target.parentNode.rowIndex || evt.target.parentNode.parentNode.rowIndex) - 1
	const form = document.querySelector('.change-data form')
	console.log(rowIndex + startIndex, startIndex, data[rowIndex + startIndex -1 ].name.firstName)
	form.querySelector('#firstName').value = data[rowIndex + startIndex].name.firstName
	form.querySelector('#lastName').value = data[rowIndex + startIndex].name.lastName
	form.querySelector('#about').value = data[rowIndex + startIndex].about
	form.querySelector('#eyeColor').value = data[rowIndex + startIndex].eyeColor
	changeDataDiv.style.display = 'block'
}