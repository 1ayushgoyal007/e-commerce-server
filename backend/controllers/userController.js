import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js'
import generateToken from '../utils/generateToken.js'

//Authenticate User and Access Token

const authUser = asyncHandler(async (req,res)=> {
    const email = req.body.email
    const password = req.body.password

    const user = await User.findOne({ email: email })
    if(user && ( await user.matchPassword(password) )){
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken( user._id ),
            emailVerified: user.emailVerified
        });
    }else{
        res.status(401).json({ error:'invalid email or password', message:'invalid email or password' })
        
    }
})


//Register a new user

const registerUser = asyncHandler(async (req,res )=> {
    const { name, email, password} = req.body;

    User.findOne({ email:email }).then((data)=>{
        if(data){
            console.log('data in existence already', data);
            res.status(400).json({ error:'user already exists', message:"user already exists" });

        }else{
            console.log('maybe now i can create');
            User.create({ name, email, password }).then((user)=>{
                console.log('User created', user);
                if(user){
                    res.status(201).json({
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        password: user.password,
                        isAdmin: user.isAdmin,
                        token: generateToken(user._id)
                    })
                }
            }).catch((err)=>{
                console.log('error occured ', err);
                res.status(400).json({error : err.message, message: err.message });
            })
        }
    }).catch((err)=>{
        console.log('error in existing user',err);
    })
})



//Get User Profile

const getUserProfile = asyncHandler(async (req,res)=> {

    const user = await User.findById( req.user._id );

    if(user){
        console.log('send me instead', user);
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            emailVerified: user.emailVerified
        })
    }else{
        res.status(404).json({ error: 'User not found', message:"User not Found" })
    }

    res.send({
        success:'success'
    })

})

//update User Profile

const updateUserProfile = asyncHandler( async( req,res ) => {

    console.log('user is here', req.user);
    const user = await User.findById(req.user._id );

    if(user){
        user.name = req.body.name;
        user.email = req.body.email;
        if(req.body.password){
            user.password = req.body.password
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token:  generateToken( updatedUser._id )
        })

    }else{
        res.status(404).json({ error: 'User not found' })

    }

})

//Get All Users
const getUsers = asyncHandler(async (req,res)=> {

    const users = await User.find( {} );
    res.json(users);

})

//Delete User

const deleteUser = asyncHandler(async (req,res)=> {

    const user = await User.findById( req.params.id );
    if(user){
        await user.remove();
        res.json({ message:"User Deleted" });
    }else{
        res.status(404).json({message:"User Not Found"});
    }
    res.json(users);

})

const getUserById = asyncHandler(async (req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        if(user){
            console.log('user found',user);
            res.status(200).json(user);
        }else{
            res.status(400).json({ message:"user not found" })
        }
    }catch(err){
        console.log('error ',err);
        res.status(401).json({ message:err.message })
    }
})

export { authUser, getUserProfile, registerUser, updateUserProfile , getUsers, deleteUser, getUserById};


