const origin = window.location.origin
class AccountHandler {
    constructor(){
        this.loginSwitch = document.getElementById('login-switch')
        this.signupSwitch = document.getElementById('signup-switch')
        this.loginSection = document.getElementById('login-section')
        this.signupSection = document.getElementById('signup-section')
        this.signupMark = this.loginSection.querySelector('mark')
        this.loginMark = this.signupSection.querySelector('mark')
        this.loginButton = this.loginSection.querySelector('button')
        this.signupButton = this.signupSection.querySelector('button')
        this.loginUsername = document.getElementById('login-username')
        this.loginPassword = document.getElementById('login-password')
        this.errorMessage = document.getElementById('error-message')
        this.signupUsername = document.getElementById('signup-username')
        this.signupPassword = document.getElementById('signup-password')
        this.confirmPassword = document.getElementById('confirm-password')
        this.middlename = document.getElementById('middlename')
        this.loginMiddlename = document.getElementById('login-middlename')
        this.newPassword = document.getElementById('new-password')
        this.confirmNewPassword = document.getElementById('confirm-new-password')
        this.resetPasswordButton = document.getElementById('reset-password')
        this.forgotUsername = document.getElementById('forgot-username')

        this.loginSwitch.addEventListener('click', ()=> this.switchSection(this.signupSwitch,this.signupSection,this.loginSwitch,this.loginSection))
        this.loginMark.addEventListener('click', ()=> this.switchSection(this.signupSwitch,this.signupSection,this.loginSwitch,this.loginSection))
        this.signupSwitch.addEventListener('click', ()=> this.switchSection(this.loginSwitch,this.loginSection,this.signupSwitch,this.signupSection))
        this.signupMark.addEventListener('click', ()=> this.switchSection(this.loginSwitch,this.loginSection,this.signupSwitch,this.signupSection))

        this.loginButton.addEventListener('click',()=>this.login(this.loginUsername.value,this.loginPassword.value))
        this.signupButton.addEventListener('click',()=>{
            if(this.signupPassword.length < 7){this.displayError('Password too short')}
            else if(this.signupPassword.value !== this.confirmPassword.value) {this.displayError('Passwords do not match')}
            else if(this.signupUsername.value.length > 20) {this.displayError('Username too long')}
            else if(!this.signupUsername.value.match('^[a-zA-Z0-9]+$')) {this.displayError('Only alphanumeric chars allowed')}
            else if (!this.middlename.value) {this.displayError('Enter a middle name')}
            else {this.signup(this.signupUsername.value,this.signupPassword.value,this.middlename.value)}
        })

        this.resetPasswordButton.addEventListener('click',()=>{
            if(this.newPassword.value.length < 7){this.displayError('Password too short')}
            else if(this.newPassword.value !== this.confirmNewPassword.value) {this.displayError('Passwords do not match')}
            else if (!this.loginMiddlename.value){this.displayError('Enter your middle name')}
            else if (!this.forgotUsername.value){this.displayError('Enter your username')}
            else {this.resetPassword(this.forgotUsername.value,this.loginMiddlename.value,this.newPassword.value)}
        })
    }
    switchSection(currentSwitch,currentSection,nextSwitch,nextSection){
        nextSwitch.style.backgroundColor = '#0d47a1'
        nextSwitch.style.color = 'white'
        currentSwitch.style.backgroundColor = 'initial'
        currentSwitch.style.color = 'initial'
        currentSection.style.display = 'none'
        nextSection.style.display = 'flex'
    }
    async login(username,password){
        const result = await fetch(`https://healthhub-server.glitch.me/login?username=${username}&password=${password}`).then(res=>res.json()).catch(err=>err)

        if(result.error){
            this.displayError(result.error)
        } else {
            const account = result.result[0]
            localStorage.setItem('username', account.username)
            localStorage.setItem('hex', account.hex)
            localStorage.setItem('role', account.role)
            window.location = `${origin}/html/account.html`
        }
    }
    async signup(username,password,middlename){
        const data = {
            username,
            password,
            middlename,
            hex: Math.floor(Math.random() * 1000000)
        }
        const options = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        }
        const result = await fetch(`https://healthhub-server.glitch.me/signUp`,options).then(res=>res.json()).catch(err=>err)
        if(result.error){
            this.displayError(result.error)
        } else {
            localStorage.setItem('username', data.username)
            localStorage.setItem('hex', data.hex)
            window.location = `${origin}/html/account.html`
        }
    }
    async resetPassword(username,middlename,password){
        const data = {
            username,
            password,
            middlename,
        }
        const options = {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        }
        const result = await fetch(`https://healthhub-server.glitch.me/resetPassword`,options).then(res=>res.json()).catch(err=>err)
        if(result.error){
            this.displayError(result.error)
        } else {
            this.displayError(result.result)
        }
    }
    displayError(error){this.errorMessage.textContent = error}
}
const accounthandler = new AccountHandler
