import express from 'express';
const router = express.Router();
import nodemailer from 'nodemailer';
import User from '../models/userModel.js';



var transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'1ayushgoyal007@gmail.com',
        pass:'Ayush@1998'
    }
})


router.get('/:id',(req,res)=> {

    User.findById(req.params.id).then((user)=> {
        if(user===null){
            console.log('user is not there');
            res.status(401).json({message:"User not found"});
        }else{
            console.log('user is definately', user);
            const URL = `/api/verify/verification/${req.params.id}`

            var mailOptions = {
                from : '1ayushgoyal007@gmail.com',
                to:user.email,
                subject:'verification email',
                text:'',
                html:`<div><p>This email is to verify your account on e-commerce platform. please do not click on the link if you did not send it.</p><a href=${URL} > click here to verify </a></div>`
            }

            transporter.sendMail(mailOptions, function(err, data){
                if(err){
                    console.log('error in email',err);
                }else{
                    console.log('email send', data);
                }
            } )
            res.status(200).json({user});

        }
    }).catch((err)=>{
        res.status(401).json({ message:err.message });
        console.log('error occur',err.message);
    })


})

router.get('/verification/:id', async (req,res)=>{

    try{
        const user = await User.findById(req.params.id);
        console.log('first user', user);
        if(user){
            const data =  {emailVerified:true };
            User.findOneAndUpdate({_id:req.params.id},data).then((user)=>{
                console.log('user updated',user);
                res.send('user updated');
            }).catch((error)=>{
                console.log('error in updating', error.message);
                res.send(error.message);
            })    
        }else{
            res.send('User not found');
        }
        
    }catch(err){
        console.log('error in catch',err);
        res.send(err.message);
    }

})


export default router;
