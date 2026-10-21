document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    // Decodifica a URL para evitar problemas com %20 e pega o nome do arquivo
    const page = decodeURIComponent(path.split("/").pop());

    // A apresentação mantém o desenho original e se ajusta à janela da máquina.
    const slide = document.querySelector('.slide-container');
    if (slide && page !== 'Slide30.html') {
        const fit = () => {
            const scale = Math.min(window.innerWidth / 1600, window.innerHeight / 900);
            Object.assign(slide.style, {
                width: '1600px', height: '900px', minHeight: '900px',
                position: 'fixed', left: '50%', top: '50%',
                transform: `translate(-50%, -50%) scale(${scale})`,
                transformOrigin: 'center center'
            });
            document.body.style.overflow = 'hidden';
        };
        window.addEventListener('resize', fit);
        fit();
        const hub = document.createElement('a');
        hub.href = '../index.html';
        hub.textContent = '← HUB';
        hub.setAttribute('aria-label', 'Voltar ao HUB de aprendizagem');
        hub.style.cssText = 'position:fixed;bottom:10px;left:50%;transform:translateX(-50%);z-index:99999;padding:5px 12px;border-radius:20px;background:#0055A4;color:white;border:1px solid #0055A4;font:11px Segoe UI,Arial,sans-serif;text-decoration:none';
        document.body.append(hub);
    }

    function goToSlide(direction) {
        // O slide de aula prática encerra a apresentação.
        if (page === 'Slide28.html' && direction === 1) { window.location.href='Slide30.html'; return; }
        if (page === 'Slide30.html') { window.location.href=direction===1?'Slide29.html':'Slide28.html'; return; }
        if (page === 'Slide29.html') { window.location.href=direction===1?'../index.html':'Slide30.html'; return; }
        
        // --- REGRAS ESPECIAIS PARA O SLIDE 8.5 ---
        
        // Se estou no Slide 08 e vou para frente -> Vai para 08b
        if (page === "Slide08.html" && direction === 1) {
            window.location.href = "Slide08b.html";
            return;
        }

        // Se estou no Slide 08b...
        if (page === "Slide08b.html") {
            // ...e vou para frente -> Vai para 09
            if (direction === 1) window.location.href = "Slide09.html";
            // ...e vou para trás -> Volta para 08
            else window.location.href = "Slide08.html";
            return;
        }

        // Se estou no Slide 09 e vou para trás -> Volta para 08b
        if (page === "Slide09.html" && direction === -1) {
            window.location.href = "Slide08b.html";
            return;
        }
        
        // --- FIM DAS REGRAS ESPECIAIS ---


        // Lógica Padrão (Numérica) para o resto
        const match = page.match(/Slide(\d+)\.html/i);
        let currentNumber = 1; 

        if (match) {
            currentNumber = parseInt(match[1]);
        } else if (page === "" || page === "index.html") {
            currentNumber = 1;
        }

        const nextNumber = currentNumber + direction;

        // Impede de ir para trás do 1
        if (nextNumber < 1) return;

        // Formata com zero à esquerda (ex: 9 vira "09")
        const nextNumberString = nextNumber.toString().padStart(2, '0');
        const nextFile = `Slide${nextNumberString}.html`;

        window.location.href = nextFile;
    }

    // Ouvinte do Teclado
    document.addEventListener('keydown', (event) => {
        if (event.defaultPrevented || event.target.closest('button, a, input, textarea, select, [contenteditable="true"]')) return;
        if (event.key === 'ArrowRight' || event.key === ' ' || event.key === 'Enter') {
            event.preventDefault();
            goToSlide(1);
        } else if (event.key === 'ArrowLeft') {
            goToSlide(-1);
        }
    });
});
