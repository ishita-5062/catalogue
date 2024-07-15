// src/utils/recommendationUtils.ts

import cosineSimilarityData from '../../cosine_similarity.json';  // Adjust the path as needed

export const getMostSimilarIndex = (index: number, totalItems: number): number => {
    if (!Array.isArray(cosineSimilarityData) || index >= cosineSimilarityData.length) {
        console.log('No similarity data for this index, moving to index after next');
        return (index + 2) % totalItems; // Move to index after next, loop back if necessary
    }

    const simScores = cosineSimilarityData[index];
    if (!Array.isArray(simScores)) {
        console.error('Similarity scores for this index are not an array');
        return (index + 2) % totalItems; // Move to index after next, loop back if necessary
    }

    const mostSimilarIndex = simScores
        .map((score, i) => ({ index: i, score }))
        .filter(item => item.index !== index && item.index !== (index + 1) % totalItems)
        .reduce((prev, curr) => (prev.score > curr.score ? prev : curr), { index: (index + 2) % totalItems, score: -1 }).index;

    return mostSimilarIndex;
};