//VARIABLES GLOBALES//////////
let depart = null;
let arrive = null;
let pointsList = [];
let calcButton = null;
let functionP = null;
let map;
let marker = null;
let markersList = [];
let chargedMarker = [];





//FONCTIONS////////////////////
//INITIALISATION DE LA MAP
function initMap() {
    //Variable
    calcButton = document.getElementById('trajetButton');
    resetButton = document.getElementById('resetPoints');
    //Ajout des services permettant l'affichage de la carte, l'affichage des trajets et le calcul du temps et de la distance du trajet
    const directionsRenderer = new google.maps.DirectionsRenderer();
    const directionsService = new google.maps.DirectionsService();

    //Paris sera le point de focus de la map au moment de l'afficher pour la première fois
    const Paris = { lat: 48.864716, lng: 2.349014 };

    //Paramètrage et affichage de la carte
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 6,
        center: Paris,
        mapTypeid: google.maps.MapTypeId.ROADMAP
    });
    directionsRenderer.setMap(map);


    //Listener sur le select pour le type de recherche
    selectM = document.getElementById("selectM");
    selectM.onchange = function() {
        //On reset les listeners ainsi que les variables globales
        if(document.getElementById("distancePC")){
            document.getElementById("distancePC").innerHTML = "";
        }
        if(document.getElementById("tempsPC")){
            document.getElementById("tempsPC").innerHTML = "";
        }
        if(document.getElementById("distanceP")){
            document.getElementById("distanceP").innerHTML = "";
        }
        if(document.getElementById("tempsP")){
            document.getElementById("tempsP").innerHTML = "";
        }
        if(document.getElementById("departPC")){
            document.getElementById("departPC").innerHTML = "";
        }
        if(document.getElementById("arriveePC")){
            document.getElementById("arriveePC").innerHTML = "";
        }
        if(document.getElementById("departP")){
            document.getElementById("departP").innerHTML = "";
        }
        if(document.getElementById("arriveeP")){
            document.getElementById("arriveeP").innerHTML = "";
        }
        if(document.getElementById("pointId")){
            document.getElementById("pointId").innerHTML = "";
        }
        google.maps.event.clearListeners(map, 'click');
        directionsRenderer.setDirections({routes:[]});
        depart = null;
        arrive = null;
        pointsList = [];
        marker = null;
        chargedMarker = [];
        deleteMarkers();
        markersList = [];
        if(selectM.value == "pointBorne"){
            document.getElementById("trajetPC").style.display = "none";
            document.getElementById("trajetP").style.display = "none";
            document.getElementById("pointBorneP").style.display = "block";
            map.addListener("click", (mapsMouseEvent) => {
                var res = mapsMouseEvent.latLng.toJSON();
                var point = { lat: res.lat , lng: res.lng };
                addPoint(point);
                });
            resetButton.addEventListener('click',()=>{
                setMapOnAll(null);
            });
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
                    directionsRenderer.setDirections({routes:[]});
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
            calcButton.addEventListener('click',()=>{
                depart = document.getElementById('departM').value;
                arrive = document.getElementById('arriveM').value;
                calculateAndDisplayRoute(directionsService, directionsRenderer);
            });
        }
    };
    


    }

//Méthode d'affichage du trajet entre 2 points
function calculateAndDisplayRoute(directionsService, directionsRenderer) {
    var distancePC = document.getElementById("distancePC");
    var tempsPC = document.getElementById("tempsPC");
    var distanceP = document.getElementById("distanceP");
    var tempsP = document.getElementById("tempsP");
    directionsService
        .route({
        origin: depart,
        destination: arrive,
        travelMode: google.maps.TravelMode['DRIVING'],
        unitSystem: google.maps.UnitSystem.METRIC
        })
        .then((response) => {
            if(distancePC){
                distancePC.innerHTML = response.routes[0].legs[0].distance.text;
                tempsPC.innerHTML =response.routes[0].legs[0].duration.text;
            }
            if(distanceP){
                distanceP.innerHTML = response.routes[0].legs[0].distance.text;
                tempsP.innerHTML =response.routes[0].legs[0].duration.text;
            }
            directionsRenderer.setDirections(response);
        })
        .catch((e) =>{
        console.log(e);
        window.alert("Une erreur est survenue lors de l'accès à la carte. La raison: " + e)
    });
}
//On efface les markers sur la carte
function setMapOnAll(map) {
    document.getElementById("pointId").innerHTML = "";
    for (let i = 0; i < markersList.length; i++) {
        markersList[i].setMap(map);
    }
  }
// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
    setMapOnAll(null);
    markersList = [];
}
function addPoint(point) {
        document.getElementById('pointId').innerHTML =  "latitude: "+ point.lat +", longitude: "+point.lng;
        marker = new google.maps.Marker({
            position: point,
            title:"Ici !"
        });
        marker.setMap(map);
        markersList.push(marker);
}


///ASTUCES A GARDER
//response.routes[0].legs[0].distance.text ; //Pour la distance du trajet
//response.routes[0].legs[0].duration.text ; //Pour le temps du trajet