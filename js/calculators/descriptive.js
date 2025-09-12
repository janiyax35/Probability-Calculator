/**
 * Descriptive Statistics Calculators
 * Contains calculator functions for descriptive statistics
 * Random Variables & Probability Distributions
 */

// Global variables to store calculator states
let descriptiveState = {
    dataSet: [],
    sortedData: [],
    frequencyTable: [],
    statistics: {},
    visualizationData: {}
};

/**
 * =============================================
 * CENTRAL TENDENCY CALCULATORS
 * =============================================
 */

/**
 * Calculates measures of central tendency from a dataset
 * @param {Object} params - Calculator parameters
 * @returns {Object} - Results including mean, median, mode, etc.
 */
function calculateCentralTendency(params) {
    const { dataInput, dataType, separator, decimals } = params;
    
    // Parse data from input
    let dataset = parseDataInput(dataInput, dataType, separator);
    
    // Validate dataset
    if (!dataset || dataset.length === 0) {
        return {
            error: 'Please enter valid data.'
        };
    }
    
    // Create frequency table for the dataset
    const frequencyTable = createFrequencyTable(dataset);
    
    // Sort data for calculations
    const sortedData = [...dataset].sort((a, b) => a - b);
    
    // Calculate statistics
    const mean = calculateMean(dataset);
    const median = calculateMedian(sortedData);
    const mode = calculateMode(dataset);
    const geometricMean = calculateGeometricMean(dataset);
    const harmonicMean = calculateHarmonicMean(dataset);
    const midrange = (Math.max(...dataset) + Math.min(...dataset)) / 2;
    
    // Weighted mean calculation if frequency table is used
    let weightedMean = mean;
    if (dataType === 'frequency') {
        weightedMean = calculateWeightedMean(frequencyTable);
    }
    
    // Round results to specified number of decimal places
    const decimalPlaces = parseInt(decimals) || 4;
    const roundedResults = {
        mean: round(mean, decimalPlaces),
        median: round(median, decimalPlaces),
        mode: Array.isArray(mode) ? mode.map(m => round(m, decimalPlaces)) : round(mode, decimalPlaces),
        geometricMean: round(geometricMean, decimalPlaces),
        harmonicMean: round(harmonicMean, decimalPlaces),
        midrange: round(midrange, decimalPlaces),
        weightedMean: round(weightedMean, decimalPlaces)
    };
    
    // Generate step-by-step solutions
    const steps = generateCentralTendencySteps(dataset, sortedData, frequencyTable, roundedResults, dataType);
    
    // Store in state for later use
    descriptiveState.dataSet = dataset;
    descriptiveState.sortedData = sortedData;
    descriptiveState.frequencyTable = frequencyTable;
    descriptiveState.statistics = roundedResults;
    
    // Return results
    return {
        ...roundedResults,
        count: dataset.length,
        sum: round(dataset.reduce((a, b) => a + b, 0), decimalPlaces),
        min: Math.min(...dataset),
        max: Math.max(...dataset),
        range: Math.max(...dataset) - Math.min(...dataset),
        steps,
        data: dataset,
        sortedData,
        frequencyTable
    };
}

/**
 * =============================================
 * DISPERSION CALCULATORS
 * =============================================
 */

/**
 * Calculates measures of dispersion from a dataset
 * @param {Object} params - Calculator parameters
 * @returns {Object} - Results including variance, standard deviation, etc.
 */
function calculateDispersion(params) {
    const { dataInput, dataType, separator, populationSample, decimals } = params;
    
    // Parse data from input
    let dataset = parseDataInput(dataInput, dataType, separator);
    
    // Validate dataset
    if (!dataset || dataset.length === 0) {
        return {
            error: 'Please enter valid data.'
        };
    }
    
    // Create frequency table for the dataset
    const frequencyTable = createFrequencyTable(dataset);
    
    // Sort data for calculations
    const sortedData = [...dataset].sort((a, b) => a - b);
    
    // Calculate central tendency measures needed for dispersion
    const mean = calculateMean(dataset);
    
    // Calculate dispersion measures
    const variance = calculateVariance(dataset, mean, populationSample === 'population');
    const stdDev = Math.sqrt(variance);
    const meanAbsDev = calculateMeanAbsoluteDeviation(dataset, mean);
    const quartiles = calculateQuartiles(sortedData);
    const iqr = quartiles.q3 - quartiles.q1;
    const coeffOfVar = (stdDev / mean) * 100;
    
    // Calculate range
    const range = Math.max(...dataset) - Math.min(...dataset);
    
    // Round results to specified number of decimal places
    const decimalPlaces = parseInt(decimals) || 4;
    const roundedResults = {
        variance: round(variance, decimalPlaces),
        stdDev: round(stdDev, decimalPlaces),
        meanAbsDev: round(meanAbsDev, decimalPlaces),
        median: round(calculateMedian(sortedData), decimalPlaces),
        q1: round(quartiles.q1, decimalPlaces),
        q3: round(quartiles.q3, decimalPlaces),
        iqr: round(iqr, decimalPlaces),
        range: round(range, decimalPlaces),
        coeffOfVar: round(coeffOfVar, decimalPlaces)
    };
    
    // Generate step-by-step solutions
    const steps = generateDispersionSteps(dataset, mean, roundedResults, populationSample, dataType);
    
    // Store in state for later use
    descriptiveState.dataSet = dataset;
    descriptiveState.sortedData = sortedData;
    descriptiveState.frequencyTable = frequencyTable;
    descriptiveState.statistics = { 
        ...descriptiveState.statistics, 
        ...roundedResults,
        mean: round(mean, decimalPlaces)
    };
    
    // Calculate data for visualizing normal distribution
    const normalDistributionData = generateNormalDistributionData(mean, stdDev, dataset);
    descriptiveState.visualizationData = normalDistributionData;
    
    // Return results
    return {
        ...roundedResults,
        mean: round(mean, decimalPlaces),
        count: dataset.length,
        min: Math.min(...dataset),
        max: Math.max(...dataset),
        steps,
        data: dataset,
        sortedData,
        frequencyTable,
        normalDistributionData
    };
}

/**
 * =============================================
 * SHAPE CALCULATORS
 * =============================================
 */

/**
 * Calculates measures of shape from a dataset
 * @param {Object} params - Calculator parameters
 * @returns {Object} - Results including skewness, kurtosis, etc.
 */
function calculateShape(params) {
    const { dataInput, dataType, separator, decimals } = params;
    
    // Parse data from input
    let dataset = parseDataInput(dataInput, dataType, separator);
    
    // Validate dataset
    if (!dataset || dataset.length === 0) {
        return {
            error: 'Please enter valid data.'
        };
    }
    
    // Calculate central tendency and dispersion measures needed for shape
    const mean = calculateMean(dataset);
    const variance = calculateVariance(dataset, mean, true); // Use population formula
    const stdDev = Math.sqrt(variance);
    
    // Calculate skewness
    const skewness = calculateSkewness(dataset, mean, stdDev);
    
    // Calculate kurtosis
    const kurtosis = calculateKurtosis(dataset, mean, stdDev);
    
    // Calculate excess kurtosis (kurtosis - 3)
    const excessKurtosis = kurtosis - 3;
    
    // Round results to specified number of decimal places
    const decimalPlaces = parseInt(decimals) || 4;
    const roundedResults = {
        skewness: round(skewness, decimalPlaces),
        kurtosis: round(kurtosis, decimalPlaces),
        excessKurtosis: round(excessKurtosis, decimalPlaces)
    };
    
    // Generate step-by-step solutions
    const steps = generateShapeSteps(dataset, mean, stdDev, roundedResults);
    
    // Store in state for later use
    descriptiveState.statistics = { 
        ...descriptiveState.statistics, 
        ...roundedResults
    };
    
    // Return results
    return {
        ...roundedResults,
        mean: round(mean, decimalPlaces),
        stdDev: round(stdDev, decimalPlaces),
        steps,
        data: dataset
    };
}

/**
 * =============================================
 * DATA VISUALIZATION FUNCTIONS
 * =============================================
 */

/**
 * Generates data for histogram visualization
 * @param {Array} dataset - The dataset to visualize
 * @param {number} binCount - Number of bins for histogram (optional)
 * @returns {Object} - Data for histogram visualization
 */
function generateHistogramData(dataset, binCount = 0) {
    // Sort data
    const sortedData = [...dataset].sort((a, b) => a - b);
    
    // Determine bin count if not specified
    if (binCount <= 0) {
        // Use Sturges' formula for bin count: k = ceil(log2(n) + 1)
        binCount = Math.ceil(Math.log2(sortedData.length) + 1);
    }
    
    // Calculate bin width
    const min = Math.min(...sortedData);
    const max = Math.max(...sortedData);
    const binWidth = (max - min) / binCount;
    
    // Create bins
    const bins = Array(binCount).fill(0).map((_, i) => ({
        binStart: min + i * binWidth,
        binEnd: min + (i + 1) * binWidth,
        count: 0,
        values: []
    }));
    
    // Assign data points to bins
    sortedData.forEach(value => {
        // Special handling for max value
        if (value === max) {
            bins[binCount - 1].count++;
            bins[binCount - 1].values.push(value);
            return;
        }
        
        const binIndex = Math.floor((value - min) / binWidth);
        bins[binIndex].count++;
        bins[binIndex].values.push(value);
    });
    
    // Format bin labels
    const histogramData = bins.map(bin => ({
        binRange: `${round(bin.binStart, 2)} - ${round(bin.binEnd, 2)}`,
        count: bin.count,
        frequency: bin.count / sortedData.length,
        binStart: bin.binStart,
        binEnd: bin.binEnd,
        values: bin.values
    }));
    
    return {
        histogramData,
        binWidth,
        binCount
    };
}

/**
 * Generates data for box plot visualization
 * @param {Array} dataset - The dataset to visualize
 * @returns {Object} - Data for box plot visualization
 */
function generateBoxPlotData(dataset) {
    // Sort data
    const sortedData = [...dataset].sort((a, b) => a - b);
    
    // Calculate quartiles
    const quartiles = calculateQuartiles(sortedData);
    const { q1, median, q3 } = quartiles;
    
    // Calculate IQR and whiskers
    const iqr = q3 - q1;
    const lowerWhisker = Math.max(Math.min(...sortedData), q1 - 1.5 * iqr);
    const upperWhisker = Math.min(Math.max(...sortedData), q3 + 1.5 * iqr);
    
    // Identify outliers
    const outliers = sortedData.filter(value => 
        value < lowerWhisker || value > upperWhisker
    );
    
    return {
        min: Math.min(...sortedData),
        q1,
        median,
        q3,
        max: Math.max(...sortedData),
        iqr,
        lowerWhisker,
        upperWhisker,
        outliers
    };
}

/**
 * Generates data for normal distribution curve
 * @param {number} mean - Mean of the distribution
 * @param {number} stdDev - Standard deviation of the distribution
 * @param {Array} dataset - Original dataset for range determination
 * @returns {Object} - Data for normal distribution visualization
 */
function generateNormalDistributionData(mean, stdDev, dataset) {
    // Determine range of x values based on dataset
    const min = Math.min(...dataset);
    const max = Math.max(...dataset);
    
    // Extend range slightly beyond dataset
    const buffer = (max - min) * 0.2;
    const xMin = Math.max(min - buffer, mean - 4 * stdDev);
    const xMax = Math.min(max + buffer, mean + 4 * stdDev);
    
    // Generate points for the curve
    const points = [];
    const step = (xMax - xMin) / 100;
    
    for (let x = xMin; x <= xMax; x += step) {
        const y = normalPDF(x, mean, stdDev);
        points.push({ x, y });
    }
    
    // Calculate standard normal distribution markers
    const markers = [
        { z: -3, x: mean - 3 * stdDev, label: "-3σ", probability: normalCDF(-3) },
        { z: -2, x: mean - 2 * stdDev, label: "-2σ", probability: normalCDF(-2) - normalCDF(-3) },
        { z: -1, x: mean - 1 * stdDev, label: "-1σ", probability: normalCDF(-1) - normalCDF(-2) },
        { z: 0, x: mean, label: "μ", probability: normalCDF(1) - normalCDF(-1) },
        { z: 1, x: mean + 1 * stdDev, label: "+1σ", probability: normalCDF(2) - normalCDF(1) },
        { z: 2, x: mean + 2 * stdDev, label: "+2σ", probability: normalCDF(3) - normalCDF(2) },
        { z: 3, x: mean + 3 * stdDev, label: "+3σ", probability: 1 - normalCDF(3) }
    ];
    
    return {
        points,
        markers,
        mean,
        stdDev,
        xMin,
        xMax
    };
}

/**
 * =============================================
 * STATISTICAL CALCULATION FUNCTIONS
 * =============================================
 */

/**
 * Calculates the arithmetic mean of a dataset
 * @param {Array} data - Array of numbers
 * @returns {number} - Arithmetic mean
 */
function calculateMean(data) {
    if (!data.length) return 0;
    return data.reduce((sum, value) => sum + value, 0) / data.length;
}

/**
 * Calculates the weighted mean of a dataset with frequencies
 * @param {Array} frequencyTable - Array of {value, frequency} objects
 * @returns {number} - Weighted mean
 */
function calculateWeightedMean(frequencyTable) {
    if (!frequencyTable.length) return 0;
    
    const sum = frequencyTable.reduce((acc, item) => acc + item.value * item.frequency, 0);
    const totalFrequency = frequencyTable.reduce((acc, item) => acc + item.frequency, 0);
    
    return sum / totalFrequency;
}

/**
 * Calculates the median of a sorted dataset
 * @param {Array} sortedData - Sorted array of numbers
 * @returns {number} - Median
 */
function calculateMedian(sortedData) {
    if (!sortedData.length) return 0;
    
    const middle = Math.floor(sortedData.length / 2);
    
    if (sortedData.length % 2 === 0) {
        return (sortedData[middle - 1] + sortedData[middle]) / 2;
    } else {
        return sortedData[middle];
    }
}

/**
 * Calculates the mode of a dataset
 * @param {Array} data - Array of numbers
 * @returns {number|Array} - Mode (single value or array of values if multimodal)
 */
function calculateMode(data) {
    if (!data.length) return 0;
    
    // Count frequency of each value
    const counts = {};
    data.forEach(value => {
        counts[value] = (counts[value] || 0) + 1;
    });
    
    // Find the highest frequency
    let maxFrequency = 0;
    for (const value in counts) {
        if (counts[value] > maxFrequency) {
            maxFrequency = counts[value];
        }
    }
    
    // Find all values with the highest frequency
    const modes = [];
    for (const value in counts) {
        if (counts[value] === maxFrequency) {
            modes.push(parseFloat(value));
        }
    }
    
    // If all values appear the same number of times, there is no mode
    if (modes.length === Object.keys(counts).length) {
        return "No mode (all values appear equally often)";
    }
    
    // Return single mode or array of modes
    return modes.length === 1 ? modes[0] : modes;
}

/**
 * Calculates the geometric mean of a dataset
 * @param {Array} data - Array of positive numbers
 * @returns {number} - Geometric mean
 */
function calculateGeometricMean(data) {
    if (!data.length) return 0;
    
    // Check for non-positive values
    if (data.some(value => value <= 0)) {
        return "Cannot calculate (dataset contains non-positive values)";
    }
    
    // Calculate product of all values
    const product = data.reduce((acc, value) => acc * value, 1);
    
    // Return nth root of product
    return Math.pow(product, 1 / data.length);
}

/**
 * Calculates the harmonic mean of a dataset
 * @param {Array} data - Array of non-zero numbers
 * @returns {number} - Harmonic mean
 */
function calculateHarmonicMean(data) {
    if (!data.length) return 0;
    
    // Check for zero values
    if (data.some(value => value === 0)) {
        return "Cannot calculate (dataset contains zero values)";
    }
    
    // Sum of reciprocals
    const sumOfReciprocals = data.reduce((acc, value) => acc + (1 / value), 0);
    
    // Return harmonic mean
    return data.length / sumOfReciprocals;
}

/**
 * Calculates the variance of a dataset
 * @param {Array} data - Array of numbers
 * @param {number} mean - Mean of the dataset
 * @param {boolean} isPopulation - Whether to use population formula (true) or sample formula (false)
 * @returns {number} - Variance
 */
function calculateVariance(data, mean, isPopulation = false) {
    if (!data.length) return 0;
    
    // Calculate sum of squared deviations
    const sumOfSquaredDeviations = data.reduce((acc, value) => {
        const deviation = value - mean;
        return acc + (deviation * deviation);
    }, 0);
    
    // Use population or sample formula
    return sumOfSquaredDeviations / (data.length - (isPopulation ? 0 : 1));
}

/**
 * Calculates the mean absolute deviation of a dataset
 * @param {Array} data - Array of numbers
 * @param {number} mean - Mean of the dataset
 * @returns {number} - Mean absolute deviation
 */
function calculateMeanAbsoluteDeviation(data, mean) {
    if (!data.length) return 0;
    
    // Calculate sum of absolute deviations
    const sumOfAbsoluteDeviations = data.reduce((acc, value) => {
        return acc + Math.abs(value - mean);
    }, 0);
    
    // Return mean absolute deviation
    return sumOfAbsoluteDeviations / data.length;
}

/**
 * Calculates the quartiles of a sorted dataset
 * @param {Array} sortedData - Sorted array of numbers
 * @returns {Object} - Object with q1, median, and q3 properties
 */
function calculateQuartiles(sortedData) {
    if (!sortedData.length) return { q1: 0, median: 0, q3: 0 };
    
    const median = calculateMedian(sortedData);
    
    // Find Q1 (first quartile)
    const lowerHalf = sortedData.slice(0, Math.floor(sortedData.length / 2));
    if (sortedData.length % 2 === 1) {
        // If odd number of elements, exclude the median
        lowerHalf.pop();
    }
    const q1 = calculateMedian(lowerHalf);
    
    // Find Q3 (third quartile)
    const upperHalf = sortedData.slice(Math.ceil(sortedData.length / 2));
    if (sortedData.length % 2 === 1) {
        // If odd number of elements, exclude the median
        upperHalf.shift();
    }
    const q3 = calculateMedian(upperHalf);
    
    return { q1, median, q3 };
}

/**
 * Calculates the skewness of a dataset
 * @param {Array} data - Array of numbers
 * @param {number} mean - Mean of the dataset
 * @param {number} stdDev - Standard deviation of the dataset
 * @returns {number} - Skewness
 */
function calculateSkewness(data, mean, stdDev) {
    if (!data.length || stdDev === 0) return 0;
    
    // Calculate sum of cubed deviations
    const sumOfCubedDeviations = data.reduce((acc, value) => {
        const deviation = (value - mean) / stdDev;
        return acc + (deviation * deviation * deviation);
    }, 0);
    
    // Return skewness
    return sumOfCubedDeviations / data.length;
}

/**
 * Calculates the kurtosis of a dataset
 * @param {Array} data - Array of numbers
 * @param {number} mean - Mean of the dataset
 * @param {number} stdDev - Standard deviation of the dataset
 * @returns {number} - Kurtosis
 */
function calculateKurtosis(data, mean, stdDev) {
    if (!data.length || stdDev === 0) return 0;
    
    // Calculate sum of fourth power of deviations
    const sumOfFourthPowerDeviations = data.reduce((acc, value) => {
        const deviation = (value - mean) / stdDev;
        return acc + Math.pow(deviation, 4);
    }, 0);
    
    // Return kurtosis
    return sumOfFourthPowerDeviations / data.length;
}

/**
 * =============================================
 * HELPER FUNCTIONS
 * =============================================
 */

/**
 * Parses data input based on input type and separator
 * @param {string} dataInput - Raw data input
 * @param {string} dataType - Type of data input ('raw' or 'frequency')
 * @param {string} separator - Separator for raw data
 * @returns {Array} - Parsed dataset
 */
function parseDataInput(dataInput, dataType, separator) {
    if (!dataInput) return [];
    
    if (dataType === 'raw') {
        // Split by separator and convert to numbers
        const separatorRegex = separator === 'comma' ? /,\s*/ : /\s+/;
        return dataInput.split(separatorRegex)
            .map(value => value.trim())
            .filter(value => value !== '')
            .map(value => parseFloat(value))
            .filter(value => !isNaN(value));
    } else if (dataType === 'frequency') {
        // Parse frequency table data in format "value:frequency"
        const result = [];
        const rows = dataInput.split(/\n+/);
        
        rows.forEach(row => {
            const parts = row.split(/[:;,]/).map(p => p.trim());
            if (parts.length >= 2) {
                const value = parseFloat(parts[0]);
                const frequency = parseInt(parts[1]);
                
                if (!isNaN(value) && !isNaN(frequency) && frequency > 0) {
                    // Add the value to the dataset frequency times
                    for (let i = 0; i < frequency; i++) {
                        result.push(value);
                    }
                }
            }
        });
        
        return result;
    }
    
    return [];
}

/**
 * Creates a frequency table from a dataset
 * @param {Array} data - Array of numbers
 * @returns {Array} - Array of {value, frequency} objects
 */
function createFrequencyTable(data) {
    if (!data.length) return [];
    
    // Count frequency of each value
    const counts = {};
    data.forEach(value => {
        counts[value] = (counts[value] || 0) + 1;
    });
    
    // Convert to array of objects
    const frequencyTable = Object.keys(counts).map(value => ({
        value: parseFloat(value),
        frequency: counts[value]
    }));
    
    // Sort by value
    return frequencyTable.sort((a, b) => a.value - b.value);
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
 * Calculates the probability density function (PDF) of the normal distribution
 * @param {number} x - Input value
 * @param {number} mean - Mean of the distribution
 * @param {number} stdDev - Standard deviation of the distribution
 * @returns {number} - PDF value
 */
function normalPDF(x, mean, stdDev) {
    const z = (x - mean) / stdDev;
    return Math.exp(-0.5 * z * z) / (stdDev * Math.sqrt(2 * Math.PI));
}

/**
 * Calculates the cumulative distribution function (CDF) of the standard normal distribution
 * @param {number} z - Z-score
 * @returns {number} - Probability
 */
function normalCDF(z) {
    // Approximation of the standard normal CDF
    if (z < -6) return 0;
    if (z > 6) return 1;
    
    let sum = 0;
    let term = z;
    let i = 3;
    
    while (Math.abs(term) > 1e-10) {
        sum += term;
        term = term * z * z / i;
        i += 2;
    }
    
    return 0.5 + sum * Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI);
}

/**
 * =============================================
 * STEP GENERATION FUNCTIONS
 * =============================================
 */

/**
 * Generates step-by-step solutions for central tendency calculations
 * @param {Array} dataset - Original dataset
 * @param {Array} sortedData - Sorted dataset
 * @param {Array} frequencyTable - Frequency table
 * @param {Object} results - Calculation results
 * @param {string} dataType - Type of data input
 * @returns {Array} - Array of step description strings
 */
function generateCentralTendencySteps(dataset, sortedData, frequencyTable, results, dataType) {
    const steps = [];
    
    // Mean calculation steps
    steps.push("Step 1: Calculate the arithmetic mean.");
    steps.push(`Mean = Sum of all values / Number of values`);
    steps.push(`Mean = (${dataset.join(' + ')}) / ${dataset.length}`);
    steps.push(`Mean = ${dataset.reduce((a, b) => a + b, 0)} / ${dataset.length} = ${results.mean}`);
    
    // Median calculation steps
    steps.push("Step 2: Calculate the median.");
    steps.push(`First, arrange the data in ascending order: ${sortedData.join(', ')}`);
    
    if (sortedData.length % 2 === 0) {
        const middle1 = sortedData[sortedData.length / 2 - 1];
        const middle2 = sortedData[sortedData.length / 2];
        steps.push(`Since there are ${sortedData.length} values (even), the median is the average of the two middle values.`);
        steps.push(`Median = (${middle1} + ${middle2}) / 2 = ${results.median}`);
    } else {
        const middle = sortedData[Math.floor(sortedData.length / 2)];
        steps.push(`Since there are ${sortedData.length} values (odd), the median is the middle value.`);
        steps.push(`Median = ${middle}`);
    }
    
    // Mode calculation steps
    steps.push("Step 3: Calculate the mode.");
    
    // Create frequency count table for displaying
    const valueCounts = {};
    dataset.forEach(val => {
        valueCounts[val] = (valueCounts[val] || 0) + 1;
    });
    
    steps.push(`Count the frequency of each value:`);
    const countEntries = Object.entries(valueCounts)
        .map(([value, count]) => `${value}: ${count} time(s)`)
        .join(', ');
    steps.push(countEntries);
    
    // Find the highest frequency
    const maxFrequency = Math.max(...Object.values(valueCounts));
    const modes = Object.keys(valueCounts)
        .filter(val => valueCounts[val] === maxFrequency)
        .map(val => parseFloat(val));
    
    if (modes.length === Object.keys(valueCounts).length) {
        steps.push(`All values appear exactly ${maxFrequency} time(s), so there is no mode.`);
    } else if (modes.length === 1) {
        steps.push(`The mode is ${modes[0]} (appears ${maxFrequency} time(s)).`);
    } else {
        steps.push(`The dataset is multimodal with modes: ${modes.join(', ')} (each appears ${maxFrequency} time(s)).`);
    }
    
    // Geometric mean calculation steps
    if (typeof results.geometricMean === 'number') {
        steps.push("Step 4: Calculate the geometric mean.");
        steps.push(`Geometric Mean = (product of all values)^(1/n)`);
        steps.push(`Geometric Mean = (${dataset.join(' × ')})^(1/${dataset.length})`);
        
        const product = dataset.reduce((a, b) => a * b, 1);
        steps.push(`Geometric Mean = (${product})^(1/${dataset.length}) = ${results.geometricMean}`);
    } else {
        steps.push("Step 4: The geometric mean cannot be calculated because the dataset contains zero or negative values.");
    }
    
    // Harmonic mean calculation steps
    if (typeof results.harmonicMean === 'number') {
        steps.push("Step 5: Calculate the harmonic mean.");
        steps.push(`Harmonic Mean = n / (sum of reciprocals)`);
        steps.push(`Harmonic Mean = ${dataset.length} / (${dataset.map(x => `1/${x}`).join(' + ')})`);
        
        const sumOfReciprocals = dataset.reduce((a, b) => a + (1/b), 0);
        steps.push(`Harmonic Mean = ${dataset.length} / ${sumOfReciprocals} = ${results.harmonicMean}`);
    } else {
        steps.push("Step 5: The harmonic mean cannot be calculated because the dataset contains zero values.");
    }
    
    // Midrange calculation steps
    steps.push("Step 6: Calculate the midrange.");
    steps.push(`Midrange = (Maximum value + Minimum value) / 2`);
    steps.push(`Midrange = (${Math.max(...dataset)} + ${Math.min(...dataset)}) / 2 = ${results.midrange}`);
    
    return steps;
}

/**
 * Generates step-by-step solutions for dispersion calculations
 * @param {Array} dataset - Original dataset
 * @param {number} mean - Mean of the dataset
 * @param {Object} results - Calculation results
 * @param {string} populationSample - Whether data is from population or sample
 * @param {string} dataType - Type of data input
 * @returns {Array} - Array of step description strings
 */
function generateDispersionSteps(dataset, mean, results, populationSample, dataType) {
    const steps = [];
    
    // Variance calculation steps
    steps.push("Step 1: Calculate the variance.");
    steps.push(`First, find the mean of the dataset: ${results.mean}`);
    steps.push(`Calculate deviations from the mean for each value:`);
    
    const deviations = dataset.map(x => x - mean);
    const deviationSteps = dataset.map((x, i) => `(${x} - ${results.mean}) = ${round(deviations[i], 4)}`);
    steps.push(deviationSteps.join(', '));
    
    steps.push(`Square each deviation:`);
    const squaredDeviations = deviations.map(d => d * d);
    const squaredDeviationSteps = squaredDeviations.map((sd, i) => 
        `(${round(deviations[i], 4)})² = ${round(sd, 4)}`);
    steps.push(squaredDeviationSteps.join(', '));
    
    const sumOfSquaredDeviations = squaredDeviations.reduce((a, b) => a + b, 0);
    steps.push(`Sum of squared deviations = ${round(sumOfSquaredDeviations, 4)}`);
    
    if (populationSample === 'population') {
        steps.push(`For population variance, divide by n (${dataset.length}):`);
        steps.push(`Variance = ${round(sumOfSquaredDeviations, 4)} / ${dataset.length} = ${results.variance}`);
    } else {
        steps.push(`For sample variance, divide by (n-1) (${dataset.length - 1}):`);
        steps.push(`Variance = ${round(sumOfSquaredDeviations, 4)} / ${dataset.length - 1} = ${results.variance}`);
    }
    
    // Standard deviation calculation steps
    steps.push("Step 2: Calculate the standard deviation.");
    steps.push(`Standard Deviation = √Variance = √${results.variance} = ${results.stdDev}`);
    
    // Mean absolute deviation calculation steps
    steps.push("Step 3: Calculate the mean absolute deviation (MAD).");
    steps.push(`Calculate absolute deviations from the mean:`);
    
    const absDeviations = deviations.map(d => Math.abs(d));
    const absDeviationSteps = absDeviations.map((ad, i) => 
        `|${dataset[i]} - ${results.mean}| = ${round(ad, 4)}`);
    steps.push(absDeviationSteps.join(', '));
    
    const sumOfAbsDeviations = absDeviations.reduce((a, b) => a + b, 0);
    steps.push(`Sum of absolute deviations = ${round(sumOfAbsDeviations, 4)}`);
    steps.push(`MAD = ${round(sumOfAbsDeviations, 4)} / ${dataset.length} = ${results.meanAbsDev}`);
    
    // Quartiles and IQR calculation steps
    steps.push("Step 4: Calculate quartiles and interquartile range (IQR).");
    const sortedData = [...dataset].sort((a, b) => a - b);
    steps.push(`First, arrange the data in ascending order: ${sortedData.join(', ')}`);
    
    // Median (Q2) calculation
    if (sortedData.length % 2 === 0) {
        const middle1 = sortedData[sortedData.length / 2 - 1];
        const middle2 = sortedData[sortedData.length / 2];
        steps.push(`The median (Q2) is the average of the two middle values: (${middle1} + ${middle2}) / 2 = ${results.median}`);
    } else {
        const middle = sortedData[Math.floor(sortedData.length / 2)];
        steps.push(`The median (Q2) is the middle value: ${middle}`);
    }
    
    // Split data for Q1 and Q3
    const lowerHalf = sortedData.slice(0, Math.floor(sortedData.length / 2));
    if (sortedData.length % 2 === 1) {
        lowerHalf.pop(); // Remove median for odd-length dataset
    }
    
    const upperHalf = sortedData.slice(Math.ceil(sortedData.length / 2));
    if (sortedData.length % 2 === 1) {
        upperHalf.shift(); // Remove median for odd-length dataset
    }
    
    steps.push(`For Q1, find the median of the lower half: ${lowerHalf.join(', ')}`);
    steps.push(`Q1 = ${results.q1}`);
    
    steps.push(`For Q3, find the median of the upper half: ${upperHalf.join(', ')}`);
    steps.push(`Q3 = ${results.q3}`);
    
    steps.push(`Interquartile Range (IQR) = Q3 - Q1 = ${results.q3} - ${results.q1} = ${results.iqr}`);
    
    // Range calculation steps
    steps.push("Step 5: Calculate the range.");
    steps.push(`Range = Maximum value - Minimum value = ${Math.max(...dataset)} - ${Math.min(...dataset)} = ${results.range}`);
    
    // Coefficient of variation calculation steps
    steps.push("Step 6: Calculate the coefficient of variation (CV).");
    steps.push(`CV = (Standard Deviation / Mean) × 100% = (${results.stdDev} / ${results.mean}) × 100% = ${results.coeffOfVar}%`);
    
    return steps;
}

/**
 * Generates step-by-step solutions for shape calculations
 * @param {Array} dataset - Original dataset
 * @param {number} mean - Mean of the dataset
 * @param {number} stdDev - Standard deviation of the dataset
 * @param {Object} results - Calculation results
 * @returns {Array} - Array of step description strings
 */
function generateShapeSteps(dataset, mean, stdDev, results) {
    const steps = [];
    
    // Skewness calculation steps
    steps.push("Step 1: Calculate the skewness.");
    steps.push(`First, standardize each value by subtracting the mean and dividing by the standard deviation:`);
    
    const standardizedValues = dataset.map(x => (x - mean) / stdDev);
    const standardizedSteps = standardizedValues.map((z, i) => 
        `(${dataset[i]} - ${round(mean, 4)}) / ${round(stdDev, 4)} = ${round(z, 4)}`);
    steps.push(standardizedSteps.slice(0, 5).join(', ') + (dataset.length > 5 ? '...' : ''));
    
    steps.push(`Cube each standardized value:`);
    const cubedValues = standardizedValues.map(z => z * z * z);
    const cubedSteps = cubedValues.map((c, i) => 
        `(${round(standardizedValues[i], 4)})³ = ${round(c, 4)}`);
    steps.push(cubedSteps.slice(0, 5).join(', ') + (dataset.length > 5 ? '...' : ''));
    
    const sumOfCubes = cubedValues.reduce((a, b) => a + b, 0);
    steps.push(`Sum of cubed standardized values = ${round(sumOfCubes, 4)}`);
    steps.push(`Skewness = Sum / n = ${round(sumOfCubes, 4)} / ${dataset.length} = ${results.skewness}`);
    
    // Interpret skewness
    if (Math.abs(results.skewness) < 0.5) {
        steps.push(`Interpretation: The distribution is approximately symmetric (|skewness| < 0.5).`);
    } else if (results.skewness > 0) {
        steps.push(`Interpretation: The distribution is positively skewed (right-tailed), with a longer tail on the right side.`);
    } else {
        steps.push(`Interpretation: The distribution is negatively skewed (left-tailed), with a longer tail on the left side.`);
    }
    
    // Kurtosis calculation steps
    steps.push("Step 2: Calculate the kurtosis.");
    steps.push(`Raise each standardized value to the fourth power:`);
    
    const fourthPowerValues = standardizedValues.map(z => z * z * z * z);
    const fourthPowerSteps = fourthPowerValues.map((f, i) => 
        `(${round(standardizedValues[i], 4)})⁴ = ${round(f, 4)}`);
    steps.push(fourthPowerSteps.slice(0, 5).join(', ') + (dataset.length > 5 ? '...' : ''));
    
    const sumOfFourthPowers = fourthPowerValues.reduce((a, b) => a + b, 0);
    steps.push(`Sum of fourth powers = ${round(sumOfFourthPowers, 4)}`);
    steps.push(`Kurtosis = Sum / n = ${round(sumOfFourthPowers, 4)} / ${dataset.length} = ${results.kurtosis}`);
    
    // Excess kurtosis calculation steps
    steps.push("Step 3: Calculate the excess kurtosis.");
    steps.push(`Excess Kurtosis = Kurtosis - 3 = ${results.kurtosis} - 3 = ${results.excessKurtosis}`);
    
    // Interpret kurtosis
    if (Math.abs(results.excessKurtosis) < 0.5) {
        steps.push(`Interpretation: The distribution has approximately normal tail-thickness (|excess kurtosis| < 0.5).`);
    } else if (results.excessKurtosis > 0) {
        steps.push(`Interpretation: The distribution is leptokurtic (heavy-tailed), with more extreme values than a normal distribution.`);
    } else {
        steps.push(`Interpretation: The distribution is platykurtic (light-tailed), with fewer extreme values than a normal distribution.`);
    }
    
    return steps;
}

/**
 * Export all calculator functions
 */
export {
    calculateCentralTendency,
    calculateDispersion,
    calculateShape,
    generateHistogramData,
    generateBoxPlotData,
    generateNormalDistributionData,
    descriptiveState
};