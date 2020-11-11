const notFound = (req,res,next)=>{
    res.status(404).json({ error: `Not Found Url-${req.originalUrl}` });
    next();
}




export { notFound }