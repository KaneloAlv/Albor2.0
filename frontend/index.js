// para cuando se da click en ver mas
    document.addEventListener('DOMContentLoaded', function() {
        const verMasBtn = document.getElementById('ver-mas-productos');
        const verMasContainer = document.getElementById('ver-mas-container');
        const productosContainer = document.getElementById('productos-container');
        let productosCargados = 0;
        const productosPorCarga = 6;
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

        function cargarProductos(cantidad) {
            for (let i = 0; i < cantidad; i++) {
                if (productosCargados < todosLosProductos.length) {
                    const producto = todosLosProductos[productosCargados];
                    const nuevoCol = document.createElement('div');
                    nuevoCol.classList.add('col');
                    nuevoCol.innerHTML = `
                    <div class="card h-100">
                        <div class="image-container">
                            <img src="public/${producto.imagen}" class="card-img-top img-fluid" alt="${producto.nombre}" loading="lazy">
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">${producto.nombre}</h5>
                            <p class="card-text small text-muted mb-2">${producto.descripcion}</p>
                            <p class="fw-bold mb-2 precioActual" > Precio Actual: <span style="color: black;">$${producto.precioActual}</span></p>
                            <a
                                href="https://wa.me/573045760304?text=${encodeURIComponent(`Hola, quiero saber el precio de este producto:\n\n${producto.nombre}\n${producto.descripcion}\nImagen: https://albor.com/public/${producto.imagen}`)}"
                                target="_blank"
                                class="btn btn-success btn-sm rounded-pill w-100"
                            >
                                <i class="bi bi-whatsapp me-1"></i> Preguntar por WhatsApp
                            </a>
                        </div>
                    </div>
                `;

                    productosContainer.appendChild(nuevoCol);
                    productosCargados++;
                }
            }

            // Ocultar el botón si se cargaron todos los productos
            if (productosCargados >= todosLosProductos.length) {
                verMasContainer.style.display = 'none';
            }
        }

        // Cargar los primeros 6 productos al cargar la página
        cargarProductos(productosPorCarga);

        verMasBtn.addEventListener('click', function() {
            cargarProductos(productosPorCarga);
        });
    });
    
  // Obtener todos los botones con el ID 'botonRegresar'
  document.querySelectorAll("#botonRegresar").forEach((boton) => {
    boton.addEventListener("click", function (e) {
      e.preventDefault(); // Evita el comportamiento por defecto del botón
      window.location.href = "index.html"; // regresar a la pagina principal
    })  
    });
