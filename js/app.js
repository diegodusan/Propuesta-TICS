// Variables de Estado
let currentModuleIndex = 0;
let currentQuestionIndex = 0;
let score = 0;
let consecutiveWins = 0;
let sortableBank = null;
let sortableSlots = []; // Array de instancias sortable para cada casilla

// Elementos DOM
const moduleTitle = document.getElementById('module-title');
const visualCue = document.getElementById('visual-cue');
const instructorText = document.getElementById('instructor-text');
const constructionZone = document.getElementById('construction-zone');
const wordBank = document.getElementById('word-bank');
const checkBtn = document.getElementById('check-btn');
const scoreDisplay = document.getElementById('score-display');
const progressBar = document.getElementById('progress-bar');
const moduleIndicators = document.getElementById('module-indicators');
const mainArea = document.querySelector('main');

// Audios
const sfxSuccess = document.getElementById('sfx-success');
const sfxError = document.getElementById('sfx-error');
const sfxModule = document.getElementById('sfx-module');
const sfxStreak = document.getElementById('sfx-streak');

// Inicialización
function initGame() {
    const savedData = localStorage.getItem('misionTransitoSave');
    if (savedData) {
        const parsed = JSON.parse(savedData);
        currentModuleIndex = parsed.currentModuleIndex || 0;
        currentQuestionIndex = parsed.currentQuestionIndex || 0;
        score = parsed.score || 0;
        
        if (currentModuleIndex >= gameData.length) {
            // Juego terminado
            currentModuleIndex = 0;
            currentQuestionIndex = 0;
            score = 0;
        }
    }
    
    updateScoreUI();
    renderModuleIndicators();
    loadQuestion();

    // Evento de validación
    checkBtn.addEventListener('click', validateAnswer);
}

function saveProgress() {
    const data = { currentModuleIndex, currentQuestionIndex, score };
    localStorage.setItem('misionTransitoSave', JSON.stringify(data));
}

function updateScoreUI() {
    scoreDisplay.innerText = score;
    
    // Actualizar barra de progreso del módulo actual
    const currentModule = gameData[currentModuleIndex];
    if (currentModule) {
        const progressPercentage = (currentQuestionIndex / currentModule.levels.length) * 100;
        progressBar.style.width = `${progressPercentage}%`;
    }
}

function renderModuleIndicators() {
    moduleIndicators.innerHTML = '';
    gameData.forEach((mod, index) => {
        const star = document.createElement('span');
        if (index < currentModuleIndex) {
            star.innerText = '⭐'; // Completado
            star.title = mod.title;
        } else if (index === currentModuleIndex) {
            star.innerText = '🌟'; // Actual
            star.className = 'floating';
            star.title = mod.title;
        } else {
            star.innerText = '★'; // Pendiente
            star.className = 'text-gray-300';
            star.title = mod.title;
        }
        moduleIndicators.appendChild(star);
    });
}

function loadQuestion() {
    const module = gameData[currentModuleIndex];
    const question = module.levels[currentQuestionIndex];
    
    // UI Updates
    moduleTitle.innerText = `Módulo ${currentModuleIndex + 1}: ${module.title}`;
    
    // Animación del Emoji Visual o Imagen
    visualCue.style.transform = 'scale(0)';
    setTimeout(() => {
        if (question.image) {
            visualCue.innerHTML = `<img src="${question.image}" alt="Señal" class="h-32 object-contain drop-shadow-md mx-auto">`;
            visualCue.classList.remove('text-8xl', 'sm:text-9xl'); // Quitar clases de texto grande si es imagen
        } else {
            visualCue.innerHTML = question.emoji;
            visualCue.classList.add('text-8xl', 'sm:text-9xl');
        }
        visualCue.style.transform = 'scale(1.2)';
        setTimeout(() => visualCue.style.transform = 'scale(1)', 200);
    }, 200);

    instructorText.innerText = "¡Arma la oración correcta!";
    instructorText.className = "text-sm font-bold text-gray-500";

    // Limpiar zonas
    constructionZone.innerHTML = '';
    wordBank.innerHTML = '';
    
    // Destruir instancias previas de Sortable si existen
    if(sortableBank) sortableBank.destroy();
    sortableSlots.forEach(s => s.destroy());
    sortableSlots = [];

    // Crear casillas (slots)
    for (let i = 0; i < question.correct.length; i++) {
        const slotEl = document.createElement('div');
        slotEl.className = 'slot';
        slotEl.dataset.index = i;
        constructionZone.appendChild(slotEl);
        
        // Inicializar Sortable para este slot (solo acepta 1 elemento)
        const sortableSlot = new Sortable(slotEl, {
            group: 'shared',
            animation: 150,
            ghostClass: 'sortable-ghost',
            dragClass: 'sortable-drag',
            onAdd: function (evt) {
                // Si la casilla ya tiene un elemento (y no es el que se está arrastrando),
                // mover el elemento existente de vuelta al banco de palabras.
                const itemEl = evt.item;  // El elemento arrastrado
                const container = evt.to;    // El slot de destino
                
                // Si hay más de un hijo (la palabra nueva + una vieja)
                if (container.children.length > 1) {
                    // Encontrar el elemento que ya estaba ahí
                    Array.from(container.children).forEach(child => {
                        if (child !== itemEl) {
                            wordBank.appendChild(child);
                        }
                    });
                }
            }
        });
        sortableSlots.push(sortableSlot);
    }

    // Preparar y mezclar todas las palabras
    let allWords = [...question.correct, ...question.traps];
    allWords = allWords.sort(() => Math.random() - 0.5);

    allWords.forEach(wordText => {
        const wordEl = document.createElement('div');
        wordEl.className = 'word-card';
        wordEl.innerText = wordText;
        wordEl.dataset.word = wordText;
        wordBank.appendChild(wordEl);
    });

    // Inicializar Sortable para el banco de palabras
    sortableBank = new Sortable(wordBank, {
        group: 'shared',
        animation: 150,
        ghostClass: 'sortable-ghost',
        dragClass: 'sortable-drag'
    });
}

function validateAnswer() {
    const module = gameData[currentModuleIndex];
    const question = module.levels[currentQuestionIndex];
    
    // Animar botón
    checkBtn.classList.add('active-press');
    setTimeout(() => checkBtn.classList.remove('active-press'), 150);

    // Obtener elementos puestos en los slots en el orden correcto
    const slots = Array.from(constructionZone.children);
    let isComplete = true;
    let isCorrect = true;
    let wrongElements = [];

    slots.forEach((slot, index) => {
        if (slot.children.length === 0) {
            isComplete = false;
        } else {
            const wordEl = slot.children[0];
            const wordText = wordEl.dataset.word;
            if (wordText !== question.correct[index]) {
                isCorrect = false;
                wrongElements.push({ el: wordEl, slot: slot });
            }
        }
    });

    if (!isComplete) {
        instructorText.innerText = "¡Te faltan casillas por llenar!";
        instructorText.className = "text-sm font-bold text-accent";
        return;
    }

    if (isCorrect) {
        // ÉXITO
        score += 50;
        consecutiveWins++;
        
        if (consecutiveWins >= 2) {
            if(sfxStreak) sfxStreak.play().catch(e => {});
            visualCue.classList.add('streak-fire');
            instructorText.innerText = `¡Racha de ${consecutiveWins} aciertos! 🔥`;
        } else {
            if(sfxSuccess) sfxSuccess.play().catch(e => {});
            instructorText.innerText = "¡Excelente trabajo! 🎉";
            visualCue.classList.remove('streak-fire');
        }
        
        instructorText.className = "text-sm font-bold text-success";
        
        // Animar correctos
        slots.forEach(slot => {
            if(slot.children.length > 0) {
                slot.children[0].classList.add('success-anim');
            }
        });
        
        triggerConfetti();
        updateScoreUI();
        
        // Deshabilitar Drag mientras cambia
        if(sortableBank) sortableBank.options.disabled = true;
        sortableSlots.forEach(s => s.options.disabled = true);

        setTimeout(() => {
            currentQuestionIndex++;
            saveProgress();
            
            if (currentQuestionIndex >= module.levels.length) {
                // Siguiente módulo
                currentModuleIndex++;
                currentQuestionIndex = 0;
                consecutiveWins = 0;
                visualCue.classList.remove('streak-fire');
                saveProgress();
                
                if (currentModuleIndex < gameData.length) {
                    // Animación de transición de módulo
                    mainArea.classList.add('slide-out');
                    if(sfxModule) sfxModule.play().catch(e => {});
                    
                    setTimeout(() => {
                        mainArea.classList.remove('slide-out');
                        mainArea.classList.add('slide-in');
                        renderModuleIndicators();
                        triggerConfetti(true);
                        loadQuestion();
                        
                        setTimeout(() => {
                            mainArea.classList.remove('slide-in');
                        }, 600);
                    }, 600);
                } else {
                    showEndScreen();
                }
            } else {
                loadQuestion();
            }
        }, 1500);

    } else {
        // ERROR
        consecutiveWins = 0;
        visualCue.classList.remove('streak-fire');
        if(sfxError) sfxError.play().catch(e => {});
        
        instructorText.innerText = "¡Ups! Intenta de nuevo.";
        instructorText.className = "text-sm font-bold text-accent";
        
        wrongElements.forEach(item => {
            const el = item.el;
            el.classList.add('shake-error');
            
            setTimeout(() => {
                el.classList.remove('shake-error');
                // Devolver al banco
                wordBank.appendChild(el);
            }, 500);
        });
    }
}

function showEndScreen() {
    moduleTitle.innerText = "¡FELICITACIONES!";
    visualCue.innerText = "🏆";
    instructorText.innerText = "¡Completaste toda la aventura!";
    constructionZone.innerHTML = `<p class="text-3xl font-black text-primary text-center w-full">Tu puntaje final: ${score}</p>`;
    wordBank.innerHTML = '';
    checkBtn.style.display = 'none';
    progressBar.style.width = '100%';
    
    // Botón reiniciar
    const resetBtn = document.createElement('button');
    resetBtn.className = 'w-full btn-3d bg-secondary text-dark font-black text-2xl py-4 mt-6 border-b-[6px] border-yellow-600 mb-4';
    resetBtn.innerText = "Jugar de Nuevo";
    resetBtn.onclick = () => {
        localStorage.removeItem('misionTransitoSave');
        location.reload();
    };
    constructionZone.appendChild(resetBtn);
}

function triggerConfetti(massive = false) {
    const duration = massive ? 3000 : 1000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: massive ? 5 : 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#38bdf8', '#facc15', '#fb7185', '#4ade80']
        });
        confetti({
            particleCount: massive ? 5 : 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#38bdf8', '#facc15', '#fb7185', '#4ade80']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

// Iniciar aplicación
document.addEventListener('DOMContentLoaded', initGame);
