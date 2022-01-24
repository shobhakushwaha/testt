const  express=require("express");
const mongoose = require("mongoose");
const validator = require("validator");
const app=express();

const bodyparser=require("body-parser");

app.use(express.json());
//connect to mongoose

mongoose.connect("mongodb://localhost:27017/userr", {
  
    useNewUrlparser:true,
    useUnifiedTopology:true}
    ).then(()=>{
    console.log("connected  with mongodb");
}).catch((err)=>{
    console.log(err)
})


app.use(bodyparser.urlencoded({extended:false}));

// / /design schema
const userSchema = new mongoose.Schema({
firstname: { 
        type:String,
        required:true,
       },

email:{
     type:String,
     required:true,
},

lastname: { 
      type:String,
      required:true,
     
     },
password: { 
        type:String,
        required:true,
        
       
       }
})




//create collection
const User = new mongoose.model("User", userSchema)

 
//create user API

app.post("/api/v1/user/new",async(req,res)=>{
    const user = await User.create(req.body);
    console.log(user)
    res.status(201).json({
        success:true,
        user
                 })

})  

 
// read user
app.get("/api/v1/users",async(req,res)=>{
    const users = await User.find(req.body);
    res.status(200).json({
        success:true,
        users
    })
})




//update user

app.put("/api/v1/user/:id",async(req,res)=>{
    let  user= await User.findById(req.params.id);
    if(!user){
        return res.status(500).json({
            success:false, 
            message:"user is not found "
    })
    }
    user = await User.findByIdAndUpdate(req.params.id,req.body,{new:true,
    useFindAndModify:true,
    runValidators:true
})
    res.status(200).json
    
     ({
        success:true, 
        user
    })
}) 



//delete user
app.delete("/api/v1/user/:id",async(req,res)=>{
    const  user= await User.findById(req.params.id);

if(!user) {
    return res.status(500).json({
        success:false,  
        message:"user is not found "
})
}
await user.remove();
    res.status(200).json({
        success:true, 
        message:"user is deleted succsessfully "
    })
}) 









//creatae server
app.listen(8000,()=>{
console.log("server is  working")
})