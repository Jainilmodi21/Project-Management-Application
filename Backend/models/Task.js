
const mongoose= require('mongoose');

const taskSchema=new mongoose.Schema({
   
        project_id:{type: mongoose.Schema.Types.ObjectId,ref:'Project'},
        name:String,
        description:String,
        due_date:Date,
        status:String,
        assignedTo:[{type: mongoose.Schema.Types.ObjectId,ref:'User'}],
});

module.exports=mongoose.model('Task',taskSchema);