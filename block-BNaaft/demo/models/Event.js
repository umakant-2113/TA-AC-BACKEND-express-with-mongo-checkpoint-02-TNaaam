let mongoose=require("mongoose");
let Schema=mongoose.Schema;
 
let  EventSchema=new Schema({
title:{type:String, required:true },
summary:String,
host:String,
startDate:Date,
endDate:Date,
category_name:[String],
location_name:String,
likes:{type:Number ,  default : 0},
comment:[{
    type:Schema.Types.ObjectId, ref:"Comment"
 }]

} ,{timestamps:true})

module.exports=mongoose.model("Event",EventSchema)