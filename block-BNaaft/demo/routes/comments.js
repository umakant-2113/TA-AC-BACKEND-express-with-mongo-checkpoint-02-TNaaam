const express = require('express');
const router = express.Router();
let Comment=require("../models/Comment");
const { findByIdAndUpdate } = require('../models/Event');

// update comments 

router.get("/:id/edit",(req,res,next)=>{
    let id=req.params.id;
    Comment.findById(id,  (err,comment)=>{
        if(err) return next(err);
        res.render("updateComment" ,{comment})
    })
})

// post updated data 

router.post("/:id/edit",(req,res,next)=>{
    let id=req.params.id;
    Comment.findByIdAndUpdate(id, req.body, (err,comment)=>{
        if(err) return next(err);
        res.redirect("/events/"+ comment.eventId+"/details")
    })
})

// likes 
router.get("/:id/likes",(req,res,next)=>{
    let id=req.params.id;
    Comment.findByIdAndUpdate(id,{$inc:{likes:1}},(err,comment)=>{
        if(err) return next(err);
        res.redirect("/events/"+ comment.eventId+"/details")
    })
})

// how to decrease likes

router.get("/:id/dislike",(req,res,next)=>{
    let id=req.params.id;
    Comment.findById(id,(err,comment)=>{
        if(comment.likes>0){
            Comment.findByIdAndUpdate(id,{$inc:{likes: -1}},(err,comment)=>{
                if(err) return next(err);
                res.redirect("/events/"+ comment.eventId+"/details")
        })
    }
   
    })
})

// delete comment

router.get("/:id/delete",(req,res,next)=>{
    let id=req.params.id;
    Comment.findByIdAndDelete(id,(err,comment)=>{
        if(err) return next(err);
        res.redirect("/events/"+ comment.eventId+"/details")
    })
})


module.exports = router;