document.addEventListener('DOMContentLoaded', function () {
  const formulario = document.getElementById('form-cuento');
  const contenedorFormulario = document.getElementById('formulario-contenedor');
  const contenedorResultado = document.getElementById('resultado-contenedor');
  const resultadoDiv = document.getElementById('texto-cuento');
  const cursor = document.getElementById('cursor');
  const botonNuevoCuento = document.getElementById('nuevo-cuento');
  const hadaContainer = document.getElementById('hada-container');
  const hada = document.getElementById('hada-madrina');

  function limpiarFormulario() { //Restablece el formulario a su estado original (limpia los campos).
    formulario.reset();
    formulario.classList.remove('was-validated');
  }

  formulario.addEventListener('submit', function (e) { //Detecta cuando el usuario hace clic en "Enviar".
    e.preventDefault(); //Evita que se recargue la página y detiene el comportamiento por defecto del formulario.
    e.stopPropagation();

//Obtiene los valores ingresados por el usuario en el formulario y los limpia de espacios innecesarios.


    const nombre = document.getElementById('nombre-completo').value.trim();
    const apodo = document.getElementById('apodo').value.trim();
    const cabello = document.getElementById('cabello').value.trim().toLowerCase();
    const ojos = document.getElementById('ojos').value.trim().toLowerCase();
    const edad = document.getElementById('edad').value.trim();
    const hobby = document.getElementById('hobby').value.trim().toLowerCase();
    
    //Si algún campo está vacío, muestra una alerta y detiene el proceso.

    if (!nombre || !apodo || !cabello || !ojos || !edad || !hobby) {
      alert("Por favor, completa todos los campos.");
      return;
    }
 //Contiene 5 posibles cuentos con espacios dinámicos para insertar los datos del usuario.
    const cuentos = [
      `Un día, ${nombre}, conocido cariñosamente como "${apodo}", descubrió una vela con aroma a lavanda en Albor. Con su cabello ${cabello} y sus ojos ${ojos}, encendió la vela y, al instante, una oleada de recuerdos le envolvió. Fue como volver a vivir su pasión por ${hobby}, con la misma emoción de siempre.`,
      `${apodo}, con ${edad} años, eligió una vela de canela durante su visita a Albor. Apenas sintió el aroma, fue transportado a sus recuerdos más entrañables, todos ellos ligados a momentos especiales haciendo lo que más ama: ${hobby}.`,
      `En la tranquilidad de su hogar, ${nombre} encendió una vela con suave fragancia de vainilla. Sus ojos ${ojos} brillaban con nostalgia y su cabello ${cabello} relucía con la luz de la llama. En silencio, soñaba despierto, reviviendo escenas llenas de alegría mientras practicaba ${hobby}.`,
      `${nombre}, a quien todos conocían como "${apodo}", eligió una vela de jazmín. Al prenderla, una cálida sensación le abrazó. Recordó con ternura los momentos felices de su vida, siempre acompañados por su amor por ${hobby}.`,
      `Durante una visita a Albor, ${apodo} se sintió atraído por una vela de sándalo. Al encenderla, su mente voló hacia los días más dulces de su infancia, cuando dedicaba horas a ${hobby}, rodeado de inocencia y alegría.`
    ];

    const cuentoAleatorio = cuentos[Math.floor(Math.random() * cuentos.length)]; //Escoge uno al azar del arreglo de cuentos.
    
    contenedorFormulario.classList.add('d-none'); //Esconde el formulario y muestra la sección del cuento.
    contenedorResultado.classList.remove('d-none');

    //Limpia el texto anterior, muestra el cursor, aparece el hada, y llama a la función typeWriter() para escribir el cuento letra por letra.
    resultadoDiv.textContent = '';
    cursor.style.display = 'inline-block';
    hadaContainer.classList.add('visible');
    
    typeWriter(cuentoAleatorio, 0);
    limpiarFormulario(); //Finalmente limpia el formulario para un nuevo uso.


  });
//Agrega una letra del texto por cada llamada.
  function typeWriter(text, i) {
    if (i < text.length) {
      resultadoDiv.textContent += text.charAt(i);
      i++;
      
      // Hacer que el hada haga magia cada 15 caracteres
      if (i % 15 === 0) {
        hada.classList.add('hada-magica');
        setTimeout(() => hada.classList.remove('hada-magica'), 500);
      }
      
      setTimeout(() => typeWriter(text, i), Math.random() * 30 + 30);
    } else {
      cursor.style.display = 'none';
      setTimeout(() => hadaContainer.classList.remove('visible'), 2000); //Al terminar, oculta el cursor y después de 2 segundos desaparece el hada.
    }
  }
//Al hacer clic, oculta el resultado anterior y muestra el formulario otra vez.
  botonNuevoCuento.addEventListener('click', function () {
    contenedorResultado.classList.add('d-none');
    contenedorFormulario.classList.remove('d-none');
    document.getElementById('nombre-completo').focus();
  });
document.getElementById('botonRegresarFormulario')?.addEventListener('click', function(e) {
    e.preventDefault();
    regresarAPaginaPrincipal();
  });
  document.getElementById('botonRegresarResultado')?.addEventListener('click', function(e) {
    e.preventDefault();
    regresarAPaginaPrincipal();
  });

  function regresarAPaginaPrincipal() {
    window.location.href = "../index.html";
  }

  
document.getElementById('botonWhatsApp').addEventListener('click', function () {
    const textoCuento = document.getElementById('texto-cuento').innerText.trim();
    
    if (textoCuento.length === 0) {
        alert('Primero debes generar un cuento.');
        return;
    }

    const mensaje = encodeURIComponent("¡Hola! Aquí tienes el cuento personalizado que generé:\n\n" + textoCuento);
    const url = `https://wa.me/?text=${mensaje}`;

    this.href = url; // Actualiza el enlace dinámicamente
})
})
