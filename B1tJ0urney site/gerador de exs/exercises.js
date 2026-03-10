// exercises-script.js
// Gerador de Exercícios Interativo - BitJourney

// Banco de perguntas - FÁCIL DE EDITAR E EXPANDIR
const questionDatabase = {
    webdev: [
        {
            pergunta: "O que significa HTML?",
            opcoes: [
                "Hyper Text Markup Language",
                "High Tech Modern Language",
                "Hyper Transfer Markup Language",
                "Home Tool Markup Language"
            ],
            respostaCorreta: 0,
            dificuldade: "easy",
            dica: "É a linguagem base para estruturar conteúdo web",
            explicacao: "HTML significa Hyper Text Markup Language, a linguagem fundamental para criar páginas web."
        },
        {
            pergunta: "Qual tag HTML é usada para criar um link?",
            opcoes: ["<link>", "<a>", "<href>", "<url>"],
            respostaCorreta: 1,
            dificuldade: "easy",
            dica: "É uma das tags mais comuns em HTML",
            explicacao: "A tag <a> (anchor) é usada para criar hiperlinks em documentos HTML."
        },
        {
            pergunta: "Qual propriedade CSS é usada para mudar a cor do texto?",
            opcoes: ["text-color", "font-color", "color", "text-style"],
            respostaCorreta: 2,
            dificuldade: "easy",
            dica: "É uma propriedade muito básica do CSS",
            explicacao: "A propriedade 'color' define a cor do texto em CSS."
        },
        {
            pergunta: "O que é JavaScript?",
            opcoes: [
                "Uma linguagem de marcação",
                "Uma linguagem de programação",
                "Um tipo de framework CSS",
                "Um servidor de banco de dados"
            ],
            respostaCorreta: 1,
            dificuldade: "easy",
            dica: "Adiciona interatividade às páginas web",
            explicacao: "JavaScript é uma linguagem de programação que permite criar conteúdo dinâmico em páginas web."
        }
    ],
    cybersecurity: [
        {
            pergunta: "O que é phishing?",
            opcoes: [
                "Um tipo de pesca digital",
                "Ataque que usa engenharia social para obter informações",
                "Um protocolo de segurança",
                "Tipo de firewall"
            ],
            respostaCorreta: 1,
            dificuldade: "medium",
            dica: "Envolve tentativas de enganar pessoas",
            explicacao: "Phishing é um ataque cibernético que usa disfarces fraudulentos (como emails falsos) para obter informações sensíveis."
        },
        {
            pergunta: "Qual destes é um exemplo de autenticação de dois fatores?",
            opcoes: [
                "Apenas senha",
                "Senha + Pergunta de segurança",
                "Senha + Código enviado por SMS",
                "Apenas biometria"
            ],
            respostaCorreta: 2,
            dificuldade: "medium",
            dica: "Combina algo que você sabe com algo que você tem",
            explicacao: "A autenticação de dois fatores combina algo que você sabe (senha) com algo que você tem (código do celular)."
        },
        {
            pergunta: "O que é um firewall?",
            opcoes: [
                "Sistema de aquecimento",
                "Sistema de segurança que controla tráfego de rede",
                "Tipo de vírus",
                "Protocolo de internet"
            ],
            respostaCorreta: 1,
            dificuldade: "easy",
            dica: "Age como uma barreira de proteção",
            explicacao: "Firewall é um sistema de segurança que monitora e controla o tráfego de rede com base em regras de segurança."
        }
    ],
    datascience: [
        {
            pergunta: "O que é Python frequentemente usado em Data Science?",
            opcoes: [
                "Porque é a linguagem mais rápida",
                "Por suas bibliotecas como Pandas e NumPy",
                "Porque é a mais antiga",
                "Porque só funciona em Windows"
            ],
            respostaCorreta: 1,
            dificuldade: "medium",
            dica: "Tem bibliotecas especializadas para análise de dados",
            explicacao: "Python é popular em Data Science devido a bibliotecas poderosas como Pandas, NumPy e Scikit-learn."
        },
        {
            pergunta: "O que é machine learning?",
            opcoes: [
                "Aprendizado de máquinas industriais",
                "Sistema que permite computadores aprenderem com dados",
                "Manutenção de hardware",
                "Programação de robôs"
            ],
            respostaCorreta: 1,
            dificuldade: "medium",
            dica: "Subárea da inteligência artificial",
            explicacao: "Machine Learning é um subcampo da IA que permite sistemas aprenderem e melhorarem com experiência sem serem explicitamente programados."
        }
    ],
    ai: [
        {
            pergunta: "O que é uma rede neural artificial?",
            opcoes: [
                "Sistema de cabos neurais",
                "Modelo inspirado no cérebro humano",
                "Tipo de banco de dados",
                "Protocolo de comunicação"
            ],
            respostaCorreta: 1,
            dificuldade: "hard",
            dica: "Inspirada em neurônios biológicos",
            explicacao: "Redes neurais artificiais são modelos computacionais inspirados no cérebro humano, usados para reconhecimento de padrões."
        },
        {
            pergunta: "Qual empresa criou o ChatGPT?",
            opcoes: ["Google", "Microsoft", "OpenAI", "Facebook"],
            respostaCorreta: 2,
            dificuldade: "easy",
            dica: "Fundada por Elon Musk e outros",
            explicacao: "ChatGPT foi criado pela OpenAI, uma empresa de pesquisa em inteligência artificial."
        }
    ],
    mobiledev: [
        {
            pergunta: "Qual linguagem é usada para desenvolvimento iOS nativo?",
            opcoes: ["Java", "Swift", "Kotlin", "C#"],
            respostaCorreta: 1,
            dificuldade: "medium",
            dica: "Criada pela Apple",
            explicacao: "Swift é a linguagem de programação desenvolvida pela Apple para desenvolvimento iOS e macOS."
        },
        {
            pergunta: "O que é React Native?",
            opcoes: [
                "Um sistema operacional móvel",
                "Framework para desenvolvimento mobile multiplataforma",
                "Linguagem de programação",
                "Tipo de banco de dados móvel"
            ],
            respostaCorreta: 1,
            dificuldade: "medium",
            dica: "Desenvolvido pelo Facebook",
            explicacao: "React Native é um framework que permite desenvolver aplicativos móveis para iOS e Android usando JavaScript e React."
        }
    ],
    cloud: [
        {
            pergunta: "O que significa IaaS?",
            opcoes: [
                "Internet as a Service",
                "Infrastructure as a Service",
                "Integration as a Service",
                "Intelligence as a Service"
            ],
            respostaCorreta: 1,
            dificuldade: "medium",
            dica: "Um dos modelos de serviço em cloud computing",
            explicacao: "IaaS significa Infrastructure as a Service, onde provedores cloud oferecem infraestrutura fundamental como servidores virtuais."
        },
        {
            pergunta: "Qual destes é um serviço de cloud da Amazon?",
            opcoes: ["Azure", "Google Cloud", "AWS", "IBM Cloud"],
            respostaCorreta: 2,
            dificuldade: "easy",
            dica: "Maior provedor de cloud atualmente",
            explicacao: "AWS (Amazon Web Services) é a plataforma de cloud computing da Amazon."
        }
    ]
};

// Variáveis de estado global
let currentExercise = {
    theme: 'all',
    difficulty: 'easy',
    questions: [],
    currentQuestionIndex: 0,
    userAnswers: [],
    score: 0,
    startTime: null,
    timePerQuestion: []
};

// Elementos DOM principais
const themeSelect = document.getElementById('theme-select');
const difficultyOptions = document.querySelectorAll('.difficulty-option');
const questionQty = document.getElementById('question-qty');
const qtySlider = document.getElementById('qty-slider');
const generateBtn = document.getElementById('generate-exercise');
const loadingBar = document.getElementById('loading-bar');
const exerciseArea = document.getElementById('exercise-area');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const questionNumber = document.getElementById('q-number');
const totalQuestionsDisplay = document.getElementById('total-questions-display');
const currentQuestionDisplay = document.getElementById('current-question');
const progressFill = document.getElementById('progress-fill');
const submitBtn = document.getElementById('submit-btn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const hintBtn = document.getElementById('hint-btn');
const feedbackContainer = document.getElementById('feedback-container');
const correctFeedback = document.querySelector('.correct-feedback');
const incorrectFeedback = document.querySelector('.incorrect-feedback');
const correctExplanation = document.getElementById('correct-explanation');
const incorrectExplanation = document.getElementById('incorrect-explanation');
const correctAnswerSpan = document.getElementById('correct-answer');
const resultsCard = document.getElementById('results-card');
const finalScore = document.getElementById('final-score');
const performanceText = document.getElementById('performance-text');
const resultsTheme = document.getElementById('results-theme');
const resultsDifficulty = document.getElementById('results-difficulty');
const correctCountElem = document.querySelector('.correct-count');
const incorrectCountElem = document.querySelector('.incorrect-count');
const avgTimeElem = document.getElementById('avg-time');
const retryBtn = document.getElementById('retry-btn');
const newExerciseBtn = document.getElementById('new-exercise-btn');
const shareBtn = document.getElementById('share-btn');
const closeResults = document.getElementById('close-results');
const timerElement = document.getElementById('timer');
const currentThemeDisplay = document.getElementById('current-theme');
const currentDifficultyDisplay = document.getElementById('current-difficulty');
const toggleDatabase = document.getElementById('toggle-database');
const databaseContent = document.getElementById('database-content');

// Contadores de perguntas por tema para o painel de desenvolvedor
const dbCounters = {
    'webdev': document.getElementById('db-webdev'),
    'cybersecurity': document.getElementById('db-cybersecurity'),
    'datascience': document.getElementById('db-datascience'),
    'ai': document.getElementById('db-ai'),
    'mobiledev': document.getElementById('db-mobiledev'),
    'cloud': document.getElementById('db-cloud')
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    initExerciseGenerator();
    updateDatabaseStats();
    setupEventListeners();
});

function initExerciseGenerator() {
    // Atualizar contadores de estatísticas
    updateTotalQuestionsCount();
    updateUserScore();
    
    // Configurar tema selecionado
    themeSelect.addEventListener('change', function() {
        document.getElementById('selected-theme-name').textContent = 
            this.options[this.selectedIndex].text;
        currentExercise.theme = this.value;
    });
    
    // Configurar dificuldade
    difficultyOptions.forEach(option => {
        option.addEventListener('click', function() {
            difficultyOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            currentExercise.difficulty = this.dataset.level;
            currentDifficultyDisplay.textContent = 
                this.dataset.level === 'easy' ? 'Fácil' : 
                this.dataset.level === 'medium' ? 'Médio' : 'Difícil';
            currentDifficultyDisplay.className = 'info-tag difficulty-tag ' + this.dataset.level;
        });
    });
    
    // Configurar quantidade
    qtySlider.addEventListener('input', function() {
        questionQty.value = this.value;
    });
    
    document.getElementById('increase-qty').addEventListener('click', function() {
        let current = parseInt(questionQty.value);
        if (current < 20) {
            questionQty.value = current + 1;
            qtySlider.value = current + 1;
        }
    });
    
    document.getElementById('decrease-qty').addEventListener('click', function() {
        let current = parseInt(questionQty.value);
        if (current > 1) {
            questionQty.value = current - 1;
            qtySlider.value = current - 1;
        }
    });
    
    // Botão de gerar exercício
    generateBtn.addEventListener('click', generateNewExercise);
    
    // Configurar botão de alternar banco de dados
    toggleDatabase.addEventListener('click', function() {
        databaseContent.classList.toggle('active');
        this.classList.toggle('active');
        this.querySelector('i').classList.toggle('fa-chevron-down');
        this.querySelector('i').classList.toggle('fa-chevron-up');
    });
}

function setupEventListeners() {
    // Navegação de questões
    prevBtn.addEventListener('click', showPreviousQuestion);
    nextBtn.addEventListener('click', showNextQuestion);
    submitBtn.addEventListener('click', submitAnswer);
    hintBtn.addEventListener('click', showHint);
    
    // Resultados
    retryBtn.addEventListener('click', retrySameExercise);
    newExerciseBtn.addEventListener('click', generateNewExercise);
    closeResults.addEventListener('click', () => resultsCard.style.display = 'none');
    shareBtn.addEventListener('click', shareResults);
    
    // Compartilhamento personalizado
    document.getElementById('share-btn').addEventListener('click', shareResults);
}

function updateDatabaseStats() {
    // Atualizar contadores de perguntas por tema
    for (const theme in dbCounters) {
        if (questionDatabase[theme]) {
            dbCounters[theme].textContent = questionDatabase[theme].length;
        } else {
            dbCounters[theme].textContent = '0';
        }
    }
}

function updateTotalQuestionsCount() {
    let total = 0;
    for (const theme in questionDatabase) {
        total += questionDatabase[theme].length;
    }
    document.getElementById('total-questions').textContent = total;
}

function updateUserScore() {
    const savedScore = localStorage.getItem('bitjourney_exercise_score') || 0;
    document.getElementById('user-score').textContent = savedScore;
}

// Função principal para gerar novo exercício
function generateNewExercise() {
    const qty = parseInt(questionQty.value);
    const theme = currentExercise.theme;
    const difficulty = currentExercise.difficulty;
    
    // Mostrar animação de carregamento
    loadingBar.style.display = 'block';
    const loadingProgress = loadingBar.querySelector('.loading-progress');
    loadingProgress.style.width = '0%';
    
    // Simular carregamento progressivo
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += 10;
        loadingProgress.style.width = progress + '%';
        if (progress >= 100) {
            clearInterval(loadingInterval);
            loadingBar.style.display = 'none';
            actuallyGenerateExercise(qty, theme, difficulty);
        }
    }, 50);
}

function actuallyGenerateExercise(qty, theme, difficulty) {
    // Resetar estado do exercício
    currentExercise = {
        theme: theme,
        difficulty: difficulty,
        questions: [],
        currentQuestionIndex: 0,
        userAnswers: new Array(qty).fill(null),
        score: 0,
        startTime: new Date(),
        timePerQuestion: new Array(qty).fill(0)
    };
    
    // Filtrar perguntas com base no tema e dificuldade
    let filteredQuestions = [];
    
    if (theme === 'all') {
        // Combinar todas as perguntas de todos os temas
        for (const t in questionDatabase) {
            filteredQuestions = filteredQuestions.concat(
                questionDatabase[t].filter(q => q.dificuldade === difficulty)
            );
        }
    } else {
        // Filtrar apenas do tema selecionado
        filteredQuestions = questionDatabase[theme].filter(q => q.dificuldade === difficulty);
    }
    
    // Selecionar aleatoriamente as perguntas
    if (filteredQuestions.length < qty) {
        // Se não há perguntas suficientes, usar todas disponíveis
        currentExercise.questions = [...filteredQuestions];
        alert(`Apenas ${filteredQuestions.length} perguntas disponíveis para esta combinação.`);
    } else {
        // Embaralhar e pegar as primeiras 'qty' perguntas
        currentExercise.questions = shuffleArray([...filteredQuestions]).slice(0, qty);
    }
    
    // Atualizar interface
    currentThemeDisplay.textContent = 
        theme === 'all' ? 'Todos os Temas' : 
        theme === 'webdev' ? 'Web Development' :
        theme === 'cybersecurity' ? 'Cybersecurity' :
        theme === 'datascience' ? 'Data Science' :
        theme === 'ai' ? 'Inteligência Artificial' :
        theme === 'mobiledev' ? 'Mobile Development' : 'Cloud Computing';
    
    totalQuestionsDisplay.textContent = currentExercise.questions.length;
    questionNumber.textContent = '1';
    currentQuestionDisplay.textContent = '1';
    progressFill.style.width = '0%';
    
    // Ativar controles
    submitBtn.disabled = false;
    prevBtn.disabled = true;
    nextBtn.disabled = currentExercise.questions.length <= 1;
    hintBtn.disabled = false;
    
    // Esconder feedback e resultados
    feedbackContainer.style.display = 'none';
    resultsCard.style.display = 'none';
    
    // Mostrar primeira pergunta
    displayQuestion(0);
    
    // Iniciar timer para a primeira pergunta
    startQuestionTimer();
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function displayQuestion(index) {
    if (index < 0 || index >= currentExercise.questions.length) return;
    
    const question = currentExercise.questions[index];
    currentExercise.currentQuestionIndex = index;
    
    // Atualizar número da pergunta
    questionNumber.textContent = index + 1;
    currentQuestionDisplay.textContent = index + 1;
    
    // Atualizar barra de progresso
    const progress = ((index) / currentExercise.questions.length) * 100;
    progressFill.style.width = progress + '%';
    
    // Atualizar controles de navegação
    prevBtn.disabled = index === 0;
    nextBtn.disabled = index === currentExercise.questions.length - 1;
    
    // Mostrar pergunta
    questionText.textContent = question.pergunta;
    
    // Mostrar dica (se disponível)
    document.getElementById('question-hint').textContent = question.dica || "Não há dica disponível para esta pergunta.";
    
    // Limpar opções anteriores
    optionsContainer.innerHTML = '';
    
    // Adicionar animação de digitação
    questionText.classList.add('typing-effect');
    setTimeout(() => {
        questionText.classList.remove('typing-effect');
    }, 1000);
    
    // Criar opções de resposta
    question.opcoes.forEach((opcao, i) => {
        const optionElement = document.createElement('div');
        optionElement.className = 'option';
        if (currentExercise.userAnswers[index] === i) {
            optionElement.classList.add('selected');
        }
        
        optionElement.innerHTML = `
            <div class="option-label">${String.fromCharCode(65 + i)}</div>
            <div class="option-text">${opcao}</div>
            <div class="option-check">
                ${i === question.respostaCorreta ? '<i class="fas fa-check"></i>' : ''}
            </div>
        `;
        
        optionElement.addEventListener('click', () => selectOption(i));
        optionsContainer.appendChild(optionElement);
    });
    
    // Resetar timer
    resetQuestionTimer();
    startQuestionTimer();
}

function selectOption(optionIndex) {
    const currentIndex = currentExercise.currentQuestionIndex;
    
    // Desmarcar opção anterior
    document.querySelectorAll('.option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Marcar nova opção
    const selectedOption = document.querySelectorAll('.option')[optionIndex];
    selectedOption.classList.add('selected');
    
    // Salvar resposta do usuário
    currentExercise.userAnswers[currentIndex] = optionIndex;
}

function submitAnswer() {
    const currentIndex = currentExercise.currentQuestionIndex;
    const question = currentExercise.questions[currentIndex];
    const userAnswer = currentExercise.userAnswers[currentIndex];
    
    if (userAnswer === null) {
        alert('Por favor, selecione uma resposta antes de submeter.');
        return;
    }
    
    // Parar timer para esta pergunta
    stopQuestionTimer();
    
    // Calcular tempo gasto
    const timeSpent = 60 - parseInt(timerElement.textContent);
    currentExercise.timePerQuestion[currentIndex] = timeSpent;
    
    // Verificar resposta
    const isCorrect = userAnswer === question.respostaCorreta;
    
    // Mostrar feedback
    feedbackContainer.style.display = 'block';
    
    if (isCorrect) {
        correctFeedback.style.display = 'flex';
        incorrectFeedback.style.display = 'none';
        correctExplanation.textContent = question.explicacao;
        currentExercise.score++;
    } else {
        correctFeedback.style.display = 'none';
        incorrectFeedback.style.display = 'flex';
        incorrectExplanation.textContent = question.explicacao;
        correctAnswerSpan.textContent = question.opcoes[question.respostaCorreta];
    }
    
    // Mostrar opções corretas/incorretas
    document.querySelectorAll('.option').forEach((option, i) => {
        if (i === question.respostaCorreta) {
            option.classList.add('correct');
        } else if (i === userAnswer && !isCorrect) {
            option.classList.add('incorrect');
        }
        option.style.pointerEvents = 'none'; // Desabilitar mais cliques
    });
    
    // Atualizar pontuação
    updateUserScoreDisplay();
    
    // Se for a última pergunta, mostrar resultados
    if (currentIndex === currentExercise.questions.length - 1) {
        setTimeout(showResults, 2000);
    }
}

function showHint() {
    const currentIndex = currentExercise.currentQuestionIndex;
    const question = currentExercise.questions[currentIndex];
    
    // Destacar a área de dica
    const hintElement = document.querySelector('.question-hint');
    hintElement.style.animation = 'pulse 1s 3';
    
    // Temporariamente mostrar a dica em um tooltip
    alert(`Dica: ${question.dica}`);
}

function showPreviousQuestion() {
    if (currentExercise.currentQuestionIndex > 0) {
        displayQuestion(currentExercise.currentQuestionIndex - 1);
        feedbackContainer.style.display = 'none';
        
        // Restaurar seleção anterior se existir
        const prevAnswer = currentExercise.userAnswers[currentExercise.currentQuestionIndex - 1];
        if (prevAnswer !== null) {
            document.querySelectorAll('.option').forEach((option, i) => {
                if (i === prevAnswer) {
                    option.classList.add('selected');
                }
            });
        }
    }
}

function showNextQuestion() {
    if (currentExercise.currentQuestionIndex < currentExercise.questions.length - 1) {
        displayQuestion(currentExercise.currentQuestionIndex + 1);
        feedbackContainer.style.display = 'none';
        
        // Restaurar seleção anterior se existir
        const nextAnswer = currentExercise.userAnswers[currentExercise.currentQuestionIndex + 1];
        if (nextAnswer !== null) {
            document.querySelectorAll('.option').forEach((option, i) => {
                if (i === nextAnswer) {
                    option.classList.add('selected');
                }
            });
        }
    }
}

// Funções do Timer
let timerInterval;
function startQuestionTimer() {
    let timeLeft = 60;
    timerElement.textContent = timeLeft;
    
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        
        // Mudar cor quando o tempo estiver acabando
        if (timeLeft <= 10) {
            timerElement.parentElement.style.background = 'rgba(239, 68, 68, 0.3)';
            timerElement.parentElement.style.borderColor = 'rgba(239, 68, 68, 0.7)';
        }
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            // Submeter automaticamente resposta vazia
            if (currentExercise.userAnswers[currentExercise.currentQuestionIndex] === null) {
                currentExercise.userAnswers[currentExercise.currentQuestionIndex] = -1; // Nenhuma resposta
                submitAnswer();
            }
        }
    }, 1000);
}

function resetQuestionTimer() {
    clearInterval(timerInterval);
    timerElement.parentElement.style.background = '';
    timerElement.parentElement.style.borderColor = '';
}

function stopQuestionTimer() {
    clearInterval(timerInterval);
}

function showResults() {
    // Calcular pontuação final
    const totalQuestions = currentExercise.questions.length;
    const percentage = Math.round((currentExercise.score / totalQuestions) * 100);
    
    // Atualizar elementos de resultados
    finalScore.textContent = percentage;
    correctCountElem.textContent = currentExercise.score;
    incorrectCountElem.textContent = totalQuestions - currentExercise.score;
    
    // Determinar desempenho
    let performance = '';
    if (percentage >= 90) performance = 'Excelente! 🏆';
    else if (percentage >= 70) performance = 'Bom! 👍';
    else if (percentage >= 50) performance = 'Regular 👌';
    else performance = 'Precisa praticar mais 📚';
    
    performanceText.textContent = performance;
    resultsTheme.textContent = currentThemeDisplay.textContent;
    resultsDifficulty.textContent = currentDifficultyDisplay.textContent;
    
    // Calcular tempo médio
    const totalTime = currentExercise.timePerQuestion.reduce((a, b) => a + b, 0);
    const avgTime = Math.round(totalTime / totalQuestions);
    avgTimeElem.textContent = avgTime + 's';
    
    // Animar círculo de pontuação
    const scoreCircle = document.querySelector('.score-circle');
    scoreCircle.style.background = `conic-gradient(var(--exercise-accent) ${percentage}%, transparent ${percentage}%)`;
    
    // Salvar pontuação no localStorage
    const currentTotal = parseInt(localStorage.getItem('bitjourney_exercise_score') || 0);
    localStorage.setItem('bitjourney_exercise_score', currentTotal + currentExercise.score);
    updateUserScore();
    
    // Mostrar card de resultados
    resultsCard.style.display = 'block';
    
    // Rolagem suave para resultados
    resultsCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function retrySameExercise() {
    // Reembaralhar as mesmas perguntas
    currentExercise.questions = shuffleArray([...currentExercise.questions]);
    currentExercise.currentQuestionIndex = 0;
    currentExercise.userAnswers = new Array(currentExercise.questions.length).fill(null);
    currentExercise.score = 0;
    currentExercise.startTime = new Date();
    currentExercise.timePerQuestion = new Array(currentExercise.questions.length).fill(0);
    
    // Esconder resultados e mostrar primeira pergunta
    resultsCard.style.display = 'none';
    displayQuestion(0);
}

function shareResults() {
    const percentage = Math.round((currentExercise.score / currentExercise.questions.length) * 100);
    const shareText = `Acabei de completar um exercício no BitJourney e obtive ${percentage}% de acerto! 🚀 Teste seus conhecimentos em tecnologia também: ${window.location.origin}`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Meu resultado no BitJourney',
            text: shareText,
            url: window.location.href
        });
    } else {
        // Fallback para copiar para área de transferência
        navigator.clipboard.writeText(shareText).then(() => {
            alert('Resultado copiado para a área de transferência! Cole nas suas redes sociais.');
        });
    }
}

// Função para desenvolvedores adicionarem novas perguntas
function addNewQuestion(theme, questionData) {
    if (!questionDatabase[theme]) {
        questionDatabase[theme] = [];
    }
    
    questionDatabase[theme].push(questionData);
    updateDatabaseStats();
    updateTotalQuestionsCount();
    
    console.log(`Nova pergunta adicionada ao tema ${theme}. Total: ${questionDatabase[theme].length}`);
}

// Exemplo de como adicionar uma nova pergunta (para desenvolvedores):
/*
addNewQuestion('webdev', {
    pergunta: "Qual framework JavaScript é mantido pelo Facebook?",
    opcoes: ["Angular", "Vue.js", "React", "Svelte"],
    respostaCorreta: 2,
    dificuldade: "easy",
    dica: "É conhecido por sua virtual DOM",
    explicacao: "React é um framework JavaScript mantido pelo Facebook, muito popular para construir interfaces de usuário."
});
*/

// Exportar funções para uso no console (apenas desenvolvimento)
if (typeof window !== 'undefined') {
    window.BitJourneyExercises = {
        questionDatabase,
        currentExercise,
        addNewQuestion,
        generateNewExercise,
        updateDatabaseStats
    };
}