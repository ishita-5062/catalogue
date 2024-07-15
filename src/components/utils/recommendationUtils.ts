// src/utils/recommendationUtils.ts

import cosineSimilarityData from '../../cosine_similarity.json';  // Adjust the path as needed

const visitedSet = new Set<number>();

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
            .filter(item =>
                item.index !== index &&
                !visitedSet.has(item.index) &&
                item.index !== (index + 1) % totalItems
            )
            .reduce((prev, curr) => (prev.score > curr.score ? prev : curr), { index: -1, score: -1 }).index;

        if (mostSimilarIndex === -1) {
            // If no unvisited similar item found, move to the next unvisited index
            return (index + 2) % totalItems;
        }

        // Add the chosen index to the visited set
        visitedSet.add(mostSimilarIndex);
    return mostSimilarIndex;
};