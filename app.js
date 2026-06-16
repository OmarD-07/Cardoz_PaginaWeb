document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. LÓGICA DEL FORMULARIO DE CONTACTO 
    // ==========================================
    const formulario = document.querySelector('form');
    
    if (formulario) {
        formulario.addEventListener('submit', function(evento) {
            evento.preventDefault(); 
            
            const nombre = document.getElementById('nombre').value;
            const correo = document.getElementById('correo').value;
            const asunto = document.getElementById('asunto').value;
            const mensajeTexto = document.getElementById('mensaje').value;

            const nuevoMensaje = {
                nombre: nombre,
                correo: correo,
                asunto: asunto,
                mensaje: mensajeTexto,
                fecha: new Date().toLocaleString()
            };

            let listaMensajes = JSON.parse(localStorage.getItem('mensajesCardoz')) || [];
            listaMensajes.push(nuevoMensaje);
            localStorage.setItem('mensajesCardoz', JSON.stringify(listaMensajes));

            alert(`¡Gracias por tu mensaje, ${nombre}! Hemos guardado tu consulta y te contactaremos pronto.`);
            formulario.reset(); 
        });
    }

    // ==========================================
    // 2. LÓGICA DE AGREGAR AL CARRITO (Catálogo)
    // ==========================================
    // Seleccionamos todos los botones que tengan el atributo "data-nombre"
    const botonesAgregar = document.querySelectorAll('button[data-nombre]');
    
    if (botonesAgregar.length > 0) {
        botonesAgregar.forEach(boton => {
            boton.addEventListener('click', () => {
                
                // Extraemos los datos ocultos en el botón HTML
                const producto = {
                    nombre: boton.getAttribute('data-nombre'),
                    precio: parseFloat(boton.getAttribute('data-precio')),
                    id: Date.now() // Un ID único basado en la hora para poder borrarlo luego
                };

                // Traemos el carrito de LocalStorage (o creamos uno vacío)
                let carrito = JSON.parse(localStorage.getItem('carritoCardoz')) || [];
                carrito.push(producto);
                
                // Guardamos en LocalStorage
                localStorage.setItem('carritoCardoz', JSON.stringify(carrito));

                alert(`¡Excelente! "${producto.nombre}" fue añadido a tu cotización.`);
            });
        });
    }

    // ==========================================
    // 3. LÓGICA DE MOSTRAR EL CARRITO (compra.html)
    // ==========================================
    const contenedorVacio = document.getElementById('carrito-vacio');
    const contenedorContenido = document.getElementById('carrito-con-contenido');
    const listaCarrito = document.getElementById('lista-carrito');
    const subtotalTxt = document.getElementById('subtotal-precio');
    const totalTxt = document.getElementById('total-precio');
    const btnVaciar = document.getElementById('btn-vaciar-carrito');
    const btnWhatsApp = document.getElementById('btn-confirmar-cotizacion');

    // Función que dibuja la tabla
    function actualizarCarrito() {
        if (!listaCarrito) return; // Si no estamos en la página compra.html, ignoramos esto

        let carrito = JSON.parse(localStorage.getItem('carritoCardoz')) || [];

        // Si no hay nada, mostramos el mensaje de vacío
        if (carrito.length === 0) {
            contenedorVacio.classList.remove('d-none');
            contenedorContenido.classList.add('d-none');
        } else {
            // Si hay productos, mostramos la tabla
            contenedorVacio.classList.add('d-none');
            contenedorContenido.classList.remove('d-none');

            listaCarrito.innerHTML = ''; // Limpiamos la tabla
            let total = 0;

            // Recorremos los productos y creamos las filas HTML
            carrito.forEach((producto, index) => {
                total += producto.precio;
                
                const fila = document.createElement('tr');
                fila.innerHTML = `
                    <td class="fw-semibold text-dark ps-3">${producto.nombre}</td>
                    <td class="text-center text-muted">S/. ${producto.precio.toFixed(2)}</td>
                    <td class="text-end pe-3">
                        <button class="btn btn-sm btn-outline-danger border-0 btn-eliminar" data-index="${index}">
                            <i class="bi bi-trash3"></i>
                        </button>
                    </td>
                `;
                listaCarrito.appendChild(fila);
            });

            // Actualizamos los textos de los precios totales
            subtotalTxt.textContent = `S/. ${total.toFixed(2)}`;
            totalTxt.textContent = `S/. ${total.toFixed(2)}`;

            // Botones para eliminar un producto individual
            document.querySelectorAll('.btn-eliminar').forEach(boton => {
                boton.addEventListener('click', (e) => {
                    const indice = e.currentTarget.getAttribute('data-index');
                    carrito.splice(indice, 1); // Cortamos ese producto de la lista
                    localStorage.setItem('carritoCardoz', JSON.stringify(carrito));
                    actualizarCarrito(); // Volvemos a dibujar la tabla
                });
            });
        }
    }

    // Ejecutamos la función al cargar la página
    actualizarCarrito();

    // Botón para vaciar todo el carrito
    if (btnVaciar) {
        btnVaciar.addEventListener('click', () => {
            if(confirm('¿Estás seguro de que deseas vaciar toda tu selección?')) {
                localStorage.removeItem('carritoCardoz');
                actualizarCarrito();
            }
        });
    }

    // Botón para enviar la cotización por WhatsApp
    if (btnWhatsApp) {
        btnWhatsApp.addEventListener('click', () => {
            let carrito = JSON.parse(localStorage.getItem('carritoCardoz')) || [];
            if (carrito.length === 0) return;

            // Armamos el mensaje de texto
            let mensajeTexto = "Hola Cardoz Pastelería Fina. Me gustaría cotizar este pedido para mi evento:\n\n";
            let total = 0;
            
            carrito.forEach(prod => {
                mensajeTexto += `- ${prod.nombre} (S/. ${prod.precio.toFixed(2)})\n`;
                total += prod.precio;
            });

            mensajeTexto += `\n*Total estimado: S/. ${total.toFixed(2)}*\n\n¿Me pueden confirmar disponibilidad?`;

            // Enlace de WhatsApp (Coloca aquí tu número de Huancayo real)
            const numeroWhatsApp = "51900123456"; 
            const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensajeTexto)}`;
            
            // Abre WhatsApp en una pestaña nueva
            window.open(urlWhatsApp, '_blank');
        });
    }
});