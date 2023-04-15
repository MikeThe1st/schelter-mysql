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
        div.innerHTML = `Id:${formatedData[i].id} Type:${formatedData[i].type} Size:${formatedData[i].size} Breed:${formatedData[i].breed}`

        // Adding admin buttons (edit, adopted and delete)
        let btnEdit = document.createElement('button')
        btnEdit.className = "btnEdit"
        btnEdit.innerHTML = "Edit"
        btnEdit.addEventListener('click', async (e) => {
            e.preventDefault()
            // await handlePet('edit', btnEdit.parentNode.id.split(' ')[2])
            let type = prompt('Enter new type or leave empty if you do not want to change it')
            let size = prompt('Enter new size or leave empty if you do not want to change it')
            let breed = prompt('Enter new breed or leave empty if you do not want to change it')
            let date = prompt('Enter new date or leave empty if you do not want to change it')
            reloadBtn.click()
        })

        let btnDelete = document.createElement('button')
        btnDelete.className = "btnDelete"
        btnDelete.innerHTML = "Delete"
        btnDelete.addEventListener('click', async (e) => {
            e.preventDefault()
            await handlePet('delete', btnDelete.parentNode.id.split(' ')[2])
            reloadBtn.click()
        })

        let btnAdopted = document.createElement('button')
        btnAdopted.className = "btnAdopted"
        btnAdopted.innerHTML = "Adopted"
        btnAdopted.addEventListener('click', async (e) => {
            e.preventDefault()
            await handlePet('adopted', btnAdopted.parentNode.id.split(' ')[2])
            reloadBtn.click()
        })

        // Appending divs
        main.appendChild(divWrap)
        divWrap.appendChild(div)
        divWrap.appendChild(btnEdit)
        divWrap.appendChild(btnAdopted)
        divWrap.appendChild(btnDelete)
    }
})

async function handlePet(action, btnId) {
    const data = await axios.post('/dashboard/to-adopt', {action, btnId})
    console.log(data)
    return data
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

