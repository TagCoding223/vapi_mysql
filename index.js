const express = require('express');
const connectDB = require('./connect')
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const path = require('path');
const app = express()
const port = process.env.SERVER_PORT


app.use(cors({
    origin: '*'
}))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/static'));

// Create a connection with mysql database
const con = connectDB();

// Check database connection
con.connect((err) => {
    if (err){
        console.log(err);
    }else{   
        console.log("Conneted to the database!");
    }
})

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'))
})

app.get('/news', (req, res) => {
    // res.send("all news are here")
    // console.log(req);
    // get data from database and render it on page
    con.query('SELECT * FROM news', (err, result) => {
        if (err) throw err;
        console.log(result);
        // console.log(result.length);
        // console.log(result[0]);
        // console.log(result[0].name);
        res.json(result)
        // res.send(`name : ${see.name} , email : ${see.email} and ${result}`)
    })
})

app.get('/news/:id', (req, res) => {
    const reqId = req.params.id;
    // console.log(req);
    // console.log(req.params);
    // res.send("get news with id : "+reqId)
    con.query('SELECT * FROM news WHERE news_id=?', [reqId], (err, result) => {
        if (err) throw err
        console.log(result.length);
        res.json(result)
    })
})

app.post('/news', (req, res) => {
    console.log(req.body);
    const sql = `INSERT INTO news (title,news_link,image_link,news_host,posted_in) VALUES ('${req.body.title}','${req.body.news_link}','${req.body.image_link}','${req.body.news_host}','${new Date()}')`;
    con.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send("Given News Created Successfully....")
    })
    // res.json("Post request reseived")

})

app.put('/news', (req, res) => {
    if (req.body.id < 6) {
        res.json()
    } else {
        const sql = `UPDATE news SET title='${req.body.title}',news_link='${req.body.news_link}',image_link='${req.body.image_link}',news_host='${req.body.news_host}',posted_in='${new Date()}' WHERE news_id=${req.body.id}`;
        con.query(sql, (err, result) => {
            if (err) throw err;
            console.log('update ', +result);
            const rsql = `SELECT * FROM news WHERE news_id=${req.body.id}`;
            con.query(rsql, (err, result) => {
                if (err) throw err;
                console.log('return update ', +result);
                res.json(result)
            })
        })
    }
    // res.send(`Update news ${reqId}`)
})

app.delete('/news', (req, res) => {
    if (req.body.id < 6) {
        res.json()
    } else {
        const sql = `DELETE FROM news WHERE news_id=${req.body.id}`;
        con.query(sql, (err, result) => {
            if (err) throw err;
            console.log('News successfully deleted....');
            res.send('News successfully deleted....')
        })
    }
})
app.listen(port, () => {
    console.log(`Server currently run on http://localhost:${port}`);
})
