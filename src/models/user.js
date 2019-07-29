const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('../models/task')

const connectionUrl = "mongodb://127.0.0.1:27017/task-manager-api"

mongoose.connect(connectionUrl,{useNewUrlParser:true ,useCreateIndex:true})

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Provide valid email id")
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        validate(value){
            if(value.length<6){
                throw new Error("Password should contain atleast 6 characters")
            }else if(value.includes("password")){
                throw new Error("Password should contain word password!")
            }
        }
    },
    age:{
        type:Number,
        default:0,
        validate(value){
            if(value<0){
                throw new Error('Age should be greater than 0')
            }
            
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }
    ],
    avatar:{
        type:Buffer
    }

},{
    timestamps:true
})

userSchema.virtual('tasks',{

    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})

//funnciton to create jwt
userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = await jwt.sign({_id:user._id.toString()},'Gajendra')
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}

//function to find user by its email and password
userSchema.statics.findByCredentials = async (email,password)=>{
    const user = await User.findOne({ email })
    if(!user){
        throw new Error('Unable to log in!')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    
    if(!isMatch){
        throw new Error('Unable to login!')
    }
    
    return user
}

//use hash function to encrypt password 
userSchema.pre('save', async function (next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)

    }
    next()
})

//middleware to delete tasks when user is deleted
userSchema.pre('remove',async function(next){
    const user =this
    await Task.deleteMany({owner:user._id})
})
const User = mongoose.model('User',userSchema)
module.exports = User