import jwt, { decode } from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next)=>{
    let token;

    // check if token exists in authorization header
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1];

            //verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');

            if(!req.user){
                return res.status(401).json({
                    success: false,
                    error: 'user not found',
                    statuscode: 401
                });
            }
            next();
        }
        catch(error){
            console.error('Auth middleware error:', error.message);
            if(error.name === 'TokenExpiredError'){
                return res.status(401).json({
                    success: false,
                    error: 'token has expired',
                    statuscode: 401
                });
            }
            return res.status(401).json({
                success: false,
                error: 'not authorized, token failed',
                statuscode:401
            });
        }
    }
    if(!token){
        return res.status(401).json({
            success:false,
            error: 'not authorized, no token',
            statuscode: 401
        });
    }
};
export default protect;