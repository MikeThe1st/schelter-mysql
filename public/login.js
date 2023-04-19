const loginForm = document.querySelector('.login-form')
const usernameInput = document.querySelector('.username')
const passwordInput = document.querySelector('.password')

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const username = usernameInput.value
    const password = passwordInput.value

    if (!username || !password) {
        alert('Please provide username and password')
    }
    await axios.post('/login', { username, password })
        .then(response => {
            if (response.status === 200) {
                window.location.replace('/dashboard')
            }
        })
        .catch(err => {
            console.log(err.response.status)
            alert('Not authorized. Please provide valid username and password')
        })
})