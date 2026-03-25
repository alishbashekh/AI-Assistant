import dotenv from 'dotenv';
import {GoogleGenAI} from '@google/genai';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

if(!process.env.GEMINI_API_KEY){
    console.error('FATAL ERROR: GEMINI_API_KEY is not set in the enviroment variables');
    process.exit(1);    
}

/**
 * generate flashcards from text
 * @param {string} text - Document text
 * @param {number} count - number of flashcards generated
 * @returns {Promise<Array<{question: string , answer: string, difficulty: string}>>}
 */

export const generateFlashcards = async (text, count = 10 )=>{
    const prompt = `Generate exactly ${count} educational falshcards from the following text.
    Format each flashcard as:
    Q: [clear, specific question]
    A: [concise , accurate answer]
    D: [Difficulty level easy, medium, hard]
    
    seprate each card with flashcard with "----"
    
    Text:
    ${text.substring(0, 15000)}`;

    try{

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: prompt,
        });

        const generatedText = response.text;

        //parse the response
        const flashcards =[];
        const cards = generatedText.split('---').filter(c => c.trim());

        for (const card of cards){
            const lines = card.trim().split('\n');
            let question = '', answer = '', difficulty = 'medium';

        for (const line of lines){
            if (line.startsWith('Q:')){
                question = line.substring(2).trim();
            }else if (line.startsWith('A:')) {
                answer = line.substring(2).trim();
            } else if (line.startsWith('D:')) {
                const diff = line.substring(2).trim().toLowerCase();
                if (['easy','medium','hard'].includes(diff)){
                    difficulty = diff;
                }
            }
        }
        if (question && answer){
            flashcards.push({ question, answer, difficulty });
        }
        }
    return flashcards.slice(0, count);
    } catch (error) {
        console.error('GEMINI API error:', error);
        throw new Error('failed to generate flashcard'); 
    }
};

/**
 * Generate quiz questions
 * @param {string} text  - DOCUMENT TEXT
 * @param {number} numQuestions - number of questions
 * @returns {Promise<Array<{question: string, options: Array, correctAnswer: string, explanation: string, difficulty: string}>>}
 */

export const generateQuiz = async (text, numQuestions = 5)=>{
    const prompt = `generate exactly ${numQuestions} multiple choice questions from the following text.
    Q: [Question]
    01: [Option 1]
    02: [Option 2]
    03: [Option 3]
    04: [Option 4]
    C: [correct option - eactly written above]
    E: [Brief explanation]
    D: [Difficulty: easy, medium, or hard]

    separate questions with "---"

    Text:
    ${text.substring(0, 15000)}`;

    try{
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: prompt,
        });

        const generatedText = response.text;

        const questions = [];
        const questionBlocks = generatedText.split('---').filter(q => q.trim());
       
        for (const block of questionBlocks) {
            const lines = block.trim().split('\n');
            let question = '', options = [], correctAnswer = '', explanation = '', difficulty = 'medium';

            for (const line of lines) {
                const trimmed = line.trim();
                if(trimmed.startsWith('Q:')){
                    question = trimmed.substring(2).trim();
                }else if (trimmed.match(/^0\d:/)){
                    options.push(trimmed.substring(3).trim());
                }else if (trimmed.startsWith('C:')){
                    correctAnswer = trimmed.substring(2).trim();
                }else if (trimmed.startsWith('E:')){
                    explanation = trimmed.substring(2).trim();
                }else if (trimmed.startsWith('D:')){
                    const diff = trimmed.substring(2).trim().toLowerCase();
                    if (['easy','medium','hard'].includes(diff)){
                        difficulty = diff;
                    }
                }
            }
          if(question && options.length === 4 && correctAnswer) {
            questions.push({question, options, correctAnswer, explanation, difficulty});
          }
        }
        return questions.slice(0, numQuestions);
    }catch (error){
        console.error('Gemini api error:', error);
        throw new Error('failed to generate quiz');
    }
};

/**
 * generate document summary
 * @param {string} text - document text
 * @returns {Promise<string>}
 */
export const generateSummary = async (text) =>{
    const prompt = `provide a consice summary of the following text, highlighting the key concepts, main ideas, and keep the summary clear and structured.
    Text:
    ${text.substring(0, 20000)}`;

    try{
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-lite",
            contents: prompt,
        });
        const generatedText = response.text;
        return generatedText
    }catch (error){
        console.error('gemini api error:', error);
        throw new Error('failed to generate summary');        
    }
};

/**
 * chat with document context
 * @param {string} question - user question
 * @param {Array<Object>} chunks - relevant document chunks
 * @returns {Promise<string>}
 */
export const chatWithContext = async (question, chunks)=>{
    const context = chunks.map((c, i)=> `[chunk ${i + 1}]\n${c.content}`).join('\n\n');

    const prompt = `Based on the following context from a document, anlyse the context and answer the user's question and if the answer is not in the context, say so.
    
    context:
    ${context}
    
    Question:
    ${question}
    
    Answer:`;
    
    try{
     const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-lite',
        contents: prompt,
     });
     const generatedText = response.text;
     return generatedText
    } catch (error){
        console.error('Gemini api error:', error);
        throw new Error('failed to process chat request');        
    }
};

/**
 * explain a specific concept
 * @param {string} concept - concept to explain
 * @param {string} context - relevant context
 * @returns {Promise<string>}
 */
export const explainConcept = async (concept, context) => {
    const prompt = `explain the concept of "${concept}" based on the follwing context.
    provide a clear, educational explanation that's easy to understand.
    include examples
    
    context:
    ${context.substring(0,10000)}`;

    try{
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-lite",
        contents: prompt,
      });
      const generatedText = response.text;
      return generatedText
    } catch (error){
        console.error('gemini api error:', error);
        throw new Error('failed to explain concept');
        
    }

};