document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables for charts
    let distributionChart = null;
    
    // Distribution type change handler
    const distributionTypeSelect = document.getElementById('distribution-type');
    distributionTypeSelect.addEventListener('change', function() {
        if (this.value === 'discrete') {
            document.getElementById('discrete-distributions').style.display = 'block';
            document.getElementById('continuous-distributions').style.display = 'none';
            document.getElementById('custom-distribution').style.display = 'none';
            updateDiscreteParams();
        } else if (this.value === 'continuous') {
            document.getElementById('discrete-distributions').style.display = 'none';
            document.getElementById('continuous-distributions').style.display = 'block';
            document.getElementById('custom-distribution').style.display = 'none';
            updateContinuousParams();
        } else if (this.value === 'custom') {
            document.getElementById('discrete-distributions').style.display = 'none';
            document.getElementById('continuous-distributions').style.display = 'none';
            document.getElementById('custom-distribution').style.display = 'block';
            updateCustomParams();
        }
        
        // Reset the form and clear results
        resetCalculator();
    });
    
    // Discrete distribution change handler
    const discreteDistSelect = document.getElementById('discrete-distribution');
    discreteDistSelect.addEventListener('change', function() {
        updateDiscreteParams();
        resetCalculator();
    });
    
    // Continuous distribution change handler
    const continuousDistSelect = document.getElementById('continuous-distribution');
    continuousDistSelect.addEventListener('change', function() {
        updateContinuousParams();
        resetCalculator();
    });
    
    // Custom distribution type change handler
    const customTypeSelect = document.getElementById('custom-type');
    customTypeSelect.addEventListener('change', function() {
        if (this.value === 'discrete') {
            document.getElementById('custom-discrete').style.display = 'block';
            document.getElementById('custom-continuous').style.display = 'none';
        } else {
            document.getElementById('custom-discrete').style.display = 'none';
            document.getElementById('custom-continuous').style.display = 'block';
        }
        resetCalculator();
    });
    
    // Custom continuous function change handler
    const customFunctionSelect = document.getElementById('custom-continuous-function');
    customFunctionSelect.addEventListener('change', function() {
        document.getElementById('custom-linear-params').style.display = 'none';
        document.getElementById('custom-quadratic-params').style.display = 'none';
        document.getElementById('custom-exponential-params').style.display = 'none';
        
        document.getElementById(`custom-${this.value}-params`).style.display = 'block';
        resetCalculator();
    });
    
    // Calculate button handler
    document.getElementById('calculate-btn').addEventListener('click', function() {
        calculateExpectedValue();
    });
    
    // Reset button handler
    document.getElementById('reset-btn').addEventListener('click', function() {
        resetCalculator();
    });
    
    // Show/hide steps handler
    document.getElementById('show-steps-btn').addEventListener('click', function() {
        const stepsElement = document.getElementById('solution-steps');
        if (stepsElement.style.display === 'none') {
            stepsElement.style.display = 'block';
            this.innerHTML = '<i class="fas fa-list-ol me-2"></i>Hide Steps';
        } else {
            stepsElement.style.display = 'none';
            this.innerHTML = '<i class="fas fa-list-ol me-2"></i>Show Steps';
        }
    });
    
    // Quiz handlers
    document.querySelectorAll('.quiz-option').forEach(option => {
        option.addEventListener('click', function() {
            // Deselect all options in the same question
            const questionDiv = this.closest('.quiz-question');
            questionDiv.querySelectorAll('.quiz-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Select this option
            this.classList.add('selected');
        });
    });
    
    document.getElementById('check-answers-btn').addEventListener('click', function() {
        checkQuizAnswers();
    });
    
    // Initialize with default values
    updateDiscreteParams();
    initializeChart();
    
    function updateDiscreteParams() {
        const selected = document.getElementById('discrete-distribution').value;
        
        // Hide all parameter divs
        document.querySelectorAll('#discrete-params > div').forEach(div => {
            div.style.display = 'none';
        });
        
        // Show the selected distribution's parameters
        document.getElementById(`${selected}-params`).style.display = 'block';
        
        // Update distribution info
        updateDistributionInfo(selected);
        
        // Update chart
        updateChart(selected);
    }
    
    function updateContinuousParams() {
        const selected = document.getElementById('continuous-distribution').value;
        
        // Hide all parameter divs
        document.querySelectorAll('#continuous-params > div').forEach(div => {
            div.style.display = 'none';
        });
        
        // Show the selected distribution's parameters
        document.getElementById(`${selected}-params`).style.display = 'block';
        
        // Update distribution info
        updateDistributionInfo(selected);
        
        // Update chart
        updateChart(selected);
    }
    
    function updateCustomParams() {
        const selected = document.getElementById('custom-type').value;
        
        if (selected === 'discrete') {
            document.getElementById('custom-discrete').style.display = 'block';
            document.getElementById('custom-continuous').style.display = 'none';
        } else {
            document.getElementById('custom-discrete').style.display = 'none';
            document.getElementById('custom-continuous').style.display = 'block';
            
            // Update the function params
            const func = document.getElementById('custom-continuous-function').value;
            document.getElementById('custom-linear-params').style.display = 'none';
            document.getElementById('custom-quadratic-params').style.display = 'none';
            document.getElementById('custom-exponential-params').style.display = 'none';
            document.getElementById(`custom-${func}-params`).style.display = 'block';
        }
        
        // Update distribution info
        updateDistributionInfo('custom');
        
        // Update chart
        updateChart('custom');
    }
    
    function initializeChart() {
        const ctx = document.getElementById('distribution-chart').getContext('2d');
        
        // Default data for initial chart (Bernoulli)
        const p = parseFloat(document.getElementById('bernoulli-p').value);
        const labels = ['0', '1'];
        const data = [1 - p, p];
        
        // Create the chart
        distributionChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Probability',
                    data: data,
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Value',
                            color: '#fff'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#fff'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Probability',
                            color: '#fff'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        },
                        ticks: {
                            color: '#fff'
                        },
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: '#fff'
                        }
                    },
                    tooltip: {
                        callbacks: {
                            title: function(tooltipItems) {
                                return `Value: ${tooltipItems[0].label}`;
                            },
                            label: function(context) {
                                return `Probability: ${context.parsed.y.toFixed(4)}`;
                            }
                        }
                    }
                }
            }
        });
        
        // Add expected value line
        drawExpectedValueLine(p);
    }
    
    function updateChart(distribution) {
        // Clear previous chart
        if (distributionChart) {
            distributionChart.destroy();
        }
        
        const ctx = document.getElementById('distribution-chart').getContext('2d');
        let chartData, chartOptions;
        
        // Get chart data based on distribution type
        const distType = document.getElementById('distribution-type').value;
        
        if (distType === 'discrete') {
            switch (distribution) {
                case 'bernoulli':
                    ({ chartData, chartOptions } = createBernoulliChartData());
                    break;
                case 'binomial':
                    ({ chartData, chartOptions } = createBinomialChartData());
                    break;
                case 'geometric':
                    ({ chartData, chartOptions } = createGeometricChartData());
                    break;
                case 'poisson':
                    ({ chartData, chartOptions } = createPoissonChartData());
                    break;
            }
        } else if (distType === 'continuous') {
            switch (distribution) {
                case 'uniform':
                    ({ chartData, chartOptions } = createUniformChartData());
                    break;
                case 'normal':
                    ({ chartData, chartOptions } = createNormalChartData());
                    break;
                case 'exponential':
                    ({ chartData, chartOptions } = createExponentialChartData());
                    break;
            }
        } else if (distType === 'custom') {
            if (document.getElementById('custom-type').value === 'discrete') {
                ({ chartData, chartOptions } = createCustomDiscreteChartData());
            } else {
                ({ chartData, chartOptions } = createCustomContinuousChartData());
            }
        }
        
        // Create new chart
        if (chartData && chartOptions) {
            const chartType = distType === 'discrete' || 
                             (distType === 'custom' && document.getElementById('custom-type').value === 'discrete') 
                             ? 'bar' : 'line';
            
            distributionChart = new Chart(ctx, {
                type: chartType,
                data: chartData,
                options: chartOptions
            });
        }
    }
    
    function createBernoulliChartData() {
        const p = parseFloat(document.getElementById('bernoulli-p').value);
        const expectedValue = p;
        
        const chartData = {
            labels: ['0', '1'],
            datasets: [{
                label: 'Probability',
                data: [1 - p, p],
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        };
        
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Value',
                        color: '#fff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#fff'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Probability',
                        color: '#fff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#fff'
                    },
                    beginAtZero: true,
                    max: 1.1
                }
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#fff'
                    }
                },
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            return `Value: ${tooltipItems[0].label}`;
                        },
                        label: function(context) {
                            return `Probability: ${context.parsed.y.toFixed(4)}`;
                        }
                    }
                }
            }
        };
        
        // Draw expected value line after chart creation
        setTimeout(() => {
            drawExpectedValueLine(expectedValue);
        }, 100);
        
        return { chartData, chartOptions };
    }
    
    function createBinomialChartData() {
        const n = parseInt(document.getElementById('binomial-n').value);
        const p = parseFloat(document.getElementById('binomial-p').value);
        const expectedValue = n * p;
        
        const labels = [];
        const data = [];
        
        for (let k = 0; k <= n; k++) {
            labels.push(k.toString());
            data.push(binomialPMF(n, p, k));
        }
        
        const chartData = {
            labels: labels,
            datasets: [{
                label: 'Probability',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        };
        
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Number of Successes (k)',
                        color: '#fff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#fff'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Probability P(X = k)',
                        color: '#fff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#fff'
                    },
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#fff'
                    }
                },
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            return `k = ${tooltipItems[0].label}`;
                        },
                        label: function(context) {
                            return `P(X = ${context.label}) = ${context.parsed.y.toFixed(4)}`;
                        }
                    }
                }
            }
        };
        
        // Draw expected value line after chart creation
        setTimeout(() => {
            drawExpectedValueLine(expectedValue);
        }, 100);
        
        return { chartData, chartOptions };
    }
    
    // Function to calculate Binomial PMF: P(X = k)
    function binomialPMF(n, p, k) {
        return binomialCoefficient(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
    }
    
    // Function to calculate binomial coefficient (n choose k)
    function binomialCoefficient(n, k) {
        if (k < 0 || k > n) return 0;
        if (k === 0 || k === n) return 1;
        
        // Use symmetry to reduce calculations
        if (k > n - k) k = n - k;
        
        let result = 1;
        for (let i = 1; i <= k; i++) {
            result *= (n - (k - i));
            result /= i;
        }
        
        return Math.round(result);
    }
    
    function createGeometricChartData() {
        const p = parseFloat(document.getElementById('geometric-p').value);
        const expectedValue = 1 / p;
        
        // Generate data for geometric distribution
        const maxX = Math.min(Math.ceil(3 / p), 30);  // Limit to reasonable range
        const labels = [];
        const data = [];
        
        for (let k = 1; k <= maxX; k++) {
            labels.push(k.toString());
            data.push(geometricPMF(p, k));
        }
        
        const chartData = {
            labels: labels,
            datasets: [{
                label: 'Probability',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        };
        
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Number of Trials Until First Success',
                        color: '#fff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#fff'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Probability P(X = k)',
                        color: '#fff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#fff'
                    },
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#fff'
                    }
                },
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            return `k = ${tooltipItems[0].label}`;
                        },
                        label: function(context) {
                            return `P(X = ${context.label}) = ${context.parsed.y.toFixed(4)}`;
                        }
                    }
                }
            }
        };
        
        // Draw expected value line after chart creation
        setTimeout(() => {
            drawExpectedValueLine(expectedValue);
        }, 100);
        
        return { chartData, chartOptions };
    }
    
    function geometricPMF(p, k) {
        return p * Math.pow(1 - p, k - 1);
    }
    
    function createPoissonChartData() {
        const lambda = parseFloat(document.getElementById('poisson-lambda').value);
        const expectedValue = lambda;
        
        // Generate data for Poisson distribution
        const maxX = Math.min(Math.ceil(lambda * 3), 30);
        const labels = [];
        const data = [];
        
        for (let k = 0; k <= maxX; k++) {
            labels.push(k.toString());
            data.push(poissonPMF(lambda, k));
        }
        
        const chartData = {
            labels: labels,
            datasets: [{
                label: 'Probability',
                data: data,
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        };
        
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Number of Events (k)',
                        color: '#fff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#fff'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Probability P(X = k)',
                        color: '#fff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#fff'
                    },
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#fff'
                    }
                },
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            return `k = ${tooltipItems[0].label}`;
                        },
                        label: function(context) {
                            return `P(X = ${context.label}) = ${context.parsed.y.toFixed(4)}`;
                        }
                    }
                }
            }
        };
        
        // Draw expected value line after chart creation
        setTimeout(() => {
            drawExpectedValueLine(expectedValue);
        }, 100);
        
        return { chartData, chartOptions };
    }
    
    function poissonPMF(lambda, k) {
        return Math.exp(-lambda) * Math.pow(lambda, k) / factorial(k);
    }
    
    function factorial(n) {
        if (n === 0 || n === 1) return 1;
        let result = 1;
        for (let i = 2; i <= n; i++) {
            result *= i;
        }
        return result;
    }
    
    // Continuous distributions
    function createUniformChartData() {
        const a = parseFloat(document.getElementById('uniform-a').value);
        const b = parseFloat(document.getElementById('uniform-b').value);
        const expectedValue = (a + b) / 2;
        
        // Generate points for uniform PDF
        const points = 100;
        const step = (b - a + 2) / points;
        const labels = [];
        const data = [];
        
        for (let i = 0; i <= points; i++) {
            const x = a - 1 + i * step;
            labels.push(x.toFixed(2));
            data.push(uniformPDF(x, a, b));
        }
        
        const chartData = {
            labels: labels,
            datasets: [{
                label: 'PDF',
                data: data,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderWidth: 2,
                pointRadius: 0,
                fill: true
            }]
        };
        
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'x',
                        color: '#fff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#fff'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'f(x)',
                        color: '#fff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#fff'
                    },
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#fff'
                    }
                },
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            return `x = ${tooltipItems[0].label}`;
                        },
                        label: function(context) {
                            return `f(x) = ${context.parsed.y.toFixed(4)}`;
                        }
                    }
                }
            }
        };
        
        // Draw expected value line after chart creation
        setTimeout(() => {
            drawExpectedValueLine(expectedValue);
        }, 100);
        
        return { chartData, chartOptions };
    }
    
    function uniformPDF(x, a, b) {
        if (x < a || x > b) return 0;
        return 1 / (b - a);
    }
    
    function createNormalChartData() {
        const mean = parseFloat(document.getElementById('normal-mean').value);
        const stdDev = parseFloat(document.getElementById('normal-sd').value);
        const expectedValue = mean;
        
        // Generate points for normal PDF
        const points = 100;
        const min = mean - 4 * stdDev;
        const max = mean + 4 * stdDev;
        const step = (max - min) / points;
        const labels = [];
        const data = [];
        
        for (let i = 0; i <= points; i++) {
            const x = min + i * step;
            labels.push(x.toFixed(2));
            data.push(normalPDF(x, mean, stdDev));
        }
        
        const chartData = {
            labels: labels,
            datasets: [{
                label: 'PDF',
                data: data,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderWidth: 2,
                pointRadius: 0,
                fill: true
            }]
        };
        
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'x',
                        color: '#fff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#fff'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'f(x)',
                        color: '#fff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#fff'
                    },
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#fff'
                    }
                },
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            return `x = ${tooltipItems[0].label}`;
                        },
                        label: function(context) {
                            return `f(x) = ${context.parsed.y.toFixed(4)}`;
                        }
                    }
                }
            }
        };
        
        // Draw expected value line after chart creation
        setTimeout(() => {
            drawExpectedValueLine(expectedValue);
        }, 100);
        
        return { chartData, chartOptions };
    }
    
    function normalPDF(x, mean, stdDev) {
        const variance = stdDev * stdDev;
        return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * 
               Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
    }
    
    function createExponentialChartData() {
        const lambda = parseFloat(document.getElementById('exponential-lambda').value);
        const expectedValue = 1 / lambda;
        
        // Generate points for exponential PDF
        const points = 100;
        const max = 5 / lambda;  // Show up to 5/lambda
        const step = max / points;
        const labels = [];
        const data = [];
        
        for (let i = 0; i <= points; i++) {
            const x = i * step;
            labels.push(x.toFixed(2));
            data.push(exponentialPDF(x, lambda));
        }
        
        const chartData = {
            labels: labels,
            datasets: [{
                label: 'PDF',
                data: data,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderWidth: 2,
                pointRadius: 0,
                fill: true
            }]
        };
        
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'x',
                        color: '#fff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#fff'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'f(x)',
                        color: '#fff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#fff'
                    },
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#fff'
                    }
                },
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            return `x = ${tooltipItems[0].label}`;
                        },
                        label: function(context) {
                            return `f(x) = ${context.parsed.y.toFixed(4)}`;
                        }
                    }
                }
            }
        };
        
        // Draw expected value line after chart creation
        setTimeout(() => {
            drawExpectedValueLine(expectedValue);
        }, 100);
        
        return { chartData, chartOptions };
    }
    
    function exponentialPDF(x, lambda) {
        if (x < 0) return 0;
        return lambda * Math.exp(-lambda * x);
    }
    
    // Custom distributions
    function createCustomDiscreteChartData() {
        const dataStr = document.getElementById('custom-discrete-data').value;
        const pairs = dataStr.split(',').map(pair => pair.trim());
        
        const values = [];
        const probs = [];
        let expectedValue = 0;
        
        for (const pair of pairs) {
            const [x, p] = pair.split(':').map(val => parseFloat(val.trim()));
            if (!isNaN(x) && !isNaN(p)) {
                values.push(x);
                probs.push(p);
                expectedValue += x * p;
            }
        }
        
        const chartData = {
            labels: values.map(v => v.toString()),
            datasets: [{
                label: 'Probability',
                data: probs,
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        };
        
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Value',
                        color: '#fff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#fff'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Probability',
                        color: '#fff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#fff'
                    },
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#fff'
                    }
                },
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            return `Value: ${tooltipItems[0].label}`;
                        },
                        label: function(context) {
                            return `Probability: ${context.parsed.y.toFixed(4)}`;
                        }
                    }
                }
            }
        };
        
        // Draw expected value line after chart creation
        setTimeout(() => {
            drawExpectedValueLine(expectedValue);
        }, 100);
        
        return { chartData, chartOptions };
    }
    
    function createCustomContinuousChartData() {
        const funcType = document.getElementById('custom-continuous-function').value;
        const a = parseFloat(document.getElementById('custom-continuous-a').value);
        const b = parseFloat(document.getElementById('custom-continuous-b').value);
        
        let func, expectedValue;
        
        switch (funcType) {
            case 'linear':
                const linearA = parseFloat(document.getElementById('custom-linear-a').value);
                const linearB = parseFloat(document.getElementById('custom-linear-b').value);
                func = x => linearA * x + linearB;
                // For linear function, E[X] = (a+b)/2 * area under curve
                expectedValue = (a + b) / 2;
                break;
                
            case 'quadratic':
                const quadA = parseFloat(document.getElementById('custom-quadratic-a').value);
                const quadB = parseFloat(document.getElementById('custom-quadratic-b').value);
                const quadC = parseFloat(document.getElementById('custom-quadratic-c').value);
                func = x => quadA * x * x + quadB * x + quadC;
                // Approximation for quadratic function
                expectedValue = (a + b) / 2;
                break;
                
            case 'exponential':
                const expA = parseFloat(document.getElementById('custom-exponential-a').value);
                const expB = parseFloat(document.getElementById('custom-exponential-b').value);
                func = x => expA * Math.exp(expB * x);
                // Approximation for exponential
                expectedValue = (a + b) / 2;
                break;
        }
        
        // Generate points
        const points = 100;
        const step = (b - a) / points;
        const labels = [];
        const data = [];
        
        for (let i = 0; i <= points; i++) {
            const x = a + i * step;
            labels.push(x.toFixed(2));
            data.push(func(x));
        }
        
        // Normalize data to make area = 1
        const area = simpleIntegration(data, step);
        const normalizedData = data.map(y => y / area);
        
        const chartData = {
            labels: labels,
            datasets: [{
                label: 'PDF',
                data: normalizedData,
                borderColor: 'rgba(54, 162, 235, 1)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderWidth: 2,
                pointRadius: 0,
                fill: true
            }]
        };
        
        const chartOptions = {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'x',
                        color: '#fff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#fff'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'f(x)',
                        color: '#fff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#fff'
                    },
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#fff'
                    }
                },
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            return `x = ${tooltipItems[0].label}`;
                        },
                        label: function(context) {
                            return `f(x) = ${context.parsed.y.toFixed(4)}`;
                        }
                    }
                }
            }
        };
        
        // Draw expected value line after chart creation
        setTimeout(() => {
            drawExpectedValueLine(expectedValue);
        }, 100);
        
        return { chartData, chartOptions };
    }
    
    function simpleIntegration(values, step) {
        let sum = 0;
        for (let i = 0; i < values.length - 1; i++) {
            sum += (values[i] + values[i + 1]) / 2 * step;
        }
        return sum;
    }
    
    function drawExpectedValueLine(expectedValue) {
        if (!distributionChart) return;
        
        // Add a plugin to draw the expected value line
        const plugin = {
            id: 'expectedValueLine',
            afterDraw: (chart) => {
                const ctx = chart.ctx;
                const xAxis = chart.scales.x;
                
                // Find the x value closest to the expected value
                let closestIndex = 0;
                let minDiff = Infinity;
                
                for (let i = 0; i < chart.data.labels.length; i++) {
                    const value = parseFloat(chart.data.labels[i]);
                    const diff = Math.abs(value - expectedValue);
                    if (diff < minDiff) {
                        minDiff = diff;
                        closestIndex = i;
                    }
                }
                
                // Draw vertical line at expected value
                if (closestIndex >= 0) {
                    const xPos = xAxis.getPixelForValue(chart.data.labels[closestIndex]);
                    
                    ctx.save();
                    ctx.beginPath();
                    ctx.strokeStyle = 'rgba(255, 99, 132, 1)';
                    ctx.lineWidth = 2;
                    ctx.setLineDash([5, 5]);
                    ctx.moveTo(xPos, chart.chartArea.top);
                    ctx.lineTo(xPos, chart.chartArea.bottom);
                    ctx.stroke();
                    
                    // Add label above the line
                    ctx.fillStyle = 'rgba(255, 99, 132, 1)';
                    ctx.textAlign = 'center';
                    ctx.font = '12px Arial';
                    ctx.fillText(`E[X] = ${expectedValue.toFixed(4)}`, xPos, chart.chartArea.top - 10);
                    
                    ctx.restore();
                }
            }
        };
        
        // Add plugin to chart
        Chart.register(plugin);
        distributionChart.update();
    }
    
    function updateDistributionInfo(distribution) {
        const titles = {
            'bernoulli': 'Bernoulli Distribution Expected Value',
            'binomial': 'Binomial Distribution Expected Value',
            'geometric': 'Geometric Distribution Expected Value',
            'poisson': 'Poisson Distribution Expected Value',
            'uniform': 'Uniform Distribution Expected Value',
            'normal': 'Normal Distribution Expected Value',
            'exponential': 'Exponential Distribution Expected Value',
            'custom': 'Custom Distribution Expected Value'
        };
        
        const descriptions = {
            'bernoulli': 'The expected value (mean) of a Bernoulli random variable X with parameter p is E[X] = p.',
            'binomial': 'The expected value (mean) of a binomial random variable X with parameters n and p is E[X] = np.',
            'geometric': 'The expected value (mean) of a geometric random variable X with parameter p is E[X] = 1/p.',
            'poisson': 'The expected value (mean) of a Poisson random variable X with parameter λ is E[X] = λ.',
            'uniform': 'The expected value (mean) of a uniform random variable X on the interval [a,b] is E[X] = (a+b)/2.',
            'normal': 'The expected value (mean) of a normal random variable X with parameters μ and σ is E[X] = μ.',
            'exponential': 'The expected value (mean) of an exponential random variable X with parameter λ is E[X] = 1/λ.',
            'custom': 'The expected value (mean) of a custom distribution is calculated based on the provided probability distribution.'
        };
        
        const formulas = {
            'bernoulli': '\\[ E[X] = p \\]',
            'binomial': '\\[ E[X] = np \\]',
            'geometric': '\\[ E[X] = \\frac{1}{p} \\]',
            'poisson': '\\[ E[X] = \\lambda \\]',
            'uniform': '\\[ E[X] = \\frac{a+b}{2} \\]',
            'normal': '\\[ E[X] = \\mu \\]',
            'exponential': '\\[ E[X] = \\frac{1}{\\lambda} \\]',
            'custom': '\\[ E[X] = \\sum_{i} x_i \\cdot P(X = x_i) \\quad \\text{or} \\quad E[X] = \\int_{a}^{b} x \\cdot f(x) \\, dx \\]'
        };
        
        const properties = {
            'bernoulli': '<h4>Properties:</h4><ul><li>E[X] = p represents the long-run proportion of successes</li><li>Variance of a Bernoulli distribution is p(1-p)</li><li>For p = 0.5, the distribution is symmetric around the mean</li></ul>',
            'binomial': '<h4>Properties:</h4><ul><li>E[X] = np represents the average number of successes in n trials</li><li>Variance is np(1-p)</li><li>Sum of n independent Bernoulli random variables</li></ul>',
            'geometric': '<h4>Properties:</h4><ul><li>E[X] = 1/p represents the average number of trials until first success</li><li>Variance is (1-p)/p²</li><li>Memoryless property: P(X > m+n | X > m) = P(X > n)</li></ul>',
            'poisson': '<h4>Properties:</h4><ul><li>E[X] = λ represents the average number of events in the interval</li><li>Variance is also equal to λ</li><li>Approximates binomial distribution when n is large and p is small</li></ul>',
            'uniform': '<h4>Properties:</h4><ul><li>E[X] = (a+b)/2 is the midpoint of the interval</li><li>Variance is (b-a)²/12</li><li>All values in the interval are equally likely</li></ul>',
            'normal': '<h4>Properties:</h4><ul><li>E[X] = μ is the center of the bell curve</li><li>Variance is σ²</li><li>Symmetric distribution, with 68% of values within 1 standard deviation of the mean</li></ul>',
            'exponential': '<h4>Properties:</h4><ul><li>E[X] = 1/λ represents the average wait time between events</li><li>Variance is 1/λ²</li><li>Memoryless property: P(X > m+n | X > m) = P(X > n)</li></ul>',
            'custom': '<h4>Properties:</h4><ul><li>The expected value is the weighted average of all possible values</li><li>It represents the "center of mass" of the probability distribution</li><li>May not always be a possible value of the random variable</li></ul>'
        };
        
        document.getElementById('distribution-title').textContent = titles[distribution];
        document.getElementById('distribution-description').innerHTML = `<p>${descriptions[distribution]}</p>`;
        document.getElementById('distribution-formula').innerHTML = formulas[distribution];
        document.getElementById('distribution-properties').innerHTML = properties[distribution];
        
        // Render formulas with MathJax
        if (window.MathJax) {
            MathJax.typesetPromise();
        }
    }
    
    function calculateExpectedValue() {
        const distType = document.getElementById('distribution-type').value;
        let result;
        
        if (distType === 'discrete') {
            const dist = document.getElementById('discrete-distribution').value;
            switch (dist) {
                case 'bernoulli':
                    result = calculateBernoulliExpectedValue();
                    break;
                case 'binomial':
                    result = calculateBinomialExpectedValue();
                    break;
                case 'geometric':
                    result = calculateGeometricExpectedValue();
                    break;
                case 'poisson':
                    result = calculatePoissonExpectedValue();
                    break;
            }
        } else if (distType === 'continuous') {
            const dist = document.getElementById('continuous-distribution').value;
            switch (dist) {
                case 'uniform':
                    result = calculateUniformExpectedValue();
                    break;
                case 'normal':
                    result = calculateNormalExpectedValue();
                    break;
                case 'exponential':
                    result = calculateExponentialExpectedValue();
                    break;
            }
        } else if (distType === 'custom') {
            const customType = document.getElementById('custom-type').value;
            if (customType === 'discrete') {
                result = calculateCustomDiscreteExpectedValue();
            } else {
                result = calculateCustomContinuousExpectedValue();
            }
        }
        
        if (result) {
            // Display results
            document.getElementById('result-value').textContent = result.value.toFixed(6);
            document.getElementById('result-explanation').textContent = result.explanation;
            
            // Set step-by-step solution
            document.getElementById('steps-content').innerHTML = result.steps;
            
            // Render math in steps
            if (window.MathJax) {
                MathJax.typesetPromise();
            }
            
            // Show results container
            document.getElementById('results').style.display = 'block';
            
            // Update chart with expected value line
            updateChart(result.params.distribution);
            setTimeout(() => {
                drawExpectedValueLine(result.value);
            }, 100);
        }
    }
    
    function calculateBernoulliExpectedValue() {
        const p = parseFloat(document.getElementById('bernoulli-p').value);
        
        // Calculate expected value: E[X] = p
        const expectedValue = p;
        
        // Generate explanation
        const explanation = `E[X] = ${expectedValue.toFixed(6)}`;
        
        // Generate steps
        const steps = `
            <div class="step">
                <span class="step-number">1</span>
                <div class="step-content">
                    Identify the parameter of the Bernoulli distribution:
                    <ul>
                        <li>Success probability: p = ${p}</li>
                    </ul>
                </div>
            </div>
            <div class="step">
                <span class="step-number">2</span>
                <div class="step-content">
                    Apply the formula for the expected value of a Bernoulli random variable:
                    <div class="step-formula">
                        \\[E[X] = p\\]
                    </div>
                </div>
            </div>
            <div class="step">
                <span class="step-number">3</span>
                <div class="step-content">
                    Calculate the expected value:
                    <div class="step-formula">
                        \\[E[X] = ${p} = ${expectedValue.toFixed(6)}\\]
                    </div>
                </div>
            </div>
            <div class="step">
                <span class="step-number">4</span>
                <div class="step-content">
                    <p>The expected value ${expectedValue.toFixed(6)} represents the long-run average value of the Bernoulli random variable.</p>
                    <p>Intuitively, if you perform many independent Bernoulli trials, approximately ${(p*100).toFixed(1)}% of them will be successes (1), and the rest will be failures (0), giving an average value of ${p}.</p>
                </div>
            </div>
        `;
        
        return {
            value: expectedValue,
            explanation: explanation,
            steps: steps,
            params: {
                distribution: 'bernoulli',
                p: p
            }
        };
    }
    
    function calculateBinomialExpectedValue() {
        const n = parseInt(document.getElementById('binomial-n').value);
        const p = parseFloat(document.getElementById('binomial-p').value);
        
        // Calculate expected value: E[X] = np
        const expectedValue = n * p;
        
        // Generate explanation
        const explanation = `E[X] = ${expectedValue.toFixed(6)}`;
        
        // Generate steps
        const steps = `
            <div class="step">
                <span class="step-number">1</span>
                <div class="step-content">
                    Identify the parameters of the binomial distribution:
                    <ul>
                        <li>Number of trials: n = ${n}</li>
                        <li>Success probability: p = ${p}</li>
                    </ul>
                </div>
            </div>
            <div class="step">
                <span class="step-number">2</span>
                <div class="step-content">
                    Apply the formula for the expected value of a binomial random variable:
                    <div class="step-formula">
                        \\[E[X] = np\\]
                    </div>
                </div>
            </div>
            <div class="step">
                <span class="step-number">3</span>
                <div class="step-content">
                    Calculate the expected value:
                    <div class="step-formula">
                        \\[E[X] = ${n} \\times ${p} = ${expectedValue.toFixed(6)}\\]
                    </div>
                </div>
            </div>
            <div class="step">
                <span class="step-number">4</span>
                <div class="step-content">
                    <p>The expected value ${expectedValue.toFixed(6)} represents the average number of successes in ${n} independent trials, each with success probability ${p}.</p>
                    <p>This result can also be derived by viewing a binomial random variable as the sum of ${n} independent Bernoulli random variables, each with mean ${p}. By the linearity of expectation, the mean of the sum equals the sum of the means.</p>
                </div>
            </div>
        `;
        
        return {
            value: expectedValue,
            explanation: explanation,
            steps: steps,
            params: {
                distribution: 'binomial',
                n: n,
                p: p
            }
        };
    }
    
    function calculateGeometricExpectedValue() {
        const p = parseFloat(document.getElementById('geometric-p').value);
        
        // Calculate expected value: E[X] = 1/p
        const expectedValue = 1 / p;
        
        // Generate explanation
        const explanation = `E[X] = ${expectedValue.toFixed(6)}`;
        
        // Generate steps
        const steps = `
            <div class="step">
                <span class="step-number">1</span>
                <div class="step-content">
                    Identify the parameter of the geometric distribution:
                    <ul>
                        <li>Success probability: p = ${p}</li>
                    </ul>
                </div>
            </div>
            <div class="step">
                <span class="step-number">2</span>
                <div class="step-content">
                    Apply the formula for the expected value of a geometric random variable:
                    <div class="step-formula">
                        \\[E[X] = \\frac{1}{p}\\]
                    </div>
                </div>
            </div>
            <div class="step">
                <span class="step-number">3</span>
                <div class="step-content">
                    Calculate the expected value:
                    <div class="step-formula">
                        \\[E[X] = \\frac{1}{${p}} = ${expectedValue.toFixed(6)}\\]
                    </div>
                </div>
            </div>
            <div class="step">
                <span class="step-number">4</span>
                <div class="step-content">
                    <p>The expected value ${expectedValue.toFixed(6)} represents the average number of trials needed until the first success occurs.</p>
                    <p>For instance, if you repeatedly toss a coin with probability of heads ${p}, you should expect to toss it approximately ${expectedValue.toFixed(2)} times before getting heads for the first time.</p>
                </div>
            </div>
        `;
        
        return {
            value: expectedValue,
            explanation: explanation,
            steps: steps,
            params: {
                distribution: 'geometric',
                p: p
            }
        };
    }
    
    function calculatePoissonExpectedValue() {
        const lambda = parseFloat(document.getElementById('poisson-lambda').value);
        
        // Calculate expected value: E[X] = lambda
        const expectedValue = lambda;
        
        // Generate explanation
        const explanation = `E[X] = ${expectedValue.toFixed(6)}`;
        
        // Generate steps
        const steps = `
            <div class="step">
                <span class="step-number">1</span>
                <div class="step-content">
                    Identify the parameter of the Poisson distribution:
                    <ul>
                        <li>Rate parameter: λ = ${lambda}</li>
                    </ul>
                </div>
            </div>
            <div class="step">
                <span class="step-number">2</span>
                <div class="step-content">
                    Apply the formula for the expected value of a Poisson random variable:
                    <div class="step-formula">
                        \\[E[X] = \\lambda\\]
                    </div>
                </div>
            </div>
            <div class="step">
                <span class="step-number">3</span>
                <div class="step-content">
                    Calculate the expected value:
                    <div class="step-formula">
                        \\[E[X] = ${lambda} = ${expectedValue.toFixed(6)}\\]
                    </div>
                </div>
            </div>
            <div class="step">
                <span class="step-number">4</span>
                <div class="step-content">
                    <p>The expected value ${expectedValue.toFixed(6)} represents the average number of events occurring in the given interval.</p>
                    <p>Interestingly, for a Poisson distribution, the variance is also equal to λ = ${lambda}.</p>
                </div>
            </div>
        `;
        
        return {
            value: expectedValue,
            explanation: explanation,
            steps: steps,
            params: {
                distribution: 'poisson',
                lambda: lambda
            }
        };
    }
    
    function calculateUniformExpectedValue() {
        const a = parseFloat(document.getElementById('uniform-a').value);
        const b = parseFloat(document.getElementById('uniform-b').value);
        
        // Calculate expected value: E[X] = (a+b)/2
        const expectedValue = (a + b) / 2;
        
        // Generate explanation
        const explanation = `E[X] = ${expectedValue.toFixed(6)}`;
        
        // Generate steps
        const steps = `
            <div class="step">
                <span class="step-number">1</span>
                <div class="step-content">
                    Identify the parameters of the uniform distribution:
                    <ul>
                        <li>Lower bound: a = ${a}</li>
                        <li>Upper bound: b = ${b}</li>
                    </ul>
                </div>
            </div>
            <div class="step">
                <span class="step-number">2</span>
                <div class="step-content">
                    Apply the formula for the expected value of a uniform random variable:
                    <div class="step-formula">
                        \\[E[X] = \\frac{a+b}{2}\\]
                    </div>
                </div>
            </div>
            <div class="step">
                <span class="step-number">3</span>
                <div class="step-content">
                    Calculate the expected value:
                    <div class="step-formula">
                        \\[E[X] = \\frac{${a}+${b}}{2} = \\frac{${a+b}}{2} = ${expectedValue.toFixed(6)}\\]
                    </div>
                </div>
            </div>
            <div class="step">
                <span class="step-number">4</span>
                <div class="step-content">
                    <p>The expected value ${expectedValue.toFixed(6)} is the midpoint of the interval [${a}, ${b}].</p>
                    <p>This makes intuitive sense because all values in the interval are equally likely, so the average value is at the center of the interval.</p>
                </div>
            </div>
        `;
        
        return {
            value: expectedValue,
            explanation: explanation,
            steps: steps,
            params: {
                distribution: 'uniform',
                a: a,
                b: b
            }
        };
    }
    
    function calculateNormalExpectedValue() {
        const mean = parseFloat(document.getElementById('normal-mean').value);
        const stdDev = parseFloat(document.getElementById('normal-sd').value);
        
        // Calculate expected value: E[X] = mean
        const expectedValue = mean;
        
        // Generate explanation
        const explanation = `E[X] = ${expectedValue.toFixed(6)}`;
        
        // Generate steps
        const steps = `
            <div class="step">
                <span class="step-number">1</span>
                <div class="step-content">
                    Identify the parameters of the normal distribution:
                    <ul>
                        <li>Mean: μ = ${mean}</li>
                        <li>Standard deviation: σ = ${stdDev}</li>
                    </ul>
                </div>
            </div>
            <div class="step">
                <span class="step-number">2</span>
                <div class="step-content">
                    Apply the formula for the expected value of a normal random variable:
                    <div class="step-formula">
                        \\[E[X] = \\mu\\]
                    </div>
                </div>
            </div>
            <div class="step">
                <span class="step-number">3</span>
                <div class="step-content">
                    Calculate the expected value:
                    <div class="step-formula">
                        \\[E[X] = ${mean} = ${expectedValue.toFixed(6)}\\]
                    </div>
                </div>
            </div>
            <div class="step">
                <span class="step-number">4</span>
                <div class="step-content">
                    <p>The expected value ${expectedValue.toFixed(6)} is exactly equal to the mean parameter μ of the normal distribution.</p>
                    <p>The normal distribution is symmetric around its mean, with approximately 68% of the probability mass within one standard deviation of the mean, 95% within two standard deviations, and 99.7% within three standard deviations.</p>
                </div>
            </div>
        `;
        
        return {
            value: expectedValue,
            explanation: explanation,
            steps: steps,
            params: {
                distribution: 'normal',
                mean: mean,
                stdDev: stdDev
            }
        };
    }
    
    function calculateExponentialExpectedValue() {
        const lambda = parseFloat(document.getElementById('exponential-lambda').value);
        
        // Calculate expected value: E[X] = 1/lambda
        const expectedValue = 1 / lambda;
        
        // Generate explanation
        const explanation = `E[X] = ${expectedValue.toFixed(6)}`;
        
        // Generate steps
        const steps = `
            <div class="step">
                <span class="step-number">1</span>
                <div class="step-content">
                    Identify the parameter of the exponential distribution:
                    <ul>
                        <li>Rate parameter: λ = ${lambda}</li>
                    </ul>
                </div>
            </div>
            <div class="step">
                <span class="step-number">2</span>
                <div class="step-content">
                    Apply the formula for the expected value of an exponential random variable:
                    <div class="step-formula">
                        \\[E[X] = \\frac{1}{\\lambda}\\]
                    </div>
                </div>
            </div>
            <div class="step">
                <span class="step-number">3</span>
                <div class="step-content">
                    Calculate the expected value:
                    <div class="step-formula">
                        \\[E[X] = \\frac{1}{${lambda}} = ${expectedValue.toFixed(6)}\\]
                    </div>
                </div>
            </div>
            <div class="step">
                <span class="step-number">4</span>
                <div class="step-content">
                    <p>The expected value ${expectedValue.toFixed(6)} represents the average wait time until an event occurs.</p>
                    <p>The exponential distribution has the memoryless property, meaning the probability of waiting an additional time t is independent of how long you've already waited.</p>
                </div>
            </div>
        `;
        
        return {
            value: expectedValue,
            explanation: explanation,
            steps: steps,
            params: {
                distribution: 'exponential',
                lambda: lambda
            }
        };
    }
    
    function calculateCustomDiscreteExpectedValue() {
        const dataStr = document.getElementById('custom-discrete-data').value;
        const pairs = dataStr.split(',').map(pair => pair.trim());
        
        let expectedValue = 0;
        let totalProb = 0;
        const values = [];
        const probs = [];
        
        // Parse the input and calculate expected value
        for (const pair of pairs) {
            const [value, prob] = pair.split(':').map(part => parseFloat(part.trim()));
            if (!isNaN(value) && !isNaN(prob)) {
                values.push(value);
                probs.push(prob);
                expectedValue += value * prob;
                totalProb += prob;
            }
        }
        
        // Check if probabilities sum to 1
        const probSum = totalProb;
        const validProbs = Math.abs(probSum - 1) < 0.001;
        
        // Generate explanation
        const explanation = validProbs ? 
            `E[X] = ${expectedValue.toFixed(6)}` :
            `E[X] = ${expectedValue.toFixed(6)} (Warning: probabilities sum to ${probSum.toFixed(6)}, not 1)`;
        
        // Generate steps
        const steps = `
            <div class="step">
                <span class="step-number">1</span>
                <div class="step-content">
                    Parse the custom discrete distribution:
                    <ul>
                        ${pairs.map(pair => {
                            const [x, p] = pair.split(':').map(part => part.trim());
                            return `<li>P(X = ${x}) = ${p}</li>`;
                        }).join('')}
                    </ul>
                    ${!validProbs ? `<p class="warning">Warning: The probabilities sum to ${probSum.toFixed(6)}, not 1. For a valid probability distribution, they should sum to 1.</p>` : ''}
                </div>
            </div>
            <div class="step">
                <span class="step-number">2</span>
                <div class="step-content">
                    Apply the formula for the expected value of a discrete random variable:
                    <div class="step-formula">
                        \\[E[X] = \\sum_{i} x_i \\cdot P(X = x_i)\\]
                    </div>
                </div>
            </div>
            <div class="step">
                <span class="step-number">3</span>
                <div class="step-content">
                    Calculate the expected value:
                    <div class="step-formula">
                        \\[E[X] = ${values.map((v, i) => `${v} \\cdot ${probs[i]}`).join(' + ')} = ${expectedValue.toFixed(6)}\\]
                    </div>
                </div>
            </div>
            <div class="step">
                <span class="step-number">4</span>
                <div class="step-content">
                    <p>The expected value ${expectedValue.toFixed(6)} represents the weighted average of all possible values of the random variable.</p>
                </div>
            </div>
        `;
        
        return {
            value: expectedValue,
            explanation: explanation,
            steps: steps,
            params: {
                distribution: 'custom',
                type: 'discrete',
                values: values,
                probs: probs
            }
        };
    }
    
    function calculateCustomContinuousExpectedValue() {
        const funcType = document.getElementById('custom-continuous-function').value;
        const a = parseFloat(document.getElementById('custom-continuous-a').value);
        const b = parseFloat(document.getElementById('custom-continuous-b').value);
        
        let formula, normalizedFormula, expectedValue, steps;
        
        switch (funcType) {
            case 'linear':
                const linearA = parseFloat(document.getElementById('custom-linear-a').value);
                const linearB = parseFloat(document.getElementById('custom-linear-b').value);
                
                // Calculate area under curve for normalization
                const linearArea = linearA * (b*b - a*a) / 2 + linearB * (b - a);
                
                // Expected value formula: ∫(x * f(x) dx) / ∫(f(x) dx)
                expectedValue = (linearA * (b*b*b - a*a*a) / 3 + linearB * (b*b - a*a) / 2) / linearArea;
                
                formula = `f(x) = ${linearA}x + ${linearB}`;
                normalizedFormula = `f(x) = \\frac{${linearA}x + ${linearB}}{${linearArea.toFixed(6)}}`;
                
                steps = `
                    <div class="step">
                        <span class="step-number">1</span>
                        <div class="step-content">
                            Identify the custom continuous distribution:
                            <ul>
                                <li>Function: f(x) = ${linearA}x + ${linearB}</li>
                                <li>Range: [${a}, ${b}]</li>
                            </ul>
                        </div>
                    </div>
                    <div class="step">
                        <span class="step-number">2</span>
                        <div class="step-content">
                            Normalize the function to make it a valid PDF (so the area equals 1):
                            <div class="step-formula">
                                \\[\\int_{${a}}^{${b}} (${linearA}x + ${linearB}) \\, dx = ${linearA} \\cdot \\frac{x^2}{2} \\bigg|_{${a}}^{${b}} + ${linearB} \\cdot x \\bigg|_{${a}}^{${b}} = ${linearArea.toFixed(6)}\\]
                                \\[f_{normalized}(x) = \\frac{${linearA}x + ${linearB}}{${linearArea.toFixed(6)}}\\]
                            </div>
                        </div>
                    </div>
                    <div class="step">
                        <span class="step-number">3</span>
                        <div class="step-content">
                            Apply the formula for the expected value of a continuous random variable:
                            <div class="step-formula">
                                \\[E[X] = \\int_{a}^{b} x \\cdot f(x) \\, dx\\]
                            </div>
                        </div>
                    </div>
                    <div class="step">
                        <span class="step-number">4</span>
                        <div class="step-content">
                            Calculate the expected value:
                            <div class="step-formula">
                                \\[E[X] = \\int_{${a}}^{${b}} x \\cdot \\frac{${linearA}x + ${linearB}}{${linearArea.toFixed(6)}} \\, dx\\]
                                \\[E[X] = \\frac{1}{${linearArea.toFixed(6)}} \\int_{${a}}^{${b}} (${linearA}x^2 + ${linearB}x) \\, dx\\]
                                \\[E[X] = \\frac{1}{${linearArea.toFixed(6)}} \\left( ${linearA} \\cdot \\frac{x^3}{3} + ${linearB} \\cdot \\frac{x^2}{2} \\right) \\bigg|_{${a}}^{${b}}\\]
                                \\[E[X] = ${expectedValue.toFixed(6)}\\]
                            </div>
                        </div>
                    </div>
                `;
                break;
                
            case 'quadratic':
                const quadA = parseFloat(document.getElementById('custom-quadratic-a').value);
                const quadB = parseFloat(document.getElementById('custom-quadratic-b').value);
                const quadC = parseFloat(document.getElementById('custom-quadratic-c').value);
                
                // Calculate area under curve for normalization
                const quadArea = quadA * (Math.pow(b, 3) - Math.pow(a, 3)) / 3 + 
                                quadB * (b*b - a*a) / 2 + 
                                quadC * (b - a);
                
                // Expected value formula
                expectedValue = (quadA * (Math.pow(b, 4) - Math.pow(a, 4)) / 4 + 
                               quadB * (Math.pow(b, 3) - Math.pow(a, 3)) / 3 + 
                               quadC * (b*b - a*a) / 2) / quadArea;
                
                formula = `f(x) = ${quadA}x² + ${quadB}x + ${quadC}`;
                normalizedFormula = `f(x) = \\frac{${quadA}x^2 + ${quadB}x + ${quadC}}{${quadArea.toFixed(6)}}`;
                
                steps = `
                    <div class="step">
                        <span class="step-number">1</span>
                        <div class="step-content">
                            Identify the custom continuous distribution:
                            <ul>
                                <li>Function: f(x) = ${quadA}x² + ${quadB}x + ${quadC}</li>
                                <li>Range: [${a}, ${b}]</li>
                            </ul>
                        </div>
                    </div>
                    <div class="step">
                        <span class="step-number">2</span>
                        <div class="step-content">
                            Normalize the function to make it a valid PDF:
                            <div class="step-formula">
                                \\[\\int_{${a}}^{${b}} (${quadA}x^2 + ${quadB}x + ${quadC}) \\, dx = ${quadArea.toFixed(6)}\\]
                                \\[f_{normalized}(x) = \\frac{${quadA}x^2 + ${quadB}x + ${quadC}}{${quadArea.toFixed(6)}}\\]
                            </div>
                        </div>
                    </div>
                    <div class="step">
                        <span class="step-number">3</span>
                        <div class="step-content">
                            Calculate the expected value:
                            <div class="step-formula">
                                \\[E[X] = \\int_{${a}}^{${b}} x \\cdot \\frac{${quadA}x^2 + ${quadB}x + ${quadC}}{${quadArea.toFixed(6)}} \\, dx\\]
                                \\[E[X] = ${expectedValue.toFixed(6)}\\]
                            </div>
                        </div>
                    </div>
                `;
                break;
                
            case 'exponential':
                const expA = parseFloat(document.getElementById('custom-exponential-a').value);
                const expB = parseFloat(document.getElementById('custom-exponential-b').value);
                
                // For exponential, we need numerical integration
                // Using trapezoidal rule for approximation
                const numPoints = 1000;
                const step = (b - a) / numPoints;
                let area = 0;
                let weightedSum = 0;
                
                for (let i = 0; i <= numPoints; i++) {
                    const x = a + i * step;
                    const y = expA * Math.exp(expB * x);
                    const weight = (i === 0 || i === numPoints) ? 0.5 : 1;
                    area += weight * y * step;
                    weightedSum += weight * x * y * step;
                }
                
                expectedValue = weightedSum / area;
                formula = `f(x) = ${expA}e^{${expB}x}`;
                normalizedFormula = `f(x) = \\frac{${expA}e^{${expB}x}}{${area.toFixed(6)}}`;
                
                steps = `
                    <div class="step">
                        <span class="step-number">1</span>
                        <div class="step-content">
                            Identify the custom continuous distribution:
                            <ul>
                                <li>Function: f(x) = ${expA}e^{${expB}x}</li>
                                <li>Range: [${a}, ${b}]</li>
                            </ul>
                        </div>
                    </div>
                    <div class="step">
                        <span class="step-number">2</span>
                        <div class="step-content">
                            For the exponential function, we used numerical integration to calculate:
                            <ul>
                                <li>Area under the curve: ${area.toFixed(6)}</li>
                                <li>Normalized PDF: f(x) = ${expA}e^{${expB}x}/${area.toFixed(6)}</li>
                                <li>Expected value: ${expectedValue.toFixed(6)}</li>
                            </ul>
                        </div>
                    </div>
                `;
                break;
        }
        
        // Generate explanation
        const explanation = `E[X] = ${expectedValue.toFixed(6)}`;
        
        return {
            value: expectedValue,
            explanation: explanation,
            steps: steps,
            params: {
                distribution: 'custom',
                type: 'continuous',
                function: funcType,
                formula: formula,
                range: [a, b]
            }
        };
    }
    
    function checkQuizAnswers() {
        // Get selected answers
        const question1 = document.querySelector('.quiz-question:nth-child(1)');
        const question2 = document.querySelector('.quiz-question:nth-child(3)');
        
        const answer1 = question1.querySelector('.quiz-option.selected')?.getAttribute('data-value');
        const answer2 = question2.querySelector('.quiz-option.selected')?.getAttribute('data-value');
        
        // Check answers and display feedback
        if (answer1) {
            const feedback1 = document.getElementById('feedback-1');
            if (answer1 === 'a') {
                feedback1.innerHTML = '<div class="correct-answer"><i class="fas fa-check-circle"></i> Correct! 1.9 = 1×0.3 + 2×0.5 + 3×0.2</div>';
                feedback1.style.display = 'block';
            } else {
                feedback1.innerHTML = '<div class="wrong-answer"><i class="fas fa-times-circle"></i> Incorrect. The correct answer is 1.9 = 1×0.3 + 2×0.5 + 3×0.2</div>';
                feedback1.style.display = 'block';
            }
        } else {
            document.getElementById('feedback-1').innerHTML = '<div class="warning-message"><i class="fas fa-exclamation-circle"></i> Please select an answer for question 1.</div>';
            document.getElementById('feedback-1').style.display = 'block';
        }
        
        if (answer2) {
            const feedback2 = document.getElementById('feedback-2');
            if (answer2 === 'b') {
                feedback2.innerHTML = '<div class="correct-answer"><i class="fas fa-check-circle"></i> Correct! For f(x) = 2x on [0,1], E[X] = ∫x·2x dx from 0 to 1 = 2/3</div>';
                feedback2.style.display = 'block';
            } else {
                feedback2.innerHTML = '<div class="wrong-answer"><i class="fas fa-times-circle"></i> Incorrect. The correct answer is 2/3. For f(x) = 2x on [0,1], E[X] = ∫x·2x dx from 0 to 1 = 2/3</div>';
                feedback2.style.display = 'block';
            }
        } else {
            document.getElementById('feedback-2').innerHTML = '<div class="warning-message"><i class="fas fa-exclamation-circle"></i> Please select an answer for question 2.</div>';
            document.getElementById('feedback-2').style.display = 'block';
        }
    }
    
    function resetCalculator() {
        // Hide results
        document.getElementById('results').style.display = 'none';
        
        // Reset steps display
        document.getElementById('solution-steps').style.display = 'none';
        document.getElementById('show-steps-btn').innerHTML = '<i class="fas fa-list-ol me-2"></i>Show Steps';
    }
});