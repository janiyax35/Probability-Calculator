/**
 * Random Variables & Probability Distributions
 * Utility Functions for Probability Calculations
 * Created by Janith Deshan
 */

/**
 * =============================================
 * BASIC PROBABILITY FUNCTIONS
 * =============================================
 */

/**
 * Calculate combination (nCr)
 * @param {number} n - Total number of items
 * @param {number} r - Number of items to choose
 * @returns {number} - Number of ways to choose r items from n items
 */
function combination(n, r) {
    // Error handling
    if (n < 0 || r < 0 || r > n) return 0;
    if (r === 0 || r === n) return 1;
    
    // Optimize by using the smaller value for calculation
    r = Math.min(r, n - r);
    
    let result = 1;
    for (let i = 1; i <= r; i++) {
        result *= (n - (r - i));
        result /= i;
    }
    
    return result;
}

/**
 * Calculate permutation (nPr)
 * @param {number} n - Total number of items
 * @param {number} r - Number of items to arrange
 * @returns {number} - Number of ways to arrange r items from n items
 */
function permutation(n, r) {
    // Error handling
    if (n < 0 || r < 0 || r > n) return 0;
    if (r === 0) return 1;
    
    let result = 1;
    for (let i = 0; i < r; i++) {
        result *= (n - i);
    }
    
    return result;
}

/**
 * Calculate factorial
 * @param {number} n - Non-negative integer
 * @returns {number} - n!
 */
function factorial(n) {
    // Error handling
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    
    return result;
}

/**
 * Calculate conditional probability: P(A|B) = P(A ∩ B) / P(B)
 * @param {number} pAandB - Probability of A and B occurring
 * @param {number} pB - Probability of B occurring
 * @returns {number} - Conditional probability of A given B
 */
function conditionalProbability(pAandB, pB) {
    // Error handling
    if (pB === 0) return NaN; // Division by zero
    if (pAandB < 0 || pB < 0 || pAandB > 1 || pB > 1) return NaN; // Invalid probabilities
    if (pAandB > pB) return NaN; // P(A∩B) cannot be greater than P(B)
    
    return pAandB / pB;
}

/**
 * Calculate probability using Bayes' theorem: P(A|B) = P(B|A) * P(A) / P(B)
 * @param {number} pBgivenA - Probability of B given A
 * @param {number} pA - Prior probability of A
 * @param {number} pB - Probability of B
 * @returns {number} - Posterior probability of A given B
 */
function bayesTheorem(pBgivenA, pA, pB) {
    // Error handling
    if (pB === 0) return NaN; // Division by zero
    if (pBgivenA < 0 || pA < 0 || pB < 0 || pBgivenA > 1 || pA > 1 || pB > 1) return NaN; // Invalid probabilities
    
    return (pBgivenA * pA) / pB;
}

/**
 * Calculate the total probability: P(B) = Σ P(B|Ai) * P(Ai)
 * @param {Array} pBgivenA - Array of conditional probabilities P(B|Ai)
 * @param {Array} pA - Array of prior probabilities P(Ai)
 * @returns {number} - Total probability P(B)
 */
function totalProbability(pBgivenA, pA) {
    // Error handling
    if (pBgivenA.length !== pA.length) return NaN; // Arrays must have same length
    
    let sum = 0;
    for (let i = 0; i < pA.length; i++) {
        if (pBgivenA[i] < 0 || pA[i] < 0 || pBgivenA[i] > 1 || pA[i] > 1) return NaN; // Invalid probabilities
        sum += pBgivenA[i] * pA[i];
    }
    
    return sum;
}

/**
 * =============================================
 * DISCRETE DISTRIBUTIONS
 * =============================================
 */

/**
 * Bernoulli distribution - PMF: P(X = k)
 * @param {number} p - Probability of success
 * @param {number} k - Value (0 or 1)
 * @returns {number} - Probability mass function value
 */
function bernoulliPMF(p, k) {
    // Error handling
    if (p < 0 || p > 1) return NaN; // Invalid probability
    if (k !== 0 && k !== 1) return 0; // Bernoulli only has values 0 or 1
    
    return k === 1 ? p : 1 - p;
}

/**
 * Bernoulli distribution - Expected value
 * @param {number} p - Probability of success
 * @returns {number} - Expected value
 */
function bernoulliMean(p) {
    // Error handling
    if (p < 0 || p > 1) return NaN; // Invalid probability
    
    return p;
}

/**
 * Bernoulli distribution - Variance
 * @param {number} p - Probability of success
 * @returns {number} - Variance
 */
function bernoulliVariance(p) {
    // Error handling
    if (p < 0 || p > 1) return NaN; // Invalid probability
    
    return p * (1 - p);
}

/**
 * Binomial distribution - PMF: P(X = k)
 * @param {number} n - Number of trials
 * @param {number} p - Probability of success
 * @param {number} k - Number of successes
 * @returns {number} - Probability mass function value
 */
function binomialPMF(n, p, k) {
    // Error handling
    if (n < 0 || !Number.isInteger(n)) return NaN; // n must be a non-negative integer
    if (p < 0 || p > 1) return NaN; // Invalid probability
    if (k < 0 || k > n || !Number.isInteger(k)) return 0; // k must be between 0 and n
    
    // Calculate PMF
    return combination(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

/**
 * Binomial distribution - CDF: P(X ≤ k)
 * @param {number} n - Number of trials
 * @param {number} p - Probability of success
 * @param {number} k - Number of successes
 * @returns {number} - Cumulative distribution function value
 */
function binomialCDF(n, p, k) {
    // Error handling
    if (n < 0 || !Number.isInteger(n)) return NaN; // n must be a non-negative integer
    if (p < 0 || p > 1) return NaN; // Invalid probability
    if (k < 0) return 0;
    if (k >= n) return 1;
    
    // Calculate CDF by summing PMF values
    let sum = 0;
    for (let i = 0; i <= k; i++) {
        sum += binomialPMF(n, p, i);
    }
    
    return sum;
}

/**
 * Binomial distribution - Expected value
 * @param {number} n - Number of trials
 * @param {number} p - Probability of success
 * @returns {number} - Expected value
 */
function binomialMean(n, p) {
    // Error handling
    if (n < 0 || !Number.isInteger(n)) return NaN; // n must be a non-negative integer
    if (p < 0 || p > 1) return NaN; // Invalid probability
    
    return n * p;
}

/**
 * Binomial distribution - Variance
 * @param {number} n - Number of trials
 * @param {number} p - Probability of success
 * @returns {number} - Variance
 */
function binomialVariance(n, p) {
    // Error handling
    if (n < 0 || !Number.isInteger(n)) return NaN; // n must be a non-negative integer
    if (p < 0 || p > 1) return NaN; // Invalid probability
    
    return n * p * (1 - p);
}

/**
 * Geometric distribution - PMF: P(X = k)
 * @param {number} p - Probability of success
 * @param {number} k - Number of trials until first success
 * @returns {number} - Probability mass function value
 */
function geometricPMF(p, k) {
    // Error handling
    if (p <= 0 || p > 1) return NaN; // Invalid probability
    if (k < 1 || !Number.isInteger(k)) return 0; // k must be a positive integer
    
    // Calculate PMF
    return Math.pow(1 - p, k - 1) * p;
}

/**
 * Geometric distribution - CDF: P(X ≤ k)
 * @param {number} p - Probability of success
 * @param {number} k - Number of trials until first success
 * @returns {number} - Cumulative distribution function value
 */
function geometricCDF(p, k) {
    // Error handling
    if (p <= 0 || p > 1) return NaN; // Invalid probability
    if (k < 1) return 0;
    
    // Calculate CDF
    return 1 - Math.pow(1 - p, Math.floor(k));
}

/**
 * Geometric distribution - Expected value
 * @param {number} p - Probability of success
 * @returns {number} - Expected value
 */
function geometricMean(p) {
    // Error handling
    if (p <= 0 || p > 1) return NaN; // Invalid probability
    
    return 1 / p;
}

/**
 * Geometric distribution - Variance
 * @param {number} p - Probability of success
 * @returns {number} - Variance
 */
function geometricVariance(p) {
    // Error handling
    if (p <= 0 || p > 1) return NaN; // Invalid probability
    
    return (1 - p) / (p * p);
}

/**
 * Negative Binomial distribution - PMF: P(X = k)
 * @param {number} r - Number of successes
 * @param {number} p - Probability of success
 * @param {number} k - Number of trials
 * @returns {number} - Probability mass function value
 */
function negativeBinomialPMF(r, p, k) {
    // Error handling
    if (r <= 0 || !Number.isInteger(r)) return NaN; // r must be a positive integer
    if (p <= 0 || p > 1) return NaN; // Invalid probability
    if (k < r || !Number.isInteger(k)) return 0; // k must be >= r
    
    // Calculate PMF
    return combination(k - 1, r - 1) * Math.pow(p, r) * Math.pow(1 - p, k - r);
}

/**
 * Negative Binomial distribution - Expected value
 * @param {number} r - Number of successes
 * @param {number} p - Probability of success
 * @returns {number} - Expected value
 */
function negativeBinomialMean(r, p) {
    // Error handling
    if (r <= 0 || !Number.isInteger(r)) return NaN; // r must be a positive integer
    if (p <= 0 || p > 1) return NaN; // Invalid probability
    
    return r / p;
}

/**
 * Negative Binomial distribution - Variance
 * @param {number} r - Number of successes
 * @param {number} p - Probability of success
 * @returns {number} - Variance
 */
function negativeBinomialVariance(r, p) {
    // Error handling
    if (r <= 0 || !Number.isInteger(r)) return NaN; // r must be a positive integer
    if (p <= 0 || p > 1) return NaN; // Invalid probability
    
    return r * (1 - p) / (p * p);
}

/**
 * Poisson distribution - PMF: P(X = k)
 * @param {number} lambda - Average rate of occurrence
 * @param {number} k - Number of occurrences
 * @returns {number} - Probability mass function value
 */
function poissonPMF(lambda, k) {
    // Error handling
    if (lambda <= 0) return NaN; // lambda must be positive
    if (k < 0 || !Number.isInteger(k)) return 0; // k must be a non-negative integer
    
    // Calculate PMF
    return Math.exp(-lambda) * Math.pow(lambda, k) / factorial(k);
}

/**
 * Poisson distribution - CDF: P(X ≤ k)
 * @param {number} lambda - Average rate of occurrence
 * @param {number} k - Number of occurrences
 * @returns {number} - Cumulative distribution function value
 */
function poissonCDF(lambda, k) {
    // Error handling
    if (lambda <= 0) return NaN; // lambda must be positive
    if (k < 0) return 0;
    
    // Calculate CDF by summing PMF values
    let sum = 0;
    for (let i = 0; i <= Math.floor(k); i++) {
        sum += poissonPMF(lambda, i);
    }
    
    return sum;
}

/**
 * Poisson distribution - Expected value and variance (both equal to lambda)
 * @param {number} lambda - Average rate of occurrence
 * @returns {number} - Expected value/variance
 */
function poissonMean(lambda) {
    // Error handling
    if (lambda <= 0) return NaN; // lambda must be positive
    
    return lambda;
}

/**
 * Hypergeometric distribution - PMF: P(X = k)
 * @param {number} N - Population size
 * @param {number} K - Number of success states in the population
 * @param {number} n - Number of draws
 * @param {number} k - Number of successes
 * @returns {number} - Probability mass function value
 */
function hypergeometricPMF(N, K, n, k) {
    // Error handling
    if (N <= 0 || K < 0 || n <= 0 || !Number.isInteger(N) || !Number.isInteger(K) || !Number.isInteger(n)) return NaN;
    if (K > N || n > N) return 0;
    if (k < 0 || k > n || k > K || !Number.isInteger(k)) return 0;
    
    // Calculate PMF
    return (combination(K, k) * combination(N - K, n - k)) / combination(N, n);
}

/**
 * Hypergeometric distribution - Expected value
 * @param {number} N - Population size
 * @param {number} K - Number of success states in the population
 * @param {number} n - Number of draws
 * @returns {number} - Expected value
 */
function hypergeometricMean(N, K, n) {
    // Error handling
    if (N <= 0 || K < 0 || n <= 0 || !Number.isInteger(N) || !Number.isInteger(K) || !Number.isInteger(n)) return NaN;
    if (K > N || n > N) return NaN;
    
    return n * (K / N);
}

/**
 * Hypergeometric distribution - Variance
 * @param {number} N - Population size
 * @param {number} K - Number of success states in the population
 * @param {number} n - Number of draws
 * @returns {number} - Variance
 */
function hypergeometricVariance(N, K, n) {
    // Error handling
    if (N <= 0 || K < 0 || n <= 0 || !Number.isInteger(N) || !Number.isInteger(K) || !Number.isInteger(n)) return NaN;
    if (K > N || n > N) return NaN;
    
    return n * (K / N) * ((N - K) / N) * ((N - n) / (N - 1));
}

/**
 * =============================================
 * CONTINUOUS DISTRIBUTIONS
 * =============================================
 */

/**
 * Uniform continuous distribution - PDF: f(x)
 * @param {number} x - Value
 * @param {number} a - Lower bound
 * @param {number} b - Upper bound
 * @returns {number} - Probability density function value
 */
function uniformPDF(x, a, b) {
    // Error handling
    if (b <= a) return NaN; // b must be greater than a
    if (x < a || x > b) return 0;
    
    return 1 / (b - a);
}

/**
 * Uniform continuous distribution - CDF: F(x)
 * @param {number} x - Value
 * @param {number} a - Lower bound
 * @param {number} b - Upper bound
 * @returns {number} - Cumulative distribution function value
 */
function uniformCDF(x, a, b) {
    // Error handling
    if (b <= a) return NaN; // b must be greater than a
    
    if (x < a) return 0;
    if (x > b) return 1;
    
    return (x - a) / (b - a);
}

/**
 * Uniform continuous distribution - Expected value
 * @param {number} a - Lower bound
 * @param {number} b - Upper bound
 * @returns {number} - Expected value
 */
function uniformMean(a, b) {
    // Error handling
    if (b <= a) return NaN; // b must be greater than a
    
    return (a + b) / 2;
}

/**
 * Uniform continuous distribution - Variance
 * @param {number} a - Lower bound
 * @param {number} b - Upper bound
 * @returns {number} - Variance
 */
function uniformVariance(a, b) {
    // Error handling
    if (b <= a) return NaN; // b must be greater than a
    
    return Math.pow(b - a, 2) / 12;
}

/**
 * Normal distribution - PDF: f(x)
 * @param {number} x - Value
 * @param {number} mu - Mean
 * @param {number} sigma - Standard deviation
 * @returns {number} - Probability density function value
 */
function normalPDF(x, mu, sigma) {
    // Error handling
    if (sigma <= 0) return NaN; // sigma must be positive
    
    const z = (x - mu) / sigma;
    return Math.exp(-0.5 * z * z) / (sigma * Math.sqrt(2 * Math.PI));
}

/**
 * Normal distribution - CDF: F(x) (using error function approximation)
 * @param {number} x - Value
 * @param {number} mu - Mean
 * @param {number} sigma - Standard deviation
 * @returns {number} - Cumulative distribution function value
 */
function normalCDF(x, mu, sigma) {
    // Error handling
    if (sigma <= 0) return NaN; // sigma must be positive
    
    // Use jStat if available
    if (typeof jStat !== 'undefined' && typeof jStat.normal === 'object') {
        return jStat.normal.cdf(x, mu, sigma);
    }
    
    // Otherwise use approximation
    const z = (x - mu) / sigma;
    return 0.5 * (1 + erf(z / Math.sqrt(2)));
}

/**
 * Error function approximation
 * @param {number} x - Value
 * @returns {number} - Error function value
 */
function erf(x) {
    // Constants for approximation
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;
    
    // Save the sign
    const sign = (x < 0) ? -1 : 1;
    x = Math.abs(x);
    
    // Approximation formula
    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    
    return sign * y;
}

/**
 * Standard normal distribution - CDF: Φ(z)
 * @param {number} z - Standard normal value
 * @returns {number} - Cumulative distribution function value
 */
function standardNormalCDF(z) {
    return normalCDF(z, 0, 1);
}

/**
 * Inverse of standard normal CDF: Φ⁻¹(p)
 * @param {number} p - Probability (0 to 1)
 * @returns {number} - z-value
 */
function inverseStandardNormalCDF(p) {
    // Error handling
    if (p <= 0 || p >= 1) return NaN; // p must be between 0 and 1 exclusively
    
    // Use jStat if available
    if (typeof jStat !== 'undefined' && typeof jStat.normal === 'object') {
        return jStat.normal.inv(p, 0, 1);
    }
    
    // Otherwise use Beasley-Springer-Moro algorithm
    // This is a simplified approximation
    
    if (p < 0.5) {
        return -inverseStandardNormalCDF(1 - p);
    }
    
    const y = Math.sqrt(-2 * Math.log(1 - p));
    const a = 2.515517 + y * (0.802853 + y * 0.010328);
    const b = 1 + y * (1.432788 + y * (0.189269 + y * 0.001308));
    
    return y - a / b;
}

/**
 * Exponential distribution - PDF: f(x)
 * @param {number} x - Value
 * @param {number} lambda - Rate parameter
 * @returns {number} - Probability density function value
 */
function exponentialPDF(x, lambda) {
    // Error handling
    if (lambda <= 0) return NaN; // lambda must be positive
    if (x < 0) return 0;
    
    return lambda * Math.exp(-lambda * x);
}

/**
 * Exponential distribution - CDF: F(x)
 * @param {number} x - Value
 * @param {number} lambda - Rate parameter
 * @returns {number} - Cumulative distribution function value
 */
function exponentialCDF(x, lambda) {
    // Error handling
    if (lambda <= 0) return NaN; // lambda must be positive
    if (x < 0) return 0;
    
    return 1 - Math.exp(-lambda * x);
}

/**
 * Exponential distribution - Expected value
 * @param {number} lambda - Rate parameter
 * @returns {number} - Expected value
 */
function exponentialMean(lambda) {
    // Error handling
    if (lambda <= 0) return NaN; // lambda must be positive
    
    return 1 / lambda;
}

/**
 * Exponential distribution - Variance
 * @param {number} lambda - Rate parameter
 * @returns {number} - Variance
 */
function exponentialVariance(lambda) {
    // Error handling
    if (lambda <= 0) return NaN; // lambda must be positive
    
    return 1 / (lambda * lambda);
}

/**
 * Gamma distribution - PDF: f(x)
 * @param {number} x - Value
 * @param {number} alpha - Shape parameter
 * @param {number} beta - Rate parameter (1/scale)
 * @returns {number} - Probability density function value
 */
function gammaPDF(x, alpha, beta) {
    // Error handling
    if (alpha <= 0 || beta <= 0) return NaN; // parameters must be positive
    if (x < 0) return 0;
    
    // Use jStat if available
    if (typeof jStat !== 'undefined' && typeof jStat.gamma === 'object') {
        return jStat.gamma.pdf(x, alpha, 1/beta);
    }
    
    // Otherwise calculate directly
    // Gamma function approximation would be needed for non-integer alpha
    if (x === 0 && alpha < 1) return Infinity;
    if (x === 0) return 0;
    
    return Math.pow(beta, alpha) * Math.pow(x, alpha - 1) * Math.exp(-beta * x) / gamma(alpha);
}

/**
 * Gamma function approximation
 * @param {number} z - Value
 * @returns {number} - Gamma function value
 */
function gamma(z) {
    // Use factorial for integer values
    if (Number.isInteger(z)) {
        return factorial(z - 1);
    }
    
    // Lanczos approximation for non-integer values
    if (z < 0.5) {
        return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
    }
    
    z -= 1;
    const p = [
        676.5203681218851, -1259.1392167224028, 771.32342877765313,
        -176.61502916214059, 12.507343278686905, -0.13857109526572012,
        9.9843695780195716e-6, 1.5056327351493116e-7
    ];
    
    let x = 0.99999999999980993;
    for (let i = 0; i < p.length; i++) {
        x += p[i] / (z + i + 1);
    }
    
    const t = z + p.length - 0.5;
    return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
}

/**
 * =============================================
 * JOINT DISTRIBUTIONS & MULTIVARIATE FUNCTIONS
 * =============================================
 */

/**
 * Calculate covariance between two random variables
 * @param {Array} x - Values of first random variable
 * @param {Array} y - Values of second random variable
 * @returns {number} - Covariance
 */
function covariance(x, y) {
    // Error handling
    if (x.length !== y.length || x.length === 0) return NaN;
    
    const n = x.length;
    const meanX = x.reduce((sum, val) => sum + val, 0) / n;
    const meanY = y.reduce((sum, val) => sum + val, 0) / n;
    
    let sum = 0;
    for (let i = 0; i < n; i++) {
        sum += (x[i] - meanX) * (y[i] - meanY);
    }
    
    return sum / n;
}

/**
 * Calculate correlation coefficient between two random variables
 * @param {Array} x - Values of first random variable
 * @param {Array} y - Values of second random variable
 * @returns {number} - Correlation coefficient
 */
function correlation(x, y) {
    // Error handling
    if (x.length !== y.length || x.length === 0) return NaN;
    
    const n = x.length;
    const meanX = x.reduce((sum, val) => sum + val, 0) / n;
    const meanY = y.reduce((sum, val) => sum + val, 0) / n;
    
    let sumXY = 0;
    let sumX2 = 0;
    let sumY2 = 0;
    
    for (let i = 0; i < n; i++) {
        const xDiff = x[i] - meanX;
        const yDiff = y[i] - meanY;
        sumXY += xDiff * yDiff;
        sumX2 += xDiff * xDiff;
        sumY2 += yDiff * yDiff;
    }
    
    if (sumX2 === 0 || sumY2 === 0) return NaN;
    
    return sumXY / (Math.sqrt(sumX2) * Math.sqrt(sumY2));
}

/**
 * =============================================
 * ADVANCED TOPICS & LIMIT THEOREMS
 * =============================================
 */

/**
 * Calculate entropy of a discrete probability distribution
 * @param {Array} probabilities - Array of probabilities
 * @returns {number} - Entropy value
 */
function entropy(probabilities) {
    // Error handling
    const sum = probabilities.reduce((acc, p) => acc + p, 0);
    if (Math.abs(sum - 1) > 0.00001) return NaN; // Probabilities should sum to 1
    
    let result = 0;
    for (let p of probabilities) {
        if (p > 0) { // Avoid log(0)
            result -= p * Math.log2(p);
        }
    }
    
    return result;
}

/**
 * Simulate Central Limit Theorem by generating sample means
 * @param {Function} randomGenerator - Function that generates random values from a distribution
 * @param {number} sampleSize - Size of each sample
 * @param {number} numSamples - Number of samples to generate
 * @returns {Array} - Array of sample means
 */
function simulateCLT(randomGenerator, sampleSize, numSamples) {
    const sampleMeans = [];
    
    for (let i = 0; i < numSamples; i++) {
        let sum = 0;
        for (let j = 0; j < sampleSize; j++) {
            sum += randomGenerator();
        }
        sampleMeans.push(sum / sampleSize);
    }
    
    return sampleMeans;
}

/**
 * Generate samples from a normal distribution using Box-Muller transform
 * @param {number} mu - Mean
 * @param {number} sigma - Standard deviation
 * @returns {number} - Random sample
 */
function randomNormal(mu = 0, sigma = 1) {
    let u1 = 0, u2 = 0;
    while (u1 === 0) u1 = Math.random();
    while (u2 === 0) u2 = Math.random();
    
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mu + z0 * sigma;
}

/**
 * Generate samples from a uniform distribution
 * @param {number} a - Lower bound
 * @param {number} b - Upper bound
 * @returns {number} - Random sample
 */
function randomUniform(a = 0, b = 1) {
    return a + Math.random() * (b - a);
}

/**
 * Generate samples from an exponential distribution
 * @param {number} lambda - Rate parameter
 * @returns {number} - Random sample
 */
function randomExponential(lambda) {
    return -Math.log(1 - Math.random()) / lambda;
}

/**
 * Generate samples from a binomial distribution
 * @param {number} n - Number of trials
 * @param {number} p - Probability of success
 * @returns {number} - Random sample
 */
function randomBinomial(n, p) {
    let successes = 0;
    for (let i = 0; i < n; i++) {
        if (Math.random() < p) {
            successes++;
        }
    }
    return successes;
}

/**
 * Generate samples from a Poisson distribution
 * @param {number} lambda - Mean rate
 * @returns {number} - Random sample
 */
function randomPoisson(lambda) {
    const L = Math.exp(-lambda);
    let k = 0;
    let p = 1;
    
    do {
        k++;
        p *= Math.random();
    } while (p > L);
    
    return k - 1;
}

/**
 * =============================================
 * HYPOTHESIS TESTING FUNCTIONS
 * =============================================
 */

/**
 * Calculate z-score for a sample mean
 * @param {number} sampleMean - Sample mean
 * @param {number} populationMean - Population mean (null hypothesis)
 * @param {number} populationStdDev - Population standard deviation
 * @param {number} sampleSize - Sample size
 * @returns {number} - z-score
 */
function zScore(sampleMean, populationMean, populationStdDev, sampleSize) {
    return (sampleMean - populationMean) / (populationStdDev / Math.sqrt(sampleSize));
}

/**
 * Calculate t-score for a sample mean when population std dev is unknown
 * @param {number} sampleMean - Sample mean
 * @param {number} populationMean - Population mean (null hypothesis)
 * @param {number} sampleStdDev - Sample standard deviation
 * @param {number} sampleSize - Sample size
 * @returns {number} - t-score
 */
function tScore(sampleMean, populationMean, sampleStdDev, sampleSize) {
    return (sampleMean - populationMean) / (sampleStdDev / Math.sqrt(sampleSize));
}

/**
 * Calculate p-value for two-tailed z-test
 * @param {number} zScore - z-score
 * @returns {number} - p-value
 */
function pValueFromZ(zScore) {
    return 2 * (1 - standardNormalCDF(Math.abs(zScore)));
}

/**
 * Calculate confidence interval for a mean
 * @param {number} sampleMean - Sample mean
 * @param {number} sampleStdDev - Sample standard deviation
 * @param {number} sampleSize - Sample size
 * @param {number} confidenceLevel - Confidence level (e.g., 0.95 for 95%)
 * @param {boolean} useT - Whether to use t-distribution (true) or z-distribution (false)
 * @returns {Array} - [lower bound, upper bound]
 */
function confidenceInterval(sampleMean, sampleStdDev, sampleSize, confidenceLevel, useT = true) {
    const alpha = 1 - confidenceLevel;
    let criticalValue;
    
    if (useT) {
        // Use t-distribution for small samples or when population std dev is unknown
        const df = sampleSize - 1;
        // This would require a t-distribution quantile function
        // For now, we'll use a normal approximation if jStat is not available
        if (typeof jStat !== 'undefined' && typeof jStat.studentt === 'object') {
            criticalValue = Math.abs(jStat.studentt.inv(alpha / 2, df));
        } else {
            criticalValue = Math.abs(inverseStandardNormalCDF(alpha / 2));
        }
    } else {
        // Use z-distribution for large samples or when population std dev is known
        criticalValue = Math.abs(inverseStandardNormalCDF(alpha / 2));
    }
    
    const marginOfError = criticalValue * (sampleStdDev / Math.sqrt(sampleSize));
    
    return [sampleMean - marginOfError, sampleMean + marginOfError];
}