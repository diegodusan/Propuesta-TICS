/**
 * Base de datos del juego.
 * Estructura: Array de Módulos. Cada módulo tiene un título, un ícono y un array de niveles (preguntas).
 */
const gameData = [
    {
        id: "modulo-1",
        title: "Señales de Tránsito",
        icon: "🚦",
        levels: [
            { emoji: "🛑", correct: ["El", "auto", "debe", "parar"], traps: ["hauto", "deve"] },
            { emoji: "🚸", correct: ["Hay", "niños", "en", "la", "vía"], traps: ["Ay", "bia"] },
            { emoji: "🚦", correct: ["Luz", "roja", "significa", "alto"], traps: ["Lus", "roha"] },
            { emoji: "🚲", correct: ["Cuidado", "con", "las", "bicicletas"], traps: ["Kuidao", "vizicicletas"] },
            { emoji: "🚶", correct: ["Camina", "por", "la", "acera"], traps: ["hasera", "Kamina"] },
            { emoji: "⬇️", correct: ["Velocidad", "máxima", "muy", "baja"], traps: ["vaja", "Velosidad"] },
            { emoji: "⚠️", correct: ["Aviso", "de", "peligro", "cerca"], traps: ["Abiso", "peligru"] },
            { emoji: "🚳", correct: ["Prohibido", "pasear", "en", "bici"], traps: ["Proivido", "vici"] }
        ]
    },
    {
        id: "modulo-2",
        title: "Textos Instructivos",
        icon: "📋",
        levels: [
            { emoji: "🧼", correct: ["Lava", "tus", "manos", "bien"], traps: ["Laba", "vus"] },
            { emoji: "🪥", correct: ["Cepilla", "tus", "dientes", "hoy"], traps: ["Sepilla", "oy"] },
            { emoji: "🧸", correct: ["Arma", "el", "juguete", "nuevo"], traps: ["Harma", "juguete"] },
            { emoji: "📖", correct: ["Lee", "las", "reglas", "antes"], traps: ["Le", "hantes"] },
            { emoji: "📝", correct: ["Escribe", "tu", "nombre", "aquí"], traps: ["Eskribe", "akí"] },
            { emoji: "🗑️", correct: ["Bota", "la", "basura", "allí"], traps: ["Vota", "vasura"] },
            { emoji: "✂️", correct: ["Corta", "el", "papel", "suavemente"], traps: ["Korta", "suabemente"] },
            { emoji: "🥣", correct: ["Mezcla", "todo", "en", "el", "plato"], traps: ["Mescla", "todo"] }
        ]
    },
    {
        id: "modulo-3",
        title: "Relatos Mitológicos",
        icon: "👻",
        levels: [
            { emoji: "🎩", correct: ["La", "leyenda", "es", "mágica"], traps: ["leyemda", "majica"] },
            { emoji: "👻", correct: ["El", "fantasma", "asusta", "mucho"], traps: ["famtasma", "asuzta"] },
            { emoji: "🐉", correct: ["Un", "dragón", "escupe", "fuego"], traps: ["dragon", "fuegoo"] },
            { emoji: "🧙", correct: ["Hizo", "un", "hechizo", "secreto"], traps: ["Izo", "echizo"] },
            { emoji: "🌕", correct: ["Aullaba", "a", "la", "luna", "llena"], traps: ["Aullaba", "yena"] },
            { emoji: "🧚", correct: ["Un", "hada", "vuela", "alto"], traps: ["ada", "buela"] },
            { emoji: "🧜‍♀️", correct: ["Sirena", "nada", "en", "el", "mar"], traps: ["Zirena", "mar"] },
            { emoji: "🔥", correct: ["El", "mito", "del", "gran", "fuego"], traps: ["mito", "fuego"] }
        ]
    }
];
