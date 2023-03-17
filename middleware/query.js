
// const {handleChange} = require('../public/front')

// Returns items from DB
const handleQuery = async (connect, query, params) => {
    try {
        const [pets, fields] = await connect.execute(query, params)
    
        // let petsHtml = ''
        // const petCarts = pets.map((pet) => {
        //     return `<div class="pet-cart"><h2>${pet.name}</h2><p>${pet.description}</p></div>`
        // })
        // const html = petCarts.join('')
        
        // console.log(pets)
        // res.send(html)

    } catch (error) {
        console.log(error)
    }
}

module.exports = {handleQuery}