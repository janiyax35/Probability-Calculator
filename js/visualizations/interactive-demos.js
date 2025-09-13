/**
 * Interactive Probability Demos Module
 * Contains functions for creating interactive probability demonstrations
 * Random Variables & Probability Distributions
 */

// Global state to track active demos
const demoState = {
    activeDemos: {},
    simulationIntervals: {},
    simulationData: {}
};

/**
 * =============================================
 * INTERACTIVE DISTRIBUTION DEMOS
 * =============================================
 */

/**
 * Creates an interactive demo for exploring the normal distribution
 * @param {string} containerId - Container element ID
 * @param {Object} options - Additional options
 * @returns {Object} - Demo controller object
 */
function createNormalDistributionDemo(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID ${containerId} not found`);
        return null;
    }

    // Clean up any existing demo
    container.innerHTML = '';
    
    // Set up default parameters
    const params = {
        mean: options.mean !== undefined ? options.mean : 0,
        stdDev: options.stdDev !== undefined ? options.stdDev : 1,
        lowerBound: options.lowerBound !== undefined ? options.lowerBound : -1,
        upperBound: options.upperBound !== undefined ? options.upperBound : 1,
        showProbability: options.showProbability !== undefined ? options.showProbability : true,
        showCdf: options.showCdf !== undefined ? options.showCdf : false
    };
    
    // Create control panel
    const controlPanel = document.createElement('div');
    controlPanel.className = 'demo-control-panel';
    
    // Create sliders for mean and standard deviation
    const meanSlider = createSlider('mean-slider', 'Mean (μ)', params.mean, -5, 5, 0.1);
    const stdDevSlider = createSlider('stdDev-slider', 'Standard Deviation (σ)', params.stdDev, 0.1, 5, 0.1);
    
    // Create sliders for bounds (if showing probability)
    let lowerBoundSlider, upperBoundSlider;
    if (params.showProbability) {
        lowerBoundSlider = createSlider('lower-bound-slider', 'Lower Bound', params.lowerBound, -10, 10, 0.1);
        upperBoundSlider = createSlider('upper-bound-slider', 'Upper Bound', params.upperBound, -10, 10, 0.1);
    }
    
    // Add visualization toggle
    const visualToggle = document.createElement('div');
    visualToggle.className = 'visual-toggle';
    visualToggle.innerHTML = `
        <label class="toggle-label">
            <input type="checkbox" id="${containerId}-cdf-toggle" ${params.showCdf ? 'checked' : ''}>
            <span>Show CDF</span>
        </label>
    `;
    
    // Add controls to panel
    controlPanel.appendChild(meanSlider);
    controlPanel.appendChild(stdDevSlider);
    if (params.showProbability) {
        controlPanel.appendChild(lowerBoundSlider);
        controlPanel.appendChild(upperBoundSlider);
    }
    controlPanel.appendChild(visualToggle);
    
    // Create visualization container
    const vizContainer = document.createElement('div');
    vizContainer.className = 'demo-viz-container';
    
    // Create PDF canvas
    const pdfCanvas = document.createElement('canvas');
    pdfCanvas.id = `${containerId}-pdf-canvas`;
    pdfCanvas.className = 'demo-canvas';
    
    // Create CDF canvas (initially hidden)
    const cdfCanvas = document.createElement('canvas');
    cdfCanvas.id = `${containerId}-cdf-canvas`;
    cdfCanvas.className = 'demo-canvas';
    cdfCanvas.style.display = params.showCdf ? 'block' : 'none';
    
    // Add canvases to viz container
    vizContainer.appendChild(pdfCanvas);
    vizContainer.appendChild(cdfCanvas);
    
    // Create info panel for probability and statistics
    const infoPanel = document.createElement('div');
    infoPanel.className = 'demo-info-panel';
    infoPanel.innerHTML = `
        <div class="info-section">
            <h4>Distribution Properties</h4>
            <div id="${containerId}-properties"></div>
        </div>
        ${params.showProbability ? 
            `<div class="info-section">
                <h4>Probability</h4>
                <div id="${containerId}-probability"></div>
             </div>` : ''}
        <div class="info-section">
            <h4>Educational Notes</h4>
            <div id="${containerId}-notes"></div>
        </div>
    `;
    
    // Assemble demo
    container.appendChild(controlPanel);
    container.appendChild(vizContainer);
    container.appendChild(infoPanel);
    
    // Initialize charts
    const pdfChart = createNormalPDFChart(`${containerId}-pdf-canvas`, params);
    const cdfChart = createNormalCDFChart(`${containerId}-cdf-canvas`, params);
    
    // Update info panels
    updateNormalDistributionInfo(containerId, params);
    
    // Set up event listeners
    document.getElementById('mean-slider').addEventListener('input', function(e) {
        params.mean = parseFloat(e.target.value);
        updateNormalDistributionDemo(containerId, params, pdfChart, cdfChart);
    });
    
    document.getElementById('stdDev-slider').addEventListener('input', function(e) {
        params.stdDev = parseFloat(e.target.value);
        updateNormalDistributionDemo(containerId, params, pdfChart, cdfChart);
    });
    
    if (params.showProbability) {
        document.getElementById('lower-bound-slider').addEventListener('input', function(e) {
            params.lowerBound = parseFloat(e.target.value);
            // Ensure lower bound is less than upper bound
            if (params.lowerBound > params.upperBound) {
                params.upperBound = params.lowerBound;
                document.getElementById('upper-bound-slider').value = params.upperBound;
            }
            updateNormalDistributionDemo(containerId, params, pdfChart, cdfChart);
        });
        
        document.getElementById('upper-bound-slider').addEventListener('input', function(e) {
            params.upperBound = parseFloat(e.target.value);
            // Ensure upper bound is greater than lower bound
            if (params.upperBound < params.lowerBound) {
                params.lowerBound = params.upperBound;
                document.getElementById('lower-bound-slider').value = params.lowerBound;
            }
            updateNormalDistributionDemo(containerId, params, pdfChart, cdfChart);
        });
    }
    
    document.getElementById(`${containerId}-cdf-toggle`).addEventListener('change', function(e) {
        params.showCdf = e.target.checked;
        cdfCanvas.style.display = params.showCdf ? 'block' : 'none';
    });
    
    // Store demo in global state
    demoState.activeDemos[containerId] = {
        type: 'normalDistribution',
        params: { ...params },
        charts: { pdf: pdfChart, cdf: cdfChart }
    };
    
    // Return controller object
    return {
        updateParams: function(newParams) {
            Object.assign(params, newParams);
            updateNormalDistributionDemo(containerId, params, pdfChart, cdfChart);
            
            // Update sliders to match new params
            document.getElementById('mean-slider').value = params.mean;
            document.getElementById('stdDev-slider').value = params.stdDev;
            if (params.showProbability) {
                document.getElementById('lower-bound-slider').value = params.lowerBound;
                document.getElementById('upper-bound-slider').value = params.upperBound;
            }
        },
        getParams: function() {
            return { ...params };
        },
        destroy: function() {
            container.innerHTML = '';
            delete demoState.activeDemos[containerId];
        }
    };
}

/**
 * Creates an interactive demo for the binomial distribution
 * @param {string} containerId - Container element ID
 * @param {Object} options - Additional options
 * @returns {Object} - Demo controller object
 */
function createBinomialDistributionDemo(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID ${containerId} not found`);
        return null;
    }

    // Clean up any existing demo
    container.innerHTML = '';
    
    // Set up default parameters
    const params = {
        n: options.n !== undefined ? options.n : 10,
        p: options.p !== undefined ? options.p : 0.5,
        k: options.k !== undefined ? options.k : 5,
        showCdf: options.showCdf !== undefined ? options.showCdf : false,
        animateTrials: options.animateTrials !== undefined ? options.animateTrials : false
    };
    
    // Create control panel
    const controlPanel = document.createElement('div');
    controlPanel.className = 'demo-control-panel';
    
    // Create sliders for n and p
    const nSlider = createSlider('n-slider', 'Number of Trials (n)', params.n, 1, 50, 1);
    const pSlider = createSlider('p-slider', 'Success Probability (p)', params.p, 0, 1, 0.01);
    
    // Create slider for k (success count)
    const kSlider = createSlider('k-slider', 'Number of Successes (k)', params.k, 0, params.n, 1);
    
    // Add visualization toggles
    const visualToggles = document.createElement('div');
    visualToggles.className = 'visual-toggles';
    visualToggles.innerHTML = `
        <label class="toggle-label">
            <input type="checkbox" id="${containerId}-cdf-toggle" ${params.showCdf ? 'checked' : ''}>
            <span>Show CDF</span>
        </label>
        <label class="toggle-label">
            <input type="checkbox" id="${containerId}-animate-toggle" ${params.animateTrials ? 'checked' : ''}>
            <span>Animate Trials</span>
        </label>
    `;
    
    // Add simulation button
    const simulationButton = document.createElement('button');
    simulationButton.id = `${containerId}-simulate-btn`;
    simulationButton.className = 'btn btn-outline-primary';
    simulationButton.textContent = 'Run Simulation';
    
    // Add controls to panel
    controlPanel.appendChild(nSlider);
    controlPanel.appendChild(pSlider);
    controlPanel.appendChild(kSlider);
    controlPanel.appendChild(visualToggles);
    controlPanel.appendChild(simulationButton);
    
    // Create visualization container
    const vizContainer = document.createElement('div');
    vizContainer.className = 'demo-viz-container';
    
    // Create PMF canvas
    const pmfCanvas = document.createElement('canvas');
    pmfCanvas.id = `${containerId}-pmf-canvas`;
    pmfCanvas.className = 'demo-canvas';
    
    // Create CDF canvas (initially hidden)
    const cdfCanvas = document.createElement('canvas');
    cdfCanvas.id = `${containerId}-cdf-canvas`;
    cdfCanvas.className = 'demo-canvas';
    cdfCanvas.style.display = params.showCdf ? 'block' : 'none';
    
    // Create simulation canvas
    const simCanvas = document.createElement('canvas');
    simCanvas.id = `${containerId}-sim-canvas`;
    simCanvas.className = 'demo-canvas';
    simCanvas.style.display = params.animateTrials ? 'block' : 'none';
    
    // Add canvases to viz container
    vizContainer.appendChild(pmfCanvas);
    vizContainer.appendChild(cdfCanvas);
    vizContainer.appendChild(simCanvas);
    
    // Create info panel for probability and statistics
    const infoPanel = document.createElement('div');
    infoPanel.className = 'demo-info-panel';
    infoPanel.innerHTML = `
        <div class="info-section">
            <h4>Distribution Properties</h4>
            <div id="${containerId}-properties"></div>
        </div>
        <div class="info-section">
            <h4>Probability P(X = k)</h4>
            <div id="${containerId}-probability"></div>
        </div>
        <div class="info-section">
            <h4>Cumulative Probability P(X ≤ k)</h4>
            <div id="${containerId}-cumulative"></div>
        </div>
        <div class="info-section">
            <h4>Educational Notes</h4>
            <div id="${containerId}-notes"></div>
        </div>
    `;
    
    // Assemble demo
    container.appendChild(controlPanel);
    container.appendChild(vizContainer);
    container.appendChild(infoPanel);
    
    // Initialize charts
    const pmfChart = createBinomialPMFChart(`${containerId}-pmf-canvas`, params);
    const cdfChart = createBinomialCDFChart(`${containerId}-cdf-canvas`, params);
    let simChart = null;
    
    if (params.animateTrials) {
        simChart = createBinomialSimulationChart(`${containerId}-sim-canvas`, params);
    }
    
    // Update info panels
    updateBinomialDistributionInfo(containerId, params);
    
    // Set up event listeners
    document.getElementById('n-slider').addEventListener('input', function(e) {
        params.n = parseInt(e.target.value);
        // Update k slider max
        const kSlider = document.getElementById('k-slider');
        kSlider.max = params.n;
        // Ensure k is not greater than n
        if (params.k > params.n) {
            params.k = params.n;
            kSlider.value = params.k;
        }
        updateBinomialDistributionDemo(containerId, params, pmfChart, cdfChart, simChart);
    });
    
    document.getElementById('p-slider').addEventListener('input', function(e) {
        params.p = parseFloat(e.target.value);
        updateBinomialDistributionDemo(containerId, params, pmfChart, cdfChart, simChart);
    });
    
    document.getElementById('k-slider').addEventListener('input', function(e) {
        params.k = parseInt(e.target.value);
        updateBinomialDistributionDemo(containerId, params, pmfChart, cdfChart, simChart);
    });
    
    document.getElementById(`${containerId}-cdf-toggle`).addEventListener('change', function(e) {
        params.showCdf = e.target.checked;
        cdfCanvas.style.display = params.showCdf ? 'block' : 'none';
    });
    
    document.getElementById(`${containerId}-animate-toggle`).addEventListener('change', function(e) {
        params.animateTrials = e.target.checked;
        simCanvas.style.display = params.animateTrials ? 'block' : 'none';
        
        if (params.animateTrials && !simChart) {
            simChart = createBinomialSimulationChart(`${containerId}-sim-canvas`, params);
        }
    });
    
    document.getElementById(`${containerId}-simulate-btn`).addEventListener('click', function() {
        runBinomialSimulation(containerId, params, pmfChart, simChart);
    });
    
    // Store demo in global state
    demoState.activeDemos[containerId] = {
        type: 'binomialDistribution',
        params: { ...params },
        charts: { pmf: pmfChart, cdf: cdfChart, sim: simChart }
    };
    
    // Return controller object
    return {
        updateParams: function(newParams) {
            Object.assign(params, newParams);
            updateBinomialDistributionDemo(containerId, params, pmfChart, cdfChart, simChart);
            
            // Update sliders to match new params
            document.getElementById('n-slider').value = params.n;
            document.getElementById('p-slider').value = params.p;
            document.getElementById('k-slider').value = params.k;
            document.getElementById('k-slider').max = params.n;
        },
        getParams: function() {
            return { ...params };
        },
        runSimulation: function() {
            runBinomialSimulation(containerId, params, pmfChart, simChart);
        },
        destroy: function() {
            // Stop any running simulation
            if (demoState.simulationIntervals[containerId]) {
                clearInterval(demoState.simulationIntervals[containerId]);
                delete demoState.simulationIntervals[containerId];
            }
            
            container.innerHTML = '';
            delete demoState.activeDemos[containerId];
        }
    };
}

/**
 * Creates an interactive demo for the central limit theorem
 * @param {string} containerId - Container element ID
 * @param {Object} options - Additional options
 * @returns {Object} - Demo controller object
 */
function createCentralLimitTheoremDemo(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID ${containerId} not found`);
        return null;
    }

    // Clean up any existing demo
    container.innerHTML = '';
    
    // Set up default parameters
    const params = {
        distribution: options.distribution || 'uniform',
        sampleSize: options.sampleSize || 5,
        numSamples: options.numSamples || 1000,
        animationSpeed: options.animationSpeed || 10,
        isAnimating: false
    };
    
    // Set up distribution-specific parameters
    switch (params.distribution) {
        case 'uniform':
            params.a = options.a !== undefined ? options.a : 0;
            params.b = options.b !== undefined ? options.b : 1;
            params.mean = (params.a + params.b) / 2;
            params.variance = Math.pow(params.b - params.a, 2) / 12;
            break;
        case 'exponential':
            params.rate = options.rate !== undefined ? options.rate : 1;
            params.mean = 1 / params.rate;
            params.variance = 1 / (params.rate * params.rate);
            break;
        case 'bernoulli':
            params.p = options.p !== undefined ? options.p : 0.5;
            params.mean = params.p;
            params.variance = params.p * (1 - params.p);
            break;
        default:
            params.distribution = 'uniform';
            params.a = 0;
            params.b = 1;
            params.mean = 0.5;
            params.variance = 1/12;
    }
    
    // Create control panel
    const controlPanel = document.createElement('div');
    controlPanel.className = 'demo-control-panel';
    
    // Create distribution selector
    const distributionSelector = document.createElement('div');
    distributionSelector.className = 'form-group mb-3';
    distributionSelector.innerHTML = `
        <label for="${containerId}-distribution" class="form-label">Parent Distribution</label>
        <select id="${containerId}-distribution" class="form-select">
            <option value="uniform" ${params.distribution === 'uniform' ? 'selected' : ''}>Uniform</option>
            <option value="exponential" ${params.distribution === 'exponential' ? 'selected' : ''}>Exponential</option>
            <option value="bernoulli" ${params.distribution === 'bernoulli' ? 'selected' : ''}>Bernoulli</option>
        </select>
    `;
    
    // Create distribution parameter controls (initially for uniform)
    const distributionParams = document.createElement('div');
    distributionParams.id = `${containerId}-distribution-params`;
    distributionParams.className = 'distribution-params';
    updateDistributionParamsControls(containerId, distributionParams, params);
    
    // Create sliders for sample size and number of samples
    const sampleSizeSlider = createSlider('sample-size-slider', 'Sample Size (n)', params.sampleSize, 1, 50, 1);
    const numSamplesSlider = createSlider('num-samples-slider', 'Number of Samples', params.numSamples, 100, 5000, 100);
    const animationSpeedSlider = createSlider('animation-speed-slider', 'Animation Speed', params.animationSpeed, 1, 50, 1);
    
    // Add simulation buttons
    const simulationButtons = document.createElement('div');
    simulationButtons.className = 'simulation-buttons d-flex gap-2 mt-3';
    simulationButtons.innerHTML = `
        <button id="${containerId}-reset-btn" class="btn btn-outline-secondary">Reset</button>
        <button id="${containerId}-sample-btn" class="btn btn-outline-primary">Generate Sample</button>
        <button id="${containerId}-animate-btn" class="btn btn-primary">Start Animation</button>
    `;
    
    // Add controls to panel
    controlPanel.appendChild(distributionSelector);
    controlPanel.appendChild(distributionParams);
    controlPanel.appendChild(sampleSizeSlider);
    controlPanel.appendChild(numSamplesSlider);
    controlPanel.appendChild(animationSpeedSlider);
    controlPanel.appendChild(simulationButtons);
    
    // Create visualization container
    const vizContainer = document.createElement('div');
    vizContainer.className = 'demo-viz-container row';
    
    // Create parent distribution canvas
    const parentContainer = document.createElement('div');
    parentContainer.className = 'col-md-6';
    parentContainer.innerHTML = `
        <h5 class="text-center">Parent Distribution</h5>
        <canvas id="${containerId}-parent-canvas" class="demo-canvas"></canvas>
    `;
    
    // Create sample means canvas
    const samplesContainer = document.createElement('div');
    samplesContainer.className = 'col-md-6';
    samplesContainer.innerHTML = `
        <h5 class="text-center">Distribution of Sample Means</h5>
        <canvas id="${containerId}-samples-canvas" class="demo-canvas"></canvas>
    `;
    
    // Add canvases to viz container
    vizContainer.appendChild(parentContainer);
    vizContainer.appendChild(samplesContainer);
    
    // Create info panel
    const infoPanel = document.createElement('div');
    infoPanel.className = 'demo-info-panel';
    infoPanel.innerHTML = `
        <div class="info-section row">
            <div class="col-md-6">
                <h4>Parent Distribution Properties</h4>
                <div id="${containerId}-parent-properties"></div>
            </div>
            <div class="col-md-6">
                <h4>Sample Means Properties</h4>
                <div id="${containerId}-samples-properties"></div>
            </div>
        </div>
        <div class="info-section">
            <h4>Central Limit Theorem</h4>
            <div id="${containerId}-notes">
                <p>The Central Limit Theorem states that the distribution of sample means approximates a normal distribution as the sample size increases, regardless of the parent distribution's shape.</p>
                <p>Key observations:</p>
                <ul>
                    <li>The mean of the sample means equals the parent distribution mean</li>
                    <li>The variance of the sample means equals the parent variance divided by the sample size</li>
                    <li>The approximation improves as the sample size increases</li>
                </ul>
            </div>
        </div>
    `;
    
    // Assemble demo
    container.appendChild(controlPanel);
    container.appendChild(vizContainer);
    container.appendChild(infoPanel);
    
    // Initialize the simulation data
    demoState.simulationData[containerId] = {
        sampleMeans: [],
        currentSamples: 0,
        theoreticalMean: params.mean,
        theoreticalStdDev: Math.sqrt(params.variance / params.sampleSize)
    };
    
    // Initialize charts
    const parentChart = createParentDistributionChart(`${containerId}-parent-canvas`, params);
    const samplesChart = createSampleMeansChart(`${containerId}-samples-canvas`, params);
    
    // Update info panels
    updateCLTDemoInfo(containerId, params);
    
    // Set up event listeners
    document.getElementById(`${containerId}-distribution`).addEventListener('change', function(e) {
        params.distribution = e.target.value;
        
        // Update distribution parameters
        switch (params.distribution) {
            case 'uniform':
                params.a = 0;
                params.b = 1;
                params.mean = 0.5;
                params.variance = 1/12;
                break;
            case 'exponential':
                params.rate = 1;
                params.mean = 1;
                params.variance = 1;
                break;
            case 'bernoulli':
                params.p = 0.5;
                params.mean = 0.5;
                params.variance = 0.25;
                break;
        }
        
        // Update distribution parameter controls
        updateDistributionParamsControls(containerId, document.getElementById(`${containerId}-distribution-params`), params);
        
        // Reset simulation
        resetCLTSimulation(containerId, params, parentChart, samplesChart);
    });
    
    // We'll add event listeners for distribution-specific parameters in the updateDistributionParamsControls function
    
    document.getElementById('sample-size-slider').addEventListener('input', function(e) {
        params.sampleSize = parseInt(e.target.value);
        demoState.simulationData[containerId].theoreticalStdDev = Math.sqrt(params.variance / params.sampleSize);
        resetCLTSimulation(containerId, params, parentChart, samplesChart);
    });
    
    document.getElementById('num-samples-slider').addEventListener('input', function(e) {
        params.numSamples = parseInt(e.target.value);
    });
    
    document.getElementById('animation-speed-slider').addEventListener('input', function(e) {
        params.animationSpeed = parseInt(e.target.value);
        
        // Update animation interval if running
        if (params.isAnimating && demoState.simulationIntervals[containerId]) {
            clearInterval(demoState.simulationIntervals[containerId]);
            demoState.simulationIntervals[containerId] = setInterval(function() {
                generateCLTSample(containerId, params, samplesChart);
            }, 1000 / params.animationSpeed);
        }
    });
    
    document.getElementById(`${containerId}-reset-btn`).addEventListener('click', function() {
        resetCLTSimulation(containerId, params, parentChart, samplesChart);
    });
    
    document.getElementById(`${containerId}-sample-btn`).addEventListener('click', function() {
        generateCLTSample(containerId, params, samplesChart);
    });
    
    document.getElementById(`${containerId}-animate-btn`).addEventListener('click', function() {
        const btn = document.getElementById(`${containerId}-animate-btn`);
        
        if (params.isAnimating) {
            // Stop animation
            params.isAnimating = false;
            btn.textContent = 'Start Animation';
            btn.classList.remove('btn-danger');
            btn.classList.add('btn-primary');
            
            if (demoState.simulationIntervals[containerId]) {
                clearInterval(demoState.simulationIntervals[containerId]);
                delete demoState.simulationIntervals[containerId];
            }
        } else {
            // Start animation
            params.isAnimating = true;
            btn.textContent = 'Stop Animation';
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-danger');
            
            demoState.simulationIntervals[containerId] = setInterval(function() {
                generateCLTSample(containerId, params, samplesChart);
            }, 1000 / params.animationSpeed);
        }
    });
    
    // Store demo in global state
    demoState.activeDemos[containerId] = {
        type: 'centralLimitTheorem',
        params: { ...params },
        charts: { parent: parentChart, samples: samplesChart }
    };
    
    // Return controller object
    return {
        updateParams: function(newParams) {
            // Stop any running animation
            if (params.isAnimating) {
                params.isAnimating = false;
                const btn = document.getElementById(`${containerId}-animate-btn`);
                btn.textContent = 'Start Animation';
                btn.classList.remove('btn-danger');
                btn.classList.add('btn-primary');
                
                if (demoState.simulationIntervals[containerId]) {
                    clearInterval(demoState.simulationIntervals[containerId]);
                    delete demoState.simulationIntervals[containerId];
                }
            }
            
            // Update parameters
            Object.assign(params, newParams);
            
            // Update distribution-specific parameters
            switch (params.distribution) {
                case 'uniform':
                    params.mean = (params.a + params.b) / 2;
                    params.variance = Math.pow(params.b - params.a, 2) / 12;
                    break;
                case 'exponential':
                    params.mean = 1 / params.rate;
                    params.variance = 1 / (params.rate * params.rate);
                    break;
                case 'bernoulli':
                    params.mean = params.p;
                    params.variance = params.p * (1 - params.p);
                    break;
            }
            
            demoState.simulationData[containerId].theoreticalMean = params.mean;
            demoState.simulationData[containerId].theoreticalStdDev = Math.sqrt(params.variance / params.sampleSize);
            
            // Update UI controls
            document.getElementById(`${containerId}-distribution`).value = params.distribution;
            document.getElementById('sample-size-slider').value = params.sampleSize;
            document.getElementById('num-samples-slider').value = params.numSamples;
            document.getElementById('animation-speed-slider').value = params.animationSpeed;
            
            // Update distribution parameter controls
            updateDistributionParamsControls(containerId, document.getElementById(`${containerId}-distribution-params`), params);
            
            // Reset simulation
            resetCLTSimulation(containerId, params, parentChart, samplesChart);
        },
        getParams: function() {
            return { ...params };
        },
        generateSample: function() {
            generateCLTSample(containerId, params, samplesChart);
        },
        reset: function() {
            resetCLTSimulation(containerId, params, parentChart, samplesChart);
        },
        destroy: function() {
            // Stop any running animation
            if (demoState.simulationIntervals[containerId]) {
                clearInterval(demoState.simulationIntervals[containerId]);
                delete demoState.simulationIntervals[containerId];
            }
            
            // Clean up simulation data
            delete demoState.simulationData[containerId];
            
            container.innerHTML = '';
            delete demoState.activeDemos[containerId];
        }
    };
}

/**
 * Creates an interactive demo for the law of large numbers
 * @param {string} containerId - Container element ID
 * @param {Object} options - Additional options
 * @returns {Object} - Demo controller object
 */
function createLawOfLargeNumbersDemo(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container with ID ${containerId} not found`);
        return null;
    }

    // Clean up any existing demo
    container.innerHTML = '';
    
    // Set up default parameters
    const params = {
        distribution: options.distribution || 'uniform',
        maxSamples: options.maxSamples || 1000,
        animationSpeed: options.animationSpeed || 10,
        isAnimating: false
    };
    
    // Set up distribution-specific parameters
    switch (params.distribution) {
        case 'uniform':
            params.a = options.a !== undefined ? options.a : 0;
            params.b = options.b !== undefined ? options.b : 1;
            params.mean = (params.a + params.b) / 2;
            params.variance = Math.pow(params.b - params.a, 2) / 12;
            break;
        case 'exponential':
            params.rate = options.rate !== undefined ? options.rate : 1;
            params.mean = 1 / params.rate;
            params.variance = 1 / (params.rate * params.rate);
            break;
        case 'normal':
            params.mean = options.mean !== undefined ? options.mean : 0;
            params.stdDev = options.stdDev !== undefined ? options.stdDev : 1;
            params.variance = params.stdDev * params.stdDev;
            break;
        default:
            params.distribution = 'uniform';
            params.a = 0;
            params.b = 1;
            params.mean = 0.5;
            params.variance = 1/12;
    }
    
    // Create control panel
    const controlPanel = document.createElement('div');
    controlPanel.className = 'demo-control-panel';
    
    // Create distribution selector
    const distributionSelector = document.createElement('div');
    distributionSelector.className = 'form-group mb-3';
    distributionSelector.innerHTML = `
        <label for="${containerId}-distribution" class="form-label">Distribution</label>
        <select id="${containerId}-distribution" class="form-select">
            <option value="uniform" ${params.distribution === 'uniform' ? 'selected' : ''}>Uniform</option>
            <option value="exponential" ${params.distribution === 'exponential' ? 'selected' : ''}>Exponential</option>
            <option value="normal" ${params.distribution === 'normal' ? 'selected' : ''}>Normal</option>
        </select>
    `;
    
    // Create distribution parameter controls
    const distributionParams = document.createElement('div');
    distributionParams.id = `${containerId}-distribution-params`;
    distributionParams.className = 'distribution-params';
    updateDistributionParamsControls(containerId, distributionParams, params);
    
    // Create sliders for max samples and animation speed
    const maxSamplesSlider = createSlider('max-samples-slider', 'Maximum Samples', params.maxSamples, 100, 10000, 100);
    const animationSpeedSlider = createSlider('animation-speed-slider', 'Animation Speed', params.animationSpeed, 1, 50, 1);
    
    // Add simulation buttons
    const simulationButtons = document.createElement('div');
    simulationButtons.className = 'simulation-buttons d-flex gap-2 mt-3';
    simulationButtons.innerHTML = `
        <button id="${containerId}-reset-btn" class="btn btn-outline-secondary">Reset</button>
        <button id="${containerId}-sample-btn" class="btn btn-outline-primary">Generate Sample</button>
        <button id="${containerId}-animate-btn" class="btn btn-primary">Start Animation</button>
    `;
    
    // Add controls to panel
    controlPanel.appendChild(distributionSelector);
    controlPanel.appendChild(distributionParams);
    controlPanel.appendChild(maxSamplesSlider);
    controlPanel.appendChild(animationSpeedSlider);
    controlPanel.appendChild(simulationButtons);
    
    // Create visualization container
    const vizContainer = document.createElement('div');
    vizContainer.className = 'demo-viz-container row';
    
    // Create sample values canvas
    const samplesContainer = document.createElement('div');
    samplesContainer.className = 'col-md-6';
    samplesContainer.innerHTML = `
        <h5 class="text-center">Sample Values</h5>
        <canvas id="${containerId}-samples-canvas" class="demo-canvas"></canvas>
    `;
    
    // Create running average canvas
    const avgContainer = document.createElement('div');
    avgContainer.className = 'col-md-6';
    avgContainer.innerHTML = `
        <h5 class="text-center">Running Average</h5>
        <canvas id="${containerId}-avg-canvas" class="demo-canvas"></canvas>
    `;
    
    // Add canvases to viz container
    vizContainer.appendChild(samplesContainer);
    vizContainer.appendChild(avgContainer);
    
    // Create info panel
    const infoPanel = document.createElement('div');
    infoPanel.className = 'demo-info-panel';
    infoPanel.innerHTML = `
        <div class="info-section row">
            <div class="col-md-6">
                <h4>Distribution Properties</h4>
                <div id="${containerId}-distribution-properties"></div>
            </div>
            <div class="col-md-6">
                <h4>Simulation Statistics</h4>
                <div id="${containerId}-simulation-stats"></div>
            </div>
        </div>
        <div class="info-section">
            <h4>Law of Large Numbers</h4>
            <div id="${containerId}-notes">
                <p>The Law of Large Numbers states that as the number of trials increases, the sample average approaches the expected value (theoretical mean) of the underlying distribution.</p>
                <p>Key observations:</p>
                <ul>
                    <li>Individual samples vary widely around the mean</li>
                    <li>The running average converges to the theoretical mean</li>
                    <li>The convergence is faster initially, then slows down</li>
                </ul>
            </div>
        </div>
    `;
    
    // Assemble demo
    container.appendChild(controlPanel);
    container.appendChild(vizContainer);
    container.appendChild(infoPanel);
    
    // Initialize the simulation data
    demoState.simulationData[containerId] = {
        samples: [],
        runningAvg: [],
        currentSamples: 0,
        theoreticalMean: params.mean,
        theoreticalStdDev: Math.sqrt(params.variance)
    };
    
    // Initialize charts
    const samplesChart = createSamplesChart(`${containerId}-samples-canvas`, params);
    const avgChart = createRunningAverageChart(`${containerId}-avg-canvas`, params);
    
    // Update info panels
    updateLLNDemoInfo(containerId, params);
    
    // Set up event listeners
    document.getElementById(`${containerId}-distribution`).addEventListener('change', function(e) {
        params.distribution = e.target.value;
        
        // Update distribution parameters
        switch (params.distribution) {
            case 'uniform':
                params.a = 0;
                params.b = 1;
                params.mean = 0.5;
                params.variance = 1/12;
                break;
            case 'exponential':
                params.rate = 1;
                params.mean = 1;
                params.variance = 1;
                break;
            case 'normal':
                params.mean = 0;
                params.stdDev = 1;
                params.variance = 1;
                break;
        }
        
        // Update distribution parameter controls
        updateDistributionParamsControls(containerId, document.getElementById(`${containerId}-distribution-params`), params);
        
        // Reset simulation
        resetLLNSimulation(containerId, params, samplesChart, avgChart);
    });
    
    document.getElementById('max-samples-slider').addEventListener('input', function(e) {
        params.maxSamples = parseInt(e.target.value);
        updateLLNCharts(containerId, samplesChart, avgChart, params);
    });
    
    document.getElementById('animation-speed-slider').addEventListener('input', function(e) {
        params.animationSpeed = parseInt(e.target.value);
        
        // Update animation interval if running
        if (params.isAnimating && demoState.simulationIntervals[containerId]) {
            clearInterval(demoState.simulationIntervals[containerId]);
            demoState.simulationIntervals[containerId] = setInterval(function() {
                generateLLNSample(containerId, params, samplesChart, avgChart);
            }, 1000 / params.animationSpeed);
        }
    });
    
    document.getElementById(`${containerId}-reset-btn`).addEventListener('click', function() {
        resetLLNSimulation(containerId, params, samplesChart, avgChart);
    });
    
    document.getElementById(`${containerId}-sample-btn`).addEventListener('click', function() {
        generateLLNSample(containerId, params, samplesChart, avgChart);
    });
    
    document.getElementById(`${containerId}-animate-btn`).addEventListener('click', function() {
        const btn = document.getElementById(`${containerId}-animate-btn`);
        
        if (params.isAnimating) {
            // Stop animation
            params.isAnimating = false;
            btn.textContent = 'Start Animation';
            btn.classList.remove('btn-danger');
            btn.classList.add('btn-primary');
            
            if (demoState.simulationIntervals[containerId]) {
                clearInterval(demoState.simulationIntervals[containerId]);
                delete demoState.simulationIntervals[containerId];
            }
        } else {
            // Start animation
            params.isAnimating = true;
            btn.textContent = 'Stop Animation';
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-danger');
            
            demoState.simulationIntervals[containerId] = setInterval(function() {
                generateLLNSample(containerId, params, samplesChart, avgChart);
                
                // Stop animation if we've reached max samples
                if (demoState.simulationData[containerId].currentSamples >= params.maxSamples) {
                    params.isAnimating = false;
                    btn.textContent = 'Start Animation';
                    btn.classList.remove('btn-danger');
                    btn.classList.add('btn-primary');
                    
                    clearInterval(demoState.simulationIntervals[containerId]);
                    delete demoState.simulationIntervals[containerId];
                }
            }, 1000 / params.animationSpeed);
        }
    });
    
    // Store demo in global state
    demoState.activeDemos[containerId] = {
        type: 'lawOfLargeNumbers',
        params: { ...params },
        charts: { samples: samplesChart, avg: avgChart }
    };
    
    // Return controller object
    return {
        updateParams: function(newParams) {
            // Stop any running animation
            if (params.isAnimating) {
                params.isAnimating = false;
                const btn = document.getElementById(`${containerId}-animate-btn`);
                btn.textContent = 'Start Animation';
                btn.classList.remove('btn-danger');
                btn.classList.add('btn-primary');
                
                if (demoState.simulationIntervals[containerId]) {
                    clearInterval(demoState.simulationIntervals[containerId]);
                    delete demoState.simulationIntervals[containerId];
                }
            }
            
            // Update parameters
            Object.assign(params, newParams);
            
            // Update distribution-specific parameters
            switch (params.distribution) {
                case 'uniform':
                    params.mean = (params.a + params.b) / 2;
                    params.variance = Math.pow(params.b - params.a, 2) / 12;
                    break;
                case 'exponential':
                    params.mean = 1 / params.rate;
                    params.variance = 1 / (params.rate * params.rate);
                    break;
                case 'normal':
                    params.variance = params.stdDev * params.stdDev;
                    break;
            }
            
            demoState.simulationData[containerId].theoreticalMean = params.mean;
            demoState.simulationData[containerId].theoreticalStdDev = Math.sqrt(params.variance);
            
            // Update UI controls
            document.getElementById(`${containerId}-distribution`).value = params.distribution;
            document.getElementById('max-samples-slider').value = params.maxSamples;
            document.getElementById('animation-speed-slider').value = params.animationSpeed;
            
            // Update distribution parameter controls
            updateDistributionParamsControls(containerId, document.getElementById(`${containerId}-distribution-params`), params);
            
            // Reset simulation
            resetLLNSimulation(containerId, params, samplesChart, avgChart);
        },
        getParams: function() {
            return { ...params };
        },
        generateSample: function() {
            generateLLNSample(containerId, params, samplesChart, avgChart);
        },
        reset: function() {
            resetLLNSimulation(containerId, params, samplesChart, avgChart);
        },
        destroy: function() {
            // Stop any running animation
            if (demoState.simulationIntervals[containerId]) {
                clearInterval(demoState.simulationIntervals[containerId]);
                delete demoState.simulationIntervals[containerId];
            }
            
            // Clean up simulation data
            delete demoState.simulationData[containerId];
            
            container.innerHTML = '';
            delete demoState.activeDemos[containerId];
        }
    };
}

/**
 * =============================================
 * HELPER FUNCTIONS - UI COMPONENTS
 * =============================================
 */

/**
 * Creates a slider input with label
 * @param {string} id - Slider ID
 * @param {string} label - Slider label
 * @param {number} value - Initial value
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {number} step - Step size
 * @returns {HTMLElement} - Slider div element
 */
function createSlider(id, label, value, min, max, step) {
    const sliderDiv = document.createElement('div');
    sliderDiv.className = 'mb-3';
    
    const sliderLabel = document.createElement('label');
    sliderLabel.className = 'form-label d-flex justify-content-between';
    sliderLabel.innerHTML = `
        <span>${label}</span>
        <span class="slider-value" id="${id}-value">${value}</span>
    `;
    
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.className = 'form-range';
    slider.id = id;
    slider.min = min;
    slider.max = max;
    slider.step = step;
    slider.value = value;
    
    // Update value display when slider changes
    slider.addEventListener('input', function() {
        document.getElementById(`${id}-value`).textContent = this.value;
    });
    
    sliderDiv.appendChild(sliderLabel);
    sliderDiv.appendChild(slider);
    
    return sliderDiv;
}

/**
 * Updates distribution parameter controls based on selected distribution
 * @param {string} containerId - Container ID
 * @param {HTMLElement} container - Container for parameter controls
 * @param {Object} params - Current parameters
 */
function updateDistributionParamsControls(containerId, container, params) {
    // Clear existing controls
    container.innerHTML = '';
    
    // Create controls based on distribution
    switch (params.distribution) {
        case 'uniform':
            // Add sliders for a and b
            const aSlider = createSlider(`${containerId}-a-slider`, 'Lower Bound (a)', params.a, -10, 10, 0.1);
            const bSlider = createSlider(`${containerId}-b-slider`, 'Upper Bound (b)', params.b, -10, 10, 0.1);
            
            container.appendChild(aSlider);
            container.appendChild(bSlider);
            
            // Add event listeners
            document.getElementById(`${containerId}-a-slider`).addEventListener('input', function(e) {
                params.a = parseFloat(e.target.value);
                
                // Ensure a < b
                if (params.a >= params.b) {
                    params.b = params.a + 0.1;
                    document.getElementById(`${containerId}-b-slider`).value = params.b;
                    document.getElementById(`${containerId}-b-slider-value`).textContent = params.b;
                }
                
                // Update theoretical values
                params.mean = (params.a + params.b) / 2;
                params.variance = Math.pow(params.b - params.a, 2) / 12;
                
                if (demoState.simulationData[containerId]) {
                    demoState.simulationData[containerId].theoreticalMean = params.mean;
                    demoState.simulationData[containerId].theoreticalStdDev = Math.sqrt(params.variance);
                    
                    // If this is the CLT demo, update the std dev of sample means
                    if (demoState.activeDemos[containerId].type === 'centralLimitTheorem') {
                        demoState.simulationData[containerId].theoreticalStdDev = Math.sqrt(params.variance / params.sampleSize);
                    }
                }
                
                // Update parent chart if present
                if (demoState.activeDemos[containerId].charts.parent) {
                    updateParentDistributionChart(containerId, demoState.activeDemos[containerId].charts.parent, params);
                }
                
                // Update info panels
                if (demoState.activeDemos[containerId].type === 'centralLimitTheorem') {
                    updateCLTDemoInfo(containerId, params);
                } else if (demoState.activeDemos[containerId].type === 'lawOfLargeNumbers') {
                    updateLLNDemoInfo(containerId, params);
                }
            });
            
            document.getElementById(`${containerId}-b-slider`).addEventListener('input', function(e) {
                params.b = parseFloat(e.target.value);
                
                // Ensure b > a
                if (params.b <= params.a) {
                    params.a = params.b - 0.1;
                    document.getElementById(`${containerId}-a-slider`).value = params.a;
                    document.getElementById(`${containerId}-a-slider-value`).textContent = params.a;
                }
                
                // Update theoretical values
                params.mean = (params.a + params.b) / 2;
                params.variance = Math.pow(params.b - params.a, 2) / 12;
                
                if (demoState.simulationData[containerId]) {
                    demoState.simulationData[containerId].theoreticalMean = params.mean;
                    demoState.simulationData[containerId].theoreticalStdDev = Math.sqrt(params.variance);
                    
                    // If this is the CLT demo, update the std dev of sample means
                    if (demoState.activeDemos[containerId].type === 'centralLimitTheorem') {
                        demoState.simulationData[containerId].theoreticalStdDev = Math.sqrt(params.variance / params.sampleSize);
                    }
                }
                
                // Update parent chart if present
                if (demoState.activeDemos[containerId].charts.parent) {
                    updateParentDistributionChart(containerId, demoState.activeDemos[containerId].charts.parent, params);
                }
                
                // Update info panels
                if (demoState.activeDemos[containerId].type === 'centralLimitTheorem') {
                    updateCLTDemoInfo(containerId, params);
                } else if (demoState.activeDemos[containerId].type === 'lawOfLargeNumbers') {
                    updateLLNDemoInfo(containerId, params);
                }
            });
            break;
            
        case 'exponential':
            // Add slider for rate
            const rateSlider = createSlider(`${containerId}-rate-slider`, 'Rate Parameter (λ)', params.rate, 0.1, 5, 0.1);
            container.appendChild(rateSlider);
            
            // Add event listener
            document.getElementById(`${containerId}-rate-slider`).addEventListener('input', function(e) {
                params.rate = parseFloat(e.target.value);
                
                // Update theoretical values
                params.mean = 1 / params.rate;
                params.variance = 1 / (params.rate * params.rate);
                
                if (demoState.simulationData[containerId]) {
                    demoState.simulationData[containerId].theoreticalMean = params.mean;
                    demoState.simulationData[containerId].theoreticalStdDev = Math.sqrt(params.variance);
                    
                    // If this is the CLT demo, update the std dev of sample means
                    if (demoState.activeDemos[containerId].type === 'centralLimitTheorem') {
                        demoState.simulationData[containerId].theoreticalStdDev = Math.sqrt(params.variance / params.sampleSize);
                    }
                }
                
                // Update parent chart if present
                if (demoState.activeDemos[containerId].charts.parent) {
                    updateParentDistributionChart(containerId, demoState.activeDemos[containerId].charts.parent, params);
                }
                
                // Update info panels
                if (demoState.activeDemos[containerId].type === 'centralLimitTheorem') {
                    updateCLTDemoInfo(containerId, params);
                } else if (demoState.activeDemos[containerId].type === 'lawOfLargeNumbers') {
                    updateLLNDemoInfo(containerId, params);
                }
            });
            break;
            
        case 'normal':
            // Add sliders for mean and stdDev
            const meanSlider = createSlider(`${containerId}-mean-slider`, 'Mean (μ)', params.mean, -5, 5, 0.1);
            const stdDevSlider = createSlider(`${containerId}-stddev-slider`, 'Standard Deviation (σ)', params.stdDev, 0.1, 5, 0.1);
            
            container.appendChild(meanSlider);
            container.appendChild(stdDevSlider);
            
            // Add event listeners
            document.getElementById(`${containerId}-mean-slider`).addEventListener('input', function(e) {
                params.mean = parseFloat(e.target.value);
                
                if (demoState.simulationData[containerId]) {
                    demoState.simulationData[containerId].theoreticalMean = params.mean;
                }
                
                // Update parent chart if present
                if (demoState.activeDemos[containerId].charts.parent) {
                    updateParentDistributionChart(containerId, demoState.activeDemos[containerId].charts.parent, params);
                }
                
                // Update info panels
                if (demoState.activeDemos[containerId].type === 'centralLimitTheorem') {
                    updateCLTDemoInfo(containerId, params);
                } else if (demoState.activeDemos[containerId].type === 'lawOfLargeNumbers') {
                    updateLLNDemoInfo(containerId, params);
                }
            });
            
            document.getElementById(`${containerId}-stddev-slider`).addEventListener('input', function(e) {
                params.stdDev = parseFloat(e.target.value);
                
                // Update theoretical values
                params.variance = params.stdDev * params.stdDev;
                
                if (demoState.simulationData[containerId]) {
                    demoState.simulationData[containerId].theoreticalStdDev = Math.sqrt(params.variance);
                    
                    // If this is the CLT demo, update the std dev of sample means
                    if (demoState.activeDemos[containerId].type === 'centralLimitTheorem') {
                        demoState.simulationData[containerId].theoreticalStdDev = Math.sqrt(params.variance / params.sampleSize);
                    }
                }
                
                // Update parent chart if present
                if (demoState.activeDemos[containerId].charts.parent) {
                    updateParentDistributionChart(containerId, demoState.activeDemos[containerId].charts.parent, params);
                }
                
                // Update info panels
                if (demoState.activeDemos[containerId].type === 'centralLimitTheorem') {
                    updateCLTDemoInfo(containerId, params);
                } else if (demoState.activeDemos[containerId].type === 'lawOfLargeNumbers') {
                    updateLLNDemoInfo(containerId, params);
                }
            });
            break;
            
        case 'bernoulli':
            // Add slider for p
            const pSlider = createSlider(`${containerId}-p-slider`, 'Success Probability (p)', params.p, 0, 1, 0.01);
            container.appendChild(pSlider);
            
            // Add event listener
            document.getElementById(`${containerId}-p-slider`).addEventListener('input', function(e) {
                params.p = parseFloat(e.target.value);
                
                // Update theoretical values
                params.mean = params.p;
                params.variance = params.p * (1 - params.p);
                
                if (demoState.simulationData[containerId]) {
                    demoState.simulationData[containerId].theoreticalMean = params.mean;
                    demoState.simulationData[containerId].theoreticalStdDev = Math.sqrt(params.variance);
                    
                    // If this is the CLT demo, update the std dev of sample means
                    if (demoState.activeDemos[containerId].type === 'centralLimitTheorem') {
                        demoState.simulationData[containerId].theoreticalStdDev = Math.sqrt(params.variance / params.sampleSize);
                    }
                }
                
                // Update parent chart if present
                if (demoState.activeDemos[containerId].charts.parent) {
                    updateParentDistributionChart(containerId, demoState.activeDemos[containerId].charts.parent, params);
                }
                
                // Update info panels
                if (demoState.activeDemos[containerId].type === 'centralLimitTheorem') {
                    updateCLTDemoInfo(containerId, params);
                }
            });
            break;
    }
}

/**
 * =============================================
 * HELPER FUNCTIONS - CHART CREATION
 * =============================================
 */

/**
 * Creates a normal PDF chart
 * @param {string} canvasId - Canvas element ID
 * @param {Object} params - Chart parameters
 * @returns {Object} - Chart.js instance
 */
function createNormalPDFChart(canvasId, params) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // Generate data for the PDF
    const data = generateNormalPDFData(params.mean, params.stdDev, params.lowerBound, params.upperBound);
    
    // Create the chart
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.x,
            datasets: [
                {
                    label: 'Normal PDF',
                    data: data.y,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.1)',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: true
                },
                {
                    label: 'Area',
                    data: data.area,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.4)',
                    borderWidth: 0,
                    pointRadius: 0,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
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
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            return `x = ${parseFloat(tooltipItems[0].label).toFixed(2)}`;
                        },
                        label: function(context) {
                            if (context.datasetIndex === 0) {
                                return `f(x) = ${context.raw.toFixed(4)}`;
                            }
                            return '';
                        }
                    }
                },
                legend: {
                    display: false
                }
            }
        }
    });
    
    return chart;
}

/**
 * Creates a normal CDF chart
 * @param {string} canvasId - Canvas element ID
 * @param {Object} params - Chart parameters
 * @returns {Object} - Chart.js instance
 */
function createNormalCDFChart(canvasId, params) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // Generate data for the CDF
    const data = generateNormalCDFData(params.mean, params.stdDev, params.lowerBound, params.upperBound);
    
    // Create the chart
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.x,
            datasets: [
                {
                    label: 'Normal CDF',
                    data: data.y,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'transparent',
                    borderWidth: 2,
                    pointRadius: 0
                },
                {
                    label: 'Area',
                    data: data.area,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.4)',
                    borderWidth: 0,
                    pointRadius: 0,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
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
                        text: 'F(x)',
                        color: '#fff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#fff'
                    },
                    min: 0,
                    max: 1
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            return `x = ${parseFloat(tooltipItems[0].label).toFixed(2)}`;
                        },
                        label: function(context) {
                            if (context.datasetIndex === 0) {
                                return `F(x) = ${context.raw.toFixed(4)}`;
                            }
                            return '';
                        }
                    }
                },
                legend: {
                    display: false
                }
            }
        }
    });
    
    return chart;
}

/**
 * Creates a binomial PMF chart
 * @param {string} canvasId - Canvas element ID
 * @param {Object} params - Chart parameters
 * @returns {Object} - Chart.js instance
 */
function createBinomialPMFChart(canvasId, params) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // Generate data for the PMF
    const data = generateBinomialPMFData(params.n, params.p, params.k);
    
    // Create the chart
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.x,
            datasets: [
                {
                    label: 'Binomial PMF',
                    data: data.y,
                    backgroundColor: data.colors,
                    borderColor: data.borderColors,
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
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
                        text: 'P(X = k)',
                        color: '#fff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#fff'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            return `k = ${parseInt(tooltipItems[0].label)}`;
                        },
                        label: function(context) {
                            return `P(X = ${context.label}) = ${context.raw.toFixed(4)}`;
                        }
                    }
                },
                legend: {
                    display: false
                }
            }
        }
    });
    
    return chart;
}

/**
 * Creates a binomial CDF chart
 * @param {string} canvasId - Canvas element ID
 * @param {Object} params - Chart parameters
 * @returns {Object} - Chart.js instance
 */
function createBinomialCDFChart(canvasId, params) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // Generate data for the CDF
    const data = generateBinomialCDFData(params.n, params.p, params.k);
    
    // Create the chart
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.x,
            datasets: [
                {
                    label: 'Binomial CDF',
                    data: data.y,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    pointRadius: 4,
                    pointBackgroundColor: function(context) {
                        return context.dataIndex <= params.k ? 'rgba(255, 99, 132, 1)' : 'rgba(75, 192, 192, 1)';
                    },
                    pointBorderColor: '#fff',
                    pointBorderWidth: 1,
                    pointHoverRadius: 6,
                    stepped: 'after'
                }
            ]
        },
        options: {
            responsive: true,
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
                        text: 'P(X ≤ k)',
                        color: '#fff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#fff'
                    },
                    min: 0,
                    max: 1
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            return `k = ${parseInt(tooltipItems[0].label)}`;
                        },
                        label: function(context) {
                            return `P(X ≤ ${context.label}) = ${context.raw.toFixed(4)}`;
                        }
                    }
                },
                legend: {
                    display: false
                }
            }
        }
    });
    
    return chart;
}

/**
 * Creates a binomial simulation chart
 * @param {string} canvasId - Canvas element ID
 * @param {Object} params - Chart parameters
 * @returns {Object} - Chart.js instance
 */
function createBinomialSimulationChart(canvasId, params) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // Create the chart with initial empty data
    const chart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Simulation Results',
                    data: [],
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    pointRadius: 8,
                    pointHoverRadius: 10
                },
                {
                    label: 'Theoretical Mean',
                    data: [],
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    fill: false,
                    type: 'line'
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Trial Number',
                        color: '#fff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#fff'
                    },
                    min: 0
                },
                y: {
                    title: {
                        display: true,
                        text: 'Number of Successes',
                        color: '#fff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#fff'
                    },
                    min: 0,
                    max: params.n
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Trial ${context.raw.x}: ${context.raw.y} successes`;
                        }
                    }
                },
                legend: {
                    display: true,
                    labels: {
                        color: '#fff'
                    }
                }
            }
        }
    });
    
    return chart;
}

/**
 * Creates a parent distribution chart for CLT demo
 * @param {string} canvasId - Canvas element ID
 * @param {Object} params - Chart parameters
 * @returns {Object} - Chart.js instance
 */
function createParentDistributionChart(canvasId, params) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // Generate data based on distribution type
    let data;
    let chartType = 'line';
    
    switch (params.distribution) {
        case 'uniform':
            data = generateUniformPDFData(params.a, params.b);
            break;
        case 'exponential':
            data = generateExponentialPDFData(params.rate);
            break;
        case 'normal':
            data = generateNormalPDFData(params.mean, params.stdDev);
            break;
        case 'bernoulli':
            data = generateBernoulliPMFData(params.p);
            chartType = 'bar';
            break;
        default:
            data = generateUniformPDFData(0, 1);
    }
    
    // Create the chart
    const chart = new Chart(ctx, {
        type: chartType,
        data: {
            labels: data.x,
            datasets: [
                {
                    label: 'Probability Distribution',
                    data: data.y,
                    backgroundColor: chartType === 'bar' ? 'rgba(54, 162, 235, 0.7)' : 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: true
                },
                {
                    label: 'Mean',
                    data: [],  // Will be set in annotation
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
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
                        text: chartType === 'bar' ? 'P(X = x)' : 'f(x)',
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
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            return `x = ${parseFloat(tooltipItems[0].label).toFixed(2)}`;
                        },
                        label: function(context) {
                            if (chartType === 'bar') {
                                return `P(X = ${context.label}) = ${context.raw.toFixed(4)}`;
                            } else {
                                return `f(x) = ${context.raw.toFixed(4)}`;
                            }
                        }
                    }
                },
                legend: {
                    display: false
                },
                annotation: {
                    annotations: {
                        meanLine: {
                            type: 'line',
                            xMin: params.mean,
                            xMax: params.mean,
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 2,
                            borderDash: [5, 5],
                            label: {
                                display: true,
                                content: `μ = ${params.mean.toFixed(2)}`,
                                position: 'top',
                                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                color: '#fff',
                                font: {
                                    size: 12
                                }
                            }
                        }
                    }
                }
            }
        }
    });
    
    return chart;
}

/**
 * Creates a sample means chart for CLT demo
 * @param {string} canvasId - Canvas element ID
 * @param {Object} params - Chart parameters
 * @returns {Object} - Chart.js instance
 */
function createSampleMeansChart(canvasId, params) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // Create the chart with initial empty data
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Sample Means Distribution',
                    data: [],
                    backgroundColor: 'rgba(75, 192, 192, 0.7)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                },
                {
                    label: 'Normal Approximation',
                    data: [],
                    type: 'line',
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Sample Mean',
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
                        text: 'Frequency',
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
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            return `Mean = ${parseFloat(tooltipItems[0].label).toFixed(4)}`;
                        },
                        label: function(context) {
                            if (context.datasetIndex === 0) {
                                return `Frequency: ${context.raw}`;
                            } else if (context.datasetIndex === 1) {
                                return `Normal Approximation: ${context.raw.toFixed(4)}`;
                            }
                        }
                    }
                },
                legend: {
                    display: true,
                    labels: {
                        color: '#fff'
                    }
                }
            }
        }
    });
    
    return chart;
}

/**
 * Creates a samples chart for LLN demo
 * @param {string} canvasId - Canvas element ID
 * @param {Object} params - Chart parameters
 * @returns {Object} - Chart.js instance
 */
function createSamplesChart(canvasId, params) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // Create the chart with initial empty data
    const chart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Sample Values',
                    data: [],
                    backgroundColor: 'rgba(54, 162, 235, 0.7)',
                    pointRadius: 3
                },
                {
                    label: 'Theoretical Mean',
                    data: [],
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0,
                    fill: false,
                    type: 'line'
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Sample Number',
                        color: '#fff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#fff'
                    },
                    min: 0
                },
                y: {
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
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `Sample ${context.raw.x}: ${context.raw.y.toFixed(4)}`;
                        }
                    }
                },
                legend: {
                    display: true,
                    labels: {
                        color: '#fff'
                    }
                }
            }
        }
    });
    
    return chart;
}

/**
 * Creates a running average chart for LLN demo
 * @param {string} canvasId - Canvas element ID
 * @param {Object} params - Chart parameters
 * @returns {Object} - Chart.js instance
 */
function createRunningAverageChart(canvasId, params) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // Create the chart with initial empty data
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Running Average',
                    data: [],
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: true
                },
                {
                    label: 'Theoretical Mean',
                    data: [],
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    borderDash: [5, 5],
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Number of Samples',
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
                        text: 'Average Value',
                        color: '#fff'
                    },
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#fff'
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            return `Samples: ${parseInt(tooltipItems[0].label)}`;
                        },
                        label: function(context) {
                            if (context.datasetIndex === 0) {
                                return `Average: ${context.raw.toFixed(4)}`;
                            } else {
                                return `Theoretical Mean: ${context.raw.toFixed(4)}`;
                            }
                        }
                    }
                },
                legend: {
                    display: true,
                    labels: {
                        color: '#fff'
                    }
                }
            }
        }
    });
    
    return chart;
}

/**
 * =============================================
 * HELPER FUNCTIONS - DATA GENERATION
 * =============================================
 */

/**
 * Generates data for normal PDF
 * @param {number} mean - Mean
 * @param {number} stdDev - Standard deviation
 * @param {number} lowerBound - Lower bound for highlighted area
 * @param {number} upperBound - Upper bound for highlighted area
 * @returns {Object} - Data for chart
 */
function generateNormalPDFData(mean, stdDev, lowerBound, upperBound) {
    // Generate x values (± 4 standard deviations from mean)
    const min = mean - 4 * stdDev;
    const max = mean + 4 * stdDev;
    const step = (max - min) / 100;
    
    const x = [];
    const y = [];
    const area = [];
    
    for (let i = 0; i <= 100; i++) {
        const xValue = min + i * step;
        const yValue = normalPDF(xValue, mean, stdDev);
        
        x.push(xValue);
        y.push(yValue);
        
        // For the highlighted area
        if (lowerBound !== undefined && upperBound !== undefined) {
            if (xValue >= lowerBound && xValue <= upperBound) {
                area.push(yValue);
            } else {
                area.push(0);
            }
        } else {
            area.push(0);
        }
    }
    
    return { x, y, area };
}

/**
 * Generates data for normal CDF
 * @param {number} mean - Mean
 * @param {number} stdDev - Standard deviation
 * @param {number} lowerBound - Lower bound for highlighted area
 * @param {number} upperBound - Upper bound for highlighted area
 * @returns {Object} - Data for chart
 */
function generateNormalCDFData(mean, stdDev, lowerBound, upperBound) {
    // Generate x values (± 4 standard deviations from mean)
    const min = mean - 4 * stdDev;
    const max = mean + 4 * stdDev;
    const step = (max - min) / 100;
    
    const x = [];
    const y = [];
    const area = [];
    
    for (let i = 0; i <= 100; i++) {
        const xValue = min + i * step;
        const yValue = normalCDF(xValue, mean, stdDev);
        
        x.push(xValue);
        y.push(yValue);
        
        // For the highlighted area
        if (lowerBound !== undefined && upperBound !== undefined) {
            if (xValue >= lowerBound && xValue <= upperBound) {
                area.push(yValue);
            } else {
                area.push(0);
            }
        } else {
            area.push(0);
        }
    }
    
    return { x, y, area };
}

/**
 * Generates data for binomial PMF
 * @param {number} n - Number of trials
 * @param {number} p - Success probability
 * @param {number} k - Selected number of successes
 * @returns {Object} - Data for chart
 */
function generateBinomialPMFData(n, p, k) {
    const x = [];
    const y = [];
    const colors = [];
    const borderColors = [];
    
    for (let i = 0; i <= n; i++) {
        x.push(i);
        y.push(binomialPMF(i, n, p));
        
        // Highlight the selected k value
        if (i === k) {
            colors.push('rgba(255, 99, 132, 0.7)');
            borderColors.push('rgba(255, 99, 132, 1)');
        } else {
            colors.push('rgba(54, 162, 235, 0.7)');
            borderColors.push('rgba(54, 162, 235, 1)');
        }
    }
    
    return { x, y, colors, borderColors };
}

/**
 * Generates data for binomial CDF
 * @param {number} n - Number of trials
 * @param {number} p - Success probability
 * @param {number} k - Selected number of successes
 * @returns {Object} - Data for chart
 */
function generateBinomialCDFData(n, p, k) {
    const x = [];
    const y = [];
    
    let cumulativeProbability = 0;
    
    for (let i = 0; i <= n; i++) {
        x.push(i);
        cumulativeProbability += binomialPMF(i, n, p);
        y.push(cumulativeProbability);
    }
    
    return { x, y };
}

/**
 * Generates data for uniform PDF
 * @param {number} a - Lower bound
 * @param {number} b - Upper bound
 * @returns {Object} - Data for chart
 */
function generateUniformPDFData(a, b) {
    // Generate x values (extending slightly beyond bounds)
    const min = a - 0.2 * (b - a);
    const max = b + 0.2 * (b - a);
    const step = (max - min) / 100;
    
    const x = [];
    const y = [];
    
    for (let i = 0; i <= 100; i++) {
        const xValue = min + i * step;
        const yValue = (xValue >= a && xValue <= b) ? 1 / (b - a) : 0;
        
        x.push(xValue);
        y.push(yValue);
    }
    
    return { x, y };
}

/**
 * Generates data for exponential PDF
 * @param {number} rate - Rate parameter
 * @returns {Object} - Data for chart
 */
function generateExponentialPDFData(rate) {
    // Generate x values (0 to 5/rate)
    const max = 5 / rate;
    const step = max / 100;
    
    const x = [];
    const y = [];
    
    for (let i = 0; i <= 100; i++) {
        const xValue = i * step;
        const yValue = exponentialPDF(xValue, rate);
        
        x.push(xValue);
        y.push(yValue);
    }
    
    return { x, y };
}

/**
 * Generates data for Bernoulli PMF
 * @param {number} p - Success probability
 * @returns {Object} - Data for chart
 */
function generateBernoulliPMFData(p) {
    const x = [0, 1];
    const y = [1 - p, p];
    
    return { x, y };
}

/**
 * =============================================
 * HELPER FUNCTIONS - PROBABILITY CALCULATIONS
 * =============================================
 */

/**
 * Calculates the normal PDF at a point
 * @param {number} x - Input value
 * @param {number} mean - Mean
 * @param {number} stdDev - Standard deviation
 * @returns {number} - PDF value
 */
function normalPDF(x, mean, stdDev) {
    const variance = stdDev * stdDev;
    return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * 
           Math.exp(-0.5 * Math.pow((x - mean) / stdDev, 2));
}

/**
 * Calculates the normal CDF at a point
 * @param {number} x - Input value
 * @param {number} mean - Mean
 * @param {number} stdDev - Standard deviation
 * @returns {number} - CDF value
 */
function normalCDF(x, mean, stdDev) {
    const z = (x - mean) / stdDev;
    return 0.5 * (1 + errorFunction(z / Math.sqrt(2)));
}

/**
 * Error function approximation
 * @param {number} x - Input value
 * @returns {number} - Error function value
 */
function errorFunction(x) {
    // Approximation from Abramowitz and Stegun
    const sign = x >= 0 ? 1 : -1;
    const t = 1 / (1 + 0.3275911 * Math.abs(x));
    const y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
    return sign * y;
}

/**
 * Calculates the binomial PMF at a point
 * @param {number} k - Number of successes
 * @param {number} n - Number of trials
 * @param {number} p - Success probability
 * @returns {number} - PMF value
 */
function binomialPMF(k, n, p) {
    if (k < 0 || k > n) {
        return 0;
    }
    
    // Calculate binomial coefficient * p^k * (1-p)^(n-k)
    return binomialCoefficient(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

/**
 * Calculates the binomial coefficient (n choose k)
 * @param {number} n - Number of items
 * @param {number} k - Number to choose
 * @returns {number} - Binomial coefficient
 */
function binomialCoefficient(n, k) {
    if (k < 0 || k > n) {
        return 0;
    }
    
    if (k === 0 || k === n) {
        return 1;
    }
    
    // Optimize calculation by using symmetry
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
 * Calculates the exponential PDF at a point
 * @param {number} x - Input value
 * @param {number} rate - Rate parameter
 * @returns {number} - PDF value
 */
function exponentialPDF(x, rate) {
    if (x < 0) {
        return 0;
    }
    
    return rate * Math.exp(-rate * x);
}

/**
 * =============================================
 * HELPER FUNCTIONS - DEMO UPDATES
 * =============================================
 */

/**
 * Updates normal distribution demo
 * @param {string} containerId - Container ID
 * @param {Object} params - Parameters
 * @param {Object} pdfChart - PDF chart
 * @param {Object} cdfChart - CDF chart
 */
function updateNormalDistributionDemo(containerId, params, pdfChart, cdfChart) {
    // Update charts
    updateNormalPDFChart(pdfChart, params);
    updateNormalCDFChart(cdfChart, params);
    
    // Update info panel
    updateNormalDistributionInfo(containerId, params);
}

/**
 * Updates normal PDF chart
 * @param {Object} chart - Chart.js instance
 * @param {Object} params - Parameters
 */
function updateNormalPDFChart(chart, params) {
    // Generate new data
    const data = generateNormalPDFData(params.mean, params.stdDev, params.lowerBound, params.upperBound);
    
    // Update chart data
    chart.data.labels = data.x;
    chart.data.datasets[0].data = data.y;
    chart.data.datasets[1].data = data.area;
    
    // Update chart title
    chart.options.plugins.title = {
        display: true,
        text: `Normal Distribution (μ = ${params.mean.toFixed(2)}, σ = ${params.stdDev.toFixed(2)})`,
        color: '#fff'
    };
    
    chart.update();
}

/**
 * Updates normal CDF chart
 * @param {Object} chart - Chart.js instance
 * @param {Object} params - Parameters
 */
function updateNormalCDFChart(chart, params) {
    // Generate new data
    const data = generateNormalCDFData(params.mean, params.stdDev, params.lowerBound, params.upperBound);
    
    // Update chart data
    chart.data.labels = data.x;
    chart.data.datasets[0].data = data.y;
    chart.data.datasets[1].data = data.area;
    
    // Update chart
    chart.update();
}

/**
 * Updates normal distribution info panel
 * @param {string} containerId - Container ID
 * @param {Object} params - Parameters
 */
function updateNormalDistributionInfo(containerId, params) {
    // Update properties section
    const propertiesElement = document.getElementById(`${containerId}-properties`);
    propertiesElement.innerHTML = `
        <table class="table table-sm table-dark">
            <tr>
                <td>Mean (μ)</td>
                <td>${params.mean.toFixed(4)}</td>
            </tr>
            <tr>
                <td>Standard Deviation (σ)</td>
                <td>${params.stdDev.toFixed(4)}</td>
            </tr>
            <tr>
                <td>Variance (σ²)</td>
                <td>${(params.stdDev * params.stdDev).toFixed(4)}</td>
            </tr>
            <tr>
                <td>Skewness</td>
                <td>0</td>
            </tr>
            <tr>
                <td>Kurtosis</td>
                <td>3</td>
            </tr>
        </table>
    `;
    
    // Update probability section if applicable
    if (params.showProbability) {
        const probabilityElement = document.getElementById(`${containerId}-probability`);
        
        // Calculate probability P(lowerBound ≤ X ≤ upperBound)
        const lowerCDF = normalCDF(params.lowerBound, params.mean, params.stdDev);
        const upperCDF = normalCDF(params.upperBound, params.mean, params.stdDev);
        const probability = upperCDF - lowerCDF;
        
        probabilityElement.innerHTML = `
            <p>P(${params.lowerBound.toFixed(2)} ≤ X ≤ ${params.upperBound.toFixed(2)}) = ${probability.toFixed(6)}</p>
            <p>This represents the area under the normal curve between ${params.lowerBound.toFixed(2)} and ${params.upperBound.toFixed(2)}.</p>
            <p class="mb-0">Expressed in terms of standard normal (Z) values:</p>
            <p>P(${((params.lowerBound - params.mean) / params.stdDev).toFixed(2)} ≤ Z ≤ ${((params.upperBound - params.mean) / params.stdDev).toFixed(2)}) = ${probability.toFixed(6)}</p>
        `;
    }
    
    // Update notes section
    const notesElement = document.getElementById(`${containerId}-notes`);
    notesElement.innerHTML = `
        <p>The normal distribution is symmetric around its mean. About 68% of values lie within one standard deviation of the mean, 95% within two standard deviations, and 99.7% within three standard deviations (the "empirical rule").</p>
        <p>The standard normal distribution has μ = 0 and σ = 1. Any normal random variable X can be transformed to a standard normal Z using Z = (X - μ) / σ.</p>
    `;
}

/**
 * Updates binomial distribution demo
 * @param {string} containerId - Container ID
 * @param {Object} params - Parameters
 * @param {Object} pmfChart - PMF chart
 * @param {Object} cdfChart - CDF chart
 * @param {Object} simChart - Simulation chart
 */
function updateBinomialDistributionDemo(containerId, params, pmfChart, cdfChart, simChart) {
    // Update charts
    updateBinomialPMFChart(pmfChart, params);
    updateBinomialCDFChart(cdfChart, params);
    
    // Update simulation chart if available
    if (simChart && params.animateTrials) {
        updateBinomialSimulationChart(simChart, params);
    }
    
    // Update info panel
    updateBinomialDistributionInfo(containerId, params);
}

/**
 * Updates binomial PMF chart
 * @param {Object} chart - Chart.js instance
 * @param {Object} params - Parameters
 */
function updateBinomialPMFChart(chart, params) {
    // Generate new data
    const data = generateBinomialPMFData(params.n, params.p, params.k);
    
    // Update chart data
    chart.data.labels = data.x;
    chart.data.datasets[0].data = data.y;
    chart.data.datasets[0].backgroundColor = data.colors;
    chart.data.datasets[0].borderColor = data.borderColors;
    
    // Update chart title
    chart.options.plugins.title = {
        display: true,
        text: `Binomial PMF (n = ${params.n}, p = ${params.p})`,
        color: '#fff'
    };
    
    chart.update();
}

/**
 * Updates binomial CDF chart
 * @param {Object} chart - Chart.js instance
 * @param {Object} params - Parameters
 */
function updateBinomialCDFChart(chart, params) {
    // Generate new data
    const data = generateBinomialCDFData(params.n, params.p, params.k);
    
    // Update chart data
    chart.data.labels = data.x;
    chart.data.datasets[0].data = data.y;
    
    // Update point colors to highlight selected k
    chart.data.datasets[0].pointBackgroundColor = function(context) {
        return context.dataIndex <= params.k ? 'rgba(255, 99, 132, 1)' : 'rgba(75, 192, 192, 1)';
    };
    
    // Update chart
    chart.update();
}

/**
 * Updates binomial simulation chart
 * @param {Object} chart - Chart.js instance
 * @param {Object} params - Parameters
 */
function updateBinomialSimulationChart(chart, params) {
    // Update theoretical mean line
    const theoreticalMean = params.n * params.p;
    
    // Reset simulation data
    chart.data.datasets[0].data = [];
    
    // Update theoretical mean line
    chart.data.datasets[1].data = [
        { x: 0, y: theoreticalMean },
        { x: 100, y: theoreticalMean }
    ];
    
    // Update y-axis max
    chart.options.scales.y.max = params.n;
    
    // Update chart
    chart.update();
}

/**
 * Updates binomial distribution info panel
 * @param {string} containerId - Container ID
 * @param {Object} params - Parameters
 */
function updateBinomialDistributionInfo(containerId, params) {
    // Calculate key statistics
    const mean = params.n * params.p;
    const variance = params.n * params.p * (1 - params.p);
    const stdDev = Math.sqrt(variance);
    const skewness = (1 - 2 * params.p) / stdDev;
    
    // Calculate probabilities
    const pmf = binomialPMF(params.k, params.n, params.p);
    let cdf = 0;
    for (let i = 0; i <= params.k; i++) {
        cdf += binomialPMF(i, params.n, params.p);
    }
    
    // Update properties section
    const propertiesElement = document.getElementById(`${containerId}-properties`);
    propertiesElement.innerHTML = `
        <table class="table table-sm table-dark">
            <tr>
                <td>Mean</td>
                <td>${mean.toFixed(4)}</td>
            </tr>
            <tr>
                <td>Variance</td>
                <td>${variance.toFixed(4)}</td>
            </tr>
            <tr>
                <td>Standard Deviation</td>
                <td>${stdDev.toFixed(4)}</td>
            </tr>
            <tr>
                <td>Skewness</td>
                <td>${skewness.toFixed(4)}</td>
            </tr>
            <tr>
                <td>Mode</td>
                <td>${Math.floor((params.n + 1) * params.p)}</td>
            </tr>
        </table>
    `;
    
    // Update probability section
    const probabilityElement = document.getElementById(`${containerId}-probability`);
    probabilityElement.innerHTML = `
        <p>P(X = ${params.k}) = ${pmf.toFixed(6)} ≈ ${(pmf * 100).toFixed(2)}%</p>
        <p>This is the probability of getting exactly ${params.k} successes in ${params.n} trials.</p>
        <p class="formula">P(X = k) = \\binom{n}{k} p^k (1-p)^{n-k}</p>
        <p class="formula">= \\binom{${params.n}}{${params.k}} ${params.p}^{${params.k}} (1-${params.p})^{${params.n}-${params.k}}</p>
    `;
    
    // Update cumulative probability section
    const cumulativeElement = document.getElementById(`${containerId}-cumulative`);
    cumulativeElement.innerHTML = `
        <p>P(X ≤ ${params.k}) = ${cdf.toFixed(6)} ≈ ${(cdf * 100).toFixed(2)}%</p>
        <p>This is the probability of getting at most ${params.k} successes in ${params.n} trials.</p>
        <p>P(X > ${params.k}) = ${(1 - cdf).toFixed(6)} ≈ ${((1 - cdf) * 100).toFixed(2)}%</p>
    `;
    
    // Update notes section
    const notesElement = document.getElementById(`${containerId}-notes`);
    notesElement.innerHTML = `
        <p>The binomial distribution models the number of successes in a fixed number of independent trials, each with the same probability of success.</p>
        <p>As n increases, the binomial distribution approaches a normal distribution with μ = np and σ² = np(1-p).</p>
        <p>For p = 0.5, the distribution is symmetric. For p < 0.5, it is skewed to the right, and for p > 0.5, it is skewed to the left.</p>
    `;
    
    // Typeset LaTeX formulas if MathJax is available
    if (typeof MathJax !== 'undefined') {
        MathJax.typesetPromise([probabilityElement]).catch(function (err) {
            console.log('MathJax error:', err);
        });
    }
}

/**
 * Runs a binomial simulation
 * @param {string} containerId - Container ID
 * @param {Object} params - Parameters
 * @param {Object} pmfChart - PMF chart
 * @param {Object} simChart - Simulation chart
 */
function runBinomialSimulation(containerId, params, pmfChart, simChart) {
    if (!simChart) return;
    
    // Reset simulation data
    simChart.data.datasets[0].data = [];
    
    // Update theoretical mean line
    const theoreticalMean = params.n * params.p;
    simChart.data.datasets[1].data = [
        { x: 0, y: theoreticalMean },
        { x: 100, y: theoreticalMean }
    ];
    
    // Run 100 simulations
    const numSimulations = 100;
    
    // Define function to run single trial
    function runTrial(trialNum) {
        // Simulate n Bernoulli trials
        let successes = 0;
        for (let i = 0; i < params.n; i++) {
            if (Math.random() < params.p) {
                successes++;
            }
        }
        
        // Add data point
        simChart.data.datasets[0].data.push({
            x: trialNum,
            y: successes
        });
        
        // Update chart
        simChart.update();
    }
    
    // Stop any existing simulation
    if (demoState.simulationIntervals[containerId]) {
        clearInterval(demoState.simulationIntervals[containerId]);
    }
    
    // Run trials with animation
    let trialNum = 0;
    demoState.simulationIntervals[containerId] = setInterval(function() {
        runTrial(trialNum);
        trialNum++;
        
        if (trialNum >= numSimulations) {
            clearInterval(demoState.simulationIntervals[containerId]);
            delete demoState.simulationIntervals[containerId];
        }
    }, 50);
}

/**
 * Updates parent distribution chart for CLT demo
 * @param {string} containerId - Container ID
 * @param {Object} chart - Chart.js instance
 * @param {Object} params - Parameters
 */
function updateParentDistributionChart(containerId, chart, params) {
    // Generate data based on distribution type
    let data;
    let chartType = 'line';
    
    switch (params.distribution) {
        case 'uniform':
            data = generateUniformPDFData(params.a, params.b);
            break;
        case 'exponential':
            data = generateExponentialPDFData(params.rate);
            break;
        case 'normal':
            data = generateNormalPDFData(params.mean, params.stdDev);
            break;
        case 'bernoulli':
            data = generateBernoulliPMFData(params.p);
            chartType = 'bar';
            break;
        default:
            data = generateUniformPDFData(0, 1);
    }
    
    // Update chart type if needed
    if (chart.config.type !== chartType) {
        chart.destroy();
        chart = createParentDistributionChart(`${containerId}-parent-canvas`, params);
        demoState.activeDemos[containerId].charts.parent = chart;
        return;
    }
    
    // Update chart data
    chart.data.labels = data.x;
    chart.data.datasets[0].data = data.y;
    
    // Update mean line annotation
    chart.options.plugins.annotation.annotations.meanLine.xMin = params.mean;
    chart.options.plugins.annotation.annotations.meanLine.xMax = params.mean;
    chart.options.plugins.annotation.annotations.meanLine.label.content = `μ = ${params.mean.toFixed(2)}`;
    
    // Update chart
    chart.update();
}

/**
 * Updates CLT demo info
 * @param {string} containerId - Container ID
 * @param {Object} params - Parameters
 */
function updateCLTDemoInfo(containerId, params) {
    // Update parent distribution properties
    const parentPropertiesElement = document.getElementById(`${containerId}-parent-properties`);
    
    let parentProperties = `
        <table class="table table-sm table-dark">
            <tr>
                <td>Distribution</td>
                <td>${params.distribution.charAt(0).toUpperCase() + params.distribution.slice(1)}</td>
            </tr>
            <tr>
                <td>Mean</td>
                <td>${params.mean.toFixed(4)}</td>
            </tr>
            <tr>
                <td>Variance</td>
                <td>${params.variance.toFixed(4)}</td>
            </tr>
            <tr>
                <td>Standard Deviation</td>
                <td>${Math.sqrt(params.variance).toFixed(4)}</td>
            </tr>
    `;
    
    // Add distribution-specific parameters
    switch (params.distribution) {
        case 'uniform':
            parentProperties += `
                <tr>
                    <td>Lower Bound (a)</td>
                    <td>${params.a.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>Upper Bound (b)</td>
                    <td>${params.b.toFixed(2)}</td>
                </tr>
            `;
            break;
        case 'exponential':
            parentProperties += `
                <tr>
                    <td>Rate (λ)</td>
                    <td>${params.rate.toFixed(2)}</td>
                </tr>
            `;
            break;
        case 'normal':
            parentProperties += `
                <tr>
                    <td>Standard Deviation (σ)</td>
                    <td>${params.stdDev.toFixed(2)}</td>
                </tr>
            `;
            break;
        case 'bernoulli':
            parentProperties += `
                <tr>
                    <td>Success Probability (p)</td>
                    <td>${params.p.toFixed(2)}</td>
                </tr>
            `;
            break;
    }
    
    parentProperties += `</table>`;
    parentPropertiesElement.innerHTML = parentProperties;
    
    // Update sample means properties
    const samplesPropertiesElement = document.getElementById(`${containerId}-samples-properties`);
    
    // Calculate theoretical properties of sample means
    const sampleMeanMean = params.mean;
    const sampleMeanVariance = params.variance / params.sampleSize;
    const sampleMeanStdDev = Math.sqrt(sampleMeanVariance);
    
    samplesPropertiesElement.innerHTML = `
        <table class="table table-sm table-dark">
            <tr>
                <td>Sample Size (n)</td>
                <td>${params.sampleSize}</td>
            </tr>
            <tr>
                <td>Number of Samples</td>
                <td>${demoState.simulationData[containerId]?.currentSamples || 0}</td>
            </tr>
            <tr>
                <td>Theoretical Mean</td>
                <td>${sampleMeanMean.toFixed(4)}</td>
            </tr>
            <tr>
                <td>Theoretical Variance</td>
                <td>${sampleMeanVariance.toFixed(4)}</td>
            </tr>
            <tr>
                <td>Theoretical Std. Dev.</td>
                <td>${sampleMeanStdDev.toFixed(4)}</td>
            </tr>
        </table>
        <p class="mt-2 mb-0">Sample Mean Distribution: ~ N(${sampleMeanMean.toFixed(2)}, ${sampleMeanVariance.toFixed(4)})</p>
    `;
    
    // Update the simulation data
    demoState.simulationData[containerId].theoreticalMean = sampleMeanMean;
    demoState.simulationData[containerId].theoreticalStdDev = sampleMeanStdDev;
}

/**
 * Resets CLT simulation
 * @param {string} containerId - Container ID
 * @param {Object} params - Parameters
 * @param {Object} parentChart - Parent distribution chart
 * @param {Object} samplesChart - Sample means chart
 */
function resetCLTSimulation(containerId, params, parentChart, samplesChart) {
    // Reset simulation data
    demoState.simulationData[containerId] = {
        sampleMeans: [],
        currentSamples: 0,
        theoreticalMean: params.mean,
        theoreticalStdDev: Math.sqrt(params.variance / params.sampleSize)
    };
    
    // Reset sample means chart
    samplesChart.data.labels = [];
    samplesChart.data.datasets[0].data = [];
    samplesChart.data.datasets[1].data = [];
    samplesChart.update();
    
    // Update info panel
    updateCLTDemoInfo(containerId, params);
}

/**
 * Generates a sample for CLT demo
 * @param {string} containerId - Container ID
 * @param {Object} params - Parameters
 * @param {Object} samplesChart - Sample means chart
 */
function generateCLTSample(containerId, params, samplesChart) {
    // Generate a sample of size params.sampleSize from the specified distribution
    const sample = [];
    
    for (let i = 0; i < params.sampleSize; i++) {
        let value;
        
        switch (params.distribution) {
            case 'uniform':
                value = params.a + Math.random() * (params.b - params.a);
                break;
            case 'exponential':
                value = -Math.log(Math.random()) / params.rate;
                break;
            case 'normal':
                // Box-Muller transform
                const u1 = Math.random();
                const u2 = Math.random();
                const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
                value = params.mean + params.stdDev * z;
                break;
            case 'bernoulli':
                value = Math.random() < params.p ? 1 : 0;
                break;
            default:
                value = Math.random();
        }
        
        sample.push(value);
    }
    
    // Calculate sample mean
    const sampleMean = sample.reduce((sum, val) => sum + val, 0) / params.sampleSize;
    
    // Add to sample means data
    demoState.simulationData[containerId].sampleMeans.push(sampleMean);
    demoState.simulationData[containerId].currentSamples++;
    
    // Update sample means chart
    updateSampleMeansChart(containerId, samplesChart, params);
    
    // Update info panel
    updateCLTDemoInfo(containerId, params);
}

/**
 * Updates sample means chart for CLT demo
 * @param {string} containerId - Container ID
 * @param {Object} chart - Chart.js instance
 * @param {Object} params - Parameters
 */
function updateSampleMeansChart(containerId, chart, params) {
    const sampleMeans = demoState.simulationData[containerId].sampleMeans;
    const numSamples = sampleMeans.length;
    
    if (numSamples === 0) {
        return;
    }
    
    // Calculate histogram data
    const min = Math.min(...sampleMeans);
    const max = Math.max(...sampleMeans);
    
    // Determine number of bins (Sturges' formula)
    const numBins = Math.max(5, Math.ceil(1 + 3.322 * Math.log10(numSamples)));
    
    // Ensure range is centered around theoretical mean
    const theoreticalMean = params.mean;
    const theoreticalStdDev = Math.sqrt(params.variance / params.sampleSize);
    
    const range = Math.max(max - min, 6 * theoreticalStdDev);
    const adjustedMin = theoreticalMean - range / 2;
    const adjustedMax = theoreticalMean + range / 2;
    
    const binWidth = (adjustedMax - adjustedMin) / numBins;
    
    // Create bins
    const bins = Array(numBins).fill(0);
    const binLabels = [];
    
    for (let i = 0; i < numBins; i++) {
        binLabels.push(adjustedMin + i * binWidth + binWidth / 2);
    }
    
    // Count samples in each bin
    sampleMeans.forEach(mean => {
        const binIndex = Math.min(numBins - 1, Math.max(0, Math.floor((mean - adjustedMin) / binWidth)));
        bins[binIndex]++;
    });
    
    // Calculate normal approximation
    const normalValues = [];
    for (let i = 0; i < numBins; i++) {
        const x = adjustedMin + i * binWidth + binWidth / 2;
        const normal = normalPDF(x, theoreticalMean, theoreticalStdDev) * numSamples * binWidth;
        normalValues.push(normal);
    }
    
    // Update chart data
    chart.data.labels = binLabels;
    chart.data.datasets[0].data = bins;
    chart.data.datasets[1].data = normalValues;
    
    // Update chart title
    chart.options.plugins.title = {
        display: true,
        text: `Sample Means Distribution (n = ${params.sampleSize}, samples = ${numSamples})`,
        color: '#fff'
    };
    
    // Update chart
    chart.update();
}

/**
 * Updates LLN demo info
 * @param {string} containerId - Container ID
 * @param {Object} params - Parameters
 */
function updateLLNDemoInfo(containerId, params) {
    // Update distribution properties
    const distributionElement = document.getElementById(`${containerId}-distribution-properties`);
    
    let properties = `
        <table class="table table-sm table-dark">
            <tr>
                <td>Distribution</td>
                <td>${params.distribution.charAt(0).toUpperCase() + params.distribution.slice(1)}</td>
            </tr>
            <tr>
                <td>Mean</td>
                <td>${params.mean.toFixed(4)}</td>
            </tr>
            <tr>
                <td>Variance</td>
                <td>${params.variance.toFixed(4)}</td>
            </tr>
            <tr>
                <td>Standard Deviation</td>
                <td>${Math.sqrt(params.variance).toFixed(4)}</td>
            </tr>
    `;
    
    // Add distribution-specific parameters
    switch (params.distribution) {
        case 'uniform':
            properties += `
                <tr>
                    <td>Lower Bound (a)</td>
                    <td>${params.a.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>Upper Bound (b)</td>
                    <td>${params.b.toFixed(2)}</td>
                </tr>
            `;
            break;
        case 'exponential':
            properties += `
                <tr>
                    <td>Rate (λ)</td>
                    <td>${params.rate.toFixed(2)}</td>
                </tr>
            `;
            break;
        case 'normal':
            properties += `
                <tr>
                    <td>Standard Deviation (σ)</td>
                    <td>${params.stdDev.toFixed(2)}</td>
                </tr>
            `;
            break;
    }
    
    properties += `</table>`;
    distributionElement.innerHTML = properties;
    
    // Update simulation statistics
    const statsElement = document.getElementById(`${containerId}-simulation-stats`);
    
    const simData = demoState.simulationData[containerId];
    const numSamples = simData?.samples?.length || 0;
    
    if (numSamples > 0) {
        const sampleMean = simData.runningAvg[numSamples - 1];
        const sampleValues = simData.samples;
        
        // Calculate sample variance
        let sampleVariance = 0;
        if (numSamples > 1) {
            sampleVariance = sampleValues.reduce((sum, val) => sum + Math.pow(val - sampleMean, 2), 0) / numSamples;
        }
        
        // Calculate error
        const error = Math.abs(sampleMean - params.mean);
        const relativeError = error / Math.abs(params.mean);
        
        statsElement.innerHTML = `
            <table class="table table-sm table-dark">
                <tr>
                    <td>Number of Samples</td>
                    <td>${numSamples}</td>
                </tr>
                <tr>
                    <td>Sample Mean</td>
                    <td>${sampleMean.toFixed(4)}</td>
                </tr>
                <tr>
                    <td>Theoretical Mean</td>
                    <td>${params.mean.toFixed(4)}</td>
                </tr>
                <tr>
                    <td>Sample Variance</td>
                    <td>${sampleVariance.toFixed(4)}</td>
                </tr>
                <tr>
                    <td>Absolute Error</td>
                    <td>${error.toFixed(6)}</td>
                </tr>
                <tr>
                    <td>Relative Error</td>
                    <td>${(relativeError * 100).toFixed(2)}%</td>
                </tr>
            </table>
        `;
    } else {
        statsElement.innerHTML = `
            <p>No samples generated yet. Click "Generate Sample" or "Start Animation" to begin.</p>
        `;
    }
}

/**
 * Resets LLN simulation
 * @param {string} containerId - Container ID
 * @param {Object} params - Parameters
 * @param {Object} samplesChart - Samples chart
 * @param {Object} avgChart - Running average chart
 */
function resetLLNSimulation(containerId, params, samplesChart, avgChart) {
    // Reset simulation data
    demoState.simulationData[containerId] = {
        samples: [],
        runningAvg: [],
        currentSamples: 0,
        theoreticalMean: params.mean,
        theoreticalStdDev: Math.sqrt(params.variance)
    };
    
    // Reset samples chart
    samplesChart.data.datasets[0].data = [];
    samplesChart.data.datasets[1].data = [
        { x: 0, y: params.mean },
        { x: params.maxSamples, y: params.mean }
    ];
    samplesChart.update();
    
    // Reset average chart
    avgChart.data.labels = [];
    avgChart.data.datasets[0].data = [];
    avgChart.data.datasets[1].data = [];
    avgChart.update();
    
    // Update info panel
    updateLLNDemoInfo(containerId, params);
}

/**
 * Generates a sample for LLN demo
 * @param {string} containerId - Container ID
 * @param {Object} params - Parameters
 * @param {Object} samplesChart - Samples chart
 * @param {Object} avgChart - Running average chart
 */
function generateLLNSample(containerId, params, samplesChart, avgChart) {
    // Check if we've reached max samples
    if (demoState.simulationData[containerId].samples.length >= params.maxSamples) {
        return;
    }
    
    // Generate a sample from the specified distribution
    let value;
    
    switch (params.distribution) {
        case 'uniform':
            value = params.a + Math.random() * (params.b - params.a);
            break;
        case 'exponential':
            value = -Math.log(Math.random()) / params.rate;
            break;
        case 'normal':
            // Box-Muller transform
            const u1 = Math.random();
            const u2 = Math.random();
            const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
            value = params.mean + params.stdDev * z;
            break;
        default:
            value = Math.random();
    }
    
    // Add to samples data
    const samples = demoState.simulationData[containerId].samples;
    samples.push(value);
    
    // Calculate running average
    const sum = samples.reduce((acc, val) => acc + val, 0);
    const runningAvg = sum / samples.length;
    demoState.simulationData[containerId].runningAvg.push(runningAvg);
    
    // Update charts
    updateLLNCharts(containerId, samplesChart, avgChart, params);
    
    // Update info panel
    updateLLNDemoInfo(containerId, params);
}

/**
 * Updates LLN charts
 * @param {string} containerId - Container ID
 * @param {Object} samplesChart - Samples chart
 * @param {Object} avgChart - Running average chart
 * @param {Object} params - Parameters
 */
function updateLLNCharts(containerId, samplesChart, avgChart, params) {
    const samples = demoState.simulationData[containerId].samples;
    const runningAvg = demoState.simulationData[containerId].runningAvg;
    const numSamples = samples.length;
    
    if (numSamples === 0) {
        return;
    }
    
    // Update samples chart
    const samplePoints = samples.map((value, index) => ({ x: index + 1, y: value }));
    samplesChart.data.datasets[0].data = samplePoints;
    
    // Update theoretical mean line
    samplesChart.data.datasets[1].data = [
        { x: 0, y: params.mean },
        { x: Math.max(numSamples, params.maxSamples), y: params.mean }
    ];
    
    // Update y-axis range for samples chart
    const minSample = Math.min(...samples);
    const maxSample = Math.max(...samples);
    const padding = Math.max(1, (maxSample - minSample) * 0.1);
    
    samplesChart.options.scales.y.min = minSample - padding;
    samplesChart.options.scales.y.max = maxSample + padding;
    
    // Update samples chart
    samplesChart.update();
    
    // Update running average chart
    avgChart.data.labels = Array.from({ length: numSamples }, (_, i) => i + 1);
    avgChart.data.datasets[0].data = runningAvg;
    avgChart.data.datasets[1].data = Array(numSamples).fill(params.mean);
    
    // Update y-axis range for average chart (centered around theoretical mean)
    const minAvg = Math.min(...runningAvg);
    const maxAvg = Math.max(...runningAvg);
    const avgPadding = Math.max(0.1, (maxAvg - minAvg) * 0.5);
    
    avgChart.options.scales.y.min = Math.min(minAvg, params.mean) - avgPadding;
    avgChart.options.scales.y.max = Math.max(maxAvg, params.mean) + avgPadding;
    
    // Update x-axis range
    avgChart.options.scales.x.max = Math.max(numSamples, 50);
    
    // Update average chart
    avgChart.update();
}

/**
 * Export all demo functions
 */
export {
    createNormalDistributionDemo,
    createBinomialDistributionDemo,
    createCentralLimitTheoremDemo,
    createLawOfLargeNumbersDemo
};