geocodificadorModulo = (function () {
  var geocodificador // Geocodificador que dada una dirección devuelve una coordenada
  var mapa

  /* Permite obtener las coordenadas (a partir de la dirección pasada por parámetro)
  y las usa con la función llamada por parámtero (que también tiene 2 parámetros:
  direccion y coordenada)*/
  function usaDireccion (direccion, funcionALlamar) {
    geocodificador.geocode({'address': direccion}, function (res, status) {
      console.log(res) //para ver como es la respuesta del geocodificador
      if (status === google.maps.GeocoderStatus.OK) {
        var coordenada = res[0].geometry.location // coordenada de tipo LatLng
        funcionALlamar(direccion, coordenada);
      }
      /*Cuando no se pueda obtener una ruta, el campos status mostrará información sobre por qué falló*/
      else {
        swal ({
          title: 'Error!',
          text: 'El pedido de direcciones falló debido a ' + status,
          type: 'error',
          confirmButtonText: 'OK'
        })
      }
    })
  }

  // Inicializo el geocoder que obtiene las coordenadas a partir de una dirección
  // La variable dirección es igual al texto ingresado por el usuario
  // Llama a la función usaDireccion para agregarla a los listados y mostrarlo en el mapa
  function inicializar () {
    var that = this
    geocodificador = new google.maps.Geocoder()

    // cuando se presiona la tecla enter en el campo direccion, se agrega la dirección y se muestra en el mapa
    document.querySelector('#direccion').addEventListener('keypress', function (e) {
      var key = e.which || e.keyCode
      if (key === 13) { // 13 is code for enter
        var direccion = document.getElementById('direccion').value
        that.usaDireccion(direccion, direccionesModulo.agregarDireccionYMostrarEnMapa)
      }
    })
  }

  return {
    usaDireccion,
    inicializar
  }
})()
