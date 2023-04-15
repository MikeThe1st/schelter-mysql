const reloadBtn = document.querySelector('#reloadBtn')
const insertBtn = document.querySelector('#insertBtn')

let sort = "short"

function sortChange(value) {
    sort = value
    reloadBtn.click()
}

async function handlePet(action, btnId) {
    const data = await axios.post('/dashboard/to-adopt', { action, btnId })
    console.log(data)
    return data
}

async function editPet(btnId) {
    // Creating array with values that user want to change
    let editParams = []
    for (let i = 0; i < 5; i++) {
        editParams.push(document.querySelectorAll('.edit-input')[i].value)
    }
    const action = 'edit'
    const { data } = await axios.post('/dashboard/to-adopt', { action, btnId, editParams })
    if (data) {
        alert(data)
        reloadBtn.click()
    }
}

// Showing to_adopt db items on front end
reloadBtn.addEventListener('click', async () => {
    await axios.post('/post-params', {
        param1: document.querySelectorAll('.search-input')[1].value,
        param2: document.querySelectorAll('.search-input')[2].value,
        param3: document.querySelectorAll('.search-input')[3].value,
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

        // Adding admin button edit
        let btnEdit = document.createElement('button')
        btnEdit.className = "btnEdit"
        btnEdit.innerHTML = "Edit"
        btnEdit.addEventListener('click', async (e) => {
            e.preventDefault()
            const buttonId = btnEdit.parentNode.id.split(' ')[2]
            document.querySelector('#form-title').innerHTML = `Pet id:${btnId}`
            document.querySelector('.edit-container').style.visibility = 'visible'
            document.querySelector('#edit-submitBtn').onclick = async (e) => {
                e.preventDefault()
                await editPet(buttonId)
            }

            document.querySelector('#edit-cancelBtn').onclick = (e) => {
                e.preventDefault()
                document.querySelector('.edit-container').style.visibility = 'hidden'
            }
        })

        // Adding admin button delete
        let btnDelete = document.createElement('button')
        btnDelete.className = "btnDelete"
        btnDelete.innerHTML = "Delete"
        btnDelete.addEventListener('click', async (e) => {
            e.preventDefault()
            const btnId = btnDelete.parentNode.id.split(' ')[2]
            let confiramtion = `Are you sure about deleting pet with id:${btnId}?`
            if (confirm(confiramtion)) {
                await handlePet('delete', btnId)
                reloadBtn.click()
            }
        })

        // Adding admin button adopted
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

insertBtn.addEventListener('click', async () => {
    let insertParams = []
    for (let i = 0; i < 4; i++) {
        insertParams.push(document.querySelectorAll('.search-input')[i].value)
    }
    const { data } = await axios.post('/dashboard/insert-pet', { insertParams })
    alert(data)
    reloadBtn.click()
})

// First load of pets from DB
window.addEventListener('load', () => {
    reloadBtn.click()
    const loadingDiv = document.querySelector('#loading')
    loadingDiv.style.display = "none"
})

