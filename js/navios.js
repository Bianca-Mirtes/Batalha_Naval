const dragItems = document.querySelectorAll('.drag');
const dropItems = document.querySelectorAll('.celula');
const btnResetMap = document.getElementById('reset_map');

let countCruzador = 3;
let countHidroAviao = 3;
let countEncouracado = 2;
let countSubmarino = 4;

let navios = new Set();
let naviosOp = new Set();

let countSlot = 13;

btnReady.disabled = true;

btnResetMap.addEventListener('click', () => {
    dropItems.forEach(navio => {
        navio.addEventListener('dragover', dragOver);
        navio.addEventListener( 'drop', dropEvent);
        navio.addEventListener('dragleave', dragLeave);
        navio.className = 'celula';
    });
    countCruzador = 3;
    countHidroAviao = 3;
    countEncouracado = 2;
    countSubmarino = 4;

    dragItems.forEach( navio => {
        navio.className = navio.id;
    });
});

// Drag events
dragItems.forEach(navio => {
    navio.addEventListener("dragstart", dragStart);
});

// Drop Events
dropItems.forEach(celula => {
    celula.addEventListener('dragover', dragOver);
    celula.addEventListener( 'drop', dropEvent);
    celula.addEventListener('dragleave', dragLeave);
});

function dragStart(e){
    e.dataTransfer.setData("text", e.target.className)
    setTimeout(() =>{
        this.className = 'invisible';
    }, 0);
}

function dragOver(e){
    e.preventDefault();
    this.className += ' enter';
}

function dragLeave(e){
    e.preventDefault();
    this.className = 'celula';
}

function dropEvent(e){
    e.preventDefault();

    const navioClass = e.dataTransfer.getData("text");
    const celula = document.querySelector(`.celula[data-linha="${this.dataset.linha}"][data-coluna="${this.dataset.coluna}"]`);
    
    celula.removeEventListener( 'dragover', dragOver);
    celula.removeEventListener('drop', dropEvent);
    celula.removeEventListener( 'dragleave', dragLeave);

    if(navioClass === "cruzadorD drag"){
        celula.classList.add('cruzador');
        let linha = parseInt(celula.dataset.linha);
        let coluna = parseInt(celula.dataset.coluna);
        navios.add({linha, coluna});
        if(coluna > 8){
            --coluna;
            const elem = document.querySelector(`.celula[data-linha="${linha}"][data-coluna="${coluna}"]`);
            elem.removeEventListener( 'dragover', dragOver);
            elem.removeEventListener('drop', dropEvent);
            elem.removeEventListener( 'dragleave', dragLeave);
            elem.classList.add('cruzador');
        }else{
            ++coluna;
            const elem = document.querySelector(`.celula[data-linha="${linha}"][data-coluna="${coluna}"]`);
            elem.removeEventListener( 'dragover', dragOver);
            elem.removeEventListener('drop', dropEvent);
            elem.removeEventListener( 'dragleave', dragLeave);
            elem.classList.add('cruzador');          
        }
        navios.add({linha, coluna}); 
        countCruzador--;
        if(countCruzador != 0){
            const elem = document.getElementById('cruzadorD drag')
            elem.className = "cruzadorD drag";
        }else{
            countSlot -= 3;
        }
    }

    if(navioClass === "portaAviaoD drag"){
        celula.classList.add('portaAviao');
        const linha = parseInt(celula.dataset.linha);
        let coluna = parseInt(celula.dataset.coluna);
        navios.add({linha, coluna}); 
        countSlot--;
        let count = 4;
        if(coluna > 5){
            while(count !=0){
                --coluna;
                const elem = document.querySelector(`.celula[data-linha="${linha}"][data-coluna="${coluna}"]`);
                elem.removeEventListener( 'dragover', dragOver);
                elem.removeEventListener('drop', dropEvent);
                elem.removeEventListener( 'dragleave', dragLeave);
                elem.classList.add('portaAviao');     
                count--;
                navios.add({linha, coluna});         
            }
        }else{
            while(count !=0){
                ++coluna;
                const elem = document.querySelector(`.celula[data-linha="${linha}"][data-coluna="${coluna}"]`);
                elem.classList.add('portaAviao');     
                elem.removeEventListener( 'dragover', dragOver);
                elem.removeEventListener('drop', dropEvent);
                elem.removeEventListener( 'dragleave', dragLeave);
                count--;
                navios.add({linha, coluna});        
            }          
        }  
    }

    if(navioClass === "encouracadoD drag"){
        celula.classList.add('encouracado');
        const linha = parseInt(celula.dataset.linha);
        let coluna = parseInt(celula.dataset.coluna);
        navios.add({linha, coluna}); 
        let count = 3;
        if(coluna > 6){
            while(count !=0){
                --coluna;
                const elem = document.querySelector(`.celula[data-linha="${linha}"][data-coluna="${coluna}"]`);
                elem.classList.add('encouracado');     
                elem.removeEventListener( 'dragover', dragOver);
                elem.removeEventListener('drop', dropEvent);
                elem.removeEventListener( 'dragleave', dragLeave);
                count--;
                navios.add({linha, coluna});        
            }
        }else{
            while(count !=0){
                ++coluna;
                const elem = document.querySelector(`.celula[data-linha="${linha}"][data-coluna="${coluna}"]`);
                elem.classList.add('encouracado');     
                elem.removeEventListener( 'dragover', dragOver);
                elem.removeEventListener('drop', dropEvent);
                elem.removeEventListener( 'dragleave', dragLeave);
                count--;
                navios.add({linha, coluna});       
            }          
        }
        countEncouracado--;
        if(countEncouracado != 0){
            const elem = document.getElementById('encouracadoD drag')
            elem.className = "encouracadoD drag";
        }else{
            countSlot -= 2;
        }
    }

    if(navioClass === "hidroAviaoD drag"){
        celula.classList.add('hidroAviao');
        const linha = parseInt(celula.dataset.linha);
        let coluna = parseInt(celula.dataset.coluna);
        navios.add({linha, coluna}); 
        let count = 2;
        if(coluna > 7){
            while(count !=0){
                --coluna;
                const elem = document.querySelector(`.celula[data-linha="${linha}"][data-coluna="${coluna}"]`);
                elem.classList.add('hidroAviao');
                elem.removeEventListener( 'dragover', dragOver);
                elem.removeEventListener('drop', dropEvent);
                elem.removeEventListener( 'dragleave', dragLeave);
                count--;        
                navios.add({linha, coluna}); 
            }
        }else{
            while(count !=0){
                ++coluna;
                const elem = document.querySelector(`.celula[data-linha="${linha}"][data-coluna="${coluna}"]`);
                elem.classList.add('hidroAviao');     
                elem.removeEventListener( 'dragover', dragOver);
                elem.removeEventListener('drop', dropEvent);
                elem.removeEventListener( 'dragleave', dragLeave);
                count--;        
                navios.add({linha, coluna}); 
            }          
        }
        countHidroAviao--;
        if(countHidroAviao != 0){
            const elem = document.getElementById('hidroAviaoD drag')
            elem.className = "hidroAviaoD drag";
        }else{
            countSlot -= 3;
        }
    }

    if(navioClass === "submarinoD drag"){
        celula.classList.add('submarino');
        const linha = parseInt(celula.dataset.linha);
        const coluna = parseInt(celula.dataset.coluna);
        navios.add({linha, coluna}); 
        countSubmarino--;
        if(countSubmarino != 0){
            const elem = document.getElementById('submarinoD drag')
            elem.className = "submarinoD drag";
        }else{
            countSlot -= 4;
        }
    }

    // Medida de Segurança Button Ready
    if(countSlot === 0){
        btnReady.disabled = false;
    }
}

// Função para verificar se um tiro acertou um navio
function verificarTiro(linha, coluna) {
    for (const navio of naviosOp) {
        if (navio.linha === linha && navio.coluna === coluna) {
            return true;
        }
    }
    return false;
}

// Função para marcar um tiro no tabuleiro
function marcarTiro(linha, coluna, resultado) {
    const celulas = document.querySelectorAll(`.celula[data-linha="${linha}"][data-coluna="${coluna}"]`);
    if (resultado) {
        celulas[1].classList.add('tiro-acertado');
        const payload_game = {
            'method' : 'playChance',
            'clientID': clientID,
            'gameID' : gameID,
            'tiro' :  `${linha} ${coluna}`
        };
        pontuacao++;
        if(pontuacao === 32){
            const payload_game = {
                'method' : 'EndGame',
                'gameID': gameID,
                'clientID' : clientID
            }
            ws.send(JSON.stringify(payload_game));
            return;
        }
        ws.send(JSON.stringify(payload_game));
    } else {
        celulas[1].classList.add('tiro-falhado');
        const payload_game = {
            'method' : 'oponenteChance',
            'clientID': clientID,
            'gameID' : gameID,
            'tiro' : `${linha} ${coluna}`
        }
        ws.send(JSON.stringify(payload_game));
    }
    tiros.push({ linha, coluna });
}