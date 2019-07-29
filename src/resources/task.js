const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

//add task 
router.post('/tasks',auth,async (req,res)=>{
    const tsk = new Task({
        ...req.body,
        owner:req.user.id
    })
    try{
     await tsk.save()
     res.status(201).send(tsk)
    }catch(e){
     res.status(400).send(e)
    }
    })

 //get a task by its id
 router.get('/tasks/:id',async (req,res)=>{
    
    try{
        const task = await Task.findById(req.params.id)
        if(!task){
            return res.status(400).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send(e)
    }
})

//update task data
router.patch('/tasks/:id',auth,async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description','completed']
    const isValidOperation=updates.every((update)=>allowedUpdates.includes(update))
    if(!isValidOperation){
        return res.status(400).send({error:"Invalid Updates"})
    }
    try{
        const task =await Task.findById({_id:req.params.id,owner:req.user._id})
        if(!task){
            return res.status(400).send()       
        }
        updates.forEach((update)=>task[update]=req.body[update] )
        await task.save()
        res.status(200).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

//delete task
router.delete('/tasks/:id',auth,async (req,res)=>{
    
    const task=await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
    if(!task){
        return res.status(400).send({error:"task not found"})
    }
    try{
        res.status(200).send(task)
    }catch(e){
        res.status(400).send(e)
    }
   
})

//get tasks list in db by its completed status
router.get('/tasks',auth,async (req,res)=>{
    const match = {}
    const sort = {}
    if(req.query.completed){
        if(req.query.completed==='true'){
            match.completed=true
        }else if(req.query.completed==='false'){
            match.completed =false
        }else{
            return res.send('invalid request')
        }
    
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        if(parts[1]==='desc'){
            sort[parts[0]]= -1
        } else if(parts[1]==='asc'){
            sort[parts[0]]= 1
        } else{
            return res.send('Invalid request! try again with correct query!')
        }
        
    }

    try{
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.status(200).send(req.user.tasks)
    }catch(e){
        res.status(400).send(e)
    }
})



module.exports = router