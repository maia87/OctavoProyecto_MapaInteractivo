direccionesModulo = (function () {
  var servicioDirecciones // Servicio que calcula las direcciones
  var mostradorDirecciones // Servicio que muestra las direcciones

  // Calcula las rutas cuando se cambian los lugares de desde, hasta o algun punto intermedio
  function calcularRutasConClic () {
    document.getElementById('comoIr').addEventListener('change', function () {
      direccionesModulo.calcularYMostrarRutas()
    })

    document.getElementById('calcularMuchos').addEventListener('click', function () {
      direccionesModulo.calcularYMostrarRutas()
    })

    var listasLugares = document.getElementsByClassName('lugares')
    for (var j = 0; j < listasLugares.length; j++) {
      listasLugares[j].addEventListener('change', function () {
        if (document.getElementById('desde').value != '' && document.getElementById('desde').value != '') {
          direccionesModulo.calcularYMostrarRutas()
        }
      })
    }
  }

  // Agrega la dirección en las lista de Lugares Intermedios en caso de que no estén
  function agregarDireccionEnLista (direccion, coord) {
    var lugaresIntermedios = document.getElementById('puntosIntermedios')

    var haceFaltaAgregar = true
    for (i = 0; i < lugaresIntermedios.length; ++i) {
      if (lugaresIntermedios.options[i].text.replace(/\r?\n|\r/g, ' ') === direccion.replace(/\r?\n|\r/g, ' ')) {
        haceFaltaAgregar = false
      }
    }
    if (haceFaltaAgregar) {
      var opt = document.createElement('option')
      opt.value = coord
      opt.innerHTML = direccion
      lugaresIntermedios.appendChild(opt)
    }
  }

  // Agrega la dirección en las listas de puntos intermedios y lo muestra con el street view
  function agregarDireccionYMostrarEnMapa (direccion, ubicacion) {
    that = this
    var ubicacionTexto = ubicacion.lat() + ',' + ubicacion.lng()
    agregarDireccionEnLista(direccion, ubicacionTexto)
    mapa.setCenter(ubicacion)
    streetViewModulo.fijarStreetView(ubicacion)
    marcadorModulo.mostrarMiMarcador(ubicacion)
  }

  function agregarDireccion (direccion, ubicacion) {
    that = this
    var ubicacionTexto = ubicacion.lat() + ',' + ubicacion.lng()
    agregarDireccionEnLista(direccion, ubicacionTexto)
    mapa.setCenter(ubicacion)
  }

  // Inicializo las variables que muestra el panel y el que calcula las rutas
  function inicializar () {
    calcularRutasConClic()

    // Agrega la direccion cuando se presion enter en el campo agregar
    $('#agregar').keypress(function (e) {
      if (e.keyCode == 13) {
        var direccion = document.getElementById('agregar').value
        geocodificadorModulo.usaDireccion(direccion, direccionesModulo.agregarDireccion)
      }
    })
    // Calcula las rutas cuando se presion enter en el campo DESDE y hay un valor disitnto a vacío en 'hasta'
    $('#desde').keypress(function (e) {
      if (e.keyCode == 13 && document.getElementById('hasta').value != '') {
        direccionesModulo.calcularYMostrarRutas()
      }
    })

    // Calcula las rutas cuando se presion enter en el campo HASTA y hay un valor disitnto a vacío en 'desde'
    $('#hasta').keypress(function (e) {
      if (e.keyCode == 13 && document.getElementById('desde').value != '') {
        direccionesModulo.calcularYMostrarRutas()
      }
    })

    servicioDirecciones = new google.maps.DirectionsService()
    mostradorDirecciones = new google.maps.DirectionsRenderer({
      draggable: true,
      map: mapa,
      panel: document.getElementById('directions-panel-summary'),
      suppressMarkers: true
    })
  }

  /*Calcula la ruta entre las dos posiciones (DESDE y HASTA) y luego muestra la ruta
  Dependiendo de la forma en que el usuario quiere ir de un camino al otro, por ejemplo auto. */
  function calcularYMostrarRutas () {
    var ptsIntermedios = []
    var intermedios = document.getElementById('puntosIntermedios')
    for (var i = 0; i < intermedios.length; i++) {
      if (intermedios.options[i].selected) {
        ptsIntermedios.push({
          location: intermedios[i].value,
          stopover: true
        })
      }
    }

    var formaDeIrPedida = document.getElementById('comoIr').value
    console.log(formaDeIrPedida)
    var formaDeIr
    switch (formaDeIrPedida) {
      case 'Caminando':
        formaDeIr = google.maps.TravelMode.WALKING
        break
      case 'Auto':
        formaDeIr = google.maps.TravelMode.DRIVING
        break
      case 'Bus/Subterraneo/Tren':
        formaDeIr = google.maps.TravelMode.TRANSIT
        break
    }

    // Calcula las rutas con los puntos intermedios
    if (!((formaDeIrPedida === 'Bus/Subterraneo/Tren') && (ptsIntermedios.length > 0))) {
      servicioDirecciones.route({
        origin: document.getElementById('desde').value,
        destination: document.getElementById('hasta').value,
        waypoints: ptsIntermedios,
        optimizeWaypoints: false,
        travelMode: formaDeIr,
        provideRouteAlternatives: true
      }, function (response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
          mostradorDirecciones.setDirections(response)
        } else {
          swal({
            title: 'Error!',
            text: 'El pedido de direcciones falló debido a ' + status,
            type: 'error',
            confirmButtonText: 'Ok'
          })
        }
      })
      // Agrega el marcador del comienzo con una A
      marcadorModulo.agregarMarcadorRuta(document.getElementById('desde').value, 'A', true)
      // Agrega los marcadores de los puntos intermedios con letras consecutivas.
      for (var i = 0; i < ptsIntermedios.length; i++) {
        var letter = String.fromCharCode('B'.charCodeAt(0) + i)
        marcadorModulo.agregarMarcadorRuta(ptsIntermedios[i].location, letter, false)
      }
      marcadorModulo.agregarMarcadorRuta(document.getElementById('hasta').value, String.fromCharCode('B'.charCodeAt(0) + ptsIntermedios.length), false)
    } else {
      swal({
        title: 'Error!',
        text: 'Solo podes hacer este tipo de busqueda sin puntos intermedios',
        type: 'error',
        confirmButtonText: 'Ok'
      })
    }
  }

  return {
    inicializar,
    agregarDireccion,
    agregarDireccionEnLista,
    agregarDireccionYMostrarEnMapa,
    calcularYMostrarRutas
  }
}())
