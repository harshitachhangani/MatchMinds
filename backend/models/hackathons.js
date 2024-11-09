const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    name:String,
    link:String,
    interestedPeoples:[String],
    problemStatement: String
})

module.exports=mongoose.model('Hackathons',userSchema)  