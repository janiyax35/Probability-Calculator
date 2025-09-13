/**
 * Advanced Probability Calculations
 * Contains functions for advanced probability techniques, transformations, and simulations
 * Random Variables & Probability Distributions
 */

// Global variables to store calculator states
let advancedState = {
    currentCalculation: '',
    parameters: {},
    calculationResults: {},
    simulationData: {}
};

/**
 * =============================================
 * MOMENT GENERATING FUNCTIONS
 * =============================================
 */

/**
 * Calculates moment generating function and moments
 * @param {Object} params - Calculator parameters
 * @returns {Object} - Results including moments, kurtosis, etc.
 */
function calculateMoments(params) {
    const { distribution, order, point, decimals } = params;
    
    // Validate parameters
    if (!distribution) {
        return {
            error: 'Please select a probability distribution.'
        };
    }
    
    const maxOrder = parseInt(order) || 4;
    if (maxOrder < 1 || maxOrder > 10) {
        return {
            error: 'Order must be between 1 and 10.'
        };
    }
    
    // Extract distribution parameters
    const distributionParams = { ...params };
    
    // Round to specified decimal places
    const decimalPlaces = parseInt(decimals) || 4;
    
    // Calculate MGF and moments based on distribution
    let mgf, moments, centralMoments, standardizedMoments, formula, interpretation, steps;
    
    switch (distribution) {
        case 'normal':
            const mean = parseFloat(params.mean) || 0;
            const stdDev = parseFloat(params.stdDev) || 1;
            const variance = stdDev * stdDev;
            const t = parseFloat(point) || 1;
            
            // Calculate MGF at point t
            mgf = Math.exp(mean * t + (variance * t * t) / 2);
            
            // Calculate moments up to order maxOrder
            moments = [];
            centralMoments = [];
            standardizedMoments = [];
            
            for (let i = 1; i <= maxOrder; i++) {
                if (i === 1) {
                    moments.push(mean);
                    centralMoments.push(0);
                    standardizedMoments.push(0);
                } else if (i === 2) {
                    moments.push(mean * mean + variance);
                    centralMoments.push(variance);
                    standardizedMoments.push(1);
                } else if (i === 3) {
                    moments.push(mean * mean * mean + 3 * mean * variance);
                    centralMoments.push(0);
                    standardizedMoments.push(0);
                } else if (i === 4) {
                    moments.push(mean * mean * mean * mean + 6 * mean * mean * variance + 3 * variance * variance);
                    centralMoments.push(3 * variance * variance);
                    standardizedMoments.push(3);
                } else {
                    // Higher moments follow a pattern for normal distribution
                    moments.push(calculateNormalMoment(i, mean, variance));
                    
                    if (i % 2 === 1) {
                        centralMoments.push(0);
                        standardizedMoments.push(0);
                    } else {
                        const central = calculateNormalCentralMoment(i, variance);
                        centralMoments.push(central);
                        standardizedMoments.push(central / Math.pow(variance, i / 2));
                    }
                }
            }
            
            formula = `M_X(t) = e^{\\mu t + \\frac{\\sigma^2 t^2}{2}}`;
            interpretation = `The moment generating function of a normal distribution allows us to derive all moments. The odd central moments are zero due to symmetry.`;
            
            steps = [
                `Step 1: Identify the normal distribution parameters.`,
                `Mean μ = ${mean}`,
                `Standard deviation σ = ${stdDev}`,
                `Variance σ² = ${variance}`,
                `Step 2: Apply the MGF formula for the normal distribution.`,
                `M_X(t) = e^{μt + σ²t²/2}`,
                `Step 3: Calculate the MGF at t = ${t}.`,
                `M_X(${t}) = e^{${mean} × ${t} + ${variance} × ${t}² / 2}`,
                `M_X(${t}) = e^{${mean * t} + ${variance * t * t / 2}} = ${mgf.toFixed(6)}`,
                `Step 4: Derive moments by differentiating the MGF.`,
                `First moment (mean): E[X] = μ = ${mean}`,
                `Second moment: E[X²] = μ² + σ² = ${mean * mean} + ${variance} = ${moments[1].toFixed(6)}`,
                `Step 5: Calculate central moments.`,
                `Second central moment: E[(X-μ)²] = σ² = ${variance}`,
                `Fourth central moment: E[(X-μ)⁴] = 3σ⁴ = 3 × ${variance}² = ${centralMoments[3].toFixed(6)}`
            ];
            break;
            
        case 'exponential':
            const rate = parseFloat(params.rate) || 1;
            const expT = parseFloat(point) || 1;
            
            // Check if MGF exists at point t
            if (expT >= rate) {
                return {
                    error: `The moment generating function does not exist for t = ${expT} ≥ λ = ${rate}.`
                };
            }
            
            // Calculate MGF at point t
            mgf = rate / (rate - expT);
            
            // Calculate moments up to order maxOrder
            moments = [];
            centralMoments = [];
            standardizedMoments = [];
            
            const expMean = 1 / rate;
            const expVariance = 1 / (rate * rate);
            
            for (let i = 1; i <= maxOrder; i++) {
                // Raw moments for exponential: E[X^r] = r!/λ^r
                const rawMoment = factorial(i) / Math.pow(rate, i);
                moments.push(rawMoment);
                
                // Central moments
                const central = calculateExponentialCentralMoment(i, rate);
                centralMoments.push(central);
                
                // Standardized moments
                standardizedMoments.push(central / Math.pow(expVariance, i / 2));
            }
            
            formula = `M_X(t) = \\frac{\\lambda}{\\lambda - t} \\quad \\text{for } t < \\lambda`;
            interpretation = `The moment generating function of an exponential distribution exists only for t < λ. The mean is 1/λ and variance is 1/λ².`;
            
            steps = [
                `Step 1: Identify the exponential distribution parameter.`,
                `Rate λ = ${rate}`,
                `Step 2: Apply the MGF formula for the exponential distribution.`,
                `M_X(t) = λ/(λ-t) for t < λ`,
                `Step 3: Check if the MGF exists at t = ${expT}.`,
                `Since ${expT} < ${rate}, the MGF exists.`,
                `Step 4: Calculate the MGF at t = ${expT}.`,
                `M_X(${expT}) = ${rate}/(${rate}-${expT}) = ${rate}/${rate-expT} = ${mgf.toFixed(6)}`,
                `Step 5: Derive moments using the formula E[X^r] = r!/λ^r.`,
                `First moment (mean): E[X] = 1/λ = 1/${rate} = ${expMean.toFixed(6)}`,
                `Second moment: E[X²] = 2!/λ² = 2/${rate}² = ${moments[1].toFixed(6)}`,
                `Step 6: Calculate central moments.`,
                `Second central moment (variance): E[(X-μ)²] = 1/λ² = ${expVariance.toFixed(6)}`,
                `Third central moment: E[(X-μ)³] = 2/λ³ = ${centralMoments[2].toFixed(6)}`
            ];
            break;
            
        case 'binomial':
            const n = parseInt(params.n) || 10;
            const p = parseFloat(params.p) || 0.5;
            const binomialT = parseFloat(point) || 0.1;
            
            // Calculate MGF at point t
            mgf = Math.pow(1 - p + p * Math.exp(binomialT), n);
            
            // Calculate moments up to order maxOrder
            moments = [];
            centralMoments = [];
            standardizedMoments = [];
            
            const binomialMean = n * p;
            const binomialVariance = n * p * (1 - p);
            
            for (let i = 1; i <= maxOrder; i++) {
                // For binomial, we can use recursive formulas for raw moments
                if (i === 1) {
                    moments.push(binomialMean);
                    centralMoments.push(0);
                    standardizedMoments.push(0);
                } else if (i === 2) {
                    moments.push(binomialMean * (1 - p) + binomialMean * binomialMean);
                    centralMoments.push(binomialVariance);
                    standardizedMoments.push(1);
                } else if (i === 3) {
                    const skewness = (1 - 2 * p) / Math.sqrt(n * p * (1 - p));
                    moments.push(calculateBinomialMoment(3, n, p));
                    centralMoments.push(skewness * Math.pow(binomialVariance, 3/2));
                    standardizedMoments.push(skewness);
                } else if (i === 4) {
                    const kurtosis = 3 + (1 - 6 * p * (1 - p)) / (n * p * (1 - p));
                    moments.push(calculateBinomialMoment(4, n, p));
                    centralMoments.push(kurtosis * binomialVariance * binomialVariance);
                    standardizedMoments.push(kurtosis);
                } else {
                    // Higher moments are more complex for binomial
                    moments.push(calculateBinomialMoment(i, n, p));
                    centralMoments.push(calculateBinomialCentralMoment(i, n, p));
                    standardizedMoments.push(centralMoments[i-1] / Math.pow(binomialVariance, i / 2));
                }
            }
            
            formula = `M_X(t) = (1-p+pe^t)^n`;
            interpretation = `The moment generating function of a binomial distribution helps analyze sums of independent Bernoulli trials. The mean is np and variance is np(1-p).`;
            
            steps = [
                `Step 1: Identify the binomial distribution parameters.`,
                `Number of trials n = ${n}`,
                `Success probability p = ${p}`,
                `Step 2: Apply the MGF formula for the binomial distribution.`,
                `M_X(t) = (1-p+pe^t)^n`,
                `Step 3: Calculate the MGF at t = ${binomialT}.`,
                `M_X(${binomialT}) = (1-${p}+${p}e^${binomialT})^${n}`,
                `M_X(${binomialT}) = (${1-p}+${p}×${Math.exp(binomialT).toFixed(6)})^${n} = ${Math.pow(1-p+p*Math.exp(binomialT), n).toFixed(6)}`,
                `Step 4: Derive moments.`,
                `First moment (mean): E[X] = np = ${n} × ${p} = ${binomialMean}`,
                `Second moment: E[X²] = np(1-p) + (np)² = ${binomialMean} × ${1-p} + ${binomialMean}² = ${moments[1].toFixed(6)}`,
                `Step 5: Calculate central moments.`,
                `Second central moment (variance): E[(X-μ)²] = np(1-p) = ${binomialVariance}`,
                `Third central moment: E[(X-μ)³] = np(1-p)(1-2p) = ${centralMoments[2].toFixed(6)}`
            ];
            break;
            
        case 'poisson':
            const lambda = parseFloat(params.lambda) || 1;
            const poissonT = parseFloat(point) || 0.1;
            
            // Calculate MGF at point t
            mgf = Math.exp(lambda * (Math.exp(poissonT) - 1));
            
            // Calculate moments up to order maxOrder
            moments = [];
            centralMoments = [];
            standardizedMoments = [];
            
            for (let i = 1; i <= maxOrder; i++) {
                // For Poisson, raw moments can be calculated recursively
                const rawMoment = calculatePoissonMoment(i, lambda);
                moments.push(rawMoment);
                
                // Central moments for Poisson follow specific patterns
                const central = calculatePoissonCentralMoment(i, lambda);
                centralMoments.push(central);
                
                // Standardized moments
                standardizedMoments.push(central / Math.pow(lambda, i / 2));
            }
            
            formula = `M_X(t) = e^{\\lambda(e^t-1)}`;
            interpretation = `The moment generating function of a Poisson distribution highlights its unique property where mean and variance are both equal to λ.`;
            
            steps = [
                `Step 1: Identify the Poisson distribution parameter.`,
                `Rate λ = ${lambda}`,
                `Step 2: Apply the MGF formula for the Poisson distribution.`,
                `M_X(t) = e^{λ(e^t-1)}`,
                `Step 3: Calculate the MGF at t = ${poissonT}.`,
                `M_X(${poissonT}) = e^{${lambda}(e^${poissonT}-1)}`,
                `M_X(${poissonT}) = e^{${lambda}(${Math.exp(poissonT).toFixed(6)}-1)} = e^{${lambda * (Math.exp(poissonT) - 1).toFixed(6)}} = ${mgf.toFixed(6)}`,
                `Step 4: Derive moments.`,
                `First moment (mean): E[X] = λ = ${lambda}`,
                `Second moment: E[X²] = λ + λ² = ${lambda} + ${lambda}² = ${moments[1].toFixed(6)}`,
                `Step 5: Calculate central moments.`,
                `Second central moment (variance): E[(X-μ)²] = λ = ${lambda}`,
                `Third central moment: E[(X-μ)³] = λ = ${lambda}`
            ];
            break;
            
        case 'uniform':
            const a = parseFloat(params.a) || 0;
            const b = parseFloat(params.b) || 1;
            const uniformT = parseFloat(point) || 0.5;
            
            // Check if MGF exists at point t
            if (uniformT === 0) {
                mgf = 1;
            } else {
                mgf = (Math.exp(uniformT * b) - Math.exp(uniformT * a)) / (uniformT * (b - a));
            }
            
            // Calculate moments up to order maxOrder
            moments = [];
            centralMoments = [];
            standardizedMoments = [];
            
            const uniformMean = (a + b) / 2;
            const uniformVariance = Math.pow(b - a, 2) / 12;
            
            for (let i = 1; i <= maxOrder; i++) {
                // Raw moments for uniform distribution
                const rawMoment = calculateUniformMoment(i, a, b);
                moments.push(rawMoment);
                
                // Central moments
                const central = calculateUniformCentralMoment(i, a, b);
                centralMoments.push(central);
                
                // Standardized moments
                standardizedMoments.push(central / Math.pow(uniformVariance, i / 2));
            }
            
            formula = `M_X(t) = \\frac{e^{tb} - e^{ta}}{t(b-a)}`;
            interpretation = `The moment generating function of a uniform distribution on [${a}, ${b}] reveals its symmetry properties. The mean is (a+b)/2 and variance is (b-a)²/12.`;
            
            steps = [
                `Step 1: Identify the uniform distribution parameters.`,
                `Lower bound a = ${a}`,
                `Upper bound b = ${b}`,
                `Step 2: Apply the MGF formula for the uniform distribution.`,
                `M_X(t) = (e^{tb} - e^{ta})/(t(b-a))`,
                `Step 3: Calculate the MGF at t = ${uniformT}.`,
                uniformT === 0 
                    ? `Since t = 0, M_X(0) = 1 by L'Hôpital's rule.`
                    : `M_X(${uniformT}) = (e^{${uniformT} × ${b}} - e^{${uniformT} × ${a}})/(${uniformT} × (${b-a}))`
                        + `\nM_X(${uniformT}) = (${Math.exp(uniformT * b).toFixed(6)} - ${Math.exp(uniformT * a).toFixed(6)})/${uniformT * (b-a)} = ${mgf.toFixed(6)}`,
                `Step 4: Derive moments.`,
                `First moment (mean): E[X] = (a+b)/2 = (${a}+${b})/2 = ${uniformMean}`,
                `Second moment: E[X²] = (a² + ab + b²)/3 = (${a*a} + ${a*b} + ${b*b})/3 = ${moments[1].toFixed(6)}`,
                `Step 5: Calculate central moments.`,
                `Second central moment (variance): E[(X-μ)²] = (b-a)²/12 = ${uniformVariance}`,
                `Fourth central moment: E[(X-μ)⁴] = (b-a)⁴/80 = ${centralMoments[3].toFixed(6)}`
            ];
            break;
            
        default:
            return {
                error: 'Unsupported distribution selected.'
            };
    }
    
    // Calculate skewness and kurtosis from standardized moments
    const skewness = standardizedMoments[2]; // 3rd standardized moment
    const kurtosis = standardizedMoments[3]; // 4th standardized moment
    
    // Round results
    const roundedMoments = moments.map(m => round(m, decimalPlaces));
    const roundedCentralMoments = centralMoments.map(m => round(m, decimalPlaces));
    const roundedStandardizedMoments = standardizedMoments.map(m => round(m, decimalPlaces));
    const roundedMgf = round(mgf, decimalPlaces);
    
    // Store in state for later use
    advancedState.currentCalculation = 'moments';
    advancedState.parameters = { distribution, ...distributionParams };
    advancedState.calculationResults = { 
        mgf: roundedMgf,
        moments: roundedMoments,
        centralMoments: roundedCentralMoments,
        standardizedMoments: roundedStandardizedMoments,
        skewness: round(skewness, decimalPlaces),
        kurtosis: round(kurtosis, decimalPlaces)
    };
    
    return {
        mgf: roundedMgf,
        moments: roundedMoments,
        centralMoments: roundedCentralMoments,
        standardizedMoments: roundedStandardizedMoments,
        skewness: round(skewness, decimalPlaces),
        kurtosis: round(kurtosis, decimalPlaces),
        formula,
        interpretation,
        steps
    };
}

/**
 * =============================================
 * TRANSFORMATIONS OF RANDOM VARIABLES
 * =============================================
 */

/**
 * Calculates transformed distribution properties
 * @param {Object} params - Calculator parameters
 * @returns {Object} - Results for transformed distribution
 */
function calculateTransformation(params) {
    const { distribution, transformationType, a, b, decimals } = params;
    
    // Validate parameters
    if (!distribution) {
        return {
            error: 'Please select a probability distribution.'
        };
    }
    
    if (!transformationType) {
        return {
            error: 'Please select a transformation type.'
        };
    }
    
    // Parse transformation parameters
    const paramA = parseFloat(a) || 1;
    const paramB = parseFloat(b) || 0;
    
    // Extract distribution parameters
    const distributionParams = { ...params };
    
    // Round to specified decimal places
    const decimalPlaces = parseInt(decimals) || 4;
    
    // Calculate transformed distribution based on distribution and transformation
    let result, formula, interpretation, steps;
    
    switch (distribution) {
        case 'normal':
            const mean = parseFloat(params.mean) || 0;
            const stdDev = parseFloat(params.stdDev) || 1;
            
            switch (transformationType) {
                case 'linear':
                    // Y = aX + b
                    const transformedMean = paramA * mean + paramB;
                    const transformedStdDev = Math.abs(paramA) * stdDev;
                    const transformedVariance = transformedStdDev * transformedStdDev;
                    
                    result = {
                        originalDistribution: 'Normal',
                        originalParams: { mean, stdDev },
                        transformedDistribution: 'Normal',
                        transformedParams: { mean: transformedMean, stdDev: transformedStdDev }
                    };
                    
                    formula = `Y = ${paramA}X + ${paramB}, \\quad X \\sim N(${mean}, ${stdDev}^2) \\implies Y \\sim N(${transformedMean}, ${transformedStdDev}^2)`;
                    interpretation = `A linear transformation of a normal random variable is still normal. The mean is transformed by the same linear function, while the standard deviation is scaled by the absolute value of the coefficient.`;
                    
                    steps = [
                        `Step 1: Identify the original distribution and transformation.`,
                        `Original: X ~ N(${mean}, ${stdDev}²)`,
                        `Transformation: Y = ${paramA}X + ${paramB}`,
                        `Step 2: Apply the properties of linear transformations of normal distributions.`,
                        `For Y = aX + b where X ~ N(μ, σ²):`,
                        `E[Y] = a×E[X] + b = ${paramA} × ${mean} + ${paramB} = ${transformedMean}`,
                        `Var(Y) = a²×Var(X) = ${paramA}² × ${stdDev}² = ${transformedVariance}`,
                        `Step 3: Determine the transformed distribution.`,
                        `Y ~ N(${transformedMean}, ${transformedStdDev}²)`
                    ];
                    break;
                    
                case 'square':
                    // Y = X^2
                    // Note: X^2 is not normal, but has a non-central chi-square distribution
                    // with 1 degree of freedom and non-centrality parameter (mean/stdDev)^2
                    const nonCentralityParam = Math.pow(mean / stdDev, 2);
                    const transformedMeanSq = stdDev * stdDev * (1 + nonCentralityParam);
                    const transformedVarianceSq = 2 * Math.pow(stdDev, 4) * (1 + 2 * nonCentralityParam);
                    
                    result = {
                        originalDistribution: 'Normal',
                        originalParams: { mean, stdDev },
                        transformedDistribution: 'Non-central Chi-square',
                        transformedParams: { 
                            df: 1, 
                            nonCentrality: nonCentralityParam,
                            mean: transformedMeanSq,
                            variance: transformedVarianceSq
                        }
                    };
                    
                    formula = `Y = X^2, \\quad X \\sim N(${mean}, ${stdDev}^2) \\implies Y \\sim \\chi'^2_1(${nonCentralityParam.toFixed(4)})`;
                    interpretation = `The square of a normal random variable follows a non-central chi-square distribution with 1 degree of freedom and non-centrality parameter (μ/σ)². When μ = 0, this simplifies to a standard chi-square distribution.`;
                    
                    steps = [
                        `Step 1: Identify the original distribution and transformation.`,
                        `Original: X ~ N(${mean}, ${stdDev}²)`,
                        `Transformation: Y = X²`,
                        `Step 2: Determine the distribution of Y.`,
                        `When X ~ N(μ, σ²), X² follows a non-central chi-square distribution.`,
                        `Specifically, Y ~ χ'²₁(λ) where λ = (μ/σ)² is the non-centrality parameter.`,
                        `Non-centrality parameter = (${mean}/${stdDev})² = ${nonCentralityParam.toFixed(6)}`,
                        `Step 3: Calculate the moments of the transformed distribution.`,
                        `E[Y] = σ²(1 + λ) = ${stdDev}²(1 + ${nonCentralityParam.toFixed(4)}) = ${transformedMeanSq.toFixed(6)}`,
                        `Var(Y) = 2σ⁴(1 + 2λ) = 2×${stdDev}⁴×(1 + 2×${nonCentralityParam.toFixed(4)}) = ${transformedVarianceSq.toFixed(6)}`
                    ];
                    
                    if (Math.abs(mean) < 0.000001) {
                        steps.push(`Note: Since μ ≈ 0, Y is approximately χ²₁, a standard chi-square with 1 degree of freedom.`);
                    }
                    break;
                    
                case 'exp':
                    // Y = e^X
                    // If X is normal, Y is log-normal
                    const transformedMeanExp = Math.exp(mean + stdDev * stdDev / 2);
                    const transformedVarianceExp = Math.exp(2 * mean + stdDev * stdDev) * (Math.exp(stdDev * stdDev) - 1);
                    
                    result = {
                        originalDistribution: 'Normal',
                        originalParams: { mean, stdDev },
                        transformedDistribution: 'Log-normal',
                        transformedParams: { 
                            logMean: mean,
                            logStdDev: stdDev,
                            mean: transformedMeanExp,
                            variance: transformedVarianceExp
                        }
                    };
                    
                    formula = `Y = e^X, \\quad X \\sim N(${mean}, ${stdDev}^2) \\implies Y \\sim \\text{LogNormal}(${mean}, ${stdDev}^2)`;
                    interpretation = `The exponential of a normal random variable follows a log-normal distribution. This transformation is common in finance for modeling asset prices and in reliability analysis.`;
                    
                    steps = [
                        `Step 1: Identify the original distribution and transformation.`,
                        `Original: X ~ N(${mean}, ${stdDev}²)`,
                        `Transformation: Y = e^X`,
                        `Step 2: Determine the distribution of Y.`,
                        `When X ~ N(μ, σ²), Y = e^X follows a log-normal distribution.`,
                        `Y ~ LogNormal(μ, σ²) where μ and σ² are the parameters of the underlying normal distribution.`,
                        `Step 3: Calculate the moments of the transformed distribution.`,
                        `E[Y] = e^{μ+σ²/2} = e^{${mean}+${stdDev}²/2} = e^{${mean + stdDev * stdDev / 2}} = ${transformedMeanExp.toFixed(6)}`,
                        `Var(Y) = e^{2μ+σ²}(e^{σ²}-1) = e^{2×${mean}+${stdDev}²}(e^{${stdDev}²}-1) = ${transformedVarianceExp.toFixed(6)}`
                    ];
                    break;
                    
                case 'abs':
                    // Y = |X|
                    // If X is normal, Y has a folded normal distribution
                    const z = mean / stdDev;
                    const transformedMeanAbs = stdDev * Math.sqrt(2 / Math.PI) * Math.exp(-z * z / 2) + mean * (1 - 2 * normalCDF(-mean / stdDev));
                    const transformedVarianceAbs = mean * mean + stdDev * stdDev - transformedMeanAbs * transformedMeanAbs;
                    
                    result = {
                        originalDistribution: 'Normal',
                        originalParams: { mean, stdDev },
                        transformedDistribution: 'Folded Normal',
                        transformedParams: { 
                            mu: mean,
                            sigma: stdDev,
                            mean: transformedMeanAbs,
                            variance: transformedVarianceAbs
                        }
                    };
                    
                    formula = `Y = |X|, \\quad X \\sim N(${mean}, ${stdDev}^2) \\implies Y \\sim \\text{FoldedNormal}(${mean}, ${stdDev}^2)`;
                    interpretation = `The absolute value of a normal random variable follows a folded normal distribution. This transformation is useful in signal processing and analyzing measurement errors.`;
                    
                    steps = [
                        `Step 1: Identify the original distribution and transformation.`,
                        `Original: X ~ N(${mean}, ${stdDev}²)`,
                        `Transformation: Y = |X|`,
                        `Step 2: Determine the distribution of Y.`,
                        `When X ~ N(μ, σ²), |X| follows a folded normal distribution.`,
                        `Step 3: Calculate the moments of the transformed distribution.`,
                        `Let z = μ/σ = ${mean}/${stdDev} = ${z.toFixed(6)}`,
                        `E[Y] = σ√(2/π)e^{-z²/2} + μ(1-2Φ(-z))`,
                        `E[Y] = ${stdDev}×√(2/π)×e^{-${z.toFixed(4)}²/2} + ${mean}×(1-2Φ(-${z.toFixed(4)}))`,
                        `E[Y] = ${transformedMeanAbs.toFixed(6)}`,
                        `Var(Y) = μ² + σ² - E[Y]² = ${mean}² + ${stdDev}² - ${transformedMeanAbs.toFixed(4)}² = ${transformedVarianceAbs.toFixed(6)}`
                    ];
                    break;
            }
            break;
            
        case 'exponential':
            const rate = parseFloat(params.rate) || 1;
            
            switch (transformationType) {
                case 'linear':
                    // Y = aX + b
                    // If X is exponential, aX + b is a shifted and scaled exponential when a > 0
                    if (paramA <= 0) {
                        return {
                            error: 'For an exponential distribution, linear transformations require a > 0 to maintain the distribution family.'
                        };
                    }
                    
                    const transformedRate = rate / paramA;
                    const shift = paramB;
                    
                    result = {
                        originalDistribution: 'Exponential',
                        originalParams: { rate },
                        transformedDistribution: 'Shifted Exponential',
                        transformedParams: { 
                            rate: transformedRate,
                            shift,
                            mean: 1 / transformedRate + shift,
                            variance: 1 / (transformedRate * transformedRate)
                        }
                    };
                    
                    formula = `Y = ${paramA}X + ${paramB}, \\quad X \\sim \\text{Exp}(${rate}) \\implies Y - ${paramB} \\sim \\text{Exp}(${transformedRate})`;
                    interpretation = `A linear transformation of an exponential random variable with a > 0 results in a shifted exponential distribution. The rate parameter is scaled by 1/a, and the distribution is shifted by b.`;
                    
                    steps = [
                        `Step 1: Identify the original distribution and transformation.`,
                        `Original: X ~ Exp(${rate})`,
                        `Transformation: Y = ${paramA}X + ${paramB}`,
                        `Step 2: Apply the properties of linear transformations of exponential distributions.`,
                        `For Y = aX + b where X ~ Exp(λ) and a > 0:`,
                        `Y - b ~ Exp(λ/a)`,
                        `New rate parameter = ${rate}/${paramA} = ${transformedRate}`,
                        `Step 3: Determine the transformed distribution.`,
                        `Y ~ Shifted Exponential with rate ${transformedRate} and shift ${shift}`,
                        `E[Y] = 1/rate + shift = 1/${transformedRate} + ${shift} = ${1 / transformedRate + shift}`,
                        `Var(Y) = 1/rate² = 1/${transformedRate}² = ${1 / (transformedRate * transformedRate)}`
                    ];
                    break;
                    
                case 'square':
                    // Y = X^2
                    // If X is exponential, X^2 has a generalized gamma distribution
                    const transformedMeanSq = 2 / (rate * rate);
                    const transformedVarianceSq = 20 / Math.pow(rate, 4);
                    
                    result = {
                        originalDistribution: 'Exponential',
                        originalParams: { rate },
                        transformedDistribution: 'Generalized Gamma',
                        transformedParams: { 
                            shape: 0.5,
                            scale: 2 / (rate * rate),
                            mean: transformedMeanSq,
                            variance: transformedVarianceSq
                        }
                    };
                    
                    formula = `Y = X^2, \\quad X \\sim \\text{Exp}(${rate}) \\implies Y \\sim \\text{GeneralizedGamma}(0.5, ${2 / (rate * rate)})`;
                    interpretation = `The square of an exponential random variable follows a generalized gamma distribution. This transformation changes the shape of the distribution significantly.`;
                    
                    steps = [
                        `Step 1: Identify the original distribution and transformation.`,
                        `Original: X ~ Exp(${rate})`,
                        `Transformation: Y = X²`,
                        `Step 2: Determine the distribution of Y.`,
                        `When X ~ Exp(λ), Y = X² follows a generalized gamma distribution.`,
                        `Step 3: Calculate the moments of the transformed distribution.`,
                        `E[Y] = 2/λ² = 2/${rate}² = ${transformedMeanSq}`,
                        `Var(Y) = 20/λ⁴ = 20/${Math.pow(rate, 4)} = ${transformedVarianceSq}`
                    ];
                    break;
                    
                case 'exp':
                    // Y = e^X
                    // If X is exponential, Y has a Pareto distribution
                    const alpha = rate;
                    const transformedMeanExp = (alpha > 1) ? alpha / (alpha - 1) : "Undefined (α ≤ 1)";
                    const transformedVarianceExp = (alpha > 2) ? (alpha / Math.pow(alpha - 1, 2)) / (alpha - 2) : "Undefined (α ≤ 2)";
                    
                    result = {
                        originalDistribution: 'Exponential',
                        originalParams: { rate },
                        transformedDistribution: 'Pareto',
                        transformedParams: { 
                            alpha,
                            xm: 1,
                            mean: transformedMeanExp,
                            variance: transformedVarianceExp
                        }
                    };
                    
                    formula = `Y = e^X, \\quad X \\sim \\text{Exp}(${rate}) \\implies Y \\sim \\text{Pareto}(${alpha}, 1)`;
                    interpretation = `The exponential of an exponential random variable follows a Pareto distribution. This transformation is often used in modeling income distributions and extreme value phenomena.`;
                    
                    steps = [
                        `Step 1: Identify the original distribution and transformation.`,
                        `Original: X ~ Exp(${rate})`,
                        `Transformation: Y = e^X`,
                        `Step 2: Determine the distribution of Y.`,
                        `When X ~ Exp(λ), Y = e^X follows a Pareto distribution with shape parameter α = λ and scale parameter xm = 1.`,
                        `Y ~ Pareto(${alpha}, 1)`,
                        `Step 3: Calculate the moments of the transformed distribution.`
                    ];
                    
                    if (alpha > 1) {
                        steps.push(`E[Y] = α/(α-1) = ${alpha}/(${alpha}-1) = ${alpha / (alpha - 1)}`);
                    } else {
                        steps.push(`E[Y] is undefined because α = ${alpha} ≤ 1`);
                    }
                    
                    if (alpha > 2) {
                        steps.push(`Var(Y) = α/((α-1)²(α-2)) = ${alpha}/(${alpha-1})²(${alpha-2}) = ${(alpha / Math.pow(alpha - 1, 2)) / (alpha - 2)}`);
                    } else {
                        steps.push(`Var(Y) is undefined because α = ${alpha} ≤ 2`);
                    }
                    break;
                    
                case 'min':
                    // Y = min(X₁, X₂, ..., Xₙ)
                    const n = parseInt(params.n) || 2;
                    if (n < 2) {
                        return {
                            error: 'For minimum/maximum transformations, n must be at least 2.'
                        };
                    }
                    
                    // Minimum of exponential RVs is exponential with rate = sum of rates
                    const newRate = n * rate;
                    
                    result = {
                        originalDistribution: 'Exponential',
                        originalParams: { rate },
                        transformedDistribution: 'Exponential',
                        transformedParams: { 
                            rate: newRate,
                            mean: 1 / newRate,
                            variance: 1 / (newRate * newRate)
                        }
                    };
                    
                    formula = `Y = \\min(X_1, X_2, \\ldots, X_${n}), \\quad X_i \\sim \\text{Exp}(${rate}) \\implies Y \\sim \\text{Exp}(${newRate})`;
                    interpretation = `The minimum of n independent exponential random variables with the same rate λ is exponential with rate nλ. This property is useful in reliability theory and survival analysis.`;
                    
                    steps = [
                        `Step 1: Identify the original distribution and transformation.`,
                        `Original: X₁, X₂, ..., X${n} ~ Exp(${rate}) (independent)`,
                        `Transformation: Y = min(X₁, X₂, ..., X${n})`,
                        `Step 2: Apply the property of minimum of exponential random variables.`,
                        `When X₁, X₂, ..., X${n} are independent and exponentially distributed with rate λ,`,
                        `min(X₁, X₂, ..., X${n}) ~ Exp(nλ)`,
                        `Step 3: Determine the transformed distribution.`,
                        `Y ~ Exp(${n} × ${rate}) = Exp(${newRate})`,
                        `E[Y] = 1/${newRate} = ${1 / newRate}`,
                        `Var(Y) = 1/${newRate}² = ${1 / (newRate * newRate)}`
                    ];
                    break;
            }
            break;
            
        case 'uniform':
            const a1 = parseFloat(params.a) || 0;
            const b1 = parseFloat(params.b) || 1;
            
            switch (transformationType) {
                case 'linear':
                    // Y = aX + b
                    // If X is uniform on [a,b], Y is uniform on [a*a1+b, a*b1+b]
                    const newLower = paramA * a1 + paramB;
                    const newUpper = paramA * b1 + paramB;
                    
                    // Ensure lower < upper
                    const lower = Math.min(newLower, newUpper);
                    const upper = Math.max(newLower, newUpper);
                    
                    result = {
                        originalDistribution: 'Uniform',
                        originalParams: { a: a1, b: b1 },
                        transformedDistribution: 'Uniform',
                        transformedParams: { 
                            a: lower,
                            b: upper,
                            mean: (lower + upper) / 2,
                            variance: Math.pow(upper - lower, 2) / 12
                        }
                    };
                    
                    formula = `Y = ${paramA}X + ${paramB}, \\quad X \\sim \\text{Uniform}(${a1}, ${b1}) \\implies Y \\sim \\text{Uniform}(${lower}, ${upper})`;
                    interpretation = `A linear transformation of a uniform random variable is still uniform, but on a transformed interval. The shape of the distribution remains the same, just shifted and scaled.`;
                    
                    steps = [
                        `Step 1: Identify the original distribution and transformation.`,
                        `Original: X ~ Uniform(${a1}, ${b1})`,
                        `Transformation: Y = ${paramA}X + ${paramB}`,
                        `Step 2: Apply the properties of linear transformations of uniform distributions.`,
                        `For Y = aX + b where X ~ Uniform(a₁, b₁):`,
                        `If a > 0: Y ~ Uniform(a×a₁+b, a×b₁+b)`,
                        `If a < 0: Y ~ Uniform(a×b₁+b, a×a₁+b)`,
                        `Step 3: Calculate the new interval.`,
                        `New lower bound = ${paramA > 0 ? `${paramA}×${a1}+${paramB}` : `${paramA}×${b1}+${paramB}`} = ${lower}`,
                        `New upper bound = ${paramA > 0 ? `${paramA}×${b1}+${paramB}` : `${paramA}×${a1}+${paramB}`} = ${upper}`,
                        `Step 4: Determine the transformed distribution.`,
                        `Y ~ Uniform(${lower}, ${upper})`,
                        `E[Y] = (${lower}+${upper})/2 = ${(lower + upper) / 2}`,
                        `Var(Y) = (${upper}-${lower})²/12 = ${Math.pow(upper - lower, 2) / 12}`
                    ];
                    break;
                    
                case 'square':
                    // Y = X^2
                    // Need to handle different cases based on the interval [a1,b1]
                    let pdfFormula, lowerBound, upperBound;
                    
                    if (a1 >= 0) {
                        // When a1 ≥ 0, Y is in [a1², b1²]
                        lowerBound = a1 * a1;
                        upperBound = b1 * b1;
                        pdfFormula = `f_Y(y) = \\frac{1}{2\\sqrt{y}(b_1-a_1)} \\text{ for } y \\in [${lowerBound}, ${upperBound}]`;
                    } else if (b1 <= 0) {
                        // When b1 ≤ 0, Y is in [b1², a1²]
                        lowerBound = b1 * b1;
                        upperBound = a1 * a1;
                        pdfFormula = `f_Y(y) = \\frac{1}{2\\sqrt{y}(a_1-b_1)} \\text{ for } y \\in [${lowerBound}, ${upperBound}]`;
                    } else {
                        // When a1 < 0 < b1, Y is in [0, max(a1², b1²)]
                        lowerBound = 0;
                        upperBound = Math.max(a1 * a1, b1 * b1);
                        pdfFormula = `f_Y(y) = \\frac{1}{2\\sqrt{y}(b_1-a_1)} \\text{ for } y \\in [0, ${upperBound}]`;
                    }
                    
                    const transformedMeanSq = (Math.pow(b1, 3) - Math.pow(a1, 3)) / (3 * (b1 - a1));
                    
                    result = {
                        originalDistribution: 'Uniform',
                        originalParams: { a: a1, b: b1 },
                        transformedDistribution: 'Power Function',
                        transformedParams: { 
                            lower: lowerBound,
                            upper: upperBound,
                            pdfFormula,
                            mean: transformedMeanSq
                        }
                    };
                    
                    formula = `Y = X^2, \\quad X \\sim \\text{Uniform}(${a1}, ${b1}) \\implies ${pdfFormula}`;
                    interpretation = `The square of a uniform random variable follows a power function distribution. The exact form depends on whether the original interval includes zero.`;
                    
                    steps = [
                        `Step 1: Identify the original distribution and transformation.`,
                        `Original: X ~ Uniform(${a1}, ${b1})`,
                        `Transformation: Y = X²`,
                        `Step 2: Determine the distribution of Y.`,
                        `The distribution depends on the location of the interval [${a1}, ${b1}] relative to 0.`,
                        a1 >= 0 
                            ? `Since ${a1} ≥ 0, Y is in [${a1}², ${b1}²] = [${lowerBound}, ${upperBound}]`
                            : b1 <= 0 
                                ? `Since ${b1} ≤ 0, Y is in [${b1}², ${a1}²] = [${lowerBound}, ${upperBound}]`
                                : `Since ${a1} < 0 < ${b1}, Y is in [0, max(${a1}², ${b1}²)] = [0, ${upperBound}]`,
                        `Step 3: Find the PDF of Y using the transformation formula.`,
                        `${pdfFormula}`,
                        `Step 4: Calculate the mean of the transformed distribution.`,
                        `E[Y] = E[X²] = (${b1}³-${a1}³)/(3(${b1}-${a1})) = ${transformedMeanSq.toFixed(6)}`
                    ];
                    break;
                    
                case 'log':
                    // Y = ln(X)
                    // If X is uniform on [a,b], Y is a truncated exponential on [ln(a), ln(b)]
                    
                    if (a1 <= 0) {
                        return {
                            error: 'For logarithmic transformation, the domain must be positive (a > 0).'
                        };
                    }
                    
                    const logLower = Math.log(a1);
                    const logUpper = Math.log(b1);
                    
                    result = {
                        originalDistribution: 'Uniform',
                        originalParams: { a: a1, b: b1 },
                        transformedDistribution: 'Truncated Exponential',
                        transformedParams: { 
                            lower: logLower,
                            upper: logUpper,
                            mean: (b1 * Math.log(b1) - a1 * Math.log(a1)) / (b1 - a1) - 1
                        }
                    };
                    
                    formula = `Y = \\ln(X), \\quad X \\sim \\text{Uniform}(${a1}, ${b1}) \\implies f_Y(y) = \\frac{e^y}{b-a} \\text{ for } y \\in [\\ln(${a1}), \\ln(${b1})]`;
                    interpretation = `The logarithm of a uniform random variable on [a,b] where a > 0 follows a truncated exponential distribution. This transformation is useful for transforming between linear and logarithmic scales.`;
                    
                    steps = [
                        `Step 1: Identify the original distribution and transformation.`,
                        `Original: X ~ Uniform(${a1}, ${b1})`,
                        `Transformation: Y = ln(X)`,
                        `Step 2: Verify the domain is valid for the logarithm.`,
                        `Since ${a1} > 0, the transformation is valid.`,
                        `Step 3: Determine the distribution of Y.`,
                        `The transformed variable Y has domain [ln(${a1}), ln(${b1})] = [${logLower.toFixed(6)}, ${logUpper.toFixed(6)}]`,
                        `The PDF of Y is f_Y(y) = e^y/(${b1}-${a1}) for y ∈ [${logLower.toFixed(6)}, ${logUpper.toFixed(6)}]`,
                        `Step 4: Calculate the mean of the transformed distribution.`,
                        `E[Y] = (${b1}×ln(${b1}) - ${a1}×ln(${a1}))/(${b1}-${a1}) - 1 = ${((b1 * Math.log(b1) - a1 * Math.log(a1)) / (b1 - a1) - 1).toFixed(6)}`
                    ];
                    break;
                    
                case 'max':
                    // Y = max(X₁, X₂, ..., Xₙ)
                    const numU = parseInt(params.n) || 2;
                    if (numU < 2) {
                        return {
                            error: 'For minimum/maximum transformations, n must be at least 2.'
                        };
                    }
                    
                    // For max of uniform RVs, use order statistics
                    // PDF: f_Y(y) = n * F_X(y)^(n-1) * f_X(y)
                    // For uniform, F_X(y) = (y-a)/(b-a) for y ∈ [a,b]
                    // So PDF of max: f_Y(y) = n * ((y-a)/(b-a))^(n-1) * 1/(b-a)
                    
                    const maxMean = a1 + (b1 - a1) * numU / (numU + 1);
                    
                    result = {
                        originalDistribution: 'Uniform',
                        originalParams: { a: a1, b: b1 },
                        transformedDistribution: 'Order Statistic (Beta)',
                        transformedParams: { 
                            a: a1,
                            b: b1,
                            alpha: numU,
                            beta: 1,
                            mean: maxMean
                        }
                    };
                    
                    formula = `Y = \\max(X_1, X_2, \\ldots, X_${numU}), \\quad X_i \\sim \\text{Uniform}(${a1}, ${b1}) \\implies Y \\sim a + (b-a)\\text{Beta}(${numU}, 1)`;
                    interpretation = `The maximum of n independent uniform random variables follows a scaled beta distribution. This result is an application of order statistics and is useful in reliability theory and extreme value analysis.`;
                    
                    steps = [
                        `Step 1: Identify the original distribution and transformation.`,
                        `Original: X₁, X₂, ..., X${numU} ~ Uniform(${a1}, ${b1}) (independent)`,
                        `Transformation: Y = max(X₁, X₂, ..., X${numU})`,
                        `Step 2: Apply the theory of order statistics.`,
                        `For n independent uniform random variables on [a,b], the maximum follows a scaled beta distribution.`,
                        `Specifically, (Y-a)/(b-a) ~ Beta(n,1)`,
                        `Step 3: Determine the transformed distribution.`,
                        `Y ~ ${a1} + (${b1}-${a1})Beta(${numU},1)`,
                        `Step 4: Calculate the mean of the transformed distribution.`,
                        `E[Y] = a + (b-a)×n/(n+1) = ${a1} + (${b1}-${a1})×${numU}/(${numU}+1) = ${maxMean.toFixed(6)}`
                    ];
                    break;
            }
            break;
            
        default:
            return {
                error: 'Unsupported distribution selected.'
            };
    }
    
    // Round results for display
    const roundedResult = roundObject(result, decimalPlaces);
    
    // Store in state for later use
    advancedState.currentCalculation = 'transformation';
    advancedState.parameters = { distribution, transformationType, ...distributionParams };
    advancedState.calculationResults = result;
    
    return {
        result: roundedResult,
        formula,
        interpretation,
        steps
    };
}

/**
 * =============================================
 * MONTE CARLO SIMULATION
 * =============================================
 */

/**
 * Performs Monte Carlo simulation for random variables
 * @param {Object} params - Calculator parameters
 * @returns {Object} - Simulation results and statistics
 */
function performMonteCarloSimulation(params) {
    const { distribution, numSamples, seed, simulationType, decimals } = params;
    
    // Validate parameters
    if (!distribution) {
        return {
            error: 'Please select a probability distribution.'
        };
    }
    
    const samples = parseInt(numSamples) || 10000;
    if (samples < 100 || samples > 1000000) {
        return {
            error: 'Number of samples must be between 100 and 1,000,000.'
        };
    }
    
    // Initialize random number generator with seed for reproducibility
    let rng;
    if (seed) {
        rng = seedrandom(seed);
    } else {
        rng = seedrandom();
    }
    
    // Extract distribution parameters
    const distributionParams = { ...params };
    
    // Round to specified decimal places
    const decimalPlaces = parseInt(decimals) || 4;
    
    // Generate samples based on distribution
    let simulatedSamples = [];
    let theoreticalMean, theoreticalVariance, theoreticalStdDev;
    let description, steps;
    
    switch (distribution) {
        case 'normal':
            const mean = parseFloat(params.mean) || 0;
            const stdDev = parseFloat(params.stdDev) || 1;
            
            theoreticalMean = mean;
            theoreticalVariance = stdDev * stdDev;
            theoreticalStdDev = stdDev;
            
            // Generate normal samples using Box-Muller transform
            for (let i = 0; i < samples; i++) {
                const u1 = rng();
                const u2 = rng();
                const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
                simulatedSamples.push(mean + stdDev * z);
            }
            
            description = `Monte Carlo simulation of a normal distribution with mean μ = ${mean} and standard deviation σ = ${stdDev}. The simulation used ${samples} samples generated using the Box-Muller transform.`;
            
            steps = [
                `Step 1: Identify the distribution and its parameters.`,
                `Distribution: Normal(${mean}, ${stdDev}²)`,
                `Step 2: Set up the random number generator with ${seed ? 'seed ' + seed : 'random seed'}.`,
                `Step 3: Generate ${samples} samples using the Box-Muller transform:`,
                `1. Generate two independent uniform random numbers U₁, U₂ ~ Uniform(0,1)`,
                `2. Compute Z = √(-2ln(U₁)) × cos(2πU₂) which follows N(0,1)`,
                `3. Transform to the desired normal distribution: X = ${mean} + ${stdDev} × Z`
            ];
            break;
            
        case 'exponential':
            const rate = parseFloat(params.rate) || 1;
            
            theoreticalMean = 1 / rate;
            theoreticalVariance = 1 / (rate * rate);
            theoreticalStdDev = 1 / rate;
            
            // Generate exponential samples using inverse transform method
            for (let i = 0; i < samples; i++) {
                const u = rng();
                const x = -Math.log(1 - u) / rate;
                simulatedSamples.push(x);
            }
            
            description = `Monte Carlo simulation of an exponential distribution with rate λ = ${rate}. The simulation used ${samples} samples generated using the inverse transform method.`;
            
            steps = [
                `Step 1: Identify the distribution and its parameters.`,
                `Distribution: Exponential(${rate})`,
                `Step 2: Set up the random number generator with ${seed ? 'seed ' + seed : 'random seed'}.`,
                `Step 3: Generate ${samples} samples using the inverse transform method:`,
                `1. Generate a uniform random number U ~ Uniform(0,1)`,
                `2. Apply the inverse CDF: X = -ln(1-U)/λ`,
                `3. This gives X ~ Exponential(${rate})`
            ];
            break;
            
        case 'uniform':
            const a = parseFloat(params.a) || 0;
            const b = parseFloat(params.b) || 1;
            
            theoreticalMean = (a + b) / 2;
            theoreticalVariance = Math.pow(b - a, 2) / 12;
            theoreticalStdDev = Math.sqrt(theoreticalVariance);
            
            // Generate uniform samples
            for (let i = 0; i < samples; i++) {
                const u = rng();
                const x = a + (b - a) * u;
                simulatedSamples.push(x);
            }
            
            description = `Monte Carlo simulation of a uniform distribution on [${a}, ${b}]. The simulation used ${samples} samples generated using direct transformation of uniform random numbers.`;
            
            steps = [
                `Step 1: Identify the distribution and its parameters.`,
                `Distribution: Uniform(${a}, ${b})`,
                `Step 2: Set up the random number generator with ${seed ? 'seed ' + seed : 'random seed'}.`,
                `Step 3: Generate ${samples} samples using direct transformation:`,
                `1. Generate a uniform random number U ~ Uniform(0,1)`,
                `2. Transform to desired range: X = ${a} + (${b}-${a}) × U`,
                `3. This gives X ~ Uniform(${a}, ${b})`
            ];
            break;
            
        case 'binomial':
            const n = parseInt(params.n) || 10;
            const p = parseFloat(params.p) || 0.5;
            
            theoreticalMean = n * p;
            theoreticalVariance = n * p * (1 - p);
            theoreticalStdDev = Math.sqrt(theoreticalVariance);
            
            // Generate binomial samples
            for (let i = 0; i < samples; i++) {
                let successes = 0;
                for (let j = 0; j < n; j++) {
                    if (rng() < p) {
                        successes++;
                    }
                }
                simulatedSamples.push(successes);
            }
            
            description = `Monte Carlo simulation of a binomial distribution with parameters n = ${n} and p = ${p}. The simulation used ${samples} samples, each representing the number of successes in ${n} trials.`;
            
            steps = [
                `Step 1: Identify the distribution and its parameters.`,
                `Distribution: Binomial(${n}, ${p})`,
                `Step 2: Set up the random number generator with ${seed ? 'seed ' + seed : 'random seed'}.`,
                `Step 3: Generate ${samples} samples by simulating ${n} Bernoulli trials for each sample:`,
                `1. For each sample, perform ${n} independent Bernoulli trials`,
                `2. For each trial, generate U ~ Uniform(0,1) and count a success if U < ${p}`,
                `3. The total number of successes for each sample follows Binomial(${n}, ${p})`
            ];
            break;
            
        case 'poisson':
            const lambda = parseFloat(params.lambda) || 1;
            
            theoreticalMean = lambda;
            theoreticalVariance = lambda;
            theoreticalStdDev = Math.sqrt(lambda);
            
            // Generate Poisson samples using the inversion method
            for (let i = 0; i < samples; i++) {
                // Algorithm based on Knuth's method
                let k = 0;
                let p = 1;
                const threshold = Math.exp(-lambda);
                
                while (p > threshold) {
                    k++;
                    p *= rng();
                }
                
                simulatedSamples.push(k - 1);
            }
            
            description = `Monte Carlo simulation of a Poisson distribution with rate parameter λ = ${lambda}. The simulation used ${samples} samples generated using Knuth's algorithm.`;
            
            steps = [
                `Step 1: Identify the distribution and its parameters.`,
                `Distribution: Poisson(${lambda})`,
                `Step 2: Set up the random number generator with ${seed ? 'seed ' + seed : 'random seed'}.`,
                `Step 3: Generate ${samples} samples using Knuth's algorithm:`,
                `1. Initialize k = 0 and p = 1`,
                `2. Set threshold = e^(-λ) = e^(-${lambda}) = ${Math.exp(-lambda).toFixed(6)}`,
                `3. While p > threshold:`,
                `   - Increment k by 1`,
                `   - Generate U ~ Uniform(0,1) and update p = p × U`,
                `4. Return k - 1 as the Poisson sample`
            ];
            break;
            
        case 'geometric':
            const pGeo = parseFloat(params.p) || 0.5;
            const firstSuccess = params.firstSuccess === 'true' || false;
            
            if (firstSuccess) {
                // X = number of trials until first success (X ≥ 1)
                theoreticalMean = 1 / pGeo;
                theoreticalVariance = (1 - pGeo) / (pGeo * pGeo);
            } else {
                // X = number of failures before first success (X ≥ 0)
                theoreticalMean = (1 - pGeo) / pGeo;
                theoreticalVariance = (1 - pGeo) / (pGeo * pGeo);
            }
            theoreticalStdDev = Math.sqrt(theoreticalVariance);
            
            // Generate geometric samples
            for (let i = 0; i < samples; i++) {
                // Using inverse transform method
                const u = rng();
                // For X = number of trials until success
                if (firstSuccess) {
                    const x = Math.ceil(Math.log(1 - u) / Math.log(1 - pGeo));
                    simulatedSamples.push(x);
                } 
                // For X = number of failures before success
                else {
                    const x = Math.floor(Math.log(1 - u) / Math.log(1 - pGeo));
                    simulatedSamples.push(x);
                }
            }
            
            description = `Monte Carlo simulation of a geometric distribution with success probability p = ${pGeo}, representing the ${firstSuccess ? 'number of trials until first success' : 'number of failures before first success'}. The simulation used ${samples} samples generated using the inverse transform method.`;
            
            steps = [
                `Step 1: Identify the distribution and its parameters.`,
                `Distribution: Geometric(${pGeo}) - ${firstSuccess ? 'trials until first success' : 'failures before first success'}`,
                `Step 2: Set up the random number generator with ${seed ? 'seed ' + seed : 'random seed'}.`,
                `Step 3: Generate ${samples} samples using the inverse transform method:`,
                `1. Generate a uniform random number U ~ Uniform(0,1)`,
                firstSuccess
                    ? `2. Apply the inverse CDF: X = ⌈log(1-U)/log(1-p)⌉ = ⌈log(1-U)/log(1-${pGeo})⌉`
                    : `2. Apply the inverse CDF: X = ⌊log(1-U)/log(1-p)⌋ = ⌊log(1-U)/log(1-${pGeo})⌋`,
                `3. This gives X following the desired geometric distribution`
            ];
            break;
    }
    
    // Process simulation type
    let simulationResult;
    
    switch (simulationType) {
        case 'statistics':
            // Calculate basic statistics
            const sampleMean = simulatedSamples.reduce((sum, x) => sum + x, 0) / samples;
            
            // Calculate sample variance and standard deviation
            const sampleVariance = simulatedSamples.reduce((sum, x) => sum + Math.pow(x - sampleMean, 2), 0) / samples;
            const sampleStdDev = Math.sqrt(sampleVariance);
            
            // Calculate skewness
            const sampleSkewness = simulatedSamples.reduce((sum, x) => sum + Math.pow((x - sampleMean) / sampleStdDev, 3), 0) / samples;
            
            // Calculate kurtosis (excess kurtosis)
            const sampleKurtosis = simulatedSamples.reduce((sum, x) => sum + Math.pow((x - sampleMean) / sampleStdDev, 4), 0) / samples - 3;
            
            // Calculate median
            const sortedSamples = [...simulatedSamples].sort((a, b) => a - b);
            const sampleMedian = samples % 2 === 0
                ? (sortedSamples[samples / 2 - 1] + sortedSamples[samples / 2]) / 2
                : sortedSamples[Math.floor(samples / 2)];
            
            // Calculate min, max, and range
            const sampleMin = Math.min(...simulatedSamples);
            const sampleMax = Math.max(...simulatedSamples);
            const sampleRange = sampleMax - sampleMin;
            
            // Calculate quartiles
            const q1Index = Math.floor(samples / 4);
            const q3Index = Math.floor(3 * samples / 4);
            const sampleQ1 = sortedSamples[q1Index];
            const sampleQ3 = sortedSamples[q3Index];
            const sampleIQR = sampleQ3 - sampleQ1;
            
            simulationResult = {
                sampleMean,
                sampleMedian,
                sampleVariance,
                sampleStdDev,
                sampleSkewness,
                sampleKurtosis,
                sampleMin,
                sampleMax,
                sampleRange,
                sampleQ1,
                sampleQ3,
                sampleIQR,
                theoreticalMean,
                theoreticalVariance,
                theoreticalStdDev,
                error: Math.abs(sampleMean - theoreticalMean) / theoreticalMean
            };
            break;
            
        case 'histogram':
            // Generate histogram data
            let histData;
            
            if (distribution === 'binomial' || distribution === 'poisson' || distribution === 'geometric') {
                // For discrete distributions, count occurrences of each value
                const valueCounts = {};
                simulatedSamples.forEach(x => {
                    valueCounts[x] = (valueCounts[x] || 0) + 1;
                });
                
                // Convert to array of {value, frequency} objects
                histData = Object.entries(valueCounts).map(([value, count]) => ({
                    value: parseFloat(value),
                    frequency: count,
                    relativeFrequency: count / samples
                })).sort((a, b) => a.value - b.value);
            } else {
                // For continuous distributions, create bins
                const numBins = Math.min(100, Math.ceil(Math.sqrt(samples)));
                const min = Math.min(...simulatedSamples);
                const max = Math.max(...simulatedSamples);
                const binWidth = (max - min) / numBins;
                
                // Initialize bins
                const bins = Array(numBins).fill(0);
                
                // Count samples in each bin
                simulatedSamples.forEach(x => {
                    const binIndex = Math.min(numBins - 1, Math.floor((x - min) / binWidth));
                    bins[binIndex]++;
                });
                
                // Create histogram data
                histData = bins.map((count, i) => ({
                    binStart: min + i * binWidth,
                    binEnd: min + (i + 1) * binWidth,
                    frequency: count,
                    relativeFrequency: count / samples
                }));
            }
            
            simulationResult = {
                histogramData: histData,
                sampleMean: simulatedSamples.reduce((sum, x) => sum + x, 0) / samples,
                theoreticalMean,
                theoreticalStdDev
            };
            break;
            
        case 'convergence':
            // Track how statistics converge as sample size increases
            const checkpoints = [10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000]
                .filter(cp => cp <= samples);
            
            const convergenceData = checkpoints.map(checkpoint => {
                const subsample = simulatedSamples.slice(0, checkpoint);
                const subMean = subsample.reduce((sum, x) => sum + x, 0) / checkpoint;
                const subVariance = subsample.reduce((sum, x) => sum + Math.pow(x - subMean, 2), 0) / checkpoint;
                
                return {
                    sampleSize: checkpoint,
                    mean: subMean,
                    variance: subVariance,
                    stdDev: Math.sqrt(subVariance),
                    meanError: Math.abs(subMean - theoreticalMean) / theoreticalMean,
                    varianceError: Math.abs(subVariance - theoreticalVariance) / theoreticalVariance
                };
            });
            
            simulationResult = {
                convergenceData,
                theoreticalMean,
                theoreticalVariance,
                theoreticalStdDev
            };
            break;
            
        default:
            // Default to returning a sample of the data
            const sampleSize = Math.min(samples, 100);
            simulationResult = {
                samples: simulatedSamples.slice(0, sampleSize),
                sampleMean: simulatedSamples.reduce((sum, x) => sum + x, 0) / samples,
                theoreticalMean
            };
    }
    
    // Round results for display
    const roundedResult = roundObject(simulationResult, decimalPlaces);
    
    // Store in state for later use
    advancedState.currentCalculation = 'monteCarlo';
    advancedState.parameters = { distribution, simulationType, ...distributionParams };
    advancedState.calculationResults = simulationResult;
    advancedState.simulationData = {
        samples: simulatedSamples.slice(0, Math.min(samples, 1000)), // Store a subset of samples
        description,
        steps
    };
    
    return {
        result: roundedResult,
        description,
        steps
    };
}

/**
 * =============================================
 * MATHEMATICAL HELPER FUNCTIONS
 * =============================================
 */

/**
 * Calculates r-th moment of a normal distribution
 * @param {number} r - Order of moment
 * @param {number} mean - Mean
 * @param {number} variance - Variance
 * @returns {number} - r-th moment
 */
function calculateNormalMoment(r, mean, variance) {
    let moment = 0;
    const stdDev = Math.sqrt(variance);
    
    // Use Hermite polynomials and recursive formula
    for (let k = 0; k <= Math.floor(r / 2); k++) {
        moment += binomialCoefficient(r, 2 * k) * Math.pow(mean, r - 2 * k) * 
                 factorial(2 * k) / (Math.pow(2, k) * factorial(k)) * 
                 Math.pow(variance, k);
    }
    
    return moment;
}

/**
 * Calculates r-th central moment of a normal distribution
 * @param {number} r - Order of moment
 * @param {number} variance - Variance
 * @returns {number} - r-th central moment
 */
function calculateNormalCentralMoment(r, variance) {
    // Normal distribution central moments
    // Odd moments are 0
    if (r % 2 === 1) {
        return 0;
    }
    
    // Even moments follow a pattern
    const stdDev = Math.sqrt(variance);
    const result = factorial(r) / (Math.pow(2, r / 2) * factorial(r / 2)) * Math.pow(variance, r / 2);
    
    return result;
}

/**
 * Calculates r-th central moment of an exponential distribution
 * @param {number} r - Order of moment
 * @param {number} rate - Rate parameter
 * @returns {number} - r-th central moment
 */
function calculateExponentialCentralMoment(r, rate) {
    // For exponential, μ = 1/λ
    const mean = 1 / rate;
    
    // For r = 1, central moment is 0
    if (r === 1) {
        return 0;
    }
    
    // For r = 2, it's the variance = 1/λ²
    if (r === 2) {
        return 1 / (rate * rate);
    }
    
    // For r = 3, it's 2/λ³
    if (r === 3) {
        return 2 / Math.pow(rate, 3);
    }
    
    // For r = 4, it's 9/λ⁴
    if (r === 4) {
        return 9 / Math.pow(rate, 4);
    }
    
    // For higher orders, use the formula recursively (this is a simplification)
    return factorial(r) / Math.pow(rate, r);
}

/**
 * Calculates r-th moment of a binomial distribution
 * @param {number} r - Order of moment
 * @param {number} n - Number of trials
 * @param {number} p - Success probability
 * @returns {number} - r-th moment
 */
function calculateBinomialMoment(r, n, p) {
    // For r=1, it's n*p
    if (r === 1) {
        return n * p;
    }
    
    // For r=2, it's n*p*(1-p) + (n*p)²
    if (r === 2) {
        return n * p * (1 - p) + Math.pow(n * p, 2);
    }
    
    // For higher orders, use the recursive formula (simplified)
    let moment = 0;
    for (let k = 1; k <= Math.min(r, n); k++) {
        let term = stirlingNumber2(r, k) * factorial(k);
        let sum = 0;
        
        for (let j = 0; j <= k; j++) {
            sum += Math.pow(-1, k - j) * binomialCoefficient(k, j) * Math.pow(j, n);
        }
        
        moment += term * sum;
    }
    
    moment *= Math.pow(p, r);
    return moment;
}

/**
 * Calculates r-th central moment of a binomial distribution
 * @param {number} r - Order of moment
 * @param {number} n - Number of trials
 * @param {number} p - Success probability
 * @returns {number} - r-th central moment
 */
function calculateBinomialCentralMoment(r, n, p) {
    // For r=1, central moment is 0
    if (r === 1) {
        return 0;
    }
    
    // For r=2, it's the variance = n*p*(1-p)
    if (r === 2) {
        return n * p * (1 - p);
    }
    
    // For r=3, it's n*p*(1-p)*(1-2p)
    if (r === 3) {
        return n * p * (1 - p) * (1 - 2 * p);
    }
    
    // For r=4, it's complex but approximated
    if (r === 4) {
        const variance = n * p * (1 - p);
        const kurtosis = 3 + (1 - 6 * p * (1 - p)) / (n * p * (1 - p));
        return kurtosis * variance * variance;
    }
    
    // For higher orders, use an approximation
    return Math.pow(n * p * (1 - p), r / 2);
}

/**
 * Calculates r-th moment of a uniform distribution
 * @param {number} r - Order of moment
 * @param {number} a - Lower bound
 * @param {number} b - Upper bound
 * @returns {number} - r-th moment
 */
function calculateUniformMoment(r, a, b) {
    // For uniform distribution on [a,b], the r-th moment is:
    // E[X^r] = (b^(r+1) - a^(r+1)) / ((r+1) * (b-a))
    return (Math.pow(b, r + 1) - Math.pow(a, r + 1)) / ((r + 1) * (b - a));
}

/**
 * Calculates r-th central moment of a uniform distribution
 * @param {number} r - Order of moment
 * @param {number} a - Lower bound
 * @param {number} b - Upper bound
 * @returns {number} - r-th central moment
 */
function calculateUniformCentralMoment(r, a, b) {
    // For r=1, central moment is 0
    if (r === 1) {
        return 0;
    }
    
    // For r=2, it's the variance = (b-a)²/12
    if (r === 2) {
        return Math.pow(b - a, 2) / 12;
    }
    
    // For r=3, it's 0 (symmetric distribution)
    if (r === 3) {
        return 0;
    }
    
    // For r=4, it's (b-a)⁴/80
    if (r === 4) {
        return Math.pow(b - a, 4) / 80;
    }
    
    // For higher even orders
    if (r % 2 === 0) {
        return Math.pow(b - a, r) / ((r + 1) * (r + 2));
    }
    
    // For higher odd orders (odd central moments are 0 for symmetric distributions)
    return 0;
}

/**
 * Calculates r-th moment of a Poisson distribution
 * @param {number} r - Order of moment
 * @param {number} lambda - Rate parameter
 * @returns {number} - r-th moment
 */
function calculatePoissonMoment(r, lambda) {
    // For r=1, it's lambda
    if (r === 1) {
        return lambda;
    }
    
    // For r=2, it's lambda + lambda²
    if (r === 2) {
        return lambda + lambda * lambda;
    }
    
    // For r=3, it's lambda + 3*lambda² + lambda³
    if (r === 3) {
        return lambda + 3 * lambda * lambda + Math.pow(lambda, 3);
    }
    
    // For r=4, it's lambda + 7*lambda² + 6*lambda³ + lambda⁴
    if (r === 4) {
        return lambda + 7 * lambda * lambda + 6 * Math.pow(lambda, 3) + Math.pow(lambda, 4);
    }
    
    // For higher orders, use Bell polynomials (approximated here)
    return Math.pow(lambda, r) + r * Math.pow(lambda, r - 1);
}

/**
 * Calculates r-th central moment of a Poisson distribution
 * @param {number} r - Order of moment
 * @param {number} lambda - Rate parameter
 * @returns {number} - r-th central moment
 */
function calculatePoissonCentralMoment(r, lambda) {
    // For r=1, central moment is 0
    if (r === 1) {
        return 0;
    }
    
    // For r=2, it's the variance = lambda
    if (r === 2) {
        return lambda;
    }
    
    // For r=3, it's lambda
    if (r === 3) {
        return lambda;
    }
    
    // For r=4, it's lambda + 3*lambda²
    if (r === 4) {
        return lambda + 3 * lambda * lambda;
    }
    
    // For higher orders, use an approximation
    return Math.pow(lambda, r / 2);
}

/**
 * Calculates the factorial of a non-negative integer
 * @param {number} n - Non-negative integer
 * @returns {number} - Factorial
 */
function factorial(n) {
    if (n < 0 || !Number.isInteger(n)) {
        return NaN;
    }
    
    if (n <= 1) {
        return 1;
    }
    
    // Use Stirling's approximation for large n to avoid overflow
    if (n > 170) {
        return Math.sqrt(2 * Math.PI * n) * Math.pow(n / Math.E, n);
    }
    
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    
    return result;
}

/**
 * Calculates the binomial coefficient (n choose k)
 * @param {number} n - Total number of items
 * @param {number} k - Number of items to choose
 * @returns {number} - Binomial coefficient
 */
function binomialCoefficient(n, k) {
    if (k < 0 || k > n) {
        return 0;
    }
    
    if (k === 0 || k === n) {
        return 1;
    }
    
    // Use symmetry to minimize the number of multiplications
    if (k > n - k) {
        k = n - k;
    }
    
    let result = 1;
    for (let i = 1; i <= k; i++) {
        result *= (n - (k - i));
        result /= i;
    }
    
    return Math.round(result);
}

/**
 * Calculates the Stirling number of the second kind
 * @param {number} n - First parameter
 * @param {number} k - Second parameter
 * @returns {number} - Stirling number
 */
function stirlingNumber2(n, k) {
    if (k === 0) {
        return n === 0 ? 1 : 0;
    }
    
    if (k > n) {
        return 0;
    }
    
    if (k === 1 || k === n) {
        return 1;
    }
    
    // Use recursive formula
    return k * stirlingNumber2(n - 1, k) + stirlingNumber2(n - 1, k - 1);
}

/**
 * Calculates the standard normal CDF
 * @param {number} z - Z-score
 * @returns {number} - Cumulative probability
 */
function normalCDF(z) {
    // Handle extreme values
    if (z < -8) return 0;
    if (z > 8) return 1;
    
    // Abramowitz & Stegun approximation
    const b1 = 0.31938153;
    const b2 = -0.356563782;
    const b3 = 1.781477937;
    const b4 = -1.821255978;
    const b5 = 1.330274429;
    const p = 0.2316419;
    const c = 0.39894228;
    
    if (z >= 0) {
        const t = 1.0 / (1.0 + p * z);
        return 1.0 - c * Math.exp(-z * z / 2.0) * t *
            (t * (t * (t * (t * b5 + b4) + b3) + b2) + b1);
    } else {
        const t = 1.0 / (1.0 - p * z);
        return c * Math.exp(-z * z / 2.0) * t *
            (t * (t * (t * (t * b5 + b4) + b3) + b2) + b1);
    }
}

/**
 * Rounds all numeric values in an object to specified decimal places
 * @param {Object} obj - Object with numeric values
 * @param {number} decimals - Number of decimal places
 * @returns {Object} - Object with rounded values
 */
function roundObject(obj, decimals) {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }
    
    const result = Array.isArray(obj) ? [] : {};
    
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key];
            
            if (typeof value === 'number') {
                result[key] = round(value, decimals);
            } else if (typeof value === 'object') {
                result[key] = roundObject(value, decimals);
            } else {
                result[key] = value;
            }
        }
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
    if (typeof value !== 'number' || isNaN(value)) {
        return value;
    }
    
    // Handle Infinity
    if (!isFinite(value)) {
        return value;
    }
    
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
}

/**
 * Export all calculator functions
 */
export {
    calculateMoments,
    calculateTransformation,
    performMonteCarloSimulation,
    advancedState
};