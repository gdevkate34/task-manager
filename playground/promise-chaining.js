require('../src/db/mongoose')

const Task = require('../src/models/task')

const deleteTaskAndCount = async (id) =>{
    const task = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({completed:false})
    return count
}

deleteTaskAndCount('5d38b47011fab519718e8c82').then((count)=>{
    console.log(count)
}).catch((e)=>{
    console.log(e)
})