
const mongoose= require('mongoose');

const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    projects:[{type:mongoose.Schema.Types.ObjectId,ref:'Project'}],
    tasks:[{type:mongoose.Schema.Types.ObjectId,ref:'Task',default: [] }]
});

module.exports=mongoose.model('User',userSchema);