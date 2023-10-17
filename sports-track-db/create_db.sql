DROP TABLE IF EXISTS Data;
DROP TABLE IF EXISTS Activity;
DROP TABLE IF EXISTS User;

CREATE TABLE User (
    idUser INTEGER PRIMARY KEY AUTOINCREMENT, 
    email TEXT NOT NULL UNIQUE CHECK (email LIKE '%@%.%'),
    firstName TEXT NOT NULL,
    lastName TEXT NOT NULL,
    sexe TEXT NOT NULL CHECK (sexe IN ('homme', 'femme', 'autre')),
    height REAL NOT NULL CHECK (height > 0),
    weight REAL NOT NULL CHECK (weight > 0),
    age INTEGER NOT NULL CHECK (age >= 0),
    birthdate TEXT NOT NULL CHECK (LENGTH(birthdate) = 10 AND substr(birthdate,3,1) = '/' AND substr(birthdate,6,1) = '/'),
    pswd TEXT NOT NULL CHECK (LENGTH(pswd) >= 8)
);

CREATE TABLE Activity (
    idActivity INTEGER PRIMARY KEY AUTOINCREMENT,
    desc TEXT,
    date TEXT NOT NULL CHECK (LENGTH(date) = 10 AND substr(date,3,1) = '/' AND substr(date,6,1) = '/'),
    theUser INTEGER NOT NULL REFERENCES User(idUser) ON DELETE CASCADE
);

CREATE TABLE Data (
    idData INTEGER PRIMARY KEY AUTOINCREMENT,
    time TEXT NOT NULL CHECK (LENGTH(time) = 8 AND substr(time,3,1) = ':' AND substr(time,6,1) = ':'),
    cardioFrequency INTEGER CHECK (cardioFrequency >= 0),
    latitude REAL,
    longitude REAL,
    altitude REAL,
    theActivity INTEGER NOT NULL REFERENCES Activity(idActivity) ON DELETE CASCADE
);
