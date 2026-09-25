const mongoose = require("mongoose");
const DB_URI = process.env.MONGO_URI;

mongoose.connect(DB_URI);

const db = mongoose.connection;

db.on('open' , () => {
    console.log(`Connected to MongoDB database: ${mongoose.connection.name}`);
});


db.on('error' , (error) =>{
    console.log(`${error.message} MongoDB connection error.`);
});

db.on( 'close' , () =>  {
    console.log('Connection to MongoDB has closed.');
});

