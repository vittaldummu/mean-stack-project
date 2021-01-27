var express = require('express');
var app = express();
var cors = require('cors');
const dotenv= require("dotenv");
const mongoose = require('mongoose');
const dbConfig = require('./database/db');

var multipart = require('connect-multiparty');
global.app = module.exports = express();
app.use(multipart());


dotenv.config();

app.use(cors());
app.use(express.static(__dirname + '/public'));

///////DB Connection ///////////////////

/*mongoose.connect(process.env.DB_CONNECT,
{useUnifiedTopology: true,useCreateIndex: true , useNewUrlParser: true },
()=>console.log("connected to db"));*/
mongoose.connect(dbConfig.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Database connected')
},
    error => {
        console.log("Database can't be connected: " + error)
    }
)

/////////import route//////////
const bodyParser = require('body-parser');
const listing=require("./Routes/Authentication");
const usertype=require("./Routes/UserType");
const language=require("./Routes/Language");
const currency=require("./Routes/Currency");
/*const booking=require("./Routes/CourseBooking");
const bank=require("./Routes/BankRoute");
const message=require("./Routes/MessageRoute")*/

const { count } = require('./model/User');


app.use(express.json());

app.use(bodyParser.json());


app.use("/api/auth",listing);
app.use("/api/master",usertype);
app.use("/api/master",language);
app.use("/api/master",currency);
/*app.use("/api/coursebooking",booking);
app.use("/api/message",message);
app.use("/api/bank",bank);*/


app.use(express.static('public'));
app.get('/', function(req, res){
   res.send("Hello world!");
});

app.listen(3000,()=>console.log("running at 3000 port"));  