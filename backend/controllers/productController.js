import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js'


//Fetch All Products
const getProducts = asyncHandler( async (req,res)=>{
    const pageSize = 4
    const page = Number(req.query.pageNumber) || 1

    const keyword = req.query.keyword ? {
        name:{
            $regex: req.query.keyword,
            $options:1
        },
    } : {}

    const count = await Product.countDocuments({ ...keyword })
    const products = await Product.find({}).limit(pageSize).skip( pageSize * (page-1) )
    res.json({products, page, pages: Math.ceil(count / pageSize) });
})


//Fetch each product
const getProductById = asyncHandler(async(req,res)=>{
    Product.findById(req.params.id).then((product)=>{
        console.log('here is product');
        res.json(product);
    }).catch((err)=>{
        console.log('error occur', err.message);
        res.status(404).json({ message: 'Product not found' });
    })
})

//Delete a Product
const deleteProduct = asyncHandler(async(req,res)=>{
    Product.findById(req.params.id).then( async (product)=>{
        await product.remove();
        res.json({ message:"Product deleted" });
    }).catch((err)=>{
        console.log('error occur', err.message);
        res.status(404).json({ message: 'Product not found' });
    })
})

//Create A product
const createProduct = asyncHandler(async(req,res)=>{
    const product = new Product({
        name:'name',
        price:0,
        user: req.user._id,
        image:'/images/sample.jpg',
        brand:'brand',
        category: 'category',
        countInStock:0,
        numReviews: 0,
        description:'description'
    })

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
})

const updateProduct = asyncHandler(async(req,res)=>{
    
    const { name, price, image, brand, category, countInStock, description } = req.body;

    const product = await Product.findById(req.params.id);
    if(product){

        product.name= name
        product.price= price
        product.description = description
        product.image = image
        product.brand= brand
        product.category= category
        product.countInStock = countInStock

        const updatedProduct = await product.save();
        res.json(updatedProduct);


    }else{
        res.status(404).json({message:"product not found"})
    }


})


const getTopProducts = asyncHandler(async(req,res)=>{
    console.log('at least here');
    const products = await Product.find({}).sort({ rating:-1 }).limit(5);
    console.log('here are the products', products);
    res.json(products);
})

export { getProducts, getProductById, deleteProduct, createProduct, updateProduct , getTopProducts}