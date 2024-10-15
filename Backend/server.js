const express= require('express');
const mongoose=require('mongoose');
const userRoutes= require('./Routes/User');
const projectRoutes = require('./Routes/Project');
const taskRoutes = require('./Routes/Task');
const app=express();
const cors = require('cors');
const PORT=5000;

mongoose.connect('mongodb://127.0.0.1/project_management',{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=> {
    console.log('connected to mongoDB');

}).catch((err)=>{
    console.error('Failed to connect to MongoDB',err);
});

const corsOptions={
    origin:"http://localhost:3000",
    method:"GET,POST,PUT,DELETE,PATCH,HEAD",
    credentials: true,
}
app.use(cors());
app.use(express.json());

app.use('/api/user',userRoutes);
app.use('/api/project',projectRoutes);
app.use('/api/task',taskRoutes);

app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`);
})