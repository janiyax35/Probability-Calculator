/**
 * Random Variables & Probability Distributions
 * Main JavaScript File
 * Created by Janith Deshan
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animations
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true
    });
    
    // Initialize particles.js if the element exists
    if (document.getElementById('particles-js')) {
        initParticles();
    }
    
    // Initialize tooltips
    initTooltips();
    
    // Initialize range sliders
    initRangeSliders();
    
    // Initialize calculator forms
    initCalculatorForms();
    
    // Initialize tabs
    initTabs();
    
    // Initialize charts if any exist on the page
    initCharts();
    
    // Initialize modals
    initModals();
    
    // Add smooth scrolling to all links
    addSmoothScrolling();
});

/**
 * Initialize particles.js background
 */
function initParticles() {
    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": 80,
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#8AB4F8"
            },
            "shape": {
                "type": "circle",
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                },
                "polygon": {
                    "nb_sides": 5
                }
            },
            "opacity": {
                "value": 0.5,
                "random": false,
                "anim": {
                    "enable": false,
                    "speed": 1,
                    "opacity_min": 0.1,
                    "sync": false
                }
            },
            "size": {
                "value": 3,
                "random": true,
                "anim": {
                    "enable": false,
                    "speed": 40,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": true,
                "distance": 150,
                "color": "#8AB4F8",
                "opacity": 0.4,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": 2,
                "direction": "none",
                "random": false,
                "straight": false,
                "out_mode": "out",
                "bounce": false,
                "attract": {
                    "enable": false,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": true,
                    "mode": "grab"
                },
                "onclick": {
                    "enable": true,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 140,
                    "line_linked": {
                        "opacity": 1
                    }
                },
                "bubble": {
                    "distance": 400,
                    "size": 40,
                    "duration": 2,
                    "opacity": 8,
                    "speed": 3
                },
                "repulse": {
                    "distance": 200,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 4
                },
                "remove": {
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": true
    });
}

/**
 * Initialize custom tooltips
 */
function initTooltips() {
    const tooltips = document.querySelectorAll('.custom-tooltip');
    tooltips.forEach(tooltip => {
        // Initialize tooltip functionality if needed
        // This is a basic implementation - you might want to enhance this
    });
}

/**
 * Initialize range sliders with value display
 */
function initRangeSliders() {
    const rangeSliders = document.querySelectorAll('.range-slider input[type="range"]');
    
    rangeSliders.forEach(slider => {
        const valueDisplay = slider.parentElement.querySelector('.range-value-display');
        if (valueDisplay) {
            // Update value display initially
            valueDisplay.textContent = slider.value;
            
            // Update value display when slider changes
            slider.addEventListener('input', function() {
                valueDisplay.textContent = this.value;
                
                // If there's a data-target attribute, update that element too
                const targetId = slider.getAttribute('data-target');
                if (targetId) {
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        targetElement.value = this.value;
                        
                        // Trigger change event on the target
                        const event = new Event('change');
                        targetElement.dispatchEvent(event);
                    }
                }
            });
        }
    });
}

/**
 * Initialize calculator forms
 */
function initCalculatorForms() {
    const calculatorForms = document.querySelectorAll('.calculator-form');
    
    calculatorForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get the calculator type from the form's data attribute
            const calculatorType = form.getAttribute('data-calculator-type');
            
            if (calculatorType) {
                // Call the appropriate calculator function based on type
                switch (calculatorType) {
                    case 'binomial':
                        calculateBinomial(form);
                        break;
                    case 'normal':
                        calculateNormal(form);
                        break;
                    case 'poisson':
                        calculatePoisson(form);
                        break;
                    case 'bayes':
                        calculateBayes(form);
                        break;
                    case 'expected-value':
                        calculateExpectedValue(form);
                        break;
                    // Add more cases as needed for different calculators
                    default:
                        console.log('Calculator type not recognized');
                }
            }
        });
        
        // Add reset functionality
        const resetButton = form.querySelector('.btn-reset');
        if (resetButton) {
            resetButton.addEventListener('click', function() {
                form.reset();
                
                // Reset any result displays
                const resultsContainer = document.querySelector(`#${form.getAttribute('data-results-container')}`);
                if (resultsContainer) {
                    resultsContainer.style.display = 'none';
                }
                
                // Reset any charts
                const chartContainer = document.querySelector(`#${form.getAttribute('data-chart-container')}`);
                if (chartContainer) {
                    const canvas = chartContainer.querySelector('canvas');
                    if (canvas) {
                        // Destroy the existing chart if there is one
                        if (canvas.chart) {
                            canvas.chart.destroy();
                        }
                    }
                }
            });
        }
    });
}

/**
 * Initialize custom tabs
 */
function initTabs() {
    const tabLinks = document.querySelectorAll('.custom-tabs .nav-link');
    
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the tab container
            const tabContainer = this.closest('.custom-tabs');
            
            // Remove active class from all tabs
            tabContainer.querySelectorAll('.nav-link').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all tab content
            const tabContents = tabContainer.querySelectorAll('.tab-pane');
            tabContents.forEach(content => {
                content.style.display = 'none';
            });
            
            // Show the selected tab content
            const targetId = this.getAttribute('href');
            const targetContent = document.querySelector(targetId);
            if (targetContent) {
                targetContent.style.display = 'block';
            }
        });
    });
    
    // Activate the first tab by default
    document.querySelectorAll('.custom-tabs').forEach(tabContainer => {
        const firstTab = tabContainer.querySelector('.nav-link');
        if (firstTab) {
            // Trigger a click on the first tab
            firstTab.click();
        }
    });
}

/**
 * Initialize charts for distribution visualization
 */
function initCharts() {
    // This is a placeholder for chart initialization
    // The actual implementation would depend on the specific charts needed
    console.log('Charts initialization would happen here');
}

/**
 * Initialize custom modals
 */
function initModals() {
    // Get all elements that open modals
    const modalTriggers = document.querySelectorAll('[data-modal-target]');
    
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal-target');
            const modal = document.getElementById(modalId);
            const modalBackdrop = document.querySelector('.custom-modal-backdrop');
            
            if (modal && modalBackdrop) {
                modal.style.display = 'block';
                modalBackdrop.style.display = 'block';
            }
        });
    });
    
    // Get all close buttons
    const closeButtons = document.querySelectorAll('.custom-modal-close');
    
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.custom-modal');
            const modalBackdrop = document.querySelector('.custom-modal-backdrop');
            
            if (modal && modalBackdrop) {
                modal.style.display = 'none';
                modalBackdrop.style.display = 'none';
            }
        });
    });
    
    // Close modal when clicking on backdrop
    const modalBackdrop = document.querySelector('.custom-modal-backdrop');
    if (modalBackdrop) {
        modalBackdrop.addEventListener('click', function() {
            const modals = document.querySelectorAll('.custom-modal');
            modals.forEach(modal => {
                modal.style.display = 'none';
            });
            this.style.display = 'none';
        });
    }
}

/**
 * Add smooth scrolling to all links
 */
function addSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Skip if it's a tab link
            if (this.classList.contains('nav-link') && this.closest('.custom-tabs')) {
                return;
            }
            
            // Skip if the target doesn't exist
            if (!document.querySelector(targetId)) {
                return;
            }
            
            e.preventDefault();
            
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
}

/**
 * Calculator Function: Binomial Distribution
 */
function calculateBinomial(form) {
    // Get input values
    const n = parseInt(form.querySelector('#trials').value);
    const p = parseFloat(form.querySelector('#probability').value);
    const k = parseInt(form.querySelector('#successes').value);
    const calculationType = form.querySelector('#calculation-type').value;
    
    // Validate inputs
    if (isNaN(n) || isNaN(p) || isNaN(k) || n < 0 || p < 0 || p > 1 || k < 0 || k > n) {
        showError('Please enter valid values (n ≥ 0, 0 ≤ p ≤ 1, 0 ≤ k ≤ n)');
        return;
    }
    
    let result, explanation;
    
    // Calculate based on calculation type
    if (calculationType === 'exact') {
        // P(X = k)
        result = binomialPMF(n, p, k);
        explanation = `P(X = ${k}) = ${result.toFixed(6)}`;
    } else if (calculationType === 'cumulative-less') {
        // P(X ≤ k)
        result = binomialCDF(n, p, k);
        explanation = `P(X ≤ ${k}) = ${result.toFixed(6)}`;
    } else if (calculationType === 'cumulative-greater') {
        // P(X ≥ k)
        result = 1 - binomialCDF(n, p, k - 1);
        explanation = `P(X ≥ ${k}) = ${result.toFixed(6)}`;
    }
    
    // Display result
    displayResult(form, result, explanation);
    
    // Update chart if a chart container is specified
    const chartContainerId = form.getAttribute('data-chart-container');
    if (chartContainerId) {
        const chartContainer = document.getElementById(chartContainerId);
        if (chartContainer) {
            updateBinomialChart(chartContainer, n, p, k, calculationType);
        }
    }
    
    // Show step-by-step solution
    showBinomialSteps(form, n, p, k, calculationType, result);
}

/**
 * Calculator Function: Normal Distribution
 */
function calculateNormal(form) {
    // This is a placeholder for the normal distribution calculator
    console.log('Normal distribution calculator would be implemented here');
}

/**
 * Calculator Function: Poisson Distribution
 */
function calculatePoisson(form) {
    // This is a placeholder for the Poisson distribution calculator
    console.log('Poisson distribution calculator would be implemented here');
}

/**
 * Calculator Function: Bayes' Theorem
 */
function calculateBayes(form) {
    // This is a placeholder for the Bayes' theorem calculator
    console.log('Bayes theorem calculator would be implemented here');
}

/**
 * Calculator Function: Expected Value
 */
function calculateExpectedValue(form) {
    // This is a placeholder for the expected value calculator
    console.log('Expected value calculator would be implemented here');
}

/**
 * Utility: Binomial PMF - P(X = k)
 */
function binomialPMF(n, p, k) {
    // Calculate combinations C(n,k)
    const combinations = factorial(n) / (factorial(k) * factorial(n - k));
    
    // Calculate PMF
    return combinations * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

/**
 * Utility: Binomial CDF - P(X ≤ k)
 */
function binomialCDF(n, p, k) {
    let sum = 0;
    for (let i = 0; i <= k; i++) {
        sum += binomialPMF(n, p, i);
    }
    return sum;
}

/**
 * Utility: Factorial
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
 * Display calculator result
 */
function displayResult(form, result, explanation) {
    // Get the results container
    const resultsContainerId = form.getAttribute('data-results-container');
    const resultsContainer = document.getElementById(resultsContainerId);
    
    if (resultsContainer) {
        // Show the container
        resultsContainer.style.display = 'block';
        
        // Update the result value
        const resultValueElement = resultsContainer.querySelector('.result-value');
        if (resultValueElement) {
            resultValueElement.textContent = result.toFixed(6);
        }
        
        // Update the explanation
        const resultExplanationElement = resultsContainer.querySelector('.result-explanation');
        if (resultExplanationElement) {
            resultExplanationElement.textContent = explanation;
        }
    }
}

/**
 * Show error message
 */
function showError(message) {
    // Create alert element if it doesn't exist
    let errorAlert = document.getElementById('error-alert');
    
    if (!errorAlert) {
        errorAlert = document.createElement('div');
        errorAlert.id = 'error-alert';
        errorAlert.className = 'custom-alert error';
        errorAlert.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <div class="alert-content"></div>
        `;
        document.body.appendChild(errorAlert);
        
        // Position it fixed at the top
        errorAlert.style.position = 'fixed';
        errorAlert.style.top = '20px';
        errorAlert.style.left = '50%';
        errorAlert.style.transform = 'translateX(-50%)';
        errorAlert.style.zIndex = '9999';
        errorAlert.style.minWidth = '300px';
    }
    
    // Update message
    errorAlert.querySelector('.alert-content').textContent = message;
    
    // Show the alert
    errorAlert.style.display = 'flex';
    
    // Hide after 5 seconds
    setTimeout(() => {
        errorAlert.style.display = 'none';
    }, 5000);
}

/**
 * Update binomial distribution chart
 */
function updateBinomialChart(container, n, p, k, calculationType) {
    // This is a placeholder for the chart update functionality
    console.log('Binomial chart would be updated here');
}

/**
 * Show step-by-step solution for binomial calculation
 */
function showBinomialSteps(form, n, p, k, calculationType, result) {
    // This is a placeholder for the step-by-step solution display
    console.log('Step-by-step solution would be shown here');
}

/**
 * Toggle the visibility of step-by-step solution
 */
function toggleSteps(buttonElement) {
    const stepsContainer = document.querySelector(buttonElement.getAttribute('data-target'));
    
    if (stepsContainer) {
        if (stepsContainer.style.display === 'none' || getComputedStyle(stepsContainer).display === 'none') {
            stepsContainer.style.display = 'block';
            buttonElement.textContent = 'Hide Steps';
        } else {
            stepsContainer.style.display = 'none';
            buttonElement.textContent = 'Show Steps';
        }
    }
}