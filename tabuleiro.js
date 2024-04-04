const TAMANHO_TABULEIRO = 10;
const alfabeto = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
const numeros = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let tiros = []; // Posições dos tiros

function gerarTabuleiro() {
    let count = 0;
    const tabuleiros = document.querySelectorAll('.tabuleiro');
    const numeros = document.querySelectorAll('.numeros');
    const letras =document.querySelectorAll('.letras');
    tabuleiros.forEach(tabuleiro => {
        if(tabuleiro.getAttribute('name') === 'tabuleiro2'){
                tabuleiro.addEventListener('click', function(event) {
                const celula = event.target;
                if (!celula.classList.contains('celula')){
                    return;
                }

                const linha = parseInt(celula.dataset.linha);
                const coluna = parseInt(celula.dataset.coluna);

                const resultado = verificarTiro(linha, coluna);

                marcarTiro(linha, coluna, resultado);
            });
        }
        for (let i = 0; i < TAMANHO_TABULEIRO; i++) {
            for (let j = 0; j < TAMANHO_TABULEIRO; j++) {
                if(j==0){
                    const number = document.createElement('p');
                    number.classList.add('numero');
                    number.textContent = `${i+1}`;
                    numeros[count].appendChild(number);

                }
                if(i==9){
                    const letter = document.createElement('p');
                    letter.classList.add('letra');
                    letter.textContent = `${alfabeto[j]}`;
                    letras[count].appendChild(letter);
                }
                const celula = document.createElement('div');
                celula.classList.add('celula');
                celula.dataset.linha = i;
                celula.dataset.coluna = j;

                tabuleiro.appendChild(celula);
            }
        }        
        count++;
    });
}
gerarTabuleiro();