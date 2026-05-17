const views = [
    {
        id: "frontal",
        name: "VISÃO FRONTAL",
        indicator: "VISTA 1/4",
        tags: [
            { id: "TAG_FR_CAPO", label: "Capô", area: "capo" },
            { id: "TAG_FR_GRADE", label: "Grade Frontal", area: "grade" },
            { id: "TAG_FR_FAROL_LE", label: "Farol LE", area: "farol-le" },
            { id: "TAG_FR_FAROL_LD", label: "Farol LD", area: "farol-ld" },
            { id: "TAG_FR_PARALAMA_LE", label: "Paralama LE", area: "paralama-le" },
            { id: "TAG_FR_PARALAMA_LD", label: "Paralama LD", area: "paralama-ld" },
            { id: "TAG_FR_SETA_LE", label: "Seta LE", area: "seta-le" },
            { id: "TAG_FR_SETA_LD", label: "Seta LD", area: "seta-ld" },
            { id: "TAG_FR_NEBLINA_LE", label: "Neblina LE", area: "neblina-le" },
            { id: "TAG_FR_NEBLINA_LD", label: "Neblina LD", area: "neblina-ld" },
            { id: "TAG_FR_PARACHOQUE", label: "Parachoque Diant.", area: "parachoque" },
            { id: "TAG_FR_PARABRISA", label: "Parabrisa", area: "parabrisa" }
        ]
    },
    {
        id: "traseira",
        name: "VISÃO TRASEIRA",
        indicator: "VISTA 2/4",
        tags: [
            { id: "TAG_TR_TAMPA", label: "Tampa Porta-Malas" },
            { id: "TAG_TR_LANTERNA_LE", label: "Lanterna LE" },
            { id: "TAG_TR_LANTERNA_LD", label: "Lanterna LD" },
            { id: "TAG_TR_PARALAMA_LE", label: "Paralama TR LE" },
            { id: "TAG_TR_PARALAMA_LD", label: "Paralama TR LD" },
            { id: "TAG_TR_SETA_LE", label: "Seta TR LE" },
            { id: "TAG_TR_SETA_LD", label: "Seta TR LD" },
            { id: "TAG_TR_RE", label: "Luz de Ré" },
            { id: "TAG_TR_BRAKELIGHT", label: "Brake Light" },
            { id: "TAG_TR_PLACA", label: "Luz de Placa" },
            { id: "TAG_TR_PARACHOQUE", label: "Parachoque TR" },
            { id: "TAG_TR_DIFUSOR", label: "Difusor/Saia" },
            { id: "TAG_TR_VIGIA", label: "Vidro Vigia" },
            { id: "TAG_TR_LIMPADOR", label: "Limpador TR" }
        ]
    },
    {
        id: "lateral-le",
        name: "LATERAL ESQUERDA",
        indicator: "VISTA 3/4",
        tags: [
            { id: "TAG_LE_PORTA_DIANT", label: "Porta Diant. LE" },
            { id: "TAG_LE_PORTA_TRAS", label: "Porta Tras. LE" },
            { id: "TAG_LE_MACANETA_DIANT", label: "Maçaneta Diant. LE" },
            { id: "TAG_LE_MACANETA_TRAS", label: "Maçaneta Tras. LE" },
            { id: "TAG_LE_RETROVISOR", label: "Retrovisor LE" },
            { id: "TAG_LE_RODA_DIANT", label: "Roda Diant. LE" },
            { id: "TAG_LE_RODA_TRAS", label: "Roda Tras. LE" },
            { id: "TAG_LE_PNEU_DIANT", label: "Pneu Diant. LE" },
            { id: "TAG_LE_PNEU_TRAS", label: "Pneu Tras. LE" },
            { id: "TAG_LE_SOLEIRA", label: "Soleira/Caixa Ar" },
            { id: "TAG_LE_COLUNA_A", label: "Coluna A LE" },
            { id: "TAG_LE_COLUNA_B", label: "Coluna B LE" },
            { id: "TAG_LE_COLUNA_C_D", label: "Coluna C/D LE" },
            { id: "TAG_LE_TETO", label: "Teto LE" },
            { id: "TAG_LE_VIDRO_DIANT", label: "Vidro Diant. LE" },
            { id: "TAG_LE_VIDRO_TRAS", label: "Vidro Tras. LE" },
            { id: "TAG_LE_VIDRO_FIXO", label: "Vidro Fixo LE" },
            { id: "TAG_LE_FRISO", label: "Frisos LE" }
        ]
    },
    {
        id: "lateral-ld",
        name: "LATERAL DIREITA",
        indicator: "VISTA 4/4",
        tags: [
            { id: "TAG_LD_PORTA_DIANT", label: "Porta Diant. LD" },
            { id: "TAG_LD_PORTA_TRAS", label: "Porta Tras. LD" },
            { id: "TAG_LD_MACANETA_DIANT", label: "Maçaneta Diant. LD" },
            { id: "TAG_LD_MACANETA_TRAS", label: "Maçaneta Tras. LD" },
            { id: "TAG_LD_RETROVISOR", label: "Retrovisor LD" },
            { id: "TAG_LD_RODA_DIANT", label: "Roda Diant. LD" },
            { id: "TAG_LD_RODA_TRAS", label: "Roda Tras. LD" },
            { id: "TAG_LD_PNEU_DIANT", label: "Pneu Diant. LD" },
            { id: "TAG_LD_PNEU_TRAS", label: "Pneu Tras. LD" },
            { id: "TAG_LD_SOLEIRA", label: "Soleira/Caixa Ar LD" },
            { id: "TAG_LD_COLUNA_A", label: "Coluna A LD" },
            { id: "TAG_LD_COLUNA_B", label: "Coluna B LD" },
            { id: "TAG_LD_COLUNA_C_D", label: "Coluna C/D LD" },
            { id: "TAG_LD_TETO", label: "Teto LD" },
            { id: "TAG_LD_VIDRO_DIANT", label: "Vidro Diant. LD" },
            { id: "TAG_LD_VIDRO_TRAS", label: "Vidro Tras. LD" },
            { id: "TAG_LD_VIDRO_FIXO", label: "Vidro Fixo LD" },
            { id: "TAG_LD_FRISO", label: "Frisos LD" }
        ]
    }
];

let currentViewIndex = 0;
const selectedTags = new Set();

const container = document.getElementById('tag-container');
const viewIndicator = document.getElementById('view-indicator');
const viewName = document.getElementById('view-name');
const btnPrev = document.getElementById('btn-prev');
const btnNext = document.getElementById('btn-next');

function renderView() {
    const view = views[currentViewIndex];
    
    // Atualiza cabeçalho
    viewIndicator.textContent = view.indicator;
    viewName.textContent = view.name;
    
    // Limpa container
    container.innerHTML = '';
    container.className = `tag-grid ${view.id}`;
    
    // Renderiza tags
    view.tags.forEach(tag => {
        const btn = document.createElement('button');
        btn.className = 'tag-btn';
        if (tag.area) btn.classList.add(`area-${tag.area}`);
        if (selectedTags.has(tag.id)) btn.classList.add('selected');
        
        btn.textContent = tag.label;
        btn.onclick = () => toggleTag(tag.id, btn);
        
        container.appendChild(btn);
    });
    
    // Controle de botões de navegação
    btnPrev.style.visibility = currentViewIndex === 0 ? 'hidden' : 'visible';
    btnNext.textContent = currentViewIndex === views.length - 1 ? 'FINALIZAR' : 'PRÓXIMA VISTA';
}

function toggleTag(tagId, element) {
    if (selectedTags.has(tagId)) {
        selectedTags.delete(tagId);
        element.classList.remove('selected');
    } else {
        selectedTags.add(tagId);
        element.classList.add('selected');
    }
}

function nextView() {
    if (currentViewIndex < views.length - 1) {
        currentViewIndex++;
        renderView();
        container.scrollTo(0, 0);
    } else {
        showSummary();
    }
}

function prevView() {
    if (currentViewIndex > 0) {
        currentViewIndex--;
        renderView();
        container.scrollTo(0, 0);
    }
}

function showSummary() {
    container.innerHTML = `
        <div class="summary-container">
            <h2>LAUDO DE DANOS</h2>
            <div id="summary-content"></div>
            <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 20px;">
                <button id="btn-whatsapp" class="btn" style="background-color: #25D366; color: white;">COMPARTILHAR WHATSAPP</button>
                <button id="btn-notepad" class="btn btn-secondary">BAIXAR BLOCO DE NOTAS (.txt)</button>
                <button id="btn-final-save" class="btn btn-primary">FINALIZAR OCORRÊNCIA</button>
            </div>
        </div>`;
    
    const content = document.getElementById('summary-content');
    container.className = 'tag-grid summary';
    
    if (selectedTags.size === 0) {
        content.innerHTML = '<p style="padding: 20px; text-align: center;">Nenhum dano registrado.</p>';
    } else {
        const grouped = {};
        selectedTags.forEach(tagId => {
            const viewPrefix = tagId.split('_')[1];
            if (!grouped[viewPrefix]) grouped[viewPrefix] = [];
            
            let label = tagId;
            views.forEach(v => {
                const found = v.tags.find(t => t.id === tagId);
                if (found) label = found.label;
            });
            grouped[viewPrefix].push(label);
        });

        const viewNames = { 'FR': 'FRENTE', 'TR': 'TRASEIRA', 'LE': 'LATERAL ESQ.', 'LD': 'LATERAL DIR.' };

        for (const prefix in grouped) {
            const section = document.createElement('div');
            section.style.marginBottom = "20px";
            section.innerHTML = `<h3 style="color: var(--text-secondary); font-size: 0.8rem; margin-bottom: 5px;">${viewNames[prefix]}</h3>`;
            const ul = document.createElement('ul');
            ul.id = 'summary-list';
            grouped[prefix].forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                ul.appendChild(li);
            });
            section.appendChild(ul);
            content.appendChild(section);
        }

        // Lógica de Geração de Texto
        const generateTextReport = () => {
            let report = "--- LAUDO DE DANOS PMRv ---\n";
            report += "Data: " + new Date().toLocaleString('pt-BR') + "\n\n";
            for (const prefix in grouped) {
                report += `[${viewNames[prefix]}]\n`;
                grouped[prefix].forEach(item => report += `- ${item}\n`);
                report += "\n";
            }
            return report;
        };

        // WhatsApp
        document.getElementById('btn-whatsapp').onclick = () => {
            const text = encodeURIComponent(generateTextReport());
            window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
        };

        // Bloco de Notas
        document.getElementById('btn-notepad').onclick = () => {
            const blob = new Blob([generateTextReport()], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `laudo_danos_pmrv_${Date.now()}.txt`;
            a.click();
            window.URL.revokeObjectURL(url);
        };
    }
    
    viewIndicator.textContent = "CONCLUÍDO";
    viewName.textContent = "RESUMO FINAL";
    btnNext.style.display = 'none';
    btnPrev.textContent = "VOLTAR";
    btnPrev.onclick = () => {
        currentViewIndex = views.length - 1;
        btnNext.style.display = 'block';
        renderView();
    };

    document.getElementById('btn-final-save').onclick = () => {
        alert("Ocorrência finalizada!");
        location.reload();
    };
}

btnNext.onclick = nextView;
btnPrev.onclick = prevView;

// Início
renderView();
