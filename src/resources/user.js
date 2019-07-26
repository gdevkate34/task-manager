const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

//add user to db
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})
 
 //get a user by its name
 // app.get('/users/:name',(req,res)=>{
 //     const users = User.find({name:req.params.name}).then((result)=>{
 //         res.status(200).send(result)
 //     }).catch((e)=>{
 //         res.status(500).send(e)
 //     })
 // })
 
 //get a user by its id
 router.get('/users/:id',async (req,res)=>{
     
     try{
         const user = await User.findById(req.params.id)
         if(!user){
             return res.status(400).send()
         }
         res.send(user)
     }catch(e){
         res.status(500).send(e)
     }
 })
 
 //update userdata
 router.patch('/users/:id',async (req,res)=>{
     const updates = Object.keys(req.body)
     const allowedUpdates = ['name','email','password','age']
     const isValidOperation=updates.every((update)=>allowedUpdates.includes(update))
     if(!isValidOperation){
         return res.status(400).send({error:"Invalid Updates"})
     }
     try{
         const user =await User.findById(req.params.id)
         updates.forEach((update)=>user[update]=req.body[update])
         await user.save()

         if(!user){
             return res.status(400).send()
         }
         res.status(200).send(user)
     }catch(e){
         res.status(400).send(e)
     }
 })
 
 //delete user data
 router.delete('/users/:id',async (req,res)=>{
     const user=await User.findByIdAndDelete(req.params.id)
     if(!user){
         return res.status(400).send({error:"user not found"})
     }
     try{
         res.status(200).send(user)
     }catch(e){
         res.status(400).send(e)
     }
    
 })

 //user login by email and password
 router.post('/users/login',async (req,res)=>{
     try {
        const user = await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({user , token})
     } catch (e) {
         res.status(400).send(e)
     }
 })
 
 //route to logout
 router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        
        await req.user.save()

        res.send('Logged out succesfully !')
    } catch (e) {
        console.log(e.message)
        res.status(500).send()
    }
})

//logout from all devices
router.post('/')

 //get users list in db
 router.get('/users/profile', auth ,async (req,res)=>{
     res.send(req.user)
 })

 module.exports = router