const searchBtn = document.querySelector('#searchBtn')

let params = ['any', 'any', 'any']
let sort = "short"

// Function that handles search filters
function handleSearchChange(labelClass, changedElem) {
    // Cropping 'search-' and getting param of search
    let labelType = labelClass.split('-')[1]
    switch (labelType) {
        case 'type':
            params[0] = changedElem.value
            break
        case 'size':
            params[1] = changedElem.value
            break
        case 'breed':
            params[2] = changedElem.value
            break
    }
}

function sortChange(value) {
    sort = value
}

// Search functionallity
searchBtn.addEventListener('click', async () => {
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
        type: elem.type,
        size: elem.size,
        breed: elem.breed,
        here_since_date: elem.here_since_date
        // TODO: add time to here_since_date column
        // Converting dates from ISO 8601 to strings
        //new Date(elem.here_since_date).toLocaleDateString('en-US', {year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true})
    }))
    console.log(formatedData)
    for (let i = 0; i < formatedData.length; i++) {
        const divWrap = document.createElement('div')
        divWrap.classList.add('pet-cart')

        // Adding images
        const animalPhoto = document.createElement('img')
        animalPhoto.src = `./jpg/${formatedData[i].type}.jpg`
        animalPhoto.classList.add('pet-photo')
        animalPhoto.alt = `Photo of ${formatedData[i].type}}`

        // Adding descriptions
        let div = document.createElement('div')
        div.classList.add('pet-text')
        div.innerHTML = `Type:${formatedData[i].type} Size:${formatedData[i].size} Breed:${formatedData[i].breed}`

        // Appending divs
        main.appendChild(divWrap)
        divWrap.appendChild(animalPhoto)
        divWrap.appendChild(div)
    }
})

// First load of pets from DB
window.addEventListener('load', () => {
    searchBtn.click()
    const loadingDiv = document.querySelector('#loading')
    loadingDiv.style.display = "none"
})

