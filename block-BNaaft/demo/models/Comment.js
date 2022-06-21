let mongoose=require("mongoose");
let Schema=mongoose.Schema;

let commentSchema=new Schema({
title:{type:String,required:true},
eventId : {type: Schema.Types.ObjectId, ref:"Event" , required:true}, 
author:String,
likes:{type:Number,default:0}
},{timestamps:true})

module.exports=mongoose.model("Comment", commentSchema)