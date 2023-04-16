const searchBtn = document.querySelector('#searchBtn')

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
    const { data } = await axios.post('/dashboard/post-inputs', { action, btnId, editParams })
    if (data) {
        alert(data)
        searchBtn.click()
    }
}

// Showing to_adopt db items on front end
searchBtn.addEventListener('click', async () => {
    let DOMinputs = document.querySelectorAll('.search-input')
    let inputs = []
    for(let i = 0; i < DOMinputs.length; i++) {
        inputs.push(DOMinputs[i].value)
    }

    const db = 'adopted'
    await axios.post('/dashboard/post-inputs', { inputs, db })

    const main = document.querySelector('.main')
    main.innerHTML = ''
    const { data } = await axios.get('/dashboard/adopted/search').catch((err) => {
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
                searchBtn.click()
            }
        })

        // Adding admin button adopted
        let btnAdopted = document.createElement('button')
        btnAdopted.className = "btnAdopted"
        btnAdopted.innerHTML = "Adopted"
        btnAdopted.addEventListener('click', async (e) => {
            e.preventDefault()
            await handlePet('adopted', btnAdopted.parentNode.id.split(' ')[2])
            searchBtn.click()
        })

        // Appending divs
        main.appendChild(divWrap)
        divWrap.appendChild(div)
        divWrap.appendChild(btnEdit)
        divWrap.appendChild(btnAdopted)
        divWrap.appendChild(btnDelete)
    }
})

// First load of pets from DB
window.addEventListener('load', () => {
    searchBtn.click()
    const loadingDiv = document.querySelector('#loading')
    loadingDiv.style.display = "none"
})

