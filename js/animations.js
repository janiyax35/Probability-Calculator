/**
 * Random Variables & Probability Distributions
 * Animations JavaScript File
 * Created by Janith Deshan
 */

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS with custom settings
    initAOS();
    
    // Initialize background animations
    initBackgroundAnimations();
    
    // Initialize result animations
    initResultAnimations();
    
    // Initialize chart animations
    initChartAnimations();
});

/**
 * Initialize AOS (Animate on Scroll) with custom settings
 */
function initAOS() {
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        anchorPlacement: 'top-bottom',
        disable: 'mobile'
    });
    
    // Refresh AOS on window resize
    window.addEventListener('resize', function() {
        AOS.refresh();
    });
}

/**
 * Initialize background animations including particles
 */
function initBackgroundAnimations() {
    // Initialize particles.js if the element exists
    if (document.getElementById('particles-js')) {
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
    
    // Add gradient animation to hero section if it exists
    const heroSection = document.querySelector('.hero-section');
    if (heroSection) {
        // Create gradient animation
        initGradientAnimation(heroSection);
    }
    
    // Add floating animation to elements with .floating class
    const floatingElements = document.querySelectorAll('.floating');
    floatingElements.forEach(element => {
        element.style.animation = 'float 3s ease-in-out infinite';
    });
}

/**
 * Initialize gradient animation for a background element
 * @param {HTMLElement} element - The element to apply the gradient animation to
 */
function initGradientAnimation(element) {
    // Check if the element already has a gradient
    const computedStyle = window.getComputedStyle(element);
    const currentBackground = computedStyle.backgroundImage;
    
    if (!currentBackground.includes('gradient')) {
        // If no gradient is set, apply a default one
        element.style.background = 'linear-gradient(135deg, rgba(30, 58, 138, 0.8), rgba(30, 30, 60, 0.9))';
    }
    
    // Add animation class
    element.classList.add('gradient-animate');
    
    // Add keyframes animation if not already in the document
    if (!document.getElementById('gradient-keyframes')) {
        const style = document.createElement('style');
        style.id = 'gradient-keyframes';
        style.textContent = `
            @keyframes gradientAnimation {
                0% {
                    background-position: 0% 50%;
                }
                50% {
                    background-position: 100% 50%;
                }
                100% {
                    background-position: 0% 50%;
                }
            }
            
            .gradient-animate {
                background-size: 200% 200% !important;
                animation: gradientAnimation 15s ease infinite;
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Initialize animations for calculation results
 */
function initResultAnimations() {
    // Set up observers for result containers
    const resultContainers = document.querySelectorAll('.results-container');
    
    resultContainers.forEach(container => {
        // Create animation for when results are shown
        container.addEventListener('show', function() {
            animateResultContainer(this);
        });
    });
    
    // Add event listeners to all calculator forms
    const calculatorForms = document.querySelectorAll('.calculator-form');
    calculatorForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get the results container id
            const resultsContainerId = this.getAttribute('data-results-container');
            if (resultsContainerId) {
                const resultsContainer = document.getElementById(resultsContainerId);
                if (resultsContainer) {
                    // Trigger the show event
                    const showEvent = new Event('show');
                    resultsContainer.dispatchEvent(showEvent);
                }
            }
        });
    });
}

/**
 * Animate a result container with a reveal effect
 * @param {HTMLElement} container - The result container to animate
 */
function animateResultContainer(container) {
    // Hide the container first
    container.style.opacity = '0';
    container.style.transform = 'translateY(20px)';
    container.style.display = 'block';
    
    // Force reflow
    void container.offsetWidth;
    
    // Add transition
    container.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    
    // Show with animation
    setTimeout(() => {
        container.style.opacity = '1';
        container.style.transform = 'translateY(0)';
    }, 10);
    
    // Animate result value with counting effect
    const resultValue = container.querySelector('.result-value');
    if (resultValue) {
        animateNumber(resultValue);
    }
}

/**
 * Animate a number with counting effect
 * @param {HTMLElement} element - The element containing the number
 */
function animateNumber(element) {
    const finalValue = parseFloat(element.textContent);
    const decimalPlaces = (element.textContent.split('.')[1] || '').length;
    
    // Only animate if it's a valid number
    if (!isNaN(finalValue)) {
        const duration = 1000; // ms
        const frameDuration = 1000 / 60; // 60fps
        const totalFrames = Math.round(duration / frameDuration);
        let frame = 0;
        
        // Start value - we'll count from 0 to the final value
        let currentValue = 0;
        
        // Store the original text to restore if animation is interrupted
        const originalText = element.textContent;
        
        // Animation function
        const animate = () => {
            frame++;
            
            // Calculate progress based on easeOutQuad easing function
            const progress = frame / totalFrames;
            const easeProgress = -progress * (progress - 2);
            
            // Calculate current value based on progress
            currentValue = easeProgress * finalValue;
            
            // Update the element text with proper decimal places
            element.textContent = currentValue.toFixed(decimalPlaces);
            
            // Continue animation if not finished
            if (frame < totalFrames) {
                requestAnimationFrame(animate);
            } else {
                // Ensure the final value is exactly as intended
                element.textContent = originalText;
            }
        };
        
        // Start animation
        requestAnimationFrame(animate);
    }
}

/**
 * Initialize animations for charts and visualizations
 */
function initChartAnimations() {
    // This will be used to animate charts when they are created or updated
    // Chart.js has built-in animations, but we can customize them here
    
    // Set global default animations for Chart.js
    if (typeof Chart !== 'undefined') {
        Chart.defaults.animation = {
            duration: 1000,
            easing: 'easeOutQuart',
            delay: function(context) {
                return context.dataIndex * 50 + context.datasetIndex * 100;
            }
        };
    }
}

/**
 * Add typewriter effect to an element
 * @param {HTMLElement} element - The element to apply the effect to
 * @param {string} text - The text to type
 * @param {number} speed - Typing speed in milliseconds
 */
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

/**
 * Show an element with a fade-in effect
 * @param {HTMLElement} element - The element to fade in
 * @param {number} duration - Animation duration in milliseconds
 */
function fadeIn(element, duration = 500) {
    element.style.opacity = '0';
    element.style.display = 'block';
    
    let start = null;
    
    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const opacity = Math.min(progress / duration, 1);
        
        element.style.opacity = opacity;
        
        if (progress < duration) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

/**
 * Hide an element with a fade-out effect
 * @param {HTMLElement} element - The element to fade out
 * @param {number} duration - Animation duration in milliseconds
 */
function fadeOut(element, duration = 500) {
    let start = null;
    
    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const opacity = Math.max(1 - (progress / duration), 0);
        
        element.style.opacity = opacity;
        
        if (progress < duration) {
            requestAnimationFrame(animate);
        } else {
            element.style.display = 'none';
        }
    }
    
    requestAnimationFrame(animate);
}

/**
 * Add pulse animation to an element to draw attention
 * @param {HTMLElement} element - The element to pulse
 * @param {number} duration - Animation duration in milliseconds
 */
function pulseAnimation(element, duration = 1000) {
    // Add pulse class if not already added
    if (!element.classList.contains('pulse-animation')) {
        // Create and add the animation style if not already present
        if (!document.getElementById('pulse-animation-style')) {
            const style = document.createElement('style');
            style.id = 'pulse-animation-style';
            style.textContent = `
                @keyframes pulse {
                    0% {
                        transform: scale(1);
                        box-shadow: 0 0 0 0 rgba(138, 180, 248, 0.7);
                    }
                    70% {
                        transform: scale(1.05);
                        box-shadow: 0 0 0 10px rgba(138, 180, 248, 0);
                    }
                    100% {
                        transform: scale(1);
                        box-shadow: 0 0 0 0 rgba(138, 180, 248, 0);
                    }
                }
                
                .pulse-animation {
                    animation: pulse 2s infinite;
                }
            `;
            document.head.appendChild(style);
        }
        
        element.classList.add('pulse-animation');
        
        // Remove the class after specified duration if duration is provided
        if (duration > 0) {
            setTimeout(() => {
                element.classList.remove('pulse-animation');
            }, duration);
        }
    }
}