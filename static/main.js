var url,cityID;
let cuisineChoice = new Map();
let cuisineID = new Map();
let resTypeChoice = new Map();
let resTypeID = new Map();
var state = 0;
var firstInList = true;
var list = [];

$(document).ready(function() {
    //storing restaurant info
    class restaurant{
        location = "";
        features = [];
        rating = "";
        open = "";
        name; id; picked = false; thumbnail = "";
        constructor(name,id){
            this.name = name;
            this.id = id;
        }
        setLocation(loc){
            this.location = loc;
        }
        setOpenTimes(time){
            this.open = time;
        }
        setFeatures(feat){
            this.features = feat;
        }
        setRating(rate){
            this.rating = rate;
        }
        setPic(thumbnail){
            this.thumbnail = thumbnail;
        }
    }

    $("#findByC").click(function() {
        $("#citySearch").toggle();
    });
    $("#findByL").click(function() {
        $("#addressSearch").toggle();
    });
    $("#cityGoBtn").click(function() {
        url = 'https://developers.zomato.com/api/v2.1/cities?';
        url += "q=" + $('#cityName').val();
        fetch(url, {
            headers:{
                'user-key': '9ad0b763ba1a09e45d3c3eeb9e621a16'
            }
        }).then(function(response){
            return response.json();
        }).then(function(val){
        //    console.log(JSON.stringify(val));
            var city = JSON.stringify(val);
            cityID = JSON.parse(city).location_suggestions[0].id;
        //    console.log(cityID);
            findCuisine();
        })

    });
    $("#nextBtn").click(function(){
        if(state == 1){
            state++;
            //console.log(resTypeID);
            if(resTypeID.size == 0){
                findResType();
            }
            else{
                showResType();
            }
        }
        else if(state == 2){
            state++;
            findRestaurant();
        }
    });
    $("#prevBtn").click(function(){
        if(state == 2){
            state--;
            showCuisine();
        }
        if(state == 3){
            state--;
            showResType();
        }
        if(state == 4){
            state--;
            showRestaurant();
        }
    });
    function findCuisine(){
        url = 'https://developers.zomato.com/api/v2.1/cuisines?';
        url += 'city_id=';
        //console.log(cityID);
        url+= cityID.toString();
        fetch(url, {
            headers:{
                'user-key': '9ad0b763ba1a09e45d3c3eeb9e621a16'
            }
        }).then(function(response){
            return response.json();
        }).then(function(val){
            //console.log(JSON.stringify(val));
            var cuis = JSON.stringify(val);
            var arr = JSON.parse(cuis);
            for(i = 0; i < arr.cuisines.length; i++){
                cuisineChoice.set(arr.cuisines[i].cuisine.cuisine_id,false);
                cuisineID.set(arr.cuisines[i].cuisine.cuisine_name,arr.cuisines[i].cuisine.cuisine_id);
            }
            showCuisine();
            state = 1;
        })
    };
    function findResType(){
        url = 'https://developers.zomato.com/api/v2.1/establishments?';
        url += 'city_id=';
        //console.log(cityID);
        url+= cityID.toString();
        fetch(url, {
            headers:{
                'user-key': '9ad0b763ba1a09e45d3c3eeb9e621a16'
            }
        }).then(function(response){
            return response.json();
        }).then(function(val){
            //console.log(JSON.stringify(val));

            var cuis = JSON.stringify(val);
            var arr = JSON.parse(cuis);
            for(i = 0; i < arr.establishments.length; i++){
                resTypeChoice.set(arr.establishments[i].establishment.id,false);
                resTypeID.set(arr.establishments[i].establishment.name,arr.establishments[i].establishment.id);
            }
            showResType();
        })
    }
    function findRestaurant(){
        url = 'https://developers.zomato.com/api/v2.1/search?';
        url+= 'entity_id=';
        url+= cityID.toString();
        url+= '&entity_type=city&cuisines=';
        firstInList = true;
        for (let [a, b] of cuisineChoice) {
            if(b && firstInList){
                url+=a.toString();
                firstInList = false;
            }
            else if(b){
                url+='%2C';
                url+=a.toString();
            }
        }
        url+='&establishment_type=';
        firstInList = true;
        for (let [a, b] of resTypeChoice) {
            if(b && firstInList){
                url+=a.toString();
                firstInList = false;
            }
            else if(b){
                url+='%2C';
                url+=a.toString();
            }
        }
        url+='&sort=rating&order=desc';

        fetch(url, {
            headers:{
                'user-key': '9ad0b763ba1a09e45d3c3eeb9e621a16'
            }
        }).then(function(response){
            return response.json();
        }).then(function(val){
            console.log(JSON.stringify(val));
            var cuis = JSON.stringify(val);
            var arr = JSON.parse(cuis);
            list.length = 0;
            for(i = 0; i < arr.restaurants.length; i++){
                console.log(arr.restaurants[i].restaurant.name);
                let res = new restaurant(arr.restaurants[i].restaurant.name, arr.restaurants[i].restaurant.id);
                res.setLocation(arr.restaurants[i].restaurant.location.address);
                res.setRating(arr.restaurants[i].restaurant.user_rating.aggregate_rating);
                res.setOpenTimes(arr.restaurants[i].restaurant.timings);
                res.setFeatures(arr.restaurants[i].restaurant.highlights);
                res.setPic(arr.restaurants[i].restaurant.thumb)
                list.push(res);
            }
            showRestaurant();
        })
    }
    function showCuisine(){
        $("#screen").html("");
        for (let [a, b] of cuisineID) {
            generateCuisineIcon(a);
        }
    }
    function showResType(){
        $("#screen").html("");
        for (let [a, b] of resTypeID) {
            generateResTypeIcon(a);
        }
    }
    function showRestaurant(){
        $("#screen").html("");
        for (i = 0; i < list.length; i++) {
            generateRestaurantIcon(list[i],i);
        }
        //console.log(list);
    }
    var generateCuisineIcon = function(NAME){
        var str = ""; var bool = cuisineChoice.get(cuisineID.get(NAME));
        str+='<div class="col-md-4"><div class="card mb-4 shadow-sm"><svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: Thumbnail"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"/><text x="50%" y="50%" fill="#eceeef" dy=".3em"></text></svg>';
        str+='<div class="card-body"><p class="card-text">';
        str+=NAME;
        str+='</p><div class="d-flex justify-content-between align-items-center"><div class="btn-group"><button type="button" class="btn btn btn-outline-secondary">View</button></div><div class="form-check"><input class="form-check-input" type="checkbox" value="" onchange=\'handleCuisine(this);\' id = \''+NAME+'\'';
        if(bool)
            str+='checked';
        str+='></div>';
        str+= '<small class="text-muted">Cuisine Type</small></div></div></div></div>';
        $("#screen").append(str);
        //console.log(bool);
    }
    var generateResTypeIcon = function(NAME){
        var str = ""; var bool = resTypeChoice.get(resTypeID.get(NAME));
        str+='<div class="col-md-4"><div class="card mb-4 shadow-sm"><svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: Thumbnail"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"/><text x="50%" y="50%" fill="#eceeef" dy=".3em"></text></svg>';
        str+='<div class="card-body"><p class="card-text">';
        str+=NAME;
        str+='</p><div class="d-flex justify-content-between align-items-center"><div class="btn-group"><button type="button" class="btn btn btn-outline-secondary">View</button></div><div class="form-check"><input class="form-check-input" type="checkbox" value="" onchange=\'handleResType(this);\' id = \''+NAME+'\'';
        if(bool)
            str+='checked';
        str+='></div>';
        str+= '<small class="text-muted">Restaurant Type</div></div></div>';
        $("#screen").append(str);
    }

    var generateRestaurantIcon = function(RES_NAME,idx){
        var str = ""; var bool = RES_NAME.picked;
        str+='<div class="col-md-4"><div class="card mb-4 shadow-sm"><img class="bd-placeholder-img card-img-top" width="100%" height="225" src=\"'+RES_NAME.thumbnail +'\" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: Thumbnail"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"/><text x="50%" y="50%" fill="#eceeef" dy=".3em"></text></img>';
        str+='<div class="card-body"><p class="card-text">';
        str+=RES_NAME.name;
        str+='</p><div class="d-flex justify-content-between align-items-center" ><div class="btn-group"><button type="button" class="btn btn btn-outline-secondary" onclick = \'queryRestaurant(this);\' id = \''+idx+'\' >View</button></div><div class="form-check"><input class="form-check-input" type="checkbox" value="" onchange=\'handleRestaurant(this);\'id = \''+idx+'\'';
        if(bool)
            str+='checked';
        str+='></div>';
        str+= '<small class="text-muted">Restaurant</div></div></div>';
        $("#screen").append(str);
    }
});
