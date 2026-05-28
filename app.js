document.addEventListener('DOMContentLoaded', () => {

    // 1. LÓGICA DEL FORMULARIO DE CONTACTO (Guardar en LocalStorage)
    
    const formulario = document.querySelector('form');
    
    if (formulario) {
        formulario.addEventListener('submit', function(evento) {
            evento.preventDefault(); // Evita que la página se recargue al enviar
            
            // Obtenemos los valores que el usuario escribió en el formulario
            const nombre = document.getElementById('nombre').value;
            const correo = document.getElementById('correo').value;
            const asunto = document.getElementById('asunto').value;
            const mensajeTexto = document.getElementById('mensaje').value;

            // Creamos un "paquete" (objeto) con los datos del mensaje
            const nuevoMensaje = {
                nombre: nombre,
                correo: correo,
                asunto: asunto,
                mensaje: mensajeTexto,
            };

            // Traemos los mensajes anteriores (si no hay, creamos una lista vacía)
            let listaMensajes = JSON.parse(localStorage.getItem('mensajesClientes')) || [];

            // Agregamos el nuevo mensaje a nuestra lista
            listaMensajes.push(nuevoMensaje);

            // Guardamos la lista actualizada en el LocalStorage
            localStorage.setItem('mensajesClientes', JSON.stringify(listaMensajes));

            // Mostramos una alerta de éxito
            alert(`¡Gracias por tu mensaje, ${nombre}! Hemos guardado tus datos correctamente.`);
            
            // Limpiamos las cajas del formulario
            formulario.reset(); 
        });
    }

    
    // 2. Alerta al presionar botón
    
    const botones = document.querySelectorAll('#catalogo button');
    
    if (botones.length > 0) {
        botones.forEach(boton => {
            boton.addEventListener('click', (evento) => {
                // Buscamos el nombre del producto al que se le hizo clic
                const articulo = evento.target.closest('article');
                const nombre = articulo.querySelector('h3').textContent;

                // Lanzamos la alerta simple 
                alert(`¡${nombre} añadido a tu carrito 🛒!`);
            });
        });
    }

});