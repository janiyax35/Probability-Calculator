/**
 * Distribution Plots Module
 * Contains functions for visualizing probability distributions
 * Random Variables & Probability Distributions
 */

// Plot configuration options
const plotConfig = {
    colors: {
        primary: 'rgba(54, 162, 235, 0.7)',
        secondary: 'rgba(255, 99, 132, 0.7)',
        tertiary: 'rgba(75, 192, 192, 0.7)',
        quaternary: 'rgba(153, 102, 255, 0.7)',
        highlight: 'rgba(255, 206, 86, 0.7)',
        grid: 'rgba(255, 255, 255, 0.1)',
        text: '#ffffff',
        gridLines: 'rgba(255, 255, 255, 0.1)'
    },
    fontFamily: "'Open Sans', sans-serif",
    fontSize: 12,
    animationDuration: 800
};

/**
 * =============================================
 * DISCRETE DISTRIBUTION PLOTS
 * =============================================
 */

/**
 * Creates a PMF plot for a discrete distribution
 * @param {string} canvasId - Canvas element ID
 * @param {Object} data - Distribution data
 * @param {Object} options - Additional options
 * @returns {Object} - Chart.js instance
 */
function createPMFPlot(canvasId, data, options = {}) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // Destroy existing chart if it exists
    if (window[canvasId + 'Chart']) {
        window[canvasId + 'Chart'].destroy();
    }
    
    // Extract data points from probability table
    const { probabilityTable, distribution, parameters } = data;
    
    if (!probabilityTable || probabilityTable.length === 0) {
        console.error('No probability data provided for PMF plot');
        return null;
    }
    
    // For discrete distributions, we use bar charts for PMF
    const labels = probabilityTable.map(point => point.x);
    const pmfValues = probabilityTable.map(point => point.pmf);
    
    // Determine if we need to truncate the plot for distributions with infinite support
    const truncated = probabilityTable.length < 50 ? false : true;
    
    // Set up chart data
    const chartData = {
        labels: labels,
        datasets: [{
            label: 'Probability Mass Function',
            data: pmfValues,
            backgroundColor: options.color || plotConfig.colors.primary,
            borderColor: options.borderColor || plotConfig.colors.primary,
            borderWidth: 1,
            barPercentage: 0.9,
            categoryPercentage: 0.8
        }]
    };
    
    // Add mean line if applicable
    if (data.mean !== undefined) {
        chartData.datasets.push({
            label: 'Mean',
            data: labels.map(() => 0), // Will be configured in annotation
            type: 'line',
            borderColor: plotConfig.colors.highlight,
            borderWidth: 2,
            pointRadius: 0,
            borderDash: [5, 5]
        });
    }
    
    // Configure chart options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: options.xLabel || 'x',
                    color: plotConfig.colors.text
                },
                grid: {
                    color: plotConfig.colors.grid
                },
                ticks: {
                    color: plotConfig.colors.text,
                    font: {
                        family: plotConfig.fontFamily,
                        size: plotConfig.fontSize
                    }
                }
            },
            y: {
                title: {
                    display: true,
                    text: options.yLabel || 'P(X = x)',
                    color: plotConfig.colors.text
                },
                grid: {
                    color: plotConfig.colors.grid
                },
                ticks: {
                    color: plotConfig.colors.text,
                    font: {
                        family: plotConfig.fontFamily,
                        size: plotConfig.fontSize
                    }
                },
                beginAtZero: true
            }
        },
        plugins: {
            title: {
                display: options.title !== false,
                text: options.title || getDistributionTitle(distribution, parameters),
                color: plotConfig.colors.text,
                font: {
                    family: plotConfig.fontFamily,
                    size: plotConfig.fontSize + 4,
                    weight: 'bold'
                }
            },
            subtitle: {
                display: truncated,
                text: 'Plot truncated for visualization clarity',
                color: plotConfig.colors.text,
                font: {
                    family: plotConfig.fontFamily,
                    size: plotConfig.fontSize
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `P(X = ${context.label}) = ${context.raw.toFixed(6)}`;
                    }
                }
            },
            legend: {
                display: options.legend !== false,
                labels: {
                    color: plotConfig.colors.text,
                    font: {
                        family: plotConfig.fontFamily,
                        size: plotConfig.fontSize
                    }
                }
            },
            annotation: data.mean !== undefined ? {
                annotations: {
                    meanLine: {
                        type: 'line',
                        xMin: data.mean,
                        xMax: data.mean,
                        borderColor: plotConfig.colors.highlight,
                        borderWidth: 2,
                        borderDash: [5, 5],
                        label: {
                            display: true,
                            content: `Mean: ${data.mean.toFixed(4)}`,
                            position: 'top',
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            color: plotConfig.colors.text,
                            font: {
                                family: plotConfig.fontFamily,
                                size: plotConfig.fontSize
                            }
                        }
                    }
                }
            } : {}
        },
        animation: {
            duration: plotConfig.animationDuration
        }
    };
    
    // Create the chart
    window[canvasId + 'Chart'] = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: chartOptions
    });
    
    return window[canvasId + 'Chart'];
}

/**
 * Creates a CDF plot for a discrete distribution
 * @param {string} canvasId - Canvas element ID
 * @param {Object} data - Distribution data
 * @param {Object} options - Additional options
 * @returns {Object} - Chart.js instance
 */
function createCDFPlot(canvasId, data, options = {}) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // Destroy existing chart if it exists
    if (window[canvasId + 'Chart']) {
        window[canvasId + 'Chart'].destroy();
    }
    
    // Extract data points from probability table
    const { probabilityTable, distribution, parameters } = data;
    
    if (!probabilityTable || probabilityTable.length === 0) {
        console.error('No probability data provided for CDF plot');
        return null;
    }
    
    // For discrete distributions, we use step line charts for CDF
    const labels = probabilityTable.map(point => point.x);
    const cdfValues = probabilityTable.map(point => point.cdf);
    
    // Set up chart data
    const chartData = {
        labels: labels,
        datasets: [{
            label: 'Cumulative Distribution Function',
            data: cdfValues,
            backgroundColor: 'transparent',
            borderColor: options.color || plotConfig.colors.secondary,
            borderWidth: 2,
            stepped: 'before',
            pointRadius: 3,
            pointBackgroundColor: options.color || plotConfig.colors.secondary
        }]
    };
    
    // Add median line if applicable (where CDF crosses 0.5)
    if (data.mean !== undefined) {
        // Find approximate median (where CDF is closest to 0.5)
        let medianIndex = 0;
        let closestDiff = 1;
        
        for (let i = 0; i < cdfValues.length; i++) {
            const diff = Math.abs(cdfValues[i] - 0.5);
            if (diff < closestDiff) {
                closestDiff = diff;
                medianIndex = i;
            }
        }
        
        const median = labels[medianIndex];
        
        chartData.datasets.push({
            label: 'Median',
            data: [], // Will be configured in annotation
            borderColor: plotConfig.colors.highlight,
            borderWidth: 2,
            pointRadius: 0,
            borderDash: [5, 5]
        });
    }
    
    // Configure chart options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: options.xLabel || 'x',
                    color: plotConfig.colors.text
                },
                grid: {
                    color: plotConfig.colors.grid
                },
                ticks: {
                    color: plotConfig.colors.text,
                    font: {
                        family: plotConfig.fontFamily,
                        size: plotConfig.fontSize
                    }
                }
            },
            y: {
                title: {
                    display: true,
                    text: options.yLabel || 'P(X ≤ x)',
                    color: plotConfig.colors.text
                },
                grid: {
                    color: plotConfig.colors.grid
                },
                ticks: {
                    color: plotConfig.colors.text,
                    font: {
                        family: plotConfig.fontFamily,
                        size: plotConfig.fontSize
                    }
                },
                min: 0,
                max: 1.05
            }
        },
        plugins: {
            title: {
                display: options.title !== false,
                text: options.title || `CDF: ${getDistributionTitle(distribution, parameters)}`,
                color: plotConfig.colors.text,
                font: {
                    family: plotConfig.fontFamily,
                    size: plotConfig.fontSize + 4,
                    weight: 'bold'
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `P(X ≤ ${context.label}) = ${context.raw.toFixed(6)}`;
                    }
                }
            },
            legend: {
                display: options.legend !== false,
                labels: {
                    color: plotConfig.colors.text,
                    font: {
                        family: plotConfig.fontFamily,
                        size: plotConfig.fontSize
                    }
                }
            }
        },
        animation: {
            duration: plotConfig.animationDuration
        }
    };
    
    // Create the chart
    window[canvasId + 'Chart'] = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: chartOptions
    });
    
    return window[canvasId + 'Chart'];
}

/**
 * Creates a combined PMF and CDF plot for a discrete distribution
 * @param {string} canvasId - Canvas element ID
 * @param {Object} data - Distribution data
 * @param {Object} options - Additional options
 * @returns {Object} - Chart.js instance
 */
function createCombinedDiscretePlot(canvasId, data, options = {}) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // Destroy existing chart if it exists
    if (window[canvasId + 'Chart']) {
        window[canvasId + 'Chart'].destroy();
    }
    
    // Extract data points from probability table
    const { probabilityTable, distribution, parameters } = data;
    
    if (!probabilityTable || probabilityTable.length === 0) {
        console.error('No probability data provided for combined plot');
        return null;
    }
    
    // For discrete distributions, combine bar chart for PMF and line chart for CDF
    const labels = probabilityTable.map(point => point.x);
    const pmfValues = probabilityTable.map(point => point.pmf);
    const cdfValues = probabilityTable.map(point => point.cdf);
    
    // Set up chart data with two y-axes
    const chartData = {
        labels: labels,
        datasets: [
            {
                label: 'PMF',
                data: pmfValues,
                backgroundColor: options.pmfColor || plotConfig.colors.primary,
                borderColor: options.pmfColor || plotConfig.colors.primary,
                borderWidth: 1,
                type: 'bar',
                yAxisID: 'y',
                order: 2
            },
            {
                label: 'CDF',
                data: cdfValues,
                backgroundColor: 'transparent',
                borderColor: options.cdfColor || plotConfig.colors.secondary,
                borderWidth: 2,
                type: 'line',
                stepped: 'before',
                pointRadius: 2,
                pointBackgroundColor: options.cdfColor || plotConfig.colors.secondary,
                yAxisID: 'y1',
                order: 1
            }
        ]
    };
    
    // Add mean line if applicable
    if (data.mean !== undefined) {
        chartData.datasets.push({
            label: 'Mean',
            data: labels.map(() => 0), // Will be configured in annotation
            type: 'line',
            borderColor: plotConfig.colors.highlight,
            borderWidth: 2,
            pointRadius: 0,
            borderDash: [5, 5],
            yAxisID: 'y'
        });
    }
    
    // Configure chart options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: options.xLabel || 'x',
                    color: plotConfig.colors.text
                },
                grid: {
                    color: plotConfig.colors.grid
                },
                ticks: {
                    color: plotConfig.colors.text,
                    font: {
                        family: plotConfig.fontFamily,
                        size: plotConfig.fontSize
                    }
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'PMF: P(X = x)',
                    color: options.pmfColor || plotConfig.colors.primary
                },
                position: 'left',
                grid: {
                    color: plotConfig.colors.grid
                },
                ticks: {
                    color: options.pmfColor || plotConfig.colors.primary,
                    font: {
                        family: plotConfig.fontFamily,
                        size: plotConfig.fontSize
                    }
                },
                beginAtZero: true
            },
            y1: {
                title: {
                    display: true,
                    text: 'CDF: P(X ≤ x)',
                    color: options.cdfColor || plotConfig.colors.secondary
                },
                position: 'right',
                grid: {
                    drawOnChartArea: false
                },
                ticks: {
                    color: options.cdfColor || plotConfig.colors.secondary,
                    font: {
                        family: plotConfig.fontFamily,
                        size: plotConfig.fontSize
                    }
                },
                min: 0,
                max: 1.05
            }
        },
        plugins: {
            title: {
                display: options.title !== false,
                text: options.title || getDistributionTitle(distribution, parameters),
                color: plotConfig.colors.text,
                font: {
                    family: plotConfig.fontFamily,
                    size: plotConfig.fontSize + 4,
                    weight: 'bold'
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        if (context.dataset.label === 'PMF') {
                            return `P(X = ${context.label}) = ${context.raw.toFixed(6)}`;
                        } else if (context.dataset.label === 'CDF') {
                            return `P(X ≤ ${context.label}) = ${context.raw.toFixed(6)}`;
                        }
                        return context.dataset.label;
                    }
                }
            },
            legend: {
                display: options.legend !== false,
                labels: {
                    color: plotConfig.colors.text,
                    font: {
                        family: plotConfig.fontFamily,
                        size: plotConfig.fontSize
                    }
                }
            },
            annotation: data.mean !== undefined ? {
                annotations: {
                    meanLine: {
                        type: 'line',
                        xMin: data.mean,
                        xMax: data.mean,
                        borderColor: plotConfig.colors.highlight,
                        borderWidth: 2,
                        borderDash: [5, 5],
                        label: {
                            display: true,
                            content: `Mean: ${data.mean.toFixed(4)}`,
                            position: 'top',
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            color: plotConfig.colors.text,
                            font: {
                                family: plotConfig.fontFamily,
                                size: plotConfig.fontSize
                            }
                        }
                    }
                }
            } : {}
        },
        animation: {
            duration: plotConfig.animationDuration
        }
    };
    
    // Create the chart
    window[canvasId + 'Chart'] = new Chart(ctx, {
        type: 'bar',
        data: chartData,
        options: chartOptions
    });
    
    return window[canvasId + 'Chart'];
}

/**
 * =============================================
 * CONTINUOUS DISTRIBUTION PLOTS
 * =============================================
 */

/**
 * Creates a PDF plot for a continuous distribution
 * @param {string} canvasId - Canvas element ID
 * @param {Object} data - Distribution data
 * @param {Object} options - Additional options
 * @returns {Object} - Chart.js instance
 */
function createPDFPlot(canvasId, data, options = {}) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // Destroy existing chart if it exists
    if (window[canvasId + 'Chart']) {
        window[canvasId + 'Chart'].destroy();
    }
    
    // Extract data for the plot
    const { pdf, distribution, parameters, mean, stdDev } = data;
    
    if (!pdf || pdf.length === 0) {
        console.error('No probability density data provided for PDF plot');
        return null;
    }
    
    // Set up chart data
    const chartData = {
        labels: pdf.map(point => point.x),
        datasets: [{
            label: 'Probability Density Function',
            data: pdf.map(point => point.y),
            backgroundColor: options.fillColor || 'rgba(54, 162, 235, 0.2)',
            borderColor: options.color || plotConfig.colors.primary,
            borderWidth: 2,
            pointRadius: 0,
            fill: true,
            tension: 0.4
        }]
    };
    
    // Add mean line if applicable
    if (mean !== undefined) {
        chartData.datasets.push({
            label: 'Mean',
            data: [], // Will be configured in annotation
            borderColor: plotConfig.colors.highlight,
            borderWidth: 2,
            pointRadius: 0,
            borderDash: [5, 5]
        });
    }
    
    // Configure chart options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: options.xLabel || 'x',
                    color: plotConfig.colors.text
                },
                grid: {
                    color: plotConfig.colors.grid
                },
                ticks: {
                    color: plotConfig.colors.text,
                    font: {
                        family: plotConfig.fontFamily,
                        size: plotConfig.fontSize
                    }
                }
            },
            y: {
                title: {
                    display: true,
                    text: options.yLabel || 'f(x)',
                    color: plotConfig.colors.text
                },
                grid: {
                    color: plotConfig.colors.grid
                },
                ticks: {
                    color: plotConfig.colors.text,
                    font: {
                        family: plotConfig.fontFamily,
                        size: plotConfig.fontSize
                    }
                },
                beginAtZero: true
            }
        },
        plugins: {
            title: {
                display: options.title !== false,
                text: options.title || getDistributionTitle(distribution, parameters),
                color: plotConfig.colors.text,
                font: {
                    family: plotConfig.fontFamily,
                    size: plotConfig.fontSize + 4,
                    weight: 'bold'
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `f(${context.label.toFixed(4)}) = ${context.raw.toFixed(6)}`;
                    }
                }
            },
            legend: {
                display: options.legend !== false,
                labels: {
                    color: plotConfig.colors.text,
                    font: {
                        family: plotConfig.fontFamily,
                        size: plotConfig.fontSize
                    }
                }
            },
            annotation: mean !== undefined ? {
                annotations: {
                    meanLine: {
                        type: 'line',
                        xMin: mean,
                        xMax: mean,
                        borderColor: plotConfig.colors.highlight,
                        borderWidth: 2,
                        borderDash: [5, 5],
                        label: {
                            display: true,
                            content: `Mean: ${mean.toFixed(4)}`,
                            position: 'top',
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            color: plotConfig.colors.text,
                            font: {
                                family: plotConfig.fontFamily,
                                size: plotConfig.fontSize
                            }
                        }
                    }
                }
            } : {}
        },
        animation: {
            duration: plotConfig.animationDuration
        }
    };
    
    // Create the chart
    window[canvasId + 'Chart'] = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: chartOptions
    });
    
    return window[canvasId + 'Chart'];
}

/**
 * Creates a CDF plot for a continuous distribution
 * @param {string} canvasId - Canvas element ID
 * @param {Object} data - Distribution data
 * @param {Object} options - Additional options
 * @returns {Object} - Chart.js instance
 */
function createContinuousCDFPlot(canvasId, data, options = {}) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // Destroy existing chart if it exists
    if (window[canvasId + 'Chart']) {
        window[canvasId + 'Chart'].destroy();
    }
    
    // Extract data for the plot
    const { cdf, distribution, parameters, mean, stdDev } = data;
    
    if (!cdf || cdf.length === 0) {
        console.error('No cumulative distribution data provided for CDF plot');
        return null;
    }
    
    // Set up chart data
    const chartData = {
        labels: cdf.map(point => point.x),
        datasets: [{
            label: 'Cumulative Distribution Function',
            data: cdf.map(point => point.y),
            backgroundColor: 'transparent',
            borderColor: options.color || plotConfig.colors.secondary,
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.4
        }]
    };
    
    // Add median line if applicable (where CDF crosses 0.5)
    if (mean !== undefined && stdDev !== undefined) {
        // For normal distribution, median = mean
        // For others, find approximate median (where CDF is closest to 0.5)
        let medianX = mean;
        let medianY = 0.5;
        
        if (distribution !== 'normal') {
            let medianIndex = 0;
            let closestDiff = 1;
            
            for (let i = 0; i < cdf.length; i++) {
                const diff = Math.abs(cdf[i].y - 0.5);
                if (diff < closestDiff) {
                    closestDiff = diff;
                    medianIndex = i;
                }
            }
            
            medianX = cdf[medianIndex].x;
            medianY = cdf[medianIndex].y;
        }
        
        chartData.datasets.push({
            label: 'Median',
            data: [], // Will be configured in annotation
            borderColor: plotConfig.colors.highlight,
            borderWidth: 2,
            pointRadius: 0,
            borderDash: [5, 5]
        });
    }
    
    // Configure chart options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: options.xLabel || 'x',
                    color: plotConfig.colors.text
                },
                grid: {
                    color: plotConfig.colors.grid
                },
                ticks: {
                    color: plotConfig.colors.text,
                    font: {
                        family: plotConfig.fontFamily,
                        size: plotConfig.fontSize
                    }
                }
            },
            y: {
                title: {
                    display: true,
                    text: options.yLabel || 'F(x)',
                    color: plotConfig.colors.text
                },
                grid: {
                    color: plotConfig.colors.grid
                },
                ticks: {
                    color: plotConfig.colors.text,
                    font: {
                        family: plotConfig.fontFamily,
                        size: plotConfig.fontSize
                    }
                },
                min: 0,
                max: 1.05
            }
        },
        plugins: {
            title: {
                display: options.title !== false,
                text: options.title || `CDF: ${getDistributionTitle(distribution, parameters)}`,
                color: plotConfig.colors.text,
                font: {
                    family: plotConfig.fontFamily,
                    size: plotConfig.fontSize + 4,
                    weight: 'bold'
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `F(${context.label.toFixed(4)}) = ${context.raw.toFixed(6)}`;
                    }
                }
            },
            legend: {
                display: options.legend !== false,
                labels: {
                    color: plotConfig.colors.text,
                    font: {
                        family: plotConfig.fontFamily,
                        size: plotConfig.fontSize
                    }
                }
            },
            annotation: mean !== undefined ? {
                annotations: {
                    medianLine: {
                        type: 'line',
                        xMin: mean, // For normal distribution, median = mean
                        xMax: mean,
                        borderColor: plotConfig.colors.highlight,
                        borderWidth: 2,
                        borderDash: [5, 5],
                        label: {
                            display: true,
                            content: `Median: ${mean.toFixed(4)}`,
                            position: 'top',
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            color: plotConfig.colors.text,
                            font: {
                                family: plotConfig.fontFamily,
                                size: plotConfig.fontSize
                            }
                        }
                    }
                }
            } : {}
        },
        animation: {
            duration: plotConfig.animationDuration
        }
    };
    
    // Create the chart
    window[canvasId + 'Chart'] = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: chartOptions
    });
    
    return window[canvasId + 'Chart'];
}

/**
 * Creates a combined PDF and CDF plot for a continuous distribution
 * @param {string} canvasId - Canvas element ID
 * @param {Object} data - Distribution data
 * @param {Object} options - Additional options
 * @returns {Object} - Chart.js instance
 */
function createCombinedContinuousPlot(canvasId, data, options = {}) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // Destroy existing chart if it exists
    if (window[canvasId + 'Chart']) {
        window[canvasId + 'Chart'].destroy();
    }
    
    // Extract data for the plot
    const { pdf, cdf, distribution, parameters, mean, stdDev } = data;
    
    if (!pdf || pdf.length === 0 || !cdf || cdf.length === 0) {
        console.error('No data provided for combined continuous plot');
        return null;
    }
    
    // Set up chart data with two y-axes
    const chartData = {
        labels: pdf.map(point => point.x),
        datasets: [
            {
                label: 'PDF',
                data: pdf.map(point => point.y),
                backgroundColor: options.pdfFillColor || 'rgba(54, 162, 235, 0.2)',
                borderColor: options.pdfColor || plotConfig.colors.primary,
                borderWidth: 2,
                pointRadius: 0,
                fill: true,
                tension: 0.4,
                yAxisID: 'y',
                order: 2
            },
            {
                label: 'CDF',
                data: cdf.map(point => point.y),
                backgroundColor: 'transparent',
                borderColor: options.cdfColor || plotConfig.colors.secondary,
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.4,
                yAxisID: 'y1',
                order: 1
            }
        ]
    };
    
    // Add mean line if applicable
    if (mean !== undefined) {
        chartData.datasets.push({
            label: 'Mean/Median',
            data: [], // Will be configured in annotation
            borderColor: plotConfig.colors.highlight,
            borderWidth: 2,
            pointRadius: 0,
            borderDash: [5, 5],
            yAxisID: 'y'
        });
    }
    
    // Configure chart options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: options.xLabel || 'x',
                    color: plotConfig.colors.text
                },
                grid: {
                    color: plotConfig.colors.grid
                },
                ticks: {
                    color: plotConfig.colors.text,
                    font: {
                        family: plotConfig.fontFamily,
                        size: plotConfig.fontSize
                    }
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'PDF: f(x)',
                    color: options.pdfColor || plotConfig.colors.primary
                },
                position: 'left',
                grid: {
                    color: plotConfig.colors.grid
                },
                ticks: {
                    color: options.pdfColor || plotConfig.colors.primary,
                    font: {
                        family: plotConfig.fontFamily,
                        size: plotConfig.fontSize
                    }
                },
                beginAtZero: true
            },
            y1: {
                title: {
                    display: true,
                    text: 'CDF: F(x)',
                    color: options.cdfColor || plotConfig.colors.secondary
                },
                position: 'right',
                grid: {
                    drawOnChartArea: false
                },
                ticks: {
                    color: options.cdfColor || plotConfig.colors.secondary,
                    font: {
                        family: plotConfig.fontFamily,
                        size: plotConfig.fontSize
                    }
                },
                min: 0,
                max: 1.05
            }
        },
        plugins: {
            title: {
                display: options.title !== false,
                text: options.title || getDistributionTitle(distribution, parameters),
                color: plotConfig.colors.text,
                font: {
                    family: plotConfig.fontFamily,
                    size: plotConfig.fontSize + 4,
                    weight: 'bold'
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        if (context.dataset.label === 'PDF') {
                            return `f(${context.label.toFixed(4)}) = ${context.raw.toFixed(6)}`;
                        } else if (context.dataset.label === 'CDF') {
                            return `F(${context.label.toFixed(4)}) = ${context.raw.toFixed(6)}`;
                        }
                        return context.dataset.label;
                    }
                }
            },
            legend: {
                display: options.legend !== false,
                labels: {
                    color: plotConfig.colors.text,
                    font: {
                        family: plotConfig.fontFamily,
                        size: plotConfig.fontSize
                    }
                }
            },
            annotation: mean !== undefined ? {
                annotations: {
                    meanLine: {
                        type: 'line',
                        xMin: mean,
                        xMax: mean,
                        borderColor: plotConfig.colors.highlight,
                        borderWidth: 2,
                        borderDash: [5, 5],
                        label: {
                            display: true,
                            content: `Mean: ${mean.toFixed(4)}`,
                            position: 'top',
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            color: plotConfig.colors.text,
                            font: {
                                family: plotConfig.fontFamily,
                                size: plotConfig.fontSize
                            }
                        }
                    }
                }
            } : {}
        },
        animation: {
            duration: plotConfig.animationDuration
        }
    };
    
    // Create the chart
    window[canvasId + 'Chart'] = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: chartOptions
    });
    
    return window[canvasId + 'Chart'];
}

/**
 * =============================================
 * SPECIALIZED DISTRIBUTION PLOTS
 * =============================================
 */

/**
 * Creates a standard normal distribution plot with areas highlighted
 * @param {string} canvasId - Canvas element ID
 * @param {Object} data - Distribution data
 * @param {Object} options - Additional options
 * @returns {Object} - Chart.js instance
 */
function createNormalAreaPlot(canvasId, data, options = {}) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // Destroy existing chart if it exists
    if (window[canvasId + 'Chart']) {
        window[canvasId + 'Chart'].destroy();
    }
    
    // Extract data for the plot
    const { pdf, mean, stdDev, lowerBound, upperBound, probability } = data;
    
    if (!pdf || pdf.length === 0) {
        console.error('No probability density data provided for normal area plot');
        return null;
    }
    
    // Create data points for the area to be highlighted
    const highlightedArea = pdf.map(point => {
        if (point.x >= lowerBound && point.x <= upperBound) {
            return point.y;
        }
        return 0;
    });
    
    // Set up chart data
    const chartData = {
        labels: pdf.map(point => point.x),
        datasets: [
            {
                label: 'Normal Distribution',
                data: pdf.map(point => point.y),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: plotConfig.colors.primary,
                borderWidth: 2,
                pointRadius: 0,
                fill: true,
                tension: 0.4,
                order: 2
            },
            {
                label: `Area: ${probability.toFixed(4)}`,
                data: highlightedArea,
                backgroundColor: options.areaColor || 'rgba(255, 99, 132, 0.5)',
                borderColor: options.areaColor || 'rgba(255, 99, 132, 0.8)',
                borderWidth: 1,
                pointRadius: 0,
                fill: true,
                tension: 0.4,
                order: 1
            }
        ]
    };
    
    // Configure chart options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: options.xLabel || 'x',
                    color: plotConfig.colors.text
                },
                grid: {
                    color: plotConfig.colors.grid
                },
                ticks: {
                    color: plotConfig.colors.text,
                    font: {
                        family: plotConfig.fontFamily,
                        size: plotConfig.fontSize
                    }
                }
            },
            y: {
                title: {
                    display: true,
                    text: options.yLabel || 'f(x)',
                    color: plotConfig.colors.text
                },
                grid: {
                    color: plotConfig.colors.grid
                },
                ticks: {
                    color: plotConfig.colors.text,
                    font: {
                        family: plotConfig.fontFamily,
                        size: plotConfig.fontSize
                    }
                },
                beginAtZero: true
            }
        },
        plugins: {
            title: {
                display: options.title !== false,
                text: options.title || `Normal Distribution (μ = ${mean.toFixed(4)}, σ = ${stdDev.toFixed(4)})`,
                color: plotConfig.colors.text,
                font: {
                    family: plotConfig.fontFamily,
                    size: plotConfig.fontSize + 4,
                    weight: 'bold'
                }
            },
            subtitle: {
                display: true,
                text: `P(${lowerBound.toFixed(4)} ≤ X ≤ ${upperBound.toFixed(4)}) = ${probability.toFixed(6)}`,
                color: plotConfig.colors.text,
                font: {
                    family: plotConfig.fontFamily,
                    size: plotConfig.fontSize
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return `f(${context.label.toFixed(4)}) = ${context.raw.toFixed(6)}`;
                    }
                }
            },
            legend: {
                display: options.legend !== false,
                labels: {
                    color: plotConfig.colors.text,
                    font: {
                        family: plotConfig.fontFamily,
                        size: plotConfig.fontSize
                    }
                }
            },
            annotation: {
                annotations: {
                    lowerBoundLine: {
                        type: 'line',
                        xMin: lowerBound,
                        xMax: lowerBound,
                        borderColor: options.boundColor || 'rgba(255, 99, 132, 0.8)',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        label: {
                            display: true,
                            content: `x = ${lowerBound.toFixed(4)}`,
                            position: 'top',
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            color: plotConfig.colors.text,
                            font: {
                                family: plotConfig.fontFamily,
                                size: plotConfig.fontSize - 2
                            }
                        }
                    },
                    upperBoundLine: {
                        type: 'line',
                        xMin: upperBound,
                        xMax: upperBound,
                        borderColor: options.boundColor || 'rgba(255, 99, 132, 0.8)',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        label: {
                            display: true,
                            content: `x = ${upperBound.toFixed(4)}`,
                            position: 'top',
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            color: plotConfig.colors.text,
                            font: {
                                family: plotConfig.fontFamily,
                                size: plotConfig.fontSize - 2
                            }
                        }
                    }
                }
            }
        },
        animation: {
            duration: plotConfig.animationDuration
        }
    };
    
    // Create the chart
    window[canvasId + 'Chart'] = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: chartOptions
    });
    
    return window[canvasId + 'Chart'];
}

/**
 * Creates a comparison plot for multiple distributions
 * @param {string} canvasId - Canvas element ID
 * @param {Array} distributions - Array of distribution data objects
 * @param {Object} options - Additional options
 * @returns {Object} - Chart.js instance
 */
function createDistributionComparisonPlot(canvasId, distributions, options = {}) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // Destroy existing chart if it exists
    if (window[canvasId + 'Chart']) {
        window[canvasId + 'Chart'].destroy();
    }
    
    if (!distributions || !Array.isArray(distributions) || distributions.length === 0) {
        console.error('No distribution data provided for comparison plot');
        return null;
    }
    
    // Determine if we're comparing discrete or continuous distributions
    const isDiscrete = distributions[0].type === 'discrete';
    
    // Prepare chart type and data
    let chartType = isDiscrete ? 'bar' : 'line';
    let datasets = [];
    
    // Set up a color palette for multiple distributions
    const colorPalette = [
        plotConfig.colors.primary,
        plotConfig.colors.secondary,
        plotConfig.colors.tertiary,
        plotConfig.colors.quaternary,
        plotConfig.colors.highlight,
        'rgba(255, 159, 64, 0.7)',
        'rgba(201, 203, 207, 0.7)',
        'rgba(153, 102, 255, 0.7)'
    ];
    
    // Process each distribution
    distributions.forEach((dist, index) => {
        const color = colorPalette[index % colorPalette.length];
        
        if (isDiscrete) {
            // For discrete distributions, use the probability table
            datasets.push({
                label: dist.label || getDistributionTitle(dist.distribution, dist.parameters),
                data: dist.probabilityTable.map(point => point.pmf),
                backgroundColor: color,
                borderColor: color,
                borderWidth: 1,
                barPercentage: 0.9 / distributions.length,
                categoryPercentage: 0.8,
                order: index
            });
        } else {
            // For continuous distributions, use the PDF
            datasets.push({
                label: dist.label || getDistributionTitle(dist.distribution, dist.parameters),
                data: dist.pdf.map(point => point.y),
                backgroundColor: 'transparent',
                borderColor: color,
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.4,
                order: index
            });
        }
    });
    
    // Determine x-axis labels
    let labels;
    if (isDiscrete) {
        // Get the union of all x values across distributions
        const allXValues = new Set();
        distributions.forEach(dist => {
            dist.probabilityTable.forEach(point => {
                allXValues.add(point.x);
            });
        });
        labels = Array.from(allXValues).sort((a, b) => a - b);
        
        // Remap the datasets to use the union of x values
        datasets = datasets.map((dataset, distIndex) => {
            const dist = distributions[distIndex];
            const dataMap = {};
            
            dist.probabilityTable.forEach(point => {
                dataMap[point.x] = point.pmf;
            });
            
            return {
                ...dataset,
                data: labels.map(x => dataMap[x] || 0)
            };
        });
    } else {
        // For continuous distributions, we need a common x-axis
        // Find the domain that covers all distributions
        let minX = Infinity;
        let maxX = -Infinity;
        
        distributions.forEach(dist => {
            const xValues = dist.pdf.map(point => point.x);
            minX = Math.min(minX, Math.min(...xValues));
            maxX = Math.max(maxX, Math.max(...xValues));
        });
        
        // Create a common x-axis with uniform spacing
        const numPoints = 200;
        const step = (maxX - minX) / (numPoints - 1);
        labels = Array(numPoints).fill().map((_, i) => minX + i * step);
        
        // Interpolate PDF values for each distribution
        datasets = datasets.map((dataset, distIndex) => {
            const dist = distributions[distIndex];
            const pdfMap = {};
            
            // Create a map of x to y values
            dist.pdf.forEach(point => {
                pdfMap[point.x] = point.y;
            });
            
            // Interpolate values for common x-axis
            const interpolatedData = labels.map(x => {
                // Find closest x values in the original data
                const xValues = dist.pdf.map(point => point.x);
                const closestIndex = findClosestIndex(xValues, x);
                
                if (pdfMap[x] !== undefined) {
                    return pdfMap[x];
                } else if (closestIndex < xValues.length - 1) {
                    // Linear interpolation
                    const x0 = xValues[closestIndex];
                    const x1 = xValues[closestIndex + 1];
                    const y0 = dist.pdf[closestIndex].y;
                    const y1 = dist.pdf[closestIndex + 1].y;
                    
                    return y0 + (y1 - y0) * (x - x0) / (x1 - x0);
                } else {
                    return 0;
                }
            });
            
            return {
                ...dataset,
                data: interpolatedData
            };
        });
    }
    
    // Set up chart data
    const chartData = {
        labels: labels,
        datasets: datasets
    };
    
    // Configure chart options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: options.xLabel || 'x',
                    color: plotConfig.colors.text
                },
                grid: {
                    color: plotConfig.colors.grid
                },
                ticks: {
                    color: plotConfig.colors.text,
                    font: {
                        family: plotConfig.fontFamily,
                        size: plotConfig.fontSize
                    }
                }
            },
            y: {
                title: {
                    display: true,
                    text: options.yLabel || (isDiscrete ? 'P(X = x)' : 'f(x)'),
                    color: plotConfig.colors.text
                },
                grid: {
                    color: plotConfig.colors.grid
                },
                ticks: {
                    color: plotConfig.colors.text,
                    font: {
                        family: plotConfig.fontFamily,
                        size: plotConfig.fontSize
                    }
                },
                beginAtZero: true
            }
        },
        plugins: {
            title: {
                display: options.title !== false,
                text: options.title || 'Distribution Comparison',
                color: plotConfig.colors.text,
                font: {
                    family: plotConfig.fontFamily,
                    size: plotConfig.fontSize + 4,
                    weight: 'bold'
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const x = context.label;
                        const y = context.raw;
                        return `${context.dataset.label}: ${isDiscrete ? 'P(X = ' : 'f('}${x}) = ${y.toFixed(6)}`;
                    }
                }
            },
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: plotConfig.colors.text,
                    font: {
                        family: plotConfig.fontFamily,
                        size: plotConfig.fontSize
                    }
                }
            }
        },
        animation: {
            duration: plotConfig.animationDuration
        }
    };
    
    // For discrete distribution comparison, adjust the bar layout
    if (isDiscrete && distributions.length > 1) {
        chartOptions.scales.x.stacked = false;
        chartOptions.scales.y.stacked = false;
        
        if (datasets.length <= 3) {
            // For fewer distributions, group the bars
            chartData.datasets.forEach((dataset, i) => {
                dataset.barPercentage = 0.9;
                dataset.categoryPercentage = 0.8;
            });
        } else {
            // For many distributions, make bars thinner
            chartData.datasets.forEach((dataset, i) => {
                dataset.barPercentage = 0.7;
                dataset.categoryPercentage = 0.8;
            });
        }
    }
    
    // Create the chart
    window[canvasId + 'Chart'] = new Chart(ctx, {
        type: chartType,
        data: chartData,
        options: chartOptions
    });
    
    return window[canvasId + 'Chart'];
}

/**
 * Creates a 3D visualization for multivariate distributions
 * @param {string} canvasId - Canvas element ID
 * @param {Object} data - Distribution data
 * @param {Object} options - Additional options
 * @returns {Object} - Chart.js instance or 3D plot object
 */
function createMultivariateDistributionPlot(canvasId, data, options = {}) {
    // Check if we need to use a 3D library
    if (data.dimension === 3) {
        // For 3D, we would use a different library like Plotly.js
        console.warn('3D plots are not implemented in the current version');
        return null;
    }
    
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // Destroy existing chart if it exists
    if (window[canvasId + 'Chart']) {
        window[canvasId + 'Chart'].destroy();
    }
    
    // For 2D distributions (like bivariate normal)
    if (data.dimension === 2) {
        // This would be a contour plot
        // We'll use a simplified heatmap approach with Chart.js
        
        // Extract data
        const { xValues, yValues, densityMatrix, xLabel, yLabel } = data;
        
        if (!xValues || !yValues || !densityMatrix) {
            console.error('Missing data for multivariate plot');
            return null;
        }
        
        // Convert the density matrix to a format Chart.js can use
        const datasets = [];
        
        // For each x value, create a dataset
        for (let i = 0; i < xValues.length; i++) {
            datasets.push({
                label: `x = ${xValues[i].toFixed(2)}`,
                data: densityMatrix[i].map((value, j) => ({ x: yValues[j], y: value })),
                showLine: true,
                borderColor: getGradientColor(i / xValues.length),
                backgroundColor: 'transparent',
                pointRadius: 0,
                tension: 0.4
            });
        }
        
        // Set up chart data
        const chartData = {
            datasets: datasets
        };
        
        // Configure chart options
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: true,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: xLabel || 'x₂',
                        color: plotConfig.colors.text
                    },
                    grid: {
                        color: plotConfig.colors.grid
                    },
                    ticks: {
                        color: plotConfig.colors.text,
                        font: {
                            family: plotConfig.fontFamily,
                            size: plotConfig.fontSize
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: yLabel || 'Density',
                        color: plotConfig.colors.text
                    },
                    grid: {
                        color: plotConfig.colors.grid
                    },
                    ticks: {
                        color: plotConfig.colors.text,
                        font: {
                            family: plotConfig.fontFamily,
                            size: plotConfig.fontSize
                        }
                    },
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: options.title !== false,
                    text: options.title || 'Bivariate Distribution',
                    color: plotConfig.colors.text,
                    font: {
                        family: plotConfig.fontFamily,
                        size: plotConfig.fontSize + 4,
                        weight: 'bold'
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `(${context.parsed.x.toFixed(4)}, ${context.parsed.y.toFixed(6)})`;
                        }
                    }
                },
                legend: {
                    display: false
                }
            },
            animation: {
                duration: plotConfig.animationDuration
            }
        };
        
        // Create the chart
        window[canvasId + 'Chart'] = new Chart(ctx, {
            type: 'scatter',
            data: chartData,
            options: chartOptions
        });
        
        return window[canvasId + 'Chart'];
    }
    
    // For 1D distributions, just use regular distribution plots
    return createPDFPlot(canvasId, data, options);
}

/**
 * =============================================
 * MONTE CARLO SIMULATION PLOTS
 * =============================================
 */

/**
 * Creates a histogram plot for Monte Carlo simulation results
 * @param {string} canvasId - Canvas element ID
 * @param {Object} data - Simulation data
 * @param {Object} options - Additional options
 * @returns {Object} - Chart.js instance
 */
function createMonteCarloHistogramPlot(canvasId, data, options = {}) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // Destroy existing chart if it exists
    if (window[canvasId + 'Chart']) {
        window[canvasId + 'Chart'].destroy();
    }
    
    // Extract data
    const { histogramData, theoreticalMean, distribution, parameters } = data;
    
    if (!histogramData || histogramData.length === 0) {
        console.error('No histogram data provided for Monte Carlo plot');
        return null;
    }
    
    // Determine if we're dealing with discrete or continuous data
    const isDiscrete = distribution === 'binomial' || 
                      distribution === 'poisson' || 
                      distribution === 'geometric' ||
                      histogramData[0].value !== undefined;
    
    // Set up labels and data
    let labels, values;
    
    if (isDiscrete) {
        // For discrete distributions, use the values directly
        labels = histogramData.map(bin => bin.value);
        values = histogramData.map(bin => bin.relativeFrequency);
    } else {
        // For continuous distributions, use bin centers
        labels = histogramData.map(bin => (bin.binStart + bin.binEnd) / 2);
        values = histogramData.map(bin => bin.relativeFrequency);
    }
    
    // Set up chart data
    const chartData = {
        labels: labels,
        datasets: [{
            label: 'Simulated Frequency',
            data: values,
            backgroundColor: options.color || plotConfig.colors.primary,
            borderColor: options.borderColor || plotConfig.colors.primary,
            borderWidth: 1
        }]
    };
    
    // Add theoretical distribution curve if applicable
    if (theoreticalMean !== undefined && !isDiscrete) {
        // Generate theoretical curve based on distribution type
        const theoreticalValues = generateTheoreticalCurve(distribution, parameters, labels);
        
        if (theoreticalValues && theoreticalValues.length > 0) {
            chartData.datasets.push({
                label: 'Theoretical Distribution',
                data: theoreticalValues,
                type: 'line',
                borderColor: options.theoreticalColor || plotConfig.colors.secondary,
                backgroundColor: 'transparent',
                borderWidth: 2,
                pointRadius: 0,
                tension: 0.4
            });
        }
    }
    
    // Configure chart options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: options.xLabel || 'Value',
                    color: plotConfig.colors.text
                },
                grid: {
                    color: plotConfig.colors.grid
                },
                ticks: {
                    color: plotConfig.colors.text,
                    font: {
                        family: plotConfig.fontFamily,
                        size: plotConfig.fontSize
                    }
                }
            },
            y: {
                title: {
                    display: true,
                    text: options.yLabel || 'Relative Frequency',
                    color: plotConfig.colors.text
                },
                grid: {
                    color: plotConfig.colors.grid
                },
                ticks: {
                    color: plotConfig.colors.text,
                    font: {
                        family: plotConfig.fontFamily,
                        size: plotConfig.fontSize
                    }
                },
                beginAtZero: true
            }
        },
        plugins: {
            title: {
                display: options.title !== false,
                text: options.title || `Monte Carlo Simulation: ${getDistributionTitle(distribution, parameters)}`,
                color: plotConfig.colors.text,
                font: {
                    family: plotConfig.fontFamily,
                    size: plotConfig.fontSize + 4,
                    weight: 'bold'
                }
            },
            subtitle: {
                display: theoreticalMean !== undefined,
                text: `Theoretical Mean: ${theoreticalMean !== undefined ? theoreticalMean.toFixed(4) : 'N/A'}`,
                color: plotConfig.colors.text,
                font: {
                    family: plotConfig.fontFamily,
                    size: plotConfig.fontSize
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        if (isDiscrete) {
                            return `Value: ${context.label}, Frequency: ${(context.raw * 100).toFixed(2)}%`;
                        } else {
                            const bin = histogramData[context.dataIndex];
                            return `Range: [${bin.binStart.toFixed(4)}, ${bin.binEnd.toFixed(4)}], Frequency: ${(context.raw * 100).toFixed(2)}%`;
                        }
                    }
                }
            },
            legend: {
                display: chartData.datasets.length > 1,
                labels: {
                    color: plotConfig.colors.text,
                    font: {
                        family: plotConfig.fontFamily,
                        size: plotConfig.fontSize
                    }
                }
            }
        },
        animation: {
            duration: plotConfig.animationDuration
        }
    };
    
    // Create the chart
    window[canvasId + 'Chart'] = new Chart(ctx, {
        type: isDiscrete ? 'bar' : 'bar',
        data: chartData,
        options: chartOptions
    });
    
    return window[canvasId + 'Chart'];
}

/**
 * Creates a convergence plot for Monte Carlo simulation results
 * @param {string} canvasId - Canvas element ID
 * @param {Object} data - Simulation data
 * @param {Object} options - Additional options
 * @returns {Object} - Chart.js instance
 */
function createConvergencePlot(canvasId, data, options = {}) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // Destroy existing chart if it exists
    if (window[canvasId + 'Chart']) {
        window[canvasId + 'Chart'].destroy();
    }
    
    // Extract data
    const { convergenceData, theoreticalMean, theoreticalVariance, distribution, parameters } = data;
    
    if (!convergenceData || convergenceData.length === 0) {
        console.error('No convergence data provided for Monte Carlo plot');
        return null;
    }
    
    // Set up chart data
    const chartData = {
        labels: convergenceData.map(point => point.sampleSize),
        datasets: [
            {
                label: 'Sample Mean',
                data: convergenceData.map(point => point.mean),
                backgroundColor: 'transparent',
                borderColor: options.meanColor || plotConfig.colors.primary,
                borderWidth: 2,
                pointRadius: function(context) {
                    // Show fewer points for better readability
                    return context.dataIndex % 2 === 0 ? 3 : 0;
                },
                tension: 0.4,
                yAxisID: 'y'
            },
            {
                label: 'Sample Variance',
                data: convergenceData.map(point => point.variance),
                backgroundColor: 'transparent',
                borderColor: options.varianceColor || plotConfig.colors.secondary,
                borderWidth: 2,
                pointRadius: function(context) {
                    return context.dataIndex % 2 === 0 ? 3 : 0;
                },
                tension: 0.4,
                yAxisID: 'y1'
            },
            {
                label: 'Mean Error',
                data: convergenceData.map(point => point.meanError),
                backgroundColor: 'transparent',
                borderColor: options.errorColor || plotConfig.colors.tertiary,
                borderWidth: 2,
                pointRadius: function(context) {
                    return context.dataIndex % 2 === 0 ? 3 : 0;
                },
                tension: 0.4,
                yAxisID: 'y2',
                hidden: true
            }
        ]
    };
    
    // Add theoretical reference lines
    if (theoreticalMean !== undefined) {
        chartData.datasets.push({
            label: 'Theoretical Mean',
            data: convergenceData.map(() => theoreticalMean),
            backgroundColor: 'transparent',
            borderColor: options.theoreticalColor || plotConfig.colors.highlight,
            borderWidth: 2,
            borderDash: [5, 5],
            pointRadius: 0,
            yAxisID: 'y'
        });
    }
    
    if (theoreticalVariance !== undefined) {
        chartData.datasets.push({
            label: 'Theoretical Variance',
            data: convergenceData.map(() => theoreticalVariance),
            backgroundColor: 'transparent',
            borderColor: options.theoreticalColor || plotConfig.colors.highlight,
            borderWidth: 2,
            borderDash: [5, 5],
            pointRadius: 0,
            yAxisID: 'y1'
        });
    }
    
    // Configure chart options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            x: {
                type: 'logarithmic',
                title: {
                    display: true,
                    text: options.xLabel || 'Sample Size',
                    color: plotConfig.colors.text
                },
                grid: {
                    color: plotConfig.colors.grid
                },
                ticks: {
                    color: plotConfig.colors.text,
                    font: {
                        family: plotConfig.fontFamily,
                        size: plotConfig.fontSize
                    },
                    callback: function(value) {
                        if (value === 10 || value === 100 || value === 1000 || value === 10000 || value === 100000 || value === 1000000) {
                            return value.toString();
                        }
                        return '';
                    }
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Sample Mean',
                    color: options.meanColor || plotConfig.colors.primary
                },
                position: 'left',
                grid: {
                    color: plotConfig.colors.grid
                },
                ticks: {
                    color: options.meanColor || plotConfig.colors.primary,
                    font: {
                        family: plotConfig.fontFamily,
                        size: plotConfig.fontSize
                    }
                }
            },
            y1: {
                title: {
                    display: true,
                    text: 'Sample Variance',
                    color: options.varianceColor || plotConfig.colors.secondary
                },
                position: 'right',
                grid: {
                    drawOnChartArea: false
                },
                ticks: {
                    color: options.varianceColor || plotConfig.colors.secondary,
                    font: {
                        family: plotConfig.fontFamily,
                        size: plotConfig.fontSize
                    }
                }
            },
            y2: {
                title: {
                    display: true,
                    text: 'Error Rate',
                    color: options.errorColor || plotConfig.colors.tertiary
                },
                position: 'right',
                grid: {
                    drawOnChartArea: false
                },
                ticks: {
                    color: options.errorColor || plotConfig.colors.tertiary,
                    font: {
                        family: plotConfig.fontFamily,
                        size: plotConfig.fontSize
                    }
                },
                display: false // Initially hidden
            }
        },
        plugins: {
            title: {
                display: options.title !== false,
                text: options.title || `Convergence Plot: ${getDistributionTitle(distribution, parameters)}`,
                color: plotConfig.colors.text,
                font: {
                    family: plotConfig.fontFamily,
                    size: plotConfig.fontSize + 4,
                    weight: 'bold'
                }
            },
            subtitle: {
                display: theoreticalMean !== undefined,
                text: `Theoretical Mean: ${theoreticalMean !== undefined ? theoreticalMean.toFixed(4) : 'N/A'}, Variance: ${theoreticalVariance !== undefined ? theoreticalVariance.toFixed(4) : 'N/A'}`,
                color: plotConfig.colors.text,
                font: {
                    family: plotConfig.fontFamily,
                    size: plotConfig.fontSize
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const label = context.dataset.label || '';
                        const value = context.raw.toFixed(6);
                        return `${label}: ${value}`;
                    }
                }
            },
            legend: {
                display: true,
                labels: {
                    color: plotConfig.colors.text,
                    font: {
                        family: plotConfig.fontFamily,
                        size: plotConfig.fontSize
                    }
                }
            }
        },
        animation: {
            duration: plotConfig.animationDuration
        }
    };
    
    // Create the chart
    window[canvasId + 'Chart'] = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: chartOptions
    });
    
    return window[canvasId + 'Chart'];
}

/**
 * Creates a time series plot for simulated random variables
 * @param {string} canvasId - Canvas element ID
 * @param {Object} data - Simulation data
 * @param {Object} options - Additional options
 * @returns {Object} - Chart.js instance
 */
function createTimeSeriesPlot(canvasId, data, options = {}) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // Destroy existing chart if it exists
    if (window[canvasId + 'Chart']) {
        window[canvasId + 'Chart'].destroy();
    }
    
    // Extract data
    const { samples, theoreticalMean, distribution, parameters } = data;
    
    if (!samples || samples.length === 0) {
        console.error('No sample data provided for time series plot');
        return null;
    }
    
    // For time series, we'll plot each sample against its index
    const timeIndices = Array.from({ length: samples.length }, (_, i) => i + 1);
    
    // Set up chart data
    const chartData = {
        labels: timeIndices,
        datasets: [{
            label: 'Sample Values',
            data: samples,
            backgroundColor: 'transparent',
            borderColor: options.color || plotConfig.colors.primary,
            borderWidth: 1,
            pointRadius: function(context) {
                // Show fewer points for better readability
                const decimation = Math.ceil(samples.length / 100);
                return context.dataIndex % decimation === 0 ? 3 : 0;
            },
            tension: 0.1
        }]
    };
    
    // Add mean line if theoretical mean is available
    if (theoreticalMean !== undefined) {
        chartData.datasets.push({
            label: 'Theoretical Mean',
            data: timeIndices.map(() => theoreticalMean),
            backgroundColor: 'transparent',
            borderColor: options.meanColor || plotConfig.colors.highlight,
            borderWidth: 2,
            borderDash: [5, 5],
            pointRadius: 0
        });
        
        // Add running average
        const runningAvg = [];
        let sum = 0;
        for (let i = 0; i < samples.length; i++) {
            sum += samples[i];
            runningAvg.push(sum / (i + 1));
        }
        
        chartData.datasets.push({
            label: 'Running Average',
            data: runningAvg,
            backgroundColor: 'transparent',
            borderColor: options.avgColor || plotConfig.colors.secondary,
            borderWidth: 2,
            pointRadius: 0
        });
    }
    
    // Configure chart options
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: options.xLabel || 'Sample Index',
                    color: plotConfig.colors.text
                },
                grid: {
                    color: plotConfig.colors.grid
                },
                ticks: {
                    color: plotConfig.colors.text,
                    font: {
                        family: plotConfig.fontFamily,
                        size: plotConfig.fontSize
                    },
                    maxTicksLimit: 10
                }
            },
            y: {
                title: {
                    display: true,
                    text: options.yLabel || 'Value',
                    color: plotConfig.colors.text
                },
                grid: {
                    color: plotConfig.colors.grid
                },
                ticks: {
                    color: plotConfig.colors.text,
                    font: {
                        family: plotConfig.fontFamily,
                        size: plotConfig.fontSize
                    }
                }
            }
        },
        plugins: {
            title: {
                display: options.title !== false,
                text: options.title || `Time Series Plot: ${getDistributionTitle(distribution, parameters)}`,
                color: plotConfig.colors.text,
                font: {
                    family: plotConfig.fontFamily,
                    size: plotConfig.fontSize + 4,
                    weight: 'bold'
                }
            },
            subtitle: {
                display: theoreticalMean !== undefined,
                text: `Theoretical Mean: ${theoreticalMean !== undefined ? theoreticalMean.toFixed(4) : 'N/A'}`,
                color: plotConfig.colors.text,
                font: {
                    family: plotConfig.fontFamily,
                    size: plotConfig.fontSize
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false
            },
            legend: {
                display: chartData.datasets.length > 1,
                labels: {
                    color: plotConfig.colors.text,
                    font: {
                        family: plotConfig.fontFamily,
                        size: plotConfig.fontSize
                    }
                }
            }
        },
        animation: {
            duration: plotConfig.animationDuration
        }
    };
    
    // Create the chart
    window[canvasId + 'Chart'] = new Chart(ctx, {
        type: 'line',
        data: chartData,
        options: chartOptions
    });
    
    return window[canvasId + 'Chart'];
}

/**
 * =============================================
 * HELPER FUNCTIONS
 * =============================================
 */

/**
 * Gets a descriptive title for a probability distribution
 * @param {string} distribution - Distribution name
 * @param {Object} parameters - Distribution parameters
 * @returns {string} - Formatted title
 */
function getDistributionTitle(distribution, parameters) {
    if (!distribution) {
        return 'Probability Distribution';
    }
    
    switch (distribution.toLowerCase()) {
        case 'bernoulli':
            return `Bernoulli Distribution (p = ${parameters.p})`;
        case 'binomial':
            return `Binomial Distribution (n = ${parameters.n}, p = ${parameters.p})`;
        case 'geometric':
            return `Geometric Distribution (p = ${parameters.p})`;
        case 'poisson':
            return `Poisson Distribution (λ = ${parameters.lambda})`;
        case 'negative_binomial':
        case 'negativebinomial':
            return `Negative Binomial Distribution (r = ${parameters.r}, p = ${parameters.p})`;
        case 'hypergeometric':
            return `Hypergeometric Distribution (N = ${parameters.N}, K = ${parameters.K}, n = ${parameters.n})`;
        case 'uniform':
            return `Uniform Distribution (${parameters.a}, ${parameters.b})`;
        case 'normal':
            return `Normal Distribution (μ = ${parameters.mean}, σ = ${parameters.stdDev})`;
        case 'exponential':
            return `Exponential Distribution (λ = ${parameters.rate})`;
        case 'gamma':
            return `Gamma Distribution (α = ${parameters.shape}, β = ${parameters.rate})`;
        case 'beta':
            return `Beta Distribution (α = ${parameters.alpha}, β = ${parameters.beta})`;
        case 'weibull':
            return `Weibull Distribution (k = ${parameters.shape}, λ = ${parameters.scale})`;
        case 'lognormal':
            return `Log-normal Distribution (μ = ${parameters.mu}, σ = ${parameters.sigma})`;
        case 'pareto':
            return `Pareto Distribution (α = ${parameters.alpha}, xm = ${parameters.xm})`;
        default:
            return `${distribution.charAt(0).toUpperCase() + distribution.slice(1)} Distribution`;
    }
}

/**
 * Generates theoretical curve values based on the distribution
 * @param {string} distribution - Distribution name
 * @param {Object} parameters - Distribution parameters
 * @param {Array} xValues - X-axis values
 * @returns {Array} - Theoretical y-values
 */
function generateTheoreticalCurve(distribution, parameters, xValues) {
    if (!distribution || !parameters || !xValues || xValues.length === 0) {
        return null;
    }
    
    // Calculate theoretical PDF values based on distribution type
    const theoreticalValues = [];
    
    switch (distribution.toLowerCase()) {
        case 'normal':
            const mean = parameters.mean || 0;
            const stdDev = parameters.stdDev || 1;
            
            for (const x of xValues) {
                const z = (x - mean) / stdDev;
                const pdf = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * 
                            Math.exp(-0.5 * z * z);
                theoreticalValues.push(pdf);
            }
            break;
            
        case 'uniform':
            const a = parameters.a || 0;
            const b = parameters.b || 1;
            const range = b - a;
            
            for (const x of xValues) {
                const pdf = (x >= a && x <= b) ? 1 / range : 0;
                theoreticalValues.push(pdf);
            }
            break;
            
        case 'exponential':
            const rate = parameters.rate || 1;
            
            for (const x of xValues) {
                const pdf = (x >= 0) ? rate * Math.exp(-rate * x) : 0;
                theoreticalValues.push(pdf);
            }
            break;
            
        case 'gamma':
            const shape = parameters.shape || 1;
            const rateGamma = parameters.rate || 1;
            
            for (const x of xValues) {
                if (x <= 0) {
                    theoreticalValues.push(0);
                } else {
                    // Simplified gamma PDF calculation
                    const pdf = Math.pow(rateGamma, shape) * 
                                Math.pow(x, shape - 1) * 
                                Math.exp(-rateGamma * x) / 
                                gammaFunction(shape);
                    theoreticalValues.push(pdf);
                }
            }
            break;
            
        default:
            // For unsupported distributions, return null
            return null;
    }
    
    return theoreticalValues;
}

/**
 * Approximates the gamma function for positive values
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
 * Calculates the factorial of a non-negative integer
 * @param {number} n - Non-negative integer
 * @returns {number} - Factorial value
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
 * Finds the index of the closest value in an array
 * @param {Array} array - Array of values
 * @param {number} value - Target value
 * @returns {number} - Index of closest value
 */
function findClosestIndex(array, value) {
    if (!array || array.length === 0) {
        return -1;
    }
    
    let closestIndex = 0;
    let closestDiff = Math.abs(array[0] - value);
    
    for (let i = 1; i < array.length; i++) {
        const diff = Math.abs(array[i] - value);
        if (diff < closestDiff) {
            closestDiff = diff;
            closestIndex = i;
        }
    }
    
    return closestIndex;
}

/**
 * Generates a color from a gradient based on position
 * @param {number} position - Position in the gradient (0 to 1)
 * @returns {string} - Color in rgba format
 */
function getGradientColor(position) {
    // Gradient from blue to red
    const r = Math.round(position * 255);
    const g = Math.round(100 - position * 50);
    const b = Math.round(255 - position * 255);
    
    return `rgba(${r}, ${g}, ${b}, 0.7)`;
}

/**
 * Export all plotting functions
 */
export {
    createPMFPlot,
    createCDFPlot,
    createCombinedDiscretePlot,
    createPDFPlot,
    createContinuousCDFPlot,
    createCombinedContinuousPlot,
    createNormalAreaPlot,
    createDistributionComparisonPlot,
    createMultivariateDistributionPlot,
    createMonteCarloHistogramPlot,
    createConvergencePlot,
    createTimeSeriesPlot
};