const mongoose= require('mongoose');

const projectSchema=new mongoose.Schema({
   
        name:String,
        description:String,
        startDate:Date,
        endDate:Date,
        status:String,
        created_by:{type: mongoose.Schema.Types.ObjectId,ref:'User'},
        teamMembers:[{user_id:{type: mongoose.Schema.Types.ObjectId,ref:'User'},
                    role: String,name:String}],
        tasks:[{type: mongoose.Schema.Types.ObjectId,ref:'Task'}],
});

module.exports=mongoose.model('Project',projectSchema);