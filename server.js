require('dotenv').config(); 
var express = require("express");

var app = express();

var mysql = require("mysql");

var bodyParser=require("body-parser");

const cors = require("cors");
app.use(cors());
const allowedOrigins = ['http://10.0.2.2:9000',];
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    optionsSuccessStatus: 204,
}));

app.use(bodyParser.json());

// json parser
var jsonParcer = bodyParser.json();

// url encoded
var urlencodedParcer = bodyParser.urlencoded({extended:false});



var con = mysql.createConnection({
    host: process.env.DB_HOST || "0.0.0.0",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "sale_db"
});
con.connect((err) => {
    if (err) {
        console.error("Error connecting to database:", err);
        process.exit(1); 
    }
    console.log("Connected to database");
});

// get full data
app.get("/details",function(req,res){

    con.query("select * from details",(err,result,fields)=>{
        if(err) throw err;
        res.send(result);
    })
})

// get one detials
app.get("/details/:id",function(req,res){
    let id = req.params.id;
    con.query("select * from details where id ="+id,(err,result,fields)=>{
        if(err) throw(err);
        res.send(result);       
    })
})

app.post("/data/add", jsonParcer, function (req, res) {
    console.log("Received POST request:", req.body);
    let name = req.body.name;
    let address = req.body.address;
    let phone_number = req.body.phone_number;
    let email = req.body.email;
    let country = req.body.country;

    
    if (!name || name.trim() === "") {
        return res.status(400).json({ error: "Name cannot be empty" });
    }

    let qr = `INSERT INTO details(name, address, phone_number, email, country) VALUES (?, ?, ?, ?, ?)`;

    con.query(qr, [name, address, phone_number, email, country], (err, result) => {
        if (err) {
            console.error("Error executing SQL query:", err);
            res.status(500).json({ error: "Internal Server Error", details: err.message });
        } else {
            res.status(200).json({ success: "Operation Completed" });
        }
    });
});

// update details
app.patch("/data",jsonParcer,function(req,res){
    let name = req.body.name;
    let address = req.body.address;
    let phone_number = req.body.phone_number;
    let email = req.body.email;
    let country = req.body.country;
    let id = req.body.id;

    let qr = ` update details set name = '${name}', address = '${address}',phone_number =${phone_number}, email = '${email}', country = '${country}' where id =${id} `
con.query(qr,(err,result)=>{
    if(err){
        res.send( {error:"Failed"});
    }else{
        res.send({success: "Updated succesfully"})
    }
})
})
// delete a data
app.delete("/data/:id",function(req,res){

    let id = req.params.id;
    let qr = ` delete from details where id=${id}`;
    con.query(qr,(err,result)=>{
        if(err){
            res.send({error : "deletion failed"});
        }else{
            res.send({success:"data deleted succesfully"})
        }
    })

})

app.get("/",function(req,res){
    res.send("<h1>Hello<h1>")
});
const PORT = process.env.PORT || 9000;
app.listen(PORT, function () {
    console.log(`Server started on port ${PORT}`);
});

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started on port ${PORT}`);
  });