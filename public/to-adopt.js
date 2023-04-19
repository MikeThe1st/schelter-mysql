const searchBtn = document.querySelector('#searchBtn')
const insertBtn = document.querySelector('#insertBtn')

let sort = "short"

function sortChange(value) {
    sort = value
    searchBtn.click()
}

async function handlePet(action, btnId) {
    const data = await axios.post('/dashboard/post-inputs', { action, btnId })
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
    const db ='to_adopt'
    const data = await axios.put('/dashboard/edit-pet', { action, db, editParams, btnId })
    if (data) {
        console.log(data)
        document.querySelector('#edit-cancelBtn').click()
        searchBtn.click()
    }
}

async function handleInputs() {
    let DOMinputs = document.querySelectorAll('.search-input')
    let inputs = []
    for (let i = 0; i < DOMinputs.length; i++) {
        inputs.push(DOMinputs[i].value)
    }
    const db = 'to_adopt'
    action = 'post'
    let temp = await axios.post('/dashboard/post-inputs', { inputs, db, action })
    return temp
}

function handleDescription(data, i) {
    let petText = document.createElement('div')
    petText.classList.add('pet-text')
    petText.innerHTML = `Id:${data[i].id} Type:${data[i].type} Size:${data[i].size} Breed:${data[i].breed}`
    return petText
}

function editBtn() {
    let btnEdit = document.createElement('button')
    btnEdit.className = "btnEdit"
    btnEdit.innerHTML = "Edit"
    btnEdit.addEventListener('click', async (e) => {
        e.preventDefault()
        const btnId = btnEdit.parentNode.id.split(' ')[2]
        document.querySelector('#form-title').innerHTML = `Pet id:${btnId}`
        document.querySelector('.edit-container').style.visibility = 'visible'
        document.querySelector('#edit-submitBtn').onclick = async (e) => {
            e.preventDefault()
            await editPet(btnId)
        }

        document.querySelector('#edit-cancelBtn').onclick = (e) => {
            e.preventDefault()
            document.querySelector('.edit-container').style.visibility = 'hidden'
        }
    })
    return btnEdit
}

function adoptBtn() {
    let btnAdopted = document.createElement('button')
    btnAdopted.className = "btnAdopted"
    btnAdopted.innerHTML = "Adopted"
    btnAdopted.addEventListener('click', async (e) => {
        e.preventDefault()
        await handlePet('adopted', btnAdopted.parentNode.id.split(' ')[2])
        searchBtn.click()
    })
    return btnAdopted
}

function deleteBtn() {
    let btnDelete = document.createElement('button')
    btnDelete.className = "btnDelete"
    btnDelete.innerHTML = "Delete"
    btnDelete.addEventListener('click', async (e) => {
        e.preventDefault()
        const btnId = btnDelete.parentNode.id.split(' ')[2]
        let confiramtion = `Are you sure about deleting pet with id:${btnId}?`
        if (confirm(confiramtion)) {
            console.log('about to delete')
            // const test = await handlePet('delete', btnId)
            const action = 'delete'
            const db = 'to_adopt'
            // !!! DELETE NOT FOUND - 404, temp solution with post, in this case searchBtn click is not executed = you need to reload yourself
            const test = await axios.post('/dashboard/to-adopt', { action, db, btnId })
            console.log(test)
            searchBtn.click()
        }
    })
    return btnDelete
}

// Showing to_adopt db items on front end
searchBtn.addEventListener('click', async () => {
    await handleInputs()

    const main = document.querySelector('.main')
    main.innerHTML = ''
    const { data } = await axios.get('/dashboard/to-adopt/search').catch((err) => {
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
        let petDescription = handleDescription(formatedData, i)

        // Adding admin button edit
        let btnEdit = editBtn()
        
        // Adding admin button adopted
        let btnAdopted = adoptBtn()
        
        // Adding admin button delete
        let btnDelete = deleteBtn()

        // Appending divs
        main.appendChild(divWrap)
        divWrap.appendChild(petDescription)
        divWrap.appendChild(btnEdit)
        divWrap.appendChild(btnAdopted)
        divWrap.appendChild(btnDelete)
    }
})

insertBtn.addEventListener('click', async () => {
    let insertParams = []
    let inputs = document.querySelectorAll('.search-input')
    for (let i = 0; i < 4; i++) {
        if (!inputs[i].value) return alert('Please provide all data to add pet.')
        insertParams.push(inputs[i].value)
    }
    const { data } = await axios.post('/dashboard/insert-pet', { insertParams })
    alert(data)
    let DOMinputs = document.querySelectorAll('.search-input')
    for (let i = 0; i < DOMinputs.length; i++) {
        DOMinputs[i].value = ''
    }
    searchBtn.click()
})

// First load of pets from DB
window.addEventListener('load', () => {
    searchBtn.click()
    const loadingDiv = document.querySelector('#loading')
    loadingDiv.style.display = "none"
})

