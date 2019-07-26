const express = require('express')
const Task = require('../models/task')
const router = new express.Router()

//add task 
router.post('/tasks',async (req,res)=>{
    const tsk = new Task(req.body)
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
router.patch('/tasks/:id',async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description','completed']
    const isValidOperation=updates.every((update)=>allowedUpdates.includes(update))
    if(!isValidOperation){
        return res.status(400).send({error:"Invalid Updates"})
    }
    try{
        const task =await Task.findById(req.params.id)
        updates.forEach((update)=>task[update]=req.body[update] )
        await task.save()
        if(!task){
            return res.status(400).send()       
        }
        res.status(200).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

//delete task
router.delete('/tasks/:id',async (req,res)=>{
    const task=await Task.findByIdAndDelete(req.params.id)
    if(!task){
        return res.status(400).send({error:"task not found"})
    }
    try{
        res.status(200).send(task)
    }catch(e){
        res.status(400).send(e)
    }
   
})

//get tasks list in db
router.get('/tasks',async (req,res)=>{
    try{
        const tasks = await Task.find({})
        res.status(200).send(tasks)
    }catch(e){
        res.status(400).send(e)
    }
})

module.exports = router