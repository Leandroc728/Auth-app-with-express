let passwordField = document.querySelector('#password')
let confPassword = document.querySelector('#confPassword')
let formText = document.querySelector('#form-text')
let subBtn = document.querySelector('#submit')
let message = document.querySelector('#form-message')
let usernameField = document.querySelector('#username')
let usernameLabel = document.querySelector('#username-label')

// Fields validations

let checkIfFields = () => {
    if(confPassword.value != passwordField.value) {
        formText.textContent = 'The passwords must be equal'
        subBtn.disabled = true
    } else if(confPassword.value === '' || passwordField.value === '' ) {
        subBtn.disabled = true
        formText.textContent = 'Please insert a password'
    } else {
        formText.textContent = ''
        subBtn.disabled = false
    }
}

passwordField.addEventListener('input', () => {
    checkIfFields()
})

confPassword.addEventListener('input', () => {
    checkIfFields()
})


window.onload = () => {
    checkIfFields()
}