const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// Cloudinary setup
const cloudinary = require('cloudinary').v2;

const {CLOUD_NAME_CLOUDINARY, API_KEY_CLOUDINARY, API_SECRET_CLOUDINARY} = require('./../config/keys');

cloudinary.config({
    cloud_name: CLOUD_NAME_CLOUDINARY,
    api_key: API_KEY_CLOUDINARY,
    api_secret: API_SECRET_CLOUDINARY
});

const requireLogin = require('../middlewares/requireLogin');

const router = express.Router();
const Post = mongoose.model('Post');
const User = mongoose.model('User');

router.put('/updatepic', requireLogin, async (req,res)=>{
    const pic = req.body.pic;
    if(!pic){
        return res.status(422).json({error: "Please provide a picture!"});
    }
    try{
        const picUploadedResponse = await cloudinary.uploader.upload(pic, {
            upload_preset: "the-gallery"
        });
        const picUrl = picUploadedResponse.url;
        const imagePublicId = picUploadedResponse.public_id;
        User.findById(req.user._id)
        .exec((err,user)=>{
            if(err || !user){
                return res.status(422).json({error:err})
            }
            const picId = user.picid;
            if(picId !== "undefined"){
                cloudinary.uploader.destroy(picId, function(error,response) {
                    if(error){
                        return res.status(422).json({error: "Something went to wrong!"});
                    }
                })
            }
        });
        // console.log(picUploadedResponse)
        User.findByIdAndUpdate(req.user._id, {
            $set: {pic: picUrl,picid: imagePublicId},
        },{new: true}, 
            (err,result)=>{
            if(err){
                return res.status(422).json({error: "Unable to update profile pic!"});
            }
            res.json(result);
        })
    }catch(err){
        console.log(err)
        return res.status(422).json({
            error: "Something went wrong, try again!"
        });
    };
});

router.put('/updatename', requireLogin, (req,res)=>{
    let name = req.body.name;
    if(!name){
        return res.status(422).json({
            error: "Please provide a new name."
        })
    }
    if(name.length > 20 || name.length < 4){
        return res.status(422).json({
            error: "Name must be within 4 to 20 characters."
        });
    }
    User.findByIdAndUpdate(req.user._id, {$set: {name: name}},{new: true}, 
        (err,result)=>{
        if(err){
            return res.status(422).json({error: "Unable to update profile name!"});
        }
        res.json(result);
    })
});
router.put('/changepassword', requireLogin, (req,res)=>{
    const password = req.body.password;
    const prevPassword = req.body.prev;
    User.findById(req.user._id)
    .then((savedUser)=>{
        bcrypt.compare(prevPassword, savedUser.password)
        .then((doMatch)=>{
            if(doMatch){
                bcrypt.hash(password, 11)
                .then((hashedPassword)=>{
                    User.findByIdAndUpdate(req.user._id, {$set: {password: hashedPassword}},{new: true}, 
                        (err,result)=>{
                        if(err){
                            return res.status(422).json({error: "Unable to update password!"});
                        }
                        res.json({
                            message: "Password changed!"
                        })
                    })
                })
            }else{
                return res.status(422).json({
                    error: "Unable to update password!"
                });
            }
        })
        .catch((err)=>{
            console.log(err);
        });
    })
});

module.exports = router;