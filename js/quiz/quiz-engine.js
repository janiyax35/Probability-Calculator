/**
 * Quiz Engine Module
 * Handles loading, displaying, and evaluating probability quiz questions
 * Random Variables & Probability Distributions
 */

// Global state for the quiz system
const quizState = {
    quizzes: {},           // Repository of loaded quizzes
    activeQuiz: null,      // Currently active quiz
    currentQuestion: 0,    // Current question index
    userAnswers: [],       // User's answers for each question
    score: 0,              // Current score
    totalScore: 0,         // Maximum possible score
    timeStarted: null,     // When the quiz was started
    timeElapsed: 0,        // Time elapsed in seconds
    timerInterval: null,   // Timer interval reference
    isCompleted: false,    // Whether the quiz is completed
    reviewMode: false,     // Whether we're in review mode
    shuffledOptions: []    // Shuffled options for each question
};

/**
 * =============================================
 * QUIZ LOADING & INITIALIZATION
 * =============================================
 */

/**
 * Loads a quiz from a JSON file
 * @param {string} quizId - Unique identifier for the quiz
 * @param {string} quizPath - Path to the quiz JSON file
 * @returns {Promise} - Promise that resolves when the quiz is loaded
 */
function loadQuiz(quizId, quizPath) {
    return new Promise((resolve, reject) => {
        // Check if quiz is already loaded
        if (quizState.quizzes[quizId]) {
            resolve(quizState.quizzes[quizId]);
            return;
        }
        
        // Fetch quiz from JSON file
        fetch(quizPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed to load quiz: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(quiz => {
                // Process and store the quiz
                processQuiz(quiz);
                quizState.quizzes[quizId] = quiz;
                resolve(quiz);
            })
            .catch(error => {
                console.error(`Error loading quiz ${quizId}:`, error);
                reject(error);
            });
    });
}

/**
 * Processes a quiz to prepare it for use
 * @param {Object} quiz - Quiz object loaded from JSON
 */
function processQuiz(quiz) {
    // Ensure questions have required properties
    quiz.questions.forEach((question, index) => {
        // Add index if not present
        question.index = index;
        
        // Ensure options are in a standard format
        if (!question.options && question.answers) {
            question.options = question.answers;
        }
        
        // Validate question structure
        if (!question.type) {
            question.type = 'multiple-choice';
        }
        
        // Process score value
        if (!question.points) {
            question.points = 1;
        }
    });
    
    // Calculate total possible score
    quiz.totalScore = quiz.questions.reduce((total, q) => total + (q.points || 1), 0);
}

/**
 * Initializes a quiz and prepares it for the user
 * @param {string} quizId - ID of the quiz to initialize
 * @param {Object} options - Initialization options
 * @returns {Object} - Initialized quiz state
 */
function initQuiz(quizId, options = {}) {
    const quiz = quizState.quizzes[quizId];
    
    if (!quiz) {
        throw new Error(`Quiz ${quizId} not found. Make sure to load it first.`);
    }
    
    // Reset quiz state
    quizState.activeQuiz = quizId;
    quizState.currentQuestion = 0;
    quizState.userAnswers = new Array(quiz.questions.length).fill(null);
    quizState.score = 0;
    quizState.totalScore = quiz.totalScore;
    quizState.timeStarted = new Date();
    quizState.timeElapsed = 0;
    quizState.isCompleted = false;
    quizState.reviewMode = false;
    
    // Handle options
    const shuffleQuestions = options.shuffleQuestions || quiz.shuffleQuestions || false;
    const shuffleOptions = options.shuffleOptions || quiz.shuffleOptions || false;
    
    // Shuffle questions if needed
    if (shuffleQuestions) {
        quiz.questions = shuffleArray([...quiz.questions]);
        
        // Restore indices
        quiz.questions.forEach((q, i) => {
            q.index = i;
        });
    }
    
    // Prepare shuffled options for each question
    quizState.shuffledOptions = quiz.questions.map(question => {
        if (!question.options || !shuffleOptions) {
            return question.options || [];
        }
        
        // For multiple choice, shuffle options but keep track of correct answer
        if (question.type === 'multiple-choice' || question.type === 'multiple-answer') {
            return shuffleArray([...question.options]);
        }
        
        return question.options;
    });
    
    // Start timer
    startTimer();
    
    return {
        quiz,
        state: getQuizState()
    };
}

/**
 * Starts the quiz timer
 */
function startTimer() {
    // Clear any existing timer
    if (quizState.timerInterval) {
        clearInterval(quizState.timerInterval);
    }
    
    // Start a new timer that updates every second
    quizState.timerInterval = setInterval(() => {
        quizState.timeElapsed = Math.floor((new Date() - quizState.timeStarted) / 1000);
        
        // Dispatch a timer event that UI can listen for
        const event = new CustomEvent('quiz-timer-update', {
            detail: {
                timeElapsed: quizState.timeElapsed,
                formattedTime: formatTime(quizState.timeElapsed)
            }
        });
        document.dispatchEvent(event);
        
    }, 1000);
}

/**
 * Stops the quiz timer
 */
function stopTimer() {
    if (quizState.timerInterval) {
        clearInterval(quizState.timerInterval);
        quizState.timerInterval = null;
    }
}

/**
 * =============================================
 * QUIZ NAVIGATION & INTERACTION
 * =============================================
 */

/**
 * Gets the current question data
 * @returns {Object} - Current question data with user's answer
 */
function getCurrentQuestion() {
    const quiz = quizState.quizzes[quizState.activeQuiz];
    if (!quiz || quizState.currentQuestion >= quiz.questions.length) {
        return null;
    }
    
    const question = quiz.questions[quizState.currentQuestion];
    const userAnswer = quizState.userAnswers[quizState.currentQuestion];
    const shuffledOptions = quizState.shuffledOptions[quizState.currentQuestion];
    
    // Map original options to shuffled options for displaying
    const displayOptions = shuffledOptions.length > 0 ? shuffledOptions : question.options;
    
    // Add explanation if in review mode
    let explanation = null;
    if (quizState.reviewMode && question.explanation) {
        explanation = question.explanation;
    }
    
    // Calculate correctness if in review mode
    let isCorrect = null;
    if (quizState.reviewMode) {
        isCorrect = evaluateAnswer(question, userAnswer);
    }
    
    return {
        ...question,
        options: displayOptions,
        userAnswer,
        explanation,
        isCorrect,
        reviewMode: quizState.reviewMode
    };
}

/**
 * Submits an answer for the current question
 * @param {any} answer - User's answer
 * @returns {Object} - Result of the submission
 */
function submitAnswer(answer) {
    const quiz = quizState.quizzes[quizState.activeQuiz];
    if (!quiz || quizState.currentQuestion >= quiz.questions.length) {
        return { error: "No active question" };
    }
    
    // Store the user's answer
    quizState.userAnswers[quizState.currentQuestion] = answer;
    
    // Get the current question
    const question = quiz.questions[quizState.currentQuestion];
    
    // Return information about the submission
    return {
        questionIndex: quizState.currentQuestion,
        answer: answer,
        isLastQuestion: quizState.currentQuestion === quiz.questions.length - 1
    };
}

/**
 * Moves to the next question
 * @returns {Object} - Next question data or null if quiz is complete
 */
function nextQuestion() {
    const quiz = quizState.quizzes[quizState.activeQuiz];
    if (!quiz) {
        return { error: "No active quiz" };
    }
    
    // Check if we're at the end of the quiz
    if (quizState.currentQuestion >= quiz.questions.length - 1) {
        return { complete: true };
    }
    
    // Move to the next question
    quizState.currentQuestion++;
    
    // Return the new current question
    return getCurrentQuestion();
}

/**
 * Moves to the previous question
 * @returns {Object} - Previous question data or null if at the beginning
 */
function previousQuestion() {
    if (quizState.currentQuestion <= 0) {
        return { error: "Already at first question" };
    }
    
    // Move to the previous question
    quizState.currentQuestion--;
    
    // Return the new current question
    return getCurrentQuestion();
}

/**
 * Jumps to a specific question by index
 * @param {number} index - Question index to jump to
 * @returns {Object} - Question data or error
 */
function jumpToQuestion(index) {
    const quiz = quizState.quizzes[quizState.activeQuiz];
    if (!quiz) {
        return { error: "No active quiz" };
    }
    
    // Validate index
    if (index < 0 || index >= quiz.questions.length) {
        return { error: "Invalid question index" };
    }
    
    // Jump to the specified question
    quizState.currentQuestion = index;
    
    // Return the new current question
    return getCurrentQuestion();
}

/**
 * =============================================
 * QUIZ COMPLETION & EVALUATION
 * =============================================
 */

/**
 * Completes the quiz and calculates the final score
 * @returns {Object} - Quiz results
 */
function completeQuiz() {
    const quiz = quizState.quizzes[quizState.activeQuiz];
    if (!quiz) {
        return { error: "No active quiz" };
    }
    
    // Stop the timer
    stopTimer();
    
    // Calculate score
    let score = 0;
    const questionResults = [];
    
    quiz.questions.forEach((question, index) => {
        const userAnswer = quizState.userAnswers[index];
        const isCorrect = evaluateAnswer(question, userAnswer);
        const points = isCorrect ? (question.points || 1) : 0;
        
        score += points;
        
        questionResults.push({
            questionIndex: index,
            questionText: question.text,
            userAnswer,
            correctAnswer: question.answer || question.correctAnswer,
            isCorrect,
            points,
            maxPoints: question.points || 1
        });
    });
    
    // Update quiz state
    quizState.score = score;
    quizState.isCompleted = true;
    
    // Calculate percentage score
    const percentageScore = Math.round((score / quiz.totalScore) * 100);
    
    // Determine if the user passed
    const passingScore = quiz.passingScore || 70;
    const passed = percentageScore >= passingScore;
    
    // Get feedback based on score
    let feedback;
    if (quiz.feedback) {
        // Find the appropriate feedback range
        for (const range of quiz.feedback) {
            if (percentageScore >= range.min && percentageScore <= range.max) {
                feedback = range.message;
                break;
            }
        }
    }
    
    // Construct results object
    const results = {
        quizId: quizState.activeQuiz,
        quizTitle: quiz.title,
        score,
        totalScore: quiz.totalScore,
        percentageScore,
        timeElapsed: quizState.timeElapsed,
        formattedTime: formatTime(quizState.timeElapsed),
        passed,
        passingScore,
        feedback,
        questionResults,
        completedAt: new Date()
    };
    
    // Dispatch a quiz completed event
    const event = new CustomEvent('quiz-completed', {
        detail: results
    });
    document.dispatchEvent(event);
    
    return results;
}

/**
 * Evaluates if an answer is correct for a given question
 * @param {Object} question - Question object
 * @param {any} userAnswer - User's answer
 * @returns {boolean} - Whether the answer is correct
 */
function evaluateAnswer(question, userAnswer) {
    // Handle case where user didn't answer
    if (userAnswer === null || userAnswer === undefined) {
        return false;
    }
    
    const correctAnswer = question.answer || question.correctAnswer;
    
    // Handle different question types
    switch (question.type) {
        case 'multiple-choice':
            // Simple comparison for multiple choice
            return userAnswer === correctAnswer;
            
        case 'multiple-answer':
            // For multiple-answer, check if arrays contain the same values
            if (!Array.isArray(userAnswer) || !Array.isArray(correctAnswer)) {
                return false;
            }
            
            if (userAnswer.length !== correctAnswer.length) {
                return false;
            }
            
            // Sort and compare each element
            const sortedUserAnswer = [...userAnswer].sort();
            const sortedCorrectAnswer = [...correctAnswer].sort();
            
            return sortedUserAnswer.every((val, i) => val === sortedCorrectAnswer[i]);
            
        case 'numeric':
            // For numeric questions, we may have a tolerance
            const tolerance = question.tolerance || 0;
            return Math.abs(parseFloat(userAnswer) - parseFloat(correctAnswer)) <= tolerance;
            
        case 'text':
        case 'short-answer':
            // For text questions, we may want to ignore case and whitespace
            if (question.ignoreCase) {
                return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
            } else {
                return userAnswer.trim() === correctAnswer.trim();
            }
            
        case 'fill-in-blank':
            // For fill-in-blank, we may have multiple correct answers
            if (Array.isArray(correctAnswer)) {
                return correctAnswer.some(answer => {
                    if (question.ignoreCase) {
                        return userAnswer.toLowerCase().trim() === answer.toLowerCase().trim();
                    } else {
                        return userAnswer.trim() === answer.trim();
                    }
                });
            } else {
                if (question.ignoreCase) {
                    return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
                } else {
                    return userAnswer.trim() === correctAnswer.trim();
                }
            }
            
        case 'matching':
            // For matching, check if all pairs match
            if (!userAnswer || typeof userAnswer !== 'object') {
                return false;
            }
            
            for (const key in correctAnswer) {
                if (userAnswer[key] !== correctAnswer[key]) {
                    return false;
                }
            }
            return true;
            
        case 'calculation':
            // For calculation questions, may need to evaluate with formula
            if (question.evaluateWith && typeof question.evaluateWith === 'function') {
                return question.evaluateWith(userAnswer, correctAnswer);
            }
            
            // Default to numeric comparison with tolerance
            const calcTolerance = question.tolerance || 0.001;
            return Math.abs(parseFloat(userAnswer) - parseFloat(correctAnswer)) <= calcTolerance;
            
        case 'probability':
            // For probability questions, allow answers in different formats (0.5, 1/2, 50%)
            let normalizedUserAnswer = userAnswer;
            let normalizedCorrectAnswer = correctAnswer;
            
            // Handle fraction format (e.g., "1/2")
            if (typeof userAnswer === 'string' && userAnswer.includes('/')) {
                const [num, denom] = userAnswer.split('/').map(Number);
                normalizedUserAnswer = num / denom;
            }
            
            // Handle percentage format (e.g., "50%")
            if (typeof userAnswer === 'string' && userAnswer.includes('%')) {
                normalizedUserAnswer = parseFloat(userAnswer) / 100;
            }
            
            // Do the same for correct answer if it's a string
            if (typeof correctAnswer === 'string' && correctAnswer.includes('/')) {
                const [num, denom] = correctAnswer.split('/').map(Number);
                normalizedCorrectAnswer = num / denom;
            }
            
            if (typeof correctAnswer === 'string' && correctAnswer.includes('%')) {
                normalizedCorrectAnswer = parseFloat(correctAnswer) / 100;
            }
            
            const probTolerance = question.tolerance || 0.001;
            return Math.abs(parseFloat(normalizedUserAnswer) - parseFloat(normalizedCorrectAnswer)) <= probTolerance;
            
        default:
            // For unknown types, just do a strict equality check
            return userAnswer === correctAnswer;
    }
}

/**
 * Enters review mode to go through the quiz with answers and explanations
 * @returns {Object} - First question with review information
 */
function enterReviewMode() {
    if (!quizState.isCompleted) {
        return { error: "Cannot review before completing the quiz" };
    }
    
    quizState.reviewMode = true;
    quizState.currentQuestion = 0;
    
    return getCurrentQuestion();
}

/**
 * Exits review mode
 */
function exitReviewMode() {
    quizState.reviewMode = false;
}

/**
 * Gets the current state of the quiz
 * @returns {Object} - Quiz state
 */
function getQuizState() {
    const quiz = quizState.quizzes[quizState.activeQuiz];
    if (!quiz) {
        return { error: "No active quiz" };
    }
    
    // Calculate progress
    const totalQuestions = quiz.questions.length;
    const answeredQuestions = quizState.userAnswers.filter(a => a !== null).length;
    const progress = Math.round((answeredQuestions / totalQuestions) * 100);
    
    return {
        quizId: quizState.activeQuiz,
        quizTitle: quiz.title,
        currentQuestion: quizState.currentQuestion,
        totalQuestions,
        answeredQuestions,
        progress,
        timeElapsed: quizState.timeElapsed,
        formattedTime: formatTime(quizState.timeElapsed),
        isCompleted: quizState.isCompleted,
        reviewMode: quizState.reviewMode,
        answerStatus: quizState.userAnswers.map(a => a !== null)
    };
}

/**
 * =============================================
 * QUIZ HISTORY & PERSISTENCE
 * =============================================
 */

/**
 * Saves quiz results to local storage
 * @param {Object} results - Quiz results to save
 * @returns {boolean} - Whether the save was successful
 */
function saveQuizResults(results) {
    try {
        // Get existing history
        const historyJson = localStorage.getItem('quiz_history');
        const history = historyJson ? JSON.parse(historyJson) : [];
        
        // Add current results to history
        history.push({
            ...results,
            savedAt: new Date().toISOString()
        });
        
        // Save back to localStorage
        localStorage.setItem('quiz_history', JSON.stringify(history));
        
        return true;
    } catch (error) {
        console.error('Error saving quiz results:', error);
        return false;
    }
}

/**
 * Gets quiz history from local storage
 * @returns {Array} - Quiz history
 */
function getQuizHistory() {
    try {
        const historyJson = localStorage.getItem('quiz_history');
        return historyJson ? JSON.parse(historyJson) : [];
    } catch (error) {
        console.error('Error loading quiz history:', error);
        return [];
    }
}

/**
 * Clears quiz history from local storage
 * @returns {boolean} - Whether the clear was successful
 */
function clearQuizHistory() {
    try {
        localStorage.removeItem('quiz_history');
        return true;
    } catch (error) {
        console.error('Error clearing quiz history:', error);
        return false;
    }
}

/**
 * =============================================
 * HELPER FUNCTIONS
 * =============================================
 */

/**
 * Formats time in seconds to a readable string (mm:ss)
 * @param {number} seconds - Time in seconds
 * @returns {string} - Formatted time
 */
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${padZero(minutes)}:${padZero(remainingSeconds)}`;
}

/**
 * Pads a number with leading zero if needed
 * @param {number} num - Number to pad
 * @returns {string} - Padded number
 */
function padZero(num) {
    return num < 10 ? `0${num}` : num.toString();
}

/**
 * Shuffles an array using the Fisher-Yates algorithm
 * @param {Array} array - Array to shuffle
 * @returns {Array} - Shuffled array
 */
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

/**
 * Generates a unique ID
 * @returns {string} - Unique ID
 */
function generateId() {
    return '_' + Math.random().toString(36).substring(2, 9);
}

/**
 * =============================================
 * QUIZ GENERATION FUNCTIONS
 * =============================================
 */

/**
 * Generates a probability quiz based on specified topics
 * @param {Object} options - Generator options
 * @returns {Object} - Generated quiz
 */
function generateProbabilityQuiz(options = {}) {
    const {
        topics = ['basic', 'distributions', 'random-variables'],
        difficulty = 'medium',
        numQuestions = 10,
        title = 'Probability Quiz',
        description = 'Test your knowledge of probability concepts'
    } = options;
    
    // Question bank organized by topic and difficulty
    const questionBank = {
        basic: {
            easy: [
                {
                    text: "What is the probability of rolling a 6 on a fair six-sided die?",
                    type: "multiple-choice",
                    options: ["1/6", "1/3", "1/2", "2/3"],
                    answer: "1/6",
                    explanation: "Since the die is fair, each of the six possible outcomes has an equal probability of 1/6."
                },
                {
                    text: "If you flip a fair coin twice, what is the probability of getting exactly one heads?",
                    type: "multiple-choice",
                    options: ["1/4", "1/2", "3/4", "1"],
                    answer: "1/2",
                    explanation: "There are 4 possible outcomes when flipping a coin twice: HH, HT, TH, TT. Two of these (HT and TH) have exactly one heads, so the probability is 2/4 = 1/2."
                },
                {
                    text: "What is the probability of drawing a red card from a standard deck of 52 cards?",
                    type: "multiple-choice",
                    options: ["1/4", "1/2", "1/13", "1/26"],
                    answer: "1/2",
                    explanation: "A standard deck has 26 red cards (hearts and diamonds) out of 52 total cards, so the probability is 26/52 = 1/2."
                }
            ],
            medium: [
                {
                    text: "A bag contains 5 red marbles and 3 blue marbles. If you draw 2 marbles without replacement, what is the probability that both are red?",
                    type: "numeric",
                    answer: 5/28,
                    tolerance: 0.001,
                    explanation: "The probability of drawing a red marble first is 5/8. After drawing a red marble, there are 4 red and 3 blue marbles remaining, so the probability of drawing another red is 4/7. Therefore, the probability of drawing two red marbles is (5/8) × (4/7) = 20/56 = 5/14."
                },
                {
                    text: "Three fair coins are tossed. What is the probability of getting at least 2 heads?",
                    type: "multiple-choice",
                    options: ["1/8", "3/8", "1/2", "5/8"],
                    answer: "1/2",
                    explanation: "There are 8 possible outcomes when tossing 3 coins. The outcomes with at least 2 heads are: HHH, HHT, HTH, THH. That's 4 out of 8 outcomes, so the probability is 4/8 = 1/2."
                },
                {
                    text: "A standard deck of 52 cards is shuffled. What is the probability of drawing a king or a queen?",
                    type: "multiple-choice",
                    options: ["2/13", "1/13", "8/52", "1/4"],
                    answer: "2/13",
                    explanation: "There are 4 kings and 4 queens in a standard deck, for a total of 8 cards out of 52. The probability is 8/52 = 2/13."
                }
            ],
            hard: [
                {
                    text: "A drawer contains 10 red socks and 10 blue socks. If 2 socks are randomly selected without replacement, what is the probability that they form a matching pair?",
                    type: "probability",
                    answer: 9/19,
                    explanation: "To get a matching pair, we need either 2 red socks or 2 blue socks. P(2 red) = (10/20) × (9/19) = 90/380. P(2 blue) = (10/20) × (9/19) = 90/380. Total probability = 90/380 + 90/380 = 180/380 = 9/19."
                },
                {
                    text: "Three fair dice are rolled. What is the probability that the sum of the three dice is exactly 10?",
                    type: "probability",
                    answer: 27/216,
                    explanation: "There are 6³ = 216 possible outcomes when rolling 3 dice. There are 27 ways to get a sum of 10 (can be enumerated), so the probability is 27/216 = 1/8."
                },
                {
                    text: "Five cards are drawn from a standard deck. What is the probability of drawing exactly 3 aces?",
                    type: "probability",
                    answer: 0.00144,
                    tolerance: 0.0001,
                    explanation: "The probability is (C(4,3) × C(48,2)) / C(52,5), which equals approximately 0.00144."
                }
            ]
        },
        distributions: {
            easy: [
                {
                    text: "For a binomial distribution with n = 10 and p = 0.3, what is the expected value?",
                    type: "multiple-choice",
                    options: ["3", "7", "0.3", "10"],
                    answer: "3",
                    explanation: "For a binomial distribution, the expected value is E[X] = np = 10 × 0.3 = 3."
                },
                {
                    text: "Which of the following distributions is used to model the number of successes in a fixed number of independent trials?",
                    type: "multiple-choice",
                    options: ["Binomial", "Poisson", "Exponential", "Normal"],
                    answer: "Binomial",
                    explanation: "The binomial distribution models the number of successes in a fixed number of independent trials, each with the same probability of success."
                },
                {
                    text: "The expected value of a Poisson distribution with parameter λ = 5 is:",
                    type: "numeric",
                    answer: 5,
                    explanation: "For a Poisson distribution with parameter λ, the expected value is E[X] = λ = 5."
                }
            ],
            medium: [
                {
                    text: "For a normally distributed random variable with mean μ = 10 and standard deviation σ = 2, what is the probability that the variable takes a value between 8 and 12?",
                    type: "multiple-choice",
                    options: ["0.68", "0.95", "0.99", "0.50"],
                    answer: "0.68",
                    explanation: "For a normal distribution, approximately 68% of the values lie within one standard deviation of the mean. Since 8 = 10 - 1×2 and 12 = 10 + 1×2, the probability is about 0.68 or 68%."
                },
                {
                    text: "A Poisson process has a rate of 3 events per hour. What is the probability of observing exactly 2 events in a 1-hour period?",
                    type: "probability",
                    answer: 0.224,
                    tolerance: 0.001,
                    explanation: "For a Poisson distribution with λ = 3, P(X = 2) = e^(-3) × 3² / 2! = e^(-3) × 9 / 2 = e^(-3) × 4.5 ≈ 0.224."
                },
                {
                    text: "For an exponential distribution with parameter λ = 0.5, what is the probability that X > 3?",
                    type: "probability",
                    answer: 0.223,
                    tolerance: 0.001,
                    explanation: "For an exponential distribution, P(X > x) = e^(-λx) = e^(-0.5 × 3) = e^(-1.5) ≈ 0.223."
                }
            ],
            hard: [
                {
                    text: "A normal distribution has mean μ = 75 and standard deviation σ = 8. What is the value of x such that P(X < x) = 0.95?",
                    type: "numeric",
                    answer: 88.16,
                    tolerance: 0.1,
                    explanation: "We need to find x such that (x - μ)/σ = z_{0.95} = 1.645. So x = μ + z_{0.95}σ = 75 + 1.645 × 8 ≈ 88.16."
                },
                {
                    text: "A gamma distribution with shape parameter α = 3 and rate parameter β = 2 has what variance?",
                    type: "numeric",
                    answer: 0.75,
                    tolerance: 0.01,
                    explanation: "For a gamma distribution with shape α and rate β, the variance is α/β² = 3/2² = 3/4 = 0.75."
                },
                {
                    text: "If X follows a chi-squared distribution with 5 degrees of freedom, what is P(X > 11.07)?",
                    type: "probability",
                    answer: 0.05,
                    tolerance: 0.01,
                    explanation: "The value 11.07 is the critical value for a chi-squared distribution with 5 degrees of freedom at the 0.05 significance level. Therefore, P(X > 11.07) = 0.05."
                }
            ]
        },
        'random-variables': {
            easy: [
                {
                    text: "What is the expected value of a fair six-sided die?",
                    type: "multiple-choice",
                    options: ["3", "3.5", "6", "7"],
                    answer: "3.5",
                    explanation: "The expected value is the sum of each value times its probability: E[X] = 1×(1/6) + 2×(1/6) + 3×(1/6) + 4×(1/6) + 5×(1/6) + 6×(1/6) = 21/6 = 3.5."
                },
                {
                    text: "For two independent random variables X and Y, what is Var(X + Y)?",
                    type: "multiple-choice",
                    options: ["Var(X) + Var(Y)", "Var(X) - Var(Y)", "Var(X) × Var(Y)", "√(Var(X) + Var(Y))"],
                    answer: "Var(X) + Var(Y)",
                    explanation: "For independent random variables, the variance of the sum equals the sum of the variances: Var(X + Y) = Var(X) + Var(Y)."
                },
                {
                    text: "If a random variable X has mean 5 and standard deviation 2, what is the value of E[3X + 1]?",
                    type: "numeric",
                    answer: 16,
                    explanation: "Using the properties of expectation: E[aX + b] = a×E[X] + b = 3×5 + 1 = 15 + 1 = 16."
                }
            ],
            medium: [
                {
                    text: "If X and Y are independent random variables with Var(X) = 4 and Var(Y) = 9, what is the standard deviation of 2X - 3Y?",
                    type: "numeric",
                    answer: 7,
                    tolerance: 0.1,
                    explanation: "Var(2X - 3Y) = 2²×Var(X) + (-3)²×Var(Y) = 4×4 + 9×9 = 16 + 81 = 97. The standard deviation is √97 ≈ 9.85."
                },
                {
                    text: "The moment generating function of a random variable X is M(t) = (1-2t)⁻³. What is the variance of X?",
                    type: "numeric",
                    answer: 6,
                    tolerance: 0.01,
                    explanation: "For a moment generating function, the variance is the second derivative evaluated at t=0. M'(t) = 6(1-2t)⁻⁴×2, M''(0) = 6×4×2 = 48, and M''(0)/M(0) = 48/1 = 48. The mean is M'(0)/M(0) = 6, so the variance is 48 - 6² = 48 - 36 = 12."
                },
                {
                    text: "If X follows a geometric distribution with p = 0.2, what is the probability that X > 5?",
                    type: "probability",
                    answer: 0.328,
                    tolerance: 0.001,
                    explanation: "For a geometric distribution with parameter p, P(X > n) = (1-p)^n. So P(X > 5) = (1-0.2)^5 = 0.8^5 ≈ 0.328."
                }
            ],
            hard: [
                {
                    text: "If X and Y have joint PDF f(x,y) = 2 for 0 ≤ x ≤ y ≤ 1, what is the covariance of X and Y?",
                    type: "numeric",
                    answer: 1/72,
                    tolerance: 0.001,
                    explanation: "The covariance is E[XY] - E[X]E[Y]. After integrating, E[X] = 1/3, E[Y] = 2/3, and E[XY] = 1/3. So Cov(X,Y) = 1/3 - 1/3 × 2/3 = 1/3 - 2/9 = 3/9 - 2/9 = 1/9."
                },
                {
                    text: "A random variable X has PDF f(x) = cx² for 1 ≤ x ≤ 2 and 0 elsewhere. What is the value of c?",
                    type: "numeric",
                    answer: 3/7,
                    tolerance: 0.001,
                    explanation: "We need to find c such that ∫₁² cx² dx = 1. This gives c × [x³/3]₁² = 1, which leads to c × (8/3 - 1/3) = 1. So c = 1/(7/3) = 3/7."
                },
                {
                    text: "If X₁, X₂, ..., Xₙ are i.i.d. random variables with mean μ and variance σ², what is the variance of the sample mean X̄?",
                    type: "multiple-choice",
                    options: ["σ²", "σ²/n", "nσ²", "n²σ²"],
                    answer: "σ²/n",
                    explanation: "The variance of the sample mean is Var(X̄) = Var(∑Xᵢ/n) = (1/n²)Var(∑Xᵢ) = (1/n²)(nσ²) = σ²/n."
                }
            ]
        }
    };
    
    // Select questions based on topics and difficulty
    const selectedQuestions = [];
    
    // Get questions from each topic
    for (const topic of topics) {
        if (!questionBank[topic]) continue;
        
        // Get questions of the specified difficulty
        const difficultySets = [questionBank[topic][difficulty]];
        
        // If not enough questions of the specified difficulty, use adjacent difficulties
        if (difficulty === 'medium') {
            difficultySets.push(questionBank[topic].easy, questionBank[topic].hard);
        } else if (difficulty === 'easy') {
            difficultySets.push(questionBank[topic].medium);
        } else if (difficulty === 'hard') {
            difficultySets.push(questionBank[topic].medium);
        }
        
        // Add questions to the selection pool
        for (const set of difficultySets) {
            if (set) selectedQuestions.push(...set);
        }
    }
    
    // Shuffle the questions
    const shuffled = shuffleArray(selectedQuestions);
    
    // Take the required number of questions
    const finalQuestions = shuffled.slice(0, numQuestions);
    
    // Assign points based on difficulty
    finalQuestions.forEach(q => {
        if (q.difficulty === 'easy' || !q.difficulty) {
            q.points = 1;
        } else if (q.difficulty === 'medium') {
            q.points = 2;
        } else if (q.difficulty === 'hard') {
            q.points = 3;
        }
    });
    
    // Create the quiz object
    const quiz = {
        id: generateId(),
        title,
        description,
        difficulty,
        topics,
        questions: finalQuestions,
        totalScore: finalQuestions.reduce((sum, q) => sum + (q.points || 1), 0),
        passingScore: 70,
        shuffleQuestions: true,
        shuffleOptions: true,
        feedback: [
            { min: 0, max: 50, message: "You need to study more probability concepts." },
            { min: 51, max: 70, message: "You're getting there! Review the areas you struggled with." },
            { min: 71, max: 90, message: "Good job! You have a solid understanding of probability." },
            { min: 91, max: 100, message: "Excellent! You've mastered these probability concepts." }
        ],
        created: new Date().toISOString()
    };
    
    return quiz;
}

/**
 * Export all quiz engine functions
 */
export {
    loadQuiz,
    initQuiz,
    getCurrentQuestion,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    jumpToQuestion,
    completeQuiz,
    enterReviewMode,
    exitReviewMode,
    getQuizState,
    saveQuizResults,
    getQuizHistory,
    clearQuizHistory,
    generateProbabilityQuiz
};