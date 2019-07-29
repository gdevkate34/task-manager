const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp =require('sharp')
const { sendWelcomeEmail,sendCancellationEmail } = require('../emails/account')


const router = new express.Router()

//add user to db
router.post('/users', async (req, res) => {
    const user = new User(req.body)

    try {
        await user.save()
        sendWelcomeEmail(user.email,user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })

    } catch (e) {
        console.log(e.message)
        res.status(400).send(e)
    }
})
 
 //get users list in db
 router.get('/users/me', auth ,async (req,res)=>{
    res.send(req.user)
})
 
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

 //upload profile photo
 const upload = multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)/)){
            return cb(new Error('Invalid file type ! choose image format !'))
        }
        cb(undefined,true)
    }
    })
 router.post('/upload/me/avatar',auth,upload.single('avatar'),async (req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({width:250, height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error: error.message})
})

//get profile or avatar by user id
router.get('/users/:id/avatar', async (req,res)=>{
    try {
        const user = await User.findById(req.params.id)
    if(!user || !user.avatar){
       throw new Error()
    }
    res.set('Content-Type','image/png')
    res.send(user.avatar)
    } catch (error) {
        res.status(404).send(error)
    }
})
//delete profile photo

router.delete('/users/me/avatar',auth,async (req,res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send('Profile photo deleted!')
})
 
 //update user profile
 router.patch('/users/me',auth,async (req,res)=>{
     const updates = Object.keys(req.body)
     const allowedUpdates = ['name','email','password','age']
     const isValidOperation=updates.every((update)=>allowedUpdates.includes(update))
     if(!isValidOperation){
         return res.status(400).send({error:"Invalid Updates"})
     }
     try{
         updates.forEach((update)=>req.user[update]=req.body[update])
         await req.user.save()
         res.status(200).send(req.user)
     }catch(e){
         res.status(400).send(e)
     }
 })
 
 //delete user data 
 router.delete('/users/me',auth,async (req,res)=>{
     await req.user.remove()
    
     try{
        sendCancellationEmail(req.user.email,req.user.name)
         res.status(200).send(req.user)
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
router.post('/users/logoutAll',auth,async (req,res)=>{
    try {
        req.user.tokens = []
        await req.user.save()
        res.send('Logged out from all devices successfully!')
    } catch (e) {
        res.status().send(e)
    }
})



 module.exports = router