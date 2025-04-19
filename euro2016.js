/**
 * Aplicações multimédia - Trabalho Prático 1
 * (c) Catarina Cruz, 2025
 *
 */

const game = {}; // encapsula a informação de jogo. Está vazio mas vai-se preenchendo com definições adicionais.

// sons do jogo
const sounds = {
    background: null,
    flip: null,
    success: null,
    hide: null,
};
// cartas do jogo
const character = [
    'alemanha.png',
    'belgica.png',
    'polonia.png',
    'portugal.png',
    'franca.png',
    'gales.png',
    'islandia.png',
    'italia.png',
    'euro.png'
];

// numero de linhas e colunas do tabuleiro;
const ROWS = 4;
const COLS = 4;

game.sounds = sounds; // Adicionar os sons sons do jogo ao objeto game.
game.board = Array(COLS)
    .fill()
    .map(() => Array(ROWS)); // criação do tabuleiro como um array de 6 linhas x 8 colunas

// Representa a imagem de uma carta de um país. Esta definição é apenas um modelo para outros objectos que sejam criados
// com esta base através de let umaFace = Object.create(face).
const face = {
    country: -1,
    x: -1,
    y: -1,
};

const CARDSIZE = 102; // tamanho da carta (altura e largura)
let faces = []; // Array que armazena objectos face que contêm posicionamentos da imagem e códigos dos paises

window.addEventListener("load", init, false);

function init() {
    game.stage = document.querySelector("#stage"); // Select the HTML element where the cards will be displayed
    setupAudio(); // Configure the audio
    getFaces(); // Calculate the faces and store them in the array
    createCountries(); // Create the cards and place them on the gameboard
    render(); // Render the cards on the gameboard
    hideCards(); // Hide the cards after a rendering
    flipCardFaces(); // Add the flip animation to the cards
}

const loadGame = () => {
    const charactersDuplos = [...character, ...character]; // Duplicar o array de cartas
    charactersDuplos.forEach(() => {
    const arrayBaralhado = charactersDuplos.sort(() => Math.random() - 0.5); // Embaralhar o array de cartas
    arrayBaralhado.forEach((character) => {
    const card = createCard(character); // Criar o elemento de carta
    board.appendChild(card);
    });
    });
}

const createCard = (character) => {
    const card = document.createElement('div');
    card.classList.add('carta'); // Add the 'carta' class

    const front = document.createElement('div');
    front.classList.add('face', 'frente'); // Add the 'face' and 'frente' classes
    front.style.backgroundImage = `url('./assets/oitavos/${character}')`; // Set the front image (emblem)

    const back = document.createElement('div');
    back.classList.add('face', 'verso'); // Add the 'face' and 'verso' classes
    back.style.backgroundImage = `url('./assets/oitavos/euro.png')`; // Set the back image

    card.appendChild(front); // Add the front to the card
    card.appendChild(back); // Add the back to the card

    card.addEventListener('click', () => {
        card.classList.toggle('virada'); // Flip the card on click
    });

    return card;
};
// Cria os paises e coloca-os no tabuleiro de jogo(array board[][])
	/*Seja umaCarta um elemento DIV, a imagem de carta pode ser obtida nos objetos armazenados no array faces[]; o verso da capa 
	está armazenado na ultima posicao do array faces[]. Pode também ser obtido através do seletor de classe .escondida do CSS.
		umaCarta.classList.add("carta"); 	
		umaCarta.style.backgroundPositionX=faces[0].x;
		umaCarta.style.backgroundPositionX=faces[0].y;
		Colocar uma carta escondida:
			umaCarta.classList.add("escondida");
			
		virar a carta:
			umaCarta.classList.remove("escondida");
    */
            function createCountries() {
                const shuffledCharacters = [...character, ...character].sort(() => Math.random() - 0.5); // Duplicate and shuffle the cards
            
                let index = 0; // Index to access the shuffled cards
                for (let i = 0; i < ROWS; i++) {
                    for (let j = 0; j < COLS; j++) {
                        const card = createCard(shuffledCharacters[index]); // Create a card
                        game.board[i][j] = card; // Place the card on the gameboard
                        index++; // Increment the index
                    }
                }
            }
      // Adicionar todas as cartas ao tabuleiro
  
      function hideCards() {
        const cards = document.querySelectorAll('.carta');
        setTimeout(() => {
            cards.forEach(card => {
                card.classList.add('escondida'); // Add a class to hide the cards
            });
        }, 3000); // Hide the cards after 3 seconds
    }

// ao clicar numa carta, esta tem de virar com uma animação e que não apareça com a face virada para cima instantâneamente
    /* Não Modificar esta função */
function flipCardFaces() {
        const flipCards = document.querySelectorAll('.carta'); // Seleciona todas as cartas
        flipCards.forEach(card => {
            card.addEventListener('click', function () {
                card.classList.toggle('virada'); // Adiciona ou remove a classe 'virada'
            });
        });
    }

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Adicionar as cartas do tabuleiro à stage
function render() {
    // Limpar o conteúdo anterior do stage
    game.stage.innerHTML = '';

    // Adicionar as cartas ao tabuleiro
    game.board.forEach(row => {
        row.forEach(umaCarta => {
            if (umaCarta) {
                game.stage.appendChild(umaCarta); // Adiciona a carta ao elemento stage
            }
        });
    });
}

// baralha as cartas no tabuleiro
function scramble() {
    // completar
    const flipCards = document.querySelectorAll('.carta');
    const cardsArray = Array.from(flipCards);
    // Embaralhar as cartas
    for(let i = 0; i < cardsArray.length; i++){
        const j = Math.floor(Math.random() * cardsArray.length);
        [cardsArray[i], cardsArray[j]] = [cardsArray[j], cardsArray[i]];
    }

    const parent = flipCards[0].parentNode;
    cardsArray.forEach(card => parent.appendChild(card));
}

function exemplo() {
    let o1 = { id: 1, pos: { x: 10, y: 20 } };
    let o2 = { id: 2, pos: { x: 1, y: 2 } };
    let aux = Object.assign({}, o1);

    o1.pos = Object.assign({}, o2.pos);

    let umaFace = Object.create(face);
    umaFace.novaProp = "asdasd";
}

function tempo() {
    let contador = 0;
    let maxCount = 60;

    let timeHandler = setInterval(() => {
        contador++;
        document.getElementById("time").value = contador;
        if (contador === maxCount - 5)
            document.getElementById("time").classList.add("warning");
        if (contador === maxCount) {
            clearInterval(timeHandler);
            document.getElementById("time").classList.remove("warning");
        }
    }, 1000);
}

/* ------------------------------------------------------------------------------------------------  
 ** /!\ NÃO MODIFICAR ESTAS FUNÇÕES /!\
-------------------------------------------------------------------------------------------------- */

// configuração do audio
function setupAudio() {
    game.sounds.background = document.querySelector("#backgroundSnd");
    game.sounds.success = document.querySelector("#successSnd");
    game.sounds.flip = document.querySelector("#flipSnd");
    game.sounds.hide = document.querySelector("#hideSnd");
    game.sounds.win = document.querySelector("#goalSnd");

    // definições de volume;
    game.sounds.background.volume = 0.05; // o volume varia entre 0 e 1

    // nesta pode-se mexer se for necessário acrescentar ou configurar mais sons
}

// calcula as coordenadas das imagens da selecao de cada país e atribui um código único
function getFaces() {
    /* NÂO MOFIFICAR ESTA FUNCAO */
    let offsetX = 1;
    let offsetY = 1;
    if (faces.length < (ROWS * COLS) / 2) {
        console.error("Número insuficiente de faces para criar pares de cartas.");
    
    for (let i = 0; i < 3; i++) {
        offsetX = 1;
        for (let j = 0; j < 3; j++) {
            let countryFace = Object.create(face); // criar um objeto com base no objeto face
            countryFace.x = -(j * CARDSIZE + offsetX) + "px"; // calculo da coordenada x na imagem
            countryFace.y = -(i * CARDSIZE + offsetY) + "px"; // calculo da coordenada y na imagem
            countryFace.country = "" + i + "" + j; // criação do código do país
            faces.push(countryFace); // guardar o objeto no array de faces
            offsetX += 2;
        
        }
        offsetY += 2;
    }
    }
}


/* ------------------------------------------------------------------------------------------------  
 ** /!\ NÃO MODIFICAR ESTAS FUNÇÕES /!\
-------------------------------------------------------------------------------------------------- */
