// recUtils.js

import cosineSimilarityData from './cosine_similarity.json'; // Adjust the path as needed

const getMostSimilarIndex = (index, totalItems) => {
    if (!Array.isArray(cosineSimilarityData) || index >= cosineSimilarityData.length) {
        console.log('No similarity data for this index, moving to index after next');
        return (index + 2) % 1000; // Move to index after next, loop back if necessary
    }

    const simScores = cosineSimilarityData[index];
    console.log(index, Array.isArray(simScores));
    if (!Array.isArray(simScores)) {
        console.error('Similarity scores for this index are not an array');
        return (index + 2) % 1000; // Move to index after next, loop back if necessary
    }

    // Find the index of the most similar item (excluding itself and the next item)
    const mostSimilarIndex = simScores
        .map((score, i) => ({ index: i, score }))
        .filter(item => item.index !== index && item.index !== (index + 1) % totalItems) // Exclude current and next
        .reduce((prev, curr) => (prev.score > curr.score ? prev : curr), { index: (index + 2) % totalItems, score: -1 }).index;

    return mostSimilarIndex;
};

export { getMostSimilarIndex };