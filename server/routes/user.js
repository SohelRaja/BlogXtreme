const express = require('express');
const mongoose = require('mongoose');

const requireLogin = require('../middlewares/requireLogin');

const router = express.Router();
const Post = mongoose.model('Post');
const User = mongoose.model('User');

router.get('/user/:userId',requireLogin,(req,res)=>{
    User.findOne({_id: req.params.userId})
    .select("-password") // every things except password
    .then(user=>{
        Post.find({postedBy: req.params.userId, privacy: "public"})
        .populate("postedBy", "_id name")
        .exec((err, posts)=>{
            if(err){
                return res.status(422).json({error: err})
            }
            res.json({user,posts})
        })
    }).catch(err=>{
        return res.status(404).json({error: "User not found."});
    })
});

router.put('/follow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        $push: {followers: req.user._id}
    },{new:true},(err,data)=>{
        if(err){
            return res.status(422).json({error:err});
        }
        User.findByIdAndUpdate(req.user._id,{
            $push: {following: req.body.followId}
        },{new:true}).select("-password").then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    })
})

router.put('/unfollow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull: {followers: req.user._id}
    },{new:true},(err,data)=>{
        if(err){
            return res.status(422).json({error:err});
        }
        User.findByIdAndUpdate(req.user._id,{
            $pull: {following: req.body.unfollowId}
        },{new:true}).select("-password").then(result=>{
            res.json(result)
        }).catch(err=>{
            return res.status(422).json({error:err})
        })
    })
})

module.exports = router;