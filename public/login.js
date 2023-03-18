const loginForm = document.querySelector('.login-form')
const usernameInput = document.querySelector('.username')
const passwordInput = document.querySelector('.password')

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const username = usernameInput.value
    const password = passwordInput.value

    try {
        const {data} = await axios.post('/login', {username, password})
        console.log(data)
    } catch (err) {
        console.log(err.message)
    }
})