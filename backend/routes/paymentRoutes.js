import express from 'express';
const router = express.Router();
import Paytm from '../models/paytmModel.js'


router.get('/paytm/:id',(req,res)=>{
    
    console.log('req.bosdy',req.params);
    
    Paytm.find({ orderId: req.params.id }).then((order)=>{
        console.log('order found',order);
        res.status(200).json(order);
    }).catch((err)=>{
        console.log('order not found', err.message);
        res.json({ message:"Payment not completed" });
    })

});



export default router;