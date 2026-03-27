import { count } from 'console';
import Quiz from '../models/Quiz.js';

//@desc get all quizzes for a document
//@route get /api/quizzes/:documentId
export const getQuizzes = async (req, res, next)=>{
    try{
     const quizzes = await Quiz.find({
        userId: req.user._id,
        documentId: req.params.documentId
     })
     .populate('documentId', 'title fileName')
     .sort({ createdAt: -1});

     res.status(200).json({
        success: true,
        count: quizzes.length,
        data: quizzes
     });
    }catch(error){
        next(error)
    }
};

//@desc get a single quiz by id
//@route get /api/quizzes/quiz/:id
export const getQuizById = async (req, res, next)=>{
    try{
    const quiz = await Quiz.findOne({
        _id: req.params.id,
        userId: req.user._id
    });

    if(!quiz){
        return res.status(404).json({
            success: false,
            error: 'Quiz not found',
            statuscode: 404
        });
    }
    res.status(200).json({
        success: true,
        data: quiz
    });
    }catch(error){
        next(error)
    }
};

//@desc submit quiz answer
//@route post /api/quizzes/:id/submit
export const submitQuiz = async (req, res, next)=>{
    try{
        const {answers} = req.body;
        if (!Array.isArray(answers)){
            return res.status(400).json({
                success: false,
                error: 'please provide answers array',
                statuscode: 400
            });
        }
        const quiz = await Quiz.findOne({
            _id: req.params.id,
            userId: req.user._id
        });

        if(!quiz){
            return res.status(404).json({
                success: false,
                error: 'Quiz not found',
            statuscode: 404
            });
        }
        if(quiz.completedAt){
            return res.status(400).json({
                success: false,
                error: 'quiz already completed',
                statuscode: 400
            });
        }

        //process answers
        let correctCount = 0;
        const userAnswers = [];

         answers.forEach(answer=>{
            const {questionIndex, selectedAnswer} = answer;

            if(questionIndex < quiz.questions.length){
             const question = quiz.questions[questionIndex];
             const isCorrect = selectedAnswer === question.correctAnswer;

             if(isCorrect) correctCount ++;
             userAnswers.push({
                questionIndex,
                selectedAnswer,
                isCorrect,
                answeredAt: new Date()
             });
            }
         });
         // calculate score
         const score = Math.round((correctCount / quiz.totalQuestions)*100);
         
         //update quiz
         quiz.userAnswers = userAnswers;
         quiz.score = score;
         quiz.completedAt = new Date();

         await quiz.save();

         res.status(200).json({
            success: true,
            data:{
                quizId: quiz._id,
                score,
                correctCount,
                totalQuestions: quiz.totalQuestions,
                percentage: score,
                userAnswers
            },
            message: 'quiz submited successfully'
         });

    }catch(error){
    next(error)
    }
};

//@desc get quiz results
//@route get /api/quizzes/:id/results
export const getQuizResults = async (req, res, next)=>{
    try{
    const quiz = await Quiz.findOne({
        _id: req.params.id,
        userId: req.user._id
    }).populate('documentId','title');

    if(!quiz){
        return res.status(404).json({
            success: false,
            error: 'quiz not found',
            statuscode: 404
        });
    }

    if(!quiz.completedAt){
        return res.status(400).json({
            success: false,
            error: 'Quiz not completed yet',
            statuscode: 400
        });
    }
    //build detailed results
    const detailedResults = quiz.questions.map((question, index)=>{
        const userAnswer = quiz.userAnswers.find(a => a.questionIndex === index);

        return {
            questionIndex: index,
            question: question.question,
            options: question.options,
            correctAnswer: question.correctAnswer,
            selectedAnswer: userAnswer?.selectedAnswer || null,
            isCorrect: userAnswer?.isCorrect || false,
            explanation: question.explanation
        };
    });
    res.status(200).json({
        success: true,
        data:{
            quiz: {
                id: quiz._id,
                title: quiz.title,
                document: quiz.documentId,
                score: quiz.score,
                totalQuestions: quiz.totalQuestions,
                completedAt: quiz.completedAt
            },
            results: detailedResults
        }
    });

    }catch(error){
     next(error)
    }
};

//@desc delete quiz
//@route delete /api/quizzes/:id
export const deleteQuiz = async (req, res, next)=>{
    try{
    const quiz = await Quiz.findOne({
        _id: req.params.id,
        userId: req.user._id
    });

    if(!quiz){
        return res.status(404).json({
            success: false,
            error: 'quiz not found',
            statuscode: 404
        });
    }
    await quiz.deleteOne();
    res.status(200).json({
        success: true,
        message: 'quiz deleted successfully'
    });
    }catch(error){
        next(error)
    }
};