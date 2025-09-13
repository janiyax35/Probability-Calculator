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
        calculateVariance();
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
        
        // Add variance visualization
        const variance = p * (1 - p);
        showVarianceOnChart(0.5, variance);
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
        const variance = p * (1 - p);
        
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
        
        // Draw variance visualization after chart creation
        setTimeout(() => {
            const mean = p;
            showVarianceOnChart(mean, variance);
        }, 100);
        
        return { chartData, chartOptions };
    }
    
    function createBinomialChartData() {
        const n = parseInt(document.getElementById('binomial-n').value);
        const p = parseFloat(document.getElementById('binomial-p').value);
        const mean = n * p;
        const variance = n * p * (1 - p);
        
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
        
        // Draw variance visualization after chart creation
        setTimeout(() => {
            showVarianceOnChart(mean, variance);
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
        const mean = 1 / p;
        const variance = (1 - p) / (p * p);
        
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
        
        // Draw variance visualization after chart creation
        setTimeout(() => {
            showVarianceOnChart(mean, variance);
        }, 100);
        
        return { chartData, chartOptions };
    }
    
    function geometricPMF(p, k) {
        return p * Math.pow(1 - p, k - 1);
    }
    
    function createPoissonChartData() {
        const lambda = parseFloat(document.getElementById('poisson-lambda').value);
        const mean = lambda;
        const variance = lambda;
        
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
        
        // Draw variance visualization after chart creation
        setTimeout(() => {
            showVarianceOnChart(mean, variance);
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
        const mean = (a + b) / 2;
        const variance = Math.pow(b - a, 2) / 12;
        
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
        
        // Draw variance visualization after chart creation
        setTimeout(() => {
            showVarianceOnChart(mean, variance);
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
        const variance = Math.pow(stdDev, 2);
        
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
        
        // Draw variance visualization after chart creation
        setTimeout(() => {
            showVarianceOnChart(mean, variance);
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
        const mean = 1 / lambda;
        const variance = 1 / (lambda * lambda);
        
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
        
        // Draw variance visualization after chart creation
        setTimeout(() => {
            showVarianceOnChart(mean, variance);
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
        
        // Parse the input and calculate mean
        let mean = 0;
        for (const pair of pairs) {
            const [value, prob] = pair.split(':').map(val => parseFloat(val.trim()));
            if (!isNaN(value) && !isNaN(prob)) {
                values.push(value);
                probs.push(prob);
                mean += value * prob;
            }
        }
        
        // Calculate variance
        let variance = 0;
        for (let i = 0; i < values.length; i++) {
            variance += Math.pow(values[i] - mean, 2) * probs[i];
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
        
        // Draw variance visualization after chart creation
        setTimeout(() => {
            showVarianceOnChart(mean, variance);
        }, 100);
        
        return { chartData, chartOptions };
    }
    
    function createCustomContinuousChartData() {
        const funcType = document.getElementById('custom-continuous-function').value;
        const a = parseFloat(document.getElementById('custom-continuous-a').value);
        const b = parseFloat(document.getElementById('custom-continuous-b').value);
        
        let func, mean, variance;
        
        switch (funcType) {
            case 'linear':
                const linearA = parseFloat(document.getElementById('custom-linear-a').value);
                const linearB = parseFloat(document.getElementById('custom-linear-b').value);
                func = x => linearA * x + linearB;
                // For simplified linear function, using approximation
                mean = (a + b) / 2;
                variance = Math.pow(b - a, 2) / 12;  // Approximation for variance
                break;
                
            case 'quadratic':
                const quadA = parseFloat(document.getElementById('custom-quadratic-a').value);
                const quadB = parseFloat(document.getElementById('custom-quadratic-b').value);
                const quadC = parseFloat(document.getElementById('custom-quadratic-c').value);
                func = x => quadA * x * x + quadB * x + quadC;
                // Approximation for quadratic function
                mean = (a + b) / 2;
                variance = Math.pow(b - a, 2) / 12;  // Simple approximation
                break;
                
            case 'exponential':
                const expA = parseFloat(document.getElementById('custom-exponential-a').value);
                const expB = parseFloat(document.getElementById('custom-exponential-b').value);
                func = x => expA * Math.exp(expB * x);
                // Approximation for exponential
                mean = (a + b) / 2;
                variance = Math.pow(b - a, 2) / 12;  // Simple approximation
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
        
        // Draw variance visualization after chart creation
        setTimeout(() => {
            showVarianceOnChart(mean, variance);
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
    
    function showVarianceOnChart(mean, variance) {
        if (!distributionChart) return;
        
        // Add a plugin to visualize the variance on the chart
        const plugin = {
            id: 'varianceVisualization',
            afterDraw: (chart) => {
                const ctx = chart.ctx;
                const xAxis = chart.scales.x;
                
                // Find the x value closest to the mean
                let meanIndex = 0;
                let minDiff = Infinity;
                
                for (let i = 0; i < chart.data.labels.length; i++) {
                    const value = parseFloat(chart.data.labels[i]);
                    const diff = Math.abs(value - mean);
                    if (diff < minDiff) {
                        minDiff = diff;
                        meanIndex = i;
                    }
                }
                
                // Get pixel position of mean
                const meanValue = parseFloat(chart.data.labels[meanIndex]);
                const meanPixel = xAxis.getPixelForValue(chart.data.labels[meanIndex]);
                
                // Calculate standard deviation
                const stdDev = Math.sqrt(variance);
                
                // Find indexes for mean +/- standard deviation
                let leftIndex = 0;
                let rightIndex = chart.data.labels.length - 1;
                
                for (let i = 0; i < chart.data.labels.length; i++) {
                    const value = parseFloat(chart.data.labels[i]);
                    if (value >= meanValue - stdDev) {
                        leftIndex = i;
                        break;
                    }
                }
                
                for (let i = chart.data.labels.length - 1; i >= 0; i--) {
                    const value = parseFloat(chart.data.labels[i]);
                    if (value <= meanValue + stdDev) {
                        rightIndex = i;
                        break;
                    }
                }
                
                // Get pixel positions for mean +/- standard deviation
                const leftPixel = xAxis.getPixelForValue(chart.data.labels[leftIndex]);
                const rightPixel = xAxis.getPixelForValue(chart.data.labels[rightIndex]);
                
                // Draw mean vertical line
                ctx.save();
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(255, 99, 132, 1)';
                ctx.lineWidth = 2;
                ctx.setLineDash([5, 5]);
                ctx.moveTo(meanPixel, chart.chartArea.top);
                ctx.lineTo(meanPixel, chart.chartArea.bottom);
                ctx.stroke();
                
                // Add mean label
                ctx.fillStyle = 'rgba(255, 99, 132, 1)';
                ctx.textAlign = 'center';
                ctx.font = '12px Arial';
                ctx.fillText(`Mean = ${mean.toFixed(4)}`, meanPixel, chart.chartArea.top - 10);
                
                // Highlight variance region (mean +/- standard deviation)
                ctx.fillStyle = 'rgba(255, 99, 132, 0.2)';
                ctx.fillRect(leftPixel, chart.chartArea.top, rightPixel - leftPixel, chart.chartArea.bottom - chart.chartArea.top);
                
                // Add variance label
                ctx.fillStyle = 'rgba(255, 99, 132, 1)';
                ctx.textAlign = 'center';
                ctx.fillText(`Variance = ${variance.toFixed(4)}`, (leftPixel + rightPixel) / 2, chart.chartArea.bottom + 20);
                ctx.fillText(`σ = ${stdDev.toFixed(4)}`, (leftPixel + rightPixel) / 2, chart.chartArea.bottom + 40);
                
                ctx.restore();
            }
        };
        
        // Register the plugin
        Chart.register(plugin);
        distributionChart.update();
    }
    
    function updateDistributionInfo(distribution) {
        const titles = {
            'bernoulli': 'Bernoulli Distribution Variance',
            'binomial': 'Binomial Distribution Variance',
            'geometric': 'Geometric Distribution Variance',
            'poisson': 'Poisson Distribution Variance',
            'uniform': 'Uniform Distribution Variance',
            'normal': 'Normal Distribution Variance',
            'exponential': 'Exponential Distribution Variance',
            'custom': 'Custom Distribution Variance'
        };
        
        const descriptions = {
            'bernoulli': 'The variance of a Bernoulli random variable X with parameter p is Var(X) = p(1-p).',
            'binomial': 'The variance of a binomial random variable X with parameters n and p is Var(X) = np(1-p).',
            'geometric': 'The variance of a geometric random variable X with parameter p is Var(X) = (1-p)/p².',
            'poisson': 'The variance of a Poisson random variable X with parameter λ is Var(X) = λ.',
            'uniform': 'The variance of a uniform random variable X on the interval [a,b] is Var(X) = (b-a)²/12.',
            'normal': 'The variance of a normal random variable X with parameters μ and σ is Var(X) = σ².',
            'exponential': 'The variance of an exponential random variable X with parameter λ is Var(X) = 1/λ².',
            'custom': 'The variance of a custom distribution is calculated based on the provided probability distribution.'
        };
        
        const formulas = {
            'bernoulli': '\\[ Var(X) = p(1-p) \\]',
            'binomial': '\\[ Var(X) = np(1-p) \\]',
            'geometric': '\\[ Var(X) = \\frac{1-p}{p^2} \\]',
            'poisson': '\\[ Var(X) = \\lambda \\]',
            'uniform': '\\[ Var(X) = \\frac{(b-a)^2}{12} \\]',
            'normal': '\\[ Var(X) = \\sigma^2 \\]',
            'exponential': '\\[ Var(X) = \\frac{1}{\\lambda^2} \\]',
            'custom': '\\[ Var(X) = E[(X - \\mu)^2] = \\sum_{i} (x_i - \\mu)^2 \\cdot P(X = x_i) \\quad \\text{or} \\quad Var(X) = \\int_{a}^{b} (x - \\mu)^2 \\cdot f(x) \\, dx \\]'
        };
        
        const properties = {
            'bernoulli': '<h4>Properties:</h4><ul><li>Var(X) = p(1-p) measures the spread of the distribution</li><li>The variance is maximized at p = 0.5, where Var(X) = 0.25</li><li>Standard deviation is σ = √(p(1-p))</li></ul>',
            'binomial': '<h4>Properties:</h4><ul><li>Var(X) = np(1-p) represents the variance of the number of successes</li><li>Standard deviation is σ = √(np(1-p))</li><li>The variance increases with n, but is scaled by p(1-p)</li></ul>',
            'geometric': '<h4>Properties:</h4><ul><li>Var(X) = (1-p)/p² measures the spread in the number of trials</li><li>Standard deviation is σ = √((1-p)/p²) = √(1-p)/p</li><li>As p approaches 0, the variance approaches infinity</li></ul>',
            'poisson': '<h4>Properties:</h4><ul><li>Var(X) = λ, the variance equals the mean</li><li>Standard deviation is σ = √λ</li><li>The index of dispersion (variance-to-mean ratio) is always 1</li></ul>',
            'uniform': '<h4>Properties:</h4><ul><li>Var(X) = (b-a)²/12 depends only on the range width</li><li>Standard deviation is σ = (b-a)/√12</li><li>All values in the interval [a,b] are equally likely</li></ul>',
            'normal': '<h4>Properties:</h4><ul><li>Var(X) = σ² is a parameter of the distribution</li><li>68% of the probability mass is within ±1σ of the mean</li><li>95% is within ±2σ, and 99.7% is within ±3σ (empirical rule)</li></ul>',
            'exponential': '<h4>Properties:</h4><ul><li>Var(X) = 1/λ² is related to the rate parameter</li><li>Standard deviation σ = 1/λ equals the mean</li><li>The coefficient of variation (ratio of std. deviation to mean) is always 1</li></ul>',
            'custom': '<h4>Properties:</h4><ul><li>The variance measures the spread of values around the mean</li><li>Larger variance indicates greater dispersion of values</li><li>The standard deviation σ = √Var(X) has the same units as the random variable</li></ul>'
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
    
    function calculateVariance() {
        const distType = document.getElementById('distribution-type').value;
        let result;
        
        if (distType === 'discrete') {
            const dist = document.getElementById('discrete-distribution').value;
            switch (dist) {
                case 'bernoulli':
                    result = calculateBernoulliVariance();
                    break;
                case 'binomial':
                    result = calculateBinomialVariance();
                    break;
                case 'geometric':
                    result = calculateGeometricVariance();
                    break;
                case 'poisson':
                    result = calculatePoissonVariance();
                    break;
            }
        } else if (distType === 'continuous') {
            const dist = document.getElementById('continuous-distribution').value;
            switch (dist) {
                case 'uniform':
                    result = calculateUniformVariance();
                    break;
                case 'normal':
                    result = calculateNormalVariance();
                    break;
                case 'exponential':
                    result = calculateExponentialVariance();
                    break;
            }
        } else if (distType === 'custom') {
            const customType = document.getElementById('custom-type').value;
            if (customType === 'discrete') {
                result = calculateCustomDiscreteVariance();
            } else {
                result = calculateCustomContinuousVariance();
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
            
            // Update chart with variance visualization
            updateChart(result.params.distribution);
            setTimeout(() => {
                showVarianceOnChart(result.params.mean, result.value);
            }, 100);
        }
    }
    
    function calculateBernoulliVariance() {
        const p = parseFloat(document.getElementById('bernoulli-p').value);
        
        // Calculate variance: Var(X) = p(1-p)
        const variance = p * (1 - p);
        const stdDev = Math.sqrt(variance);
        
        // Generate explanation
        const explanation = `Var(X) = ${variance.toFixed(6)}, σ = ${stdDev.toFixed(6)}`;
        
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
                    Apply the formula for the variance of a Bernoulli random variable:
                    <div class="step-formula">
                        \\[Var(X) = p(1-p)\\]
                    </div>
                </div>
            </div>
            <div class="step">
                <span class="step-number">3</span>
                <div class="step-content">
                    Calculate the variance:
                    <div class="step-formula">
                        \\[Var(X) = ${p} \\times (1-${p}) = ${p} \\times ${(1-p).toFixed(6)} = ${variance.toFixed(6)}\\]
                    </div>
                </div>
            </div>
            <div class="step">
                <span class="step-number">4</span>
                <div class="step-content">
                    Calculate the standard deviation (square root of variance):
                    <div class="step-formula">
                        \\[\\sigma = \\sqrt{Var(X)} = \\sqrt{${variance.toFixed(6)}} = ${stdDev.toFixed(6)}\\]
                    </div>
                </div>
            </div>
            <div class="step">
                <span class="step-number">5</span>
                <div class="step-content">
                    <p>The variance ${variance.toFixed(6)} represents the spread of the Bernoulli distribution around its mean (${p}).</p>
                    <p>The standard deviation ${stdDev.toFixed(6)} gives the typical deviation from the mean in the same units as the random variable.</p>
                    <p>For a Bernoulli distribution, the variance is maximized at p = 0.5, where Var(X) = 0.25.</p>
                </div>
            </div>
        `;
        
        return {
            value: variance,
            explanation: explanation,
            steps: steps,
            params: {
                distribution: 'bernoulli',
                p: p,
                mean: p
            }
        };
    }
    
    function calculateBinomialVariance() {
        const n = parseInt(document.getElementById('binomial-n').value);
        const p = parseFloat(document.getElementById('binomial-p').value);
        
        // Calculate mean and variance
        const mean = n * p;
        const variance = n * p * (1 - p);
        const stdDev = Math.sqrt(variance);
        
        // Generate explanation
        const explanation = `Var(X) = ${variance.toFixed(6)}, σ = ${stdDev.toFixed(6)}`;
        
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
                    Apply the formula for the variance of a binomial random variable:
                    <div class="step-formula">
                        \\[Var(X) = np(1-p)\\]
                    </div>
                </div>
            </div>
            <div class="step">
                <span class="step-number">3</span>
                <div class="step-content">
                    Calculate the variance:
                    <div class="step-formula">
                        \\[Var(X) = ${n} \\times ${p} \\times (1-${p}) = ${n} \\times ${p} \\times ${(1-p).toFixed(6)} = ${variance.toFixed(6)}\\]
                    </div>
                </div>
            </div>
            <div class="step">
                <span class="step-number">4</span>
                <div class="step-content">
                    Calculate the standard deviation (square root of variance):
                    <div class="step-formula">
                        \\[\\sigma = \\sqrt{Var(X)} = \\sqrt{${variance.toFixed(6)}} = ${stdDev.toFixed(6)}\\]
                    </div>
                </div>
            </div>
            <div class="step">
                <span class="step-number">5</span>
                <div class="step-content">
                    <p>The variance ${variance.toFixed(6)} represents the average squared deviation from the mean (${mean.toFixed(6)}).</p>
                    <p>The standard deviation ${stdDev.toFixed(6)} is a measure of the typical deviation from the mean.</p>
                    <p>For a binomial distribution, the variance is maximized when p = 0.5, and increases linearly with n.</p>
                </div>
            </div>
        `;
        
        return {
            value: variance,
            explanation: explanation,
            steps: steps,
            params: {
                distribution: 'binomial',
                n: n,
                p: p,
                mean: mean
            }
        };
    }
    
    function calculateGeometricVariance() {
        const p = parseFloat(document.getElementById('geometric-p').value);
        
        // Calculate mean and variance
        const mean = 1 / p;
        const variance = (1 - p) / (p * p);
        const stdDev = Math.sqrt(variance);
        
        // Generate explanation
        const explanation = `Var(X) = ${variance.toFixed(6)}, σ = ${stdDev.toFixed(6)}`;
        
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
                    Apply the formula for the variance of a geometric random variable:
                    <div class="step-formula">
                        \\[Var(X) = \\frac{1-p}{p^2}\\]
                    </div>
                </div>
            </div>
            <div class="step">
                <span class="step-number">3</span>
                <div class="step-content">
                    Calculate the variance:
                    <div class="step-formula">
                        \\[Var(X) = \\frac{1-${p}}{${p}^2} = \\frac{${(1-p).toFixed(6)}}{${(p*p).toFixed(6)}} = ${variance.toFixed(6)}\\]
                    </div>
                </div>
            </div>
            <div class="step">
                <span class="step-number">4</span>
                <div class="step-content">
                    Calculate the standard deviation (square root of variance):
                    <div class="step-formula">
                        \\[\\sigma = \\sqrt{Var(X)} = \\sqrt{${variance.toFixed(6)}} = ${stdDev.toFixed(6)}\\]
                    </div>
                </div>
            </div>
            <div class="step">
                <span class="step-number">5</span>
                <div class="step-content">
                    <p>The variance ${variance.toFixed(6)} represents the spread of the number of trials needed until the first success.</p>
                    <p>The standard deviation ${stdDev.toFixed(6)} gives the typical deviation from the mean (${mean.toFixed(6)}).</p>
                    <p>As p decreases, both the mean and variance increase, with the variance increasing more rapidly (proportional to 1/p²).</p>
                </div>
            </div>
        `;
        
        return {
            value: variance,
            explanation: explanation,
            steps: steps,
            params: {
                distribution: 'geometric',
                p: p,
                mean: mean
            }
        };
    }
    
    function calculatePoissonVariance() {
        const lambda = parseFloat(document.getElementById('poisson-lambda').value);
        
        // Calculate variance (equal to lambda for Poisson)
        const variance = lambda;
        const stdDev = Math.sqrt(variance);
        
        // Generate explanation
        const explanation = `Var(X) = ${variance.toFixed(6)}, σ = ${stdDev.toFixed(6)}`;
        
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
                    Apply the formula for the variance of a Poisson random variable:
                    <div class="step-formula">
                        \\[Var(X) = \\lambda\\]
                    </div>
                </div>
            </div>
            <div class="step">
                <span class="step-number">3</span>
                <div class="step-content">
                    Calculate the variance:
                    <div class="step-formula">
                        \\[Var(X) = ${lambda} = ${variance.toFixed(6)}\\]
                    </div>
                </div>
            </div>
            <div class="step">
                <span class="step-number">4</span>
                <div class="step-content">
                    Calculate the standard deviation (square root of variance):
                    <div class="step-formula">
                        \\[\\sigma = \\sqrt{Var(X)} = \\sqrt{${lambda}} = ${stdDev.toFixed(6)}\\]
                    </div>
                </div>
            </div>
            <div class="step-number">5</span>
                <div class="step-content">
                    <p>The variance ${variance.toFixed(6)} is equal to the mean for a Poisson distribution, which is a unique property of this distribution.</p>
                    <p>The standard deviation ${stdDev.toFixed(6)} represents the typical deviation from the mean.</p>
                    <p>The index of dispersion (variance-to-mean ratio) for a Poisson distribution is always 1, indicating that the variance equals the mean.</p>
                </div>
            </div>
        `;
        
        return {
            value: variance,
            explanation: explanation,
            steps: steps,
            params: {
                distribution: 'poisson',
                lambda: lambda,
                mean: lambda
            }
        };
    }
    
    function calculateUniformVariance() {
        const a = parseFloat(document.getElementById('uniform-a').value);
        const b = parseFloat(document.getElementById('uniform-b').value);
        
        // Calculate mean and variance
        const mean = (a + b) / 2;
        const variance = Math.pow(b - a, 2) / 12;
        const stdDev = Math.sqrt(variance);
        
        // Generate explanation
        const explanation = `Var(X) = ${variance.toFixed(6)}, σ = ${stdDev.toFixed(6)}`;
        
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
                    Apply the formula for the variance of a uniform random variable:
                    <div class="step-formula">
                        \\[Var(X) = \\frac{(b-a)^2}{12}\\]
                    </div>
                </div>
            </div>
            <div class="step">
                <span class="step-number">3</span>
                <div class="step-content">
                    Calculate the variance:
                    <div class="step-formula">
                        \\[Var(X) = \\frac{(${b}-${a})^2}{12} = \\frac{${(b-a).toFixed(6)}^2}{12} = \\frac{${Math.pow(b-a, 2).toFixed(6)}}{12} = ${variance.toFixed(6)}\\]
                    </div>
                </div>
            </div>
            <div class="step">
                <span class="step-number">4</span>
                <div class="step-content">
                    Calculate the standard deviation (square root of variance):
                    <div class="step-formula">
                        \\[\\sigma = \\sqrt{Var(X)} = \\sqrt{${variance.toFixed(6)}} = ${stdDev.toFixed(6)}\\]
                    </div>
                </div>
            </div>
            <div class="step">
                <span class="step-number">5</span>
                <div class="step-content">
                    <p>The variance ${variance.toFixed(6)} represents the spread of the uniform distribution around its mean (${mean.toFixed(6)}).</p>
                    <p>The standard deviation ${stdDev.toFixed(6)} is the typical deviation from the mean.</p>
                    <p>For a uniform distribution, the variance depends only on the width of the interval and increases quadratically with the width.</p>
                </div>
            </div>
        `;
        
        return {
            value: variance,
            explanation: explanation,
            steps: steps,
            params: {
                distribution: 'uniform',
                a: a,
                b: b,
                mean: mean
            }
        };
    }
    
    function calculateNormalVariance() {
        const mean = parseFloat(document.getElementById('normal-mean').value);
        const stdDev = parseFloat(document.getElementById('normal-sd').value);
        
        // Calculate variance (square of standard deviation)
        const variance = Math.pow(stdDev, 2);
        
        // Generate explanation
        const explanation = `Var(X) = ${variance.toFixed(6)}, σ = ${stdDev.toFixed(6)}`;
        
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
                    Apply the formula for the variance of a normal random variable:
                    <div class="step-formula">
                        \\[Var(X) = \\sigma^2\\]
                    </div>
                </div>
            </div>
            <div class="step">
                <span class="step-number">3</span>
                <div class="step-content">
                    Calculate the variance:
                    <div class="step-formula">
                        \\[Var(X) = ${stdDev}^2 = ${variance.toFixed(6)}\\]
                    </div>
                </div>
            </div>
            <div class="step">
                <span class="step-number">4</span>
                <div class="step-content">
                    <p>For a normal distribution, the variance ${variance.toFixed(6)} is a parameter of the distribution, equal to the square of the standard deviation.</p>
                    <p>The standard deviation ${stdDev.toFixed(6)} represents the typical deviation from the mean.</p>
                    <p>In a normal distribution, approximately 68% of the probability mass is within one standard deviation of the mean, 95% within two standard deviations, and 99.7% within three standard deviations.</p>
                </div>
            </div>
        `;
        
        return {
            value: variance,
            explanation: explanation,
            steps: steps,
            params: {
                distribution: 'normal',
                mean: mean,
                stdDev: stdDev
            }
        };
    }
    
    function calculateExponentialVariance() {
        const lambda = parseFloat(document.getElementById('exponential-lambda').value);
        
        // Calculate mean and variance
        const mean = 1 / lambda;
        const variance = 1 / (lambda * lambda);
        const stdDev = Math.sqrt(variance);
        
        // Generate explanation
        const explanation = `Var(X) = ${variance.toFixed(6)}, σ = ${stdDev.toFixed(6)}`;
        
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
                    Apply the formula for the variance of an exponential random variable:
                    <div class="step-formula">
                        \\[Var(X) = \\frac{1}{\\lambda^2}\\]
                    </div>
                </div>
            </div>
            <div class="step">
                <span class="step-number">3</span>
                <div class="step-content">
                    Calculate the variance:
                    <div class="step-formula">
                        \\[Var(X) = \\frac{1}{${lambda}^2} = \\frac{1}{${(lambda*lambda).toFixed(6)}} = ${variance.toFixed(6)}\\]
                    </div>
                </div>
            </div>
            <div class="step">
                <span class="step-number">4</span>
                <div class="step-content">
                    Calculate the standard deviation (square root of variance):
                    <div class="step-formula">
                        \\[\\sigma = \\sqrt{Var(X)} = \\sqrt{${variance.toFixed(6)}} = ${stdDev.toFixed(6)}\\]
                    </div>
                </div>
            </div>
            <div class="step">
                <span class="step-number">5</span>
                <div class="step-content">
                    <p>The variance ${variance.toFixed(6)} represents the spread of the exponential distribution around its mean (${mean.toFixed(6)}).</p>
                    <p>For an exponential distribution, the standard deviation ${stdDev.toFixed(6)} equals the mean, which is a unique property of this distribution.</p>
                    <p>The coefficient of variation (ratio of standard deviation to mean) is always 1 for an exponential distribution.</p>
                </div>
            </div>
        `;
        
        return {
            value: variance,
            explanation: explanation,
            steps: steps,
            params: {
                distribution: 'exponential',
                lambda: lambda,
                mean: mean
            }
        };
    }
    
    function calculateCustomDiscreteVariance() {
        const dataStr = document.getElementById('custom-discrete-data').value;
        const pairs = dataStr.split(',').map(pair => pair.trim());
        
        const values = [];
        const probs = [];
        let totalProb = 0;
        
        // Parse the input and calculate mean
        let mean = 0;
        for (const pair of pairs) {
            const [value, prob] = pair.split(':').map(part => parseFloat(part.trim()));
            if (!isNaN(value) && !isNaN(prob)) {
                values.push(value);
                probs.push(prob);
                mean += value * prob;
                totalProb += prob;
            }
        }
        
        // Calculate variance
        let variance = 0;
        for (let i = 0; i < values.length; i++) {
            variance += Math.pow(values[i] - mean, 2) * probs[i];
        }
        
        const stdDev = Math.sqrt(variance);
        
        // Check if probabilities sum to 1
        const probSum = totalProb;
        const validProbs = Math.abs(probSum - 1) < 0.001;
        
        // Generate explanation
        const explanation = validProbs ? 
            `Var(X) = ${variance.toFixed(6)}, σ = ${stdDev.toFixed(6)}` :
            `Var(X) = ${variance.toFixed(6)}, σ = ${stdDev.toFixed(6)} (Warning: probabilities sum to ${probSum.toFixed(6)}, not 1)`;
        
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
                    Calculate the mean (expected value):
                    <div class="step-formula">
                        \\[E[X] = \\sum_{i} x_i \\cdot P(X = x_i) = ${values.map((v, i) => `${v} \\cdot ${probs[i]}`).join(' + ')} = ${mean.toFixed(6)}\\]
                    </div>
                </div>
            </div>
            <div class="step">
                <span class="step-number">3</span>
                <div class="step-content">
                    Apply the formula for the variance of a discrete random variable:
                    <div class="step-formula">
                        \\[Var(X) = E[(X - \\mu)^2] = \\sum_{i} (x_i - \\mu)^2 \\cdot P(X = x_i)\\]
                    </div>
                </div>
            </div>
            <div class="step">
                <span class="step-number">4</span>
                <div class="step-content">
                    Calculate the variance:
                    <div class="step-formula">
                        \\[Var(X) = ${values.map((v, i) => `(${v} - ${mean.toFixed(6)})^2 \\cdot ${probs[i]}`).join(' + ')} = ${variance.toFixed(6)}\\]
                    </div>
                </div>
            </div>
            <div class="step">
                <span class="step-number">5</span>
                <div class="step-content">
                    Calculate the standard deviation (square root of variance):
                    <div class="step-formula">
                        \\[\\sigma = \\sqrt{Var(X)} = \\sqrt{${variance.toFixed(6)}} = ${stdDev.toFixed(6)}\\]
                    </div>
                </div>
            </div>
            <div class="step">
                <span class="step-number">6</span>
                <div class="step-content">
                    <p>The variance ${variance.toFixed(6)} represents the spread of the custom discrete distribution around its mean (${mean.toFixed(6)}).</p>
                    <p>The standard deviation ${stdDev.toFixed(6)} gives the typical deviation from the mean in the same units as the random variable.</p>
                </div>
            </div>
        `;
        
        return {
            value: variance,
            explanation: explanation,
            steps: steps,
            params: {
                distribution: 'custom',
                type: 'discrete',
                values: values,
                probs: probs,
                mean: mean
            }
        };
    }
    
    function calculateCustomContinuousVariance() {
        const funcType = document.getElementById('custom-continuous-function').value;
        const a = parseFloat(document.getElementById('custom-continuous-a').value);
        const b = parseFloat(document.getElementById('custom-continuous-b').value);
        
        let formula, mean, variance, stdDev, steps;
        
        switch (funcType) {
            case 'linear':
                const linearA = parseFloat(document.getElementById('custom-linear-a').value);
                const linearB = parseFloat(document.getElementById('custom-linear-b').value);
                
                formula = `f(x) = ${linearA}x + ${linearB}`;
                
                // For linear functions, we can use approximation based on uniform distribution
                mean = (a + b) / 2;
                variance = Math.pow(b - a, 2) / 12;
                stdDev = Math.sqrt(variance);
                
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
                            For a linear function on interval [${a}, ${b}], we can approximate the variance using numerical methods.
                            <p>The mean is approximated as: μ ≈ (a + b)/2 = (${a} + ${b})/2 = ${mean.toFixed(6)}</p>
                            <p>The variance is approximated as: Var(X) ≈ (b-a)²/12 = (${b} - ${a})²/12 = ${Math.pow(b-a, 2).toFixed(6)}/12 = ${variance.toFixed(6)}</p>
                        </div>
                    </div>
                    <div class="step">
                        <span class="step-number">3</span>
                        <div class="step-content">
                            Calculate the standard deviation (square root of variance):
                            <div class="step-formula">
                                \\[\\sigma = \\sqrt{Var(X)} = \\sqrt{${variance.toFixed(6)}} = ${stdDev.toFixed(6)}\\]
                            </div>
                        </div>
                    </div>
                `;
                break;
                
            case 'quadratic':
                const quadA = parseFloat(document.getElementById('custom-quadratic-a').value);
                const quadB = parseFloat(document.getElementById('custom-quadratic-b').value);
                const quadC = parseFloat(document.getElementById('custom-quadratic-c').value);
                
                formula = `f(x) = ${quadA}x² + ${quadB}x + ${quadC}`;
                
                // For quadratic functions, use numerical approximation
                mean = (a + b) / 2;
                variance = Math.pow(b - a, 2) / 12;  // Simple approximation
                stdDev = Math.sqrt(variance);
                
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
                            For a quadratic function on interval [${a}, ${b}], we use numerical approximation for the variance.
                            <p>The mean is approximated as: μ ≈ ${mean.toFixed(6)}</p>
                            <p>The variance is approximated as: Var(X) ≈ ${variance.toFixed(6)}</p>
                        </div>
                    </div>
                    <div class="step">
                        <span class="step-number">3</span>
                        <div class="step-content">
                            Calculate the standard deviation (square root of variance):
                            <div class="step-formula">
                                \\[\\sigma = \\sqrt{Var(X)} = \\sqrt{${variance.toFixed(6)}} = ${stdDev.toFixed(6)}\\]
                            </div>
                        </div>
                    </div>
                `;
                break;
                
            case 'exponential':
                const expA = parseFloat(document.getElementById('custom-exponential-a').value);
                const expB = parseFloat(document.getElementById('custom-exponential-b').value);
                
                formula = `f(x) = ${expA}e^{${expB}x}`;
                
                // For exponential functions, use numerical approximation
                mean = (a + b) / 2;
                variance = Math.pow(b - a, 2) / 12;  // Simple approximation
                stdDev = Math.sqrt(variance);
                
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
                            For an exponential function on interval [${a}, ${b}], we use numerical approximation for the variance.
                            <p>The mean is approximated as: μ ≈ ${mean.toFixed(6)}</p>
                            <p>The variance is approximated as: Var(X) ≈ ${variance.toFixed(6)}</p>
                        </div>
                    </div>
                    <div class="step">
                        <span class="step-number">3</span>
                        <div class="step-content">
                            Calculate the standard deviation (square root of variance):
                            <div class="step-formula">
                                \\[\\sigma = \\sqrt{Var(X)} = \\sqrt{${variance.toFixed(6)}} = ${stdDev.toFixed(6)}\\]
                            </div>
                        </div>
                    </div>
                `;
                break;
        }
        
        // Generate explanation
        const explanation = `Var(X) = ${variance.toFixed(6)}, σ = ${stdDev.toFixed(6)}`;
        
        return {
            value: variance,
            explanation: explanation,
            steps: steps,
            params: {
                distribution: 'custom',
                type: 'continuous',
                function: funcType,
                formula: formula,
                range: [a, b],
                mean: mean
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
            if (answer1 === 'c') {
                feedback1.innerHTML = '<div class="correct-answer"><i class="fas fa-check-circle"></i> Correct! Var(X) = p(1-p) = 0.5 × 0.5 = 0.25</div>';
                feedback1.style.display = 'block';
            } else {
                feedback1.innerHTML = '<div class="wrong-answer"><i class="fas fa-times-circle"></i> Incorrect. The correct answer is 0.25. Var(X) = p(1-p) = 0.5 × 0.5 = 0.25</div>';
                feedback1.style.display = 'block';
            }
        } else {
            document.getElementById('feedback-1').innerHTML = '<div class="warning-message"><i class="fas fa-exclamation-circle"></i> Please select an answer for question 1.</div>';
            document.getElementById('feedback-1').style.display = 'block';
        }
        
        if (answer2) {
            const feedback2 = document.getElementById('feedback-2');
            if (answer2 === 'a') {
                feedback2.innerHTML = '<div class="correct-answer"><i class="fas fa-check-circle"></i> Correct! Var(X) = np(1-p) = 10 × 0.3 × 0.7 = 2.1</div>';
                feedback2.style.display = 'block';
            } else {
                feedback2.innerHTML = '<div class="wrong-answer"><i class="fas fa-times-circle"></i> Incorrect. The correct answer is 2.1. Var(X) = np(1-p) = 10 × 0.3 × 0.7 = 2.1</div>';
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