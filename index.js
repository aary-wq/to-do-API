const express = require("express");

const app = express();

const path = require("path");

const {v4} = require("uuid");

const multer = require("multer");

const upload = multer({ dest: path.join(__dirname, "/public/assets") }); 

const  override = require("method-override");

app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}));
app.use(override("_method"));



app.listen("5050",()=>{
console.log("Server running on port 5050.....")
});

let tasks=[
    {
        id:v4(),
        task:"Sleep",
        desc : "I will sleep 8 hours every day...",
        img:"/assets/sleep.jfif"
    },
    {
        id:v4(),
        task:"Play",
        desc : "I will play 2 hours every day...",
        img:"/assets/play.jfif"
    },
    {
        id:v4(),
        task:"Eating",
        desc : "I will eat fresh fruits and vegetables every day....",
        img:"/assets/eating.jfif"
    }
];

app.get("/tasks",(req,res)=>{
    res.render("index.ejs",{tasks});
});


app.post("/tasks",upload.single("img"),(req,res)=>{ 
    console.log(req.body);
    if(req.body.task!='' && req.body.desc!='' && req.file.filename!='') 
    tasks.push({id:v4(),task:req.body.task,desc:req.body.desc,img:"/assets/"+req.file.filename});
    console.log(req.file);
    res.redirect("/tasks");
    });

app.get("/tasks/new",(req,res)=>{
    res.render("new.ejs");
});

app.get("/tasks/:id/edit",(req,res)=>{
    let {id}= req.params;
    try{
        let task = tasks.find((t)=>t.id==id);
        res.render("edit.ejs",{task});
        }
        catch(e){
            res.send("Error 404...!!! Cannot find task");
        }
    
});

app.get("/tasks/:id",(req,res)=>{
    let {id}= req.params;
    try{
    let task = tasks.find((t)=>t.id==id);
    res.render("show.ejs",{task})
    }
    catch(e){
        res.send("Error 404...!!! Cannot find task");
    }
    });

app.patch("/tasks/:id",upload.single("img"),(req,res)=>{
    let {id}= req.params;
    let task = tasks.find((t)=>t.id==id);
    task.desc = req.body.desc;
    task.task = req.body.task;
    if(req.file)
    task.img = `/assets/${req.file.filename}`
    console.log(req.file);
    res.redirect("/tasks");
});

app.delete("/tasks/:id",(req,res)=>{
    let {id}= req.params;
    tasks = tasks.filter((t)=>t.id!=id);
    res.redirect("/tasks");
});

