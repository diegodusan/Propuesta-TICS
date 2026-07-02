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
            { image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Colombia_road_sign_SR-01.svg/512px-Colombia_road_sign_SR-01.svg.png", correct: ["El", "auto", "debe", "parar"], traps: ["hauto", "deve"] },
            { image: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Colombia_road_sign_SP-47.svg/512px-Colombia_road_sign_SP-47.svg.png", correct: ["Hay", "niños", "en", "la", "vía"], traps: ["Ay", "bia"] },
            { image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/Colombia_road_sign_SP-23.svg/512px-Colombia_road_sign_SP-23.svg.png", correct: ["Luz", "roja", "significa", "alto"], traps: ["Lus", "roha"] },
            { image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Colombia_road_sign_SR-02.svg/512px-Colombia_road_sign_SR-02.svg.png", correct: ["Ceda", "el", "paso", "al", "peatón"], traps: ["Seda", "peathon"] },
            { image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Colombia_road_sign_SR-03.svg/512px-Colombia_road_sign_SR-03.svg.png", correct: ["Sigue", "de", "frente", "solamente"], traps: ["Sige", "frennte"] },
            { image: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Colombia_road_sign_SR-30_%2830%29.svg/512px-Colombia_road_sign_SR-30_%2830%29.svg.png", correct: ["Velocidad", "máxima", "muy", "baja"], traps: ["vaja", "Velosidad"] },
            { image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Colombia_road_sign_SR-05.svg/512px-Colombia_road_sign_SR-05.svg.png", correct: ["Prohibido", "girar", "a", "la", "izquierda"], traps: ["Proivido", "hizquierda"] },
            { image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Colombia_road_sign_SR-04.svg/512px-Colombia_road_sign_SR-04.svg.png", correct: ["No", "pase", "por", "esta", "vía"], traps: ["pasee", "bía"] }
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
