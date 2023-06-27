const express=require('express');
const fetchuser = require('../middleware/fetchuser');
const router=express.Router();
const Files=require('../models/Files');
const User=require('../models/User');
const fs = require('fs')
//router to add all the file on the pc with auth localhost:5000/file/addfile
router.post('/addfile',fetchuser,async(req,res)=>{
    try {
        let file=new Files({
            user:req.user.id,
            fileContent:req.body.fileContent,
            topic:req.body.topic,
            category:req.body.category
        })
        let user=await User.findById(req.user.id);
        user.coins+=10;
        await user.save();
        let saved=await file.save();
        res.json(file);
    } catch (error) {
        res.status(401).send({error:error});
    }
});
//router to display all the files on the pc without auth localhost:5000/file/fetchallfiles
router.get('/fetchallfiles',async(req,res)=>{
    try {
        let files=await Files.find({})
        res.json(files);
    } catch (error) {
        res.status(401).send({error:error});
    }
});
//router to display all the files of the user auth required localhost:5000/file/fetchmyfiles
router.get('/fetchmyfiles',fetchuser,async(req,res)=>{
    try {
        let files=await Files.find({user:req.user.id});
        res.json(files);
    } catch (error) {
        res.status(401).send({error:error});
    }
})
//router to delete the file auth required localhost:5000/file/deletefile
router.delete('/deletefile/:id',fetchuser,async(req,res)=>{
    try {
        let file=await Files.findById(req.params.id);
        if(req.user.id!=file.user){
            return res.status(401).json({error:"No Files"});
        }
        // const path = file.filepath;
        // fs.unlink(path, (err) => {
        //     if (err) {
        //         console.error(err);
        //         return res.status(401).json({error:err});
        //         //file removed
        //     }
        // })
        let deleting=await Files.findByIdAndDelete(req.params.id);
        if(!deleting){
            return res.status(401).json({error:"Some Error Occured"});
        }
        res.send("Deleted Successfully");
        }catch (error) {

    res.status(401).send({error:error});
}
});
//router to download the note whose id is passed auth is required localhost:5000/file/download
router.post('/download/:id',fetchuser,async(req,res)=>{
    try {
        let file=await Files.findById(req.params.id);
        if(!file){
            return res.status(401).json({error:"Some Error Occured"});
        }
        let user=await User.findById(req.user.id);
        if(file.user!=req.user.id){
            user.coins-=10;
            await user.save();
            res.json(file);
        }
        else{
            res.json(file);
        }
        
        
    }catch (error) {

        res.status(401).send({error:error});
    }
})
module.exports=router;