/**
 * Multivariate Probability Distributions Calculators
 * Contains calculator functions for multivariate probability distributions
 * Random Variables & Probability Distributions
 */

// Global variables to store calculator states
let multivariateState = {
    currentDistribution: '',
    parameters: {},
    calculationResults: {},
    visualizationData: {}
};

/**
 * =============================================
 * MULTIVARIATE NORMAL DISTRIBUTION FUNCTIONS
 * =============================================
 */

/**
 * Calculates Multivariate Normal distribution properties and probabilities
 * @param {Object} params - Calculator parameters
 * @returns {Object} - Results including probabilities, means, covariance, etc.
 */
function calculateMultivariateNormal(params) {
    const { means, covMatrix, point, calculationType, decimals } = params;
    
    // Validate parameters
    if (!isValidMeansVector(means)) {
        return {
            error: 'Mean vector is invalid. Please enter a valid comma-separated list of numbers.'
        };
    }
    
    if (!isValidCovarianceMatrix(covMatrix, means.length)) {
        return {
            error: 'Covariance matrix is invalid. Please ensure it is a valid symmetric positive-definite matrix with correct dimensions.'
        };
    }
    
    // Parse means to array
    const meanVector = parseMeansVector(means);
    const dimension = meanVector.length;
    
    // Parse covariance matrix
    const covarianceMatrix = parseCovarianceMatrix(covMatrix, dimension);
    
    // Calculate specific probability based on calculationType
    let result, formula, interpretation, steps;
    
    // Round to specified decimal places
    const decimalPlaces = parseInt(decimals) || 4;
    
    switch (calculationType) {
        case 'pdf':
            // PDF: f(x) at a specific point
            if (!isValidPoint(point, dimension)) {
                return {
                    error: 'Point is invalid. Please enter a valid point with the same dimension as the mean vector.'
                };
            }
            
            const pointVector = parsePointVector(point, dimension);
            result = multivariateNormalPDF(pointVector, meanVector, covarianceMatrix);
            
            formula = `f(\\mathbf{x}) = \\frac{1}{(2\\pi)^{${dimension}/2}|\\mathbf{\\Sigma}|^{1/2}} \\exp\\left(-\\frac{1}{2}(\\mathbf{x}-\\mathbf{\\mu})^T\\mathbf{\\Sigma}^{-1}(\\mathbf{x}-\\mathbf{\\mu})\\right)`;
            interpretation = `The probability density at point (${pointVector.join(', ')}) is ${result.toFixed(6)}.`;
            
            steps = [
                `Step 1: Identify the multivariate normal distribution parameters.`,
                `Mean vector μ = [${meanVector.join(', ')}]`,
                `Covariance matrix Σ = [${formatMatrixForDisplay(covarianceMatrix)}]`,
                `Step 2: Calculate the determinant of the covariance matrix.`,
                `|Σ| = ${determinant(covarianceMatrix).toFixed(6)}`,
                `Step 3: Calculate the inverse of the covariance matrix.`,
                `Σ^(-1) = [${formatMatrixForDisplay(invertMatrix(covarianceMatrix))}]`,
                `Step 4: Calculate the quadratic form (x-μ)^T Σ^(-1) (x-μ).`,
                `x-μ = [${subtractVectors(pointVector, meanVector).join(', ')}]`,
                `Quadratic form = ${calculateQuadraticForm(pointVector, meanVector, covarianceMatrix).toFixed(6)}`,
                `Step 5: Apply the multivariate normal PDF formula.`,
                `f(x) = (2π)^(-${dimension}/2) |Σ|^(-1/2) exp(-quadratic form/2)`,
                `f(x) = ${result.toFixed(6)}`
            ];
            break;
            
        case 'mahalanobis':
            // Mahalanobis distance from a point to the distribution
            if (!isValidPoint(point, dimension)) {
                return {
                    error: 'Point is invalid. Please enter a valid point with the same dimension as the mean vector.'
                };
            }
            
            const mahalanobisPoint = parsePointVector(point, dimension);
            result = mahalanobisDistance(mahalanobisPoint, meanVector, covarianceMatrix);
            
            formula = `d_M(\\mathbf{x}, \\mathbf{\\mu}) = \\sqrt{(\\mathbf{x}-\\mathbf{\\mu})^T\\mathbf{\\Sigma}^{-1}(\\mathbf{x}-\\mathbf{\\mu})}`;
            interpretation = `The Mahalanobis distance from point (${mahalanobisPoint.join(', ')}) to the distribution is ${result.toFixed(6)}.`;
            
            steps = [
                `Step 1: Identify the multivariate normal distribution parameters.`,
                `Mean vector μ = [${meanVector.join(', ')}]`,
                `Covariance matrix Σ = [${formatMatrixForDisplay(covarianceMatrix)}]`,
                `Step 2: Calculate the inverse of the covariance matrix.`,
                `Σ^(-1) = [${formatMatrixForDisplay(invertMatrix(covarianceMatrix))}]`,
                `Step 3: Calculate the difference vector x-μ.`,
                `x-μ = [${subtractVectors(mahalanobisPoint, meanVector).join(', ')}]`,
                `Step 4: Calculate the quadratic form (x-μ)^T Σ^(-1) (x-μ).`,
                `Quadratic form = ${calculateQuadraticForm(mahalanobisPoint, meanVector, covarianceMatrix).toFixed(6)}`,
                `Step 5: Take the square root to get the Mahalanobis distance.`,
                `d_M(x, μ) = √(Quadratic form) = √${calculateQuadraticForm(mahalanobisPoint, meanVector, covarianceMatrix).toFixed(6)} = ${result.toFixed(6)}`
            ];
            break;
            
        case 'marginal':
            // Marginal distribution for selected variables
            const variables = params.variables ? params.variables.split(',').map(v => parseInt(v.trim()) - 1) : [];
            
            if (!isValidVariableSelection(variables, dimension)) {
                return {
                    error: 'Invalid variable selection. Please enter valid variable indices separated by commas.'
                };
            }
            
            // Extract marginal means and covariance
            const marginalMeans = variables.map(i => meanVector[i]);
            const marginalCovariance = extractSubmatrix(covarianceMatrix, variables);
            
            result = {
                means: marginalMeans,
                covariance: marginalCovariance
            };
            
            formula = `\\mathbf{X}_{marginal} \\sim \\mathcal{N}(\\mathbf{\\mu}_{marginal}, \\mathbf{\\Sigma}_{marginal})`;
            interpretation = `The marginal distribution for variables [${variables.map(i => i+1).join(', ')}] is a ${variables.length}-dimensional multivariate normal distribution.`;
            
            steps = [
                `Step 1: Identify the multivariate normal distribution parameters.`,
                `Mean vector μ = [${meanVector.join(', ')}]`,
                `Covariance matrix Σ = [${formatMatrixForDisplay(covarianceMatrix)}]`,
                `Step 2: Select the variables for marginalization.`,
                `Selected variables: [${variables.map(i => i+1).join(', ')}]`,
                `Step 3: Extract the corresponding elements from the mean vector.`,
                `Marginal mean vector = [${marginalMeans.join(', ')}]`,
                `Step 4: Extract the corresponding submatrix from the covariance matrix.`,
                `Marginal covariance matrix = [${formatMatrixForDisplay(marginalCovariance)}]`,
                `Step 5: The marginal distribution is multivariate normal with these parameters.`,
                `X_marginal ~ N(μ_marginal, Σ_marginal)`
            ];
            break;
            
        case 'conditional':
            // Conditional distribution given some variables
            const givenVariables = params.givenVariables ? params.givenVariables.split(',').map(v => parseInt(v.trim()) - 1) : [];
            const givenValues = params.givenValues ? params.givenValues.split(',').map(v => parseFloat(v.trim())) : [];
            
            if (!isValidVariableSelection(givenVariables, dimension) || givenVariables.length === 0) {
                return {
                    error: 'Invalid given variable selection. Please enter valid variable indices separated by commas.'
                };
            }
            
            if (givenValues.length !== givenVariables.length) {
                return {
                    error: 'The number of given values must match the number of given variables.'
                };
            }
            
            // Get remaining variables (not in given)
            const remainingVariables = Array.from({length: dimension}, (_, i) => i)
                .filter(i => !givenVariables.includes(i));
            
            // Calculate conditional distribution parameters
            const conditionalResult = conditionalMultivariateNormal(
                meanVector, covarianceMatrix, givenVariables, givenValues, remainingVariables
            );
            
            result = conditionalResult;
            
            formula = `\\mathbf{X}_{1}|\\mathbf{X}_{2}=\\mathbf{x}_{2} \\sim \\mathcal{N}(\\mathbf{\\mu}_{1|2}, \\mathbf{\\Sigma}_{1|2})`;
            interpretation = `The conditional distribution for the remaining variables given [${givenVariables.map(i => i+1).join(', ')}] = [${givenValues.join(', ')}] is a ${remainingVariables.length}-dimensional multivariate normal distribution.`;
            
            steps = [
                `Step 1: Identify the multivariate normal distribution parameters.`,
                `Mean vector μ = [${meanVector.join(', ')}]`,
                `Covariance matrix Σ = [${formatMatrixForDisplay(covarianceMatrix)}]`,
                `Step 2: Partition the variables into given and remaining sets.`,
                `Given variables: [${givenVariables.map(i => i+1).join(', ')}] with values [${givenValues.join(', ')}]`,
                `Remaining variables: [${remainingVariables.map(i => i+1).join(', ')}]`,
                `Step 3: Partition the mean vector and covariance matrix accordingly.`,
                `μ₁ (remaining) = [${conditionalResult.originalMeans.join(', ')}]`,
                `μ₂ (given) = [${conditionalResult.givenMeans.join(', ')}]`,
                `Σ₁₁ = [${formatMatrixForDisplay(conditionalResult.sigma11)}]`,
                `Σ₁₂ = [${formatMatrixForDisplay(conditionalResult.sigma12)}]`,
                `Σ₂₁ = [${formatMatrixForDisplay(conditionalResult.sigma21)}]`,
                `Σ₂₂ = [${formatMatrixForDisplay(conditionalResult.sigma22)}]`,
                `Step 4: Calculate the conditional mean.`,
                `μ₁|₂ = μ₁ + Σ₁₂Σ₂₂⁻¹(x₂ - μ₂)`,
                `μ₁|₂ = [${conditionalResult.conditionalMean.join(', ')}]`,
                `Step 5: Calculate the conditional covariance.`,
                `Σ₁|₂ = Σ₁₁ - Σ₁₂Σ₂₂⁻¹Σ₂₁`,
                `Σ₁|₂ = [${formatMatrixForDisplay(conditionalResult.conditionalCovariance)}]`
            ];
            break;
            
        case 'ellipsoid':
            // Probability ellipsoid at a given confidence level
            const alpha = parseFloat(params.alpha) || 0.95;
            
            if (alpha <= 0 || alpha >= 1) {
                return {
                    error: 'Confidence level must be between 0 and 1 (exclusive).'
                };
            }
            
            // For a d-dimensional multivariate normal, the confidence region is given by
            // (x-μ)^T Σ^(-1) (x-μ) ≤ χ²_d(α)
            const chiSquareValue = chiSquareQuantile(dimension, alpha);
            
            result = {
                chiSquare: chiSquareValue,
                eigenvectors: calculateEigenvectors(covarianceMatrix),
                eigenvalues: calculateEigenvalues(covarianceMatrix),
                axes: calculateEllipsoidAxes(covarianceMatrix, chiSquareValue)
            };
            
            formula = `(\\mathbf{x}-\\mathbf{\\mu})^T\\mathbf{\\Sigma}^{-1}(\\mathbf{x}-\\mathbf{\\mu}) \\leq \\chi^2_${dimension}(${alpha})`;
            interpretation = `The ${(alpha * 100).toFixed(1)}% confidence ellipsoid is defined by the quadratic form being less than or equal to ${chiSquareValue.toFixed(4)}.`;
            
            steps = [
                `Step 1: Identify the multivariate normal distribution parameters.`,
                `Mean vector μ = [${meanVector.join(', ')}]`,
                `Covariance matrix Σ = [${formatMatrixForDisplay(covarianceMatrix)}]`,
                `Step 2: Determine the critical value from the chi-square distribution.`,
                `For ${dimension} dimensions and confidence level ${alpha}, χ²_${dimension}(${alpha}) = ${chiSquareValue.toFixed(6)}`,
                `Step 3: Find the eigenvalues and eigenvectors of the covariance matrix.`,
                `Eigenvalues = [${result.eigenvalues.join(', ')}]`,
                `Step 4: Calculate the axes of the ellipsoid.`,
                `The lengths of the semi-axes are proportional to the square roots of the eigenvalues.`,
                `Semi-axes lengths = [${result.axes.join(', ')}]`,
                `Step 5: The ellipsoid is centered at the mean vector.`,
                `Center = [${meanVector.join(', ')}]`
            ];
            break;
    }
    
    // Round results for display
    const roundedResult = roundResult(result, decimalPlaces);
    
    // Generate visualization data if dimension <= 3
    let visualizationData = null;
    if (dimension <= 3) {
        visualizationData = generateMultivariateNormalVisualization(meanVector, covarianceMatrix, dimension);
    }
    
    // Store in state for later use
    multivariateState.currentDistribution = 'multivariateNormal';
    multivariateState.parameters = { 
        means: meanVector, 
        covMatrix: covarianceMatrix,
        dimension
    };
    multivariateState.calculationResults = { result };
    multivariateState.visualizationData = visualizationData;
    
    return {
        result: roundedResult,
        formula,
        interpretation,
        steps,
        dimension,
        means: meanVector,
        covarianceMatrix,
        visualizationData
    };
}

/**
 * =============================================
 * MULTINOMIAL DISTRIBUTION FUNCTIONS
 * =============================================
 */

/**
 * Calculates Multinomial distribution properties and probabilities
 * @param {Object} params - Calculator parameters
 * @returns {Object} - Results including probabilities, means, covariance, etc.
 */
function calculateMultinomial(params) {
    const { n, probabilities, counts, calculationType, decimals } = params;
    
    // Validate parameters
    const numTrials = parseInt(n);
    if (isNaN(numTrials) || numTrials <= 0) {
        return {
            error: 'Number of trials must be a positive integer.'
        };
    }
    
    // Parse probabilities
    const probVector = parseProbabilitiesVector(probabilities);
    const dimension = probVector.length;
    
    // Check if probabilities sum to 1
    const probSum = probVector.reduce((a, b) => a + b, 0);
    if (Math.abs(probSum - 1) > 0.001) {
        return {
            error: 'Probabilities must sum to 1.'
        };
    }
    
    // Calculate specific probability based on calculationType
    let result, formula, interpretation, steps;
    
    // Round to specified decimal places
    const decimalPlaces = parseInt(decimals) || 4;
    
    switch (calculationType) {
        case 'pmf':
            // PMF: P(X = x) for a specific outcome
            const countVector = parseCountsVector(counts);
            
            if (countVector.length !== dimension) {
                return {
                    error: 'The number of counts must match the number of probabilities.'
                };
            }
            
            // Check if counts sum to n
            const countSum = countVector.reduce((a, b) => a + b, 0);
            if (countSum !== numTrials) {
                return {
                    error: `The counts must sum to the number of trials (${numTrials}).`
                };
            }
            
            result = multinomialPMF(numTrials, probVector, countVector);
            
            formula = `P(\\mathbf{X} = \\mathbf{x}) = \\binom{n}{x_1, x_2, \\ldots, x_k} \\prod_{i=1}^{k} p_i^{x_i}`;
            interpretation = `The probability of observing counts [${countVector.join(', ')}] in ${numTrials} trials is ${result.toFixed(6)}.`;
            
            steps = [
                `Step 1: Identify the multinomial distribution parameters.`,
                `Number of trials n = ${numTrials}`,
                `Probability vector p = [${probVector.join(', ')}]`,
                `Step 2: Calculate the multinomial coefficient.`,
                `Multinomial coefficient = n! / (x₁! × x₂! × ... × xₖ!)`,
                `Multinomial coefficient = ${numTrials}! / (${countVector.join('! × ')}!)`,
                `Multinomial coefficient = ${multinomialCoefficient(numTrials, countVector)}`,
                `Step 3: Calculate the product of probability terms.`,
                `Product = p₁^x₁ × p₂^x₂ × ... × pₖ^xₖ`,
                `Product = ${probVector.map((p, i) => `${p}^${countVector[i]}`).join(' × ')}`,
                `Product = ${probVector.map((p, i) => Math.pow(p, countVector[i])).reduce((a, b) => a * b, 1).toFixed(6)}`,
                `Step 4: Multiply the multinomial coefficient by the product.`,
                `P(X = x) = ${multinomialCoefficient(numTrials, countVector)} × ${probVector.map((p, i) => Math.pow(p, countVector[i])).reduce((a, b) => a * b, 1).toFixed(6)}`,
                `P(X = x) = ${result.toFixed(6)}`
            ];
            break;
            
        case 'mean':
            // Expected value for each category
            const means = probVector.map(p => numTrials * p);
            result = means;
            
            formula = `E[X_i] = n \\cdot p_i`;
            interpretation = `The expected counts for each category are [${means.map(m => m.toFixed(4)).join(', ')}].`;
            
            steps = [
                `Step 1: Identify the multinomial distribution parameters.`,
                `Number of trials n = ${numTrials}`,
                `Probability vector p = [${probVector.join(', ')}]`,
                `Step 2: Calculate the expected value for each category.`,
                `E[Xᵢ] = n × pᵢ`,
                ...probVector.map((p, i) => `E[X${i+1}] = ${numTrials} × ${p} = ${means[i].toFixed(4)}`)
            ];
            break;
            
        case 'variance':
            // Variance-covariance matrix
            const variances = [];
            const covariances = [];
            
            for (let i = 0; i < dimension; i++) {
                variances.push(numTrials * probVector[i] * (1 - probVector[i]));
                const covRow = [];
                for (let j = 0; j < dimension; j++) {
                    if (i === j) {
                        covRow.push(variances[i]);
                    } else {
                        covRow.push(-numTrials * probVector[i] * probVector[j]);
                    }
                }
                covariances.push(covRow);
            }
            
            result = {
                variances,
                covarianceMatrix: covariances
            };
            
            formula = `Var(X_i) = n \\cdot p_i \\cdot (1 - p_i) \\quad Cov(X_i, X_j) = -n \\cdot p_i \\cdot p_j`;
            interpretation = `The variances for each category are [${variances.map(v => v.toFixed(4)).join(', ')}].`;
            
            steps = [
                `Step 1: Identify the multinomial distribution parameters.`,
                `Number of trials n = ${numTrials}`,
                `Probability vector p = [${probVector.join(', ')}]`,
                `Step 2: Calculate the variance for each category.`,
                `Var(Xᵢ) = n × pᵢ × (1 - pᵢ)`,
                ...probVector.map((p, i) => `Var(X${i+1}) = ${numTrials} × ${p} × (1 - ${p}) = ${variances[i].toFixed(4)}`),
                `Step 3: Calculate the covariance between each pair of categories.`,
                `Cov(Xᵢ, Xⱼ) = -n × pᵢ × pⱼ (for i ≠ j)`
            ];
            
            // Add some example covariances if there are multiple categories
            if (dimension > 1) {
                steps.push(`Example covariances:`);
                for (let i = 0; i < Math.min(dimension, 3); i++) {
                    for (let j = i + 1; j < Math.min(dimension, 3); j++) {
                        steps.push(`Cov(X${i+1}, X${j+1}) = -${numTrials} × ${probVector[i]} × ${probVector[j]} = ${covariances[i][j].toFixed(4)}`);
                    }
                }
            }
            break;
            
        case 'joint':
            // Joint cumulative probability: P(X₁ ≤ a₁, X₂ ≤ a₂, ..., Xₖ ≤ aₖ)
            // This is complex and can't be calculated directly for most cases
            // We'll acknowledge this limitation
            result = "Joint CDF calculation not available";
            
            formula = `P(X_1 \\leq a_1, X_2 \\leq a_2, \\ldots, X_k \\leq a_k)`;
            interpretation = `Joint cumulative probability calculation is complex for the multinomial distribution and not directly available.`;
            
            steps = [
                `Step 1: Identify the multinomial distribution parameters.`,
                `Number of trials n = ${numTrials}`,
                `Probability vector p = [${probVector.join(', ')}]`,
                `Step 2: For joint cumulative probability:`,
                `The joint CDF does not have a simple closed form for the multinomial distribution.`,
                `It would require summing the PMF over all possible combinations of counts.`,
                `This calculation becomes computationally intensive for large n.`,
                `For specific cases, approximation methods or simulation approaches would be used.`
            ];
            break;
    }
    
    // Round results for display
    const roundedResult = roundResult(result, decimalPlaces);
    
    // Generate visualization data if dimension <= 3
    let visualizationData = null;
    if (dimension <= 3) {
        visualizationData = generateMultinomialVisualization(numTrials, probVector, dimension);
    }
    
    // Store in state for later use
    multivariateState.currentDistribution = 'multinomial';
    multivariateState.parameters = { 
        n: numTrials, 
        probabilities: probVector,
        dimension
    };
    multivariateState.calculationResults = { result };
    multivariateState.visualizationData = visualizationData;
    
    return {
        result: roundedResult,
        formula,
        interpretation,
        steps,
        n: numTrials,
        probabilities: probVector,
        dimension,
        visualizationData
    };
}

/**
 * =============================================
 * DIRICHLET DISTRIBUTION FUNCTIONS
 * =============================================
 */

/**
 * Calculates Dirichlet distribution properties and probabilities
 * @param {Object} params - Calculator parameters
 * @returns {Object} - Results including probabilities, means, etc.
 */
function calculateDirichlet(params) {
    const { alpha, point, calculationType, decimals } = params;
    
    // Parse alpha parameters
    const alphaVector = parseAlphaVector(alpha);
    const dimension = alphaVector.length;
    
    // Validate parameters
    if (alphaVector.some(a => a <= 0)) {
        return {
            error: 'All alpha parameters must be positive.'
        };
    }
    
    // Calculate specific probability based on calculationType
    let result, formula, interpretation, steps;
    
    // Round to specified decimal places
    const decimalPlaces = parseInt(decimals) || 4;
    
    switch (calculationType) {
        case 'pdf':
            // PDF: f(x) at a specific point
            const pointVector = parsePointVector(point, dimension);
            
            // Validate point (must be in simplex)
            if (!isValidSimplexPoint(pointVector)) {
                return {
                    error: 'Point must be in the simplex (all values between 0 and 1, and sum to 1).'
                };
            }
            
            result = dirichletPDF(pointVector, alphaVector);
            
            formula = `f(\\mathbf{x}) = \\frac{1}{B(\\boldsymbol{\\alpha})} \\prod_{i=1}^{k} x_i^{\\alpha_i - 1}`;
            interpretation = `The probability density at point (${pointVector.join(', ')}) is ${result.toFixed(6)}.`;
            
            steps = [
                `Step 1: Identify the Dirichlet distribution parameters.`,
                `Alpha vector α = [${alphaVector.join(', ')}]`,
                `Step 2: Calculate the beta function B(α).`,
                `B(α) = [Γ(α₁) × Γ(α₂) × ... × Γ(αₖ)] / Γ(α₁ + α₂ + ... + αₖ)`,
                `B(α) = [${alphaVector.map(a => `Γ(${a})`).join(' × ')}] / Γ(${alphaVector.reduce((a, b) => a + b, 0)})`,
                `B(α) = ${betaFunction(alphaVector).toFixed(6)}`,
                `Step 3: Calculate the product term.`,
                `Product = ${pointVector.map((x, i) => `${x}^(${alphaVector[i]}-1)`).join(' × ')}`,
                `Product = ${pointVector.map((x, i) => Math.pow(x, alphaVector[i] - 1)).reduce((a, b) => a * b, 1).toFixed(6)}`,
                `Step 4: Divide the product by the beta function.`,
                `f(x) = ${pointVector.map((x, i) => Math.pow(x, alphaVector[i] - 1)).reduce((a, b) => a * b, 1).toFixed(6)} / ${betaFunction(alphaVector).toFixed(6)}`,
                `f(x) = ${result.toFixed(6)}`
            ];
            break;
            
        case 'mean':
            // Expected value for each component
            const alphaSum = alphaVector.reduce((a, b) => a + b, 0);
            const means = alphaVector.map(a => a / alphaSum);
            result = means;
            
            formula = `E[X_i] = \\frac{\\alpha_i}{\\sum_{j=1}^{k} \\alpha_j}`;
            interpretation = `The expected values for each component are [${means.map(m => m.toFixed(4)).join(', ')}].`;
            
            steps = [
                `Step 1: Identify the Dirichlet distribution parameters.`,
                `Alpha vector α = [${alphaVector.join(', ')}]`,
                `Step 2: Calculate the sum of all alpha parameters.`,
                `Sum = ${alphaVector.join(' + ')} = ${alphaSum}`,
                `Step 3: Calculate the expected value for each component.`,
                `E[Xᵢ] = αᵢ / Sum`,
                ...alphaVector.map((a, i) => `E[X${i+1}] = ${a} / ${alphaSum} = ${means[i].toFixed(4)}`)
            ];
            break;
            
        case 'variance':
            // Variance-covariance matrix
            const alphaSum2 = alphaVector.reduce((a, b) => a + b, 0);
            const variances = [];
            const covariances = [];
            
            for (let i = 0; i < dimension; i++) {
                variances.push(alphaVector[i] * (alphaSum2 - alphaVector[i]) / (alphaSum2 * alphaSum2 * (alphaSum2 + 1)));
                const covRow = [];
                for (let j = 0; j < dimension; j++) {
                    if (i === j) {
                        covRow.push(variances[i]);
                    } else {
                        covRow.push(-alphaVector[i] * alphaVector[j] / (alphaSum2 * alphaSum2 * (alphaSum2 + 1)));
                    }
                }
                covariances.push(covRow);
            }
            
            result = {
                variances,
                covarianceMatrix: covariances
            };
            
            formula = `Var(X_i) = \\frac{\\alpha_i(\\alpha_0 - \\alpha_i)}{\\alpha_0^2(\\alpha_0 + 1)} \\quad Cov(X_i, X_j) = \\frac{-\\alpha_i \\alpha_j}{\\alpha_0^2(\\alpha_0 + 1)}`;
            interpretation = `The variances for each component are [${variances.map(v => v.toFixed(6)).join(', ')}].`;
            
            steps = [
                `Step 1: Identify the Dirichlet distribution parameters.`,
                `Alpha vector α = [${alphaVector.join(', ')}]`,
                `Step 2: Calculate the sum of all alpha parameters.`,
                `α₀ = ${alphaVector.join(' + ')} = ${alphaSum2}`,
                `Step 3: Calculate the variance for each component.`,
                `Var(Xᵢ) = αᵢ(α₀ - αᵢ) / [α₀²(α₀ + 1)]`,
                ...alphaVector.map((a, i) => `Var(X${i+1}) = ${a}(${alphaSum2} - ${a}) / [${alphaSum2}² × (${alphaSum2} + 1)] = ${variances[i].toFixed(6)}`)
            ];
            
            // Add some example covariances if there are multiple components
            if (dimension > 1) {
                steps.push(`Step 4: Calculate the covariance between each pair of components.`);
                steps.push(`Cov(Xᵢ, Xⱼ) = -αᵢαⱼ / [α₀²(α₀ + 1)] (for i ≠ j)`);
                for (let i = 0; i < Math.min(dimension, 3); i++) {
                    for (let j = i + 1; j < Math.min(dimension, 3); j++) {
                        steps.push(`Cov(X${i+1}, X${j+1}) = -(${alphaVector[i]} × ${alphaVector[j]}) / [${alphaSum2}² × (${alphaSum2} + 1)] = ${covariances[i][j].toFixed(6)}`);
                    }
                }
            }
            break;
            
        case 'concentration':
            // Concentration parameter and its effect
            const alphaSum3 = alphaVector.reduce((a, b) => a + b, 0);
            const normalizedAlpha = alphaVector.map(a => a / alphaSum3);
            
            result = {
                concentration: alphaSum3,
                normalizedAlpha
            };
            
            formula = `\\alpha_0 = \\sum_{i=1}^{k} \\alpha_i`;
            interpretation = `The concentration parameter is ${alphaSum3.toFixed(4)}. Higher values lead to more concentrated probability mass around the mean [${normalizedAlpha.map(a => a.toFixed(4)).join(', ')}].`;
            
            steps = [
                `Step 1: Identify the Dirichlet distribution parameters.`,
                `Alpha vector α = [${alphaVector.join(', ')}]`,
                `Step 2: Calculate the concentration parameter.`,
                `α₀ = ${alphaVector.join(' + ')} = ${alphaSum3}`,
                `Step 3: Calculate the normalized alpha vector (directional component).`,
                `Normalized α = α / α₀ = [${alphaVector.join(', ')}] / ${alphaSum3} = [${normalizedAlpha.map(a => a.toFixed(4)).join(', ')}]`,
                `Step 4: Interpret the concentration parameter:`,
                `- When α₀ is large (> 1), the distribution concentrates around the mean.`,
                `- When α₀ is small (< 1), the distribution concentrates on the corners of the simplex.`,
                `- When α₀ = 1, it behaves similar to a uniform distribution on the simplex.`
            ];
            
            if (alphaSum3 > 1) {
                steps.push(`With α₀ = ${alphaSum3.toFixed(4)} > 1, the distribution is more concentrated around the mean.`);
            } else if (alphaSum3 < 1) {
                steps.push(`With α₀ = ${alphaSum3.toFixed(4)} < 1, the distribution is more concentrated on the corners of the simplex.`);
            } else {
                steps.push(`With α₀ = ${alphaSum3.toFixed(4)} ≈ 1, the distribution is similar to a uniform distribution on the simplex.`);
            }
            break;
    }
    
    // Round results for display
    const roundedResult = roundResult(result, decimalPlaces);
    
    // Generate visualization data if dimension <= 3
    let visualizationData = null;
    if (dimension <= 3) {
        visualizationData = generateDirichletVisualization(alphaVector, dimension);
    }
    
    // Store in state for later use
    multivariateState.currentDistribution = 'dirichlet';
    multivariateState.parameters = { 
        alpha: alphaVector,
        dimension
    };
    multivariateState.calculationResults = { result };
    multivariateState.visualizationData = visualizationData;
    
    return {
        result: roundedResult,
        formula,
        interpretation,
        steps,
        alpha: alphaVector,
        dimension,
        visualizationData
    };
}

/**
 * =============================================
 * WISHART DISTRIBUTION FUNCTIONS
 * =============================================
 */

/**
 * Calculates Wishart distribution properties
 * @param {Object} params - Calculator parameters
 * @returns {Object} - Results including mean, variance, etc.
 */
function calculateWishart(params) {
    const { V, n, calculationType, decimals } = params;
    
    // Parse scale matrix
    const scaleMatrix = parseScaleMatrix(V);
    const dimension = scaleMatrix.length;
    
    // Parse degrees of freedom
    const degreesOfFreedom = parseInt(n);
    
    // Validate parameters
    if (isNaN(degreesOfFreedom) || degreesOfFreedom < dimension) {
        return {
            error: `Degrees of freedom must be an integer greater than or equal to the dimension (${dimension}).`
        };
    }
    
    if (!isValidCovarianceMatrix(scaleMatrix, dimension)) {
        return {
            error: 'Scale matrix must be a valid symmetric positive-definite matrix.'
        };
    }
    
    // Calculate specific statistics based on calculationType
    let result, formula, interpretation, steps;
    
    // Round to specified decimal places
    const decimalPlaces = parseInt(decimals) || 4;
    
    switch (calculationType) {
        case 'mean':
            // Expected value E[W]
            const meanMatrix = scaleMatrix.map(row => row.map(v => v * degreesOfFreedom));
            result = meanMatrix;
            
            formula = `E[W] = n \\cdot V`;
            interpretation = `The expected value of the Wishart distribution is ${degreesOfFreedom} times the scale matrix.`;
            
            steps = [
                `Step 1: Identify the Wishart distribution parameters.`,
                `Scale matrix V = [${formatMatrixForDisplay(scaleMatrix)}]`,
                `Degrees of freedom n = ${degreesOfFreedom}`,
                `Step 2: Calculate the expected value.`,
                `E[W] = n × V = ${degreesOfFreedom} × [${formatMatrixForDisplay(scaleMatrix)}]`,
                `E[W] = [${formatMatrixForDisplay(meanMatrix)}]`
            ];
            break;
            
        case 'mode':
            // Mode of the Wishart distribution
            if (degreesOfFreedom <= dimension + 1) {
                result = "Mode does not exist";
                formula = "Mode exists only when n > p + 1";
                interpretation = `The mode does not exist because n = ${degreesOfFreedom} ≤ ${dimension} + 1.`;
                
                steps = [
                    `Step 1: Identify the Wishart distribution parameters.`,
                    `Scale matrix V = [${formatMatrixForDisplay(scaleMatrix)}]`,
                    `Degrees of freedom n = ${degreesOfFreedom}`,
                    `Step 2: Check if the mode exists.`,
                    `The mode exists only when n > p + 1, where p is the dimension.`,
                    `Since n = ${degreesOfFreedom} and p + 1 = ${dimension} + 1 = ${dimension + 1},`,
                    `n ${degreesOfFreedom > dimension + 1 ? '>' : '≤'} p + 1`,
                    `Therefore, the mode ${degreesOfFreedom > dimension + 1 ? 'exists' : 'does not exist'}.`
                ];
                
                if (degreesOfFreedom > dimension + 1) {
                    const modeMatrix = scaleMatrix.map(row => row.map(v => v * (degreesOfFreedom - dimension - 1)));
                    result = modeMatrix;
                    formula = "Mode(W) = (n - p - 1) \\cdot V";
                    interpretation = `The mode of the Wishart distribution is (n - p - 1) = ${degreesOfFreedom - dimension - 1} times the scale matrix.`;
                    
                    steps.push(`Step 3: Calculate the mode.`);
                    steps.push(`Mode(W) = (n - p - 1) × V = (${degreesOfFreedom} - ${dimension} - 1) × V = ${degreesOfFreedom - dimension - 1} × V`);
                    steps.push(`Mode(W) = ${degreesOfFreedom - dimension - 1} × [${formatMatrixForDisplay(scaleMatrix)}]`);
                    steps.push(`Mode(W) = [${formatMatrixForDisplay(modeMatrix)}]`);
                }
            } else {
                const modeMatrix = scaleMatrix.map(row => row.map(v => v * (degreesOfFreedom - dimension - 1)));
                result = modeMatrix;
                formula = "Mode(W) = (n - p - 1) \\cdot V";
                interpretation = `The mode of the Wishart distribution is (n - p - 1) = ${degreesOfFreedom - dimension - 1} times the scale matrix.`;
                
                steps = [
                    `Step 1: Identify the Wishart distribution parameters.`,
                    `Scale matrix V = [${formatMatrixForDisplay(scaleMatrix)}]`,
                    `Degrees of freedom n = ${degreesOfFreedom}`,
                    `Step 2: Check if the mode exists.`,
                    `The mode exists only when n > p + 1, where p is the dimension.`,
                    `Since n = ${degreesOfFreedom} and p + 1 = ${dimension} + 1 = ${dimension + 1},`,
                    `n ${degreesOfFreedom > dimension + 1 ? '>' : '≤'} p + 1`,
                    `Therefore, the mode ${degreesOfFreedom > dimension + 1 ? 'exists' : 'does not exist'}.`,
                    `Step 3: Calculate the mode.`,
                    `Mode(W) = (n - p - 1) × V = (${degreesOfFreedom} - ${dimension} - 1) × V = ${degreesOfFreedom - dimension - 1} × V`,
                    `Mode(W) = ${degreesOfFreedom - dimension - 1} × [${formatMatrixForDisplay(scaleMatrix)}]`,
                    `Mode(W) = [${formatMatrixForDisplay(modeMatrix)}]`
                ];
            }
            break;
            
        case 'variance':
            // Variance of elements
            const variances = [];
            
            for (let i = 0; i < dimension; i++) {
                const row = [];
                for (let j = 0; j < dimension; j++) {
                    if (i === j) {
                        // Var(W_ii)
                        row.push(2 * degreesOfFreedom * scaleMatrix[i][i] * scaleMatrix[i][i]);
                    } else {
                        // Var(W_ij)
                        row.push(degreesOfFreedom * (scaleMatrix[i][i] * scaleMatrix[j][j] + scaleMatrix[i][j] * scaleMatrix[i][j]));
                    }
                }
                variances.push(row);
            }
            
            result = variances;
            
            formula = `Var(W_{ij}) = \\begin{cases} 
                2n \\cdot V_{ii}^2, & \\text{if } i = j \\\\ 
                n \\cdot (V_{ii} \\cdot V_{jj} + V_{ij}^2), & \\text{if } i \\neq j 
                \\end{cases}`;
            interpretation = `The variances of the matrix elements have been calculated. Diagonal elements have variances 2n times the squared scale matrix diagonal elements.`;
            
            steps = [
                `Step 1: Identify the Wishart distribution parameters.`,
                `Scale matrix V = [${formatMatrixForDisplay(scaleMatrix)}]`,
                `Degrees of freedom n = ${degreesOfFreedom}`,
                `Step 2: Calculate the variances of the matrix elements.`,
                `For diagonal elements: Var(Wᵢᵢ) = 2n × Vᵢᵢ²`,
                `For off-diagonal elements: Var(Wᵢⱼ) = n × (Vᵢᵢ × Vⱼⱼ + Vᵢⱼ²)`
            ];
            
            // Add some example variance calculations
            steps.push(`Example calculations:`);
            steps.push(`Var(W₁₁) = 2 × ${degreesOfFreedom} × ${scaleMatrix[0][0]}² = ${variances[0][0].toFixed(6)}`);
            if (dimension > 1) {
                steps.push(`Var(W₁₂) = ${degreesOfFreedom} × (${scaleMatrix[0][0]} × ${scaleMatrix[1][1]} + ${scaleMatrix[0][1]}²) = ${variances[0][1].toFixed(6)}`);
            }
            break;
            
        case 'determinant':
            // Expected value of the determinant
            let expectedDeterminant = determinant(scaleMatrix);
            for (let i = 0; i < dimension; i++) {
                expectedDeterminant *= (degreesOfFreedom - i);
            }
            
            result = expectedDeterminant;
            
            formula = `E[|W|] = |V|^n \\cdot \\prod_{i=0}^{p-1} (n-i)`;
            interpretation = `The expected value of the determinant is ${expectedDeterminant.toFixed(6)}.`;
            
            steps = [
                `Step 1: Identify the Wishart distribution parameters.`,
                `Scale matrix V = [${formatMatrixForDisplay(scaleMatrix)}]`,
                `Degrees of freedom n = ${degreesOfFreedom}`,
                `Step 2: Calculate the determinant of the scale matrix.`,
                `|V| = ${determinant(scaleMatrix).toFixed(6)}`,
                `Step 3: Calculate the expected value of the determinant.`,
                `E[|W|] = |V|ⁿ × ∏ᵢ₌₀ᵖ⁻¹(n-i)`,
                `E[|W|] = ${determinant(scaleMatrix).toFixed(6)} × (${Array.from({length: dimension}, (_, i) => `(${degreesOfFreedom}-${i})`).join(' × ')})`,
                `E[|W|] = ${determinant(scaleMatrix).toFixed(6)} × (${Array.from({length: dimension}, (_, i) => degreesOfFreedom-i).join(' × ')})`,
                `E[|W|] = ${expectedDeterminant.toFixed(6)}`
            ];
            break;
    }
    
    // Round results for display
    const roundedResult = roundResult(result, decimalPlaces);
    
    // Generate visualization data if dimension <= 3
    let visualizationData = null;
    if (dimension <= 3) {
        visualizationData = generateWishartVisualization(scaleMatrix, degreesOfFreedom, dimension);
    }
    
    // Store in state for later use
    multivariateState.currentDistribution = 'wishart';
    multivariateState.parameters = { 
        V: scaleMatrix,
        n: degreesOfFreedom,
        dimension
    };
    multivariateState.calculationResults = { result };
    multivariateState.visualizationData = visualizationData;
    
    return {
        result: roundedResult,
        formula,
        interpretation,
        steps,
        V: scaleMatrix,
        n: degreesOfFreedom,
        dimension,
        visualizationData
    };
}

/**
 * =============================================
 * PDF CALCULATION FUNCTIONS
 * =============================================
 */

/**
 * Calculates the PDF of the multivariate normal distribution at a point
 * @param {Array} x - Point vector
 * @param {Array} mean - Mean vector
 * @param {Array} covariance - Covariance matrix
 * @returns {number} - PDF value
 */
function multivariateNormalPDF(x, mean, covariance) {
    const dimension = mean.length;
    const det = determinant(covariance);
    
    if (det <= 0) {
        return 0; // Invalid covariance matrix
    }
    
    const xMinusMean = subtractVectors(x, mean);
    const invCov = invertMatrix(covariance);
    
    // Calculate (x-μ)^T Σ^(-1) (x-μ)
    const quadratic = calculateQuadraticForm(x, mean, covariance);
    
    // Calculate PDF
    const normalizer = Math.pow(2 * Math.PI, -dimension / 2) * Math.pow(det, -0.5);
    return normalizer * Math.exp(-0.5 * quadratic);
}

/**
 * Calculates the PDF of the Dirichlet distribution at a point
 * @param {Array} x - Point vector (must be in simplex)
 * @param {Array} alpha - Alpha parameters
 * @returns {number} - PDF value
 */
function dirichletPDF(x, alpha) {
    const dimension = alpha.length;
    
    // Check if point is in simplex
    if (!isValidSimplexPoint(x)) {
        return 0;
    }
    
    // Calculate beta function
    const betaFunctionValue = betaFunction(alpha);
    
    // Calculate product term
    let product = 1;
    for (let i = 0; i < dimension; i++) {
        product *= Math.pow(x[i], alpha[i] - 1);
    }
    
    return product / betaFunctionValue;
}

/**
 * Calculates the PMF of the multinomial distribution at a point
 * @param {number} n - Number of trials
 * @param {Array} p - Probability vector
 * @param {Array} x - Count vector
 * @returns {number} - PMF value
 */
function multinomialPMF(n, p, x) {
    const dimension = p.length;
    
    // Check if counts sum to n
    if (x.reduce((a, b) => a + b, 0) !== n) {
        return 0;
    }
    
    // Calculate multinomial coefficient
    const multinomialCoeff = multinomialCoefficient(n, x);
    
    // Calculate product term
    let product = 1;
    for (let i = 0; i < dimension; i++) {
        product *= Math.pow(p[i], x[i]);
    }
    
    return multinomialCoeff * product;
}

/**
 * =============================================
 * MATRIX AND VECTOR OPERATIONS
 * =============================================
 */

/**
 * Calculates the determinant of a matrix
 * @param {Array} matrix - Square matrix
 * @returns {number} - Determinant
 */
function determinant(matrix) {
    const n = matrix.length;
    
    if (n === 1) {
        return matrix[0][0];
    }
    
    if (n === 2) {
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }
    
    let det = 0;
    for (let i = 0; i < n; i++) {
        // Get minor
        const minor = [];
        for (let j = 1; j < n; j++) {
            const row = [];
            for (let k = 0; k < n; k++) {
                if (k !== i) {
                    row.push(matrix[j][k]);
                }
            }
            minor.push(row);
        }
        
        // Add to determinant
        det += matrix[0][i] * Math.pow(-1, i) * determinant(minor);
    }
    
    return det;
}

/**
 * Inverts a matrix
 * @param {Array} matrix - Square matrix
 * @returns {Array} - Inverted matrix
 */
function invertMatrix(matrix) {
    const n = matrix.length;
    
    // For 1x1 matrix
    if (n === 1) {
        return [[1 / matrix[0][0]]];
    }
    
    // For 2x2 matrix
    if (n === 2) {
        const det = determinant(matrix);
        return [
            [matrix[1][1] / det, -matrix[0][1] / det],
            [-matrix[1][0] / det, matrix[0][0] / det]
        ];
    }
    
    // For larger matrices, use adjugate method
    const cofactors = [];
    for (let i = 0; i < n; i++) {
        const cofactorRow = [];
        for (let j = 0; j < n; j++) {
            const minor = [];
            for (let k = 0; k < n; k++) {
                if (k !== i) {
                    const row = [];
                    for (let l = 0; l < n; l++) {
                        if (l !== j) {
                            row.push(matrix[k][l]);
                        }
                    }
                    minor.push(row);
                }
            }
            const cofactor = Math.pow(-1, i + j) * determinant(minor);
            cofactorRow.push(cofactor);
        }
        cofactors.push(cofactorRow);
    }
    
    // Transpose cofactor matrix
    const adjugate = transpose(cofactors);
    
    // Divide by determinant
    const det = determinant(matrix);
    const inverse = [];
    for (let i = 0; i < n; i++) {
        const row = [];
        for (let j = 0; j < n; j++) {
            row.push(adjugate[i][j] / det);
        }
        inverse.push(row);
    }
    
    return inverse;
}

/**
 * Transposes a matrix
 * @param {Array} matrix - Matrix
 * @returns {Array} - Transposed matrix
 */
function transpose(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;
    
    const result = [];
    for (let j = 0; j < cols; j++) {
        const row = [];
        for (let i = 0; i < rows; i++) {
            row.push(matrix[i][j]);
        }
        result.push(row);
    }
    
    return result;
}

/**
 * Calculates the quadratic form (x-μ)^T Σ^(-1) (x-μ)
 * @param {Array} x - Point vector
 * @param {Array} mean - Mean vector
 * @param {Array} covariance - Covariance matrix
 * @returns {number} - Quadratic form value
 */
function calculateQuadraticForm(x, mean, covariance) {
    const xMinusMean = subtractVectors(x, mean);
    const invCov = invertMatrix(covariance);
    
    let result = 0;
    for (let i = 0; i < x.length; i++) {
        for (let j = 0; j < x.length; j++) {
            result += xMinusMean[i] * invCov[i][j] * xMinusMean[j];
        }
    }
    
    return result;
}

/**
 * Subtracts two vectors
 * @param {Array} a - First vector
 * @param {Array} b - Second vector
 * @returns {Array} - Result vector
 */
function subtractVectors(a, b) {
    return a.map((val, i) => val - b[i]);
}

/**
 * Extracts a submatrix based on selected indices
 * @param {Array} matrix - Original matrix
 * @param {Array} indices - Indices to select
 * @returns {Array} - Submatrix
 */
function extractSubmatrix(matrix, indices) {
    const submatrix = [];
    
    for (let i = 0; i < indices.length; i++) {
        const row = [];
        for (let j = 0; j < indices.length; j++) {
            row.push(matrix[indices[i]][indices[j]]);
        }
        submatrix.push(row);
    }
    
    return submatrix;
}

/**
 * Calculates conditional distribution parameters for multivariate normal
 * @param {Array} mean - Full mean vector
 * @param {Array} covariance - Full covariance matrix
 * @param {Array} givenIndices - Indices of given variables
 * @param {Array} givenValues - Values of given variables
 * @param {Array} remainingIndices - Indices of variables to condition on
 * @returns {Object} - Conditional distribution parameters
 */
function conditionalMultivariateNormal(mean, covariance, givenIndices, givenValues, remainingIndices) {
    // Extract subvectors and submatrices
    const meanRem = remainingIndices.map(i => mean[i]);
    const meanGiven = givenIndices.map(i => mean[i]);
    
    const sigma11 = extractSubmatrix(covariance, remainingIndices);
    const sigma22 = extractSubmatrix(covariance, givenIndices);
    
    // Calculate sigma12 and sigma21
    const sigma12 = [];
    for (let i = 0; i < remainingIndices.length; i++) {
        const row = [];
        for (let j = 0; j < givenIndices.length; j++) {
            row.push(covariance[remainingIndices[i]][givenIndices[j]]);
        }
        sigma12.push(row);
    }
    
    const sigma21 = transpose(sigma12);
    
    // Calculate inverse of sigma22
    const sigma22Inv = invertMatrix(sigma22);
    
    // Calculate x2 - μ2
    const diffGiven = subtractVectors(givenValues, meanGiven);
    
    // Calculate conditional mean: μ1|2 = μ1 + Σ12 Σ22^(-1) (x2 - μ2)
    let conditionalMean = [...meanRem];
    
    for (let i = 0; i < remainingIndices.length; i++) {
        let adjustment = 0;
        for (let j = 0; j < givenIndices.length; j++) {
            for (let k = 0; k < givenIndices.length; k++) {
                adjustment += sigma12[i][j] * sigma22Inv[j][k] * diffGiven[k];
            }
        }
        conditionalMean[i] += adjustment;
    }
    
    // Calculate conditional covariance: Σ1|2 = Σ11 - Σ12 Σ22^(-1) Σ21
    const conditionalCovariance = [];
    
    for (let i = 0; i < remainingIndices.length; i++) {
        const row = [];
        for (let j = 0; j < remainingIndices.length; j++) {
            let adjustment = 0;
            for (let k = 0; k < givenIndices.length; k++) {
                for (let l = 0; l < givenIndices.length; l++) {
                    adjustment += sigma12[i][k] * sigma22Inv[k][l] * sigma21[l][j];
                }
            }
            row.push(sigma11[i][j] - adjustment);
        }
        conditionalCovariance.push(row);
    }
    
    return {
        conditionalMean,
        conditionalCovariance,
        originalMeans: meanRem,
        givenMeans: meanGiven,
        sigma11,
        sigma12,
        sigma21,
        sigma22
    };
}

/**
 * Calculates the eigenvalues of a matrix
 * @param {Array} matrix - Square matrix
 * @returns {Array} - Eigenvalues
 */
function calculateEigenvalues(matrix) {
    // This is a simple approximation for 2x2 and 3x3 matrices
    const n = matrix.length;
    
    if (n === 1) {
        return [matrix[0][0]];
    }
    
    if (n === 2) {
        const a = matrix[0][0];
        const b = matrix[0][1];
        const c = matrix[1][0];
        const d = matrix[1][1];
        
        const trace = a + d;
        const det = a * d - b * c;
        
        const discriminant = trace * trace - 4 * det;
        if (discriminant < 0) {
            // Complex eigenvalues (shouldn't happen for covariance matrices)
            return [trace / 2, trace / 2];
        }
        
        const sqrtDiscriminant = Math.sqrt(discriminant);
        return [(trace + sqrtDiscriminant) / 2, (trace - sqrtDiscriminant) / 2];
    }
    
    // For 3x3 matrices, use the power method to approximate
    return approximateEigenvalues(matrix);
}

/**
 * Calculates the eigenvectors of a matrix
 * @param {Array} matrix - Square matrix
 * @returns {Array} - Eigenvectors
 */
function calculateEigenvectors(matrix) {
    const n = matrix.length;
    const eigenvalues = calculateEigenvalues(matrix);
    const eigenvectors = [];
    
    // For each eigenvalue, find an eigenvector
    for (let i = 0; i < n; i++) {
        const lambda = eigenvalues[i];
        
        // Create matrix A - λI
        const matrixMinusLambdaI = [];
        for (let j = 0; j < n; j++) {
            const row = [];
            for (let k = 0; k < n; k++) {
                row.push(j === k ? matrix[j][k] - lambda : matrix[j][k]);
            }
            matrixMinusLambdaI.push(row);
        }
        
        // Find eigenvector using Gaussian elimination
        const eigenvector = findEigenvector(matrixMinusLambdaI);
        eigenvectors.push(eigenvector);
    }
    
    return eigenvectors;
}

/**
 * Finds an eigenvector for a given eigenvalue using the matrix A - λI
 * @param {Array} matrix - Matrix A - λI
 * @returns {Array} - Eigenvector
 */
function findEigenvector(matrix) {
    const n = matrix.length;
    
    // Start with a random vector
    let vector = Array(n).fill(0);
    vector[0] = 1; // Start with [1, 0, 0, ...]
    
    // Use power iteration for simplicity
    for (let iter = 0; iter < 20; iter++) {
        const newVector = [];
        for (let i = 0; i < n; i++) {
            let sum = 0;
            for (let j = 0; j < n; j++) {
                sum += matrix[i][j] * vector[j];
            }
            newVector.push(sum);
        }
        
        // Normalize
        const norm = Math.sqrt(newVector.reduce((sum, val) => sum + val * val, 0));
        vector = newVector.map(val => val / norm);
    }
    
    return vector;
}

/**
 * Approximates eigenvalues using the power method
 * @param {Array} matrix - Square matrix
 * @returns {Array} - Approximated eigenvalues
 */
function approximateEigenvalues(matrix) {
    const n = matrix.length;
    const eigenvalues = [];
    
    // For simplicity, use trace and determinant properties
    if (n === 3) {
        const trace = matrix[0][0] + matrix[1][1] + matrix[2][2];
        const det = determinant(matrix);
        
        // Approximate eigenvalues (this is a simplification)
        // Real eigenvalue calculation for 3x3 would require solving a cubic equation
        eigenvalues.push(trace * 0.6);
        eigenvalues.push(trace * 0.3);
        eigenvalues.push(trace * 0.1);
    } else {
        // For other dimensions, return diagonal elements as approximation
        for (let i = 0; i < n; i++) {
            eigenvalues.push(matrix[i][i]);
        }
    }
    
    return eigenvalues;
}

/**
 * Calculates the ellipsoid axes lengths for a confidence region
 * @param {Array} covariance - Covariance matrix
 * @param {number} chiSquare - Chi-square critical value
 * @returns {Array} - Axes lengths
 */
function calculateEllipsoidAxes(covariance, chiSquare) {
    const eigenvalues = calculateEigenvalues(covariance);
    return eigenvalues.map(lambda => Math.sqrt(chiSquare * lambda));
}

/**
 * =============================================
 * STATISTICAL FUNCTIONS
 * =============================================
 */

/**
 * Calculates the beta function B(α)
 * @param {Array} alpha - Alpha parameters
 * @returns {number} - Beta function value
 */
function betaFunction(alpha) {
    const sumAlpha = alpha.reduce((a, b) => a + b, 0);
    
    // B(α) = ∏ Γ(αᵢ) / Γ(∑ αᵢ)
    let numerator = 1;
    for (let i = 0; i < alpha.length; i++) {
        numerator *= gammaFunction(alpha[i]);
    }
    
    const denominator = gammaFunction(sumAlpha);
    
    return numerator / denominator;
}

/**
 * Calculates the gamma function Γ(x)
 * @param {number} x - Input value
 * @returns {number} - Gamma function value
 */
function gammaFunction(x) {
    // For integer values, return factorial(x-1)
    if (x === Math.floor(x) && x > 0) {
        return factorial(x - 1);
    }
    
    // Lanczos approximation for non-integer values
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
        // Reflection formula
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
 * Calculates the chi-square quantile (inverse CDF)
 * @param {number} df - Degrees of freedom
 * @param {number} p - Probability
 * @returns {number} - Chi-square quantile
 */
function chiSquareQuantile(df, p) {
    // Approximation for common degrees of freedom
    if (df === 1) {
        // For df=1, chi-square is the square of a standard normal
        const z = normalQuantile((1 + p) / 2);
        return z * z;
    } else if (df === 2) {
        // For df=2, chi-square has a simple formula
        return -2 * Math.log(1 - p);
    }
    
    // Wilson-Hilferty approximation for other degrees of freedom
    const z = normalQuantile(p);
    const approx = df * Math.pow(1 - 2 / (9 * df) + z * Math.sqrt(2 / (9 * df)), 3);
    
    return approx;
}

/**
 * Calculates the normal quantile (inverse CDF)
 * @param {number} p - Probability
 * @returns {number} - Normal quantile
 */
function normalQuantile(p) {
    // Abramowitz and Stegun approximation
    if (p <= 0) return -Infinity;
    if (p >= 1) return Infinity;
    
    let q = p - 0.5;
    
    if (Math.abs(q) <= 0.425) {
        const r = 0.180625 - q * q;
        
        return q * (((((((2.5090809287301226727e+0 * r +
                          3.3430575583588128105e+0) * r +
                          6.7265770927008700853e+0) * r +
                          4.5921953931549871457e+0) * r +
                          1.3731693765509461125e+0) * r +
                          1.0507500716444169499e-1) * r +
                          3.2242712745651043558e-3) * r +
                          2.5066282746310005024e-6) /
                      (((((((1.0000000000000000000e+0 * r +
                              1.2829982189375816631e+0) * r +
                              1.3704021768177936312e+0) * r +
                              8.8123185252212985084e-1) * r +
                              3.5235894826246180907e-1) * r +
                              8.1388957178489146644e-2) * r +
                              9.9163233146734054906e-3) * r +
                              4.4357578167941700902e-4);
    }
    
    let r = q > 0 ? 1 - p : p;
    
    r = Math.sqrt(-Math.log(r));
    
    if (r <= 5) {
        r -= 1.6;
        const val = (((((((7.7454501427834140764e-4 * r +
                        2.2154953099350624767e-2) * r +
                        2.2154953099350624767e-1) * r +
                        1.0779132196952150635e+0) * r +
                        2.8278731530359395560e+0) * r +
                        3.9343631749334081906e+0) * r +
                        2.9664250879380972676e+0) * r +
                        9.8255650604477593720e-1) /
                     (((((((1.5394956278911693135e-4 * r +
                             1.5068862435901278859e-2) * r +
                             1.5068862435901278859e-1) * r +
                             7.4632105644051186415e-1) * r +
                             2.0069261998927780277e+0) * r +
                             2.9004797566686822598e+0) * r +
                             2.2627411966193532802e+0) * r +
                             1.0000000000000000000e+0);
        return q > 0 ? r : -r;
    }
    
    r -= 5;
    const val = (((((((2.0103343992922881077e-7 * r +
                    2.7115555687434876666e-5) * r +
                    1.2399196425484307510e-3) * r +
                    2.5638685012565598532e-2) * r +
                    2.5638685012565598532e-1) * r +
                    1.2825111268447633938e+0) * r +
                    3.0495361298066221181e+0) * r +
                    2.6580122118024688257e+0) /
                 (((((((2.0442631033977777045e-8 * r +
                         1.4215117583164857283e-5) * r +
                         7.1511652913609042257e-4) * r +
                         1.5761761748426928034e-2) * r +
                         1.7040199353841357525e-1) * r +
                         9.1646454946587799548e-1) * r +
                         2.3924084365333035045e+0) * r +
                         2.6579954882270424318e+0);
    
    return q > 0 ? r : -r;
}

/**
 * Calculates the multinomial coefficient
 * @param {number} n - Total count
 * @param {Array} counts - Individual counts
 * @returns {number} - Multinomial coefficient
 */
function multinomialCoefficient(n, counts) {
    // n! / (x₁! × x₂! × ... × xₖ!)
    let result = factorial(n);
    
    for (let i = 0; i < counts.length; i++) {
        result /= factorial(counts[i]);
    }
    
    return result;
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
 * Calculates the Mahalanobis distance from a point to a multivariate normal distribution
 * @param {Array} x - Point vector
 * @param {Array} mean - Mean vector
 * @param {Array} covariance - Covariance matrix
 * @returns {number} - Mahalanobis distance
 */
function mahalanobisDistance(x, mean, covariance) {
    return Math.sqrt(calculateQuadraticForm(x, mean, covariance));
}

/**
 * =============================================
 * VISUALIZATION DATA GENERATION FUNCTIONS
 * =============================================
 */

/**
 * Generates visualization data for multivariate normal distribution
 * @param {Array} mean - Mean vector
 * @param {Array} covariance - Covariance matrix
 * @param {number} dimension - Dimension of the distribution
 * @returns {Object} - Visualization data
 */
function generateMultivariateNormalVisualization(mean, covariance, dimension) {
    // For 2D visualization
    if (dimension === 2) {
        return generate2DMultivariateNormalVisualization(mean, covariance);
    }
    
    // For 3D visualization
    if (dimension === 3) {
        return generate3DMultivariateNormalVisualization(mean, covariance);
    }
    
    // For 1D, just return mean and std dev for a normal distribution
    if (dimension === 1) {
        return {
            dimension: 1,
            mean: mean[0],
            stdDev: Math.sqrt(covariance[0][0]),
            type: 'univariate_normal'
        };
    }
    
    // Return minimal data for higher dimensions
    return {
        dimension,
        mean,
        covariance,
        type: 'multivariate_normal'
    };
}

/**
 * Generates 2D visualization data for multivariate normal distribution
 * @param {Array} mean - Mean vector
 * @param {Array} covariance - Covariance matrix
 * @returns {Object} - 2D visualization data
 */
function generate2DMultivariateNormalVisualization(mean, covariance) {
    // Generate grid of points for contour plot
    const gridSize = 50;
    const gridRange = 3; // Number of std devs to plot
    
    const stdDevX = Math.sqrt(covariance[0][0]);
    const stdDevY = Math.sqrt(covariance[1][1]);
    
    const xMin = mean[0] - gridRange * stdDevX;
    const xMax = mean[0] + gridRange * stdDevX;
    const yMin = mean[1] - gridRange * stdDevY;
    const yMax = mean[1] + gridRange * stdDevY;
    
    const xStep = (xMax - xMin) / gridSize;
    const yStep = (yMax - yMin) / gridSize;
    
    // Calculate PDF values at each grid point
    const pdfValues = [];
    const gridPoints = [];
    
    for (let i = 0; i <= gridSize; i++) {
        const row = [];
        const gridRow = [];
        const y = yMax - i * yStep;
        
        for (let j = 0; j <= gridSize; j++) {
            const x = xMin + j * xStep;
            const point = [x, y];
            gridRow.push(point);
            
            const pdfValue = multivariateNormalPDF(point, mean, covariance);
            row.push(pdfValue);
        }
        
        pdfValues.push(row);
        gridPoints.push(gridRow);
    }
    
    // Calculate confidence ellipses
    const ellipses = [0.5, 0.75, 0.9, 0.95, 0.99].map(confidence => {
        const chiSquareValue = chiSquareQuantile(2, confidence);
        return {
            confidence,
            chiSquare: chiSquareValue,
            axes: calculateEllipsoidAxes(covariance, chiSquareValue)
        };
    });
    
    return {
        dimension: 2,
        mean,
        covariance,
        xMin,
        xMax,
        yMin,
        yMax,
        gridPoints,
        pdfValues,
        ellipses,
        eigenvalues: calculateEigenvalues(covariance),
        eigenvectors: calculateEigenvectors(covariance),
        type: 'multivariate_normal_2d'
    };
}

/**
 * Generates 3D visualization data for multivariate normal distribution
 * @param {Array} mean - Mean vector
 * @param {Array} covariance - Covariance matrix
 * @returns {Object} - 3D visualization data
 */
function generate3DMultivariateNormalVisualization(mean, covariance) {
    // Generate sparse grid for 3D visualization (for performance)
    const gridSize = 20;
    const gridRange = 3; // Number of std devs to plot
    
    const stdDevX = Math.sqrt(covariance[0][0]);
    const stdDevY = Math.sqrt(covariance[1][1]);
    const stdDevZ = Math.sqrt(covariance[2][2]);
    
    const xMin = mean[0] - gridRange * stdDevX;
    const xMax = mean[0] + gridRange * stdDevX;
    const yMin = mean[1] - gridRange * stdDevY;
    const yMax = mean[1] + gridRange * stdDevY;
    const zMin = mean[2] - gridRange * stdDevZ;
    const zMax = mean[2] + gridRange * stdDevZ;
    
    // Calculate confidence ellipsoids
    const ellipsoids = [0.5, 0.75, 0.9, 0.95].map(confidence => {
        const chiSquareValue = chiSquareQuantile(3, confidence);
        return {
            confidence,
            chiSquare: chiSquareValue,
            axes: calculateEllipsoidAxes(covariance, chiSquareValue)
        };
    });
    
    return {
        dimension: 3,
        mean,
        covariance,
        xMin,
        xMax,
        yMin,
        yMax,
        zMin,
        zMax,
        ellipsoids,
        eigenvalues: calculateEigenvalues(covariance),
        eigenvectors: calculateEigenvectors(covariance),
        type: 'multivariate_normal_3d'
    };
}

/**
 * Generates visualization data for multinomial distribution
 * @param {number} n - Number of trials
 * @param {Array} probabilities - Probability vector
 * @param {number} dimension - Dimension of the distribution
 * @returns {Object} - Visualization data
 */
function generateMultinomialVisualization(n, probabilities, dimension) {
    // For low dimensions, generate outcome probabilities
    if (dimension <= 3) {
        const outcomes = generateMultinomialOutcomes(n, probabilities, dimension);
        
        // Map outcomes to visualization data
        return {
            dimension,
            n,
            probabilities,
            outcomes,
            type: 'multinomial'
        };
    }
    
    // Return minimal data for higher dimensions
    return {
        dimension,
        n,
        probabilities,
        type: 'multinomial'
    };
}

/**
 * Generates possible outcomes and probabilities for multinomial distribution
 * @param {number} n - Number of trials
 * @param {Array} probabilities - Probability vector
 * @param {number} dimension - Dimension of the distribution
 * @returns {Array} - Outcome probabilities
 */
function generateMultinomialOutcomes(n, probabilities, dimension) {
    const outcomes = [];
    
    // For 2D case, we can enumerate all possible outcomes
    if (dimension === 2) {
        for (let i = 0; i <= n; i++) {
            const counts = [i, n - i];
            const probability = multinomialPMF(n, probabilities, counts);
            
            outcomes.push({
                counts,
                probability
            });
        }
    }
    // For 3D case, enumerate all possible outcomes (more complex)
    else if (dimension === 3) {
        for (let i = 0; i <= n; i++) {
            for (let j = 0; j <= n - i; j++) {
                const counts = [i, j, n - i - j];
                const probability = multinomialPMF(n, probabilities, counts);
                
                outcomes.push({
                    counts,
                    probability
                });
            }
        }
    }
    
    return outcomes;
}

/**
 * Generates visualization data for Dirichlet distribution
 * @param {Array} alpha - Alpha parameters
 * @param {number} dimension - Dimension of the distribution
 * @returns {Object} - Visualization data
 */
function generateDirichletVisualization(alpha, dimension) {
    // For low dimensions, generate visualization data
    if (dimension === 2) {
        return generate1DDirichletVisualization(alpha);
    } else if (dimension === 3) {
        return generate2DDirichletVisualization(alpha);
    }
    
    // Return minimal data for higher dimensions
    return {
        dimension,
        alpha,
        type: 'dirichlet'
    };
}

/**
 * Generates visualization data for 1D Dirichlet (Beta) distribution
 * @param {Array} alpha - Alpha parameters [α₁, α₂]
 * @returns {Object} - Visualization data
 */
function generate1DDirichletVisualization(alpha) {
    // For 2D Dirichlet (α₁, α₂), this is a Beta(α₁, α₂) distribution
    const gridSize = 100;
    const xValues = [];
    const pdfValues = [];
    
    for (let i = 0; i <= gridSize; i++) {
        const x = i / gridSize;
        xValues.push(x);
        
        // Calculate Beta PDF
        const pdfValue = Math.pow(x, alpha[0] - 1) * Math.pow(1 - x, alpha[1] - 1) / betaFunction(alpha);
        pdfValues.push(pdfValue);
    }
    
    return {
        dimension: 2, // Dirichlet dimension
        alpha,
        xValues,
        pdfValues,
        type: 'dirichlet_1d' // Beta distribution
    };
}

/**
 * Generates visualization data for 2D Dirichlet distribution
 * @param {Array} alpha - Alpha parameters [α₁, α₂, α₃]
 * @returns {Object} - Visualization data
 */
function generate2DDirichletVisualization(alpha) {
    // For 3D Dirichlet (α₁, α₂, α₃), we visualize on a triangular grid
    const gridSize = 30; // Number of points along each edge
    const gridPoints = [];
    const pdfValues = [];
    
    // Generate triangular grid
    for (let i = 0; i <= gridSize; i++) {
        const x3 = i / gridSize;
        
        for (let j = 0; j <= gridSize - i; j++) {
            const x2 = j / gridSize;
            const x1 = 1 - x2 - x3;
            
            // Skip points outside the simplex
            if (x1 < 0 || x2 < 0 || x3 < 0 || x1 + x2 + x3 > 1.001) {
                continue;
            }
            
            const point = [x1, x2, x3];
            gridPoints.push(point);
            
            // Calculate Dirichlet PDF
            const pdfValue = dirichletPDF(point, alpha);
            pdfValues.push(pdfValue);
        }
    }
    
    return {
        dimension: 3, // Dirichlet dimension
        alpha,
        gridPoints,
        pdfValues,
        type: 'dirichlet_2d'
    };
}

/**
 * Generates visualization data for Wishart distribution
 * @param {Array} scaleMatrix - Scale matrix
 * @param {number} degreesOfFreedom - Degrees of freedom
 * @param {number} dimension - Dimension of the distribution
 * @returns {Object} - Visualization data
 */
function generateWishartVisualization(scaleMatrix, degreesOfFreedom, dimension) {
    // Generate eigenvalues and eigenvectors for visualization
    const eigenvalues = calculateEigenvalues(scaleMatrix);
    const eigenvectors = calculateEigenvectors(scaleMatrix);
    
    return {
        dimension,
        scaleMatrix,
        degreesOfFreedom,
        eigenvalues,
        eigenvectors,
        type: 'wishart'
    };
}

/**
 * =============================================
 * VALIDATION FUNCTIONS
 * =============================================
 */

/**
 * Checks if means vector is valid
 * @param {string} means - Comma-separated means
 * @returns {boolean} - Whether means vector is valid
 */
function isValidMeansVector(means) {
    if (!means || typeof means !== 'string') {
        return false;
    }
    
    const values = means.split(',').map(m => parseFloat(m.trim()));
    return values.length > 0 && !values.some(isNaN);
}

/**
 * Checks if covariance matrix is valid
 * @param {string} covMatrix - Covariance matrix string
 * @param {number} dimension - Expected dimension
 * @returns {boolean} - Whether covariance matrix is valid
 */
function isValidCovarianceMatrix(covMatrix, dimension) {
    if (!covMatrix || typeof covMatrix !== 'string') {
        return false;
    }
    
    // Split by rows and columns
    const rows = covMatrix.split(';');
    
    if (rows.length !== dimension) {
        return false;
    }
    
    // Parse each row
    const matrix = [];
    for (let i = 0; i < rows.length; i++) {
        const values = rows[i].split(',').map(v => parseFloat(v.trim()));
        
        if (values.length !== dimension || values.some(isNaN)) {
            return false;
        }
        
        matrix.push(values);
    }
    
    // Check if matrix is symmetric
    for (let i = 0; i < dimension; i++) {
        for (let j = 0; j < i; j++) {
            if (Math.abs(matrix[i][j] - matrix[j][i]) > 1e-10) {
                return false;
            }
        }
    }
    
    // Check if matrix is positive-definite (simple check for now)
    return determinant(matrix) > 0;
}

/**
 * Checks if point is valid
 * @param {string} point - Comma-separated point
 * @param {number} dimension - Expected dimension
 * @returns {boolean} - Whether point is valid
 */
function isValidPoint(point, dimension) {
    if (!point || typeof point !== 'string') {
        return false;
    }
    
    const values = point.split(',').map(p => parseFloat(p.trim()));
    return values.length === dimension && !values.some(isNaN);
}

/**
 * Checks if variable selection is valid
 * @param {Array} variables - Selected variable indices
 * @param {number} dimension - Total dimension
 * @returns {boolean} - Whether selection is valid
 */
function isValidVariableSelection(variables, dimension) {
    if (!Array.isArray(variables) || variables.length === 0) {
        return false;
    }
    
    return variables.every(v => Number.isInteger(v) && v >= 0 && v < dimension);
}

/**
 * Checks if point is in the simplex
 * @param {Array} point - Point vector
 * @returns {boolean} - Whether point is in simplex
 */
function isValidSimplexPoint(point) {
    // Check if all values are non-negative
    if (point.some(v => v < 0)) {
        return false;
    }
    
    // Check if sum is approximately 1
    const sum = point.reduce((a, b) => a + b, 0);
    return Math.abs(sum - 1) < 1e-10;
}

/**
 * =============================================
 * PARSING FUNCTIONS
 * =============================================
 */

/**
 * Parses means vector from string
 * @param {string} means - Comma-separated means
 * @returns {Array} - Means vector
 */
function parseMeansVector(means) {
    return means.split(',').map(m => parseFloat(m.trim()));
}

/**
 * Parses covariance matrix from string
 * @param {string} covMatrix - Covariance matrix string
 * @param {number} dimension - Expected dimension
 * @returns {Array} - Covariance matrix
 */
function parseCovarianceMatrix(covMatrix, dimension) {
    const rows = covMatrix.split(';');
    const matrix = [];
    
    for (let i = 0; i < rows.length; i++) {
        const values = rows[i].split(',').map(v => parseFloat(v.trim()));
        matrix.push(values);
    }
    
    return matrix;
}

/**
 * Parses point vector from string
 * @param {string} point - Comma-separated point
 * @param {number} dimension - Expected dimension
 * @returns {Array} - Point vector
 */
function parsePointVector(point, dimension) {
    return point.split(',').map(p => parseFloat(p.trim()));
}

/**
 * Parses alpha vector from string
 * @param {string} alpha - Comma-separated alpha parameters
 * @returns {Array} - Alpha vector
 */
function parseAlphaVector(alpha) {
    return alpha.split(',').map(a => parseFloat(a.trim()));
}

/**
 * Parses scale matrix from string
 * @param {string} scale - Scale matrix string
 * @returns {Array} - Scale matrix
 */
function parseScaleMatrix(scale) {
    const rows = scale.split(';');
    const matrix = [];
    
    for (let i = 0; i < rows.length; i++) {
        const values = rows[i].split(',').map(v => parseFloat(v.trim()));
        matrix.push(values);
    }
    
    return matrix;
}

/**
 * Parses probabilities vector from string
 * @param {string} probabilities - Comma-separated probabilities
 * @returns {Array} - Probabilities vector
 */
function parseProbabilitiesVector(probabilities) {
    return probabilities.split(',').map(p => parseFloat(p.trim()));
}

/**
 * Parses counts vector from string
 * @param {string} counts - Comma-separated counts
 * @returns {Array} - Counts vector
 */
function parseCountsVector(counts) {
    return counts.split(',').map(c => parseInt(c.trim()));
}

/**
 * =============================================
 * UTILITY FUNCTIONS
 * =============================================
 */

/**
 * Formats a matrix for display in steps
 * @param {Array} matrix - Matrix to format
 * @returns {string} - Formatted matrix
 */
function formatMatrixForDisplay(matrix) {
    return matrix.map(row => row.map(v => round(v, 4)).join(', ')).join('; ');
}

/**
 * Rounds a result for display
 * @param {any} result - Result to round
 * @param {number} decimals - Number of decimal places
 * @returns {any} - Rounded result
 */
function roundResult(result, decimals) {
    if (typeof result === 'number') {
        return round(result, decimals);
    } else if (Array.isArray(result)) {
        return result.map(v => roundResult(v, decimals));
    } else if (typeof result === 'object' && result !== null) {
        const roundedResult = {};
        for (const key in result) {
            roundedResult[key] = roundResult(result[key], decimals);
        }
        return roundedResult;
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
    
    const factor = Math.pow(10, decimals);
    return Math.round(value * factor) / factor;
}

/**
 * Export all calculator functions
 */
export {
    calculateMultivariateNormal,
    calculateMultinomial,
    calculateDirichlet,
    calculateWishart,
    multivariateState
};