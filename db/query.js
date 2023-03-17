function generateQuery(type, size, breed) {
    let query = 'SELECT * FROM adopt' //"dog"
    if(type != 'any') query += ` WHERE type = "${type}"`
    if(size != 'any') {
        if(type != 'any') query += ` AND size = "${size}"`
        else query += ` WHERE size = "${size}"`
    }
    if(breed != 'any') {
        if(type != 'any' || size != 'any') query += ` AND breed = "${breed}"`
        else query += ` WHERE breed = "${breed}"`
    }
    query += ';'
    console.log(query)
    return query
}

module.exports = {generateQuery}