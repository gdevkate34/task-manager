//import libraries

const {MongoClient, ObjectID }= require('mongodb')

//connection
const connectionURL = 'mongodb://localhost:27017'
const databaseName = 'task-manager'

MongoClient.connect(connectionURL,{useNewUrlParser:true},(error,client)=>{
    if(error){
        return console.log('Unable to connect to database!')
    }
    const db= client.db(databaseName)
    // db.collection('users').insertOne({
    //     name:'Gajendra devkate',
    //     email:'gdevkate34@gmail.com',
    //     age:22
    // })

    // db.collection('tasks').insertMany([
    //     {
    //         description:'Complete python course',
    //         completed : false
    //     },
    //     {
    //         description:'Complete Android course',
    //         completed:true
    //     }
    // ],(error,result)=>{
    //     if(error){
    //         return console.log('unable to insert document!')
    //     }
    //     console.log(result.ops)
    // })

    //find one attribute of document
    db.collection('users').findOne({_id :new ObjectID("5d36c7a22f81931b0cc1237b")},(error,task)=>{
        if(error){
            console.log(error)
        }
        else{
            console.log(task)
        }
    })

    //find all task that are not completed and display array
    db.collection('tasks').find({completed:false}).toArray((error,tasks)=>{
        if(error){
            console.log(error)
        } 
        else{
            console.log(tasks)
        }
    })

    //updateOne method to update one attribute
//     db.collection('tasks').updateOne({
//         _id : new ObjectID("5d38883228864c0ba9eec894")
//     },
//     {
//         $set:{
//             advice: "Complete as soon as possible!"
//         }
//     }).then((result)=>{
//         console.log(result)
//     }).catch((error)=>{
//         console.log(error)
//     })

    //updateMany()
    // db.collection('tasks').updateMany({
    //     completed:false
    // },
    // {
    //     $set:{
    //         advice: "Complete as soon as possible!"
    //     }
    // }).then((result)=>{
    //     console.log(result)
    // }).catch((error)=>{
    //     console.log(error)
    // })

    //deleteOne and deleteMany

    // db.collection('tasks').deleteOne({
    //     completed:true
    // }).then((result)=>{
    //     console.log(result)
    // }).catch((error)=>{
    //     console.log(error)
    // })

    db.collection('tasks').deleteMany({
        completed:true
    }).then((result)=>{
        console.log(result)
    }).catch((error)=>{
        console.log(error)
    })

})