let depart = null;
let arrive = null;
function initMap() {
    const directionsRenderer = new google.maps.DirectionsRenderer();
    const directionsService = new google.maps.DirectionsService();
    const Paris = { lat: 48.864716, lng: 2.349014 };
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 6,
        center: Paris,
        mapTypeid: google.maps.MapTypeId.ROADMAP
    });
    directionsRenderer.setMap(map);
    //calculateAndDisplayRoute(directionsService, directionsRenderer);
    map.addListener("click", (mapsMouseEvent) => {
        var res = mapsMouseEvent.latLng.toJSON();
        //debut = { lat: res["lat"] , lng: res["lng"] };
        //console.log(debut);
        // Close the current InfoWindow.
        //infoWindow.close();
        // Create a new InfoWindow.
        if(!depart){
            console.log("j'attribue le debut")
            depart = { lat: res.lat , lng: res.lng };
            console.log(depart);
        }else if((depart)&&(arrive)){
            console.log("je reset le parcours")
            depart = null;
            arrive = null;
            depart = { lat: res.lat , lng: res.lng };
        }else{
            console.log("j'attribue la fin")
            arrive = { lat: res.lat , lng: res.lng };
            console.log(arrive);
            calculateAndDisplayRoute(directionsService, directionsRenderer);
        }
        });

    }

    function calculateAndDisplayRoute(directionsService, directionsRenderer) {
    directionsService
        .route({
        origin: depart,
        destination: arrive,
        travelMode: google.maps.TravelMode['DRIVING'],
        })
        .then((response) => {
            //console.log(response.routes["0"].overview_path);
            directionsRenderer.setDirections(response);
        })
        .catch((e) =>{
        console.log(e);
        window.alert("Une erreur est survenue lors de l'accès à la carte. La raison: " + e)
    });
    }