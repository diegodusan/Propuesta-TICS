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

// Pantallas
const screenSelection = document.getElementById('screen-selection');
const screenLesson = document.getElementById('screen-lesson');
const screenGame = document.getElementById('screen-game');

// Selección
const moduleGrid = document.getElementById('module-grid');

// Lección
const lessonTitle = document.getElementById('lesson-title');
const lessonText = document.getElementById('lesson-text');
const lessonAnimal = document.getElementById('lesson-animal');
const btnStartGame = document.getElementById('btn-start-game');

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
        score = parsed.score || 0;
    }
    
    updateScoreUI();
    
    btnStartGame.addEventListener('click', startGameAfterLesson);
    checkBtn.addEventListener('click', validateAnswer);

    renderModuleSelection();
    showScreen('selection');
}

function showScreen(screenId) {
    screenSelection.classList.add('hidden');
    screenLesson.classList.add('hidden');
    screenGame.classList.add('hidden');

    if (screenId === 'selection') screenSelection.classList.remove('hidden');
    else if (screenId === 'lesson') screenLesson.classList.remove('hidden');
    else if (screenId === 'game') screenGame.classList.remove('hidden');
}

function renderModuleSelection() {
    moduleGrid.innerHTML = '';
    gameData.forEach((mod, index) => {
        const btn = document.createElement('div');
        btn.className = 'module-card';
        btn.innerHTML = `
            <div class="text-6xl mb-2">${mod.icon}</div>
            <h3 class="font-bold text-xl text-dark">${mod.title}</h3>
            <p class="text-sm text-gray-500 mt-2">Módulo ${index + 1}</p>
        `;
        btn.addEventListener('click', () => {
            if(sfxSuccess) sfxSuccess.play().catch(e=>{});
            startLesson(index);
        });
        moduleGrid.appendChild(btn);
    });
}

let currentUtterance = null;
let availableVoices = [];

// Intentar precargar voces
function loadVoices() {
    availableVoices = window.speechSynthesis.getVoices();
}
if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
}

function speakText(text, voiceParams = {}) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        currentUtterance = new SpeechSynthesisUtterance(text);
        
        currentUtterance.lang = 'es-ES'; // Idioma base
        currentUtterance.pitch = voiceParams.pitch !== undefined ? voiceParams.pitch : 1.0;
        currentUtterance.rate = voiceParams.rate !== undefined ? voiceParams.rate : 1.0;

        // Intentar seleccionar una voz diferente si el SO tiene varias en español
        if (availableVoices.length === 0) loadVoices(); 
        let esVoices = availableVoices.filter(v => v.lang.startsWith('es'));
        
        if (esVoices.length > 0) {
            let vIndex = voiceParams.voiceIndex || 0;
            // Asegurar que el índice no supere la cantidad de voces disponibles
            currentUtterance.voice = esVoices[vIndex % esVoices.length];
        }

        window.speechSynthesis.speak(currentUtterance);
    }
}

let lessonState = 'intro';

function startLesson(index, isOutro = false) {
    currentModuleIndex = index;
    const module = gameData[currentModuleIndex];
    lessonState = isOutro ? 'outro' : 'intro';
    
    if (!isOutro) {
        currentQuestionIndex = 0;
        lessonTitle.innerText = `${module.lesson.animalName} dice:`;
        lessonText.innerText = module.lesson.text;
        btnStartGame.innerText = "¡Vamos!";
        speakText(module.lesson.text, module.lesson.voiceParams);
    } else {
        lessonTitle.innerText = `¡Felicidades!`;
        lessonText.innerText = module.lesson.outroText;
        btnStartGame.innerText = "Volver al Menú";
        speakText(module.lesson.outroText, module.lesson.voiceParams);
    }
    
    lessonAnimal.innerText = module.lesson.animal;
    showScreen('lesson');
}

function startGameAfterLesson() {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
    }
    if (lessonState === 'outro') {
        showScreen('selection');
    } else {
        renderModuleIndicators();
        loadQuestion();
        showScreen('game');
    }
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
                // Módulo Terminado -> Mostrar Outro
                consecutiveWins = 0;
                visualCue.classList.remove('streak-fire');
                saveProgress();
                
                mainArea.classList.add('slide-out');
                if(sfxModule) sfxModule.play().catch(e => {});
                
                setTimeout(() => {
                    mainArea.classList.remove('slide-out');
                    triggerConfetti(true);
                    startLesson(currentModuleIndex, true);
                }, 600);
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
