require("dotenv").config();
require("./config/connection");
const express = require("express");
const morgan = require("morgan");
const productRoutes = require("./routes/productRoutes")

const app = express();
const PORT =process.env.PORT;

app.use(morgan('dev'));
app.use(express.json());

app.use('/api/products',productRoutes);





app.listen(PORT, ()=> {
    console.log(`Server is connected at http://localhost:${PORT}`);
});