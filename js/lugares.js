lugaresModulo = (function () {
  var servicioLugares // Servicio para obtener lugares cercanos e información de lugares(como fotos, puntuación del lugar,etc).

  // Autocompleta los 4 campos de texto de la página (las direcciones ingresables por el usuario).
  // A su vez creo un círculo de radio de 20000 metros para fijar los límites de la búsqueda de dirección
  function autocompletar () {
    var lugarAutocompleto = new google.maps.places.Autocomplete(document.getElementById('direccion'), { strictBounds: true })
    var desdeAutocompleto = new google.maps.places.Autocomplete(document.getElementById('desde'), { strictBounds: true })
    var hastaAutocompleto = new google.maps.places.Autocomplete(document.getElementById('hasta'), { strictBounds: true })
    var agregarAutocompleto = new google.maps.places.Autocomplete(document.getElementById('agregar'), { strictBounds: true })

    var circulo = new google.maps.Circle({
      center: posicionCentral,
      radius: 20000,
      visible: false, // Para que no se vea en el mapa
      map: mapa
    })

    lugarAutocompleto.setBounds(circulo.getBounds())
    desdeAutocompleto.setBounds(circulo.getBounds())
    hastaAutocompleto.setBounds(circulo.getBounds())
    agregarAutocompleto.setBounds(circulo.getBounds())
  }

  // Inicializa la variable servicioLugares y llama a la función autocompletar
  function inicializar () {
    /*//constructor de la clase PlacesService: Crea una nueva instancia del PlacesService que representa las
    atribuciones en el contenedor mapa del HTML */
    servicioLugares = new google.maps.places.PlacesService(mapa)
    autocompletar()
  }

  /* Realiza la búsqueda de los lugares del tipo (tipodeLugar) y con el radio indicados
  en el HTML cerca del lugar pasado como parámetro y llama a la función marcarLugares. */
  function buscarCerca (posicion) {
    servicioLugares.nearbySearch({
      location: posicion,
      radius: document.getElementById('radio').value, // Obtiene el radio del elemento radio
      types: [document.getElementById('tipoDeLugar').value] // Obtiene el tipoDeLugar especificado en el HTML
    }, marcadorModulo.marcarLugares); // Marco los lugares que obtuvo en la búsqueda
  }
  return {
    inicializar,
    buscarCerca
  }
})()
