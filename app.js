require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')

const app = express()
app.use(express.json())

mongoose.connect(process.env.MONGODB_URI)
.then(()=>console.log("MongoDB connected"))
.catch(err=>console.log(err))

app.get('/', (req,res)=> res.send("Hospital App Running"))

app.listen(3000, ()=> console.log("Server running on port 3000"))
