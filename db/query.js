function generateQuery(params, sorting) {
    let type = params[0]
    let size = params[1] 
    let breed = params[2] 
    if(!type) type = 'any'
    if(!size) size = 'any'
    if(!breed) breed = 'any'
    let query = 'SELECT * FROM to_adopt'
    if(type != 'any') query += ` WHERE type = "${type}"`
    if(size != 'any') {
        if(type != 'any') query += ` AND size = "${size}"`
        else query += ` WHERE size = "${size}"`
    }
    if(breed != 'any') {
        if(type != 'any' || size != 'any') query += ` AND breed = "${breed}"`
        else query += ` WHERE breed = "${breed}"`
    }
    if(sorting == 'long') query += ' ORDER BY here_since_date'
    query += ';'
    lastQeury = query
    console.log(sorting, query)
    return query
}

module.exports = {generateQuery}