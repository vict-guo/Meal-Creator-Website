var url;
/*
url = 'https://developers.zomato.com/api/v2.1/categories';

fetch(url, {
    headers:{
        'user-key': '9ad0b763ba1a09e45d3c3eeb9e621a16'
    }
}).then(function(response){
    return response.json();
}).then(function(val){
    console.log(JSON.stringify(val));
})
*/

url = 'https://developers.zomato.com/api/v2.1/cities?';

$(document).ready(function() {
    $("#findByC").click(function() {
        $("#citySearch").toggle();
    });
    $("#cityGoBtn").click(function() {
        url += "q=" + $('#cityName').val();
        fetch(url, {
            headers:{
                'user-key': '9ad0b763ba1a09e45d3c3eeb9e621a16'
            }
        }).then(function(response){
            return response.json();
        }).then(function(val){
            console.log(JSON.stringify(val));
        })
    });
});
