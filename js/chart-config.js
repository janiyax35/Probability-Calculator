/**
 * Random Variables & Probability Distributions
 * Chart Configuration JavaScript File
 * Created by Janith Deshan
 */

// Global chart settings for dark theme
const CHART_COLORS = {
    primary: '#8AB4F8',
    secondary: '#BB86FC',
    accent: '#03DAC6',
    error: '#CF6679',
    success: '#00E676',
    warning: '#FFD600',
    background: '#1E1E1E',
    surface: '#2D2D2D',
    grid: '#333333',
    text: '#FFFFFF',
    textSecondary: '#B3B3B3'
};

// Common chart options to maintain consistent styling
const COMMON_CHART_OPTIONS = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
        duration: 1000,
        easing: 'easeOutQuart'
    },
    plugins: {
        legend: {
            labels: {
                color: CHART_COLORS.text,
                font: {
                    family: "'Open Sans', sans-serif",
                    size: 12
                }
            }
        },
        tooltip: {
            backgroundColor: CHART_COLORS.surface,
            titleColor: CHART_COLORS.text,
            bodyColor: CHART_COLORS.textSecondary,
            borderColor: CHART_COLORS.grid,
            borderWidth: 1,
            padding: 10,
            displayColors: true,
            boxPadding: 3,
            titleFont: {
                size: 14,
                weight: 'bold'
            },
            bodyFont: {
                size: 12
            },
            callbacks: {
                // Custom tooltip callbacks can be added here
            }
        }
    },
    scales: {
        x: {
            grid: {
                color: CHART_COLORS.grid,
                borderColor: CHART_COLORS.grid,
                tickColor: CHART_COLORS.grid
            },
            ticks: {
                color: CHART_COLORS.textSecondary,
                font: {
                    family: "'Open Sans', sans-serif",
                    size: 11
                }
            }
        },
        y: {
            grid: {
                color: CHART_COLORS.grid,
                borderColor: CHART_COLORS.grid,
                tickColor: CHART_COLORS.grid
            },
            ticks: {
                color: CHART_COLORS.textSecondary,
                font: {
                    family: "'Open Sans', sans-serif",
                    size: 11
                }
            }
        }
    }
};

/**
 * Initialize a probability distribution chart
 * @param {string} canvasId - ID of the canvas element
 * @param {string} chartType - Type of chart (bar, line, etc.)
 * @param {Object} customOptions - Custom chart options
 * @returns {Chart} The created Chart.js instance
 */
function initDistributionChart(canvasId, chartType = 'bar', customOptions = {}) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    
    const ctx = canvas.getContext('2d');
    
    // Merge common options with custom options
    const options = deepMerge(COMMON_CHART_OPTIONS, customOptions);
    
    // Create an empty chart that will be populated later
    const chart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: [],
            datasets: [{
                label: 'Distribution',
                data: [],
                backgroundColor: CHART_COLORS.primary,
                borderColor: CHART_COLORS.primary,
                borderWidth: 1
            }]
        },
        options: options
    });
    
    // Store the chart instance on the canvas for easy access
    canvas.chart = chart;
    
    return chart;
}

/**
 * Update a binomial distribution chart
 * @param {Chart} chart - The Chart.js instance
 * @param {number} n - Number of trials
 * @param {number} p - Probability of success
 * @param {number} highlightK - Value of k to highlight (optional)
 * @param {string} calculationType - Type of calculation (exact, cumulative-less, cumulative-greater)
 */
function updateBinomialChart(chart, n, p, highlightK = null, calculationType = 'exact') {
    if (!chart) return;
    
    // Generate x-axis values (0 to n)
    const labels = Array.from({length: n + 1}, (_, i) => i);
    
    // Calculate PMF values for each k
    const pmfValues = labels.map(k => binomialPMF(n, p, k));
    
    // Create background colors array, highlighting the specified k if provided
    const backgroundColors = labels.map(k => 
        k === highlightK ? CHART_COLORS.accent : CHART_COLORS.primary
    );
    
    // For cumulative distributions, we need to modify the data
    let dataValues = pmfValues;
    let chartTitle = `Binomial PMF (n=${n}, p=${p.toFixed(2)})`;
    
    if (calculationType === 'cumulative-less') {
        // For P(X ≤ k), we calculate cumulative probabilities
        dataValues = labels.map(k => {
            // Sum all PMF values from 0 to k
            return labels.slice(0, k + 1).reduce((sum, i) => sum + pmfValues[i], 0);
        });
        
        // Update chart type to line for CDF
        chart.config.type = 'line';
        chartTitle = `Binomial CDF (n=${n}, p=${p.toFixed(2)})`;
        
        // Highlight area under the curve up to highlightK
        if (highlightK !== null) {
            chart.data.datasets = [
                {
                    label: 'CDF',
                    data: dataValues,
                    borderColor: CHART_COLORS.primary,
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    pointBackgroundColor: labels.map(k => 
                        k === highlightK ? CHART_COLORS.accent : CHART_COLORS.primary
                    ),
                    pointBorderColor: labels.map(k => 
                        k === highlightK ? CHART_COLORS.accent : CHART_COLORS.primary
                    ),
                    pointRadius: labels.map(k => 
                        k === highlightK ? 6 : 3
                    ),
                    tension: 0.1
                }
            ];
            
            // Add fill area if highlighting
            if (highlightK >= 0) {
                chart.data.datasets.unshift({
                    label: `P(X ≤ ${highlightK})`,
                    data: dataValues.map((v, i) => i <= highlightK ? v : null),
                    backgroundColor: `${CHART_COLORS.accent}33`, // Add transparency
                    borderWidth: 0,
                    pointRadius: 0,
                    fill: true
                });
            }
        }
    } else if (calculationType === 'cumulative-greater') {
        // For P(X ≥ k), we calculate 1 - CDF(k-1)
        dataValues = labels.map(k => {
            // For k=0, the probability is 1
            if (k === 0) return 1;
            
            // Calculate P(X < k) and subtract from 1
            const pLessThan = labels.slice(0, k).reduce((sum, i) => sum + pmfValues[i], 0);
            return 1 - pLessThan;
        });
        
        // Update chart type to line for complementary CDF
        chart.config.type = 'line';
        chartTitle = `Binomial Complementary CDF (n=${n}, p=${p.toFixed(2)})`;
        
        // Highlight area under the curve from highlightK to n
        if (highlightK !== null) {
            chart.data.datasets = [
                {
                    label: 'CCDF',
                    data: dataValues,
                    borderColor: CHART_COLORS.primary,
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    pointBackgroundColor: labels.map(k => 
                        k === highlightK ? CHART_COLORS.accent : CHART_COLORS.primary
                    ),
                    pointBorderColor: labels.map(k => 
                        k === highlightK ? CHART_COLORS.accent : CHART_COLORS.primary
                    ),
                    pointRadius: labels.map(k => 
                        k === highlightK ? 6 : 3
                    ),
                    tension: 0.1
                }
            ];
            
            // Add fill area if highlighting
            if (highlightK <= n) {
                chart.data.datasets.unshift({
                    label: `P(X ≥ ${highlightK})`,
                    data: dataValues.map((v, i) => i >= highlightK ? v : null),
                    backgroundColor: `${CHART_COLORS.accent}33`, // Add transparency
                    borderWidth: 0,
                    pointRadius: 0,
                    fill: true
                });
            }
        }
    } else {
        // For PMF (exact probability), use bar chart
        chart.config.type = 'bar';
        
        // Update dataset
        chart.data.datasets = [{
            label: 'PMF',
            data: pmfValues,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors,
            borderWidth: 1
        }];
    }
    
    // Update chart data and options
    chart.data.labels = labels;
    chart.options.plugins.title = {
        display: true,
        text: chartTitle,
        color: CHART_COLORS.text,
        font: {
            family: "'Montserrat', sans-serif",
            size: 16,
            weight: 'bold'
        }
    };
    
    // Update chart
    chart.update();
}

/**
 * Update a normal distribution chart
 * @param {Chart} chart - The Chart.js instance
 * @param {number} mean - Mean of the distribution
 * @param {number} stdDev - Standard deviation
 * @param {Array} highlightRange - Range to highlight [min, max] (optional)
 * @param {string} calculationType - Type of calculation (pdf, cdf, between)
 */
function updateNormalChart(chart, mean, stdDev, highlightRange = null, calculationType = 'pdf') {
    if (!chart) return;
    
    // Range for x-axis: mean - 4*stdDev to mean + 4*stdDev
    const min = mean - 4 * stdDev;
    const max = mean + 4 * stdDev;
    
    // Generate x-axis values
    const step = (max - min) / 100;
    const xValues = Array.from({length: 101}, (_, i) => min + i * step);
    
    // Calculate PDF values
    const pdfValues = xValues.map(x => normalPDF(x, mean, stdDev));
    
    // Calculate CDF values
    const cdfValues = xValues.map(x => normalCDF(x, mean, stdDev));
    
    // Set chart type and data based on calculation type
    let chartTitle = '';
    
    if (calculationType === 'pdf') {
        chart.config.type = 'line';
        chartTitle = `Normal PDF (μ=${mean.toFixed(2)}, σ=${stdDev.toFixed(2)})`;
        
        // Update dataset
        chart.data.datasets = [{
            label: 'PDF',
            data: pdfValues,
            borderColor: CHART_COLORS.primary,
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.4,
            fill: false
        }];
        
        // Highlight range if provided
        if (highlightRange && highlightRange.length === 2) {
            const [hMin, hMax] = highlightRange;
            
            // Add filled area for the highlighted range
            chart.data.datasets.unshift({
                label: `P(${hMin.toFixed(2)} ≤ X ≤ ${hMax.toFixed(2)})`,
                data: pdfValues.map((y, i) => {
                    const x = xValues[i];
                    return (x >= hMin && x <= hMax) ? y : null;
                }),
                backgroundColor: `${CHART_COLORS.accent}33`, // Add transparency
                borderWidth: 0,
                fill: true
            });
        }
    } else if (calculationType === 'cdf') {
        chart.config.type = 'line';
        chartTitle = `Normal CDF (μ=${mean.toFixed(2)}, σ=${stdDev.toFixed(2)})`;
        
        // Update dataset
        chart.data.datasets = [{
            label: 'CDF',
            data: cdfValues,
            borderColor: CHART_COLORS.primary,
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.4,
            fill: false
        }];
        
        // Highlight range if provided
        if (highlightRange && highlightRange.length === 2) {
            const [hMin, hMax] = highlightRange;
            
            // Find indices corresponding to the highlight range
            const minIndex = Math.max(0, Math.floor((hMin - min) / step));
            const maxIndex = Math.min(xValues.length - 1, Math.ceil((hMax - min) / step));
            
            // Add filled area for the highlighted range
            chart.data.datasets.unshift({
                label: `P(${hMin.toFixed(2)} ≤ X ≤ ${hMax.toFixed(2)})`,
                data: cdfValues.map((y, i) => {
                    return (i >= minIndex && i <= maxIndex) ? y : null;
                }),
                backgroundColor: `${CHART_COLORS.accent}33`, // Add transparency
                borderWidth: 0,
                fill: true
            });
        }
    } else if (calculationType === 'between') {
        chart.config.type = 'line';
        chartTitle = `Normal Distribution (μ=${mean.toFixed(2)}, σ=${stdDev.toFixed(2)})`;
        
        // Update datasets to show both PDF and CDF
        chart.data.datasets = [
            {
                label: 'PDF',
                data: pdfValues,
                borderColor: CHART_COLORS.primary,
                backgroundColor: 'transparent',
                borderWidth: 2,
                tension: 0.4,
                fill: false,
                yAxisID: 'y'
            },
            {
                label: 'CDF',
                data: cdfValues,
                borderColor: CHART_COLORS.secondary,
                backgroundColor: 'transparent',
                borderWidth: 2,
                tension: 0.4,
                fill: false,
                yAxisID: 'y1'
            }
        ];
        
        // Set up dual y-axes
        chart.options.scales.y1 = {
            type: 'linear',
            display: true,
            position: 'right',
            grid: {
                drawOnChartArea: false,
                color: CHART_COLORS.grid,
                borderColor: CHART_COLORS.grid,
                tickColor: CHART_COLORS.grid
            },
            ticks: {
                color: CHART_COLORS.textSecondary,
                font: {
                    family: "'Open Sans', sans-serif",
                    size: 11
                }
            }
        };
        
        // Highlight range if provided
        if (highlightRange && highlightRange.length === 2) {
            const [hMin, hMax] = highlightRange;
            
            // Add filled area for the highlighted range on PDF
            chart.data.datasets.unshift({
                label: `P(${hMin.toFixed(2)} ≤ X ≤ ${hMax.toFixed(2)})`,
                data: pdfValues.map((y, i) => {
                    const x = xValues[i];
                    return (x >= hMin && x <= hMax) ? y : null;
                }),
                backgroundColor: `${CHART_COLORS.accent}33`, // Add transparency
                borderWidth: 0,
                fill: true,
                yAxisID: 'y'
            });
        }
    }
    
    // Update chart data and options
    chart.data.labels = xValues;
    chart.options.plugins.title = {
        display: true,
        text: chartTitle,
        color: CHART_COLORS.text,
        font: {
            family: "'Montserrat', sans-serif",
            size: 16,
            weight: 'bold'
        }
    };
    
    // Update chart
    chart.update();
}

/**
 * Update a Poisson distribution chart
 * @param {Chart} chart - The Chart.js instance
 * @param {number} lambda - Mean rate
 * @param {number} highlightK - Value of k to highlight (optional)
 * @param {string} calculationType - Type of calculation (pmf, cdf)
 */
function updatePoissonChart(chart, lambda, highlightK = null, calculationType = 'pmf') {
    if (!chart) return;
    
    // Determine a reasonable range for k values
    // For Poisson, we'll go from 0 to lambda + 4*sqrt(lambda) to cover most of the distribution
    const maxK = Math.max(20, Math.ceil(lambda + 4 * Math.sqrt(lambda)));
    
    // Generate x-axis values (0 to maxK)
    const labels = Array.from({length: maxK + 1}, (_, i) => i);
    
    // Calculate PMF values for each k
    const pmfValues = labels.map(k => poissonPMF(lambda, k));
    
    // Create background colors array, highlighting the specified k if provided
    const backgroundColors = labels.map(k => 
        k === highlightK ? CHART_COLORS.accent : CHART_COLORS.primary
    );
    
    // For cumulative distributions, we need to modify the data
    let dataValues = pmfValues;
    let chartTitle = `Poisson PMF (λ=${lambda.toFixed(2)})`;
    
    if (calculationType === 'cdf') {
        // For P(X ≤ k), we calculate cumulative probabilities
        dataValues = labels.map(k => {
            // Sum all PMF values from 0 to k
            return labels.slice(0, k + 1).reduce((sum, i) => sum + pmfValues[i], 0);
        });
        
        // Update chart type to line for CDF
        chart.config.type = 'line';
        chartTitle = `Poisson CDF (λ=${lambda.toFixed(2)})`;
        
        // Highlight area under the curve up to highlightK
        if (highlightK !== null) {
            chart.data.datasets = [
                {
                    label: 'CDF',
                    data: dataValues,
                    borderColor: CHART_COLORS.primary,
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    pointBackgroundColor: labels.map(k => 
                        k === highlightK ? CHART_COLORS.accent : CHART_COLORS.primary
                    ),
                    pointBorderColor: labels.map(k => 
                        k === highlightK ? CHART_COLORS.accent : CHART_COLORS.primary
                    ),
                    pointRadius: labels.map(k => 
                        k === highlightK ? 6 : 3
                    ),
                    tension: 0.1
                }
            ];
            
            // Add fill area if highlighting
            if (highlightK >= 0) {
                chart.data.datasets.unshift({
                    label: `P(X ≤ ${highlightK})`,
                    data: dataValues.map((v, i) => i <= highlightK ? v : null),
                    backgroundColor: `${CHART_COLORS.accent}33`, // Add transparency
                    borderWidth: 0,
                    pointRadius: 0,
                    fill: true
                });
            }
        }
    } else {
        // For PMF (exact probability), use bar chart
        chart.config.type = 'bar';
        
        // Update dataset
        chart.data.datasets = [{
            label: 'PMF',
            data: pmfValues,
            backgroundColor: backgroundColors,
            borderColor: backgroundColors,
            borderWidth: 1
        }];
    }
    
    // Update chart data and options
    chart.data.labels = labels;
    chart.options.plugins.title = {
        display: true,
        text: chartTitle,
        color: CHART_COLORS.text,
        font: {
            family: "'Montserrat', sans-serif",
            size: 16,
            weight: 'bold'
        }
    };
    
    // Update chart
    chart.update();
}

/**
 * Update a uniform distribution chart
 * @param {Chart} chart - The Chart.js instance
 * @param {number} a - Lower bound
 * @param {number} b - Upper bound
 * @param {Array} highlightRange - Range to highlight [min, max] (optional)
 * @param {string} calculationType - Type of calculation (pdf, cdf)
 */
function updateUniformChart(chart, a, b, highlightRange = null, calculationType = 'pdf') {
    if (!chart) return;
    
    // Add some padding to the range for better visualization
    const padding = (b - a) * 0.1;
    const min = a - padding;
    const max = b + padding;
    
    // Generate x-axis values
    const step = (max - min) / 100;
    const xValues = Array.from({length: 101}, (_, i) => min + i * step);
    
    // Calculate PDF values
    const pdfValues = xValues.map(x => uniformPDF(x, a, b));
    
    // Calculate CDF values
    const cdfValues = xValues.map(x => uniformCDF(x, a, b));
    
    // Set chart type and data based on calculation type
    let chartTitle = '';
    
    if (calculationType === 'pdf') {
        chart.config.type = 'line';
        chartTitle = `Uniform PDF (a=${a.toFixed(2)}, b=${b.toFixed(2)})`;
        
        // Update dataset
        chart.data.datasets = [{
            label: 'PDF',
            data: pdfValues,
            borderColor: CHART_COLORS.primary,
            backgroundColor: 'transparent',
            borderWidth: 2,
            stepped: true,
            fill: false
        }];
        
        // Highlight range if provided
        if (highlightRange && highlightRange.length === 2) {
            const [hMin, hMax] = highlightRange;
            
            // Add filled area for the highlighted range
            chart.data.datasets.unshift({
                label: `P(${hMin.toFixed(2)} ≤ X ≤ ${hMax.toFixed(2)})`,
                data: pdfValues.map((y, i) => {
                    const x = xValues[i];
                    return (x >= hMin && x <= hMax) ? y : null;
                }),
                backgroundColor: `${CHART_COLORS.accent}33`, // Add transparency
                borderWidth: 0,
                stepped: true,
                fill: true
            });
        }
    } else if (calculationType === 'cdf') {
        chart.config.type = 'line';
        chartTitle = `Uniform CDF (a=${a.toFixed(2)}, b=${b.toFixed(2)})`;
        
        // Update dataset
        chart.data.datasets = [{
            label: 'CDF',
            data: cdfValues,
            borderColor: CHART_COLORS.primary,
            backgroundColor: 'transparent',
            borderWidth: 2,
            stepped: false,
            fill: false
        }];
        
        // Highlight range if provided
        if (highlightRange && highlightRange.length === 2) {
            const [hMin, hMax] = highlightRange;
            
            // Find indices corresponding to the highlight range
            const minIndex = Math.max(0, Math.floor((hMin - min) / step));
            const maxIndex = Math.min(xValues.length - 1, Math.ceil((hMax - min) / step));
            
            // Add filled area for the highlighted range
            chart.data.datasets.unshift({
                label: `P(${hMin.toFixed(2)} ≤ X ≤ ${hMax.toFixed(2)})`,
                data: cdfValues.map((y, i) => {
                    return (i >= minIndex && i <= maxIndex) ? y : null;
                }),
                backgroundColor: `${CHART_COLORS.accent}33`, // Add transparency
                borderWidth: 0,
                fill: true
            });
        }
    }
    
    // Update chart data and options
    chart.data.labels = xValues;
    chart.options.plugins.title = {
        display: true,
        text: chartTitle,
        color: CHART_COLORS.text,
        font: {
            family: "'Montserrat', sans-serif",
            size: 16,
            weight: 'bold'
        }
    };
    
    // Update chart
    chart.update();
}

/**
 * Normal PDF function
 * @param {number} x - Value at which to calculate the PDF
 * @param {number} mean - Mean of the distribution
 * @param {number} stdDev - Standard deviation
 * @returns {number} PDF value
 */
function normalPDF(x, mean, stdDev) {
    const variance = stdDev * stdDev;
    return (1 / Math.sqrt(2 * Math.PI * variance)) * 
           Math.exp(-Math.pow(x - mean, 2) / (2 * variance));
}

/**
 * Normal CDF function
 * @param {number} x - Value at which to calculate the CDF
 * @param {number} mean - Mean of the distribution
 * @param {number} stdDev - Standard deviation
 * @returns {number} CDF value
 */
function normalCDF(x, mean, stdDev) {
    // Use jStat if available
    if (typeof jStat !== 'undefined') {
        return jStat.normal.cdf(x, mean, stdDev);
    }
    
    // Approximation using error function
    const z = (x - mean) / (stdDev * Math.sqrt(2));
    return 0.5 * (1 + erf(z));
}

/**
 * Error function approximation
 * @param {number} x - Value
 * @returns {number} Error function value
 */
function erf(x) {
    // Constants
    const a1 =  0.254829592;
    const a2 = -0.284496736;
    const a3 =  1.421413741;
    const a4 = -1.453152027;
    const a5 =  1.061405429;
    const p  =  0.3275911;
    
    // Save the sign of x
    const sign = (x < 0) ? -1 : 1;
    x = Math.abs(x);
    
    // A&S formula 7.1.26
    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    
    return sign * y;
}

/**
 * Binomial PMF function
 * @param {number} n - Number of trials
 * @param {number} p - Probability of success
 * @param {number} k - Number of successes
 * @returns {number} PMF value
 */
function binomialPMF(n, p, k) {
    if (k < 0 || k > n) return 0;
    
    // Calculate combinations C(n,k)
    const combinations = factorial(n) / (factorial(k) * factorial(n - k));
    
    // Calculate PMF
    return combinations * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

/**
 * Poisson PMF function
 * @param {number} lambda - Mean rate
 * @param {number} k - Number of occurrences
 * @returns {number} PMF value
 */
function poissonPMF(lambda, k) {
    if (k < 0) return 0;
    
    // Calculate PMF
    return Math.exp(-lambda) * Math.pow(lambda, k) / factorial(k);
}

/**
 * Uniform PDF function
 * @param {number} x - Value at which to calculate the PDF
 * @param {number} a - Lower bound
 * @param {number} b - Upper bound
 * @returns {number} PDF value
 */
function uniformPDF(x, a, b) {
    if (x < a || x > b) return 0;
    return 1 / (b - a);
}

/**
 * Uniform CDF function
 * @param {number} x - Value at which to calculate the CDF
 * @param {number} a - Lower bound
 * @param {number} b - Upper bound
 * @returns {number} CDF value
 */
function uniformCDF(x, a, b) {
    if (x < a) return 0;
    if (x > b) return 1;
    return (x - a) / (b - a);
}

/**
 * Factorial function
 * @param {number} n - Non-negative integer
 * @returns {number} n!
 */
function factorial(n) {
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

/**
 * Deep merge two objects
 * @param {Object} target - Target object
 * @param {Object} source - Source object
 * @returns {Object} Merged object
 */
function deepMerge(target, source) {
    const output = Object.assign({}, target);
    
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!(key in target)) {
                    Object.assign(output, { [key]: source[key] });
                } else {
                    output[key] = deepMerge(target[key], source[key]);
                }
            } else {
                Object.assign(output, { [key]: source[key] });
            }
        });
    }
    
    return output;
}

/**
 * Check if a value is an object
 * @param {*} item - Value to check
 * @returns {boolean} True if the value is an object
 */
function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
}