const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const studentData = require("./InitialData");
const port = 8080;

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// your code goes here

app.get("/api/student", (req,res)=>{
    res.status(200).json(studentData);
})

app.get('/api/student/:id', (req,res)=>{
    let student_id = parseInt(req.params.id);
    let exist = false;
    for(let i=0;i<studentData.length;i++){
        if(studentData[i].id===student_id){
            exist = true;
            res.status(200).json(studentData[i]);
        }
    }
    if(exist===false){
        res.status(404).send('invalid student id');
    }
})

app.post('/api/student', (req,res)=>{
    let newStudent = {
        id : 0,
        name : '',
        currentClass : '',
        division : ''
    }
    if(Object.keys(req.body).length===3){
        if(req.body.name===''||Number(req.body.currentClass)<1||Number(req.body.currentClass)>12||req.body.division===''||req.body.currentClass===''){
            res.status(400).send('Data insufficient');
        }else{
            let newId = studentData.length+1;
            newStudent.id = studentData.length+1;
            newStudent.name = req.body.name;
            newStudent.currentClass= Number(req.body.currentClass);
            newStudent.division = req.body.division;
            studentData.push(newStudent);
            res.status(200).json({id:newId});
        }
    }else{
        res.status(400).send('Data insufficient')
    }
})

app.put('/api/student/:id',(req,res)=>{
    let studentId = Number(req.params.id);
    let updatedInfo = {};
    let exist = false;
    if(Object.keys(req.body).length){
        for(let keys in req.body){
            if(keys in updatedInfo){
                continue;
            }else{
                updatedInfo[keys] = req.body[keys];
            }
        }
        for(let j=0;j<studentData.length;j++){
            if(studentData[j].id===studentId){
                exist=true;
                studentData[j]={...studentData[j],...updatedInfo};
                res.status(200).json(studentData[j]);
            }
        }
        if(exist===false){
            res.status(400).send('Id not found');
        }
    }else{
        res.status(400).send('Invalid input');
    }
})

app.delete('/api/student/:id',(req,res)=>{
    let studentId = Number(req.params.id);
    let exist = false;
    for(let k=0;k<studentData.length;k++){
        if(studentData[k].id === studentId){
            exist = true;
            studentData.splice(k,1);
            res.status(200).send('Data removed');
        }
    }
    if(exist===false){
        res.status(404).send('Invalid id');
    }
})


app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;