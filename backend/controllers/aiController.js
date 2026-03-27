import Document  from "../models/Document.js";
import Flashcard from "../models/Flashcard.js";
import Quiz from '../models/Quiz.js';
import ChatHistory from '../models/ChatHistory.js';
import * as geminiService from '../utils/geminiService.js';
import { findRelevantChunks } from "../utils/textchunker.js";
import ChatHistroy from "../models/ChatHistory.js";

//@desc generate flashcards from document 
//@route POST /api/ai/generate-flashcards
export const generateFlashcards = async (req, res, next)=>{
    try{
     const { documentId, count = 10} = req.body;
     if(!documentId){
        return res.status(400).json({
            success: false,
            error: 'please provide documentId',
            statuscode: 400
        });
     }

     const document = await Document.findOne({
        _id: documentId,
        userId: req.user._id,
        status: 'ready'
     });

     if(!document){
        return res.status(404).json({
            success: false,
            error: 'Document not found or not ready',
            statuscode: 404
        });
     }
     // generate flashcards using gemini
     const cards = await geminiService.generateFlashcards(
        document.extractedText,
        parseInt(count)
     );

     //save to database
     const flashcardSet = await Flashcard.create({
        userId: req.user._id,
        documentId: document._id,
        cards: cards.map(card=>({
            question: card.question,
            answer: card.answer,
            difficulty: card.difficulty,
            reviewCount: 0,
            isStarred: false
        }))
     });
     res.status(201).json({
        success: true,
        data: flashcardSet,
        message: 'Flashcards generated successfully'
     });
    }catch (error){
        next(error);
    }
};

//@desc generate quiz from a document
//@route POST /api/ai/generate-quiz
export const generateQuiz = async (req, res, next)=>{
    try{
     const { documentId, numQuestions = 5, title } = req.body;

     if(!documentId){
        return res.status(400).json({
            success: false,
            error: 'please provide documentId',
            statuscode: 400
        });
     }

     const document = await Document.findOne({
        _id: documentId,
        userId: req.user._id,
        status: 'ready'
     });

     if(!document) {
        return res.status(404).json({
            success: false,
            error: 'Document not found or ready',
            statuscode: 404
        });
     }
     //generate quiz using Gemini 
     const questions = await geminiService.generateQuiz(
        document.extractedText,
        parseInt(numQuestions)
     );

     //save to database
     const quiz = await Quiz.create({
        userId: req.user._id,
        documentId: document._id,
        title: title || `${document.title} - Quiz`,
        questions: questions,
        totalQuestions: questions.length,
        userAnswers: [],
        score: 0
     });

     res.status(201).json({
        success: true,
        data: quiz,
        message: 'Quiz generated successfully'
     });
    }catch(error){
        next(error)
    }
};

//@desc generate document summary
//@route POST /api/ai/generate-summary
export const generateSummary = async (req, res, next)=>{
    try{
      const { documentId } = req.body;

      if(!documentId) {
        return res.status(400).json({
            success: false,
            error: 'please provide documentId',
            statuscode: 400
        });
      }
      const document = await Document.findOne({
        _id: documentId,
        userId: req.user._id,
        status: 'ready'
      });

      if(!document){
        return res.status(404).json({
            success: false,
            error: 'document not found or not ready',
            statuscode: 404
        });
      }

      //generate summary using gemini
      const summary = await geminiService.generateSummary(document.extractedText);

      res.status(200).json({
        success: true,
        data:{
            documentId: document._id,
            title: document.title,
            summary
        },
        message: 'summary generated successfully'
      });

    }catch(error){
        next(error)
    }
};

//@desc chat with document
//@route POST /api/ai/chat
export const chat = async (req, res, next)=>{
   try{
    const { documentId, question } = req.body;

    if(!documentId || !question){
        return res.status(400).json({
            success: false,
            error: 'please provide documentId and question',
            statuscode: 400
        });
    }

    const document = await Document.findOne({
        _id: documentId,
        userId: req.user._id,
        status: 'ready'
    });

    if(!document){
        return res.status(404).json({
            success: false,
            error: 'Document not found or not ready',
            statuscode: 404
        });       
    }

    // find relevent chunks
    const relevantChunks = findRelevantChunks(document.chunks, question, 3);
    const chunkIndices = relevantChunks.map(c=> c.chunkIndex);
    
    //get or create chat history 
    let ChatHistory = await ChatHistroy.findOne({
        userId: req.user._id,
        documentId: document._id
    });

    if(!ChatHistory){
        ChatHistory = await ChatHistory.create({
            userId: req.user._id,
            documentId: document._id,
            message: []
        });
    }
    // generate response using gemini 
    const answer = await geminiService.chatWithContext(question, relevantChunks);

    //save conversation
    ChatHistory.message.push(
        {
            role: 'user',
            content: question,
            timestamp: new Date(),
            relevantChunks: []
        },
        {
            role: 'assistant',
            content: answer,
            timestamp: new Date(),
            relevantChunks: chunkIndices
        }
    );
    await ChatHistory.save();
    res.status(200).json({
        success: true,
        data: {
            question,
            answer,
            relevantChunks: chunkIndices,
            ChatHistoryId: ChatHistory._id
        },
        message: 'response generated successfully'
    });
   }catch(error){
    next(error)
   }
};

//@desc explain concept from document 
//@route POST /api/ai/explain-concept
export const explainConcept = async (req, res, next)=>{
    try{
      const { documentId, concept } = req.body;

      if(!documentId || !concept){
        return res.status(400).json({
            success: false,
            error: 'please provide documentId and concept',
            statuscode: 400
        });
      }

      const document = await Document.findOne({
        _id: documentId,
        userId: req.user._id,
        status: 'ready'
      });

     if(!document){
        return res.status(404).json({
            success: false,
            error: 'Document not found or not ready',
            statuscode: 404
        });
     }

     //find relevant chunks for the concept 
     const relevantChunks = findRelevantChunks(document.chunks, concept, 3);
     const context = relevantChunks.map(c => c.content).join('\n\n');

     //generate explaination using gemini 
     const explanation = await geminiService.explainConcept(concept, context);
     res.status(200).json({
        success: true,
        data: {
            concept,
            explanation,
            relevantChunks: relevantChunks.map(c=>c.chunkIndex)
        },
        message: 'explanation generated sucessfully'
     });
    }catch(error){
        next(error)
    }
};

//@desc get chat history for a document
//@route GET /api/ai/chat-history/:documentId
export const getChatHitory = async (req, res, next)=>{
    try{
   const  { documentId } = req.params;

   if(!documentId){
    return res.status(400).json({
        success: false,
        error: 'please provide documentId',
        statuscode: 400
    });
   }

   const ChatHistory = await ChatHistroy.findOne({
    userId: req.user._id,
    documentId: documentId
   }).select('messages');

   if (!ChatHistory){
    return res.status(200).json({
        success: true,
        data: [],
        message: 'No chat history found for this document'
    });
   }
    
   res.status(200).json({
    success: true,
    data: ChatHistory.messages,
    message: 'chat histroy recived successfully'
   });
    }catch(error){
        next(error)
    }
};


