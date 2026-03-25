import Document  from "../models/Document.js";
import Flashcard from "../models/Flashcard.js";
import Quiz from '../models/Quiz.js';
import ChatHistory from '../models/ChatHistory.js';
import * as geminiService from '../utils/geminiService.js';
import { findRelevantChunks } from "../utils/textchunker.js";

//@desc generate flashcards from document 
//@route POST /api/ai/generate-flashcards
export const generateFlashcards = async (req, res, next)=>{
    try{

    }catch (error){
        next(error);
    }
};

//@desc generate quiz from a document
//@route POST /api/ai/generate-quiz
export const generateQuiz = async (req, res, next)=>{
    try{

    }catch(error){
        next(error)
    }
};

//@desc generate document summary
//@route POST /api/ai/generate-summary
export const generateSummary = async (req, res, next)=>{
    try{

    }catch(error){
        next(error)
    }
};

//@desc chat with document
//@route POST /api/ai/chat
export const chat = async (req, res, next)=>{
   try{

   }catch(error){
    next(error)
   }
};

//@desc explain concept from document 
//@route POST /api/ai/explain-concept
export const explainConcept = async (req, res, next)=>{
    try{

    }catch(error){
        next(error)
    }
};

//@desc get chat history for a document
//@route GET /api/ai/chat-history/:documentId
export const getChatHitory = async (req, res, next)=>{
    try{

    }catch(error){
        next(error)
    }
};


