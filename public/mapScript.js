//VARIABLES GLOBALES//////////
let depart = null;
let arrive = null;
let point = null;
let pointsList = null;





//FONCTIONS////////////////////

//INITIALISATION DE LA MAP
function initMap() {
    //Ajout des services permettant l'affichage de la carte, l'affichage des trajets et le calcul du temps et de la distance du trajet
    const directionsRenderer = new google.maps.DirectionsRenderer();
    const directionsService = new google.maps.DirectionsService();

    //Paris sera le point de focus de la map au moment de l'afficher pour la première fois
    const Paris = { lat: 48.864716, lng: 2.349014 };

    //Paramètrage et affichage de la carte
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 6,
        center: Paris,
        mapTypeid: google.maps.MapTypeId.ROADMAP
    });
    directionsRenderer.setMap(map);


    //Listener sur le select pour le type de recherche
    selectM = document.getElementById("selectM");
    selectM.onchange = function() {
        //On reset les listeners ainsi que les variables globales
        google.maps.event.clearListeners(map, 'click');
        depart = null;
        arrive = null;
        point = null;
        pointsList = null;
        if(selectM.value == "pointBorne"){
            document.getElementById("trajetPC").style.display = "none";
            document.getElementById("trajetP").style.display = "none";
            document.getElementById("pointBorneP").style.display = "block";
        }else if(selectM.value == "trajetClick") {
            document.getElementById("trajetPC").style.display = "block";
            document.getElementById("trajetP").style.display = "none";
            document.getElementById("pointBorneP").style.display = "none";
            //Listener pour le trajet entre 2 click
            map.addListener("click", (mapsMouseEvent) => {
                var departIn = document.getElementById("departPC");
                var arriveeIn = document.getElementById("arriveePC");
                var distancePC = document.getElementById("distancePC");
                var tempsPC = document.getElementById("tempsPC");
                var res = mapsMouseEvent.latLng.toJSON();
                if(!depart){
                    departIn.innerHTML ="";
                    arriveeIn.innerHTML ="";
                    distancePC.innerHTML ="";
                    tempsPC.innerHTML ="";
                    depart = { lat: res.lat , lng: res.lng };
                    departIn.innerHTML = "latitude: "+ depart.lat +", longitude: "+depart.lng;
                    //console.log(depart);
                }else if((depart)&&(arrive)){
                    depart = null;
                    arrive = null;
                    depart = { lat: res.lat , lng: res.lng };
                    departIn.innerHTML ="";
                    arriveeIn.innerHTML ="";
                    distancePC.innerHTML ="";
                    tempsPC.innerHTML ="";
                    departIn.innerHTML = "latitude: "+ depart.lat +", longitude: "+depart.lng;
                }else{
                    arrive = { lat: res.lat , lng: res.lng };
                    //console.log(arrive);
                    arriveeIn.innerHTML = "latitude: "+ arrive.lat +", longitude: "+arrive.lng;
                    calculateAndDisplayRoute(directionsService, directionsRenderer);
                }
                });
        }else if(selectM.value == "trajetAdresse"){
            document.getElementById("trajetPC").style.display = "none";
            document.getElementById("trajetP").style.display = "block";
            document.getElementById("pointBorneP").style.display = "none";
        }
    };
    


    }

//Méthode d'affichage du trajet entre 2 points
function calculateAndDisplayRoute(directionsService, directionsRenderer) {
    var distancePC = document.getElementById("distancePC");
    var tempsPC = document.getElementById("tempsPC");
    directionsService
        .route({
        origin: depart,
        destination: arrive,
        travelMode: google.maps.TravelMode['DRIVING'],
        unitSystem: google.maps.UnitSystem.METRIC
        })
        .then((response) => {

            distancePC.innerHTML = response.routes[0].legs[0].distance.text;
            tempsPC.innerHTML =response.routes[0].legs[0].duration.text;
            directionsRenderer.setDirections(response);
        })
        .catch((e) =>{
        console.log(e);
        window.alert("Une erreur est survenue lors de l'accès à la carte. La raison: " + e)
    });
}

///ASTUCES A GARDER
//console.log(response.routes["0"].overview_path);

//response.routes[0].legs[0].distance.text ; //Pour la distance du trajet
//response.routes[0].legs[0].duration.text ; //Pour le temps du trajet