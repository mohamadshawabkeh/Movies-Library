'use strict';
require("dotenv").config();
const express = require("express");
const moviesData = require('./moviedata/data.json');
const app = express ();
const port = process.env.PORT;
const cors = require('cors');
const axios = require ("axios");
const pg = require("pg");
const client = new pg.Client(process.env.DATABASE_URL);
app.use(cors());
app.use(express.json())
const Key = process.env.API_KEY;

function Movies(id, title, posterPath, overview) {
    this.id = id;
    this.title = title;
    this.posterPath = posterPath;
    this.overview = overview;
}

function Trending(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}
function TopRated( title, release_date, poster_path, overview, popularity ,vote_average,vote_count) {
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
    this.popularity = popularity;
    this.vote_average =vote_average;
    this.vote_count = vote_count;
}
function UpComing(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}


// Routes
app.get('/trending',handelTrending);
app.get('/search',handelSearch);
app.get('/topRated',handelTopRated);
app.get('/upcoming',handelUpComing);
app.get('/getmovies', getMoviesHandler);
app.post('/getmovies', addMoviesHandler);






// handlers
function addMoviesHandler (req,res){
    const moviesToAdd=req.body;
    // console.log(moviesToAdd);
    const sql= `INSERT into getmovies(title,posterPath,overveiw) values (
        $1,$2,$3) RETURNING *; `;
        const values = [moviesToAdd.title, moviesToAdd.posterPath, moviesToAdd.overview];
        client.query(sql,values).then((data)=>{
            res.status(201).send(data.rows);
            // res.send('add successfully');
        });
};



function getMoviesHandler(req,res){
    const sql = 'select * from getmovies;';
    client.query(sql)
        .then((data)=>{
            // res.send(data.rows);
            let getmoviesDB= data.rows.map((item)=>{
                let singleMovie = new Movies(
                    item.id,
                    item.title,
                    item.posterpath,
                    item.overveiw
                )
                return singleMovie;
            });
            res.send(getmoviesDB);
        });
};


async function handelTrending (req,res){
     const trendURL=`https://api.themoviedb.org/3/trending/all/week?api_key=${Key}`;
     let trendfromAPI = await axios.get(trendURL);
     let trendMovies = trendfromAPI.data.results.map((item)=>{
        return new Trending(item.id, item.title, item.release_date, item.poster_path, item.overview)
     });
     res.send(trendMovies);
};

async function handelSearch (req,res){
    let searchByName = req.query.query;
    console.log(searchByName);
    const searchURL=`https://api.themoviedb.org/3/search/movie?api_key=${Key}&language=en-US&page=1&query=${searchByName}`;

    axios.get(searchURL).then ((result)=>{

        res.send(result.data);
    });
    
};
async function handelTopRated (req,res){
    const topRatedURL=`https://api.themoviedb.org/3/movie/top_rated?api_key=${Key}&language=en-US&page=1`;
    let topfromAPI = await axios.get(topRatedURL);
    let topMovies = topfromAPI.data.results.map((item)=>{
       return new TopRated(item.title, item.release_date, item.poster_path, item.overview,item.popularity,item.vote_average,item.vote_count)
    });
    res.send(topMovies);
};

async function handelUpComing (req,res){
    const UpComingURL=`https://api.themoviedb.org/3/movie/upcoming?api_key=${Key}&language=en-US&page=1`;
    let upComingfromAPI = await axios.get(UpComingURL);
    let upComingMovies = upComingfromAPI.data.results.map((item)=>{
       return new UpComing (item.id, item.title, item.release_date, item.poster_path, item.overview)
    });
    res.send(upComingMovies);
};


// const movie = new Movies ( 
//     "Spider-Man: No Way Home",
//     "/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg",
//     "Peter Parker is unmasked and no longer able to separate his normal life from the high-stakes of being a super-hero. When he asks for help from Doctor Strange the stakes become even more dangerous, forcing him to discover what it truly means to be Spider-Man."
//     );
    
    
app.get('/',(req,res)=>{
    let result = [];
    moviesData.data.forEach((element)=>{
    result.push(new Movies(element.title,element.posterPath,element.overview));
  });
     res.send(result);
});

app.get('/favorite',(req,res)=>{
    res.send('Welcome to Favorite Page');
});


app.use(notFoundHandler);

function notFoundHandler(req,res) {
    res.status(404).send('page not found error');
};

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Sorry, something went wrong');
  });


  client.connect().then(()=>{
      app.listen(port,()=>{
          console.log(`server is listing on port ${port}`);
      });
  });



