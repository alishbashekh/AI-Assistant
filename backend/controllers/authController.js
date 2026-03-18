import jwt from "jsonwebtoken";
import User from '../models/User.js';

//generate jwt
const generateToken= (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_SECRET || "7d",
    });
};

//@desc Register new user
//@route post/api/auth/register
//@access public 
export const register = async (req, res, next)=>{
    try{

    } catch (error){
        next(error);
    }
};

//@desc login user
//@route POST/api/auth/login
//@access public
export const login = async (req, res, next)=>{

};

//@desc Get user profile
//@route GET/api/auth/profile
//@access private
export const getProfile = async (req, res, next)=>{

};

//@desc update user
//@route PUT/api/auth/profile
//@access private
export const updateProfile = async (req, res, next)=>{

};

//@desc change password
//@route POST/api/auth/change-password
//@access private 
export const changePassword = async (req, res, next)=>{

};
