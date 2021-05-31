let isChet = false;
let isEnd = false;
let flag = false;
let flagX = false;
let flagAdd = false;

const form = document.forms[0];
const operationRadios = form.elements['operation'] //returns nodeRadioList
const inputField = document.getElementById('input')
const outputField = document.getElementById('output')
const keyField = document.getElementById('key')

inputField.addEventListener('input',runChosenOperation)
keyField.addEventListener('input',runChosenOperation)
for (const radio of operationRadios) radio.addEventListener("change",runChosenOperation)

function processKeyword(keyword) { 
  keyword = keyword.toUpperCase().replace(/\s/g, '').replace(/[^A-Z]/gi,"").replace(/J/g, "I")//remove spaces & allow alphabet only & replace every "J" with "I"
  
  let key=""
  for (const letter of keyword) {
    if(key.indexOf(letter)===-1) key+= letter
  }
  return key
}

function generateMatrixValues(key){
  let alphabet='ABCDEFGHIKLMNOPQRSTUVWXYZ'//alphabet without "J" (we assume that we will use I only, no J)
    let matrix = [];
    let temp = '';
  
    for(let i = 0; i < key.length; i++) {
      if (alphabet.indexOf(key[i]) !== -1) {
        alphabet = alphabet.replace(key[i], '');
        temp += key[i];
      }
    }
    temp += alphabet;
    temp = temp.split('');
    while(temp[0]) {
      matrix.push(temp.splice(0,5));
    }  
    return matrix;
}

function encrypt(str, keyword) {
  let key = processKeyword(keyword);
  let keyMatrix = generateMatrixValues(key);

  displayPlayfairMatrix(keyMatrix,key)
  if(!str.length) return ""

  let textPhrase, separator;
  str = str.toUpperCase().replace(/\s/g, '').replace(/J/g, "I");

  textPhrase = str[0];
  
  let help = 0; flagAdd = false;
  
  for(let i = 1; i < str.length; i++) {
      if(str[i - 1] === str[i]) {
        if(str[i] === 'X') {
          separator = 'Q';
        }
        else {
          separator = 'X';
        }
        textPhrase += separator + str[i];
        help = 1; 
      }
      else {
        textPhrase += str[i];
      }
    if(help === 1) {
      flagAdd = true;
    }
  }
  
  if(textPhrase.length % 2 !== 0) {
    if(textPhrase[textPhrase.length - 1] === 'X') {
      textPhrase += 'Q';
      isEnd = true;
      flagX = false;
    }
    else {
      textPhrase += 'X';
      isEnd = true;
      flagX = true;
    }
  }
  
  let ciphertext = '';

  for(let i = 0; i < textPhrase.length; i += 2){
  	let pair1 = textPhrase[i];
  	let pair2 = textPhrase[i + 1];
  	let p1i, p1j, p2i, p2j;
  	for(let stroka = 0; stroka < keyMatrix.length; stroka++) {
	    for(let stolbec = 0; stolbec < keyMatrix[stroka].length; stolbec++){
	      if (keyMatrix[stroka][stolbec] == pair1){
	      	p1i = stroka;
	      	p1j = stolbec;
	      }
	      if (keyMatrix[stroka][stolbec] == pair2){
	      	p2i = stroka;
	      	p2j = stolbec;
	      }
	    }
	  }
    let coord1 = '', coord2 = '';
    
    if(p1i === p2i) {
      if(p1j === 4) {
        coord1 = keyMatrix[p1i][0];
      }
      else {
        coord1 = keyMatrix[p1i][p1j + 1];
      }
      if(p2j === 4) {
        coord2 = keyMatrix[p2i][0];
      }
      else {
        coord2 = keyMatrix[p2i][p2j + 1]
      }
    }

    if(p1j === p2j) {
      if(p1i === 4) {
        coord1 = keyMatrix[0][p1j];
      }
      else {
        coord1 = keyMatrix[p1i + 1][p1j];
      }
      if(p2i === 4) {
        coord2 = keyMatrix[0][p2j];
      }
      else {
        coord2 = keyMatrix[p2i + 1][p2j]
      }
    }

    if(p1i !== p2i && p1j !== p2j) {
      coord1 = keyMatrix[p1i][p2j];
      coord2 = keyMatrix[p2i][p1j];
    }
    ciphertext = ciphertext + coord1 + coord2;
  }

  return ciphertext;
}

function decrypt(input, keyword) {
    try {
        let key = processKeyword(keyword);
        let keyMatrix = generateMatrixValues(key)
        displayPlayfairMatrix(keyMatrix, key)
        
        let plaintext = '';
        if(input === '') return ""
    
        input = input.toUpperCase().replace(/\s/g, '').replace(/J/g, "I");
    
    
        for(let i = 0; i < input.length; i += 2){
            let pair1 = input[i];
            let pair2 = input[i + 1];
            let p1i, p1j, p2i, p2j;
            for(let stroka = 0; stroka < keyMatrix.length; stroka++) {
              for(let stolbec = 0; stolbec < keyMatrix[stroka].length; stolbec++){
                if (keyMatrix[stroka][stolbec] == pair1){
                    p1i = stroka;
                    p1j = stolbec;
                }
                if (keyMatrix[stroka][stolbec] == pair2){
                    p2i = stroka;
                    p2j = stolbec;
                }
              }
            }
          let coord1 = '', coord2 = '';
          
          if(p1i === p2i) {
            if(p1j === 0) {
              coord1 = keyMatrix[p1i][4];
            }
            else {
              coord1 = keyMatrix[p1i][p1j - 1];
            }
            if(p2j === 0) {
              coord2 = keyMatrix[p2i][4];
            }
            else {
              coord2 = keyMatrix[p2i][p2j - 1]
            }
          }
          if(p1j === p2j) {
            if(p1i === 0) {
              coord1 = keyMatrix[4][p1j]
            }
            else {
              coord1 = keyMatrix[p1i - 1][p1j];
            }
            if(p2i === 0) {
              coord2 = keyMatrix[4][p2j];
            }
            else {
              coord2 = keyMatrix[p2i - 1][p2j]
            }
          }
          if(p1i !== p2i && p1j !== p2j) {
            coord1 = keyMatrix[p1i][p2j];
            coord2 = keyMatrix[p2i][p1j];
          }
          plaintext = plaintext + coord1 + coord2;
        }
        plaintext = plaintext.split('');
        
        for(let i = 0; i < plaintext.length; i++) {
          let count;
          if (flagAdd) {
            if(plaintext[i] === plaintext[i + 2] && (plaintext[i + 1] === 'X' || plaintext[i + 1] === 'Q')) {
              count = i + 1;
              plaintext.splice(count, 1);
            }
          }
          else if(flagAdd && isEnd && (flagX || !flagX)) {
            if(plaintext[i - 2] === plaintext[i] && (plaintext[i - 1] === 'X' || plaintext[i - 1] === 'Q'))
              count = i + 1;
            plaintext.splice(count, 1);
          }
          else if(!flagAdd) {
            break;
          }
        }
        if(flagX) {
          plaintext.pop();
        }
        if(isEnd && !flagX) {
          plaintext.pop();
        }
        plaintext = plaintext.join('');
        return plaintext 
    } catch (error) {
        return ""
    }

}

function displayPlayfairMatrix(keyMatrix, keyword){
    let table = document.createElement('table')
    let tableBody = document.createElement('tbody')
    let cell, cellText
  
    for (const row of keyMatrix) {
        let tableRow = document.createElement('tr')
        for (const letter of row) {
            cell = document.createElement('td')
            cellText = document.createTextNode(letter)
            
            if(keyword.indexOf(letter)!==-1)
                cell.classList.add('highlight')

            cell.appendChild(cellText)
            tableRow.appendChild(cell)
        }
        tableBody.appendChild(tableRow)
    }
    table.appendChild(tableBody)
    table.classList.add('matrix')
    const matrixDiv = document.getElementById('matrix-div')
    matrixDiv.innerHTML =""
    matrixDiv.append(table)
    return table
}
  
function runChosenOperation(){
    const keyword = keyField.value
    const input = inputField.value
    const operation = operationRadios.value

    let output

    if(output = operation==="encrypt"){
        output=encrypt(input,keyword)
        const inputLabel = document.querySelectorAll('.card-title')
        inputLabel[0].innerText = "Plain text:"
        inputLabel[1].innerText = "Cipher Text:"

    }
    else{
        output=decrypt(input,keyword)
        const inputLabel = document.querySelectorAll('.card-title')
        inputLabel[0].innerText = "Cipher text:"
        inputLabel[1].innerText = "Plain Text:"
    }
    outputField.innerText = output
}

