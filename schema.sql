DROP TABLE IF EXISTS getmovies;
CREATE TABLE IF NOT EXISTS getmovies(
id SERIAL PRIMARY KEY,
title varchar(255),
posterPath varchar(255),
overview varchar(255)
);
