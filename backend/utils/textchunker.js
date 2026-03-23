/**
 * split text into chunks for better AI processing
 * @param {string} text - full text to chunk
 * @param {number} chunkSize - target size per chunk (in words)
 * @param {number} overlap - Number of words to overlap between chunks
 * @returns {Array<{content: string, chunkIndex: number, pageNumber: number}>}
 */

export const chunkText = (text, chunkSize = 500, overlap = 50)=>{
    if(!text || text.trim().length === 0){
        return [];
    }

    //clean text while preserving paragragh structure
    const cleanedText = text
    .replace(/\r\n/g, '\n')
    .replace(/\s+/g, ' ')
    .replace(/\n /g, '\n')
    .replace(/\n/g, '\n')
    .trim();

    // try to split by paragraph (single or double newlines)
    const paragraphs = cleanedText.split(/\n+/).filter(p => p.trim().length>0);

    const chunks =[];
    let currentChunk = [];
    let currentWordCount = 0;
    let chunkIndex = 0;

    for(const paragraph of paragraphs){
        const paragraphWords = paragraph.trim().split(/\s+/);
        const paragraphWordCount = paragraphWords.length;


        //
    }


}