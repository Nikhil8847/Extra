const mongoose = require('mongoose')

const connect = (connectionString) => {
    return mongoose.connect(connectionString);
}

module.exports = connect