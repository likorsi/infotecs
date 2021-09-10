'use strict'

const createTable = (captions, icons, data) => { 

	const theadThs = captions.reduce( (prev, caption) => prev + `
		<th>${caption}
          <button class="svg-button hide" onclick="hideColumn(${captions.indexOf(caption)})">
            ${icons.hideIcon}
          </button>
          <button class="svg-button sort" onclick="sortColumn(${captions.indexOf(caption)})">
            ${icons.sortIcon}
          </button>
        </th>`, '')

	document.querySelector('.table').innerHTML = `
		<table><thead>
			<tr> 
				${theadThs}
			</tr>
		</thead>
		<tbody>
		</tbody></table>`

	createTableBody(data)
}

const createTableBody = (data, hide = false) => {
	document.querySelector('tbody').innerHTML = data.reduce( (prev, elem) => prev +  `
  		<tr>
      		<td>${elem.name.firstName}</td>
      		<td>${elem.name.lastName}</td>
      		<td><div class="clip">${elem.about}</div><span>...</span></td>
      		<td>
      			<div class="color" style="background-color: ${elem.eyeColor};">
      				<span>${elem.eyeColor}</span>
      			</div>
      		</td>
      	</tr>`, '')
}

const sortColumn = (captionIndex) => {
		const caption = captions[captionIndex].split(' ').join('')
		let sortIcon = document.querySelector(`.table thead th:nth-child(${captionIndex+1}) .sort`)
		const isAlphaSort = [...sortIcon.classList].indexOf('sort-rotate') === -1 ? false : true // флаг направления сортировки 

		data = bubbleSort(data, caption, isAlphaSort)

		createTableBody(data)
		json = JSON.stringify(data)

		sortIcon.classList.toggle('sort-rotate') // поворот иконки сортировки
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
		const hideIcon = document.querySelector(`.table thead th:nth-child(${captionIndex+1}) .hide`)
		hideIcon.innerHTML.trim() === icons.hideIcon ? hideIcon.innerHTML = icons.hideIconSplash : hideIcon.innerHTML = icons.hideIcon
		hideIcon.classList.toggle('hide-splash')


}

const closeChangeDataDiv = () => document.querySelector('.change-data').style.display = 'none'

const handleInput = () => {
	const form = document.querySelector('.change-data form')
	const newValues = [...form.querySelectorAll('input'), form.querySelector('textarea')]
	newValues.map( caption => {
		console.log(caption.id)
		return data[rowIndex][caption.id] = caption.value
	})

	// console.log(data[rowIndex])
	createTableBody(captions, icons, data)
	json = JSON.stringify(data)
	// json = data.stringify()
}


let data = JSON.parse(json)
let rowIndex = -1 // переменная для запоминания строки, на которой произошел клик
// console.log(JSON.stringify(data))
// json = JSON.stringify(data)

const re = new RegExp('(?=[A-Z])') // regExp для разделения названий через заглавную
const captions = Object.keys(data[0].name).concat(Object.keys(data[0]).slice(-2)).map( caption => {
	return caption.split(re).join(' ')
})

createTable(captions, icons, data) // создаем и наполняем таблицу

// addEllipsis() //

const changeDataDiv = document.querySelector('.change-data') // получаем форму редактирования
console.log(changeDataDiv)

// заполнение формы данными из строки
document.querySelector('tbody').onclick = (evt) => {
	rowIndex = (evt.target.parentNode.rowIndex || evt.target.parentNode.parentNode.rowIndex) - 1
	// changeDataDiv.style.display = (changeDataDiv.style.display == 'none') ? '' : 'none'
	const form = document.querySelector('.change-data form')
	form.querySelector('#firstName').value = data[rowIndex].name.firstName
	form.querySelector('#lastName').value = data[rowIndex].name.lastName
	form.querySelector('#about').value = data[rowIndex].about
	form.querySelector('#eyeColor').value = data[rowIndex].eyeColor

	changeDataDiv.style.display = 'block'

	// console.log(data[rowIndex])	
}

// window.onclick = (evt) => {
// 	const isFreeArea = evt.target.localName === 'html' || evt.target.localName === 'body'
// 	if (isFreeArea) {
// 		changeDataDiv.style.display = 'none'
// 	}
// }

// console.log(tbody)


