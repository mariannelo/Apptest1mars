var Norkart = {}; //definerer et "namespace" som vi kan holde oss innenfor

//JQuery-funksjon. Sørger for at koden 
//inne i funksjonen kjører først _etter_ at 
//alt er lastet inn i nettleseren.
$(document).ready(function() {
    console.log("ready!");

    //starter kartmotoren (Leaflet med Norkart sine tilpasninger) 
    //lagrer referanse til objektet i Norkart.map
    Norkart.map = new WebatlasMap('kart', {
        customer: "WA_studentkurs" //ved kommersiell bruk send epost til alexander.nossum@norkart.no
    });

    //endrer senterpunkt til koordinatene og setter zoomnivå til 5
    Norkart.map.setView(new L.LatLng(63.429944, 10.396940), 15);


    /*** Asynkron innlasting av en geojson-fil *
    $.getJSON('test.geojson', function(data) {
        //vi har fått data tilbake fra AJAX-requesten
        //oppretter et geojson-lag fra Leaflet som vi lagrer i namespacet vårt
        Norkart.geojsonLag = L.geoJson(data, {
            style: {
                weight: 2,
                opacity: 0.1,
                color: 'black',
                fillOpacity: 0.7
            }
        }).addTo(Norkart.map);

    });
    /**/


    /*** Asynkron innlasting av en ekstern geojson-fil med dynamiske farger og dynamisk popup*
    var url = 'https://gist.githubusercontent.com/alexanno/aa59a4ec377658c6eada/raw/ab6005fb6ca8104266f61b6a538c6bdeed5d36b2/map.geojson';
    $.getJSON(url, function(data) {
        //vi har fått data tilbake fra AJAX-requesten
        //oppretter et geojson-lag fra Leaflet som vi lagrer i namespacet vårt
        Norkart.geojsonLag = L.geoJson(data, {
            style: lagStyle,
            onEachFeature: hverFeature
        }).addTo(Norkart.map);

        function lagStyle(feature) {
            return {
                weight: 2,
                opacity: 0.1,
                color: 'black',
                fillOpacity: 0.7,
                fillColor: lagFyll(feature.properties.kategori)
            }
        }

        function lagFyll(kat) {
            if (kat === 1) {
                return '#FF0000';
            }

            if (kat === 3) {
                return '#00FF00';
            }

            return '#0000FF';

            // alternativ
            //return kat === 1 ? '#FF0000' :
            //    kat === 3 ? '#00FF00' :
            //    '#0000FF';
            
        }

        function hverFeature(feature, layer) {
            layer.on('click', function(e) {
                console.log("CLICK!");
                console.log(this);
                console.log(e);
            })
        }
    });
    /**/

 var myIcon = L.icon({
   iconUrl: 'marker.png',

    iconSize:     [20, 30], // size of the icon
    //shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [20, 30], // point of the icon which will correspond to marker's location
    //shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [-10, -30] // point from which the popup should open relative to the iconAnchor
  });

 var yourIcon = L.icon({
   iconUrl: 'blaamarker.png',

    iconSize:     [20, 30], // size of the icon
    //shadowSize:   [50, 64], // size of the shadow
    iconAnchor:   [10, 30], // point of the icon which will correspond to marker's location
    //shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor:  [0, -30] // point from which the popup should open relative to the iconAnchor
  });

    /*** Legge til markør  */
    //Lager en markør på et koordinatpar og legger til kartet. Dette kan "chaines" som er litt mer hendig
   
    //var olavTryggvason = L.marker (new L.LatLng(63.430513, 10.395089));
    //olavTryggvason.addTo(Norkart.map);

    //chainet blir det:
    L.marker(new L.LatLng(63.426909, 10.396948), {icon: myIcon}).addTo(Norkart.map).bindPopup("<b>Nidarosdomen</b> <p>Trondheims mest kjente kirke</p> <img src= 'nidarosdomen.png' style='height: 270px; width: px;'' </img>");

    L.marker(new L.LatLng(63.430513, 10.395089), {icon: myIcon}).addTo(Norkart.map).bindPopup("<b>Olav Tryggvason</b> <p>Statue av Trondheims <u>grunnlegger</u></p> <img src= 'Olavstatue.jpg' style='height: 270px; width: px;'' </img>");

    L.marker(new L.LatLng(63.428200, 10.401784), {icon: myIcon}).addTo(Norkart.map).bindPopup("<b>Gamle bybru</b> <p>Gammel bru</p> <img src= 'bybrua.jpg' style='height: 200px; width: 250px;'' </img>");
/**/

// geoJSON-fil, resturanter på Solsiden (må være en egen fil for å få til et lag)
var url = 'Restaurant, geojson.html';
     $.getJSON(url, function(data) {
         Norkart.punktliste = [];
// //vi har fått data tilbake fra AJAX-requesten
// //oppretter et geojson-lag fra Leaflet som vi lagrer i namespacet vårt og legger til kartet vårt.
         Norkart.geojsonLag = L.geoJson(data, {
             onEachFeature: hverFeature
         });

// //legger kartlaget til i LayerControl for å la brukeren slå av og på kartlaget.
         Norkart.map.LayerControl.addOverlay(Norkart.geojsonLag,"Restaurant, geojson.html");

         function hverFeature(feature, layer) {
             layer.bindPopup(feature.properties.name);

// //lager en punktliste av alle punktene - vi skal bruke denne senere
             Norkart.punktliste.push([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]);
         }
// //Setter igang ulike typer visualiseringer
         //lagVisualiseringer();
     });


// FINNER EGEN POSISJON, bruker phonegap sin funksjon
 //definerer funksjon som skal kjøres ved event nedenfor
     function onLocationFound(e) {
         //var radius = e.accuracy / 2;
         var radius = e.coords.accuracy/2;
         if(typeof Norkart.gpsMarker === 'object') {
             Norkart.map.removeLayer(Norkart.gpsMarker);
             Norkart.map.removeLayer(Norkart.gpsCircle); 
        }

// //Lager en ny markør med koordinater (latlng) som fått igjennom "locationfound"-eventet
         L.marker([e.coords.latitude, e.coords.longitude], {icon: yourIcon}).addTo(Norkart.map)
             .bindPopup("Du er innenfor " + radius + " meter av dette punktet.").openPopup();

// //lager en sirkel med senter i koordinaten og radius = nøyaktighet/2
         Norkart.gpsCircle = L.circle([e.coords.latitude, e.coords.longitude], radius).addTo(Norkart.map);
     }
// //definerer funksjon som skal kjøres ved event nedenfor
     function onLocationError(e) {
         alert(e.message);
     }

    // GeoLocation *
    //trigger HTML5 GeoLocation via Leaflet
    Norkart.map.locate({
        setView: false,
        maxZoom: 16,
        watch: true
    });

    navigator.geolocation.getCurrentPosition(onLocationFound,onLocationError);


/*



    /* CartoDB *
    Norkart.map.on('click', function(e) {
        var latlng = e.latlng;

       //Asynkron request til CartoDB sitt SQL-api. Merk at tabellen er offentlig tilgjengelig
        var cartodb_endpoint = 'http://alexanno.cartodb.com/api/v2/sql?format=geojson&q=';
      /*  var sql = 'SELECT * FROM seiltur';
        var sql = 'SELECT * FROM seiltur ORDER BY knots DESC LIMIT 20';

        //finne de 20 nærmeste punktene - uavhengig av avstanden (KNN = K-nearest-neighbor)
        //var pointSQL = 'ST_SetSRID(ST_MakePoint(' + latlng.lng + ',' + latlng.lat + '),4326)';
        //var pointSQL3857 = 'ST_Transform(ST_SetSRID(ST_MakePoint(' + latlng.lng + ',' + latlng.lat + '),4326),3857)';
        //var sql = 'SELECT ST_Distance('+pointSQL3857+',the_geom_webmercator) avstand, * FROM seiltur ORDER BY the_geom_webmercator <-> '+ pointSQL3857 +' LIMIT 20';

        var url = cartodb_endpoint + sql;

    /*    $.getJSON(url, function(data) {
            //vi har fått data tilbake fra AJAX-requesten
            console.log(Norkart.geojsonlag);

            //fjerner det forrige geojsonlaget hvis det eksisterer
            if (typeof Norkart.geojsonLag === 'object') {
                Norkart.map.removeLayer(Norkart.geojsonLag);
            }


            //oppretter et geojson-lag fra Leaflet som vi lagrer i namespacet vårt
     /*       Norkart.geojsonLag = L.geoJson(data, {
                style: {
                    weight: 2,
                    opacity: 0.1,
    //                color: 'black',
   //                 fillOpacity: 0.7
  //              },
 //               onEachFeature: bindPopup
 //           }).addTo(Norkart.map);

       //     function bindPopup(f, layer) {
     //       	layer.on('click', function(e) {
           // 		console.log(this);
         //   	});
       //     }
     //   });
   // });

    /**/


    /**/

});