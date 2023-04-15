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
                let editParams = []
                // Creating array with values that user want to change
                for(let i = 0; i < 5; i++) {
                    editParams.push(document.querySelectorAll('.edit-input')[i].value)
                }
                const action = 'edit'
                const { data } = await axios.post('/dashboard/to-adopt', {action, btnId, editParams})
                if(data) {
                    alert(data)
                    reloadBtn.click()
                }
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
            if(confirm(confiramtion)) {
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

