//VARIABLES GLOBALES//////////
let depart = null;
let arrive = null;
let calcButton = null;
let map;
let marker = null;
let markersList = [];
let chargedMarker = [];
let pointsChargedList = [];





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
        marker = null;
        
        deleteMarkers(markersList);
        deleteMarkers(chargedMarker);
        markersList = [];
        chargedMarker = [];
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
                deleteMarkers(markersList);
                deleteMarkers(chargedMarker);
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
    deleteMarkers(chargedMarker);
    chargedMarker = [];
    directionsService
        .route({
        origin: depart,
        destination: arrive,
        travelMode: google.maps.TravelMode['DRIVING'],
        unitSystem: google.maps.UnitSystem.METRIC
        })
        .then((response) => {
            if(distancePC){
                document.getElementById("departPC").innerHTML = response.routes[0].legs[0].start_address;
                document.getElementById("arriveePC").innerHTML = response.routes[0].legs[0].end_address;
                distancePC.innerHTML = response.routes[0].legs[0].distance.text;
                tempsPC.innerHTML =response.routes[0].legs[0].duration.text;
            }
            if(distanceP){
                distanceP.innerHTML = response.routes[0].legs[0].distance.text;
                tempsP.innerHTML =response.routes[0].legs[0].duration.text;
            }
            directionsRenderer.setDirections(response);
            makeMarkers(response.routes[0].overview_path);
        })
        .catch((e) =>{
        console.log(e);
        window.alert("Une erreur est survenue lors de l'accès à la carte. Vérifiez l'exactitude de vos informations");
    });
}
//On efface les markers sur la carte
function setMapOnAll(map,list) {
    document.getElementById("pointId").innerHTML = "";
    for (let i = 0; i < list.length; i++) {
        list[i].setMap(map);
    }
  }
// Deletes all markers in the array by removing references to them.
function deleteMarkers(list) {
    setMapOnAll(null,list);
    list = [];
}
function addPoint(point) {
        document.getElementById('pointId').innerHTML =  "latitude: "+ point.lat +", longitude: "+point.lng;
        marker = new google.maps.Marker({
            animation: google.maps.Animation.DROP,
            position: point,
        });
        marker.setMap(map);
        markersList.push(marker);
        getBornesFromPoint(point);
}

function getBornesFromPoint(point){
    fetch('https://opendata.reseaux-energies.fr/api/records/1.0/search/?dataset=bornes-irve&q=&rows=10&geofilter.distance='+point.lat+'%2C'+point.lng+'%2C10000')
    .then(response => response.json())
    .then(json => getBornesFromPointUpdate(json.records)); 
}

function getBornesFromPointList(point){
    fetch('https://opendata.reseaux-energies.fr/api/records/1.0/search/?dataset=bornes-irve&q=&rows=10&geofilter.distance='+point.lat+'%2C'+point.lng+'%2C4000')
    .then(response => response.json())
    .then(json => getBornesFromPointUpdateList(json.records)); 
}

function getBornesFromPointUpdate(data){
        for(var i in data){
            test = { lat: data[i].fields.ylatitude , lng: data[i].fields.xlongitude };
            pointsChargedList.push(test);
            marker = new google.maps.Marker({
                animation: google.maps.Animation.DROP,
                position: test,
                label: "B"
            });
            marker.setMap(map);
            marker.setAnimation(google.maps.Animation.BOUNCE);
            chargedMarker.push(marker);
        }
}

function getBornesFromPointUpdateList(data){
    for(var i in data){
        test = { lat: data[i].fields.ylatitude , lng: data[i].fields.xlongitude };
        if(!estDansList(test)){
            console.log("je suis diffèrent");
            pointsChargedList.push(test);
            marker = new google.maps.Marker({
                animation: google.maps.Animation.DROP,
                position: test,
                label: "B"
            });
            marker.setMap(map);
            marker.setAnimation(google.maps.Animation.BOUNCE);
            chargedMarker.push(marker);
        }
    }
}


function makeMarkers(data){
    var compte = 0;
    data.forEach((e)=>{
        if(compte%10==0){
            pointInter = { lat: parseFloat(e.toUrlValue(6).split(',')[0]) , lng: parseFloat(e.toUrlValue(6).split(',')[1]) };
            //getBornesFromPoint(pointInter);
            getBornesFromPointList(pointInter);
        }
        compte ++;
    });
    
}

function estDansList(point){
    for(var inter in pointsChargedList){
        if((inter.lat == point.lat)&&(inter.lng == point.lng)){
            return true;
        }
    }
    return false;
}