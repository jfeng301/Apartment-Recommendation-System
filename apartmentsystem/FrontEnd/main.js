//-----------------------------------------------draw the slider-------------------------------------------------------//
var crime_slider = document.getElementById("crime-selector");
noUiSlider.create(crime_slider, {
  start: [0, 5],
  connect: true,
  step: 0.1,
  behaviour: "drag",
  orientation: 'horizontal', // 'horizontal' or 'vertical'
  range: {
    'min': 0,
    'max': 5
  },
  format: wNumb({
    decimals: 0
  }),
  pips: {mode: 'range' ,density: 10}
});

var rate_slider = document.getElementById("rate-selector");
noUiSlider.create(rate_slider, {
  start: [0, 5],
  connect: true,
  step: 0.1,
  behaviour: "drag",
  orientation: 'horizontal', // 'horizontal' or 'vertical'
  range: {
    'min': 0,
    'max': 5
  },
  format: wNumb({
    decimals: 0
  }),
  pips: {mode: 'range' ,density: 10}
});

var trans_slider = document.getElementById("trans-selector");
noUiSlider.create(trans_slider, {
  start: [0, 5],
  connect: true,
  step: 0.1,
  behaviour: "drag",
  orientation: 'horizontal', // 'horizontal' or 'vertical'
  range: {
    'min': 0,
    'max': 5
  },
  format: wNumb({
    decimals: 0
  }),
  pips: {mode: 'range' ,density: 10}
});

var res_slider = document.getElementById("res-selector");
noUiSlider.create(res_slider, {
  start: [0, 5],
  connect: true,
  step: 0.1,
  behaviour: "drag",
  orientation: 'horizontal', // 'horizontal' or 'vertical'
  range: {
    'min': 0,
    'max': 5
  },
  format: wNumb({
    decimals: 0
  }),
  pips: {mode: 'range' ,density: 10}
});

var price_slider = document.getElementById("price-selector");
noUiSlider.create(price_slider, {
  start: [805, 6800],
  connect: true,
  step: 100,
  behaviour: "drag",
  orientation: 'horizontal', // 'horizontal' or 'vertical'
  range: {
    'min': 805,
    'max': 6800
  },
  format: wNumb({
    decimals: 0
  }),
  pips: {mode: 'range', density: 10}
});

function zoomback(){
  map.setView([40.71427, -74.00597],10);
}
//-----------------------------------------------sort the data-------------------------------------------------------//

function dataSort(dataInput){
  //sort by stars then by alphabet
  dataInput.sort(function(a, b) {
    if(a.rating != b.rating){
      return b.rating - a.rating;
    }
    else if(a.crime_rate != b.crime_rate){
      return b.crime_rate - a.crime_rate;
    }
    else if(a.trans_rate != b.trans_rate){
      return b.trans_rate - a.trans_rate;
    }
    else if(a.res_rate != b.res_rate){
      return b.res_rate - a.res_rate;
    }
    else {
      var nameA = a.name.toUpperCase();
      var nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    }
  });

  return dataInput;
}

//-----------------------------------------------draw the map-------------------------------------------------------//

//get right list
var apt_list = document.getElementsByClassName("apt");
var img_list = document.getElementsByClassName("apt_img");
var center_pos = [40.71427, -74.00597];

var map = L.map("map", {
  center: center_pos, // EDIT latitude, longitude to re-center map
  zoom: 10, // EDIT from 1 to 18 -- decrease to zoom out, increase to zoom in
  scrollWheelZoom: false,
});

var OpenStreetMap_DE = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
maxZoom: 19,
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
  }
).addTo(map);

var markers = new L.MarkerClusterGroup();
var AllData, CurrentData;

$.get('res_cluster.csv', function(csvString) {
  var res_data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;
  ResData = res_data
  console.log(ResData,88888)
}
)

var res_markers = L.layerGroup().addTo(map);

$.get('apt_final.csv', function(csvString) {

  // Use PapaParse to convert string to array of objects
  var data = Papa.parse(csvString, {header: true, dynamicTyping: true}).data;
  // For each row in data, create a marker and add it to the map
  // For each row, columns `Latitude`, `Longitude`, and `Title` are required

  dataSort(data)
  console.log(Object.keys(data).length)

  for (var i in data) {
    var row = data[i];

    var marker = L.marker([row.latitude, row.longitude], {
      opacity: 1,
      icon: L.icon({
        iconUrl: 'apartment.png',
        iconSize: [35, 35]})
    }).bindPopup("</br>" + "<div class='chip' id='one_chip'> Name: "+ row.name +"</div>"
      + "</br>" + "<div class='chip' id='one_chip'> Apartment Score: "+ row.rating.toFixed(1) +"</div>" 
     +"</br>" +"<div class='chip'>" + row.keyword1 +"</div>"  +"<div class='chip'>" + row.keyword2 +"</div>"  + 
     "<div class='chip'>" + row.keyword3 +"</div>");

    marker.on("mouseover", function () {
      this.openPopup();
    });

    marker.on("mouseout", function () {
      this.closePopup();
    });

    marker.index = i

    function add_marker(d){var i = d.target.index
    for (var j in ResData){
    if (ResData[j].cluster === data[i].cluster)
  {var res_marker = L.marker(
    [ResData[j].latitude, ResData[j].longitude],
    {opacity: 1,
      icon: L.icon({
        iconUrl: 'restaurant.png',
        iconSize: [30, 30]})}
  ).addTo(res_markers).bindPopup(ResData[j].name);
          
  res_marker.on("mouseover", function () {
      this.openPopup();
    });

  res_marker.on("mouseout", function () {
      this.closePopup();
    });}}}

    marker.on('click',function(d) {


    if(res_markers.getLayers().length>0){res_markers.clearLayers();console.log('the map had the layer');}
    add_marker(d);


  })


    markers.addLayer(marker);
  }
  map.addLayer(markers);

  //initialize the list
  AllData = data;
  CurrentData = data;
  console.log(AllData);
  console.log(CurrentData);

  for(var i = 0; i < 4; i++){
    apt_list[i].innerHTML=
      "<div class='collapsible-header'>"+

              "<strong>" + AllData[i].name+"</strong>" +

              "<strong>" + AllData[i].rating.toFixed(1) +"</strong>" +

      "</div>" ;

      img_list[i].innerHTML=
        "<img src='" + AllData[i + 4*page].url + "' height='150'>";
  }
});
//-----------------------------------------------apartment ranking list-------------------------------------------------------//


var page = 0;

function newPage(index){
  page = index;
  len = Object.keys(CurrentData).length

  for(var i = 0; i < 4; i++){
    if(i + 4*page == len) break;
    apt_list[i].innerHTML=
      "<div class='collapsible-header'>"+

            "<strong>" + CurrentData[i + 4*page].name+"</strong>" +

            "<strong>" + CurrentData[i + 4*page].rating.toFixed(1) +"</strong>" +

      "</div>" ;

      img_list[i].innerHTML=
            "<img src='" + CurrentData[i + 4*page].url + "' height='150' >" ;
  }
}

function findApt(index){

  var aptdata = CurrentData[index + 4*page];
  var lat = aptdata.latitude
  var lot = aptdata.longitude

  map.setView([lat,lot],20);

}


//-----------------------------------------------click on search filter-------------------------------------------------------//

function Mapclean(){
  //remove all the point on the map
  map.removeLayer(markers);
}

function gettingresult(e){
  Mapclean();
  e.preventDefault();
  var res_rate = res_slider.noUiSlider.get().map(val =>{ return parseFloat(val);});
  var total_rate = rate_slider.noUiSlider.get().map(val =>{ return parseFloat(val);});
  var trans_rate = trans_slider.noUiSlider.get().map(val =>{ return parseFloat(val);});
  var price_rate = price_slider.noUiSlider.get().map(val =>{ return parseFloat(val);});
  var crime_rate = crime_slider.noUiSlider.get().map(val =>{ return parseFloat(val);});

  markers = new L.MarkerClusterGroup();

  CurrentData = AllData.filter(d => {
    return d.res_score >= res_rate[0] && d.res_score <= res_rate[1] 
    && d.rating >= total_rate[0] && d.rating <= total_rate[1]
    && d.trans_score >= trans_rate[0] && d.trans_score <= trans_rate[1]
    && d.crime_score >= crime_rate[0] && d.crime_score <= crime_rate[1]
    && d.starting_price >= price_rate[0] && d.starting_price <= price_rate[1];
  });

  dataSort(CurrentData);
  console.log(CurrentData);

  page = 0;
  newPage(0);


  for (var i in CurrentData) {
    var row = CurrentData[i];

    var marker = L.marker([row.latitude, row.longitude], {
      opacity: 1,
      icon: L.icon({
        iconUrl: 'apartment.png',
        iconSize: [35, 35]})
    }).bindPopup("</br>" + "<div class='chip' id='one_chip'> Name: "+ row.name +"</div>"
    + "</br>" + "<div class='chip' id='one_chip'> Apartment Score: "+ row.rating.toFixed(1) +"</div>" 
   +"</br>" +"<div class='chip'>" + row.keyword1 +"</div>"  +"<div class='chip'>" + row.keyword2 +"</div>"  + 
   "<div class='chip'>" + row.keyword3 +"</div>");

    marker.on("mouseover", function () {
      this.openPopup();
    });

    marker.on("mouseout", function () {
      this.closePopup();
    });
    marker.index = i

    function add_marker(d){var i = d.target.index
    for (var j in ResData){
    if (ResData[j].cluster === CurrentData[i].cluster)
  {var res_marker = L.marker(
    [ResData[j].latitude, ResData[j].longitude],
    {opacity: 1,
      icon: L.icon({
        iconUrl: 'restaurant.png',
        iconSize: [30, 30]})}
  ).addTo(res_markers).bindPopup(ResData[j].name);
          
  res_marker.on("mouseover", function () {
      this.openPopup();
    });

  res_marker.on("mouseout", function () {
      this.closePopup();
    });}}}

    marker.on('click',function(d) {


    if(res_markers.getLayers().length>0){
      res_markers.clearLayers();
      console.log('the map had the layer');}
    add_marker(d);


  })


    markers.addLayer(marker);

  }

  map.addLayer(markers);
}

//-----------------------------------------------apartment name search-------------------------------------------------------//

function searchApt_keyPress(e){
  if(e.keyCode === 13){
    e.preventDefault();
    searchApartment(e.currentTarget);
  }
}

function searchApartment(element){

  Mapclean();

  if(typeof element === "undefined"){
    element = document.getElementById('search');
  }

  //empty value, turn to all results
  if(element.value === ""){
    markers = new L.MarkerClusterGroup();

    for (var i in CurrentData) {
      var row = CurrentData[i];

      var marker = L.marker([row.latitude, row.longitude], {
          opacity: 1,
          icon: L.icon({
            iconUrl: 'apartment.png',
            iconSize: [35, 35]})
      }).bindPopupbindPopup(row.name + "</br>" + "<div class='chip' id='one_chip'> Apartment Rating:"+row.rating.toFixed(1) +"</div>" +"</br>" +"<div class='chip'>" + row.keyword1 +"</div>"  +"<div class='chip'>" + row.keyword2 +"</div>"  +"<div class='chip'>" + row.keyword3 +"</div>");

      marker.on("mouseover", function () {
        this.openPopup();
      });

      marker.on("mouseout", function () {
        this.closePopup();
      });

      marker.index = i;

      function add_marker(d){var i = d.target.index
      for (var j in ResData){
      if (ResData[j].cluster === CurrentData[i].cluster)
    {var res_marker = L.marker(
      [ResData[j].latitude, ResData[j].longitude],
      {opacity: 1,
        icon: L.icon({
          iconUrl: 'restaurant.png',
          iconSize: [30, 30]})}
    ).addTo(res_markers).bindPopup(ResData[j].name);
          
    res_marker.on("mouseover", function () {
        this.openPopup();
      });
  
    res_marker.on("mouseout", function () {
        this.closePopup();
      });}}}

      marker.on('click',function(d) {


      if(res_markers.getLayers().length>0){res_markers.clearLayers();console.log('the map had the layer');}
      add_marker(d);


    })


      markers.addLayer(marker);
    }

    map.addLayer(markers);
  }else{
   var key_search = element.value.toString().toLowerCase();

   markers = new L.MarkerClusterGroup();

   CurrentData = AllData.filter(d => {
    return d.name.toLowerCase().includes(key_search);
   });

   dataSort(CurrentData);
   console.log(CurrentData);

   page = 0;
   newPage(0);

   for (var i in CurrentData) {
      var row = CurrentData[i];

      var marker = L.marker([row.latitude, row.longitude], {
        opacity: 1,
        icon: L.icon({
          iconUrl: 'apartment.png',
          iconSize: [35, 35]})
      }).bindPopup(row.name + "</br>" + "<div class='chip' id='one_chip'> Apartment Rating:"+row.rating.toFixed(1) +"</div>" +"</br>" +"<div class='chip'>" + row.keyword1 +"</div>"  +"<div class='chip'>" + row.keyword2 +"</div>"  +"<div class='chip'>" + row.keyword3 +"</div>");

      marker.on("mouseover", function () {
        this.openPopup();
      });

      marker.on("mouseout", function () {
        this.closePopup();
      });
      marker.index = i;

      function add_marker(d){var i = d.target.index
      for (var j in ResData){

      if (ResData[j].cluster === CurrentData[i].cluster)
    {var res_marker = L.marker(
      [ResData[j].latitude, ResData[j].longitude],
      {opacity: 1,
        icon: L.icon({
          iconUrl: 'restaurant.png',
          iconSize: [30, 30]})}
    ).addTo(res_markers).bindPopup(ResData[j].name);
          
    res_marker.on("mouseover", function () {
        this.openPopup();
      });
  
    res_marker.on("mouseout", function () {
        this.closePopup();
      });}}}

      marker.on('click',function(d) {


      if(res_markers.getLayers().length>0){res_markers.clearLayers();console.log('the map had the layer');}
      add_marker(d);


    })



      markers.addLayer(marker);

   }

   map.addLayer(markers);

  }
}