var url,cityID;
let cuisineChoice = new Map();
let cuisineID = new Map();
let resTypeChoice = new Map();
let resTypeID = new Map();
var state = 0;

$(document).ready(function() {

    $("#findByC").click(function() {
        $("#citySearch").toggle();
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
            console.log(resTypeID);
            if(resTypeID.size == 0){
                findResType();
            }
            else{
                showResType();
            }
        }
    });
    $("#prevBtn").click(function(){
        if(state == 2){
            state--;
            showCuisine();
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
    }
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
    var generateCuisineIcon = function(NAME){
        var str = "";
        str+='<div class="col-md-4"><div class="card mb-4 shadow-sm"><svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: Thumbnail"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"/><text x="50%" y="50%" fill="#eceeef" dy=".3em"></text></svg>';
        str+='<div class="card-body"><p class="card-text">';
        str+=NAME;
        str+='</p><div class="d-flex justify-content-between align-items-center"><div class="btn-group"><button type="button" class="btn btn btn-outline-secondary">View</button></div><div class="form-check"><input class="form-check-input" type="checkbox" value="" onchange=\'handleCuisine(this);\' id = \''+NAME+'\'></div>';
        str+= '<small class="text-muted">Cuisine Type</small></div></div></div></div>';
        $("#screen").append(str);
        //console.log(typeof(NAME));
    }
    var generateResTypeIcon = function(NAME){
        var str = "";
        str+='<div class="col-md-4"><div class="card mb-4 shadow-sm"><svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: Thumbnail"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"/><text x="50%" y="50%" fill="#eceeef" dy=".3em"></text></svg>';
        str+='<div class="card-body"><p class="card-text">';
        str+=NAME;
        str+='</p><div class="d-flex justify-content-between align-items-center"><div class="btn-group"><button type="button" class="btn btn btn-outline-secondary">View</button></div><div class="form-check"><input class="form-check-input" type="checkbox" value="" onchange=\'handleResType(this);\' id = \''+NAME+'\'></div>';
        str+= '<small class="text-muted">Restaurant Type</div></div></div>';
        $("#screen").append(str);
    };

});
