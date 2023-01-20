const express = require('express');
var app = express();
var HTTP_PORT = process.env.PORT || 8080;
require('dotenv').config();

const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();
const cors = require('cors');
app.use(express.json());

app.get('/',(req,res)=>{
    res.status(200).json({"message": "API Listening"});
});

app.get('/api/movies',(req,res)=>{
    if(req.query.page && req.query.perPage){
        db.getAllMovies(req.query.page, req.query.perPage, req.query.title).then((data)=>{
            res.status(200).json(data);
        }).catch((err)=>{
            res.status(500).send(err);
        });
    }else{
        res.status(400).send("Please check the URL and try again");
    }
});

app.get('/api/movies/:id',(req,res)=>{
    db.getMovieById(req.params.id).then((data)=>{
        res.status(200).json(data);
    }).catch((err)=>{
        res.status(500).send(err);
    });
});

app.put('/api/movies/:id',(req,res)=>{
    db.updateMovieById(req.body, req.params.id).then((data)=>{
        res.status(201).json(data);
    }).catch((err)=>{
        res.status(500).send(err);
    });
});

app.post('/api/movies',(req,res)=>{
    db.addNewMovie(req.body).then((data)=>{
        res.status(201).json(data);
    }).catch((err)=>{
        res.status(500).send(err);
    })
});

app.delete('/api/movies/:id',(req,res)=>{
    db.deleteMovieById(req.params.id).then(()=>{
        res.status(200).send("success");
    }).catch(()=>{
        res.status(500).send("fail");
    })
});

app.use((req,res)=>{
    res.status(404).send('Wrong URL, please try again.')
});

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});