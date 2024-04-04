let ws = new WebSocket('ws://localhost:8080');

        ws.onopen = function(event) {
            console.log('Conexão estabelecida');
        };

        ws.onerror = function(event) {
            console.error('Erro de WebSocket detectado:', event);
        };

        let clientID = null;
        let gameID = null;
        let pontuacao = 0;

        const btnReady = document.getElementById('ready_for_play');

        btnReady.addEventListener('click', () =>{
            // estado de espera
            const caixa = document.getElementById('caixa');
            const fundo = document.getElementById('fundo');
            const body = document.getElementById('body');
            caixa.style.display = 'block';
            fundo.style.display = "block";
            body.style.pointerEvents = "none";

            // transferencia do mapa
            let mapa = "";
                dropItems.forEach(navio => {
                    if(navio.classList.length > 1){
                        mapa += "-1-";
                    }else{
                        mapa += "-0-"
                    }
                 });    
            const mapaSub = mapa.substring(1, mapa.length-1);

            const payload = {
                'method': 'ready',
                'map' : mapaSub,
                'clientID' : clientID
            }
            ws.send(JSON.stringify(payload));
        });

        ws.onmessage = function(message) {
            let msg = JSON.parse(message.data);
            console.log('Mensagem do servidor:', msg);

            //connect
            if(msg.method === "connect"){
                clientID = msg.clientID;
            }

            // Venceu o jogo!!
            if(msg.method === 'Winner'){
                const caixa = document.getElementById('caixa');
                const fundo = document.getElementById('fundo');
                const body = document.getElementById('body');
                caixa.style.display = 'block';
                fundo.style.display = "block";
                body.style.pointerEvents = "none";
                const text = document.getElementById('textBox');
                text.innerHTML = 'Winner!!!';
            }

            // Perdeu o jogo
            if(msg.method === 'Loser'){
                const caixa = document.getElementById('caixa');
                const fundo = document.getElementById('fundo');
                const body = document.getElementById('body');
                caixa.style.display = 'block';
                fundo.style.display = "block";
                body.style.pointerEvents = "none";
                const text = document.getElementById('textBox');
                text.innerHTML = 'Loser!!!';
            }

            if(msg.method === 'MapOponente'){ // recebe mapa do oponente
                gameID = msg.gameID;
                const caixa = document.getElementById('caixa');
                const fundo = document.getElementById('fundo');
                const body = document.getElementById('body');
                const container = document.getElementById("container_play2")
                container.style.display = "table-cell";
                caixa.style.display = 'none';
                fundo.style.display = "none";
                body.style.pointerEvents = "all";
                const tabuleiros = document.querySelectorAll('.tabuleiro');
                tabuleiros.forEach((elem) => {
                    if(elem.getAttribute("name") === "tabuleiro2"){
                        const childrens = elem.children;
                        for(var ii=0; ii < childrens.length; ii++){
                            if(msg.map[ii] === "0"){
                                childrens[ii].className = 'celula';
                            }else{
                                childrens[ii].className = 'celula navio';
                                const linha = parseInt(childrens[ii].dataset.linha);
                                const coluna = parseInt(childrens[ii].dataset.coluna);
                                naviosOp.add({linha, coluna})
                            }
                        }
                    }
                })
                const payload = {
                    'method' : 'InitGame',
                    'gameID': gameID 
                }
                ws.send(JSON.stringify(payload))
            }

            if(msg.method === "oponenteChance"){
                const tabuleiro = document.getElementsByName("tabuleiro2");
                tabuleiro[0].style.pointerEvents = "none";

                if(msg.tiro !== null){
                    const regex = /\s+/g;
                    const coords = msg.tiro.split(regex);
                    const celulas = document.querySelectorAll(`.celula[data-linha="${parseInt(coords[0])}"][data-coluna="${parseInt(coords[1])}"]`);
                    celulas[0].classList.add('tiro-acertado'); // oponente acertou e agora e a vez dele                
                }
            }
            if(msg.method === "playChance"){
                const tabuleiro = document.getElementsByName("tabuleiro2");
                tabuleiro[0].style.pointerEvents = "all";

                if(msg.tiro !== null){
                    const regex = /\s+/g;
                    const coords = msg.tiro.split(regex);
                    const celulas = document.querySelectorAll(`.celula[data-linha="${parseInt(coords[0])}"][data-coluna="${parseInt(coords[1])}"]`);
                    celulas[0].classList.add('tiro-falhado'); // oponente errou e agora é a sua vez                  
                }
            }
        };