//Initial map setup (Set map focus to Philadelphia)
var map = L.map('map', {
  center: [40.003215, -75.143526],
  zoom: 11
});
var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 18,
  ext: 'png'
}).addTo(map);

//Use ajax to import and parse Philadelphia bridge data in geojson format
var data = "https://gist.githubusercontent.com/amandayg/d621be4360c2a87db1a7c8ded45f37ca/raw/d8e7bddd6c76f55bc72352c3ad96bf611a689f60/bridge.json";
var featureGroup;
var parseData;
$.ajax(data).done(function(data) {
  parsedData = JSON.parse(data);
});

//A function to add marker to map with defined style and filtered value for each slide
var allDone = function(){
  featureGroup = L.geoJson(parsedData, {
    style: myStyle,
    filter:filterData,
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {radius: 6}, myStyle);
    }
  }).addTo(map);
};

//Set point color for each slide
var myStyle = function (feature) {
  if (state.slideNumber === 0){
    return {color: '#00ff00'};
  }
  else if (state.slideNumber === 1){
    return {color: '#33A6B8'};
  }
  else if (state.slideNumber === 2){
    return {color: '#516E41'};
  }
  else if (state.slideNumber === 3){
    return {color: '#86C166'};
  }
  else if (state.slideNumber === 4){
    return {color: '#6A8372'};
  }
  else if (state.slideNumber === 5){
    return {color: '#00896C'};
  }
};

//Set view for each slide
var zooming = function(){
  if (state.slideNumber === 0){
    map.setView([40.003215, -75.143526], 11);
  }
  if (state.slideNumber === 1){
    map.setView([39.973400, -75.161266], 12);
  }
  else if (state.slideNumber === 2){
    map.setView([40.01, -75.187759], 12);
  }
  else if (state.slideNumber === 3){
    map.setView([39.956845, -75.148657], 12);
  }
  else if (state.slideNumber === 4){
    map.setView([39.950869, -75.163507], 14);
  }
  else if (state.slideNumber === 5){
    map.setView([39.956845, -75.148657], 12);
  }

};

//Filter value to show on map for each slide
var filterData = function(feature){
  if (state.slideNumber === 0){
    return false;
  }
  else if (state.slideNumber === 1){
    if(feature.properties.CARRYING === "AMTRAK") {
      return true;
    }
  }
  else if (state.slideNumber === 2){
    if (feature.properties.CARRYING=== "SEPTA") {
      return true;
    }
  }
  else if (state.slideNumber === 3){
    if (feature.properties.CARRYING === "I-95") {
      return true;
    }
  } else if (state.slideNumber === 4){
    if(feature.properties.OVER_ === "Vine St"){
      return true;
    }
  } else if (state.slideNumber === 5){
    if (feature.properties.CARRYING === "Pedestrian Bridge (Enclosed)"){
      return true;
    }
  }
  console.log(state.slideNumber);
};

//Remove markers for previous slide
var removeData = function(){
  if (typeof featureGroup !== 'undefined') {
    map.removeLayer(featureGroup);
  }
};

//Set initial page for reset
var initialSlide = function(event){
  $("#head").text("Bridges in Philadelphia");
  $("#intro").text("Ever wondered about where you can see Philadelphia from above when you commute to the city ?");
  state.slideNumber = 0;
  removeData();
  allDone();
  zooming();
  $('.previous').hide();
  $('.next').show();
  $('.reset').hide();
  $("#current-page").text(0);
};

//Increase slide number and call function to show slide
var nextSlide = function(event) {
  if (state.slideNumber < state.slideData.length) {
    $("#head").text(state.slideData[state.slideNumber]["Name"]);
    $("#intro").text(state.slideData[state.slideNumber]["Content"]);
    state.slideNumber = state.slideNumber + 1;
    $("#current-page").text(state.slideNumber);
  }
  else {
    state.slideNumber = 0;
  }
  removeData();
  allDone();
  zooming();
  return state.slideNumber;
};

//Decrease slide number and call function to show slide
var previousSlide = function(event) {
  if (state.slideNumber > 1) {
    state.slideNumber = state.slideNumber - 1;
    $("#head").text(state.slideData[state.slideNumber-1]["Name"]);
    $("#intro").text(state.slideData[state.slideNumber-1]["Content"]);
    $("#current-page").text(state.slideNumber);
  }
  else {
    state.slideNumber = 0;
    initialSlide();
  }
  removeData();
  allDone();
  zooming();
  return state.slideNumber;
};

//navigate to next slide when click on the "next" button
//navigate to previous slide when click on the "previous" button
//reset to initial page with reset button
var clickButton = function(){
  $( ".next" ).click(function() {
    if (state.slideNumber < state.slideData.length) {
      if (state.slideNumber < state.slideData.length - 1){
        $('.previous').show();
        $('.reset').show();
        nextSlide();
      }
      else {
        $('.previous').show();
        $('.reset').show();
        $('.next').hide();
        nextSlide();
      }
    }
    else {
      $('.next').hide();
      $('.previous').show();
    }
  });

  $(".previous").click(function() {
    if (state.slideNumber > 0 ){
      if (state.slideNumber == state.slideData.length){
        $('.previous').show();
        $('.next').hide();
        $('.reset').show();
      }
      else{
        $('.previous').show();
        $('.next').show();
        $('.reset').show();
      }
      previousSlide();

    }
    else {
      state.slideNumber = 0;
      $('.previous').hide();
      $('.next').show();
    }
  });

  $(".reset").click(function() {
    initialSlide();
  });
};



  $('.value').selectize({
    options:[]
});

$('#select-page').selectize({
  create: false,
  sortField: {
    field: 'text'
  }
});
//Initial view when open the file
$(document).ready(function() {
  $('.previous').hide();
  $('.reset').hide();
  $("#head").text("Bridges in Philadelphia");
  $("#intro").text("Ever wondered about where you can see Philadelphia from above when you commute to the city ?");
  $("#current-page").text("0");
  clickButton();
});
