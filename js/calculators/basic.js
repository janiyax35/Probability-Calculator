/**
 * Basic Probability Calculators
 * Contains calculator functions for basic probability concepts
 * Random Variables & Probability Distributions
 */

// Global variables to store calculator states
let calculatorState = {
    sampleSpace: {
        outcomes: [],
        favorableOutcomes: []
    },
    conditional: {
        intersectionProbability: 0
    },
    bayes: {
        priorProbabilities: [],
        normalizedPriors: []
    },
    independence: {
        observed: [],
        expected: []
    }
};

/**
 * =============================================
 * SAMPLE SPACE & PROBABILITY CALCULATOR FUNCTIONS
 * =============================================
 */

/**
 * Calculates probability from coin toss scenarios
 * @param {Object} params - Calculator parameters
 * @returns {Object} - Results including probability, steps, etc.
 */
function calculateCoinProbability(params) {
    const { numCoins, eventType, kHeads } = params;
    
    // Calculate total outcomes
    const totalOutcomes = Math.pow(2, numCoins);
    
    let favorableOutcomes = 0;
    let eventDescription = '';
    let sampleSpace = [];
    let eventSpace = [];
    let steps = [];
    
    // Generate sample space for display (limit to reasonable size)
    if (numCoins <= 4) {
        sampleSpace = generateCoinTossSampleSpace(numCoins);
    }
    
    // Calculate favorable outcomes based on event type
    switch(eventType) {
        case 'allHeads':
            favorableOutcomes = 1;
            eventDescription = 'All coins showing heads';
            eventSpace = sampleSpace.filter(outcome => outcome.split('').every(x => x === 'H'));
            break;
            
        case 'allTails':
            favorableOutcomes = 1;
            eventDescription = 'All coins showing tails';
            eventSpace = sampleSpace.filter(outcome => outcome.split('').every(x => x === 'T'));
            break;
            
        case 'atLeastOneHead':
            favorableOutcomes = totalOutcomes - 1;
            eventDescription = 'At least one coin showing heads';
            eventSpace = sampleSpace.filter(outcome => outcome.includes('H'));
            break;
            
        case 'exactHeads':
            favorableOutcomes = combination(numCoins, kHeads);
            eventDescription = `Exactly ${kHeads} coin(s) showing heads`;
            eventSpace = sampleSpace.filter(outcome => 
                outcome.split('').filter(x => x === 'H').length === kHeads);
            break;
            
        case 'moreThanHeads':
            for (let i = kHeads + 1; i <= numCoins; i++) {
                favorableOutcomes += combination(numCoins, i);
            }
            eventDescription = `More than ${kHeads} coin(s) showing heads`;
            eventSpace = sampleSpace.filter(outcome => 
                outcome.split('').filter(x => x === 'H').length > kHeads);
            break;
            
        case 'lessThanHeads':
            for (let i = 0; i < kHeads; i++) {
                favorableOutcomes += combination(numCoins, i);
            }
            eventDescription = `Less than ${kHeads} coin(s) showing heads`;
            eventSpace = sampleSpace.filter(outcome => 
                outcome.split('').filter(x => x === 'H').length < kHeads);
            break;
    }
    
    // Calculate probability
    const probability = favorableOutcomes / totalOutcomes;
    
    // Create steps
    steps = [
        `Step 1: Identify the sample space. For ${numCoins} coin(s), there are ${totalOutcomes} possible outcomes.`,
        `Step 2: Identify the event "${eventDescription}". This event has ${favorableOutcomes} favorable outcomes.`,
        `Step 3: Calculate the probability using the formula: P(Event) = Number of favorable outcomes / Total number of outcomes.`,
        `Step 4: P(Event) = ${favorableOutcomes} / ${totalOutcomes} = ${probability.toFixed(6)}`
    ];
    
    // Store in calculator state
    calculatorState.sampleSpace.outcomes = sampleSpace;
    calculatorState.sampleSpace.favorableOutcomes = eventSpace;
    
    return {
        probability,
        favorableOutcomes,
        totalOutcomes,
        eventDescription,
        steps,
        sampleSpace: sampleSpace.length <= 20 ? sampleSpace : [],
        eventSpace: eventSpace.length <= 20 ? eventSpace : []
    };
}

/**
 * Calculates probability from dice roll scenarios
 * @param {Object} params - Calculator parameters
 * @returns {Object} - Results including probability, steps, etc.
 */
function calculateDiceProbability(params) {
    const { numDice, eventType, kSum } = params;
    
    // Calculate total outcomes
    const totalOutcomes = Math.pow(6, numDice);
    
    let favorableOutcomes = 0;
    let eventDescription = '';
    let sampleSpace = [];
    let eventSpace = [];
    let steps = [];
    
    // Generate sample space for display (limit to reasonable size)
    if (numDice <= 2) {
        sampleSpace = generateDiceRollSampleSpace(numDice);
    }
    
    // Calculate favorable outcomes based on event type
    if (numDice === 1) {
        switch(eventType) {
            case 'sum':
                favorableOutcomes = (kSum >= 1 && kSum <= 6) ? 1 : 0;
                eventDescription = `Die showing ${kSum}`;
                eventSpace = sampleSpace.filter(outcome => parseInt(outcome) === kSum);
                break;
                
            case 'sumGreater':
                favorableOutcomes = (kSum < 6) ? 6 - kSum : 0;
                eventDescription = `Die showing greater than ${kSum}`;
                eventSpace = sampleSpace.filter(outcome => parseInt(outcome) > kSum);
                break;
                
            case 'sumLess':
                favorableOutcomes = (kSum > 1) ? kSum - 1 : 0;
                eventDescription = `Die showing less than ${kSum}`;
                eventSpace = sampleSpace.filter(outcome => parseInt(outcome) < kSum);
                break;
                
            case 'allSame':
                favorableOutcomes = 1; // Trivial for 1 die
                eventDescription = `Die showing same value (trivial for 1 die)`;
                eventSpace = sampleSpace;
                break;
                
            case 'evenSum':
                favorableOutcomes = 3; // 2, 4, 6
                eventDescription = `Die showing even number (2, 4, 6)`;
                eventSpace = sampleSpace.filter(outcome => parseInt(outcome) % 2 === 0);
                break;
                
            case 'oddSum':
                favorableOutcomes = 3; // 1, 3, 5
                eventDescription = `Die showing odd number (1, 3, 5)`;
                eventSpace = sampleSpace.filter(outcome => parseInt(outcome) % 2 === 1);
                break;
        }
    } else if (numDice === 2) {
        // Convert sample space to sums for 2 dice
        const sampleSpaceSums = sampleSpace.map(outcome => {
            const [d1, d2] = outcome.split(',').map(x => parseInt(x));
            return d1 + d2;
        });
        
        switch(eventType) {
            case 'sum':
                // For 2 dice, sum k can occur in min(k-1, 13-k, 6) ways
                favorableOutcomes = Math.max(0, Math.min(kSum - 1, 13 - kSum, 6));
                eventDescription = `Sum of dice equals ${kSum}`;
                eventSpace = sampleSpace.filter((outcome, index) => sampleSpaceSums[index] === kSum);
                break;
                
            case 'sumGreater':
                // Count outcomes with sum > k
                favorableOutcomes = 0;
                for (let sum of sampleSpaceSums) {
                    if (sum > kSum) favorableOutcomes++;
                }
                eventDescription = `Sum of dice greater than ${kSum}`;
                eventSpace = sampleSpace.filter((outcome, index) => sampleSpaceSums[index] > kSum);
                break;
                
            case 'sumLess':
                // Count outcomes with sum < k
                favorableOutcomes = 0;
                for (let sum of sampleSpaceSums) {
                    if (sum < kSum) favorableOutcomes++;
                }
                eventDescription = `Sum of dice less than ${kSum}`;
                eventSpace = sampleSpace.filter((outcome, index) => sampleSpaceSums[index] < kSum);
                break;
                
            case 'allSame':
                favorableOutcomes = 6; // (1,1), (2,2), ..., (6,6)
                eventDescription = `Both dice showing same value`;
                eventSpace = sampleSpace.filter(outcome => {
                    const [d1, d2] = outcome.split(',').map(x => parseInt(x));
                    return d1 === d2;
                });
                break;
                
            case 'evenSum':
                favorableOutcomes = 18; // Half of all outcomes
                eventDescription = `Sum of dice is even`;
                eventSpace = sampleSpace.filter((outcome, index) => sampleSpaceSums[index] % 2 === 0);
                break;
                
            case 'oddSum':
                favorableOutcomes = 18; // Half of all outcomes
                eventDescription = `Sum of dice is odd`;
                eventSpace = sampleSpace.filter((outcome, index) => sampleSpaceSums[index] % 2 === 1);
                break;
        }
    } else {
        // For 3+ dice, we just provide an estimate (exact calculation would be complex)
        eventDescription = `Event for ${numDice} dice (simplified calculation)`;
        
        switch(eventType) {
            case 'sum':
                // Approximate for 3+ dice using normal approximation
                const mean = numDice * 3.5; // Expected value for each die is 3.5
                const stdDev = Math.sqrt(numDice * 35/12); // Variance for each die is 35/12
                
                // Probability of sum = k is approximately 1/stdDev
                favorableOutcomes = totalOutcomes / (stdDev * Math.sqrt(2 * Math.PI));
                eventDescription = `Sum of dice equals ${kSum} (approximated)`;
                break;
                
            case 'sumGreater':
                // Approximate using normal CDF
                const meanG = numDice * 3.5;
                const stdDevG = Math.sqrt(numDice * 35/12);
                const zScore = (kSum - meanG) / stdDevG;
                const prob = 1 - normalCDF(zScore, 0, 1);
                favorableOutcomes = Math.round(prob * totalOutcomes);
                eventDescription = `Sum of dice greater than ${kSum} (approximated)`;
                break;
                
            case 'sumLess':
                // Approximate using normal CDF
                const meanL = numDice * 3.5;
                const stdDevL = Math.sqrt(numDice * 35/12);
                const zScoreL = (kSum - meanL) / stdDevL;
                const probL = normalCDF(zScoreL, 0, 1);
                favorableOutcomes = Math.round(probL * totalOutcomes);
                eventDescription = `Sum of dice less than ${kSum} (approximated)`;
                break;
                
            case 'allSame':
                favorableOutcomes = 6; // All dice showing the same face
                eventDescription = `All dice showing same value`;
                break;
                
            case 'evenSum':
                favorableOutcomes = totalOutcomes / 2; // Half of outcomes
                eventDescription = `Sum of dice is even`;
                break;
                
            case 'oddSum':
                favorableOutcomes = totalOutcomes / 2; // Half of outcomes
                eventDescription = `Sum of dice is odd`;
                break;
        }
    }
    
    // Calculate probability
    const probability = favorableOutcomes / totalOutcomes;
    
    // Create steps
    steps = [
        `Step 1: Identify the sample space. For ${numDice} dice, there are ${totalOutcomes} possible outcomes.`,
        `Step 2: Identify the event "${eventDescription}". This event has ${favorableOutcomes} favorable outcomes.`,
        `Step 3: Calculate the probability using the formula: P(Event) = Number of favorable outcomes / Total number of outcomes.`,
        `Step 4: P(Event) = ${favorableOutcomes} / ${totalOutcomes} = ${probability.toFixed(6)}`
    ];
    
    // Store in calculator state
    calculatorState.sampleSpace.outcomes = sampleSpace;
    calculatorState.sampleSpace.favorableOutcomes = eventSpace;
    
    return {
        probability,
        favorableOutcomes,
        totalOutcomes,
        eventDescription,
        steps,
        sampleSpace: sampleSpace.length <= 20 ? sampleSpace : [],
        eventSpace: eventSpace.length <= 20 ? eventSpace : []
    };
}

/**
 * Calculates probability from card drawing scenarios
 * @param {Object} params - Calculator parameters
 * @returns {Object} - Results including probability, steps, etc.
 */
function calculateCardProbability(params) {
    const { numCards, eventType, kCards } = params;
    
    // Calculate total outcomes
    const totalOutcomes = combination(52, numCards);
    
    let favorableOutcomes = 0;
    let eventDescription = '';
    let steps = [];
    
    // Calculate favorable outcomes based on event type
    switch(eventType) {
        case 'allSpades':
            favorableOutcomes = combination(13, numCards);
            eventDescription = 'All cards are spades';
            break;
            
        case 'allFace':
            favorableOutcomes = combination(12, numCards);
            eventDescription = 'All cards are face cards (J, Q, K)';
            break;
            
        case 'atLeastOneAce':
            // P(at least one ace) = 1 - P(no aces)
            favorableOutcomes = totalOutcomes - combination(48, numCards);
            eventDescription = 'At least one ace';
            break;
            
        case 'noHearts':
            favorableOutcomes = combination(39, numCards);
            eventDescription = 'No hearts';
            break;
            
        case 'exactRed':
            if (kCards <= numCards) {
                favorableOutcomes = combination(26, kCards) * combination(26, numCards - kCards);
            }
            eventDescription = `Exactly ${kCards} red card(s)`;
            break;
            
        case 'exactFace':
            if (kCards <= numCards && kCards <= 12) {
                favorableOutcomes = combination(12, kCards) * combination(40, numCards - kCards);
            }
            eventDescription = `Exactly ${kCards} face card(s)`;
            break;
    }
    
    // Calculate probability
    const probability = favorableOutcomes / totalOutcomes;
    
    // Create steps
    steps = [
        `Step 1: Identify the total number of ways to draw ${numCards} cards from a deck of 52 cards.`,
        `Total outcomes = C(52,${numCards}) = ${totalOutcomes}`,
        `Step 2: Identify the number of favorable outcomes for the event "${eventDescription}".`
    ];
    
    // Add explanation based on event type
    switch(eventType) {
        case 'allSpades':
            steps.push(`There are 13 spades in the deck, so the number of ways to draw ${numCards} spades is C(13,${numCards}) = ${favorableOutcomes}`);
            break;
            
        case 'allFace':
            steps.push(`There are 12 face cards in the deck, so the number of ways to draw ${numCards} face cards is C(12,${numCards}) = ${favorableOutcomes}`);
            break;
            
        case 'atLeastOneAce':
            steps.push(`To find the number of ways to get at least one ace, we subtract the number of ways to get no aces from the total.`);
            steps.push(`Number of ways to get no aces = C(48,${numCards}) = ${combination(48, numCards)}`);
            steps.push(`Number of ways to get at least one ace = ${totalOutcomes} - ${combination(48, numCards)} = ${favorableOutcomes}`);
            break;
            
        case 'noHearts':
            steps.push(`There are 39 non-heart cards in the deck, so the number of ways to draw ${numCards} non-heart cards is C(39,${numCards}) = ${favorableOutcomes}`);
            break;
            
        case 'exactRed':
            steps.push(`There are 26 red cards and 26 black cards in the deck.`);
            steps.push(`Number of ways to get exactly ${kCards} red cards = C(26,${kCards}) × C(26,${numCards - kCards}) = ${combination(26, kCards)} × ${combination(26, numCards - kCards)} = ${favorableOutcomes}`);
            break;
            
        case 'exactFace':
            steps.push(`There are 12 face cards and 40 non-face cards in the deck.`);
            steps.push(`Number of ways to get exactly ${kCards} face cards = C(12,${kCards}) × C(40,${numCards - kCards}) = ${combination(12, kCards)} × ${combination(40, numCards - kCards)} = ${favorableOutcomes}`);
            break;
    }
    
    steps.push(`Step 3: Calculate the probability using the formula: P(Event) = Number of favorable outcomes / Total number of outcomes.`);
    steps.push(`Step 4: P(Event) = ${favorableOutcomes} / ${totalOutcomes} = ${probability.toFixed(6)}`);
    
    return {
        probability,
        favorableOutcomes,
        totalOutcomes,
        eventDescription,
        steps,
        sampleSpace: [], // Too large to display
        eventSpace: [] // Too large to display
    };
}

/**
 * =============================================
 * CONDITIONAL PROBABILITY CALCULATOR FUNCTIONS
 * =============================================
 */

/**
 * Calculates basic conditional probability
 * @param {Object} params - Calculator parameters
 * @returns {Object} - Results including conditional probability, steps, etc.
 */
function calculateBasicConditional(params) {
    const { pA, pB, pAandB, conditionalType } = params;
    
    // Validate inputs
    if (pA < 0 || pA > 1 || pB < 0 || pB > 1 || pAandB < 0 || pAandB > 1) {
        return {
            error: 'All probabilities must be between 0 and 1.'
        };
    }
    
    if (pAandB > Math.min(pA, pB)) {
        return {
            error: 'P(A∩B) cannot be greater than both P(A) and P(B).'
        };
    }
    
    let result, formula, interpretation, steps;
    
    if (conditionalType === 'AgivenB') {
        // P(A|B) = P(A∩B) / P(B)
        if (pB === 0) {
            return {
                error: 'P(B) cannot be zero for calculating P(A|B).'
            };
        }
        
        result = pAandB / pB;
        formula = `P(A|B) = \\frac{P(A \\cap B)}{P(B)} = \\frac{${pAandB}}{${pB}} = ${result.toFixed(6)}`;
        interpretation = `The probability of event A occurring given that event B has occurred is ${(result * 100).toFixed(2)}%.`;
        
        // Store for later use
        calculatorState.conditional.intersectionProbability = pAandB;
        
        steps = [
            `Step 1: Identify the values from the input.`,
            `P(A) = ${pA}`,
            `P(B) = ${pB}`,
            `P(A∩B) = ${pAandB}`,
            `Step 2: Apply the conditional probability formula.`,
            `P(A|B) = P(A∩B) / P(B)`,
            `Step 3: Substitute the values into the formula.`,
            `P(A|B) = ${pAandB} / ${pB} = ${result.toFixed(6)}`
        ];
    } else {
        // P(B|A) = P(A∩B) / P(A)
        if (pA === 0) {
            return {
                error: 'P(A) cannot be zero for calculating P(B|A).'
            };
        }
        
        result = pAandB / pA;
        formula = `P(B|A) = \\frac{P(A \\cap B)}{P(A)} = \\frac{${pAandB}}{${pA}} = ${result.toFixed(6)}`;
        interpretation = `The probability of event B occurring given that event A has occurred is ${(result * 100).toFixed(2)}%.`;
        
        // Store for later use
        calculatorState.conditional.intersectionProbability = pAandB;
        
        steps = [
            `Step 1: Identify the values from the input.`,
            `P(A) = ${pA}`,
            `P(B) = ${pB}`,
            `P(A∩B) = ${pAandB}`,
            `Step 2: Apply the conditional probability formula.`,
            `P(B|A) = P(A∩B) / P(A)`,
            `Step 3: Substitute the values into the formula.`,
            `P(B|A) = ${pAandB} / ${pA} = ${result.toFixed(6)}`
        ];
    }
    
    return {
        result,
        formula,
        interpretation,
        steps
    };
}

/**
 * Calculates medical test probabilities using conditional probability
 * @param {Object} params - Calculator parameters
 * @returns {Object} - Results including probability, steps, etc.
 */
function calculateMedicalTest(params) {
    const { prevalence, sensitivity, specificity, calculationType } = params;
    
    // Validate inputs
    if (prevalence < 0 || prevalence > 1 || sensitivity < 0 || sensitivity > 1 || specificity < 0 || specificity > 1) {
        return {
            error: 'All probabilities must be between 0 and 1.'
        };
    }
    
    // Calculate probabilities
    const pD = prevalence; // P(D) - probability of disease
    const pNotD = 1 - pD; // P(D') - probability of no disease
    const pTgivenD = sensitivity; // P(T|D) - probability of positive test given disease
    const pNotTgivenNotD = specificity; // P(T'|D') - probability of negative test given no disease
    const pTgivenNotD = 1 - pNotTgivenNotD; // P(T|D') - probability of positive test given no disease
    const pNotTgivenD = 1 - pTgivenD; // P(T'|D) - probability of negative test given disease
    
    // Calculate P(T) - probability of positive test
    const pT = pTgivenD * pD + pTgivenNotD * pNotD;
    // Calculate P(T') - probability of negative test
    const pNotT = pNotTgivenD * pD + pNotTgivenNotD * pNotD;
    
    let result, formula, interpretation, steps;
    
    switch(calculationType) {
        case 'positivePredictive':
            // P(D|T) - Positive Predictive Value
            result = (pTgivenD * pD) / pT;
            formula = `P(D|T) = \\frac{P(T|D) \\cdot P(D)}{P(T)} = \\frac{${pTgivenD} \\cdot ${pD}}{${pT.toFixed(6)}} = ${result.toFixed(6)}`;
            interpretation = `The positive predictive value is ${(result * 100).toFixed(2)}%. This means that if a patient tests positive, there is a ${(result * 100).toFixed(2)}% chance they actually have the disease.`;
            break;
            
        case 'negativePredictive':
            // P(D'|T') - Negative Predictive Value
            result = (pNotTgivenNotD * pNotD) / pNotT;
            formula = `P(\\neg D|\\neg T) = \\frac{P(\\neg T|\\neg D) \\cdot P(\\neg D)}{P(\\neg T)} = \\frac{${pNotTgivenNotD} \\cdot ${pNotD}}{${pNotT.toFixed(6)}} = ${result.toFixed(6)}`;
            interpretation = `The negative predictive value is ${(result * 100).toFixed(2)}%. This means that if a patient tests negative, there is a ${(result * 100).toFixed(2)}% chance they truly do not have the disease.`;
            break;
            
        case 'falsePositive':
            // P(D'|T) - False Discovery Rate
            result = (pTgivenNotD * pNotD) / pT;
            formula = `P(\\neg D|T) = \\frac{P(T|\\neg D) \\cdot P(\\neg D)}{P(T)} = \\frac{${pTgivenNotD} \\cdot ${pNotD}}{${pT.toFixed(6)}} = ${result.toFixed(6)}`;
            interpretation = `The false discovery rate is ${(result * 100).toFixed(2)}%. This means that if a patient tests positive, there is a ${(result * 100).toFixed(2)}% chance they do not have the disease (false positive).`;
            break;
            
        case 'falseNegative':
            // P(D|T') - False Omission Rate
            result = (pNotTgivenD * pD) / pNotT;
            formula = `P(D|\\neg T) = \\frac{P(\\neg T|D) \\cdot P(D)}{P(\\neg T)} = \\frac{${pNotTgivenD} \\cdot ${pD}}{${pNotT.toFixed(6)}} = ${result.toFixed(6)}`;
            interpretation = `The false omission rate is ${(result * 100).toFixed(2)}%. This means that if a patient tests negative, there is a ${(result * 100).toFixed(2)}% chance they actually have the disease (false negative).`;
            break;
    }
    
    steps = [
        `Step 1: Identify the values from the input.`,
        `P(D) = ${pD} (Prevalence)`,
        `P(T|D) = ${pTgivenD} (Sensitivity)`,
        `P(T'|D') = ${pNotTgivenNotD} (Specificity)`,
        `Step 2: Calculate additional probabilities.`,
        `P(D') = 1 - P(D) = 1 - ${pD} = ${pNotD}`,
        `P(T|D') = 1 - P(T'|D') = 1 - ${pNotTgivenNotD} = ${pTgivenNotD}`,
        `P(T'|D) = 1 - P(T|D) = 1 - ${pTgivenD} = ${pNotTgivenD}`,
        `Step 3: Calculate the total probability using the law of total probability.`
    ];
    
    switch(calculationType) {
        case 'positivePredictive':
        case 'falsePositive':
            steps.push(`P(T) = P(T|D) · P(D) + P(T|D') · P(D')`);
            steps.push(`P(T) = ${pTgivenD} · ${pD} + ${pTgivenNotD} · ${pNotD} = ${(pTgivenD * pD).toFixed(6)} + ${(pTgivenNotD * pNotD).toFixed(6)} = ${pT.toFixed(6)}`);
            break;
            
        case 'negativePredictive':
        case 'falseNegative':
            steps.push(`P(T') = P(T'|D) · P(D) + P(T'|D') · P(D')`);
            steps.push(`P(T') = ${pNotTgivenD} · ${pD} + ${pNotTgivenNotD} · ${pNotD} = ${(pNotTgivenD * pD).toFixed(6)} + ${(pNotTgivenNotD * pNotD).toFixed(6)} = ${pNotT.toFixed(6)}`);
            break;
    }
    
    steps.push(`Step 4: Apply Bayes' Theorem to calculate the desired probability.`);
    
    switch(calculationType) {
        case 'positivePredictive':
            steps.push(`P(D|T) = [P(T|D) · P(D)] / P(T)`);
            steps.push(`P(D|T) = [${pTgivenD} · ${pD}] / ${pT.toFixed(6)} = ${(pTgivenD * pD).toFixed(6)} / ${pT.toFixed(6)} = ${result.toFixed(6)}`);
            break;
            
        case 'negativePredictive':
            steps.push(`P(D'|T') = [P(T'|D') · P(D')] / P(T')`);
            steps.push(`P(D'|T') = [${pNotTgivenNotD} · ${pNotD}] / ${pNotT.toFixed(6)} = ${(pNotTgivenNotD * pNotD).toFixed(6)} / ${pNotT.toFixed(6)} = ${result.toFixed(6)}`);
            break;
            
        case 'falsePositive':
            steps.push(`P(D'|T) = [P(T|D') · P(D')] / P(T)`);
            steps.push(`P(D'|T) = [${pTgivenNotD} · ${pNotD}] / ${pT.toFixed(6)} = ${(pTgivenNotD * pNotD).toFixed(6)} / ${pT.toFixed(6)} = ${result.toFixed(6)}`);
            break;
            
        case 'falseNegative':
            steps.push(`P(D|T') = [P(T'|D) · P(D)] / P(T')`);
            steps.push(`P(D|T') = [${pNotTgivenD} · ${pD}] / ${pNotT.toFixed(6)} = ${(pNotTgivenD * pD).toFixed(6)} / ${pNotT.toFixed(6)} = ${result.toFixed(6)}`);
            break;
    }
    
    return {
        result,
        formula,
        interpretation,
        steps
    };
}

/**
 * =============================================
 * BAYES' THEOREM CALCULATOR FUNCTIONS
 * =============================================
 */

/**
 * Calculates posterior probability using standard Bayes' Theorem
 * @param {Object} params - Calculator parameters
 * @returns {Object} - Results including posterior probability, steps, etc.
 */
function calculateStandardBayes(params) {
    const { priorProbability, likelihood, unlikelihood } = params;
    
    // Validate inputs
    if (priorProbability < 0 || priorProbability > 1 || likelihood < 0 || likelihood > 1 || unlikelihood < 0 || unlikelihood > 1) {
        return {
            error: 'All probabilities must be between 0 and 1.'
        };
    }
    
    // Calculate posterior probability using Bayes' Theorem
    const prior = priorProbability;
    const notPrior = 1 - prior;
    const marginal = likelihood * prior + unlikelihood * notPrior;
    
    if (marginal === 0) {
        return {
            error: 'Cannot calculate posterior probability. The marginal probability P(B) is zero.'
        };
    }
    
    const posterior = (likelihood * prior) / marginal;
    
    // Prepare formula display
    const formula = `P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B|A) \\cdot P(A) + P(B|\\neg A) \\cdot P(\\neg A)} = \\frac{${likelihood} \\cdot ${prior}}{${likelihood} \\cdot ${prior} + ${unlikelihood} \\cdot ${notPrior}} = \\frac{${(likelihood * prior).toFixed(6)}}{${marginal.toFixed(6)}} = ${posterior.toFixed(6)}`;
    
    // Prepare interpretation
    let interpretation;
    if (posterior > prior) {
        interpretation = `The posterior probability P(A|B) is ${(posterior * 100).toFixed(2)}%. This is higher than the prior probability of ${(prior * 100).toFixed(2)}%, indicating that the evidence B increases our belief in hypothesis A.`;
    } else if (posterior < prior) {
        interpretation = `The posterior probability P(A|B) is ${(posterior * 100).toFixed(2)}%. This is lower than the prior probability of ${(prior * 100).toFixed(2)}%, indicating that the evidence B decreases our belief in hypothesis A.`;
    } else {
        interpretation = `The posterior probability P(A|B) is ${(posterior * 100).toFixed(2)}%. This is equal to the prior probability, indicating that the evidence B does not affect our belief in hypothesis A.`;
    }
    
    // Prepare solution steps
    const steps = [
        `Step 1: Identify the values from the input.`,
        `P(A) = ${prior} (Prior probability)`,
        `P(B|A) = ${likelihood} (Likelihood)`,
        `P(B|¬A) = ${unlikelihood} (Unlikelihood)`,
        `P(¬A) = 1 - P(A) = 1 - ${prior} = ${notPrior}`,
        `Step 2: Calculate the marginal probability P(B) using the law of total probability.`,
        `P(B) = P(B|A) · P(A) + P(B|¬A) · P(¬A)`,
        `P(B) = ${likelihood} · ${prior} + ${unlikelihood} · ${notPrior} = ${(likelihood * prior).toFixed(6)} + ${(unlikelihood * notPrior).toFixed(6)} = ${marginal.toFixed(6)}`,
        `Step 3: Apply Bayes' Theorem to calculate the posterior probability.`,
        `P(A|B) = [P(B|A) · P(A)] / P(B)`,
        `P(A|B) = [${likelihood} · ${prior}] / ${marginal.toFixed(6)} = ${(likelihood * prior).toFixed(6)} / ${marginal.toFixed(6)} = ${posterior.toFixed(6)}`
    ];
    
    return {
        posterior,
        formula,
        interpretation,
        steps
    };
}

/**
 * =============================================
 * INDEPENDENCE CALCULATOR FUNCTIONS
 * =============================================
 */

/**
 * Checks independence between two events
 * @param {Object} params - Calculator parameters
 * @returns {Object} - Results including independence status, steps, etc.
 */
function checkTwoEventsIndependence(params) {
    const { pA, pB, pAandB } = params;
    
    // Validate inputs
    if (pA < 0 || pA > 1 || pB < 0 || pB > 1 || pAandB < 0 || pAandB > 1) {
        return {
            error: 'All probabilities must be between 0 and 1.'
        };
    }
    
    if (pAandB > Math.min(pA, pB)) {
        return {
            error: 'P(A∩B) cannot be greater than both P(A) and P(B).'
        };
    }
    
    // Calculate expected intersection probability if independent
    const expectedIntersection = pA * pB;
    
    // Determine if events are independent
    const epsilon = 0.000001; // Small tolerance for floating-point comparison
    const isIndependent = Math.abs(pAandB - expectedIntersection) < epsilon;
    
    // Calculate conditional probabilities
    const pAgivenB = pB > 0 ? pAandB / pB : NaN;
    const pBgivenA = pA > 0 ? pAandB / pA : NaN;
    
    // Prepare formula display
    const formula = `P(A \\cap B) = ${pAandB}
P(A) \\times P(B) = ${pA} \\times ${pB} = ${expectedIntersection.toFixed(6)}`;
    
    // Prepare interpretation
    let interpretation;
    if (isIndependent) {
        interpretation = `The events A and B are independent because P(A∩B) = P(A) × P(B).`;
    } else if (pAandB > expectedIntersection) {
        interpretation = `The events A and B are not independent. The actual intersection probability (${pAandB}) is greater than expected (${expectedIntersection.toFixed(6)}), indicating a positive association.`;
    } else {
        interpretation = `The events A and B are not independent. The actual intersection probability (${pAandB}) is less than expected (${expectedIntersection.toFixed(6)}), indicating a negative association.`;
    }
    
    // Prepare solution steps
    const steps = [
        `Step 1: Identify the values from the input.`,
        `P(A) = ${pA}`,
        `P(B) = ${pB}`,
        `P(A∩B) = ${pAandB}`,
        `Step 2: Calculate the expected intersection probability if the events were independent.`,
        `P(A) × P(B) = ${pA} × ${pB} = ${expectedIntersection.toFixed(6)}`,
        `Step 3: Compare the actual intersection probability with the expected value.`,
        `P(A∩B) ${isIndependent ? '=' : isNaN(expectedIntersection) ? 'cannot be compared with' : pAandB > expectedIntersection ? '>' : '<'} P(A) × P(B)`,
        `Step 4: Calculate conditional probabilities to verify independence.`,
        `P(A|B) = P(A∩B) / P(B) = ${pAandB} / ${pB} = ${isNaN(pAgivenB) ? 'undefined (division by zero)' : pAgivenB.toFixed(6)}`,
        `P(B|A) = P(A∩B) / P(A) = ${pAandB} / ${pA} = ${isNaN(pBgivenA) ? 'undefined (division by zero)' : pBgivenA.toFixed(6)}`,
        `Step 5: Check if conditional probabilities equal the marginal probabilities.`,
        `P(A|B) ${isNaN(pAgivenB) ? 'cannot be compared with' : Math.abs(pAgivenB - pA) < epsilon ? '=' : '≠'} P(A)`,
        `P(B|A) ${isNaN(pBgivenA) ? 'cannot be compared with' : Math.abs(pBgivenA - pB) < epsilon ? '=' : '≠'} P(B)`,
        `Step 6: Conclusion:`,
        isIndependent 
            ? `The events A and B are independent because P(A∩B) = P(A) × P(B).`
            : `The events A and B are not independent because P(A∩B) ≠ P(A) × P(B).`
    ];
    
    // Store in calculator state
    calculatorState.independence.isIndependent = isIndependent;
    
    return {
        isIndependent,
        expectedIntersection,
        pAgivenB,
        pBgivenA,
        formula,
        interpretation,
        steps
    };
}

/**
 * =============================================
 * HELPER FUNCTIONS
 * =============================================
 */

/**
 * Generates a sample space for coin tosses
 * @param {number} numCoins - Number of coins
 * @returns {Array} - Array of possible outcomes
 */
function generateCoinTossSampleSpace(numCoins) {
    const outcomes = [];
    
    // Generate all possible combinations of H and T
    const generateCombinations = (prefix, remaining) => {
        if (remaining === 0) {
            outcomes.push(prefix);
            return;
        }
        
        generateCombinations(prefix + 'H', remaining - 1);
        generateCombinations(prefix + 'T', remaining - 1);
    };
    
    generateCombinations('', numCoins);
    return outcomes;
}

/**
 * Generates a sample space for dice rolls
 * @param {number} numDice - Number of dice
 * @returns {Array} - Array of possible outcomes
 */
function generateDiceRollSampleSpace(numDice) {
    const outcomes = [];
    
    // Generate all possible combinations of dice values
    const generateCombinations = (prefix, remaining) => {
        if (remaining === 0) {
            outcomes.push(prefix);
            return;
        }
        
        for (let i = 1; i <= 6; i++) {
            const newPrefix = prefix.length === 0 ? `${i}` : `${prefix},${i}`;
            generateCombinations(newPrefix, remaining - 1);
        }
    };
    
    generateCombinations('', numDice);
    return outcomes;
}

/**
 * Export all calculator functions
 */
export {
    calculateCoinProbability,
    calculateDiceProbability,
    calculateCardProbability,
    calculateBasicConditional,
    calculateMedicalTest,
    calculateStandardBayes,
    checkTwoEventsIndependence
};