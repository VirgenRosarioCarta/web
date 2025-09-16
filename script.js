document.addEventListener('DOMContentLoaded', function() {
    const card = document.getElementById('invitationCard');
    const backgroundMusic = document.getElementById('background-music');
    const imageModal = document.getElementById('image-modal');
    let isMusicPlaying = false;
    let isCardFlipped = false;

    // Función para lanzar el confeti
    function launchConfetti() {
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
        const colors = ['#c88a8a', '#b5651d', '#fdfaf3', '#6a4a3a', '#ffffff'];

        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }

        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) {
                return clearInterval(interval);
            }
            const particleCount = 50 * (timeLeft / duration);
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: colors }));
            confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: colors }));
        }, 250);
    }

    // Evento de clic en la tarjeta
    card.addEventListener('click', function() {
        // Si la tarjeta ya está abierta, muestra el modal de la imagen
        if (isCardFlipped) {
            imageModal.style.display = 'flex';
            return; // Termina la función aquí para no volver a girar la tarjeta
        }

        // --- Lógica del primer clic ---

        // Reproduce la música solo la primera vez que se interactúa
        if (!isMusicPlaying) {
            backgroundMusic.play().catch(error => {
                console.log("El audio no pudo reproducirse automáticamente:", error);
            });
            isMusicPlaying = true;
        }

        // Alterna la clase para la animación
        card.classList.add('is-flipped');
        isCardFlipped = true; // Marca la tarjeta como abierta

        // Lanzael confeti cuando se abre
        launchConfetti();
    });

    // Evento para cerrar el modal al hacer clic fuera de la imagen
    window.addEventListener('click', function(event) {
        if (event.target == imageModal) {
            imageModal.style.display = 'none';
        }
    });

    // Cargar datos desde el archivo JSON
    fetch('invitacion.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            document.getElementById('event-title').textContent = data.title;
            document.getElementById('event-subtitle').textContent = data.subtitle;
            
            // --- CORREGIDO: Volver a mostrar la lista de alferados ---
            const alferadosContainer = document.getElementById('alferados-list');
            alferadosContainer.innerHTML = ''; // Limpiar por si acaso
            data.alferados.forEach(name => {
                const p = document.createElement('p');
                p.textContent = name;
                alferadosContainer.appendChild(p);
            });
            // --- Fin de la corrección ---
            
            document.getElementById('event-location').textContent = data.location;
            document.getElementById('event-date').textContent = data.program.date;
            
            const programList = document.getElementById('program-list');
            data.program.events.forEach(event => {
                const li = document.createElement('li');
                li.textContent = `${event.time} ${event.description}`;
                programList.appendChild(li);
            });

            document.getElementById('event-closing').textContent = data.closing;
        })
        .catch(error => console.error('Error al cargar los datos de la invitación:', error));
});