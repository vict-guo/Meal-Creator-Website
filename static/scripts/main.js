var request = new XMLHttpRequest();

request.open('GET','https://developers.zomato.com/api/v2.1/categories');

request.setRequestHeader('user-key', '9ad0b763ba1a09e45d3c3eeb9e621a16')

request.responseType = 'text';

request.onload = function(){
    console.log(request.response);
};

request.send();
