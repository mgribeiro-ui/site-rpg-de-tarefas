document.addEventListener('DOMContentLoaded', () => {

    // Captura os elementos exatamente pelos IDs originais do seu HTML
    const formTarefa = document.getElementById('form tarefa');
    const inputDescricao = document.getElementById('Adicione um nome a sua tarefa');
    const inputPontos = document.getElementById('Aontos da tarefa');
    
    // Captura as duas listas presentes no seu HTML
    const listaPendentes = document.getElementById('lista de pendentes');
    const listaTarefas = document.getElementById('lista de tarefas');
    
    // Elementos de Pontuação e Rank
    const elPontos = document.getElementById('seus pontos');
    const elNivel = document.getElementById('nivel');
    const elRank = document.getElementById('rank');

    let totalPontos = 0;
    let nivelAtual = 1;

    // Função para atualizar o nível e rank com base nos pontos acumulados
    function atualizarRank() {
        // Exemplo de regra: A cada 100 XP sobe 1 Nível
        nivelAtual = Math.floor(totalPontos / 100) + 1;
        elNivel.textContent = nivelAtual;

        // Atualiza a patente/rank
        if (totalPontos >= 100000) {
            elRank.textContent = "Mestre Lendário 👑";
        } else if (totalPontos >= 5000) {
            elRank.textContent = "Guerreiro ⚔️";
        } else if (totalPontos >= 500) {
            elRank.textContent = "Aprendiz 🛡️";
        } else {
            elRank.textContent = "Novato 🐣";
        }
    }

    // Função para adicionar uma nova tarefa
    if (formTarefa) {
        formTarefa.addEventListener('submit', (event) => {
            // Evita que a página recarregue ao enviar o formulário
            event.preventDefault();

            const textoTarefa = inputDescricao.value.trim();
            const pontosTarefa = parseInt(inputPontos.value.trim(), 10);

            if (!textoTarefa || isNaN(pontosTarefa)) return;

            // Criar o item de lista (<li>)
            const li = document.createElement('li');
            li.style.marginBottom = "10px";
            li.style.listStyle = "none";
            
            li.innerHTML = `
                <span><strong>${textoTarefa}</strong> (+${pontosTarefa} XP)</span>
                <button type="button" class="btn-concluir" data-pontos="${pontosTarefa}">Concluir ⚔️</button>
            `;

            // Adiciona a tarefa na lista principal (#lista de tarefas)
            if (listaTarefas) {
                listaTarefas.appendChild(li);
            }

            // Opcional: Adiciona também uma cópia na lista de pendentes (#lista de pendentes) se desejar
            if (listaPendentes) {
                const liPendente = li.cloneNode(true);
                listaPendentes.appendChild(liPendente);
            }

            // Limpa os campos de input
            inputDescricao.value = '';
            inputPontos.value = '';
            inputDescricao.focus();
        });
    }

    // Ação ao clicar no botão de concluir tarefa
    function escutarConclusao(lista) {
        if (!lista) return;
        
        lista.addEventListener('click', (event) => {
            if (event.target.classList.contains('btn-concluir')) {
                const botao = event.target;
                const pontosGanho = parseInt(botao.getAttribute('data-pontos'), 10);
                
                // Soma os pontos acumulados
                totalPontos += pontosGanho;
                if (elPontos) elPontos.textContent = totalPontos;

                // Atualiza Nível e Rank
                atualizarRank();

                // Remove o item concluído
                const itemTarefa = botao.parentElement;
                itemTarefa.remove();
            }
        });
    }

    // Ativa a verificação de conclusão nas listas
    escutarConclusao(listaTarefas);
    escutarConclusao(listaPendentes);

});