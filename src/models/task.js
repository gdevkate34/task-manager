const mongoose = require('mongoose')
const validator = require('validator')
const connectionUrl = "mongodb://127.0.0.1:27017/task-manager-api"

mongoose.connect(connectionUrl,{useNewUrlParser:true ,useCreateIndex:true})

const Task = mongoose.model('Task',{
    description:{
        type: String,
        required:true,
        trim:true
    },
    completed:{
        type:Boolean,
        default:false
    },

})

module.exports = Task