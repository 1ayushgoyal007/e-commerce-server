import express from 'express';
const router = express.Router();
import nodemailer from 'nodemailer';
import User from '../models/userModel.js';
import mailgun from 'mailgun-js';
const DOMAIN = 'sandbox27988cb49c4e46238425a8bc0e98bea0.mailgun.org';
const mg = mailgun({
    apiKey: '729dc20b232894a1dde0656137cbf2e7-ba042922-5b0529b9', domain: DOMAIN});


// var transporter = nodemailer.createTransport({
//     service:'gmail',
//     auth:{
//         user:'1ayushgoyal007@gmail.com',
//         pass:'Ayush@1998'
//     }
// })


router.get('/:id',(req,res)=> {

    
    User.findById(req.params.id).then((user)=> {
        if(user===null){
            console.log('user is not there');
            res.status(401).json({message:"User not found"});
        }else{
            console.log('user is definately', user);
            const URL = `https://e-commerce1-server.herokuapp.com/api/verify/verification/${req.params.id}`
            const data = {
                from: 'goyalrockslogin1@gmail.com',
                to: user.email,
                subject: 'Email Verification',
                text: '',
                html: `<div><p>This email is to verify your account on e-commerce platform. please do not click on the link if you did not send it.</p><a href=${URL} > click here to verify </a></div>`
            };

            mg.messages().send(data, function (error, body) {
                if(error){
                    console.log('error',error);
                    res.status(200).json({ error:err.message })

                }else{
                    console.log('message send ',body);
                    res.status(200).json({body});
                    
                }
            });

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
