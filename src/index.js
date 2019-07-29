const express = require('express')
// const Task = require('./models/task')
// const User = require('./models/user')
const userRouter = require('./resources/user')
const taskRouter = require('./resources/task')
const multer = require('multer')


const app = express()
const port = process.env.PORT


// app.use((req,res,next)=>{
//     res.status(503).send('Server under maiantainance ! Visit after some time')
   
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
 
const upload = multer({
    dest:'images'
})

//upload files to database
app.post('/upload',upload.single('upload'),(req,res)=>{
    res.send()
})



app.listen(port,()=>{
    console.log('Server is up on port '+port)
})

