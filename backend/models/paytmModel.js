import mongoose from 'mongoose';

const paytmSchema = mongoose.Schema({
    orderId: String,
    paymentSuccess: Boolean
})

const Paytm = mongoose.model('Paytm',paytmSchema);

export default Paytm;