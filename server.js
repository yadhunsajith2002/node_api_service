var express = require("express");

var app = express();

var mysql = require("mysql");

var bodyParser=require("body-parser");

var cors= require("cors");

// json parser
var jsonParcer = bodyParser.json();
// url encoded
var urlencodedParcer = bodyParser.urlencoded({extended:false});

app.use(cors());

var con = mysql.createConnection({
    host:"0.0.0.0",
    user: "root",
    password:"",
    database:"sale_db"
});
con.connect((err)=>{
    if(err) throw err;
    console.log("connected to database")
})
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

// post new details
app.post("/data/add",jsonParcer,function(req,res){

    let name = req.body.name;
    let address = req.body.address;
    let phone_number = req.body.phone_number;
    let email = req.body.email;
    let country = req.body.country;

    
let qr =  ` insert into details(name,address,phone_number,email,country) values('${name}','${address}',${phone_number},'${email}','${country}')`;
con.query(qr,(err,result)=>{
    if(err){
        res.send({error:"Operation Failed"})
    }else{
        res.send({success: "Operation Completed"});
    }
})
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

app.listen(9000,function(){
    console.log("Server started")
})