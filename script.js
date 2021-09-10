'use strict'

const createTable = (captions, icon, data) => { 

	const theadThs = captions.reduce( (prev, caption) => prev + `
		<th>${caption}
          <button class="svg-button sort" onclick="sortColumn(${captions.indexOf(caption)})">
            ${icon}
          </button>
        </th>`, '')

	const tbodyTrs = data.reduce( (prev, elem) => prev +  `
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

	document.querySelector('.table').innerHTML = `
		<table><thead>
			<tr> 
				${theadThs}
			</tr>
		</thead>
		<tbody>
			${tbodyTrs}
		</tbody></table>`
}

const sortColumn = (captionIndex) => {
		const sortIcon = document.querySelector(`.table thead th:nth-child(${captionIndex+1}) .sort`)
		const caption = captions[captionIndex].split(' ').join('')
		// console.log('sortIcon =', sortIcon)
		console.log('caption = ', caption)			

		let styleSortIcon = sortIcon.querySelector('svg').style
		console.log(styleSortIcon.transform)
		styleSortIcon.transform === 'rotate(-90deg)' ? styleSortIcon.transform = 'rotate(90deg)' : styleSortIcon.transform = 'rotate(-90deg)'
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
	createTable(captions, sortIcon, data)
}


let data = JSON.parse(json)
let rowIndex = -1 // переменная для запоминания строки, на которой произошел клик

// json = JSON.stringify(data)

const sortIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" style="transform='rotate(-90deg)'">
      <path fill="#000" d="M18.271,9.212H3.615l4.184-4.184c0.306-0.306,0.306-0.801,0-1.107c-0.306-0.306-0.801-0.306-1.107,0
      L1.21,9.403C1.194,9.417,1.174,9.421,1.158,9.437c-0.181,0.181-0.242,0.425-0.209,0.66c0.005,0.038,0.012,0.071,0.022,0.109
      c0.028,0.098,0.075,0.188,0.142,0.271c0.021,0.026,0.021,0.061,0.045,0.085c0.015,0.016,0.034,0.02,0.05,0.033l5.484,5.483
      c0.306,0.307,0.801,0.307,1.107,0c0.306-0.305,0.306-0.801,0-1.105l-4.184-4.185h14.656c0.436,0,0.788-0.353,0.788-0.788
      S18.707,9.212,18.271,9.212z"></path></svg>`

const re = new RegExp('(?=[A-Z])') // regExp для разделения названий через заглавную
const captions = Object.keys(data[0].name).concat(Object.keys(data[0]).slice(-2)).map( caption => {
	return caption.split(re).join(' ')
})

createTable(captions, sortIcon, data) // создаем и наполняем таблицу

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


