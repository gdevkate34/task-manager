const express = require('express')
require('./db/mongoose')
const userRouter = require('./resources/user')
const taskRouter = require('./resources/task')



const app = express()
const port = process.env.PORT


// app.use((req,res,next)=>{
//     res.status(503).send('Server under maiantainance ! Visit after some time')
   
// })

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
 

app.listen(port,()=>{
    console.log('Server is up on port '+port)
})

