const loginForm = document.querySelector('.login-form')
const usernameInput = document.querySelector('.username')
const passwordInput = document.querySelector('.password')

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const username = usernameInput.value
    const password = passwordInput.value

    if(!username || !password) {
        alert('Please provide username and password')
    }
    
    try {
        const {data} = await axios.post('/login', {username, password})
        if(data) {
            localStorage.setItem('token', data.token)
            window.location.replace('/dashboard')
        }
    } catch (err) {
        console.log(err)
    }
})