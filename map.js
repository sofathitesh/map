
   Number.prototype.toRad = function() {
      return this * Math.PI / 180;
   }

   Number.prototype.toDeg = function() {
      return this * 180 / Math.PI;
   }


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
        var flightPlanCoordinates_two = [
          new google.maps.LatLng(lat_1, lon_1),
          new google.maps.LatLng(lat_2, lon_2)
        ];

        var flightPath = new google.maps.Polyline({
          path: flightPlanCoordinates,
          strokeColor: 'blue',
          strokeOpacity: 0.8,
          strokeWeight: 6,
          fillColor: 'blue',
          fillOpacity: 0.35

        });
        var start_point = new google.maps.LatLng(lat_1, lon_1);
        var end_point = new google.maps.LatLng(lat_2, lon_2);
        var distance = google.maps.geometry.spherical.computeDistanceBetween (start_point, end_point);
        var new_points = [];
        new_points[0] = Math.round((distance*10)/100);
        new_points[1] = Math.round((distance*50)/100);
        new_points[2] = Math.round((distance*90)/100);
        var caption  = [];
        caption[0] = "Hole one";
        caption[1] = "Hole two";
        caption[2] = "Hole three";
        for(var i=0; i< new_points.length;i++){
          new google.maps.InfoWindow({
            content: caption[i]
        }).open(map,  new google.maps.Marker({
            position: moveAlongPath(flightPlanCoordinates_two, new_points[i]),
            map: map,
            icon:'dot.png'
          }));
        }
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
        var secondMarkerText = "Exit";        
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

   function moveTowards(point, distance) {   
      var lat1 = point[0].lat().toRad();
      var lon1 = point[0].lng().toRad();
      var lat2 = point[1].lat().toRad();
      var lon2 = point[1].lng().toRad();         
      var dLon = (point[1].lng() - point[0].lng()).toRad();

      // Find the bearing from this point to the next.
      var brng = Math.atan2(Math.sin(dLon) * Math.cos(lat2),
                            Math.cos(lat1) * Math.sin(lat2) -
                            Math.sin(lat1) * Math.cos(lat2) * 
                            Math.cos(dLon));

      var angDist = distance / 6371000;  // Earth's radius.

      // Calculate the destination point, given the source and bearing.
      lat2 = Math.asin(Math.sin(lat1) * Math.cos(angDist) + 
                       Math.cos(lat1) * Math.sin(angDist) * 
                       Math.cos(brng));

      lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(angDist) *
                               Math.cos(lat1), 
                               Math.cos(angDist) - Math.sin(lat1) *
                               Math.sin(lat2));

      if (isNaN(lat2) || isNaN(lon2)) return null;
      return new google.maps.LatLng(lat2.toDeg(), lon2.toDeg());
   }



   function moveAlongPath(points, distance, index) {        
      index = index || 0;  // Set index to 0 by default.

      if (index < points.length) {
         // There is still at least one point further from this point.

         // Construct a GPolyline to use the getLength() method.

         // Get the distance from this point to the next point in the polyline.
         var distanceToNextPoint = google.maps.geometry.spherical.computeDistanceBetween (points[0],points[1]);


         if (distance <= distanceToNextPoint) {
            // distanceToNextPoint is within this point and the next. 
            // Return the destination point with moveTowards().
            return moveTowards(points, distance);
         }
         else {
            // The destination is further from the next point. Subtract
            // distanceToNextPoint from distance and continue recursively.
            return moveAlongPath(points,
                                 distance - distanceToNextPoint,
                                 index + 1);
         }
      }
      else {
         // There are no further points. The distance exceeds the length  
         // of the full path. Return null.
         return null;
      }  
   }    

   function prints(){
    window.print();
   }