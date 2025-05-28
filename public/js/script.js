document.addEventListener('DOMContentLoaded', function() {

    // --- Animación de Fade In al hacer Scroll ---
    const sections = document.querySelectorAll('.fade-in-section');

    const options = {
        root: null, // usa el viewport como el área de observación
        rootMargin: '0px',
        threshold: 0.1 // El elemento se considera visible cuando el 10% está en pantalla
    };

    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            // Si el elemento está intersectando (visible)
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Dejar de observar el elemento una vez que ya es visible
                observer.unobserve(entry.target);
            }
        });
    }, options);

    sections.forEach(section => {
        observer.observe(section);
    });

    // --- Suavizar el scroll al hacer clic en los enlaces de la navegación ---
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Evita el salto brusco del ancla
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 56, // Resta la altura del navbar
                    behavior: 'smooth' // Animación de scroll suave
                });
            }
        });
    });

// ... (código anterior de scroll y animación) ...

// --- Manejo del Formulario de Contacto ---
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevenir el envío tradicional del formulario

        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const mensaje = document.getElementById('mensaje').value;

        // Mostrar un mensaje de "Enviando..."
        formStatus.innerHTML = '<div class="alert alert-info">Enviando...</div>';

        fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre, email, mensaje }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message.includes('Error')) {
                throw new Error(data.message);
            }
            // Limpiar el formulario y mostrar mensaje de éxito
            contactForm.reset();
            formStatus.innerHTML = `<div class="alert alert-success">${data.message}</div>`;
        })
        .catch(error => {
            // Mostrar mensaje de error
            formStatus.innerHTML = `<div class="alert alert-danger">Hubo un error al enviar el mensaje. Por favor, intenta de nuevo.</div>`;
            console.error('Error:', error);
        });
    });
}

});