/**
 * Continuous Probability Distributions Calculators
 * Contains calculator functions for continuous probability distributions
 * Random Variables & Probability Distributions
 */

// Global variables to store calculator states
let continuousState = {
    currentDistribution: '',
    parameters: {},
    calculationResults: {},
    visualizationData: {}
};

/**
 * =============================================
 * UNIFORM DISTRIBUTION FUNCTIONS
 * =============================================
 */

/**
 * Calculates Uniform distribution properties and probabilities
 * @param {Object} params - Calculator parameters
 * @returns {Object} - Results including probabilities, mean, variance, etc.
 */
function calculateUniform(params) {
    const { a, b, calculationType, x, decimals } = params;
    
    // Validate parameters
    if (a >= b) {
        return {
            error: 'The parameter a must be less than b.'
        };
    }
    
    // Calculate mean and variance
    const mean = (a + b) / 2;
    const variance = Math.pow(b - a, 2) / 12;
    const stdDev = Math.sqrt(variance);
    
    // Calculate skewness and kurtosis
    const skewness = 0; // Uniform distribution is symmetric
    const kurtosis = 9/5; // Excess kurtosis is -6/5, so kurtosis is 3 - 6/5 = 9/5
    
    // Calculate specific probability based on calculationType
    let result, formula, interpretation, steps;
    
    // Round to specified decimal places
    const decimalPlaces = parseInt(decimals) || 4;
    
    switch (calculationType) {
        case 'pdf':
            // PDF: f(x)
            if (x < a || x > b) {
                result = 0;
                formula = `f(${x}) = 0 \\text{ (since ${x} is outside [${a}, ${b}])}`;
                interpretation = `The probability density at x = ${x} is 0, since x is outside the support [${a}, ${b}].`;
            } else {
                result = 1 / (b - a);
                formula = `f(${x}) = \\frac{1}{b-a} = \\frac{1}{${b}-${a}} = \\frac{1}{${b-a}} = ${result}`;
                interpretation = `The probability density at x = ${x} is ${result}, which is constant for all values in the interval [${a}, ${b}].`;
            }
            
            steps = [
                `Step 1: Identify the uniform distribution parameters.`,
                `Lower bound a = ${a}`,
                `Upper bound b = ${b}`,
                `Step 2: Determine the value we're calculating.`,
                `We want to find f(${x})`,
                `Step 3: Apply the uniform PDF formula.`,
                x < a || x > b 
                    ? `Since ${x} is outside the interval [${a}, ${b}], f(${x}) = 0`
                    : `Since ${x} is inside the interval [${a}, ${b}], f(${x}) = \\frac{1}{b-a} = \\frac{1}{${b-a}} = ${result}`
            ];
            break;
            
        case 'cdf':
            // CDF: F(x) = P(X ≤ x)
            if (x < a) {
                result = 0;
                formula = `F(${x}) = 0 \\text{ (since ${x} < ${a})}`;
                interpretation = `The probability P(X ≤ ${x}) is 0, since x is less than the lower bound ${a}.`;
            } else if (x > b) {
                result = 1;
                formula = `F(${x}) = 1 \\text{ (since ${x} > ${b})}`;
                interpretation = `The probability P(X ≤ ${x}) is 1, since x is greater than the upper bound ${b}.`;
            } else {
                result = (x - a) / (b - a);
                formula = `F(${x}) = \\frac{x-a}{b-a} = \\frac{${x}-${a}}{${b}-${a}} = \\frac{${x-a}}{${b-a}} = ${result}`;
                interpretation = `The probability P(X ≤ ${x}) is ${result}, which represents the proportion of the interval [${a}, ${b}] that is less than or equal to ${x}.`;
            }
            
            steps = [
                `Step 1: Identify the uniform distribution parameters.`,
                `Lower bound a = ${a}`,
                `Upper bound b = ${b}`,
                `Step 2: Determine the value we're calculating.`,
                `We want to find F(${x}) = P(X ≤ ${x})`,
                `Step 3: Apply the uniform CDF formula.`,
                x < a 
                    ? `Since ${x} < ${a}, F(${x}) = 0`
                    : x > b 
                        ? `Since ${x} > ${b}, F(${x}) = 1`
                        : `Since ${a} ≤ ${x} ≤ ${b}, F(${x}) = \\frac{x-a}{b-a} = \\frac{${x}-${a}}{${b-a}} = ${result}`
            ];
            break;
            
        case 'interval':
            // P(c ≤ X ≤ d)
            const c = parseFloat(params.c);
            const d = parseFloat(params.d);
            
            if (isNaN(c) || isNaN(d)) {
                return {
                    error: 'Please enter valid interval bounds.'
                };
            }
            
            if (c > d) {
                return {
                    error: 'The lower bound c must be less than or equal to the upper bound d.'
                };
            }
            
            // Calculate interval probability
            let lowerProb, upperProb;
            
            if (c < a) {
                lowerProb = 0;
            } else if (c > b) {
                lowerProb = 1;
            } else {
                lowerProb = (c - a) / (b - a);
            }
            
            if (d < a) {
                upperProb = 0;
            } else if (d > b) {
                upperProb = 1;
            } else {
                upperProb = (d - a) / (b - a);
            }
            
            result = upperProb - lowerProb;
            
            if (c < a && d > b) {
                formula = `P(${c} \\leq X \\leq ${d}) = 1 \\text{ (since [${a}, ${b}] \\subset [${c}, ${d}])}`;
                interpretation = `The probability P(${c} ≤ X ≤ ${d}) is 1, since the entire support [${a}, ${b}] is contained within the interval [${c}, ${d}].`;
            } else if (d < a || c > b) {
                formula = `P(${c} \\leq X \\leq ${d}) = 0 \\text{ (since [${c}, ${d}] \\cap [${a}, ${b}] = \\emptyset)}`;
                interpretation = `The probability P(${c} ≤ X ≤ ${d}) is 0, since the interval [${c}, ${d}] does not intersect with the support [${a}, ${b}].`;
            } else {
                formula = `P(${c} \\leq X \\leq ${d}) = F(${d}) - F(${c}) = ${upperProb} - ${lowerProb} = ${result}`;
                interpretation = `The probability P(${c} ≤ X ≤ ${d}) is ${result}, which represents the proportion of the interval [${a}, ${b}] that falls within [${c}, ${d}].`;
            }
            
            steps = [
                `Step 1: Identify the uniform distribution parameters.`,
                `Lower bound a = ${a}`,
                `Upper bound b = ${b}`,
                `Step 2: Determine the interval we're calculating.`,
                `We want to find P(${c} ≤ X ≤ ${d})`,
                `Step 3: Apply the uniform CDF formula to find P(X ≤ d) and P(X ≤ c).`
            ];
            
            if (d < a) {
                steps.push(`Since ${d} < ${a}, P(X ≤ ${d}) = 0`);
            } else if (d > b) {
                steps.push(`Since ${d} > ${b}, P(X ≤ ${d}) = 1`);
            } else {
                steps.push(`P(X ≤ ${d}) = \\frac{${d}-${a}}{${b-a}} = ${upperProb.toFixed(6)}`);
            }
            
            if (c < a) {
                steps.push(`Since ${c} < ${a}, P(X ≤ ${c}) = 0`);
            } else if (c > b) {
                steps.push(`Since ${c} > ${b}, P(X ≤ ${c}) = 1`);
            } else {
                steps.push(`P(X ≤ ${c}) = \\frac{${c}-${a}}{${b-a}} = ${lowerProb.toFixed(6)}`);
            }
            
            steps.push(`Step 4: Calculate the interval probability.`);
            steps.push(`P(${c} ≤ X ≤ ${d}) = P(X ≤ ${d}) - P(X ≤ ${c}) = ${upperProb.toFixed(6)} - ${lowerProb.toFixed(6)} = ${result.toFixed(6)}`);
            break;
            
        case 'mean':
            result = mean;
            formula = `E[X] = \\frac{a+b}{2} = \\frac{${a}+${b}}{2} = ${result}`;
            interpretation = `The expected value (mean) of the uniform distribution is ${result}, which is the midpoint of the interval [${a}, ${b}].`;
            
            steps = [
                `Step 1: Identify the uniform distribution parameters.`,
                `Lower bound a = ${a}`,
                `Upper bound b = ${b}`,
                `Step 2: Apply the formula for the mean of a uniform distribution.`,
                `E[X] = \\frac{a+b}{2} = \\frac{${a}+${b}}{2} = ${result}`
            ];
            break;
            
        case 'variance':
            result = variance;
            formula = `Var(X) = \\frac{(b-a)^2}{12} = \\frac{(${b}-${a})^2}{12} = \\frac{${Math.pow(b-a, 2)}}{12} = ${result}`;
            interpretation = `The variance of the uniform distribution is ${result}, which measures the average squared deviation from the mean.`;
            
            steps = [
                `Step 1: Identify the uniform distribution parameters.`,
                `Lower bound a = ${a}`,
                `Upper bound b = ${b}`,
                `Step 2: Apply the formula for the variance of a uniform distribution.`,
                `Var(X) = \\frac{(b-a)^2}{12} = \\frac{(${b-a})^2}{12} = \\frac{${Math.pow(b-a, 2)}}{12} = ${result}`
            ];
            break;
            
        case 'quantile':
            // Quantile function: F^(-1)(p) = a + p(b-a)
            const p = parseFloat(params.p);
            
            if (isNaN(p) || p < 0 || p > 1) {
                return {
                    error: 'The probability p must be between 0 and 1.'
                };
            }
            
            result = a + p * (b - a);
            formula = `F^{-1}(${p}) = a + p(b-a) = ${a} + ${p} \\cdot (${b}-${a}) = ${a} + ${p} \\cdot ${b-a} = ${result}`;
            interpretation = `The ${p === 0.5 ? 'median' : `${p*100}th percentile`} of the uniform distribution is ${result}.`;
            
            steps = [
                `Step 1: Identify the uniform distribution parameters.`,
                `Lower bound a = ${a}`,
                `Upper bound b = ${b}`,
                `Step 2: Determine the quantile we're calculating.`,
                `We want to find the ${p*100}th percentile, which is the value x such that P(X ≤ x) = ${p}`,
                `Step 3: Apply the uniform quantile function formula.`,
                `F^{-1}(p) = a + p(b-a)`,
                `F^{-1}(${p}) = ${a} + ${p} × (${b-a}) = ${a} + ${p * (b-a)} = ${result}`
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
    const visualizationData = generateUniformVisualization(a, b, mean, stdDev);
    
    // Store in state for later use
    continuousState.currentDistribution = 'uniform';
    continuousState.parameters = { a, b };
    continuousState.calculationResults = { 
        mean: roundedMean, 
        variance: roundedVariance,
        stdDev: roundedStdDev,
        skewness: roundedSkewness,
        kurtosis: roundedKurtosis
    };
    continuousState.visualizationData = visualizationData;
    
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
        visualizationData
    };
}

/**
 * =============================================
 * NORMAL DISTRIBUTION FUNCTIONS
 * =============================================
 */

/**
 * Calculates Normal distribution properties and probabilities
 * @param {Object} params - Calculator parameters
 * @returns {Object} - Results including probabilities, mean, variance, etc.
 */
function calculateNormal(params) {
    const { mean, stdDev, calculationType, x, decimals } = params;
    
    // Validate parameters
    if (stdDev <= 0) {
        return {
            error: 'The standard deviation must be greater than 0.'
        };
    }
    
    // Calculate variance
    const variance = Math.pow(stdDev, 2);
    
    // Calculate skewness and kurtosis
    const skewness = 0; // Normal distribution is symmetric
    const kurtosis = 3; // Normal distribution has kurtosis of 3
    
    // Calculate specific probability based on calculationType
    let result, formula, interpretation, steps;
    
    // Round to specified decimal places
    const decimalPlaces = parseInt(decimals) || 4;
    
    switch (calculationType) {
        case 'pdf':
            // PDF: f(x)
            const z = (x - mean) / stdDev;
            result = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);
            
            formula = `f(${x}) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{1}{2}(\\frac{x-\\mu}{\\sigma})^2} = \\frac{1}{${stdDev}\\sqrt{2\\pi}} e^{-\\frac{1}{2}(\\frac{${x}-${mean}}{${stdDev}})^2} = ${result}`;
            interpretation = `The probability density at x = ${x} is ${result.toFixed(6)}.`;
            
            steps = [
                `Step 1: Identify the normal distribution parameters.`,
                `Mean μ = ${mean}`,
                `Standard deviation σ = ${stdDev}`,
                `Step 2: Determine the value we're calculating.`,
                `We want to find f(${x})`,
                `Step 3: Calculate the z-score.`,
                `z = \\frac{x-\\mu}{\\sigma} = \\frac{${x}-${mean}}{${stdDev}} = ${z.toFixed(6)}`,
                `Step 4: Apply the normal PDF formula.`,
                `f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{1}{2}z^2}`,
                `f(${x}) = \\frac{1}{${stdDev}\\sqrt{2\\pi}} e^{-\\frac{1}{2}(${z.toFixed(6)})^2}`,
                `f(${x}) = \\frac{1}{${stdDev * Math.sqrt(2 * Math.PI).toFixed(6)}} \\cdot e^{-${(0.5 * z * z).toFixed(6)}}`,
                `f(${x}) = ${(1 / (stdDev * Math.sqrt(2 * Math.PI))).toFixed(6)} \\cdot ${Math.exp(-0.5 * z * z).toFixed(6)} = ${result.toFixed(6)}`
            ];
            break;
            
        case 'cdf':
            // CDF: F(x) = P(X ≤ x)
            const zCdf = (x - mean) / stdDev;
            result = normalCDF(zCdf);
            
            formula = `F(${x}) = P(X \\leq ${x}) = \\Phi(\\frac{${x}-${mean}}{${stdDev}}) = \\Phi(${zCdf.toFixed(4)}) = ${result}`;
            interpretation = `The probability P(X ≤ ${x}) is ${result.toFixed(6)}, which is the area under the normal curve to the left of ${x}.`;
            
            steps = [
                `Step 1: Identify the normal distribution parameters.`,
                `Mean μ = ${mean}`,
                `Standard deviation σ = ${stdDev}`,
                `Step 2: Determine the value we're calculating.`,
                `We want to find F(${x}) = P(X ≤ ${x})`,
                `Step 3: Convert to the standard normal distribution by calculating the z-score.`,
                `z = \\frac{x-\\mu}{\\sigma} = \\frac{${x}-${mean}}{${stdDev}} = ${zCdf.toFixed(6)}`,
                `Step 4: Find the cumulative probability using the standard normal CDF Φ(z).`,
                `F(${x}) = Φ(${zCdf.toFixed(6)}) = ${result.toFixed(6)}`
            ];
            break;
            
        case 'interval':
            // P(c ≤ X ≤ d)
            const c = parseFloat(params.c);
            const d = parseFloat(params.d);
            
            if (isNaN(c) || isNaN(d)) {
                return {
                    error: 'Please enter valid interval bounds.'
                };
            }
            
            if (c > d) {
                return {
                    error: 'The lower bound c must be less than or equal to the upper bound d.'
                };
            }
            
            // Calculate interval probability
            const zLower = (c - mean) / stdDev;
            const zUpper = (d - mean) / stdDev;
            
            const lowerProb = normalCDF(zLower);
            const upperProb = normalCDF(zUpper);
            
            result = upperProb - lowerProb;
            
            formula = `P(${c} \\leq X \\leq ${d}) = \\Phi(\\frac{${d}-${mean}}{${stdDev}}) - \\Phi(\\frac{${c}-${mean}}{${stdDev}}) = \\Phi(${zUpper.toFixed(4)}) - \\Phi(${zLower.toFixed(4)}) = ${upperProb.toFixed(6)} - ${lowerProb.toFixed(6)} = ${result}`;
            interpretation = `The probability P(${c} ≤ X ≤ ${d}) is ${result.toFixed(6)}, which is the area under the normal curve between ${c} and ${d}.`;
            
            steps = [
                `Step 1: Identify the normal distribution parameters.`,
                `Mean μ = ${mean}`,
                `Standard deviation σ = ${stdDev}`,
                `Step 2: Determine the interval we're calculating.`,
                `We want to find P(${c} ≤ X ≤ ${d})`,
                `Step 3: Convert the bounds to the standard normal distribution by calculating the z-scores.`,
                `z_lower = \\frac{${c}-${mean}}{${stdDev}} = ${zLower.toFixed(6)}`,
                `z_upper = \\frac{${d}-${mean}}{${stdDev}} = ${zUpper.toFixed(6)}`,
                `Step 4: Find the cumulative probabilities using the standard normal CDF Φ(z).`,
                `P(X ≤ ${c}) = Φ(${zLower.toFixed(6)}) = ${lowerProb.toFixed(6)}`,
                `P(X ≤ ${d}) = Φ(${zUpper.toFixed(6)}) = ${upperProb.toFixed(6)}`,
                `Step 5: Calculate the interval probability.`,
                `P(${c} ≤ X ≤ ${d}) = P(X ≤ ${d}) - P(X ≤ ${c}) = ${upperProb.toFixed(6)} - ${lowerProb.toFixed(6)} = ${result.toFixed(6)}`
            ];
            break;
            
        case 'above':
            // P(X > x)
            const zAbove = (x - mean) / stdDev;
            result = 1 - normalCDF(zAbove);
            
            formula = `P(X > ${x}) = 1 - P(X \\leq ${x}) = 1 - \\Phi(\\frac{${x}-${mean}}{${stdDev}}) = 1 - \\Phi(${zAbove.toFixed(4)}) = 1 - ${normalCDF(zAbove).toFixed(6)} = ${result}`;
            interpretation = `The probability P(X > ${x}) is ${result.toFixed(6)}, which is the area under the normal curve to the right of ${x}.`;
            
            steps = [
                `Step 1: Identify the normal distribution parameters.`,
                `Mean μ = ${mean}`,
                `Standard deviation σ = ${stdDev}`,
                `Step 2: Determine the value we're calculating.`,
                `We want to find P(X > ${x})`,
                `Step 3: Convert to the standard normal distribution by calculating the z-score.`,
                `z = \\frac{x-\\mu}{\\sigma} = \\frac{${x}-${mean}}{${stdDev}} = ${zAbove.toFixed(6)}`,
                `Step 4: Find the cumulative probability using the standard normal CDF Φ(z).`,
                `P(X ≤ ${x}) = Φ(${zAbove.toFixed(6)}) = ${normalCDF(zAbove).toFixed(6)}`,
                `Step 5: Calculate the probability of being above x.`,
                `P(X > ${x}) = 1 - P(X ≤ ${x}) = 1 - ${normalCDF(zAbove).toFixed(6)} = ${result.toFixed(6)}`
            ];
            break;
            
        case 'between':
            // P(|X - μ| ≤ k·σ)
            const k = parseFloat(params.k);
            
            if (isNaN(k) || k < 0) {
                return {
                    error: 'The value k must be a non-negative number.'
                };
            }
            
            // Calculate probability within k standard deviations of the mean
            const zK = k;
            result = normalCDF(zK) - normalCDF(-zK);
            
            formula = `P(|X - \\mu| \\leq k\\sigma) = P(\\mu - k\\sigma \\leq X \\leq \\mu + k\\sigma) = P(${mean} - ${k} \\cdot ${stdDev} \\leq X \\leq ${mean} + ${k} \\cdot ${stdDev}) = P(${mean - k * stdDev} \\leq X \\leq ${mean + k * stdDev}) = \\Phi(${k}) - \\Phi(-${k}) = ${normalCDF(k).toFixed(6)} - ${normalCDF(-k).toFixed(6)} = ${result}`;
            interpretation = `The probability that X is within ${k} standard deviations of the mean is ${result.toFixed(6)}, which is the area under the normal curve between μ-${k}σ and μ+${k}σ.`;
            
            steps = [
                `Step 1: Identify the normal distribution parameters.`,
                `Mean μ = ${mean}`,
                `Standard deviation σ = ${stdDev}`,
                `Step 2: Determine what we're calculating.`,
                `We want to find P(|X - μ| ≤ k·σ) = P(μ - k·σ ≤ X ≤ μ + k·σ)`,
                `Step 3: Calculate the interval bounds.`,
                `Lower bound = μ - k·σ = ${mean} - ${k} × ${stdDev} = ${mean - k * stdDev}`,
                `Upper bound = μ + k·σ = ${mean} + ${k} × ${stdDev} = ${mean + k * stdDev}`,
                `Step 4: Convert the bounds to the standard normal distribution by calculating the z-scores.`,
                `z_lower = \\frac{${mean - k * stdDev}-${mean}}{${stdDev}} = -${k}`,
                `z_upper = \\frac{${mean + k * stdDev}-${mean}}{${stdDev}} = ${k}`,
                `Step 5: Find the cumulative probabilities using the standard normal CDF Φ(z).`,
                `P(X ≤ μ - k·σ) = Φ(-${k}) = ${normalCDF(-k).toFixed(6)}`,
                `P(X ≤ μ + k·σ) = Φ(${k}) = ${normalCDF(k).toFixed(6)}`,
                `Step 6: Calculate the interval probability.`,
                `P(μ - k·σ ≤ X ≤ μ + k·σ) = P(X ≤ μ + k·σ) - P(X ≤ μ - k·σ) = ${normalCDF(k).toFixed(6)} - ${normalCDF(-k).toFixed(6)} = ${result.toFixed(6)}`
            ];
            break;
            
        case 'quantile':
            // Quantile function: F^(-1)(p) = μ + σ·Φ^(-1)(p)
            const p = parseFloat(params.p);
            
            if (isNaN(p) || p < 0 || p > 1) {
                return {
                    error: 'The probability p must be between 0 and 1.'
                };
            }
            
            const zQuantile = normalQuantile(p);
            result = mean + stdDev * zQuantile;
            
            formula = `F^{-1}(${p}) = \\mu + \\sigma \\cdot \\Phi^{-1}(${p}) = ${mean} + ${stdDev} \\cdot ${zQuantile.toFixed(4)} = ${result}`;
            interpretation = `The ${p === 0.5 ? 'median' : `${p*100}th percentile`} of the normal distribution is ${result.toFixed(6)}.`;
            
            steps = [
                `Step 1: Identify the normal distribution parameters.`,
                `Mean μ = ${mean}`,
                `Standard deviation σ = ${stdDev}`,
                `Step 2: Determine the quantile we're calculating.`,
                `We want to find the ${p*100}th percentile, which is the value x such that P(X ≤ x) = ${p}`,
                `Step 3: Find the z-score for this percentile using the standard normal quantile function Φ^{-1}(p).`,
                `Φ^{-1}(${p}) = ${zQuantile.toFixed(6)}`,
                `Step 4: Convert back to the original normal distribution.`,
                `F^{-1}(${p}) = μ + σ · Φ^{-1}(${p})`,
                `F^{-1}(${p}) = ${mean} + ${stdDev} × ${zQuantile.toFixed(6)} = ${mean} + ${(stdDev * zQuantile).toFixed(6)} = ${result.toFixed(6)}`
            ];
            break;
            
        case 'mean':
            result = mean;
            formula = `E[X] = \\mu = ${mean}`;
            interpretation = `The expected value (mean) of the normal distribution is ${mean}, which is the parameter μ.`;
            
            steps = [
                `Step 1: Identify the normal distribution parameters.`,
                `Mean μ = ${mean}`,
                `Standard deviation σ = ${stdDev}`,
                `Step 2: Apply the formula for the mean of a normal distribution.`,
                `E[X] = μ = ${mean}`
            ];
            break;
            
        case 'variance':
            result = variance;
            formula = `Var(X) = \\sigma^2 = ${stdDev}^2 = ${variance}`;
            interpretation = `The variance of the normal distribution is ${variance}, which is the square of the standard deviation.`;
            
            steps = [
                `Step 1: Identify the normal distribution parameters.`,
                `Mean μ = ${mean}`,
                `Standard deviation σ = ${stdDev}`,
                `Step 2: Apply the formula for the variance of a normal distribution.`,
                `Var(X) = σ² = ${stdDev}² = ${variance}`
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
    const visualizationData = generateNormalVisualization(mean, stdDev);
    
    // Store in state for later use
    continuousState.currentDistribution = 'normal';
    continuousState.parameters = { mean, stdDev };
    continuousState.calculationResults = { 
        mean: roundedMean, 
        variance: roundedVariance,
        stdDev: roundedStdDev,
        skewness: roundedSkewness,
        kurtosis: roundedKurtosis
    };
    continuousState.visualizationData = visualizationData;
    
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
        visualizationData
    };
}

/**
 * =============================================
 * EXPONENTIAL DISTRIBUTION FUNCTIONS
 * =============================================
 */

/**
 * Calculates Exponential distribution properties and probabilities
 * @param {Object} params - Calculator parameters
 * @returns {Object} - Results including probabilities, mean, variance, etc.
 */
function calculateExponential(params) {
    const { rate, calculationType, x, decimals } = params;
    
    // Validate parameters
    if (rate <= 0) {
        return {
            error: 'The rate parameter λ must be greater than 0.'
        };
    }
    
    // Calculate mean and variance
    const mean = 1 / rate;
    const variance = 1 / (rate * rate);
    const stdDev = Math.sqrt(variance);
    
    // Calculate skewness and kurtosis
    const skewness = 2; // Exponential distribution has skewness of 2
    const kurtosis = 9; // Exponential distribution has kurtosis of 9
    
    // Calculate specific probability based on calculationType
    let result, formula, interpretation, steps;
    
    // Round to specified decimal places
    const decimalPlaces = parseInt(decimals) || 4;
    
    switch (calculationType) {
        case 'pdf':
            // PDF: f(x) = λe^(-λx) for x ≥ 0, 0 otherwise
            if (x < 0) {
                result = 0;
                formula = `f(${x}) = 0 \\text{ (since ${x} < 0)}`;
                interpretation = `The probability density at x = ${x} is 0, since the exponential distribution is only defined for non-negative values.`;
            } else {
                result = rate * Math.exp(-rate * x);
                formula = `f(${x}) = \\lambda e^{-\\lambda x} = ${rate} \\cdot e^{-${rate} \\cdot ${x}} = ${rate} \\cdot e^{-${rate * x}} = ${result}`;
                interpretation = `The probability density at x = ${x} is ${result.toFixed(6)}.`;
            }
            
            steps = [
                `Step 1: Identify the exponential distribution parameter.`,
                `Rate parameter λ = ${rate}`,
                `Step 2: Determine the value we're calculating.`,
                `We want to find f(${x})`,
                `Step 3: Apply the exponential PDF formula.`
            ];
            
            if (x < 0) {
                steps.push(`Since ${x} < 0 and the exponential distribution is only defined for x ≥ 0, f(${x}) = 0`);
            } else {
                steps.push(`f(x) = λe^{-λx}`);
                steps.push(`f(${x}) = ${rate} × e^{-${rate} × ${x}}`);
                steps.push(`f(${x}) = ${rate} × e^{-${rate * x}} = ${rate} × ${Math.exp(-rate * x).toFixed(6)} = ${result.toFixed(6)}`);
            }
            break;
            
        case 'cdf':
            // CDF: F(x) = 1 - e^(-λx) for x ≥ 0, 0 otherwise
            if (x < 0) {
                result = 0;
                formula = `F(${x}) = 0 \\text{ (since ${x} < 0)}`;
                interpretation = `The probability P(X ≤ ${x}) is 0, since the exponential distribution is only defined for non-negative values.`;
            } else {
                result = 1 - Math.exp(-rate * x);
                formula = `F(${x}) = 1 - e^{-\\lambda x} = 1 - e^{-${rate} \\cdot ${x}} = 1 - e^{-${rate * x}} = 1 - ${Math.exp(-rate * x)} = ${result}`;
                interpretation = `The probability P(X ≤ ${x}) is ${result.toFixed(6)}, which is the area under the exponential curve from 0 to ${x}.`;
            }
            
            steps = [
                `Step 1: Identify the exponential distribution parameter.`,
                `Rate parameter λ = ${rate}`,
                `Step 2: Determine the value we're calculating.`,
                `We want to find F(${x}) = P(X ≤ ${x})`,
                `Step 3: Apply the exponential CDF formula.`
            ];
            
            if (x < 0) {
                steps.push(`Since ${x} < 0 and the exponential distribution is only defined for x ≥ 0, F(${x}) = 0`);
            } else {
                steps.push(`F(x) = 1 - e^{-λx}`);
                steps.push(`F(${x}) = 1 - e^{-${rate} × ${x}}`);
                steps.push(`F(${x}) = 1 - e^{-${rate * x}} = 1 - ${Math.exp(-rate * x).toFixed(6)} = ${result.toFixed(6)}`);
            }
            break;
            
        case 'interval':
            // P(a ≤ X ≤ b)
            const a = parseFloat(params.a);
            const b = parseFloat(params.b);
            
            if (isNaN(a) || isNaN(b)) {
                return {
                    error: 'Please enter valid interval bounds.'
                };
            }
            
            if (a > b) {
                return {
                    error: 'The lower bound a must be less than or equal to the upper bound b.'
                };
            }
            
            // Calculate interval probability
            if (b <= 0) {
                result = 0;
                formula = `P(${a} \\leq X \\leq ${b}) = 0 \\text{ (since ${b} \\leq 0)}`;
                interpretation = `The probability P(${a} ≤ X ≤ ${b}) is 0, since the exponential distribution is only defined for positive values.`;
            } else if (a < 0) {
                // Adjust the lower bound to 0 if it's negative
                result = 1 - Math.exp(-rate * b);
                formula = `P(${a} \\leq X \\leq ${b}) = P(0 \\leq X \\leq ${b}) = F(${b}) = 1 - e^{-\\lambda ${b}} = 1 - e^{-${rate} \\cdot ${b}} = 1 - ${Math.exp(-rate * b)} = ${result}`;
                interpretation = `The probability P(${a} ≤ X ≤ ${b}) is ${result.toFixed(6)}, which is the area under the exponential curve from 0 to ${b}.`;
            } else {
                // Both bounds are non-negative
                result = Math.exp(-rate * a) - Math.exp(-rate * b);
                formula = `P(${a} \\leq X \\leq ${b}) = F(${b}) - F(${a}) = (1 - e^{-\\lambda ${b}}) - (1 - e^{-\\lambda ${a}}) = e^{-\\lambda ${a}} - e^{-\\lambda ${b}} = e^{-${rate} \\cdot ${a}} - e^{-${rate} \\cdot ${b}} = ${Math.exp(-rate * a)} - ${Math.exp(-rate * b)} = ${result}`;
                interpretation = `The probability P(${a} ≤ X ≤ ${b}) is ${result.toFixed(6)}, which is the area under the exponential curve from ${a} to ${b}.`;
            }
            
            steps = [
                `Step 1: Identify the exponential distribution parameter.`,
                `Rate parameter λ = ${rate}`,
                `Step 2: Determine the interval we're calculating.`,
                `We want to find P(${a} ≤ X ≤ ${b})`,
                `Step 3: Apply the exponential CDF formula.`
            ];
            
            if (b <= 0) {
                steps.push(`Since ${b} ≤ 0 and the exponential distribution is only defined for x > 0, P(${a} ≤ X ≤ ${b}) = 0`);
            } else if (a < 0) {
                steps.push(`Since ${a} < 0, we adjust the lower bound to 0`);
                steps.push(`P(${a} ≤ X ≤ ${b}) = P(0 ≤ X ≤ ${b}) = F(${b})`);
                steps.push(`F(${b}) = 1 - e^{-λ${b}}`);
                steps.push(`F(${b}) = 1 - e^{-${rate} × ${b}} = 1 - e^{-${rate * b}} = 1 - ${Math.exp(-rate * b).toFixed(6)} = ${result.toFixed(6)}`);
            } else {
                steps.push(`P(${a} ≤ X ≤ ${b}) = F(${b}) - F(${a})`);
                steps.push(`F(${b}) = 1 - e^{-λ${b}} = 1 - e^{-${rate} × ${b}} = 1 - ${Math.exp(-rate * b).toFixed(6)} = ${(1 - Math.exp(-rate * b)).toFixed(6)}`);
                steps.push(`F(${a}) = 1 - e^{-λ${a}} = 1 - e^{-${rate} × ${a}} = 1 - ${Math.exp(-rate * a).toFixed(6)} = ${(1 - Math.exp(-rate * a)).toFixed(6)}`);
                steps.push(`P(${a} ≤ X ≤ ${b}) = ${(1 - Math.exp(-rate * b)).toFixed(6)} - ${(1 - Math.exp(-rate * a)).toFixed(6)} = ${result.toFixed(6)}`);
                steps.push(`This can also be written as: P(${a} ≤ X ≤ ${b}) = e^{-λ${a}} - e^{-λ${b}} = ${Math.exp(-rate * a).toFixed(6)} - ${Math.exp(-rate * b).toFixed(6)} = ${result.toFixed(6)}`);
            }
            break;
            
        case 'memoryless':
            // P(X > s + t | X > s) = P(X > t)
            const s = parseFloat(params.s);
            const t = parseFloat(params.t);
            
            if (isNaN(s) || isNaN(t)) {
                return {
                    error: 'Please enter valid values for s and t.'
                };
            }
            
            if (s < 0 || t < 0) {
                return {
                    error: 'The values s and t must be non-negative.'
                };
            }
            
            // Calculate conditional probability P(X > s + t | X > s)
            result = Math.exp(-rate * t);
            formula = `P(X > ${s} + ${t} | X > ${s}) = \\frac{P(X > ${s} + ${t})}{P(X > ${s})} = \\frac{e^{-\\lambda(${s}+${t})}}{e^{-\\lambda ${s}}} = e^{-\\lambda ${t}} = e^{-${rate} \\cdot ${t}} = ${result}`;
            interpretation = `The conditional probability P(X > ${s + t} | X > ${s}) is ${result.toFixed(6)}, which equals P(X > ${t}) = ${result.toFixed(6)}. This demonstrates the memoryless property of the exponential distribution.`;
            
            steps = [
                `Step 1: Identify the exponential distribution parameter.`,
                `Rate parameter λ = ${rate}`,
                `Step 2: Determine what we're calculating.`,
                `We want to find P(X > ${s} + ${t} | X > ${s})`,
                `Step 3: Apply the conditional probability formula.`,
                `P(X > ${s} + ${t} | X > ${s}) = P(X > ${s} + ${t}) / P(X > ${s})`,
                `Step 4: Calculate the probabilities.`,
                `P(X > ${s}) = 1 - F(${s}) = 1 - (1 - e^{-λ${s}}) = e^{-λ${s}} = e^{-${rate} × ${s}} = ${Math.exp(-rate * s).toFixed(6)}`,
                `P(X > ${s + t}) = 1 - F(${s + t}) = 1 - (1 - e^{-λ(${s}+${t})}) = e^{-λ(${s}+${t})} = e^{-${rate} × ${s+t}} = ${Math.exp(-rate * (s+t)).toFixed(6)}`,
                `Step 5: Calculate the conditional probability.`,
                `P(X > ${s} + ${t} | X > ${s}) = ${Math.exp(-rate * (s+t)).toFixed(6)} / ${Math.exp(-rate * s).toFixed(6)} = e^{-λ${t}} = e^{-${rate} × ${t}} = ${result.toFixed(6)}`,
                `Step 6: Verify the memoryless property.`,
                `P(X > ${t}) = 1 - F(${t}) = 1 - (1 - e^{-λ${t}}) = e^{-λ${t}} = e^{-${rate} × ${t}} = ${Math.exp(-rate * t).toFixed(6)}`,
                `Since P(X > ${s} + ${t} | X > ${s}) = P(X > ${t}), the memoryless property is confirmed.`
            ];
            break;
            
        case 'quantile':
            // Quantile function: F^(-1)(p) = -ln(1-p)/λ
            const p = parseFloat(params.p);
            
            if (isNaN(p) || p < 0 || p > 1) {
                return {
                    error: 'The probability p must be between 0 and 1.'
                };
            }
            
            if (p === 1) {
                result = Infinity;
                formula = `F^{-1}(${p}) = -\\frac{\\ln(1-${p})}{\\lambda} = \\infty`;
                interpretation = `The ${p*100}th percentile of the exponential distribution is infinity, as the exponential distribution has an infinite tail.`;
            } else {
                result = -Math.log(1 - p) / rate;
                formula = `F^{-1}(${p}) = -\\frac{\\ln(1-${p})}{\\lambda} = -\\frac{\\ln(1-${p})}{${rate}} = -\\frac{${Math.log(1-p)}}{${rate}} = ${result}`;
                interpretation = `The ${p*100}th percentile of the exponential distribution is ${result.toFixed(6)}.`;
            }
            
            steps = [
                `Step 1: Identify the exponential distribution parameter.`,
                `Rate parameter λ = ${rate}`,
                `Step 2: Determine the quantile we're calculating.`,
                `We want to find the ${p*100}th percentile, which is the value x such that P(X ≤ x) = ${p}`,
                `Step 3: Apply the exponential quantile function formula.`,
                `F^{-1}(p) = -\\ln(1-p)/λ`
            ];
            
            if (p === 1) {
                steps.push(`Since p = 1, F^{-1}(1) = -\\ln(1-1)/λ = -\\ln(0)/λ = ∞`);
            } else {
                steps.push(`F^{-1}(${p}) = -\\ln(1-${p})/λ = -\\ln(${1-p})/${rate} = ${-Math.log(1-p)}/${rate} = ${result.toFixed(6)}`);
            }
            break;
            
        case 'mean':
            result = mean;
            formula = `E[X] = \\frac{1}{\\lambda} = \\frac{1}{${rate}} = ${result}`;
            interpretation = `The expected value (mean) of the exponential distribution is ${result}, which is the reciprocal of the rate parameter λ.`;
            
            steps = [
                `Step 1: Identify the exponential distribution parameter.`,
                `Rate parameter λ = ${rate}`,
                `Step 2: Apply the formula for the mean of an exponential distribution.`,
                `E[X] = 1/λ = 1/${rate} = ${result}`
            ];
            break;
            
        case 'variance':
            result = variance;
            formula = `Var(X) = \\frac{1}{\\lambda^2} = \\frac{1}{${rate}^2} = \\frac{1}{${rate * rate}} = ${result}`;
            interpretation = `The variance of the exponential distribution is ${result}, which is the reciprocal of the square of the rate parameter λ.`;
            
            steps = [
                `Step 1: Identify the exponential distribution parameter.`,
                `Rate parameter λ = ${rate}`,
                `Step 2: Apply the formula for the variance of an exponential distribution.`,
                `Var(X) = 1/λ² = 1/${rate}² = 1/${rate * rate} = ${result}`
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
    const visualizationData = generateExponentialVisualization(rate);
    
    // Store in state for later use
    continuousState.currentDistribution = 'exponential';
    continuousState.parameters = { rate };
    continuousState.calculationResults = { 
        mean: roundedMean, 
        variance: roundedVariance,
        stdDev: roundedStdDev,
        skewness: roundedSkewness,
        kurtosis: roundedKurtosis
    };
    continuousState.visualizationData = visualizationData;
    
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
        visualizationData
    };
}

/**
 * =============================================
 * GAMMA DISTRIBUTION FUNCTIONS
 * =============================================
 */

/**
 * Calculates Gamma distribution properties and probabilities
 * @param {Object} params - Calculator parameters
 * @returns {Object} - Results including probabilities, mean, variance, etc.
 */
function calculateGamma(params) {
    const { shape, rate, calculationType, x, decimals } = params;
    
    // Validate parameters
    if (shape <= 0) {
        return {
            error: 'The shape parameter α must be greater than 0.'
        };
    }
    
    if (rate <= 0) {
        return {
            error: 'The rate parameter λ must be greater than 0.'
        };
    }
    
    // Calculate alternative scale parameter (sometimes used instead of rate)
    const scale = 1 / rate;
    
    // Calculate mean and variance
    const mean = shape / rate;
    const variance = shape / (rate * rate);
    const stdDev = Math.sqrt(variance);
    
    // Calculate skewness and kurtosis
    const skewness = 2 / Math.sqrt(shape);
    const kurtosis = 3 + 6 / shape;
    
    // Calculate specific probability based on calculationType
    let result, formula, interpretation, steps;
    
    // Round to specified decimal places
    const decimalPlaces = parseInt(decimals) || 4;
    
    switch (calculationType) {
        case 'pdf':
            // PDF: f(x) = (λ^α * x^(α-1) * e^(-λx)) / Γ(α) for x > 0, 0 otherwise
            if (x <= 0) {
                result = 0;
                formula = `f(${x}) = 0 \\text{ (since ${x} \\leq 0)}`;
                interpretation = `The probability density at x = ${x} is 0, since the gamma distribution is only defined for positive values.`;
            } else {
                const gammaPart = gammaFunction(shape);
                result = (Math.pow(rate, shape) * Math.pow(x, shape - 1) * Math.exp(-rate * x)) / gammaPart;
                formula = `f(${x}) = \\frac{\\lambda^{\\alpha} x^{\\alpha-1} e^{-\\lambda x}}{\\Gamma(\\alpha)} = \\frac{${rate}^{${shape}} \\cdot ${x}^{${shape}-1} \\cdot e^{-${rate} \\cdot ${x}}}{\\Gamma(${shape})} = ${result}`;
                interpretation = `The probability density at x = ${x} is ${result.toFixed(6)}.`;
            }
            
            steps = [
                `Step 1: Identify the gamma distribution parameters.`,
                `Shape parameter α = ${shape}`,
                `Rate parameter λ = ${rate}`,
                `Step 2: Determine the value we're calculating.`,
                `We want to find f(${x})`,
                `Step 3: Apply the gamma PDF formula.`
            ];
            
            if (x <= 0) {
                steps.push(`Since ${x} ≤ 0 and the gamma distribution is only defined for x > 0, f(${x}) = 0`);
            } else {
                steps.push(`f(x) = \\frac{λ^α · x^{α-1} · e^{-λx}}{Γ(α)}`);
                
                const gammaPart = gammaFunction(shape);
                const ratePower = Math.pow(rate, shape);
                const xPower = Math.pow(x, shape - 1);
                const expPart = Math.exp(-rate * x);
                
                steps.push(`Calculate Γ(${shape}) = ${gammaPart.toFixed(6)}`);
                steps.push(`Calculate λ^α = ${rate}^{${shape}} = ${ratePower.toFixed(6)}`);
                steps.push(`Calculate x^{α-1} = ${x}^{${shape-1}} = ${xPower.toFixed(6)}`);
                steps.push(`Calculate e^{-λx} = e^{-${rate} × ${x}} = e^{-${rate * x}} = ${expPart.toFixed(6)}`);
                steps.push(`f(${x}) = \\frac{${ratePower.toFixed(6)} × ${xPower.toFixed(6)} × ${expPart.toFixed(6)}}{${gammaPart.toFixed(6)}} = ${result.toFixed(6)}`);
            }
            break;
            
        case 'cdf':
            // CDF: F(x) = P(X ≤ x)
            if (x <= 0) {
                result = 0;
                formula = `F(${x}) = 0 \\text{ (since ${x} \\leq 0)}`;
                interpretation = `The probability P(X ≤ ${x}) is 0, since the gamma distribution is only defined for positive values.`;
            } else {
                // For the gamma CDF, we use the regularized incomplete gamma function
                result = lowerIncompleteGamma(shape, rate * x);
                formula = `F(${x}) = \\frac{\\gamma(\\alpha, \\lambda x)}{\\Gamma(\\alpha)} = \\frac{\\gamma(${shape}, ${rate} \\cdot ${x})}{\\Gamma(${shape})} = ${result}`;
                interpretation = `The probability P(X ≤ ${x}) is ${result.toFixed(6)}, which is the area under the gamma curve from 0 to ${x}.`;
            }
            
            steps = [
                `Step 1: Identify the gamma distribution parameters.`,
                `Shape parameter α = ${shape}`,
                `Rate parameter λ = ${rate}`,
                `Step 2: Determine the value we're calculating.`,
                `We want to find F(${x}) = P(X ≤ ${x})`,
                `Step 3: Apply the gamma CDF formula.`
            ];
            
            if (x <= 0) {
                steps.push(`Since ${x} ≤ 0 and the gamma distribution is only defined for x > 0, F(${x}) = 0`);
            } else {
                steps.push(`F(x) = \\frac{γ(α, λx)}{Γ(α)}`);
                steps.push(`Where γ(α, λx) is the lower incomplete gamma function and Γ(α) is the gamma function`);
                steps.push(`F(${x}) = \\frac{γ(${shape}, ${rate} × ${x})}{Γ(${shape})}`);
                steps.push(`This is computed numerically as: ${result.toFixed(6)}`);
                
                // Add special cases for integer shape values
                if (Number.isInteger(shape) && shape <= 5) {
                    steps.push(`For integer shape values, we can express this as a sum:`);
                    let sum = "1 - e^{-λx}";
                    if (shape > 1) {
                        for (let i = 1; i < shape; i++) {
                            sum += ` - e^{-λx}\\frac{(λx)^${i}}{${i}!}`;
                        }
                        steps.push(`F(${x}) = ${sum}`);
                    }
                }
            }
            break;
            
        case 'interval':
            // P(a ≤ X ≤ b)
            const a = parseFloat(params.a);
            const b = parseFloat(params.b);
            
            if (isNaN(a) || isNaN(b)) {
                return {
                    error: 'Please enter valid interval bounds.'
                };
            }
            
            if (a > b) {
                return {
                    error: 'The lower bound a must be less than or equal to the upper bound b.'
                };
            }
            
            // Calculate interval probability
            if (b <= 0) {
                result = 0;
                formula = `P(${a} \\leq X \\leq ${b}) = 0 \\text{ (since ${b} \\leq 0)}`;
                interpretation = `The probability P(${a} ≤ X ≤ ${b}) is 0, since the gamma distribution is only defined for positive values.`;
            } else if (a <= 0) {
                // Adjust the lower bound to 0 if it's non-positive
                result = lowerIncompleteGamma(shape, rate * b);
                formula = `P(${a} \\leq X \\leq ${b}) = P(0 < X \\leq ${b}) = F(${b}) = \\frac{\\gamma(\\alpha, \\lambda ${b})}{\\Gamma(\\alpha)} = ${result}`;
                interpretation = `The probability P(${a} ≤ X ≤ ${b}) is ${result.toFixed(6)}, which is the area under the gamma curve from 0 to ${b}.`;
            } else {
                // Both bounds are positive
                const lowerCDF = lowerIncompleteGamma(shape, rate * a);
                const upperCDF = lowerIncompleteGamma(shape, rate * b);
                result = upperCDF - lowerCDF;
                formula = `P(${a} \\leq X \\leq ${b}) = F(${b}) - F(${a}) = \\frac{\\gamma(\\alpha, \\lambda ${b})}{\\Gamma(\\alpha)} - \\frac{\\gamma(\\alpha, \\lambda ${a})}{\\Gamma(\\alpha)} = ${upperCDF} - ${lowerCDF} = ${result}`;
                interpretation = `The probability P(${a} ≤ X ≤ ${b}) is ${result.toFixed(6)}, which is the area under the gamma curve from ${a} to ${b}.`;
            }
            
            steps = [
                `Step 1: Identify the gamma distribution parameters.`,
                `Shape parameter α = ${shape}`,
                `Rate parameter λ = ${rate}`,
                `Step 2: Determine the interval we're calculating.`,
                `We want to find P(${a} ≤ X ≤ ${b})`,
                `Step 3: Apply the gamma CDF formula.`
            ];
            
            if (b <= 0) {
                steps.push(`Since ${b} ≤ 0 and the gamma distribution is only defined for x > 0, P(${a} ≤ X ≤ ${b}) = 0`);
            } else if (a <= 0) {
                steps.push(`Since ${a} ≤ 0, we adjust the lower bound to 0`);
                steps.push(`P(${a} ≤ X ≤ ${b}) = P(0 < X ≤ ${b}) = F(${b})`);
                steps.push(`F(${b}) = \\frac{γ(${shape}, ${rate} × ${b})}{Γ(${shape})}`);
                steps.push(`This is computed numerically as: ${result.toFixed(6)}`);
            } else {
                steps.push(`P(${a} ≤ X ≤ ${b}) = F(${b}) - F(${a})`);
                steps.push(`F(${b}) = \\frac{γ(${shape}, ${rate} × ${b})}{Γ(${shape})} = ${upperCDF.toFixed(6)}`);
                steps.push(`F(${a}) = \\frac{γ(${shape}, ${rate} × ${a})}{Γ(${shape})} = ${lowerCDF.toFixed(6)}`);
                steps.push(`P(${a} ≤ X ≤ ${b}) = ${upperCDF.toFixed(6)} - ${lowerCDF.toFixed(6)} = ${result.toFixed(6)}`);
            }
            break;
            
        case 'mean':
            result = mean;
            formula = `E[X] = \\frac{\\alpha}{\\lambda} = \\frac{${shape}}{${rate}} = ${result}`;
            interpretation = `The expected value (mean) of the gamma distribution is ${result}, which equals α/λ.`;
            
            steps = [
                `Step 1: Identify the gamma distribution parameters.`,
                `Shape parameter α = ${shape}`,
                `Rate parameter λ = ${rate}`,
                `Step 2: Apply the formula for the mean of a gamma distribution.`,
                `E[X] = α/λ = ${shape}/${rate} = ${result}`
            ];
            break;
            
        case 'variance':
            result = variance;
            formula = `Var(X) = \\frac{\\alpha}{\\lambda^2} = \\frac{${shape}}{${rate}^2} = \\frac{${shape}}{${rate * rate}} = ${result}`;
            interpretation = `The variance of the gamma distribution is ${result}, which equals α/λ².`;
            
            steps = [
                `Step 1: Identify the gamma distribution parameters.`,
                `Shape parameter α = ${shape}`,
                `Rate parameter λ = ${rate}`,
                `Step 2: Apply the formula for the variance of a gamma distribution.`,
                `Var(X) = α/λ² = ${shape}/${rate}² = ${shape}/${rate * rate} = ${result}`
            ];
            break;
            
        case 'special':
            // Special cases of the gamma distribution
            const integerShape = Number.isInteger(shape);
            const halfIntegerShape = Number.isInteger(shape * 2) && !integerShape;
            
            let specialCaseInfo = '';
            
            if (shape === 1) {
                specialCaseInfo = `With shape parameter α = 1, this gamma distribution is equivalent to an exponential distribution with rate parameter λ = ${rate}.`;
            } else if (shape === 0.5 && rate === 0.5) {
                specialCaseInfo = `With shape parameter α = 0.5 and rate parameter λ = 0.5, this gamma distribution is equivalent to a chi-squared distribution with 1 degree of freedom.`;
            } else if (integerShape) {
                specialCaseInfo = `With integer shape parameter α = ${shape}, this gamma distribution is equivalent to an Erlang distribution, which represents the sum of ${shape} independent exponential random variables, each with rate parameter λ = ${rate}.`;
            } else if (halfIntegerShape) {
                specialCaseInfo = `With half-integer shape parameter α = ${shape}, this gamma distribution is related to the chi-squared distribution. Specifically, 2X follows a chi-squared distribution with ${2 * shape} degrees of freedom.`;
            }
            
            if (specialCaseInfo) {
                result = 'Special case identified';
                formula = `\\text{Gamma}(${shape}, ${rate})`;
                interpretation = specialCaseInfo;
            } else {
                result = 'No special case';
                formula = `\\text{Gamma}(${shape}, ${rate})`;
                interpretation = `No special case identified for this parameter combination.`;
            }
            
            steps = [
                `Step 1: Identify the gamma distribution parameters.`,
                `Shape parameter α = ${shape}`,
                `Rate parameter λ = ${rate}`,
                `Step 2: Check for special cases of the gamma distribution.`
            ];
            
            if (shape === 1) {
                steps.push(`When α = 1, the gamma distribution reduces to an exponential distribution with rate λ.`);
                steps.push(`PDF: f(x) = λe^{-λx}`);
                steps.push(`CDF: F(x) = 1 - e^{-λx}`);
            } else if (integerShape) {
                steps.push(`When α is a positive integer, the gamma distribution is also known as the Erlang distribution.`);
                steps.push(`It represents the sum of α independent exponential random variables, each with rate λ.`);
            } else if (halfIntegerShape) {
                steps.push(`When α is a half-integer (n/2 where n is odd), the gamma distribution is related to the chi-squared distribution.`);
                steps.push(`Specifically, if X ~ Gamma(α, λ), then 2λX ~ χ²(2α).`);
            }
            
            if (specialCaseInfo) {
                steps.push(`Special case: ${specialCaseInfo}`);
            } else {
                steps.push(`No special case identified for these parameters.`);
            }
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
    const visualizationData = generateGammaVisualization(shape, rate);
    
    // Store in state for later use
    continuousState.currentDistribution = 'gamma';
    continuousState.parameters = { shape, rate, scale };
    continuousState.calculationResults = { 
        mean: roundedMean, 
        variance: roundedVariance,
        stdDev: roundedStdDev,
        skewness: roundedSkewness,
        kurtosis: roundedKurtosis
    };
    continuousState.visualizationData = visualizationData;
    
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
        visualizationData
    };
}

/**
 * =============================================
 * VISUALIZATION DATA GENERATION FUNCTIONS
 * =============================================
 */

/**
 * Generates visualization data for the uniform distribution
 * @param {number} a - Lower bound
 * @param {number} b - Upper bound
 * @param {number} mean - Mean of the distribution
 * @param {number} stdDev - Standard deviation of the distribution
 * @returns {Object} - Visualization data object
 */
function generateUniformVisualization(a, b, mean, stdDev) {
    // Generate points for the PDF
    const pdfPoints = [];
    const cdfPoints = [];
    
    // Extend range slightly for better visualization
    const buffer = (b - a) * 0.2;
    const xMin = a - buffer;
    const xMax = b + buffer;
    
    const numPoints = 200;
    const step = (xMax - xMin) / (numPoints - 1);
    
    // Calculate PDF and CDF values
    for (let i = 0; i < numPoints; i++) {
        const x = xMin + i * step;
        let pdfValue = 0;
        let cdfValue = 0;
        
        if (x >= a && x <= b) {
            pdfValue = 1 / (b - a);
        }
        
        if (x < a) {
            cdfValue = 0;
        } else if (x > b) {
            cdfValue = 1;
        } else {
            cdfValue = (x - a) / (b - a);
        }
        
        pdfPoints.push({ x, y: pdfValue });
        cdfPoints.push({ x, y: cdfValue });
    }
    
    // Create markers for key values
    const markers = [
        { x: a, label: "a", value: a },
        { x: b, label: "b", value: b },
        { x: mean, label: "mean", value: mean }
    ];
    
    return {
        type: 'continuous',
        distribution: 'uniform',
        pdf: pdfPoints,
        cdf: cdfPoints,
        markers,
        xMin,
        xMax,
        yMax: Math.max(1.1 / (b - a), 1.1),
        mean,
        stdDev,
        parameters: { a, b }
    };
}

/**
 * Generates visualization data for the normal distribution
 * @param {number} mean - Mean of the distribution
 * @param {number} stdDev - Standard deviation of the distribution
 * @returns {Object} - Visualization data object
 */
function generateNormalVisualization(mean, stdDev) {
    // Generate points for the PDF
    const pdfPoints = [];
    const cdfPoints = [];
    
    // Define range as mean ± 4 standard deviations
    const xMin = mean - 4 * stdDev;
    const xMax = mean + 4 * stdDev;
    
    const numPoints = 200;
    const step = (xMax - xMin) / (numPoints - 1);
    
    // Calculate PDF and CDF values
    for (let i = 0; i < numPoints; i++) {
        const x = xMin + i * step;
        const z = (x - mean) / stdDev;
        
        const pdfValue = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z);
        const cdfValue = normalCDF(z);
        
        pdfPoints.push({ x, y: pdfValue });
        cdfPoints.push({ x, y: cdfValue });
    }
    
    // Create markers for standard deviations and mean
    const markers = [
        { x: mean - 3 * stdDev, label: "-3σ", value: mean - 3 * stdDev },
        { x: mean - 2 * stdDev, label: "-2σ", value: mean - 2 * stdDev },
        { x: mean - stdDev, label: "-1σ", value: mean - stdDev },
        { x: mean, label: "μ", value: mean },
        { x: mean + stdDev, label: "+1σ", value: mean + stdDev },
        { x: mean + 2 * stdDev, label: "+2σ", value: mean + 2 * stdDev },
        { x: mean + 3 * stdDev, label: "+3σ", value: mean + 3 * stdDev }
    ];
    
    // Calculate maximum PDF value (occurs at the mean)
    const maxPdf = (1 / (stdDev * Math.sqrt(2 * Math.PI)));
    
    return {
        type: 'continuous',
        distribution: 'normal',
        pdf: pdfPoints,
        cdf: cdfPoints,
        markers,
        xMin,
        xMax,
        yMax: maxPdf * 1.1,
        mean,
        stdDev,
        parameters: { mean, stdDev }
    };
}

/**
 * Generates visualization data for the exponential distribution
 * @param {number} rate - Rate parameter
 * @returns {Object} - Visualization data object
 */
function generateExponentialVisualization(rate) {
    // Generate points for the PDF
    const pdfPoints = [];
    const cdfPoints = [];
    
    const mean = 1 / rate;
    const stdDev = mean;
    
    // Define range as 0 to 5 * mean (covers most of the distribution)
    const xMin = 0;
    const xMax = Math.min(5 * mean, 10 / rate); // Limit to reasonable range
    
    const numPoints = 200;
    const step = xMax / (numPoints - 1);
    
    // Calculate PDF and CDF values
    for (let i = 0; i < numPoints; i++) {
        const x = i * step;
        
        const pdfValue = rate * Math.exp(-rate * x);
        const cdfValue = 1 - Math.exp(-rate * x);
        
        pdfPoints.push({ x, y: pdfValue });
        cdfPoints.push({ x, y: cdfValue });
    }
    
    // Create markers for mean and multiples of mean
    const markers = [
        { x: mean, label: "mean", value: mean },
        { x: mean * 2, label: "2×mean", value: mean * 2 },
        { x: mean * 3, label: "3×mean", value: mean * 3 }
    ];
    
    // Calculate maximum PDF value (occurs at x = 0)
    const maxPdf = rate;
    
    return {
        type: 'continuous',
        distribution: 'exponential',
        pdf: pdfPoints,
        cdf: cdfPoints,
        markers,
        xMin,
        xMax,
        yMax: maxPdf * 1.1,
        mean,
        stdDev,
        parameters: { rate }
    };
}

/**
 * Generates visualization data for the gamma distribution
 * @param {number} shape - Shape parameter
 * @param {number} rate - Rate parameter
 * @returns {Object} - Visualization data object
 */
function generateGammaVisualization(shape, rate) {
    // Generate points for the PDF
    const pdfPoints = [];
    const cdfPoints = [];
    
    const mean = shape / rate;
    const stdDev = Math.sqrt(shape / (rate * rate));
    
    // Define range based on shape parameter
    let xMin = 0;
    let xMax;
    
    if (shape < 1) {
        // For shape < 1, PDF approaches infinity as x approaches 0
        xMax = Math.max(10 * mean, 20);
    } else {
        // For shape ≥ 1, PDF is 0 at x = 0 and has mode at (shape - 1) / rate
        xMax = Math.max(5 * mean, 10);
    }
    
    const numPoints = 200;
    const step = xMax / (numPoints - 1);
    
    // Precalculate gamma function value for the shape parameter
    const gammaShapeValue = gammaFunction(shape);
    
    // Calculate PDF and CDF values
    for (let i = 0; i < numPoints; i++) {
        const x = i * step;
        
        let pdfValue = 0;
        let cdfValue = 0;
        
        if (x > 0) {
            pdfValue = (Math.pow(rate, shape) * Math.pow(x, shape - 1) * Math.exp(-rate * x)) / gammaShapeValue;
            cdfValue = lowerIncompleteGamma(shape, rate * x);
        }
        
        pdfPoints.push({ x, y: pdfValue });
        cdfPoints.push({ x, y: cdfValue });
    }
    
    // Create markers for mean and mode (if shape ≥ 1)
    const markers = [
        { x: mean, label: "mean", value: mean }
    ];
    
    if (shape > 1) {
        const mode = (shape - 1) / rate;
        markers.push({ x: mode, label: "mode", value: mode });
    }
    
    // Find maximum PDF value (for y-axis scaling)
    let maxPdf = 0;
    for (const point of pdfPoints) {
        if (point.y > maxPdf) {
            maxPdf = point.y;
        }
    }
    
    return {
        type: 'continuous',
        distribution: 'gamma',
        pdf: pdfPoints,
        cdf: cdfPoints,
        markers,
        xMin,
        xMax,
        yMax: maxPdf * 1.1,
        mean,
        stdDev,
        parameters: { shape, rate }
    };
}

/**
 * =============================================
 * SPECIAL FUNCTIONS FOR CONTINUOUS DISTRIBUTIONS
 * =============================================
 */

/**
 * Approximates the standard normal cumulative distribution function (CDF)
 * @param {number} z - Z-score
 * @returns {number} - Cumulative probability P(Z ≤ z)
 */
function normalCDF(z) {
    // Handle extreme values
    if (z < -8) return 0;
    if (z > 8) return 1;
    
    // Constants for the approximation
    const b1 = 0.31938153;
    const b2 = -0.356563782;
    const b3 = 1.781477937;
    const b4 = -1.821255978;
    const b5 = 1.330274429;
    const p = 0.2316419;
    const c = 0.39894228;
    
    // Calculate based on absolute value of z
    let x = Math.abs(z);
    let t = 1.0 / (1.0 + p * x);
    let y = 1.0 - c * Math.exp(-x * x / 2.0) * 
            (t * (b1 + t * (b2 + t * (b3 + t * (b4 + t * b5)))));
    
    return z < 0 ? 1 - y : y;
}

/**
 * Approximates the inverse of the standard normal CDF (quantile function)
 * @param {number} p - Probability (0 ≤ p ≤ 1)
 * @returns {number} - Z-score z such that P(Z ≤ z) = p
 */
function normalQuantile(p) {
    // Validate input
    if (p <= 0) return -Infinity;
    if (p >= 1) return Infinity;
    
    // Handle symmetry: if p > 0.5, calculate for 1-p and negate result
    if (p > 0.5) {
        return -normalQuantile(1 - p);
    }
    
    // Constants for the approximation (Beasley-Springer-Moro algorithm)
    const a0 = 2.50662823884;
    const a1 = -18.61500062529;
    const a2 = 41.39119773534;
    const a3 = -25.44106049637;
    
    const b0 = -8.47351093090;
    const b1 = 23.08336743743;
    const b2 = -21.06224101826;
    const b3 = 3.13082909833;
    
    const c0 = 0.3374754822726147;
    const c1 = 0.9761690190917186;
    const c2 = 0.1607979714918209;
    const c3 = 0.0276438810333863;
    const c4 = 0.0038405729373609;
    const c5 = 0.0003951896511919;
    const c6 = 0.0000321767881768;
    const c7 = 0.0000002888167364;
    const c8 = 0.0000003960315187;
    
    // Calculate approximation
    let y = p - 0.5;
    
    if (Math.abs(y) < 0.42) {
        // For central range
        const r = y * y;
        return y * (((a3 * r + a2) * r + a1) * r + a0) /
               (((b3 * r + b2) * r + b1) * r + b0);
    } else {
        // For tails
        let r = p;
        if (y > 0) r = 1 - p;
        r = Math.log(-Math.log(r));
        
        let z = c0 + r * (c1 + r * (c2 + r * (c3 + r * (c4 + r * (c5 + r * (c6 + r * (c7 + r * c8)))))));
        return y > 0 ? z : -z;
    }
}

/**
 * Calculates the gamma function for positive values
 * @param {number} x - Input value (positive)
 * @returns {number} - Gamma function value Γ(x)
 */
function gammaFunction(x) {
    // For integer values, return factorial(x-1)
    if (x === Math.floor(x) && x > 0) {
        return factorial(x - 1);
    }
    
    // For half-integer values, use specific formula
    if (x * 2 === Math.floor(x * 2) && x > 0) {
        const n = Math.floor(x);
        const factorialPart = factorial(2 * n - 1);
        return (factorialPart * Math.sqrt(Math.PI)) / (Math.pow(4, n) * factorial(n - 1));
    }
    
    // For other values, use Lanczos approximation
    // Constants for Lanczos approximation
    const p = [
        676.5203681218851,
        -1259.1392167224028,
        771.32342877765313,
        -176.61502916214059,
        12.507343278686905,
        -0.13857109526572012,
        9.9843695780195716e-6,
        1.5056327351493116e-7
    ];
    
    if (x < 0.5) {
        // Reflection formula: Γ(x) = π / (sin(πx) · Γ(1-x))
        return Math.PI / (Math.sin(Math.PI * x) * gammaFunction(1 - x));
    }
    
    x -= 1;
    let a = 0.99999999999980993;
    for (let i = 0; i < p.length; i++) {
        a += p[i] / (x + i + 1);
    }
    
    const t = x + p.length - 0.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, x + 0.5) * Math.exp(-t) * a;
}

/**
 * Calculates the regularized lower incomplete gamma function
 * P(a,x) = γ(a,x) / Γ(a)
 * @param {number} a - Shape parameter (positive)
 * @param {number} x - Upper limit of integration (positive)
 * @returns {number} - Regularized lower incomplete gamma function value
 */
function lowerIncompleteGamma(a, x) {
    // Special cases
    if (x <= 0) return 0;
    if (x >= 100 && a <= x) return 1; // Large x approximation
    
    // For integer a, we can use a simpler formula
    if (a === Math.floor(a) && a <= 20) {
        let sum = 0;
        const expTerm = Math.exp(-x);
        let term = expTerm;
        
        for (let i = 0; i < a; i++) {
            sum += term;
            term *= x / (i + 1);
        }
        
        return 1 - sum;
    }
    
    // For small a, use series expansion
    if (a < 1) {
        const gamma_a = gammaFunction(a);
        let sum = 0;
        let term = Math.pow(x, a) / a;
        
        for (let i = 0; i < 100; i++) {
            sum += term;
            term *= -x / (a + i + 1) * (i + 1);
            if (Math.abs(term) < 1e-10) break;
        }
        
        return Math.exp(-x) * sum / gamma_a;
    }
    
    // For general case, use continued fraction (Legendre's continued fraction)
    let b = x + 1 - a;
    let c = 1 / 1e-30;
    let d = 1 / b;
    let h = d;
    
    for (let i = 1; i <= 100; i++) {
        const an = -i * (i - a);
        b += 2;
        d = 1 / (b + an * d);
        c = b + an / c;
        const del = c * d;
        h *= del;
        
        if (Math.abs(del - 1) < 1e-10) {
            break;
        }
    }
    
    const gamma_a = gammaFunction(a);
    return 1 - Math.exp(-x) * Math.pow(x, a) * h / gamma_a;
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
 * Rounds a number to specified decimal places
 * @param {number} value - Value to round
 * @param {number} decimals - Number of decimal places
 * @returns {number} - Rounded value
 */
function round(value, decimals) {
    if (typeof value !== 'number' || isNaN(value)) return value;
    
    // Handle special cases
    if (value === Infinity) return Infinity;
    if (value === -Infinity) return -Infinity;
    
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
}

/**
 * Export all calculator functions
 */
export {
    calculateUniform,
    calculateNormal,
    calculateExponential,
    calculateGamma,
    continuousState
};