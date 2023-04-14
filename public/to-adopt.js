const reloadBtn = document.querySelector('#reloadBtn')

let params = ['any', 'any', 'any']
let sort = "short"

function sortChange(value) {
    sort = value
    reloadBtn.click()
}

// Showing to-adopt db items on front end
reloadBtn.addEventListener('click', async () => {
    await axios.post('/post-params', {
        param1: params[0],
        param2: params[1],
        param3: params[2],
        sorting: sort
    }).catch((err) => {
        console.log(err)
    })

    const main = document.querySelector('.main')
    main.innerHTML = ''
    const { data } = await axios.get('/adopt').catch((err) => {
        console.log(err)
    })

    const formatedData = data.map(elem => ({
        id: elem.id,
        type: elem.type,
        size: elem.size,
        breed: elem.breed,
        here_since_date: elem.here_since_date
    }))
    console.log(formatedData)
    for (let i = 0; i < formatedData.length; i++) {
        const divWrap = document.createElement('div')
        divWrap.classList.add('pet-cart')
        divWrap.setAttribute('id', `Pet Cart ${formatedData[i].id}`)

        // Adding descriptions
        let div = document.createElement('div')
        div.classList.add('pet-text')
        div.innerHTML = `ID:${formatedData[i].id} Type:${formatedData[i].type} Size:${formatedData[i].size} Breed:${formatedData[i].breed}`

        // Adding admin buttons (delete and edit)
        let btnEdit = document.createElement('button')
        btnEdit.className = "btnEdit"
        btnEdit.innerHTML = "Edit"
        btnEdit.addEventListener('click', (e) => {
            e.preventDefault()
            alert("Edit")
        })
        let btnDelete = document.createElement('button')
        btnDelete.className = "btnDelete"
        btnDelete.innerHTML = "Delete"
        btnDelete.addEventListener('click', async (e) => {
            e.preventDefault()
            let btnId = btnDelete.parentNode.id.split(' ')[2]
            let action = 'delete'
            await axios.post('/dashboard/to-adopt', {action, btnId})
            console.log(`Deleted pet with id: ${btnId}`)
        })

        // Appending divs
        main.appendChild(divWrap)
        divWrap.appendChild(div)
        divWrap.appendChild(btnEdit)
        divWrap.appendChild(btnDelete)
    }
})

function deletePet() {
    // Delete pet from DB
}

function editPet() {
    // Edit pet data
}

// First load of pets from DB
window.addEventListener('load', () => {
    reloadBtn.click()
    const loadingDiv = document.querySelector('#loading')
    loadingDiv.style.display = "none"
})

