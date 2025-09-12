/**
 * Discrete Probability Distributions Calculators
 * Contains calculator functions for discrete probability distributions
 * Random Variables & Probability Distributions
 */

// Global variables to store calculator states
let discreteState = {
    currentDistribution: '',
    parameters: {},
    calculationResults: {},
    probabilityTable: [],
    visualizationData: {}
};

/**
 * =============================================
 * BERNOULLI DISTRIBUTION FUNCTIONS
 * =============================================
 */

/**
 * Calculates Bernoulli distribution properties and probabilities
 * @param {Object} params - Calculator parameters
 * @returns {Object} - Results including probabilities, mean, variance, etc.
 */
function calculateBernoulli(params) {
    const { p, calculationType, k, decimals } = params;
    
    // Validate parameters
    if (p < 0 || p > 1) {
        return {
            error: 'The success probability p must be between 0 and 1.'
        };
    }
    
    // Calculate the PMF: P(X = k) = p^k * (1-p)^(1-k) for k in {0,1}
    const pmf0 = 1 - p;
    const pmf1 = p;
    
    // Calculate the CDF: P(X ≤ k)
    const cdf0 = pmf0;
    const cdf1 = 1;
    
    // Calculate mean and variance
    const mean = p;
    const variance = p * (1 - p);
    const stdDev = Math.sqrt(variance);
    
    // Calculate skewness and kurtosis
    const skewness = (1 - 2 * p) / Math.sqrt(p * (1 - p));
    const kurtosis = (1 - 6 * p * (1 - p)) / (p * (1 - p));
    
    // Probability mass function table
    const probabilityTable = [
        { x: 0, pmf: pmf0, cdf: cdf0 },
        { x: 1, pmf: pmf1, cdf: cdf1 }
    ];
    
    // Calculate specific probability based on calculationType
    let result, formula, interpretation, steps;
    
    // Round to specified decimal places
    const decimalPlaces = parseInt(decimals) || 4;
    
    switch (calculationType) {
        case 'pmf':
            // PMF: P(X = k)
            if (k !== 0 && k !== 1) {
                result = 0;
                formula = `P(X = ${k}) = 0 \\text{ (since ${k} is not in the support \\{0, 1\\})}`;
                interpretation = `The probability of X = ${k} is 0, since Bernoulli trials can only result in 0 or 1.`;
            } else {
                result = k === 0 ? pmf0 : pmf1;
                formula = `P(X = ${k}) = ${k === 0 ? '1-p' : 'p'} = ${k === 0 ? `1-${p}` : p} = ${result}`;
                interpretation = `The probability of ${k === 0 ? 'failure' : 'success'} is ${(result * 100).toFixed(2)}%.`;
            }
            
            steps = [
                `Step 1: Identify the Bernoulli distribution parameter.`,
                `Success probability p = ${p}`,
                `Step 2: Determine the outcome we're calculating.`,
                `We want to find P(X = ${k})`,
                `Step 3: Apply the Bernoulli PMF formula.`,
                k !== 0 && k !== 1 
                    ? `Since ${k} is not in the support {0, 1}, P(X = ${k}) = 0`
                    : k === 0 
                        ? `P(X = 0) = 1 - p = 1 - ${p} = ${result}`
                        : `P(X = 1) = p = ${p}`
            ];
            break;
            
        case 'cdf':
            // CDF: P(X ≤ k)
            if (k < 0) {
                result = 0;
                formula = `P(X \\leq ${k}) = 0 \\text{ (since ${k} < 0)}`;
                interpretation = `The probability of X ≤ ${k} is 0, since X cannot be less than 0 in a Bernoulli distribution.`;
            } else if (k < 1) {
                result = pmf0;
                formula = `P(X \\leq ${k}) = P(X = 0) = 1-p = 1-${p} = ${result}`;
                interpretation = `The probability of X ≤ ${k} is ${(result * 100).toFixed(2)}%, which is the probability of failure.`;
            } else {
                result = 1;
                formula = `P(X \\leq ${k}) = 1 \\text{ (since ${k} \\geq 1)}`;
                interpretation = `The probability of X ≤ ${k} is 1 (100%), since X cannot exceed 1 in a Bernoulli distribution.`;
            }
            
            steps = [
                `Step 1: Identify the Bernoulli distribution parameter.`,
                `Success probability p = ${p}`,
                `Step 2: Determine the outcome we're calculating.`,
                `We want to find P(X ≤ ${k})`,
                `Step 3: Apply the Bernoulli CDF formula.`,
                k < 0 
                    ? `Since ${k} < 0 and X ≥ 0, P(X ≤ ${k}) = 0`
                    : k < 1 
                        ? `P(X ≤ ${k}) = P(X = 0) = 1 - p = 1 - ${p} = ${result}`
                        : `P(X ≤ ${k}) = P(X = 0) + P(X = 1) = (1-${p}) + ${p} = 1`
            ];
            break;
            
        case 'interval':
            // P(a ≤ X ≤ b)
            const a = parseInt(params.a);
            const b = parseInt(params.b);
            
            if (isNaN(a) || isNaN(b)) {
                return {
                    error: 'Please enter valid interval bounds.'
                };
            }
            
            if (a > b) {
                return {
                    error: 'The lower bound must be less than or equal to the upper bound.'
                };
            }
            
            // Calculate interval probability
            let intervalProb = 0;
            
            if (a <= 0 && b >= 0) {
                intervalProb += pmf0;
            }
            
            if (a <= 1 && b >= 1) {
                intervalProb += pmf1;
            }
            
            result = intervalProb;
            formula = `P(${a} \\leq X \\leq ${b}) = `;
            
            if (a > 1 || b < 0) {
                formula += `0 \\text{ (no values in this range)}`;
                interpretation = `The probability of ${a} ≤ X ≤ ${b} is 0, since this range does not include 0 or 1.`;
            } else if (a <= 0 && b >= 1) {
                formula += `P(X = 0) + P(X = 1) = (1-p) + p = 1`;
                interpretation = `The probability of ${a} ≤ X ≤ ${b} is 1 (100%), since this range includes both possible values.`;
            } else if (a <= 0 && b < 1) {
                formula += `P(X = 0) = 1-p = 1-${p} = ${pmf0}`;
                interpretation = `The probability of ${a} ≤ X ≤ ${b} is ${(pmf0 * 100).toFixed(2)}%, which is the probability of failure.`;
            } else { // a > 0 && b >= 1
                formula += `P(X = 1) = p = ${p}`;
                interpretation = `The probability of ${a} ≤ X ≤ ${b} is ${(p * 100).toFixed(2)}%, which is the probability of success.`;
            }
            
            steps = [
                `Step 1: Identify the Bernoulli distribution parameter.`,
                `Success probability p = ${p}`,
                `Step 2: Determine the interval we're calculating.`,
                `We want to find P(${a} ≤ X ≤ ${b})`,
                `Step 3: Determine which values of X are in the interval.`,
                a > 1 || b < 0 
                    ? `No values of X are in the interval [${a}, ${b}], so P(${a} ≤ X ≤ ${b}) = 0`
                    : a <= 0 && b >= 1 
                        ? `Both values (0 and 1) are in the interval [${a}, ${b}]`
                        : a <= 0 && b < 1 
                            ? `Only X = 0 is in the interval [${a}, ${b}]`
                            : `Only X = 1 is in the interval [${a}, ${b}]`,
                `Step 4: Sum the probabilities of the values in the interval.`,
                a > 1 || b < 0 
                    ? `P(${a} ≤ X ≤ ${b}) = 0`
                    : a <= 0 && b >= 1 
                        ? `P(${a} ≤ X ≤ ${b}) = P(X = 0) + P(X = 1) = (1-${p}) + ${p} = 1`
                        : a <= 0 && b < 1 
                            ? `P(${a} ≤ X ≤ ${b}) = P(X = 0) = 1-${p} = ${pmf0}`
                            : `P(${a} ≤ X ≤ ${b}) = P(X = 1) = ${p}`
            ];
            break;
            
        case 'mean':
            result = mean;
            formula = `E[X] = p = ${p}`;
            interpretation = `The expected value (mean) of the Bernoulli distribution is ${result}, which represents the long-run average outcome of the Bernoulli trial.`;
            
            steps = [
                `Step 1: Identify the Bernoulli distribution parameter.`,
                `Success probability p = ${p}`,
                `Step 2: Apply the formula for the mean of a Bernoulli distribution.`,
                `E[X] = p = ${p}`
            ];
            break;
            
        case 'variance':
            result = variance;
            formula = `Var(X) = p(1-p) = ${p} \\cdot (1-${p}) = ${p} \\cdot ${1-p} = ${result}`;
            interpretation = `The variance of the Bernoulli distribution is ${result}, which measures the spread of the distribution.`;
            
            steps = [
                `Step 1: Identify the Bernoulli distribution parameter.`,
                `Success probability p = ${p}`,
                `Step 2: Apply the formula for the variance of a Bernoulli distribution.`,
                `Var(X) = p(1-p) = ${p} × (1-${p}) = ${p} × ${1-p} = ${result}`
            ];
            break;
    }
    
    // Round results
    const roundedResult = round(result, decimalPlaces);
    const roundedMean = round(mean, decimalPlaces);
    const roundedVariance = round(variance, decimalPlaces);
    const roundedStdDev = round(stdDev, decimalPlaces);
    const roundedSkewness = round(skewness, decimalPlaces);
    const roundedKurtosis = round(kurtosis, decimalPlaces);
    
    // Generate visualization data
    const visualizationData = {
        type: 'discrete',
        pmf: probabilityTable,
        mean: mean,
        variance: variance,
        support: [0, 1]
    };
    
    // Store in state for later use
    discreteState.currentDistribution = 'bernoulli';
    discreteState.parameters = { p };
    discreteState.calculationResults = { 
        mean: roundedMean, 
        variance: roundedVariance,
        stdDev: roundedStdDev,
        skewness: roundedSkewness,
        kurtosis: roundedKurtosis
    };
    discreteState.probabilityTable = probabilityTable;
    discreteState.visualizationData = visualizationData;
    
    return {
        result: roundedResult,
        formula,
        interpretation,
        steps,
        mean: roundedMean,
        variance: roundedVariance,
        stdDev: roundedStdDev,
        skewness: roundedSkewness,
        kurtosis: roundedKurtosis,
        probabilityTable,
        visualizationData
    };
}

/**
 * =============================================
 * BINOMIAL DISTRIBUTION FUNCTIONS
 * =============================================
 */

/**
 * Calculates Binomial distribution properties and probabilities
 * @param {Object} params - Calculator parameters
 * @returns {Object} - Results including probabilities, mean, variance, etc.
 */
function calculateBinomial(params) {
    const { n, p, calculationType, k, decimals } = params;
    
    // Validate parameters
    if (p < 0 || p > 1) {
        return {
            error: 'The success probability p must be between 0 and 1.'
        };
    }
    
    if (n < 0 || !Number.isInteger(parseFloat(n))) {
        return {
            error: 'The number of trials n must be a non-negative integer.'
        };
    }
    
    // Calculate mean and variance
    const mean = n * p;
    const variance = n * p * (1 - p);
    const stdDev = Math.sqrt(variance);
    
    // Calculate skewness and kurtosis
    const skewness = (1 - 2 * p) / Math.sqrt(n * p * (1 - p));
    const kurtosis = 3 + (1 - 6 * p * (1 - p)) / (n * p * (1 - p));
    
    // Generate probability mass function table
    const probabilityTable = [];
    let cumulativeProbability = 0;
    
    for (let i = 0; i <= n; i++) {
        const pmf = binomialPMF(n, p, i);
        cumulativeProbability += pmf;
        probabilityTable.push({
            x: i,
            pmf: pmf,
            cdf: cumulativeProbability
        });
    }
    
    // Calculate specific probability based on calculationType
    let result, formula, interpretation, steps;
    
    // Round to specified decimal places
    const decimalPlaces = parseInt(decimals) || 4;
    
    switch (calculationType) {
        case 'pmf':
            // PMF: P(X = k)
            if (k < 0 || k > n || !Number.isInteger(parseFloat(k))) {
                result = 0;
                formula = `P(X = ${k}) = 0 \\text{ (since ${k} is outside the support \\{0, 1, \\ldots, ${n}\\})}`;
                interpretation = `The probability of X = ${k} is 0, since X must be an integer between 0 and ${n} in this binomial distribution.`;
            } else {
                result = binomialPMF(n, p, k);
                formula = `P(X = ${k}) = \\binom{${n}}{${k}} p^{${k}} (1-p)^{${n-k}} = \\binom{${n}}{${k}} ${p}^{${k}} ${1-p}^{${n-k}} = ${result}`;
                interpretation = `The probability of exactly ${k} successes in ${n} trials is ${(result * 100).toFixed(2)}%.`;
            }
            
            steps = [
                `Step 1: Identify the binomial distribution parameters.`,
                `Number of trials n = ${n}`,
                `Success probability p = ${p}`,
                `Step 2: Determine the outcome we're calculating.`,
                `We want to find P(X = ${k})`,
                `Step 3: Apply the binomial PMF formula.`,
                k < 0 || k > n || !Number.isInteger(parseFloat(k))
                    ? `Since ${k} is outside the support {0, 1, ..., ${n}}, P(X = ${k}) = 0`
                    : `P(X = ${k}) = \\binom{n}{k} p^k (1-p)^{n-k}`
            ];
            
            if (k >= 0 && k <= n && Number.isInteger(parseFloat(k))) {
                steps.push(`Step 4: Calculate the binomial coefficient.`);
                steps.push(`\\binom{${n}}{${k}} = \\frac{${n}!}{${k}!(${n}-${k})!} = ${binomialCoefficient(n, k)}`);
                steps.push(`Step 5: Substitute the values into the formula.`);
                steps.push(`P(X = ${k}) = ${binomialCoefficient(n, k)} \\cdot ${p}^{${k}} \\cdot ${1-p}^{${n-k}}`);
                steps.push(`P(X = ${k}) = ${binomialCoefficient(n, k)} \\cdot ${Math.pow(p, k).toFixed(6)} \\cdot ${Math.pow(1-p, n-k).toFixed(6)} = ${result.toFixed(6)}`);
            }
            break;
            
        case 'cdf':
            // CDF: P(X ≤ k)
            if (k < 0) {
                result = 0;
                formula = `P(X \\leq ${k}) = 0 \\text{ (since X \\geq 0)}`;
                interpretation = `The probability of X ≤ ${k} is 0, since X cannot be less than 0 in a binomial distribution.`;
            } else if (k >= n) {
                result = 1;
                formula = `P(X \\leq ${k}) = 1 \\text{ (since X \\leq ${n})}`;
                interpretation = `The probability of X ≤ ${k} is 1 (100%), since X cannot exceed ${n} in this binomial distribution.`;
            } else {
                // Calculate cumulative probability P(X ≤ k)
                result = 0;
                for (let i = 0; i <= Math.min(Math.floor(k), n); i++) {
                    result += binomialPMF(n, p, i);
                }
                
                formula = `P(X \\leq ${k}) = \\sum_{i=0}^{${Math.min(Math.floor(k), n)}} P(X = i) = ${result}`;
                interpretation = `The probability of at most ${k} successes in ${n} trials is ${(result * 100).toFixed(2)}%.`;
            }
            
            steps = [
                `Step 1: Identify the binomial distribution parameters.`,
                `Number of trials n = ${n}`,
                `Success probability p = ${p}`,
                `Step 2: Determine the outcome we're calculating.`,
                `We want to find P(X ≤ ${k})`,
                `Step 3: Apply the binomial CDF formula.`
            ];
            
            if (k < 0) {
                steps.push(`Since ${k} < 0 and X ≥ 0, P(X ≤ ${k}) = 0`);
            } else if (k >= n) {
                steps.push(`Since ${k} ≥ ${n} and X ≤ ${n}, P(X ≤ ${k}) = 1`);
            } else {
                steps.push(`P(X ≤ ${k}) = P(X = 0) + P(X = 1) + ... + P(X = ${Math.min(Math.floor(k), n)})`);
                
                let cumulativeProb = 0;
                for (let i = 0; i <= Math.min(Math.floor(k), n); i++) {
                    const pmf = binomialPMF(n, p, i);
                    cumulativeProb += pmf;
                    if (i < 3 || i === Math.min(Math.floor(k), n)) {
                        steps.push(`P(X = ${i}) = \\binom{${n}}{${i}} ${p}^{${i}} ${1-p}^{${n-i}} = ${pmf.toFixed(6)}`);
                    } else if (i === 3) {
                        steps.push(`... (continuing the sum)`);
                    }
                }
                
                steps.push(`P(X ≤ ${k}) = ${result.toFixed(6)}`);
            }
            break;
            
        case 'interval':
            // P(a ≤ X ≤ b)
            const a = parseInt(params.a);
            const b = parseInt(params.b);
            
            if (isNaN(a) || isNaN(b)) {
                return {
                    error: 'Please enter valid interval bounds.'
                };
            }
            
            if (a > b) {
                return {
                    error: 'The lower bound must be less than or equal to the upper bound.'
                };
            }
            
            // Calculate interval probability
            if (b < 0 || a > n) {
                result = 0;
                formula = `P(${a} \\leq X \\leq ${b}) = 0 \\text{ (since there are no integers in the range [${a}, ${b}] within the support)}`;
                interpretation = `The probability of X being between ${a} and ${b} is 0, since this range does not include any valid values of X.`;
            } else {
                // Adjust bounds to be within support
                const lowerBound = Math.max(0, a);
                const upperBound = Math.min(n, b);
                
                result = 0;
                for (let i = lowerBound; i <= upperBound; i++) {
                    result += binomialPMF(n, p, i);
                }
                
                formula = `P(${a} \\leq X \\leq ${b}) = \\sum_{i=${lowerBound}}^{${upperBound}} P(X = i) = ${result}`;
                interpretation = `The probability of between ${lowerBound} and ${upperBound} successes in ${n} trials is ${(result * 100).toFixed(2)}%.`;
            }
            
            steps = [
                `Step 1: Identify the binomial distribution parameters.`,
                `Number of trials n = ${n}`,
                `Success probability p = ${p}`,
                `Step 2: Determine the interval we're calculating.`,
                `We want to find P(${a} ≤ X ≤ ${b})`,
                `Step 3: Adjust the bounds to be within the support {0, 1, ..., ${n}}.`,
                `Adjusted interval: [${Math.max(0, a)}, ${Math.min(n, b)}]`,
                `Step 4: Sum the probabilities for each value in the interval.`
            ];
            
            if (b < 0 || a > n) {
                steps.push(`Since there are no integers in [${a}, ${b}] within the support {0, 1, ..., ${n}}, P(${a} ≤ X ≤ ${b}) = 0`);
            } else {
                const lowerBound = Math.max(0, a);
                const upperBound = Math.min(n, b);
                
                let intervalProb = 0;
                for (let i = lowerBound; i <= upperBound; i++) {
                    const pmf = binomialPMF(n, p, i);
                    intervalProb += pmf;
                    if ((i <= lowerBound + 1 || i >= upperBound - 1) && upperBound - lowerBound < 10) {
                        steps.push(`P(X = ${i}) = \\binom{${n}}{${i}} ${p}^{${i}} ${1-p}^{${n-i}} = ${pmf.toFixed(6)}`);
                    } else if (i === lowerBound + 2 && upperBound - lowerBound >= 10) {
                        steps.push(`... (continuing the sum)`);
                    }
                }
                
                steps.push(`P(${a} ≤ X ≤ ${b}) = ${intervalProb.toFixed(6)}`);
            }
            break;
            
        case 'mean':
            result = mean;
            formula = `E[X] = n \\cdot p = ${n} \\cdot ${p} = ${result}`;
            interpretation = `The expected value (mean) of the binomial distribution is ${result}, representing the average number of successes in ${n} trials.`;
            
            steps = [
                `Step 1: Identify the binomial distribution parameters.`,
                `Number of trials n = ${n}`,
                `Success probability p = ${p}`,
                `Step 2: Apply the formula for the mean of a binomial distribution.`,
                `E[X] = n × p = ${n} × ${p} = ${result}`
            ];
            break;
            
        case 'variance':
            result = variance;
            formula = `Var(X) = n \\cdot p \\cdot (1-p) = ${n} \\cdot ${p} \\cdot ${1-p} = ${result}`;
            interpretation = `The variance of the binomial distribution is ${result}, measuring the average squared deviation from the mean.`;
            
            steps = [
                `Step 1: Identify the binomial distribution parameters.`,
                `Number of trials n = ${n}`,
                `Success probability p = ${p}`,
                `Step 2: Apply the formula for the variance of a binomial distribution.`,
                `Var(X) = n × p × (1-p) = ${n} × ${p} × ${1-p} = ${result}`
            ];
            break;
    }
    
    // Round results
    const roundedResult = round(result, decimalPlaces);
    const roundedMean = round(mean, decimalPlaces);
    const roundedVariance = round(variance, decimalPlaces);
    const roundedStdDev = round(stdDev, decimalPlaces);
    const roundedSkewness = round(skewness, decimalPlaces);
    const roundedKurtosis = round(kurtosis, decimalPlaces);
    
    // Generate visualization data
    const visualizationData = {
        type: 'discrete',
        pmf: probabilityTable,
        mean: mean,
        variance: variance,
        support: [0, n]
    };
    
    // Store in state for later use
    discreteState.currentDistribution = 'binomial';
    discreteState.parameters = { n, p };
    discreteState.calculationResults = { 
        mean: roundedMean, 
        variance: roundedVariance,
        stdDev: roundedStdDev,
        skewness: roundedSkewness,
        kurtosis: roundedKurtosis
    };
    discreteState.probabilityTable = probabilityTable;
    discreteState.visualizationData = visualizationData;
    
    return {
        result: roundedResult,
        formula,
        interpretation,
        steps,
        mean: roundedMean,
        variance: roundedVariance,
        stdDev: roundedStdDev,
        skewness: roundedSkewness,
        kurtosis: roundedKurtosis,
        probabilityTable,
        visualizationData
    };
}

/**
 * =============================================
 * GEOMETRIC DISTRIBUTION FUNCTIONS
 * =============================================
 */

/**
 * Calculates Geometric distribution properties and probabilities
 * @param {Object} params - Calculator parameters
 * @returns {Object} - Results including probabilities, mean, variance, etc.
 */
function calculateGeometric(params) {
    const { p, calculationType, k, decimals, firstSuccessVersion } = params;
    
    // Validate parameters
    if (p <= 0 || p > 1) {
        return {
            error: 'The success probability p must be between 0 and 1 (exclusive of 0).'
        };
    }
    
    // Check which version of geometric distribution to use
    // firstSuccessVersion = true: X = number of trials until first success (X ≥ 1)
    // firstSuccessVersion = false: X = number of failures before first success (X ≥ 0)
    const offset = firstSuccessVersion ? 1 : 0;
    
    // Calculate mean and variance
    const mean = firstSuccessVersion ? 1/p : (1-p)/p;
    const variance = firstSuccessVersion ? (1-p)/(p*p) : (1-p)/(p*p);
    const stdDev = Math.sqrt(variance);
    
    // Calculate skewness and kurtosis
    const skewness = (2-p) / Math.sqrt(1-p);
    const kurtosis = 6 + (p*p)/(1-p);
    
    // Generate probability mass function table
    const maxK = Math.min(100, Math.ceil(10/p)); // Limit table size
    const probabilityTable = [];
    let cumulativeProbability = 0;
    
    for (let i = offset; i <= maxK; i++) {
        const pmf = geometricPMF(p, i, firstSuccessVersion);
        cumulativeProbability += pmf;
        probabilityTable.push({
            x: i,
            pmf: pmf,
            cdf: cumulativeProbability
        });
        
        // Stop if we've covered 99.9% of the distribution
        if (cumulativeProbability > 0.999) break;
    }
    
    // Calculate specific probability based on calculationType
    let result, formula, interpretation, steps;
    
    // Round to specified decimal places
    const decimalPlaces = parseInt(decimals) || 4;
    
    switch (calculationType) {
        case 'pmf':
            // PMF: P(X = k)
            if (!Number.isInteger(parseFloat(k)) || k < offset) {
                result = 0;
                formula = `P(X = ${k}) = 0 \\text{ (since ${k} is outside the support)}`;
                interpretation = `The probability of X = ${k} is 0, since X must be ${offset === 1 ? 'a positive integer' : 'a non-negative integer'} in this geometric distribution.`;
            } else {
                result = geometricPMF(p, k, firstSuccessVersion);
                
                if (firstSuccessVersion) {
                    formula = `P(X = ${k}) = p(1-p)^{${k}-1} = ${p}(1-${p})^{${k}-1} = ${result}`;
                    interpretation = `The probability of getting the first success on the ${k}${getOrdinalSuffix(k)} trial is ${(result * 100).toFixed(2)}%.`;
                } else {
                    formula = `P(X = ${k}) = p(1-p)^{${k}} = ${p}(1-${p})^{${k}} = ${result}`;
                    interpretation = `The probability of getting ${k} failures before the first success is ${(result * 100).toFixed(2)}%.`;
                }
            }
            
            steps = [
                `Step 1: Identify the geometric distribution parameter.`,
                `Success probability p = ${p}`,
                `Step 2: Determine the outcome we're calculating.`,
                `We want to find P(X = ${k})`,
                `Step 3: Apply the geometric PMF formula.`
            ];
            
            if (!Number.isInteger(parseFloat(k)) || k < offset) {
                steps.push(`Since ${k} is outside the support, P(X = ${k}) = 0`);
            } else {
                if (firstSuccessVersion) {
                    steps.push(`For "first success on trial k" version: P(X = k) = p(1-p)^{k-1}`);
                    steps.push(`P(X = ${k}) = ${p} × (1-${p})^{${k}-1} = ${p} × ${Math.pow(1-p, k-1).toFixed(6)} = ${result.toFixed(6)}`);
                } else {
                    steps.push(`For "failures before first success" version: P(X = k) = p(1-p)^k`);
                    steps.push(`P(X = ${k}) = ${p} × (1-${p})^{${k}} = ${p} × ${Math.pow(1-p, k).toFixed(6)} = ${result.toFixed(6)}`);
                }
            }
            break;
            
        case 'cdf':
            // CDF: P(X ≤ k)
            if (k < offset) {
                result = 0;
                formula = `P(X \\leq ${k}) = 0 \\text{ (since X \\geq ${offset})}`;
                interpretation = `The probability of X ≤ ${k} is 0, since X cannot be less than ${offset} in this geometric distribution.`;
            } else {
                if (firstSuccessVersion) {
                    // For X = trials until first success
                    result = 1 - Math.pow(1-p, Math.floor(k));
                    formula = `P(X \\leq ${k}) = 1 - (1-p)^{${Math.floor(k)}} = 1 - (1-${p})^{${Math.floor(k)}} = ${result}`;
                    interpretation = `The probability of getting the first success within the first ${Math.floor(k)} trials is ${(result * 100).toFixed(2)}%.`;
                } else {
                    // For X = failures before first success
                    result = 1 - Math.pow(1-p, Math.floor(k) + 1);
                    formula = `P(X \\leq ${k}) = 1 - (1-p)^{${Math.floor(k)+1}} = 1 - (1-${p})^{${Math.floor(k)+1}} = ${result}`;
                    interpretation = `The probability of having at most ${Math.floor(k)} failures before the first success is ${(result * 100).toFixed(2)}%.`;
                }
            }
            
            steps = [
                `Step 1: Identify the geometric distribution parameter.`,
                `Success probability p = ${p}`,
                `Step 2: Determine the outcome we're calculating.`,
                `We want to find P(X ≤ ${k})`,
                `Step 3: Apply the geometric CDF formula.`
            ];
            
            if (k < offset) {
                steps.push(`Since ${k} < ${offset} and X ≥ ${offset}, P(X ≤ ${k}) = 0`);
            } else {
                if (firstSuccessVersion) {
                    steps.push(`For "first success on trial k" version: P(X ≤ k) = 1 - (1-p)^k`);
                    steps.push(`P(X ≤ ${k}) = 1 - (1-${p})^{${Math.floor(k)}} = 1 - ${Math.pow(1-p, Math.floor(k)).toFixed(6)} = ${result.toFixed(6)}`);
                } else {
                    steps.push(`For "failures before first success" version: P(X ≤ k) = 1 - (1-p)^{k+1}`);
                    steps.push(`P(X ≤ ${k}) = 1 - (1-${p})^{${Math.floor(k)+1}} = 1 - ${Math.pow(1-p, Math.floor(k)+1).toFixed(6)} = ${result.toFixed(6)}`);
                }
            }
            break;
            
        case 'interval':
            // P(a ≤ X ≤ b)
            const a = parseInt(params.a);
            const b = parseInt(params.b);
            
            if (isNaN(a) || isNaN(b)) {
                return {
                    error: 'Please enter valid interval bounds.'
                };
            }
            
            if (a > b) {
                return {
                    error: 'The lower bound must be less than or equal to the upper bound.'
                };
            }
            
            // Calculate interval probability
            if (b < offset) {
                result = 0;
                formula = `P(${a} \\leq X \\leq ${b}) = 0 \\text{ (since X \\geq ${offset})}`;
                interpretation = `The probability of X being between ${a} and ${b} is 0, since X cannot be less than ${offset} in this geometric distribution.`;
            } else if (a < offset) {
                // Adjust lower bound to be within support
                const adjustedA = offset;
                
                if (firstSuccessVersion) {
                    result = 1 - Math.pow(1-p, Math.floor(b));
                    formula = `P(${a} \\leq X \\leq ${b}) = P(${adjustedA} \\leq X \\leq ${b}) = 1 - (1-p)^{${Math.floor(b)}} = ${result}`;
                } else {
                    result = 1 - Math.pow(1-p, Math.floor(b) + 1);
                    formula = `P(${a} \\leq X \\leq ${b}) = P(${adjustedA} \\leq X \\leq ${b}) = 1 - (1-p)^{${Math.floor(b)+1}} = ${result}`;
                }
                
                interpretation = `The probability of X being between ${adjustedA} and ${b} is ${(result * 100).toFixed(2)}%.`;
            } else {
                // Both bounds are within support
                if (firstSuccessVersion) {
                    const pLessThanA = 1 - Math.pow(1-p, Math.floor(a) - 1);
                    const pLessThanOrEqualToB = 1 - Math.pow(1-p, Math.floor(b));
                    result = pLessThanOrEqualToB - pLessThanA;
                    formula = `P(${a} \\leq X \\leq ${b}) = P(X \\leq ${b}) - P(X \\leq ${a-1}) = ${pLessThanOrEqualToB} - ${pLessThanA} = ${result}`;
                } else {
                    const pLessThanA = 1 - Math.pow(1-p, Math.floor(a));
                    const pLessThanOrEqualToB = 1 - Math.pow(1-p, Math.floor(b) + 1);
                    result = pLessThanOrEqualToB - pLessThanA;
                    formula = `P(${a} \\leq X \\leq ${b}) = P(X \\leq ${b}) - P(X < ${a}) = ${pLessThanOrEqualToB} - ${pLessThanA} = ${result}`;
                }
                
                interpretation = `The probability of X being between ${a} and ${b} is ${(result * 100).toFixed(2)}%.`;
            }
            
            steps = [
                `Step 1: Identify the geometric distribution parameter.`,
                `Success probability p = ${p}`,
                `Step 2: Determine the interval we're calculating.`,
                `We want to find P(${a} ≤ X ≤ ${b})`,
                `Step 3: Apply the geometric distribution formulas.`
            ];
            
            if (b < offset) {
                steps.push(`Since ${b} < ${offset} and X ≥ ${offset}, P(${a} ≤ X ≤ ${b}) = 0`);
            } else if (a < offset) {
                steps.push(`Since ${a} < ${offset}, we adjust the lower bound to ${offset}`);
                steps.push(`P(${a} ≤ X ≤ ${b}) = P(${offset} ≤ X ≤ ${b}) = P(X ≤ ${b})`);
                
                if (firstSuccessVersion) {
                    steps.push(`P(X ≤ ${b}) = 1 - (1-${p})^{${Math.floor(b)}} = 1 - ${Math.pow(1-p, Math.floor(b)).toFixed(6)} = ${result.toFixed(6)}`);
                } else {
                    steps.push(`P(X ≤ ${b}) = 1 - (1-${p})^{${Math.floor(b)+1}} = 1 - ${Math.pow(1-p, Math.floor(b)+1).toFixed(6)} = ${result.toFixed(6)}`);
                }
            } else {
                steps.push(`P(${a} ≤ X ≤ ${b}) = P(X ≤ ${b}) - P(X < ${a})`);
                
                if (firstSuccessVersion) {
                    const pLessThanA = 1 - Math.pow(1-p, Math.floor(a) - 1);
                    const pLessThanOrEqualToB = 1 - Math.pow(1-p, Math.floor(b));
                    
                    steps.push(`P(X ≤ ${b}) = 1 - (1-${p})^{${Math.floor(b)}} = 1 - ${Math.pow(1-p, Math.floor(b)).toFixed(6)} = ${pLessThanOrEqualToB.toFixed(6)}`);
                    steps.push(`P(X ≤ ${a-1}) = 1 - (1-${p})^{${Math.floor(a)-1}} = 1 - ${Math.pow(1-p, Math.floor(a)-1).toFixed(6)} = ${pLessThanA.toFixed(6)}`);
                    steps.push(`P(${a} ≤ X ≤ ${b}) = ${pLessThanOrEqualToB.toFixed(6)} - ${pLessThanA.toFixed(6)} = ${result.toFixed(6)}`);
                } else {
                    const pLessThanA = 1 - Math.pow(1-p, Math.floor(a));
                    const pLessThanOrEqualToB = 1 - Math.pow(1-p, Math.floor(b) + 1);
                    
                    steps.push(`P(X ≤ ${b}) = 1 - (1-${p})^{${Math.floor(b)+1}} = 1 - ${Math.pow(1-p, Math.floor(b)+1).toFixed(6)} = ${pLessThanOrEqualToB.toFixed(6)}`);
                    steps.push(`P(X < ${a}) = 1 - (1-${p})^{${Math.floor(a)}} = 1 - ${Math.pow(1-p, Math.floor(a)).toFixed(6)} = ${pLessThanA.toFixed(6)}`);
                    steps.push(`P(${a} ≤ X ≤ ${b}) = ${pLessThanOrEqualToB.toFixed(6)} - ${pLessThanA.toFixed(6)} = ${result.toFixed(6)}`);
                }
            }
            break;
            
        case 'mean':
            result = mean;
            
            if (firstSuccessVersion) {
                formula = `E[X] = \\frac{1}{p} = \\frac{1}{${p}} = ${result}`;
                interpretation = `The expected value (mean) of the geometric distribution is ${result}, representing the average number of trials needed to get the first success.`;
            } else {
                formula = `E[X] = \\frac{1-p}{p} = \\frac{1-${p}}{${p}} = ${result}`;
                interpretation = `The expected value (mean) of the geometric distribution is ${result}, representing the average number of failures before the first success.`;
            }
            
            steps = [
                `Step 1: Identify the geometric distribution parameter.`,
                `Success probability p = ${p}`,
                `Step 2: Apply the formula for the mean of a geometric distribution.`
            ];
            
            if (firstSuccessVersion) {
                steps.push(`For "first success on trial k" version: E[X] = 1/p`);
                steps.push(`E[X] = 1/${p} = ${result}`);
            } else {
                steps.push(`For "failures before first success" version: E[X] = (1-p)/p`);
                steps.push(`E[X] = (1-${p})/${p} = ${1-p}/${p} = ${result}`);
            }
            break;
            
        case 'variance':
            result = variance;
            
            formula = `Var(X) = \\frac{1-p}{p^2} = \\frac{1-${p}}{${p}^2} = ${result}`;
            interpretation = `The variance of the geometric distribution is ${result}, measuring the average squared deviation from the mean.`;
            
            steps = [
                `Step 1: Identify the geometric distribution parameter.`,
                `Success probability p = ${p}`,
                `Step 2: Apply the formula for the variance of a geometric distribution.`,
                `Var(X) = (1-p)/p² = (1-${p})/${p}² = ${1-p}/${p*p} = ${result}`
            ];
            break;
    }
    
    // Round results
    const roundedResult = round(result, decimalPlaces);
    const roundedMean = round(mean, decimalPlaces);
    const roundedVariance = round(variance, decimalPlaces);
    const roundedStdDev = round(stdDev, decimalPlaces);
    const roundedSkewness = round(skewness, decimalPlaces);
    const roundedKurtosis = round(kurtosis, decimalPlaces);
    
    // Generate visualization data
    const visualizationData = {
        type: 'discrete',
        pmf: probabilityTable,
        mean: mean,
        variance: variance,
        support: [offset, Infinity]
    };
    
    // Store in state for later use
    discreteState.currentDistribution = 'geometric';
    discreteState.parameters = { p, firstSuccessVersion };
    discreteState.calculationResults = { 
        mean: roundedMean, 
        variance: roundedVariance,
        stdDev: roundedStdDev,
        skewness: roundedSkewness,
        kurtosis: roundedKurtosis
    };
    discreteState.probabilityTable = probabilityTable;
    discreteState.visualizationData = visualizationData;
    
    return {
        result: roundedResult,
        formula,
        interpretation,
        steps,
        mean: roundedMean,
        variance: roundedVariance,
        stdDev: roundedStdDev,
        skewness: roundedSkewness,
        kurtosis: roundedKurtosis,
        probabilityTable,
        visualizationData
    };
}

/**
 * =============================================
 * POISSON DISTRIBUTION FUNCTIONS
 * =============================================
 */

/**
 * Calculates Poisson distribution properties and probabilities
 * @param {Object} params - Calculator parameters
 * @returns {Object} - Results including probabilities, mean, variance, etc.
 */
function calculatePoisson(params) {
    const { lambda, calculationType, k, decimals } = params;
    
    // Validate parameters
    if (lambda <= 0) {
        return {
            error: 'The rate parameter λ must be greater than 0.'
        };
    }
    
    // Calculate mean and variance
    const mean = lambda;
    const variance = lambda;
    const stdDev = Math.sqrt(variance);
    
    // Calculate skewness and kurtosis
    const skewness = 1 / Math.sqrt(lambda);
    const kurtosis = 3 + (1 / lambda);
    
    // Generate probability mass function table
    const maxK = Math.min(100, Math.ceil(lambda + 5 * Math.sqrt(lambda))); // Limit table size
    const probabilityTable = [];
    let cumulativeProbability = 0;
    
    for (let i = 0; i <= maxK; i++) {
        const pmf = poissonPMF(lambda, i);
        cumulativeProbability += pmf;
        probabilityTable.push({
            x: i,
            pmf: pmf,
            cdf: cumulativeProbability
        });
        
        // Stop if we've covered 99.9% of the distribution
        if (cumulativeProbability > 0.999) break;
    }
    
    // Calculate specific probability based on calculationType
    let result, formula, interpretation, steps;
    
    // Round to specified decimal places
    const decimalPlaces = parseInt(decimals) || 4;
    
    switch (calculationType) {
        case 'pmf':
            // PMF: P(X = k)
            if (!Number.isInteger(parseFloat(k)) || k < 0) {
                result = 0;
                formula = `P(X = ${k}) = 0 \\text{ (since ${k} is outside the support)}`;
                interpretation = `The probability of X = ${k} is 0, since X must be a non-negative integer in the Poisson distribution.`;
            } else {
                result = poissonPMF(lambda, k);
                formula = `P(X = ${k}) = \\frac{e^{-\\lambda} \\lambda^{${k}}}{${k}!} = \\frac{e^{-${lambda}} \\cdot ${lambda}^{${k}}}{${k}!} = ${result}`;
                interpretation = `The probability of observing exactly ${k} events in the given time period is ${(result * 100).toFixed(2)}%.`;
            }
            
            steps = [
                `Step 1: Identify the Poisson distribution parameter.`,
                `Rate parameter λ = ${lambda}`,
                `Step 2: Determine the outcome we're calculating.`,
                `We want to find P(X = ${k})`,
                `Step 3: Apply the Poisson PMF formula.`
            ];
            
            if (!Number.isInteger(parseFloat(k)) || k < 0) {
                steps.push(`Since ${k} is outside the support (non-negative integers), P(X = ${k}) = 0`);
            } else {
                steps.push(`P(X = k) = (e^{-λ} × λ^k) / k!`);
                steps.push(`P(X = ${k}) = (e^{-${lambda}} × ${lambda}^{${k}}) / ${k}!`);
                
                const numerator = Math.exp(-lambda) * Math.pow(lambda, k);
                const denominator = factorial(k);
                
                steps.push(`P(X = ${k}) = ${numerator.toFixed(8)} / ${denominator} = ${result.toFixed(6)}`);
            }
            break;
            
        case 'cdf':
            // CDF: P(X ≤ k)
            if (k < 0) {
                result = 0;
                formula = `P(X \\leq ${k}) = 0 \\text{ (since X \\geq 0)}`;
                interpretation = `The probability of X ≤ ${k} is 0, since X cannot be less than 0 in the Poisson distribution.`;
            } else {
                // Calculate cumulative probability P(X ≤ k)
                result = 0;
                for (let i = 0; i <= Math.floor(k); i++) {
                    result += poissonPMF(lambda, i);
                }
                
                formula = `P(X \\leq ${k}) = \\sum_{i=0}^{${Math.floor(k)}} P(X = i) = ${result}`;
                interpretation = `The probability of observing at most ${Math.floor(k)} events in the given time period is ${(result * 100).toFixed(2)}%.`;
            }
            
            steps = [
                `Step 1: Identify the Poisson distribution parameter.`,
                `Rate parameter λ = ${lambda}`,
                `Step 2: Determine the outcome we're calculating.`,
                `We want to find P(X ≤ ${k})`,
                `Step 3: Apply the Poisson CDF formula.`
            ];
            
            if (k < 0) {
                steps.push(`Since ${k} < 0 and X ≥ 0, P(X ≤ ${k}) = 0`);
            } else {
                steps.push(`P(X ≤ ${k}) = P(X = 0) + P(X = 1) + ... + P(X = ${Math.floor(k)})`);
                
                let cumulativeProb = 0;
                for (let i = 0; i <= Math.min(3, Math.floor(k)); i++) {
                    const pmf = poissonPMF(lambda, i);
                    cumulativeProb += pmf;
                    steps.push(`P(X = ${i}) = (e^{-${lambda}} × ${lambda}^{${i}}) / ${i}! = ${pmf.toFixed(6)}`);
                }
                
                if (Math.floor(k) > 3) {
                    steps.push(`... (continuing the sum)`);
                    
                    if (Math.floor(k) > 4) {
                        const lastPmf = poissonPMF(lambda, Math.floor(k));
                        steps.push(`P(X = ${Math.floor(k)}) = (e^{-${lambda}} × ${lambda}^{${Math.floor(k)}}) / ${Math.floor(k)}! = ${lastPmf.toFixed(6)}`);
                    }
                }
                
                steps.push(`P(X ≤ ${k}) = ${result.toFixed(6)}`);
                
                // Add note about alternative calculation method using regularized gamma function
                steps.push(`Note: For large values, the Poisson CDF can also be calculated using the regularized gamma function: P(X ≤ k) = 1 - gammaRegularized(k+1, λ)`);
            }
            break;
            
        case 'interval':
            // P(a ≤ X ≤ b)
            const a = parseInt(params.a);
            const b = parseInt(params.b);
            
            if (isNaN(a) || isNaN(b)) {
                return {
                    error: 'Please enter valid interval bounds.'
                };
            }
            
            if (a > b) {
                return {
                    error: 'The lower bound must be less than or equal to the upper bound.'
                };
            }
            
            // Calculate interval probability
            if (b < 0) {
                result = 0;
                formula = `P(${a} \\leq X \\leq ${b}) = 0 \\text{ (since X \\geq 0)}`;
                interpretation = `The probability of X being between ${a} and ${b} is 0, since X cannot be less than 0 in the Poisson distribution.`;
            } else if (a < 0) {
                // Adjust lower bound to be within support
                const adjustedA = 0;
                
                // Calculate P(X ≤ b)
                result = 0;
                for (let i = 0; i <= Math.floor(b); i++) {
                    result += poissonPMF(lambda, i);
                }
                
                formula = `P(${a} \\leq X \\leq ${b}) = P(${adjustedA} \\leq X \\leq ${b}) = P(X \\leq ${b}) = ${result}`;
                interpretation = `The probability of observing between ${adjustedA} and ${Math.floor(b)} events is ${(result * 100).toFixed(2)}%.`;
            } else {
                // Both bounds are within support
                let sumLower = 0;
                for (let i = 0; i < Math.floor(a); i++) {
                    sumLower += poissonPMF(lambda, i);
                }
                
                let sumUpper = 0;
                for (let i = 0; i <= Math.floor(b); i++) {
                    sumUpper += poissonPMF(lambda, i);
                }
                
                result = sumUpper - sumLower;
                formula = `P(${a} \\leq X \\leq ${b}) = P(X \\leq ${b}) - P(X < ${a}) = ${sumUpper} - ${sumLower} = ${result}`;
                interpretation = `The probability of observing between ${Math.floor(a)} and ${Math.floor(b)} events is ${(result * 100).toFixed(2)}%.`;
            }
            
            steps = [
                `Step 1: Identify the Poisson distribution parameter.`,
                `Rate parameter λ = ${lambda}`,
                `Step 2: Determine the interval we're calculating.`,
                `We want to find P(${a} ≤ X ≤ ${b})`,
                `Step 3: Apply the Poisson distribution formulas.`
            ];
            
            if (b < 0) {
                steps.push(`Since ${b} < 0 and X ≥ 0, P(${a} ≤ X ≤ ${b}) = 0`);
            } else if (a < 0) {
                steps.push(`Since ${a} < 0, we adjust the lower bound to 0`);
                steps.push(`P(${a} ≤ X ≤ ${b}) = P(0 ≤ X ≤ ${b}) = P(X ≤ ${b})`);
                steps.push(`P(X ≤ ${b}) = P(X = 0) + P(X = 1) + ... + P(X = ${Math.floor(b)})`);
                
                let cumulativeProb = 0;
                for (let i = 0; i <= Math.min(2, Math.floor(b)); i++) {
                    const pmf = poissonPMF(lambda, i);
                    cumulativeProb += pmf;
                    steps.push(`P(X = ${i}) = (e^{-${lambda}} × ${lambda}^{${i}}) / ${i}! = ${pmf.toFixed(6)}`);
                }
                
                if (Math.floor(b) > 2) {
                    steps.push(`... (continuing the sum)`);
                }
                
                steps.push(`P(${a} ≤ X ≤ ${b}) = ${result.toFixed(6)}`);
            } else {
                steps.push(`P(${a} ≤ X ≤ ${b}) = P(X ≤ ${b}) - P(X < ${a}) = P(X ≤ ${b}) - P(X ≤ ${a-1})`);
                
                let sumLower = 0;
                for (let i = 0; i < Math.min(3, Math.floor(a)); i++) {
                    const pmf = poissonPMF(lambda, i);
                    sumLower += pmf;
                    if (i < 2) {
                        steps.push(`P(X = ${i}) = (e^{-${lambda}} × ${lambda}^{${i}}) / ${i}! = ${pmf.toFixed(6)}`);
                    }
                }
                
                if (Math.floor(a) > 2) {
                    steps.push(`... (continuing the sum for P(X ≤ ${a-1}))`);
                }
                
                steps.push(`P(X ≤ ${a-1}) = ${sumLower.toFixed(6)}`);
                
                let sumUpper = 0;
                for (let i = 0; i <= Math.min(2, Math.floor(b)); i++) {
                    const pmf = poissonPMF(lambda, i);
                    sumUpper += pmf;
                }
                
                if (Math.floor(b) > 2) {
                    steps.push(`... (continuing the sum for P(X ≤ ${b}))`);
                }
                
                steps.push(`P(X ≤ ${b}) = ${sumUpper.toFixed(6)}`);
                steps.push(`P(${a} ≤ X ≤ ${b}) = ${sumUpper.toFixed(6)} - ${sumLower.toFixed(6)} = ${result.toFixed(6)}`);
            }
            break;
            
        case 'mean':
            result = mean;
            formula = `E[X] = \\lambda = ${lambda}`;
            interpretation = `The expected value (mean) of the Poisson distribution is ${result}, which equals the rate parameter λ.`;
            
            steps = [
                `Step 1: Identify the Poisson distribution parameter.`,
                `Rate parameter λ = ${lambda}`,
                `Step 2: Apply the formula for the mean of a Poisson distribution.`,
                `E[X] = λ = ${lambda}`
            ];
            break;
            
        case 'variance':
            result = variance;
            formula = `Var(X) = \\lambda = ${lambda}`;
            interpretation = `The variance of the Poisson distribution is ${result}, which equals the rate parameter λ.`;
            
            steps = [
                `Step 1: Identify the Poisson distribution parameter.`,
                `Rate parameter λ = ${lambda}`,
                `Step 2: Apply the formula for the variance of a Poisson distribution.`,
                `Var(X) = λ = ${lambda}`
            ];
            break;
    }
    
    // Round results
    const roundedResult = round(result, decimalPlaces);
    const roundedMean = round(mean, decimalPlaces);
    const roundedVariance = round(variance, decimalPlaces);
    const roundedStdDev = round(stdDev, decimalPlaces);
    const roundedSkewness = round(skewness, decimalPlaces);
    const roundedKurtosis = round(kurtosis, decimalPlaces);
    
    // Generate visualization data
    const visualizationData = {
        type: 'discrete',
        pmf: probabilityTable,
        mean: mean,
        variance: variance,
        support: [0, Infinity]
    };
    
    // Store in state for later use
    discreteState.currentDistribution = 'poisson';
    discreteState.parameters = { lambda };
    discreteState.calculationResults = { 
        mean: roundedMean, 
        variance: roundedVariance,
        stdDev: roundedStdDev,
        skewness: roundedSkewness,
        kurtosis: roundedKurtosis
    };
    discreteState.probabilityTable = probabilityTable;
    discreteState.visualizationData = visualizationData;
    
    return {
        result: roundedResult,
        formula,
        interpretation,
        steps,
        mean: roundedMean,
        variance: roundedVariance,
        stdDev: roundedStdDev,
        skewness: roundedSkewness,
        kurtosis: roundedKurtosis,
        probabilityTable,
        visualizationData
    };
}

/**
 * =============================================
 * NEGATIVE BINOMIAL DISTRIBUTION FUNCTIONS
 * =============================================
 */

/**
 * Calculates Negative Binomial distribution properties and probabilities
 * @param {Object} params - Calculator parameters
 * @returns {Object} - Results including probabilities, mean, variance, etc.
 */
function calculateNegativeBinomial(params) {
    const { r, p, calculationType, k, decimals } = params;
    
    // Validate parameters
    if (p <= 0 || p > 1) {
        return {
            error: 'The success probability p must be between 0 and 1 (exclusive of 0).'
        };
    }
    
    if (r <= 0 || !Number.isInteger(parseFloat(r))) {
        return {
            error: 'The number of successes r must be a positive integer.'
        };
    }
    
    // Calculate mean and variance
    const mean = r / p;
    const variance = r * (1 - p) / (p * p);
    const stdDev = Math.sqrt(variance);
    
    // Calculate skewness and kurtosis
    const skewness = (2 - p) / Math.sqrt(r * (1 - p));
    const kurtosis = 3 + 6/r + (p*p)/(r * (1 - p));
    
    // Generate probability mass function table
    const maxK = Math.min(500, r + Math.ceil(5 * Math.sqrt(variance))); // Limit table size
    const probabilityTable = [];
    let cumulativeProbability = 0;
    
    for (let i = r; i <= maxK; i++) {
        const pmf = negativeBinomialPMF(r, p, i);
        cumulativeProbability += pmf;
        probabilityTable.push({
            x: i,
            pmf: pmf,
            cdf: cumulativeProbability
        });
        
        // Stop if we've covered 99.9% of the distribution
        if (cumulativeProbability > 0.999) break;
    }
    
    // Calculate specific probability based on calculationType
    let result, formula, interpretation, steps;
    
    // Round to specified decimal places
    const decimalPlaces = parseInt(decimals) || 4;
    
    switch (calculationType) {
        case 'pmf':
            // PMF: P(X = k)
            if (!Number.isInteger(parseFloat(k)) || k < r) {
                result = 0;
                formula = `P(X = ${k}) = 0 \\text{ (since ${k} is outside the support)}`;
                interpretation = `The probability of X = ${k} is 0, since X must be an integer greater than or equal to ${r} in this negative binomial distribution.`;
            } else {
                result = negativeBinomialPMF(r, p, k);
                formula = `P(X = ${k}) = \\binom{${k-1}}{${r-1}} p^${r} (1-p)^{${k-r}} = \\binom{${k-1}}{${r-1}} ${p}^${r} ${1-p}^{${k-r}} = ${result}`;
                interpretation = `The probability of needing exactly ${k} trials to get ${r} successes is ${(result * 100).toFixed(2)}%.`;
            }
            
            steps = [
                `Step 1: Identify the negative binomial distribution parameters.`,
                `Number of successes r = ${r}`,
                `Success probability p = ${p}`,
                `Step 2: Determine the outcome we're calculating.`,
                `We want to find P(X = ${k})`,
                `Step 3: Apply the negative binomial PMF formula.`
            ];
            
            if (!Number.isInteger(parseFloat(k)) || k < r) {
                steps.push(`Since ${k} is outside the support (integers ≥ ${r}), P(X = ${k}) = 0`);
            } else {
                steps.push(`P(X = k) = \\binom{k-1}{r-1} p^r (1-p)^{k-r}`);
                steps.push(`P(X = ${k}) = \\binom{${k-1}}{${r-1}} ${p}^{${r}} ${1-p}^{${k-r}}`);
                
                const binomCoeff = binomialCoefficient(k-1, r-1);
                const pTerm = Math.pow(p, r);
                const qTerm = Math.pow(1-p, k-r);
                
                steps.push(`P(X = ${k}) = ${binomCoeff} × ${pTerm.toFixed(6)} × ${qTerm.toFixed(6)} = ${result.toFixed(6)}`);
            }
            break;
            
        case 'cdf':
            // CDF: P(X ≤ k)
            if (k < r) {
                result = 0;
                formula = `P(X \\leq ${k}) = 0 \\text{ (since X \\geq ${r})}`;
                interpretation = `The probability of X ≤ ${k} is 0, since X cannot be less than ${r} in this negative binomial distribution.`;
            } else {
                // Calculate cumulative probability P(X ≤ k)
                result = 0;
                for (let i = r; i <= Math.floor(k); i++) {
                    result += negativeBinomialPMF(r, p, i);
                }
                
                formula = `P(X \\leq ${k}) = \\sum_{i=${r}}^{${Math.floor(k)}} P(X = i) = ${result}`;
                interpretation = `The probability of needing at most ${Math.floor(k)} trials to get ${r} successes is ${(result * 100).toFixed(2)}%.`;
            }
            
            steps = [
                `Step 1: Identify the negative binomial distribution parameters.`,
                `Number of successes r = ${r}`,
                `Success probability p = ${p}`,
                `Step 2: Determine the outcome we're calculating.`,
                `We want to find P(X ≤ ${k})`,
                `Step 3: Apply the negative binomial CDF formula.`
            ];
            
            if (k < r) {
                steps.push(`Since ${k} < ${r} and X ≥ ${r}, P(X ≤ ${k}) = 0`);
            } else {
                steps.push(`P(X ≤ ${k}) = P(X = ${r}) + P(X = ${r+1}) + ... + P(X = ${Math.floor(k)})`);
                
                let cumulativeProb = 0;
                for (let i = r; i <= Math.min(r+2, Math.floor(k)); i++) {
                    const pmf = negativeBinomialPMF(r, p, i);
                    cumulativeProb += pmf;
                    steps.push(`P(X = ${i}) = \\binom{${i-1}}{${r-1}} ${p}^{${r}} ${1-p}^{${i-r}} = ${pmf.toFixed(6)}`);
                }
                
                if (Math.floor(k) > r+2) {
                    steps.push(`... (continuing the sum)`);
                    
                    if (Math.floor(k) > r+3) {
                        const lastPmf = negativeBinomialPMF(r, p, Math.floor(k));
                        steps.push(`P(X = ${Math.floor(k)}) = \\binom{${Math.floor(k)-1}}{${r-1}} ${p}^{${r}} ${1-p}^{${Math.floor(k)-r}} = ${lastPmf.toFixed(6)}`);
                    }
                }
                
                steps.push(`P(X ≤ ${k}) = ${result.toFixed(6)}`);
                
                // Add note about alternative calculation method using regularized beta function
                steps.push(`Note: The negative binomial CDF can also be calculated using the regularized beta function: P(X ≤ k) = 1 - betaRegularized(k-r+1, r, 1-p)`);
            }
            break;
            
        case 'interval':
            // P(a ≤ X ≤ b)
            const a = parseInt(params.a);
            const b = parseInt(params.b);
            
            if (isNaN(a) || isNaN(b)) {
                return {
                    error: 'Please enter valid interval bounds.'
                };
            }
            
            if (a > b) {
                return {
                    error: 'The lower bound must be less than or equal to the upper bound.'
                };
            }
            
            // Calculate interval probability
            if (b < r) {
                result = 0;
                formula = `P(${a} \\leq X \\leq ${b}) = 0 \\text{ (since X \\geq ${r})}`;
                interpretation = `The probability of X being between ${a} and ${b} is 0, since X cannot be less than ${r} in this negative binomial distribution.`;
            } else if (a < r) {
                // Adjust lower bound to be within support
                const adjustedA = r;
                
                // Calculate P(X ≤ b)
                result = 0;
                for (let i = r; i <= Math.floor(b); i++) {
                    result += negativeBinomialPMF(r, p, i);
                }
                
                formula = `P(${a} \\leq X \\leq ${b}) = P(${adjustedA} \\leq X \\leq ${b}) = P(X \\leq ${b}) = ${result}`;
                interpretation = `The probability of needing between ${adjustedA} and ${Math.floor(b)} trials to get ${r} successes is ${(result * 100).toFixed(2)}%.`;
            } else {
                // Both bounds are within support
                let sumLower = 0;
                for (let i = r; i < Math.floor(a); i++) {
                    sumLower += negativeBinomialPMF(r, p, i);
                }
                
                let sumUpper = 0;
                for (let i = r; i <= Math.floor(b); i++) {
                    sumUpper += negativeBinomialPMF(r, p, i);
                }
                
                result = sumUpper - sumLower;
                formula = `P(${a} \\leq X \\leq ${b}) = P(X \\leq ${b}) - P(X < ${a}) = ${sumUpper} - ${sumLower} = ${result}`;
                interpretation = `The probability of needing between ${Math.floor(a)} and ${Math.floor(b)} trials to get ${r} successes is ${(result * 100).toFixed(2)}%.`;
            }
            
            steps = [
                `Step 1: Identify the negative binomial distribution parameters.`,
                `Number of successes r = ${r}`,
                `Success probability p = ${p}`,
                `Step 2: Determine the interval we're calculating.`,
                `We want to find P(${a} ≤ X ≤ ${b})`,
                `Step 3: Apply the negative binomial distribution formulas.`
            ];
            
            if (b < r) {
                steps.push(`Since ${b} < ${r} and X ≥ ${r}, P(${a} ≤ X ≤ ${b}) = 0`);
            } else if (a < r) {
                steps.push(`Since ${a} < ${r}, we adjust the lower bound to ${r}`);
                steps.push(`P(${a} ≤ X ≤ ${b}) = P(${r} ≤ X ≤ ${b}) = P(X ≤ ${b}) - P(X < ${r})`);
                steps.push(`Since P(X < ${r}) = 0, we have P(${a} ≤ X ≤ ${b}) = P(X ≤ ${b})`);
                
                let sumUpper = 0;
                for (let i = r; i <= Math.min(r+2, Math.floor(b)); i++) {
                    const pmf = negativeBinomialPMF(r, p, i);
                    sumUpper += pmf;
                    steps.push(`P(X = ${i}) = \\binom{${i-1}}{${r-1}} ${p}^{${r}} ${1-p}^{${i-r}} = ${pmf.toFixed(6)}`);
                }
                
                if (Math.floor(b) > r+2) {
                    steps.push(`... (continuing the sum)`);
                }
                
                steps.push(`P(${a} ≤ X ≤ ${b}) = ${result.toFixed(6)}`);
            } else {
                steps.push(`P(${a} ≤ X ≤ ${b}) = P(X ≤ ${b}) - P(X < ${a})`);
                
                let sumLower = 0;
                for (let i = r; i < Math.min(r+2, Math.floor(a)); i++) {
                    const pmf = negativeBinomialPMF(r, p, i);
                    sumLower += pmf;
                    steps.push(`P(X = ${i}) = \\binom{${i-1}}{${r-1}} ${p}^{${r}} ${1-p}^{${i-r}} = ${pmf.toFixed(6)}`);
                }
                
                if (Math.floor(a) > r+2) {
                    steps.push(`... (continuing the sum for P(X < ${a}))`);
                }
                
                steps.push(`P(X < ${a}) = ${sumLower.toFixed(6)}`);
                
                let sumUpper = 0;
                for (let i = r; i <= Math.min(r+2, Math.floor(b)); i++) {
                    const pmf = negativeBinomialPMF(r, p, i);
                    sumUpper += pmf;
                }
                
                if (Math.floor(b) > r+2) {
                    steps.push(`... (continuing the sum for P(X ≤ ${b}))`);
                }
                
                steps.push(`P(X ≤ ${b}) = ${sumUpper.toFixed(6)}`);
                steps.push(`P(${a} ≤ X ≤ ${b}) = ${sumUpper.toFixed(6)} - ${sumLower.toFixed(6)} = ${result.toFixed(6)}`);
            }
            break;
            
        case 'mean':
            result = mean;
            formula = `E[X] = \\frac{r}{p} = \\frac{${r}}{${p}} = ${result}`;
            interpretation = `The expected value (mean) of the negative binomial distribution is ${result}, representing the average number of trials needed to get ${r} successes.`;
            
            steps = [
                `Step 1: Identify the negative binomial distribution parameters.`,
                `Number of successes r = ${r}`,
                `Success probability p = ${p}`,
                `Step 2: Apply the formula for the mean of a negative binomial distribution.`,
                `E[X] = r/p = ${r}/${p} = ${result}`
            ];
            break;
            
        case 'variance':
            result = variance;
            formula = `Var(X) = \\frac{r(1-p)}{p^2} = \\frac{${r} \\cdot (1-${p})}{${p}^2} = \\frac{${r} \\cdot ${1-p}}{${p*p}} = ${result}`;
            interpretation = `The variance of the negative binomial distribution is ${result}, measuring the average squared deviation from the mean.`;
            
            steps = [
                `Step 1: Identify the negative binomial distribution parameters.`,
                `Number of successes r = ${r}`,
                `Success probability p = ${p}`,
                `Step 2: Apply the formula for the variance of a negative binomial distribution.`,
                `Var(X) = r(1-p)/p² = ${r}×(1-${p})/${p}² = ${r}×${1-p}/${p*p} = ${result}`
            ];
            break;
    }
    
    // Round results
    const roundedResult = round(result, decimalPlaces);
    const roundedMean = round(mean, decimalPlaces);
    const roundedVariance = round(variance, decimalPlaces);
    const roundedStdDev = round(stdDev, decimalPlaces);
    const roundedSkewness = round(skewness, decimalPlaces);
    const roundedKurtosis = round(kurtosis, decimalPlaces);
    
    // Generate visualization data
    const visualizationData = {
        type: 'discrete',
        pmf: probabilityTable,
        mean: mean,
        variance: variance,
        support: [r, Infinity]
    };
    
    // Store in state for later use
    discreteState.currentDistribution = 'negativeBinomial';
    discreteState.parameters = { r, p };
    discreteState.calculationResults = { 
        mean: roundedMean, 
        variance: roundedVariance,
        stdDev: roundedStdDev,
        skewness: roundedSkewness,
        kurtosis: roundedKurtosis
    };
    discreteState.probabilityTable = probabilityTable;
    discreteState.visualizationData = visualizationData;
    
    return {
        result: roundedResult,
        formula,
        interpretation,
        steps,
        mean: roundedMean,
        variance: roundedVariance,
        stdDev: roundedStdDev,
        skewness: roundedSkewness,
        kurtosis: roundedKurtosis,
        probabilityTable,
        visualizationData
    };
}

/**
 * =============================================
 * PMF & CDF CALCULATION HELPER FUNCTIONS
 * =============================================
 */

/**
 * Calculates the binomial probability mass function
 * @param {number} n - Number of trials
 * @param {number} p - Success probability
 * @param {number} k - Number of successes
 * @returns {number} - Probability P(X = k)
 */
function binomialPMF(n, p, k) {
    if (k < 0 || k > n || !Number.isInteger(k)) return 0;
    
    // For numerical stability, calculate directly using logarithms
    const logBinomCoef = logBinomialCoefficient(n, k);
    const logProb = logBinomCoef + k * Math.log(p) + (n - k) * Math.log(1 - p);
    
    return Math.exp(logProb);
}

/**
 * Calculates the geometric probability mass function
 * @param {number} p - Success probability
 * @param {number} k - Number of trials or failures
 * @param {boolean} firstSuccessVersion - Whether k is number of trials (true) or failures (false)
 * @returns {number} - Probability P(X = k)
 */
function geometricPMF(p, k, firstSuccessVersion) {
    if (!Number.isInteger(k)) return 0;
    
    // k is number of trials until first success (k ≥ 1)
    if (firstSuccessVersion) {
        if (k < 1) return 0;
        return p * Math.pow(1 - p, k - 1);
    } 
    // k is number of failures before first success (k ≥ 0)
    else {
        if (k < 0) return 0;
        return p * Math.pow(1 - p, k);
    }
}

/**
 * Calculates the Poisson probability mass function
 * @param {number} lambda - Rate parameter
 * @param {number} k - Number of events
 * @returns {number} - Probability P(X = k)
 */
function poissonPMF(lambda, k) {
    if (k < 0 || !Number.isInteger(k)) return 0;
    
    // For numerical stability, calculate directly using logarithms
    const logPMF = k * Math.log(lambda) - lambda - logFactorial(k);
    return Math.exp(logPMF);
}

/**
 * Calculates the negative binomial probability mass function
 * @param {number} r - Number of successes
 * @param {number} p - Success probability
 * @param {number} k - Number of trials
 * @returns {number} - Probability P(X = k)
 */
function negativeBinomialPMF(r, p, k) {
    if (k < r || !Number.isInteger(k)) return 0;
    
    // For numerical stability, calculate directly using logarithms
    const logBinomCoef = logBinomialCoefficient(k - 1, r - 1);
    const logProb = logBinomCoef + r * Math.log(p) + (k - r) * Math.log(1 - p);
    
    return Math.exp(logProb);
}

/**
 * =============================================
 * COMBINATORIAL & MATHEMATICAL HELPER FUNCTIONS
 * =============================================
 */

/**
 * Calculates the binomial coefficient (n choose k)
 * @param {number} n - Total number of items
 * @param {number} k - Number of items to choose
 * @returns {number} - Binomial coefficient
 */
function binomialCoefficient(n, k) {
    if (k < 0 || k > n) return 0;
    if (k === 0 || k === n) return 1;
    
    // Use symmetry to minimize the number of multiplications
    if (k > n - k) {
        k = n - k;
    }
    
    let result = 1;
    for (let i = 1; i <= k; i++) {
        result *= (n - (k - i));
        result /= i;
    }
    
    return result;
}

/**
 * Calculates the logarithm of the binomial coefficient to avoid numerical overflow
 * @param {number} n - Total number of items
 * @param {number} k - Number of items to choose
 * @returns {number} - Log of binomial coefficient
 */
function logBinomialCoefficient(n, k) {
    if (k < 0 || k > n) return -Infinity;
    if (k === 0 || k === n) return 0;
    
    // Use symmetry to minimize the number of operations
    if (k > n - k) {
        k = n - k;
    }
    
    let logResult = 0;
    for (let i = 1; i <= k; i++) {
        logResult += Math.log(n - (k - i)) - Math.log(i);
    }
    
    return logResult;
}

/**
 * Calculates the factorial of a non-negative integer
 * @param {number} n - Non-negative integer
 * @returns {number} - Factorial
 */
function factorial(n) {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n <= 1) return 1;
    
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    
    return result;
}

/**
 * Calculates the logarithm of the factorial to avoid numerical overflow
 * @param {number} n - Non-negative integer
 * @returns {number} - Log of factorial
 */
function logFactorial(n) {
    if (n < 0 || !Number.isInteger(n)) return NaN;
    if (n <= 1) return 0;
    
    let logResult = 0;
    for (let i = 2; i <= n; i++) {
        logResult += Math.log(i);
    }
    
    return logResult;
}

/**
 * Rounds a number to specified decimal places
 * @param {number} value - Value to round
 * @param {number} decimals - Number of decimal places
 * @returns {number} - Rounded value
 */
function round(value, decimals) {
    if (typeof value !== 'number' || isNaN(value)) return value;
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
}

/**
 * Returns the ordinal suffix for a number (1st, 2nd, 3rd, etc.)
 * @param {number} n - Number
 * @returns {string} - Ordinal suffix
 */
function getOrdinalSuffix(n) {
    const j = n % 10;
    const k = n % 100;
    
    if (j === 1 && k !== 11) {
        return 'st';
    }
    if (j === 2 && k !== 12) {
        return 'nd';
    }
    if (j === 3 && k !== 13) {
        return 'rd';
    }
    
    return 'th';
}

/**
 * Export all calculator functions
 */
export {
    calculateBernoulli,
    calculateBinomial,
    calculateGeometric,
    calculatePoisson,
    calculateNegativeBinomial,
    discreteState
};