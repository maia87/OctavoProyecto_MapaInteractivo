var mapa // Mapa que vamos a modificar
// PosicionCentral tiene las coordenadas donde se va a centrar el mapa
var posicionCentral = {lat: -32.9017769, lng: -68.85342889999998}

// Inicializa el mapa con un valor de zoom y una locación en el medio
function inicializarMapa () {
  mapa = new google.maps.Map(document.getElementById('map'), {
    center: posicionCentral,
    zoom: 14
  })

  geocodificadorModulo.inicializar()
  marcadorModulo.inicializar()
  direccionesModulo.inicializar()
  lugaresModulo.inicializar()
  streetViewModulo.inicializar()
}
