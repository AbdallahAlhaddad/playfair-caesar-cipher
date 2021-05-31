
const alphabetic='ABCDEFGHIJKLMNOPQRSTUVWXYZ'

const form = document.forms[0];
const operationRadios = form.elements['operation'] //returns nodeRadioList
const inputField = document.getElementById('input')
const outputField = document.getElementById('output')
const offsetField = document.getElementById('offset')

inputField.addEventListener('input',runChosenOperation)
offsetField.addEventListener('change',runChosenOperation)
for (const radio of operationRadios) radio.addEventListener("change",runChosenOperation)


function encrypt(plaintext, offset) {
  plaintext = plaintext.replace(/\s/g, "")// remove spaces
  plaintext = plaintext.toUpperCase(); // put all letters to uppercase
  let ciphertext="";

  for (const letter of plaintext) {
    const letterNumber =alphabetic.indexOf(letter)

    if(letterNumber===-1) {
      ciphertext+=letter // not an alphabetical letter (add it to string without any modification)
      continue; //skip this iteration
    }

    ciphertext += alphabetic[(letterNumber + offset) % alphabetic.length]
  }
  return ciphertext;
}

function decrypt(ciphertext,offset){
  ciphertext = ciphertext.toUpperCase(); 
  let plaintext="";

  for (const letter of ciphertext) {
    const letterNumber = alphabetic.indexOf(letter)
    
    if(letterNumber===-1) {
      plaintext+=letter // not an alphabetical letter (add it to string without any modification)
      continue; //skip this iteration
    }

    let newLetter = (letterNumber - offset) % alphabetic.length
    if(newLetter < 0) newLetter += alphabetic.length
    plaintext += alphabetic[newLetter]
  }
  return plaintext;
}

function runChosenOperation(){
  const offset = parseInt(offsetField.value)
  const input = inputField.value
  const operation = operationRadios.value
  
  let output
  
  if(output = operation==="encrypt"){
      output=encrypt(input,offset)
      const inputLabel = document.querySelectorAll('.card-title')
      inputLabel[0].innerText = "Plain text:"
      inputLabel[1].innerText = "Cipher Text:"
  
  }
  else{
      output=decrypt(input,offset)
      const inputLabel = document.querySelectorAll('.card-title')
      inputLabel[0].innerText = "Cipher text:"
      inputLabel[1].innerText = "Plain Text:"
  }
  outputField.innerText = output
}
  
  