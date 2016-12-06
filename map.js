      function draw_map(lat_1, lon_1, lat_2, lon_2) {
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 3,
          center: {lat: 0, lng: -180},
          mapTypeId: 'terrain'
        });

        var flightPlanCoordinates = [
          {lat: lat_1, lng: lon_1},
          {lat: lat_2, lng: lon_2},
        ];
        var flightPath = new google.maps.Polyline({
          path: flightPlanCoordinates,
          strokeColor: 'blue',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: 'blue',
          fillOpacity: 0.35

        });
        var start_point = new google.maps.LatLng(lat_1, lon_1);
        var end_point = new google.maps.LatLng(lat_2, lon_2);

        var marker = new google.maps.Marker({
          position: start_point,
          label: 'S',
          map: map
        });

        var markerTwo = new google.maps.Marker({
          position: end_point,
          label: 'E',
          map: map
        });
  
        var firstMarkerText = "Entry";
        var secondMarkerText = "End";        
        var infowindow = new google.maps.InfoWindow({
            content: firstMarkerText
        });
        infowindow.open(map, marker);

        var infowindowTwo = new google.maps.InfoWindow({
            content: secondMarkerText
        });
        infowindowTwo.open(map, markerTwo);

        flightPath.setMap(map);
        var bounds = new google.maps.LatLngBounds();
        bounds.extend(start_point);
        bounds.extend(end_point);
        map.fitBounds(bounds);
      }

    