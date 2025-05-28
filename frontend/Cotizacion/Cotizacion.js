//nuevo formulario de cotizacion

// Función para mostrar la cotización en el modal
function mostrarResumenCotizacion(datos) {
    const modal = document.getElementById('cotizacionModal');
    const resumenContainer = document.getElementById('resumen-cotizacion');

    // Calcular totales
    let total = 0;
    const productosSeleccionados = datos.productos.filter(p => p.seleccionado);

    // Crear tabla de productos
    let productosHTML = `
        <h6 class="mb-3">Información del cliente:</h6>
        <p><strong>Nombre:</strong> ${datos.nombre}</p>
        <p><strong>Ciudad:</strong> ${datos.ciudad}</p>
        <p><strong>Dirección:</strong> ${datos.direccion}</p>
        <p><strong>Celular:</strong> ${datos.celular}</p>
        
        <h6 class="mt-4 mb-3">Productos seleccionados:</h6>
        <div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Cantidad</th>
                        <th>Precio unitario</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
    `;

    productosSeleccionados.forEach(producto => {
        const subtotal = producto.cantidad * producto.precioActual;
        total += subtotal;

        productosHTML += `
            <tr>
                <td>${producto.nombre}</td>
                <td>${producto.cantidad}</td>
                <td>$${producto.precioActual.toLocaleString()}</td>
                <td>$${subtotal.toLocaleString()}</td>
            </tr>
        `;
    });

    productosHTML += `
                </tbody>
                <tfoot>
                    <tr>
                        <th colspan="3">Total</th>
                        <th>$${total.toLocaleString()}</th>
                    </tr>
                </tfoot>
            </table>
        </div>
    `;

    if (datos.mensaje) {
        productosHTML += `<p class="mt-3"><strong>Observaciones:</strong> ${datos.mensaje}</p>`;
    }

    resumenContainer.innerHTML = productosHTML;

    // Guardar los datos actuales para el envío
    window.datosCotizacionActual = datos;

    // Mostrar el modal
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();
}

// Función para enviar la cotización al backend real
function enviarCotizacion(datos) {
    return fetch('http://localhost:3001/api/cotizaciones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
    })
    .then(response => response.json());
}

// Función para cargar productos en el formulario
function cargarProductosCotizacion() {
    const productosContainer = document.querySelector('#cotizacion .productos-container .row');
    // Limpiar contenedor primero
    productosContainer.innerHTML = '';

    todosLosProductos.forEach((producto, index) => {
        const productoCol = document.createElement('div');
        productoCol.className = 'col-md-6 mb-3';

        productoCol.innerHTML = `
            <div class="form-check">
                <input class="form-check-input producto-check" type="checkbox" 
                       id="producto-${index}" data-index="${index}">
                <label class="form-check-label" for="producto-${index}">
                    ${producto.nombre} - $${producto.precioActual?.toLocaleString() || 'Consultar precio'}
                </label>
            </div>
            <div class="input-group mt-2 cantidad-container" style="display: none;" data-index="${index}">
                <span class="input-group-text">Cantidad</span>
                <input type="number" class="form-control cantidad-input" 
                       min="1" value="1" data-index="${index}" disabled>
            </div>
        `;

        productosContainer.appendChild(productoCol);
    });
}

// Evento cuando el DOM está cargado
document.addEventListener('DOMContentLoaded', function() {
    // Cargar productos en el formulario de cotización
    cargarProductosCotizacion();

    // Manejar el clic en los checkboxes de productos
    document.querySelector('#cotizacion').addEventListener('change', function(e) {
        if (e.target.classList.contains('producto-check')) {
            const index = e.target.dataset.index;
            const cantidadContainer = document.querySelector(`.cantidad-container[data-index="${index}"]`);
            const cantidadInput = document.querySelector(`.cantidad-input[data-index="${index}"]`);

            if (e.target.checked) {
                cantidadContainer.style.display = 'flex';
                cantidadInput.disabled = false;
            } else {
                cantidadContainer.style.display = 'none';
                cantidadInput.disabled = true;
            }
        }
    });

    // Manejar el envío del formulario
    document.getElementById('form-cotizacion').addEventListener('submit', function(e) {
        e.preventDefault();

        // Recoger datos del formulario
        const datos = {
            nombre: document.getElementById('nombre').value,
            ciudad: document.getElementById('ciudad').value,
            direccion: document.getElementById('direccion').value,
            celular: document.getElementById('celular').value,
            mensaje: document.getElementById('mensaje').value,
            productos: []
        };

        // Agregar información de productos seleccionados
        document.querySelectorAll('.producto-check:checked').forEach(checkbox => {
            const index = checkbox.dataset.index;
            const cantidad = parseInt(document.querySelector(`.cantidad-input[data-index="${index}"]`).value) || 1;

            datos.productos.push({
                ...todosLosProductos[index],
                seleccionado: true,
                cantidad: cantidad
            });
        });

        // Validar que se hayan seleccionado productos
        if (datos.productos.length === 0) {
            alert('Por favor selecciona al menos un producto');
            return;
        }

        // Mostrar resumen antes de enviar
        mostrarResumenCotizacion(datos);
    });

    // Manejar el botón de confirmación en el modal
    document.getElementById('confirmar-cotizacion').addEventListener('click', function() {
        const modal = bootstrap.Modal.getInstance(document.getElementById('cotizacionModal'));
        const botonConfirmar = this;

        botonConfirmar.disabled = true;
        botonConfirmar.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Enviando...';

        // Enviar a la base de datos real
        enviarCotizacion(window.datosCotizacionActual)
            .then(respuesta => {
                if (respuesta.success) {
                    alert(`Cotización enviada con éxito! Número de cotización: ${respuesta.cotizacionId}`);
                    modal.hide();
                    // Aquí podrías redirigir a una página de confirmación
                } else {
                    alert('Hubo un error al guardar la cotización.');
                }
            })
            .catch(error => {
                console.error('Error al enviar:', error);
                alert('Hubo un error al enviar la cotización. Por favor intenta nuevamente.');
            })
            .finally(() => {
                botonConfirmar.disabled = false;
                botonConfirmar.textContent = 'Confirmar pedido';
            });
    });

    // Manejar el botón de cancelar
    document.getElementById('cancelar-cotizacion').addEventListener('click', function() {
        window.location.href = '../frontend/index.html'; // Redirigir a la página principal
    });
});

// Mover el array todosLosProductos fuera del DOMContentLoaded para que sea accesible
const todosLosProductos = [
    { nombre: "Osito y Rosa", descripcion: "Osito y rosa en cera, con un exquisito aroma. Incluye base de madera natural y stickers personalizables para que lo hagas único.", imagen: "oso.png" , precioActual: 85000},
    { nombre: "Bouquet", descripcion: "Bouquet de flores elaborado con cera, esencia delicada y flores secas naturales. Un detalle único que combina belleza, aroma y un toque artesanal para decorar o regalar con estilo.", imagen: "bouquet.jpeg", precioActual: 85000 },
    { nombre: "Vela corazón largo y Tarjeta", descripcion: "Un detalle que enciende el alma: vela en forma de corazón acompañada de una tarjeta para decir lo que sientes con dulzura y estilo. Hermoso detalle, lindo y económico", imagen: "corazonrojado.png", precioActual: 90000 },
    { nombre: "Hermoso Recordatorios", descripcion: "Recordatorios para todo tipo de eventos como bautizos, primera comunion, matrimonio, cumpleaños y eventos corporativos", imagen: "estrellas.jpeg", precioActual: 20000 },
    { nombre: "Vela Margarita", descripcion: "Nuestra flor margarita en cera está hecha a mano con amor, ideal para decorar, regalar o simplemente llenar de belleza cualquier rincón. Una flor eterna que nunca se marchita", imagen: "margarita.png", precioActual: 65000 },
    { nombre: "Virgen y rosa", descripcion: "Hermosa virgen y rosa en cera, con una base de madera natural. Una pieza llena de ternura y devoción, ideal para regalar o crear un rincón espiritual", imagen: "virgen.png", precioActual: 65000 },
    { nombre: "Oso Naranja", descripcion: "Osito y rosa en cera, con un exquisito aroma. Incluye base de madera natural y stickers personalizables para que lo hagas único", imagen: "osorosa.png", precioActual:85000 },
    { nombre: "Osito y Rosa", descripcion: "...", imagen: "tarros.png", precioActual: 20000 },
    { nombre: "Virgen y Vela Azul", descripcion: "Hermosa virgen y rosa en cera, con una base de madera natural. Una pieza llena de ternura y devoción, ideal para regalar o crear un rincón espiritual", imagen: "virgenyrosazul.jpeg", precioActual: 85000 },
    { nombre: "Vela de Masajes, Relajación que Enciende los Sentidos", descripcion: "Descubre una experiencia única con nuestra vela de masajes artesanal, elaborada con ceras vegetales, manteca de karité y aceites esenciales. Al encenderla, se derrite en un cálido aceite que puedes aplicar directamente sobre la piel para un masaje suave, hidratante y profundamente relajante. Ideal para mimarte o sorprender a alguien especial", imagen: "velamasaje.jpeg", precioActual: 85000 },
    { nombre: "Virgen y rosa", descripcion: "Ideal para dar un hermoso detalle en el dia de las madres", imagen: "virgenyrosarosada.jpeg", precioActual: 85000 },
    { nombre: "Kit con pebetero y velas aromaticas", descripcion: "Transforma tu espacio en un refugio de calma con nuestro exclusivo kit aromático. Incluye un elegante pebetero artesanal y una selección de velas aromáticas hechas con cera vegetal y esencias naturales. Perfecto para crear ambientes relajantes, acompañar tus rutinas de meditación o regalar un momento de paz.", imagen: "pebetero.jpeg", precioActual: 85000 },
    { nombre: "Vela Margarita", descripcion: "Nuestra flor margarita en cera está hecha a mano con amor, ideal para decorar, regalar o simplemente llenar de belleza cualquier rincón. Una flor eterna que nunca se marchita", imagen: "margarita.png", precioActual: 85000 },
    { nombre: "Virgen y rosa", descripcion: "Hermosa virgen y rosa en cera, con una base de madera natural. Una pieza llena de ternura y devoción, ideal para regalar o crear un rincón espiritual", imagen: "virgen.png" },
    { nombre: "Osito y Rosa", descripcion: "Osito y rosa en cera, con un exquisito aroma. Incluye base de madera natural y stickers personalizables para que lo hagas único", imagen: "osorosa.png", precioActual: 85000 },
    { nombre: "Estrellas y Corazones", descripcion: "...", imagen: "tarros.png", precioActual: 20000 },
    { nombre: "Vela Aromática Personalizada, Un Detalle Único para Mamá", descripcion: "Sorprende a mamá con una vela artesanal hecha especialmente para ella. Elige su esencia favorita —lavanda, vainilla, jazmín, coco y muchas más— y regálale un momento de calma, calidez y amor. Hecha con cera vegetal y esencias naturales, esta vela no solo perfuma el ambiente, también transmite todo tu cariño.", imagen: "velamama.jpeg", precioActual: 50000 },
    { nombre: "Osito y Rosa", descripcion: "Osito y rosa en cera, con un exquisito aroma. Incluye base de madera natural y stickers personalizables para que lo hagas único", imagen: "osorosa.png", precioActual: 85000  },

];