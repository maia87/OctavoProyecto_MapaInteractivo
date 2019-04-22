streetViewModulo = (function () {
  var paronama // 'Visor' de StreetView

  // Crea una varible panorama (instancia de StreetViewPanorama) con una posición, el elemento HTML donde se mostrará el mapa
  function inicializar () {
    panorama = new google.maps.StreetViewPanorama(
      document.getElementById('pano'), {
        position: posicionCentral,
        pov: {
          heading: 0,
          pitch: 0
        },
        visible: true
      })
      mapa.setStreetView(panorama)
    }

    /*Actualiza la posición de la variable panorama y cambia el mapa de modo tal que se vea
    el streetView de la posición actual */
    function fijarStreetView (ubicacion) {
      panorama.setPosition(ubicacion) // Actualiza la ubicación
      mapa.setStreetView(panorama) // Lo muestra en el mapa
    }

    return {
      inicializar,
      fijarStreetView
    }
  })()
