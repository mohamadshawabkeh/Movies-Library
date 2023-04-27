'use strict';
const express = require("express");
const moviesData = require('./moviedata/data.json')
const app = express ();
const port = 3001;
const cors = require('cors');
app.use(cors());

function Movies(title, posterPath, overview) {
    this.title = title;
    this.posterPath = posterPath;
    this.overview = overview;
}
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

app.listen(port,()=>{
    console.log(`server is listing on port ${port}`)
});


