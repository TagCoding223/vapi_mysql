const mysql = require('mysql');


const connectDB = () => {
    // return mysql.createConnection({
    //     host: 'localhost',
    //     user: 'root',
    //     password: '',
    //     database: 'news_api_db'
    // })

    return mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        port:3306
    })
}

module.exports = connectDB
