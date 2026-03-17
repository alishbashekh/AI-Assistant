const errorhandle = (err, req, res, next)=>{
    let statuscode = err.statuscode || 500;
    let message = err.message || 'server error';


    //mongoose bad object err 
    if (err.name === 'CastError'){
        message= "Resources not found"
        statuscode =404;
    }
    
    //mongoose duplicate key err
    if (err.code === 11000){
        const field = Object.keys(err.keyValue)[0];
        message = `${field} already exists`
        statuscode = 400;
    }

    //mongoose validation err 
    if(err.name === 'ValidationError'){
        message=Object.values(err.errors).map(val => val.message).join(', ');
        statuscode=400;
    }

    //multer file size err 
    if (err.code === 'LIMIT_FILE_SIZE'){
        message=' file size exceed to thw limit of 10MB';
        statuscode=400;
    }
    //JWT ERR 
    if(err.name === 'JsonWebTokenError'){
        message = 'invalid token';
        statuscode= 401;
    }
    if(err.name === 'TokenExpiredError'){
        message= 'Expired token';
        statuscode = 401;
    }
     console.error('Error:',{
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
     });

     res.status(statuscode).json({
        success: false,
        error: message,
        statuscode,
        ...(process.env.NODE_ENV === 'development' && {stack: err.stack })
     });
};
export default errorhandle;