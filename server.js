import express from "express";
import UsController from "./controllers/UsController.js";
import bodyParser from "body-parser";

const app = express();
const PORT = 5000 || process.env.PORT;


app.use(bodyParser.json());

// http://localhost:5000/
app.get('/', UsController.scrapData);


// http://localhost:5000/api2?date=01/04/2024
app.get('/api2', UsController.scrapData2);

//http://localhost:5000/api3?parcel_id=00424435050000580
app.get('/api3', UsController.scrapData3);


//http://localhost:5000/api3?parcel_id=00424435050000580
app.post('/api4', UsController.scrapData4);





app.listen(PORT, () => {
    console.log(`Application running on http://localhost:${PORT}`);
})