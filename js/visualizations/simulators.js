/**
 * Probability Simulators Module
 * Contains functions for simulating random variables and stochastic processes
 * Random Variables & Probability Distributions
 */

// Global state to track simulations
const simulationState = {
    activeSimulations: {},
    simulationData: {},
    simulationIntervals: {}
};

/**
 * =============================================
 * DISTRIBUTION SAMPLING FUNCTIONS
 * =============================================
 */

/**
 * Generates samples from a specified probability distribution
 * @param {string} distribution - Distribution name
 * @param {Object} params - Distribution parameters
 * @param {number} count - Number of samples to generate
 * @returns {Array} - Array of samples
 */
function generateDistributionSamples(distribution, params, count = 1000) {
    const samples = [];
    
    // Generate samples based on distribution type
    switch (distribution.toLowerCase()) {
        case 'uniform':
            const a = params.a !== undefined ? params.a : 0;
            const b = params.b !== undefined ? params.b : 1;
            
            for (let i = 0; i < count; i++) {
                samples.push(a + Math.random() * (b - a));
            }
            break;
            
        case 'normal':
            const mean = params.mean !== undefined ? params.mean : 0;
            const stdDev = params.stdDev !== undefined ? params.stdDev : 1;
            
            for (let i = 0; i < count; i++) {
                // Box-Muller transform
                const u1 = Math.random();
                const u2 = Math.random();
                const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
                samples.push(mean + stdDev * z);
            }
            break;
            
        case 'exponential':
            const rate = params.rate !== undefined ? params.rate : 1;
            
            for (let i = 0; i < count; i++) {
                samples.push(-Math.log(Math.random()) / rate);
            }
            break;
            
        case 'binomial':
            const n = params.n !== undefined ? params.n : 10;
            const p = params.p !== undefined ? params.p : 0.5;
            
            for (let i = 0; i < count; i++) {
                let successes = 0;
                for (let j = 0; j < n; j++) {
                    if (Math.random() < p) {
                        successes++;
                    }
                }
                samples.push(successes);
            }
            break;
            
        case 'poisson':
            const lambda = params.lambda !== undefined ? params.lambda : 1;
            
            for (let i = 0; i < count; i++) {
                // Knuth's algorithm
                let k = 0;
                let p = 1;
                const L = Math.exp(-lambda);
                
                do {
                    k++;
                    p *= Math.random();
                } while (p > L);
                
                samples.push(k - 1);
            }
            break;
            
        case 'geometric':
            const prob = params.p !== undefined ? params.p : 0.5;
            const firstSuccess = params.firstSuccess !== undefined ? params.firstSuccess : true;
            
            for (let i = 0; i < count; i++) {
                // Inverse transform method
                const u = Math.random();
                
                if (firstSuccess) {
                    // X = number of trials until first success (X ≥ 1)
                    samples.push(Math.ceil(Math.log(1 - u) / Math.log(1 - prob)));
                } else {
                    // X = number of failures before first success (X ≥ 0)
                    samples.push(Math.floor(Math.log(1 - u) / Math.log(1 - prob)));
                }
            }
            break;
            
        case 'gamma':
            const shape = params.shape !== undefined ? params.shape : 1;
            const scale = params.scale !== undefined ? params.scale : 1;
            
            for (let i = 0; i < count; i++) {
                // For integer shape, sum of exponentials
                if (Math.floor(shape) === shape && shape > 0) {
                    let sum = 0;
                    for (let j = 0; j < shape; j++) {
                        sum += -Math.log(Math.random());
                    }
                    samples.push(sum * scale);
                } else {
                    // Marsaglia and Tsang's method for non-integer shape
                    samples.push(generateGammaSample(shape, scale));
                }
            }
            break;
            
        case 'beta':
            const alpha = params.alpha !== undefined ? params.alpha : 2;
            const beta = params.beta !== undefined ? params.beta : 2;
            
            for (let i = 0; i < count; i++) {
                // Generate from gamma distributions and normalize
                const x = generateGammaSample(alpha, 1);
                const y = generateGammaSample(beta, 1);
                samples.push(x / (x + y));
            }
            break;
            
        case 'weibull':
            const shapeParam = params.shape !== undefined ? params.shape : 1;
            const scaleParam = params.scale !== undefined ? params.scale : 1;
            
            for (let i = 0; i < count; i++) {
                // Inverse transform method
                const u = Math.random();
                samples.push(scaleParam * Math.pow(-Math.log(1 - u), 1 / shapeParam));
            }
            break;
            
        case 'lognormal':
            const mu = params.mu !== undefined ? params.mu : 0;
            const sigma = params.sigma !== undefined ? params.sigma : 1;
            
            for (let i = 0; i < count; i++) {
                // Generate normal and transform
                const u1 = Math.random();
                const u2 = Math.random();
                const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
                samples.push(Math.exp(mu + sigma * z));
            }
            break;
            
        case 'chisquare':
            const df = params.df !== undefined ? params.df : 1;
            
            for (let i = 0; i < count; i++) {
                // Sum of squared standard normals
                let sum = 0;
                for (let j = 0; j < df; j++) {
                    const u1 = Math.random();
                    const u2 = Math.random();
                    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
                    sum += z * z;
                }
                samples.push(sum);
            }
            break;
            
        case 'cauchy':
            const location = params.location !== undefined ? params.location : 0;
            const scale = params.scale !== undefined ? params.scale : 1;
            
            for (let i = 0; i < count; i++) {
                // Inverse transform method
                const u = Math.random();
                samples.push(location + scale * Math.tan(Math.PI * (u - 0.5)));
            }
            break;
            
        case 'discrete_uniform':
            const min = params.min !== undefined ? params.min : 1;
            const max = params.max !== undefined ? params.max : 6;
            
            for (let i = 0; i < count; i++) {
                samples.push(Math.floor(min + Math.random() * (max - min + 1)));
            }
            break;
            
        case 'bernoulli':
            const successProb = params.p !== undefined ? params.p : 0.5;
            
            for (let i = 0; i < count; i++) {
                samples.push(Math.random() < successProb ? 1 : 0);
            }
            break;
            
        case 'custom':
            // For custom distributions defined by a sampling function
            if (typeof params.sampleFunction === 'function') {
                for (let i = 0; i < count; i++) {
                    samples.push(params.sampleFunction());
                }
            } else {
                throw new Error("Custom distribution requires a sampleFunction parameter");
            }
            break;
            
        default:
            // Default to uniform [0,1]
            for (let i = 0; i < count; i++) {
                samples.push(Math.random());
            }
    }
    
    return samples;
}

/**
 * Helper function to generate a gamma sample for non-integer shape parameters
 * @param {number} shape - Shape parameter (alpha)
 * @param {number} scale - Scale parameter (beta)
 * @returns {number} - Sample from gamma distribution
 */
function generateGammaSample(shape, scale) {
    // Marsaglia and Tsang's method
    if (shape < 1) {
        const u = Math.random();
        return generateGammaSample(1 + shape, scale) * Math.pow(u, 1 / shape);
    }
    
    const d = shape - 1/3;
    const c = 1 / Math.sqrt(9 * d);
    
    while (true) {
        let x, v, u;
        do {
            // Generate normal using Box-Muller
            const u1 = Math.random();
            const u2 = Math.random();
            x = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
            v = 1 + c * x;
        } while (v <= 0);
        
        v = v * v * v;
        u = Math.random();
        
        if (u < 1 - 0.331 * Math.pow(x, 4) ||
            Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) {
            return d * v * scale;
        }
    }
}

/**
 * Generates multivariate normal samples
 * @param {Array} mean - Mean vector
 * @param {Array} covariance - Covariance matrix
 * @param {number} count - Number of samples
 * @returns {Array} - Array of samples (each sample is an array)
 */
function generateMultivariateNormalSamples(mean, covariance, count = 100) {
    const dimension = mean.length;
    const samples = [];
    
    // Perform Cholesky decomposition of covariance matrix
    const cholesky = choleskyDecomposition(covariance);
    
    for (let i = 0; i < count; i++) {
        // Generate independent standard normal samples
        const z = [];
        for (let j = 0; j < dimension; j++) {
            const u1 = Math.random();
            const u2 = Math.random();
            z.push(Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2));
        }
        
        // Transform using x = μ + Lz where L is the Cholesky decomposition
        const sample = [...mean];
        for (let j = 0; j < dimension; j++) {
            for (let k = 0; k <= j; k++) {
                sample[j] += cholesky[j][k] * z[k];
            }
        }
        
        samples.push(sample);
    }
    
    return samples;
}

/**
 * Performs Cholesky decomposition of a symmetric positive-definite matrix
 * @param {Array} matrix - Input matrix
 * @returns {Array} - Lower triangular matrix L such that L*L^T = matrix
 */
function choleskyDecomposition(matrix) {
    const n = matrix.length;
    const L = Array(n).fill().map(() => Array(n).fill(0));
    
    for (let i = 0; i < n; i++) {
        for (let j = 0; j <= i; j++) {
            let sum = 0;
            
            if (j === i) {
                for (let k = 0; k < j; k++) {
                    sum += L[j][k] * L[j][k];
                }
                L[j][j] = Math.sqrt(matrix[j][j] - sum);
            } else {
                for (let k = 0; k < j; k++) {
                    sum += L[i][k] * L[j][k];
                }
                L[i][j] = (matrix[i][j] - sum) / L[j][j];
            }
        }
    }
    
    return L;
}

/**
 * =============================================
 * STOCHASTIC PROCESS SIMULATORS
 * =============================================
 */

/**
 * Simulates a random walk
 * @param {Object} params - Simulation parameters
 * @param {number} params.steps - Number of steps
 * @param {number} params.stepSize - Size of each step (default: 1)
 * @param {number} params.startingPoint - Starting point (default: 0)
 * @param {number} params.dimension - Dimension of the walk (1D, 2D, 3D)
 * @param {Function} params.stepDistribution - Function to generate a step (defaults to symmetric)
 * @returns {Object} - Simulation results
 */
function simulateRandomWalk(params) {
    const steps = params.steps || 1000;
    const stepSize = params.stepSize || 1;
    const startingPoint = params.startingPoint || 0;
    const dimension = params.dimension || 1;
    const stepDistribution = params.stepDistribution || null;
    
    // Initialize trajectory
    let trajectory;
    
    if (dimension === 1) {
        // 1D random walk
        trajectory = [startingPoint];
        let currentPosition = startingPoint;
        
        for (let i = 0; i < steps; i++) {
            let step;
            if (stepDistribution) {
                step = stepDistribution() * stepSize;
            } else {
                // Default: symmetric random walk
                step = (Math.random() < 0.5 ? 1 : -1) * stepSize;
            }
            
            currentPosition += step;
            trajectory.push(currentPosition);
        }
    } else if (dimension === 2) {
        // 2D random walk
        trajectory = [[startingPoint, startingPoint]];
        let currentX = startingPoint;
        let currentY = startingPoint;
        
        for (let i = 0; i < steps; i++) {
            let stepX, stepY;
            
            if (stepDistribution) {
                stepX = stepDistribution() * stepSize;
                stepY = stepDistribution() * stepSize;
            } else {
                // Default: symmetric random walk in 4 directions
                const direction = Math.floor(Math.random() * 4);
                stepX = direction === 0 ? stepSize : (direction === 1 ? -stepSize : 0);
                stepY = direction === 2 ? stepSize : (direction === 3 ? -stepSize : 0);
            }
            
            currentX += stepX;
            currentY += stepY;
            trajectory.push([currentX, currentY]);
        }
    } else if (dimension === 3) {
        // 3D random walk
        trajectory = [[startingPoint, startingPoint, startingPoint]];
        let currentX = startingPoint;
        let currentY = startingPoint;
        let currentZ = startingPoint;
        
        for (let i = 0; i < steps; i++) {
            let stepX, stepY, stepZ;
            
            if (stepDistribution) {
                stepX = stepDistribution() * stepSize;
                stepY = stepDistribution() * stepSize;
                stepZ = stepDistribution() * stepSize;
            } else {
                // Default: symmetric random walk in 6 directions
                const direction = Math.floor(Math.random() * 6);
                stepX = direction === 0 ? stepSize : (direction === 1 ? -stepSize : 0);
                stepY = direction === 2 ? stepSize : (direction === 3 ? -stepSize : 0);
                stepZ = direction === 4 ? stepSize : (direction === 5 ? -stepSize : 0);
            }
            
            currentX += stepX;
            currentY += stepY;
            currentZ += stepZ;
            trajectory.push([currentX, currentY, currentZ]);
        }
    } else {
        throw new Error("Dimension must be 1, 2, or 3");
    }
    
    // Calculate statistics
    let finalPosition, displacement, maxDistance;
    
    if (dimension === 1) {
        finalPosition = trajectory[steps];
        displacement = Math.abs(finalPosition - startingPoint);
        
        // Calculate maximum distance from origin
        maxDistance = trajectory.reduce((max, pos) => Math.max(max, Math.abs(pos - startingPoint)), 0);
    } else {
        finalPosition = trajectory[steps];
        
        // Calculate Euclidean displacement
        if (dimension === 2) {
            displacement = Math.sqrt(
                Math.pow(finalPosition[0] - startingPoint, 2) +
                Math.pow(finalPosition[1] - startingPoint, 2)
            );
            
            // Calculate maximum distance from origin
            maxDistance = trajectory.reduce((max, pos) => {
                const dist = Math.sqrt(
                    Math.pow(pos[0] - startingPoint, 2) +
                    Math.pow(pos[1] - startingPoint, 2)
                );
                return Math.max(max, dist);
            }, 0);
        } else {
            displacement = Math.sqrt(
                Math.pow(finalPosition[0] - startingPoint, 2) +
                Math.pow(finalPosition[1] - startingPoint, 2) +
                Math.pow(finalPosition[2] - startingPoint, 2)
            );
            
            // Calculate maximum distance from origin
            maxDistance = trajectory.reduce((max, pos) => {
                const dist = Math.sqrt(
                    Math.pow(pos[0] - startingPoint, 2) +
                    Math.pow(pos[1] - startingPoint, 2) +
                    Math.pow(pos[2] - startingPoint, 2)
                );
                return Math.max(max, dist);
            }, 0);
        }
    }
    
    return {
        trajectory,
        finalPosition,
        displacement,
        maxDistance,
        steps,
        dimension
    };
}

/**
 * Simulates a Poisson process
 * @param {Object} params - Simulation parameters
 * @param {number} params.rate - Rate parameter (λ)
 * @param {number} params.time - Total time to simulate
 * @returns {Object} - Simulation results
 */
function simulatePoissonProcess(params) {
    const rate = params.rate || 1;
    const totalTime = params.time || 10;
    
    const arrivalTimes = [];
    let currentTime = 0;
    
    // Generate inter-arrival times from exponential distribution
    while (currentTime < totalTime) {
        // Generate exponential random variable with rate parameter
        const interArrivalTime = -Math.log(Math.random()) / rate;
        currentTime += interArrivalTime;
        
        if (currentTime <= totalTime) {
            arrivalTimes.push(currentTime);
        }
    }
    
    // Calculate count at each unit time
    const counts = [];
    let count = 0;
    let timeIndex = 0;
    
    for (let t = 0; t <= totalTime; t++) {
        // Count arrivals up to time t
        while (timeIndex < arrivalTimes.length && arrivalTimes[timeIndex] <= t) {
            count++;
            timeIndex++;
        }
        
        counts.push({
            time: t,
            count: count
        });
    }
    
    return {
        arrivalTimes,
        counts,
        totalArrivals: arrivalTimes.length,
        rate,
        totalTime
    };
}

/**
 * Simulates a Markov chain
 * @param {Object} params - Simulation parameters
 * @param {Array} params.transitionMatrix - Transition probability matrix
 * @param {number} params.steps - Number of steps to simulate
 * @param {number} params.initialState - Initial state (default: 0)
 * @returns {Object} - Simulation results
 */
function simulateMarkovChain(params) {
    const transitionMatrix = params.transitionMatrix;
    const steps = params.steps || 100;
    const initialState = params.initialState !== undefined ? params.initialState : 0;
    
    // Validate transition matrix
    if (!transitionMatrix || !Array.isArray(transitionMatrix)) {
        throw new Error("Transition matrix must be provided as a 2D array");
    }
    
    const numStates = transitionMatrix.length;
    
    // Validate that rows sum to 1
    for (let i = 0; i < numStates; i++) {
        if (transitionMatrix[i].length !== numStates) {
            throw new Error("Transition matrix must be square");
        }
        
        const rowSum = transitionMatrix[i].reduce((sum, prob) => sum + prob, 0);
        if (Math.abs(rowSum - 1) > 1e-6) {
            throw new Error(`Row ${i} of transition matrix does not sum to 1 (sum = ${rowSum})`);
        }
    }
    
    // Validate initial state
    if (initialState < 0 || initialState >= numStates) {
        throw new Error(`Initial state must be between 0 and ${numStates - 1}`);
    }
    
    // Simulate the Markov chain
    const stateSequence = [initialState];
    let currentState = initialState;
    
    for (let i = 0; i < steps; i++) {
        const transitionProbs = transitionMatrix[currentState];
        
        // Generate a random number to determine next state
        const rand = Math.random();
        let cumulativeProb = 0;
        let nextState = 0;
        
        for (let j = 0; j < numStates; j++) {
            cumulativeProb += transitionProbs[j];
            if (rand < cumulativeProb) {
                nextState = j;
                break;
            }
        }
        
        currentState = nextState;
        stateSequence.push(currentState);
    }
    
    // Calculate state frequencies
    const stateFrequencies = Array(numStates).fill(0);
    for (let i = 0; i < stateSequence.length; i++) {
        stateFrequencies[stateSequence[i]]++;
    }
    
    const stateProportions = stateFrequencies.map(freq => freq / stateSequence.length);
    
    // Calculate transition frequencies
    const transitionFrequencies = Array(numStates).fill().map(() => Array(numStates).fill(0));
    
    for (let i = 0; i < stateSequence.length - 1; i++) {
        const from = stateSequence[i];
        const to = stateSequence[i + 1];
        transitionFrequencies[from][to]++;
    }
    
    // Calculate empirical transition probabilities
    const empiricalTransitionMatrix = Array(numStates).fill().map(() => Array(numStates).fill(0));
    
    for (let i = 0; i < numStates; i++) {
        const totalTransitions = transitionFrequencies[i].reduce((sum, freq) => sum + freq, 0);
        
        if (totalTransitions > 0) {
            for (let j = 0; j < numStates; j++) {
                empiricalTransitionMatrix[i][j] = transitionFrequencies[i][j] / totalTransitions;
            }
        }
    }
    
    return {
        stateSequence,
        stateFrequencies,
        stateProportions,
        transitionFrequencies,
        empiricalTransitionMatrix,
        numStates,
        steps
    };
}

/**
 * Simulates a Brownian motion process
 * @param {Object} params - Simulation parameters
 * @param {number} params.timePoints - Number of time points
 * @param {number} params.timeHorizon - Total time horizon
 * @param {number} params.drift - Drift parameter (μ)
 * @param {number} params.volatility - Volatility parameter (σ)
 * @param {number} params.initialValue - Initial value
 * @returns {Object} - Simulation results
 */
function simulateBrownianMotion(params) {
    const timePoints = params.timePoints || 1000;
    const timeHorizon = params.timeHorizon || 1;
    const drift = params.drift || 0;
    const volatility = params.volatility || 1;
    const initialValue = params.initialValue || 0;
    
    const dt = timeHorizon / timePoints;
    const sqrtDt = Math.sqrt(dt);
    
    // Initialize trajectory with initial value
    const trajectory = [initialValue];
    const timeValues = [0];
    
    let currentValue = initialValue;
    
    // Simulate process
    for (let i = 1; i <= timePoints; i++) {
        // Generate standard normal random variable
        const u1 = Math.random();
        const u2 = Math.random();
        const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        
        // Update value using Euler-Maruyama method
        currentValue += drift * dt + volatility * sqrtDt * z;
        
        trajectory.push(currentValue);
        timeValues.push(i * dt);
    }
    
    return {
        trajectory,
        timeValues,
        initialValue,
        drift,
        volatility,
        finalValue: trajectory[timePoints],
        timeHorizon,
        timePoints
    };
}

/**
 * Simulates a geometric Brownian motion process (often used for stock prices)
 * @param {Object} params - Simulation parameters
 * @param {number} params.timePoints - Number of time points
 * @param {number} params.timeHorizon - Total time horizon
 * @param {number} params.drift - Drift parameter (μ)
 * @param {number} params.volatility - Volatility parameter (σ)
 * @param {number} params.initialValue - Initial value
 * @returns {Object} - Simulation results
 */
function simulateGeometricBrownianMotion(params) {
    const timePoints = params.timePoints || 1000;
    const timeHorizon = params.timeHorizon || 1;
    const drift = params.drift || 0.05;  // Default 5% drift
    const volatility = params.volatility || 0.2;  // Default 20% volatility
    const initialValue = params.initialValue || 100;
    
    const dt = timeHorizon / timePoints;
    const sqrtDt = Math.sqrt(dt);
    
    // Initialize trajectory with initial value
    const trajectory = [initialValue];
    const timeValues = [0];
    const logReturns = [];
    
    let currentValue = initialValue;
    
    // Simulate process
    for (let i = 1; i <= timePoints; i++) {
        // Generate standard normal random variable
        const u1 = Math.random();
        const u2 = Math.random();
        const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        
        // Calculate log return
        const logReturn = (drift - 0.5 * volatility * volatility) * dt + volatility * sqrtDt * z;
        logReturns.push(logReturn);
        
        // Update value
        currentValue *= Math.exp(logReturn);
        
        trajectory.push(currentValue);
        timeValues.push(i * dt);
    }
    
    // Calculate statistics
    const finalValue = trajectory[timePoints];
    const totalReturn = (finalValue - initialValue) / initialValue;
    
    // Calculate volatility from log returns
    const meanLogReturn = logReturns.reduce((sum, val) => sum + val, 0) / logReturns.length;
    const logReturnVariance = logReturns.reduce((sum, val) => sum + Math.pow(val - meanLogReturn, 2), 0) / logReturns.length;
    const annualizedVolatility = Math.sqrt(logReturnVariance / dt);
    
    return {
        trajectory,
        timeValues,
        logReturns,
        initialValue,
        finalValue,
        totalReturn,
        annualizedDrift: drift,
        annualizedVolatility: volatility,
        empiricalVolatility: annualizedVolatility,
        timeHorizon,
        timePoints
    };
}

/**
 * =============================================
 * MONTE CARLO SIMULATION FUNCTIONS
 * =============================================
 */

/**
 * Performs Monte Carlo integration to approximate definite integrals
 * @param {Function} func - Function to integrate
 * @param {number} a - Lower bound
 * @param {number} b - Upper bound
 * @param {number} n - Number of samples
 * @returns {Object} - Estimation result
 */
function monteCarloIntegration(func, a, b, n = 10000) {
    let sum = 0;
    let sumSquared = 0;
    
    // Generate n random samples
    for (let i = 0; i < n; i++) {
        const x = a + (b - a) * Math.random();
        const y = func(x);
        
        sum += y;
        sumSquared += y * y;
    }
    
    // Calculate mean and variance
    const mean = sum / n;
    const variance = (sumSquared / n - mean * mean);
    
    // Estimate integral and error
    const integral = (b - a) * mean;
    const standardError = (b - a) * Math.sqrt(variance / n);
    
    return {
        estimate: integral,
        standardError: standardError,
        relativeError: Math.abs(standardError / integral),
        samples: n
    };
}

/**
 * Performs Monte Carlo simulation to estimate option pricing
 * @param {Object} params - Simulation parameters
 * @param {string} params.optionType - 'call' or 'put'
 * @param {number} params.strike - Strike price
 * @param {number} params.spot - Current spot price
 * @param {number} params.volatility - Annualized volatility
 * @param {number} params.rate - Risk-free interest rate
 * @param {number} params.dividend - Dividend yield
 * @param {number} params.expiry - Time to expiry in years
 * @param {number} params.samples - Number of simulations
 * @returns {Object} - Option pricing result
 */
function monteCarloOptionPricing(params) {
    const optionType = params.optionType || 'call';
    const strike = params.strike || 100;
    const spot = params.spot || 100;
    const volatility = params.volatility || 0.2;
    const rate = params.rate || 0.05;
    const dividend = params.dividend || 0;
    const expiry = params.expiry || 1;
    const samples = params.samples || 10000;
    
    let sumPayoffs = 0;
    let sumSquaredPayoffs = 0;
    const paths = [];
    
    // Monte Carlo simulation
    for (let i = 0; i < samples; i++) {
        // Generate a standard normal random variable
        const u1 = Math.random();
        const u2 = Math.random();
        const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
        
        // Simulate final stock price using BSM formula
        const drift = (rate - dividend - 0.5 * volatility * volatility) * expiry;
        const diffusion = volatility * Math.sqrt(expiry) * z;
        const finalPrice = spot * Math.exp(drift + diffusion);
        
        // Calculate payoff
        let payoff;
        if (optionType.toLowerCase() === 'call') {
            payoff = Math.max(0, finalPrice - strike);
        } else {
            payoff = Math.max(0, strike - finalPrice);
        }
        
        // Discount payoff to present value
        const discountedPayoff = payoff * Math.exp(-rate * expiry);
        
        sumPayoffs += discountedPayoff;
        sumSquaredPayoffs += discountedPayoff * discountedPayoff;
        
        paths.push({
            finalPrice,
            payoff,
            discountedPayoff
        });
    }
    
    // Calculate option price and confidence interval
    const optionPrice = sumPayoffs / samples;
    const variance = (sumSquaredPayoffs / samples - optionPrice * optionPrice);
    const standardError = Math.sqrt(variance / samples);
    const confidence95 = 1.96 * standardError;
    
    return {
        optionPrice,
        standardError,
        confidence95Lower: optionPrice - confidence95,
        confidence95Upper: optionPrice + confidence95,
        samples,
        paths: paths.slice(0, 100)  // Return first 100 paths for visualization
    };
}

/**
 * Performs Monte Carlo simulation to estimate Value-at-Risk (VaR)
 * @param {Object} params - Simulation parameters
 * @param {number} params.portfolio - Portfolio value
 * @param {number} params.horizon - Time horizon in days
 * @param {number} params.confidence - Confidence level (e.g., 0.95, 0.99)
 * @param {Array} params.returns - Historical returns or distribution parameters
 * @param {string} params.method - 'historical', 'parametric', or 'monte-carlo'
 * @param {number} params.samples - Number of simulations
 * @returns {Object} - VaR estimation result
 */
function simulateValueAtRisk(params) {
    const portfolio = params.portfolio || 1000000;
    const horizon = params.horizon || 1;
    const confidence = params.confidence || 0.95;
    const method = params.method || 'monte-carlo';
    const samples = params.samples || 10000;
    
    let returns, simulatedReturns;
    
    if (method === 'historical') {
        // Historical simulation method
        if (!params.returns || !Array.isArray(params.returns)) {
            throw new Error("Historical returns array must be provided");
        }
        
        returns = params.returns;
        
        // Sort returns in ascending order
        returns.sort((a, b) => a - b);
        
        // Find VaR at specified confidence level
        const index = Math.floor(returns.length * (1 - confidence));
        const var_return = returns[index];
        
        return {
            varAbsolute: -portfolio * var_return,
            varPercent: -var_return * 100,
            confidence,
            method: 'historical',
            samples: returns.length
        };
        
    } else if (method === 'parametric') {
        // Parametric method using normal distribution
        const mean = params.mean || 0;
        const stdDev = params.stdDev || 0.01;
        
        // Calculate VaR using the quantile of the normal distribution
        const z = normalQuantile(1 - confidence);
        const var_return = -(mean + z * stdDev * Math.sqrt(horizon));
        
        return {
            varAbsolute: portfolio * var_return,
            varPercent: var_return * 100,
            confidence,
            method: 'parametric',
            mean,
            stdDev,
            z
        };
        
    } else {
        // Monte Carlo simulation
        simulatedReturns = [];
        
        // Simulation parameters
        const mean = params.mean || 0;
        const stdDev = params.stdDev || 0.01;
        
        // Generate simulated returns
        for (let i = 0; i < samples; i++) {
            // Generate a standard normal random variable
            const u1 = Math.random();
            const u2 = Math.random();
            const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
            
            // Calculate return
            const return_daily = mean + stdDev * z;
            const return_horizon = return_daily * Math.sqrt(horizon);
            
            simulatedReturns.push(return_horizon);
        }
        
        // Sort returns in ascending order
        simulatedReturns.sort((a, b) => a - b);
        
        // Find VaR at specified confidence level
        const index = Math.floor(samples * (1 - confidence));
        const var_return = -simulatedReturns[index];
        
        return {
            varAbsolute: portfolio * var_return,
            varPercent: var_return * 100,
            confidence,
            method: 'monte-carlo',
            samples,
            histogram: generateReturnHistogram(simulatedReturns, 20)
        };
    }
}

/**
 * =============================================
 * SIMULATION CONTROLLER FUNCTIONS
 * =============================================
 */

/**
 * Starts a simulation with specified parameters
 * @param {string} simulationId - Unique ID for the simulation
 * @param {string} simulationType - Type of simulation to run
 * @param {Object} params - Simulation parameters
 * @param {Function} callback - Callback function to receive simulation results
 * @returns {Object} - Simulation controller
 */
function startSimulation(simulationId, simulationType, params, callback) {
    // Stop any existing simulation with the same ID
    if (simulationState.activeSimulations[simulationId]) {
        stopSimulation(simulationId);
    }
    
    // Initialize simulation data
    simulationState.simulationData[simulationId] = {
        type: simulationType,
        params,
        results: {},
        progress: 0,
        startTime: Date.now(),
        status: 'running'
    };
    
    // Create simulation controller
    const controller = {
        pause: function() {
            if (simulationState.simulationIntervals[simulationId]) {
                clearInterval(simulationState.simulationIntervals[simulationId]);
                delete simulationState.simulationIntervals[simulationId];
                simulationState.simulationData[simulationId].status = 'paused';
            }
        },
        resume: function() {
            if (simulationState.simulationData[simulationId].status === 'paused') {
                runSimulationStep();
                simulationState.simulationData[simulationId].status = 'running';
            }
        },
        stop: function() {
            stopSimulation(simulationId);
        },
        getStatus: function() {
            return simulationState.simulationData[simulationId];
        }
    };
    
    // Function to run a single simulation step
    function runSimulationStep() {
        const simData = simulationState.simulationData[simulationId];
        
        // Run different simulation types
        switch (simulationType) {
            case 'random_walk':
                // For random walk, we simulate in chunks
                const chunkSize = params.chunkSize || 100;
                const totalSteps = params.steps || 1000;
                
                let currentStep = simData.progress * totalSteps;
                
                if (currentStep >= totalSteps) {
                    // Simulation complete
                    simData.status = 'completed';
                    simData.progress = 1;
                    if (callback) callback(simData);
                    stopSimulation(simulationId);
                    return;
                }
                
                // Set up interval for chunked simulation
                simulationState.simulationIntervals[simulationId] = setInterval(function() {
                    // Calculate steps for this chunk
                    const stepsToSimulate = Math.min(chunkSize, totalSteps - currentStep);
                    
                    // Create parameters for this chunk
                    const chunkParams = { ...params, steps: stepsToSimulate };
                    
                    // If this isn't the first chunk, use the last position as starting point
                    if (currentStep > 0 && simData.results.trajectory) {
                        if (params.dimension === 1) {
                            chunkParams.startingPoint = simData.results.trajectory[simData.results.trajectory.length - 1];
                        } else {
                            chunkParams.startingPoint = simData.results.trajectory[simData.results.trajectory.length - 1][0];
                        }
                    }
                    
                    // Run simulation for this chunk
                    const chunkResults = simulateRandomWalk(chunkParams);
                    
                    // Merge results
                    if (!simData.results.trajectory) {
                        simData.results = chunkResults;
                    } else {
                        // Append new trajectory points (skip first point to avoid duplication)
                        simData.results.trajectory = simData.results.trajectory.concat(
                            chunkResults.trajectory.slice(1)
                        );
                        
                        // Update other statistics
                        simData.results.finalPosition = chunkResults.finalPosition;
                        simData.results.displacement = chunkResults.displacement;
                        simData.results.maxDistance = Math.max(
                            simData.results.maxDistance,
                            chunkResults.maxDistance
                        );
                    }
                    
                    // Update progress
                    currentStep += stepsToSimulate;
                    simData.progress = currentStep / totalSteps;
                    
                    // Invoke callback with current results
                    if (callback) callback(simData);
                    
                    // Check if simulation is complete
                    if (currentStep >= totalSteps) {
                        simData.status = 'completed';
                        simData.progress = 1;
                        stopSimulation(simulationId);
                    }
                }, 0);
                break;
                
            case 'brownian_motion':
            case 'geometric_brownian_motion':
                // For continuous processes, simulate in time chunks
                const timePoints = params.timePoints || 1000;
                const chunkTimePoints = params.chunkTimePoints || 100;
                
                let currentTimePoint = Math.floor(simData.progress * timePoints);
                
                if (currentTimePoint >= timePoints) {
                    // Simulation complete
                    simData.status = 'completed';
                    simData.progress = 1;
                    if (callback) callback(simData);
                    stopSimulation(simulationId);
                    return;
                }
                
                // Set up interval for chunked simulation
                simulationState.simulationIntervals[simulationId] = setInterval(function() {
                    // Calculate time points for this chunk
                    const pointsToSimulate = Math.min(chunkTimePoints, timePoints - currentTimePoint);
                    
                    // Create parameters for this chunk
                    const chunkParams = {
                        ...params,
                        timePoints: pointsToSimulate,
                        timeHorizon: params.timeHorizon * (pointsToSimulate / timePoints)
                    };
                    
                    // If this isn't the first chunk, use the last value as initial value
                    if (currentTimePoint > 0 && simData.results.trajectory) {
                        chunkParams.initialValue = simData.results.trajectory[simData.results.trajectory.length - 1];
                    }
                    
                    // Run simulation for this chunk
                    let chunkResults;
                    if (simulationType === 'brownian_motion') {
                        chunkResults = simulateBrownianMotion(chunkParams);
                    } else {
                        chunkResults = simulateGeometricBrownianMotion(chunkParams);
                    }
                    
                    // Merge results
                    if (!simData.results.trajectory) {
                        simData.results = chunkResults;
                    } else {
                        // Append new trajectory points (skip first point to avoid duplication)
                        simData.results.trajectory = simData.results.trajectory.concat(
                            chunkResults.trajectory.slice(1)
                        );
                        
                        // Append new time values (adjusting for the offset)
                        const lastTime = simData.results.timeValues[simData.results.timeValues.length - 1];
                        simData.results.timeValues = simData.results.timeValues.concat(
                            chunkResults.timeValues.slice(1).map(t => t + lastTime)
                        );
                        
                        // Update other statistics
                        simData.results.finalValue = chunkResults.finalValue;
                    }
                    
                    // Update progress
                    currentTimePoint += pointsToSimulate;
                    simData.progress = currentTimePoint / timePoints;
                    
                    // Invoke callback with current results
                    if (callback) callback(simData);
                    
                    // Check if simulation is complete
                    if (currentTimePoint >= timePoints) {
                        simData.status = 'completed';
                        simData.progress = 1;
                        stopSimulation(simulationId);
                    }
                }, 0);
                break;
                
            case 'monte_carlo':
                // For Monte Carlo simulations, run in batches
                const totalSamples = params.samples || 10000;
                const batchSize = params.batchSize || 1000;
                
                let currentSamples = Math.floor(simData.progress * totalSamples);
                
                if (currentSamples >= totalSamples) {
                    // Simulation complete
                    simData.status = 'completed';
                    simData.progress = 1;
                    if (callback) callback(simData);
                    stopSimulation(simulationId);
                    return;
                }
                
                // Set up interval for batched simulation
                simulationState.simulationIntervals[simulationId] = setInterval(function() {
                    // Calculate samples for this batch
                    const samplesToSimulate = Math.min(batchSize, totalSamples - currentSamples);
                    
                    // Determine which Monte Carlo simulation to run
                    let batchResults;
                    
                    if (params.simulationType === 'integration') {
                        // Monte Carlo integration
                        batchResults = monteCarloIntegration(
                            params.function,
                            params.lowerBound,
                            params.upperBound,
                            samplesToSimulate
                        );
                        
                        // Merge results
                        if (!simData.results.estimate) {
                            simData.results = batchResults;
                        } else {
                            // Update estimate using weighted average
                            const totalSamplesSoFar = currentSamples + samplesToSimulate;
                            simData.results.estimate = (
                                simData.results.estimate * currentSamples +
                                batchResults.estimate * samplesToSimulate
                            ) / totalSamplesSoFar;
                            
                            // Update standard error
                            simData.results.standardError = simData.results.estimate /
                                Math.sqrt(totalSamplesSoFar);
                            
                            simData.results.samples = totalSamplesSoFar;
                        }
                    } else if (params.simulationType === 'option_pricing') {
                        // Option pricing
                        const batchParams = { ...params, samples: samplesToSimulate };
                        batchResults = monteCarloOptionPricing(batchParams);
                        
                        // Merge results
                        if (!simData.results.optionPrice) {
                            simData.results = batchResults;
                        } else {
                            // Update price using weighted average
                            const totalSamplesSoFar = currentSamples + samplesToSimulate;
                            simData.results.optionPrice = (
                                simData.results.optionPrice * currentSamples +
                                batchResults.optionPrice * samplesToSimulate
                            ) / totalSamplesSoFar;
                            
                            // Update standard error
                            simData.results.standardError =
                                Math.abs(simData.results.optionPrice) /
                                Math.sqrt(totalSamplesSoFar);
                            
                            // Update confidence interval
                            const confidence95 = 1.96 * simData.results.standardError;
                            simData.results.confidence95Lower =
                                simData.results.optionPrice - confidence95;
                            simData.results.confidence95Upper =
                                simData.results.optionPrice + confidence95;
                            
                            simData.results.samples = totalSamplesSoFar;
                        }
                    } else if (params.simulationType === 'var') {
                        // Value at Risk
                        const batchParams = { ...params, samples: totalSamples };
                        // VaR needs all samples at once for percentile calculation
                        batchResults = simulateValueAtRisk(batchParams);
                        simData.results = batchResults;
                        
                        // Mark as complete since we do it all at once
                        currentSamples = totalSamples;
                    } else {
                        // Generic Monte Carlo with custom function
                        if (typeof params.simulationFunction === 'function') {
                            batchResults = params.simulationFunction(samplesToSimulate);
                            
                            // Merge results (depends on custom function implementation)
                            if (!simData.results.estimate) {
                                simData.results = batchResults;
                            } else if (typeof params.mergeFunction === 'function') {
                                simData.results = params.mergeFunction(
                                    simData.results,
                                    batchResults,
                                    currentSamples,
                                    samplesToSimulate
                                );
                            }
                        }
                    }
                    
                    // Update progress
                    currentSamples += samplesToSimulate;
                    simData.progress = currentSamples / totalSamples;
                    
                    // Invoke callback with current results
                    if (callback) callback(simData);
                    
                    // Check if simulation is complete
                    if (currentSamples >= totalSamples) {
                        simData.status = 'completed';
                        simData.progress = 1;
                        stopSimulation(simulationId);
                    }
                }, 0);
                break;
                
            default:
                // For simple one-off simulations
                let result;
                
                switch (simulationType) {
                    case 'markov_chain':
                        result = simulateMarkovChain(params);
                        break;
                        
                    case 'poisson_process':
                        result = simulatePoissonProcess(params);
                        break;
                        
                    default:
                        // If no specific simulation type, just run a general simulation
                        if (typeof params.simulationFunction === 'function') {
                            result = params.simulationFunction(params);
                        } else {
                            result = { error: "Unknown simulation type or missing simulation function" };
                        }
                }
                
                // Store results and mark as complete
                simData.results = result;
                simData.status = 'completed';
                simData.progress = 1;
                
                // Invoke callback with results
                if (callback) callback(simData);
                
                // No need for interval
                stopSimulation(simulationId);
        }
    }
    
    // Start the simulation
    runSimulationStep();
    
    // Store controller in simulation state
    simulationState.activeSimulations[simulationId] = controller;
    
    return controller;
}

/**
 * Stops a running simulation
 * @param {string} simulationId - ID of the simulation to stop
 */
function stopSimulation(simulationId) {
    if (simulationState.simulationIntervals[simulationId]) {
        clearInterval(simulationState.simulationIntervals[simulationId]);
        delete simulationState.simulationIntervals[simulationId];
    }
    
    if (simulationState.simulationData[simulationId]) {
        simulationState.simulationData[simulationId].status = 'stopped';
    }
    
    if (simulationState.activeSimulations[simulationId]) {
        delete simulationState.activeSimulations[simulationId];
    }
}

/**
 * =============================================
 * HELPER FUNCTIONS
 * =============================================
 */

/**
 * Calculates the normal quantile function (inverse CDF)
 * @param {number} p - Probability (0 < p < 1)
 * @returns {number} - Z-score
 */
function normalQuantile(p) {
    if (p <= 0 || p >= 1) {
        return NaN;
    }
    
    // Abramowitz and Stegun approximation
    let q = p - 0.5;
    
    if (Math.abs(q) <= 0.425) {
        const r = 0.180625 - q * q;
        
        return q * (((((((2.509080928730122e0 * r +
                          3.430575583588128e0) * r +
                          6.726570927008074e0) * r +
                          4.592195389180488e0) * r +
                          1.373164299837108e0) * r +
                          1.05075007164441e-1) * r +
                          3.243323052491757e-3) * r +
                          5.769497221460691e-5) /
                      (((((((1e0 * r +
                              2.821036797031573e0) * r +
                              2.837259372829381e0) * r +
                              1.638576682724563e0) * r +
                              5.787895612894391e-1) * r +
                              1.035344631170998e-1) * r +
                              8.319745030846651e-3) * r +
                              1.723437282696452e-4);
    }
    
    if (q > 0) {
        const r = Math.sqrt(-Math.log(1 - p));
        
        return (((((((4.362510997102849e-3 * r +
                      2.637759745384389e-1) * r +
                      5.426433108663499e-1) * r +
                      4.630337846156546e-1) * r +
                      2.026266245747083e-1) * r +
                      4.343146733226948e-2) * r +
                      3.227306323213235e-3) * r +
                      2.485862499943166e-7) /
                    (((((((1e0 * r +
                            1.500270018142497e0) * r +
                            7.780454896577434e-1) * r +
                            2.097847961257033e-1) * r +
                            3.081200041583323e-2) * r +
                            2.077383899635531e-3) * r +
                            5.472247166000478e-5) * r +
                            2.417758600681709e-13);
    } else {
        const r = Math.sqrt(-Math.log(p));
        
        return -(((((((4.362510997102849e-3 * r +
                       2.637759745384389e-1) * r +
                       5.426433108663499e-1) * r +
                       4.630337846156546e-1) * r +
                       2.026266245747083e-1) * r +
                       4.343146733226948e-2) * r +
                       3.227306323213235e-3) * r +
                       2.485862499943166e-7) /
                     (((((((1e0 * r +
                             1.500270018142497e0) * r +
                             7.780454896577434e-1) * r +
                             2.097847961257033e-1) * r +
                             3.081200041583323e-2) * r +
                             2.077383899635531e-3) * r +
                             5.472247166000478e-5) * r +
                             2.417758600681709e-13);
    }
}

/**
 * Generates a histogram from an array of returns
 * @param {Array} returns - Array of return values
 * @param {number} numBins - Number of bins
 * @returns {Array} - Histogram data
 */
function generateReturnHistogram(returns, numBins = 20) {
    const min = Math.min(...returns);
    const max = Math.max(...returns);
    const range = max - min;
    const binWidth = range / numBins;
    
    // Create bins
    const bins = Array(numBins).fill(0);
    const binLabels = [];
    
    for (let i = 0; i < numBins; i++) {
        binLabels.push(min + i * binWidth + binWidth / 2);
    }
    
    // Count returns in each bin
    returns.forEach(ret => {
        const binIndex = Math.min(numBins - 1, Math.max(0, Math.floor((ret - min) / binWidth)));
        bins[binIndex]++;
    });
    
    // Convert to frequency
    const freqBins = bins.map(count => count / returns.length);
    
    return {
        binLabels,
        binCounts: bins,
        frequencies: freqBins,
        min,
        max,
        binWidth
    };
}

/**
 * Export all simulator functions
 */
export {
    // Distribution sampling
    generateDistributionSamples,
    generateMultivariateNormalSamples,
    
    // Stochastic processes
    simulateRandomWalk,
    simulatePoissonProcess,
    simulateMarkovChain,
    simulateBrownianMotion,
    simulateGeometricBrownianMotion,
    
    // Monte Carlo simulations
    monteCarloIntegration,
    monteCarloOptionPricing,
    simulateValueAtRisk,
    
    // Simulation controllers
    startSimulation,
    stopSimulation,
    simulationState
};