<template>
  
  <div>
    <div id="map"  ></div>
    <div id="search-bar">
      <input v-if="!menuVisible" type="text" placeholder="Search for a location..." v-model="searchQuery" @input="checkLocation">
      <button v-if="!menuVisible" @click="selectPlace(place)">{{ place }} >Zoom Search</button> <i v-if="searchVisibleIcon"  @click="toggleSearchTorch" class="search-icon fas fa-search"></i>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <div v-if="filteredPlaces.length > 0" class="search-results">
        <p v-for="(place, index) in filteredPlaces.slice(0, 5)" :key="index" @click="selectPlace(place)">{{ place }}</p>

      </div>

    </div>
    <div id="floating-bar">
      <i class="menu-icon fas fa-bars" @click="toggleMenu"></i>
      <p></p>

      <button v-if="menuVisible" class="distribution-button" @click="toggleDistribution">
        {{ showDistribution ? 'Hide Distribution' : 'Show Distribution' }}
        <i :class="showDistribution ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>

      </button>
      <p></p>
      <button v-if="menuVisible && VillageregisterButton" class="register-button" @click="toggleVillageRegistration">
        Village Register
        <i class="fas fa-map-marker-alt"></i>

      </button>


      <div v-if="menuVisible && !VillageregisterButton" class="village-form">
      <input type="text" class="villageInput" v-model="newVillageNameInput" placeholder="Village Name" > 
      <p></p>
      <input type="text" v-model="newVillageCoordinatesInput" placeholder="Village Coordinates" >

      <button @click="register">Register</button> 
      <p>hint:"Double-click the location to generate its coordinates."</p>

      </div>
      
    </div>

  </div>
</template>


<script>
// Import Section
import L from 'leaflet';
import 'leaflet-control-geocoder';

export default {
  data() {
    return {
      // Defination Of All Global Variable they can Be access using "this.variableName"
      errorMessage: '',
      searchQuery: '',
      newVillageNameInput: '',   
      newVillageCoordinatesInput: '',
      map: null,
      marker: null,
      markers: [],
      showDistribution: false,
      VillageregisterButton: true,
      menuVisible: false,
      searchVisibleIcon: false ,
      villageCoordinates: [
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [1.018076,35.000236],
          },
          "properties": {
            "orgunit": {
              "orgunit_id": "JHfgksjfhseuf",
              "name": "Kitale",
              "No_of_nets": 2213
            }
          }
        },
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [-0.1029109, 34.75417661],
          },
          "properties": {
            "orgunit": {
              "orgunit_id": "JH342ksjfhseuf",
              "name": "Kisumu",
              "No_of_nets": 23
            }
          }
        },
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [0.0236, 37.9062],
          },
          "properties": {
            "orgunit": {
              "orgunit_id": "JH34534jfhseuf",
              "name": "tagania East",
              "No_of_nets": 23324
            }
          }
        },{
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [],
          },
          "properties": {
            "orgunit": {
              "orgunit_id": "JH34534jfhseuf",
              "name": "Mwanzi East",
              "No_of_nets": 23324
            }
          }
        },
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [],
          },
          "properties": {
            "orgunit": {
              "orgunit_id": "JH34534jfhseuf",
              "name": "kitari",
              "No_of_nets": 23324
            }
          }
        }
      ],
      filteredPlaces: [],
    };

    
  },
  mounted() {
    // Launch The LeafLet Display Frame Work
    this.map = L.map('map').setView([0.0236, 37.9062], 6.49);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
    this.map.removeControl(this.map.zoomControl);
    L.control.zoom({   position: 'bottomleft'}).addTo(this.map);

    this.villageCoordinates.forEach(feature => {
      const coordinates = feature.geometry.coordinates;
      const marker = L.circleMarker(coordinates, {
        radius: 0.005,
        color: 'red',
        fillColor: 'red',
        fillOpacity: 1
      });
      if (this.showDistribution) {
        marker.addTo(this.map);
      }
      this.markers.push(marker);
    });

    // Location Select Property
    if (this.map) {
  this.map.on('dblclick', (e) => {
    if (e.latlng) {
      const { lat, lng } = e.latlng;
      const geocoder = L.Control.Geocoder.nominatim();
      geocoder.reverse(e.latlng, this.map.options.crs.scale(this.map.getZoom()), results => {
        if (results && results.length > 0) {

          if (results[0].properties.address.country_code === "ke") {

          const hierarchy = results[0].name;
          const parts = hierarchy.split(',');
          const newVillage = parts[0].trim();
          const newCoordinates = lat.toString() +','+ lng.toString();
          this.newVillageCoordinatesInput =newCoordinates;
          this.newVillageNameInput =newVillage;  

          
          console.log(newCoordinates," ",newVillage)
          const tooltipContent = `Latitude: ${lat.toFixed(6)}, Longitude: ${lng.toFixed(6)}<br>City: ${hierarchy}<br>`;
          if (!this.tooltip) {
            this.tooltip = L.tooltip({ direction: 'top', permanent: true })
              .setContent(tooltipContent)
              .setLatLng(e.latlng)
              .addTo(this.map);
          } else {
            this.tooltip.setLatLng(e.latlng).setContent(tooltipContent);
          }




        }else{
          this.newVillageNameInput ='';
          this.newVillageCoordinatesInput='';

          const tooltipContent = `Please Select Kenya Location Only!`;
          if (!this.tooltip) {
            this.tooltip = L.tooltip({ direction: 'top', permanent: true })
              .setContent(tooltipContent)
              .setLatLng(e.latlng)
              .addTo(this.map);
          } else {
            this.tooltip.setLatLng(e.latlng).setContent(tooltipContent);
          }


        }


        } else {
          console.error('No reverse geocoding results found');
        }

      });
    }
  });
}

  },
  watch: {
    showDistribution(newVal) {
      this.markers.forEach(marker => {
        if (newVal) {
          marker.addTo(this.map);
        } else {
          marker.remove();
        }
      });
    }
  },
  methods: {
    // All function Method Are executed Here
    register() {
      function distance(lat1, lat2, lon1, lon2) {
        lon1 = lon1 * Math.PI / 180;
        lon2 = lon2 * Math.PI / 180;
        lat1 = lat1 * Math.PI / 180;
        lat2 = lat2 * Math.PI / 180;
        let dlon = lon2 - lon1;
        let dlat = lat2 - lat1;
        let a = Math.pow(Math.sin(dlat / 2), 2) +
                Math.cos(lat1) * Math.cos(lat2) *
                Math.pow(Math.sin(dlon / 2), 2);
        let c = 2 * Math.asin(Math.sqrt(a));
        let r = 6371;
        return c * r;
      }

    let newVillageNameInput = this.newVillageNameInput.trim();
    let newVillageCoordinatesInput = this.newVillageCoordinatesInput.trim().replace(/\s+/g, '');  
    let coordinatesStrings = [];  
    //Check if the village name already exists in data store B
    this.villageCoordinates.forEach(feature => {
      //Does the name exist in what we have? 
      const [latitude,longitude] = feature.geometry.coordinates;
      const coordinatesString = `${latitude},${longitude}`;
      if (feature.properties.orgunit.name.trim().toLowerCase() === newVillageNameInput.toLowerCase()) {
        coordinatesStrings.push(coordinatesString);
      }
    });
    
    if (coordinatesStrings.length > 0) {
      const [latitudeInput, longitudeInput] = newVillageCoordinatesInput.split(',');

      for (let i = 0; i < coordinatesStrings.length; i++) {
       const coordinatesString = coordinatesStrings[i];
       const [latitude, longitude] = coordinatesString.split(',');

       console.log( distance(latitude,latitudeInput , longitude,  longitudeInput)    + " K.M");

       if(distance(latitude,latitudeInput , longitude,  longitudeInput) < 5){

        alert("Village Already Exist Within 5 K.M Radius!");
        break;


      }else{
        const [latitude, longitude] = newVillageCoordinatesInput.split(',');
        const newVillage = {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [parseFloat(latitude), parseFloat(longitude)]
          },
          properties: {
            orgunit: {
              orgunit_id: "pOsTvq49pN",  
                      }
          }
        };
        ///Send village coordinates to the server
        //
        this.villageCoordinates.push(newVillage);
    
        alert("New Village Added")
        break;
    }


  }



    }else {
    const [latitude, longitude] = newVillageCoordinatesInput.split(',');
    const newVillage = {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [parseFloat(latitude), parseFloat(longitude)]
      },
      properties: {
        orgunit: {
          orgunit_id: "pOsTvq49pN",  
                  }
      }
    };
    
    this.villageCoordinates.push(newVillage);

    alert("New Village Added")

  }

  }, 
    toggleVillageRegistration(){


    this.VillageregisterButton = false;
    
    },
    toggleSearchTorch() {
      this.menuVisible = false;
      this.searchVisibleIcon =!this.searchVisibleIcon;
    },
    toggleMenu() {
      this.VillageregisterButton =true ;
      this.menuVisible = !this.menuVisible;
      this.searchVisibleIcon = true;
    },
    toggleDistribution() {
      this.showDistribution = !this.showDistribution;
    }, checkLocation() {

      this.filteredPlaces = this.villageCoordinates.filter(feature => {
        const name = feature.properties.orgunit.name.toLowerCase();
        return name.includes(this.searchQuery.toLowerCase());
      }).map(feature => feature.properties.orgunit.name);


    }
    ,
    searchLocation() {
      // Search Location by Name
      const geocoder = L.Control.Geocoder.nominatim();
      this.errorMessage = '';


      geocoder.geocode(this.searchQuery.trim(), results => {

        if (results && results.length > 0) {
          let result = null;
          for (let i = 0; i < results.length; i++) {
            const properties = results[i].properties;
            if (properties.address.country_code === "ke") {
              result = results[i];
              break;
            }
          }

          console.log(result)

          if (result) {
            const location = result.center;
            const locationName = result.name;
            const latitude = location.lat;
            const longitude = location.lng;

            this.errorMessage = '';

            if (latitude !== undefined && longitude !== undefined) {
              if (this.marker) {
                this.map.removeLayer(this.marker);
              }
              this.map.setView([latitude, longitude], 7);

              this.marker = L.marker([latitude, longitude]).addTo(this.map);
              const zoomLevel = this.map.getZoom();
              console.log('Current Zoom Level:', zoomLevel);
              this.marker.bindTooltip(`Zoom level : ${zoomLevel} <br> latitude: ${latitude}, longitude: ${longitude}<br>${locationName}<br> Net Allocation: 5362`, { permanent: true, direction: 'top' });

            } else {
              this.errorMessage = 'Invalid geocoding result';
              console.error('Invalid geocoding result:', result);
            }

          } else {
            this.errorMessage = 'No results found in Kenya';
            console.error('No results found within in Kenya');
          }
        } else {
          this.errorMessage = 'No results found';
          console.error('No results found');
        }
      });




    }, selectPlace(place) {

      // Selected village is converted to get coordinateds
    // searching location using coordinates
    
    
    // Find the selected place in the villageCoordinates array to replaced data store B which has coordinates
  const selectedPlace = this.villageCoordinates.find(feature => feature.properties.orgunit.name === place);
  
  if (selectedPlace) {
    const coordinates = selectedPlace.geometry.coordinates;
    const villageName = this.searchQuery = selectedPlace.properties.orgunit.name;
    const orgunit_id =selectedPlace.properties.orgunit.orgunit_id
    const No_of_nets =selectedPlace.properties.orgunit.No_of_nets
    const coordinateString = coordinates.join(',');
    const splitCoordinates = coordinateString.split(',');
    const strippedCoordinates = splitCoordinates.map(coord => coord.trim());
    const  rejoinedCoordinates = strippedCoordinates.join(',');

        this.searchLocationWithCoordinates(rejoinedCoordinates, orgunit_id, villageName, No_of_nets);

      } else {


        //Check in the  data store C which has no coordinates 11
        //if found then
        //check if user has right? 
        //if yes then instruct user to double click the location to generate coordinates
        //else tell user location does not exist
        //
        
        //if not found then check in the orgunits table 22
        //if found then
        //check if has coordinates
        //if yes display the location
        // //check if user has right? 
        //if yes then instruct user to double click the location to generate coordinates
        //else tell user location does not exist
        //
        

        console.error('Selected place not found:', place);
      }
    },
    searchLocationWithCoordinates(rejoinedCoordinates, orgunit_id, villageName, No_of_nets) {
      const coordinates = rejoinedCoordinates;
      const geocoder = L.Control.Geocoder.nominatim();
      this.errorMessage = '';
      geocoder.geocode(coordinates, results => {

        if (results && results.length > 0) {
          let result = null;
          for (let i = 0; i < results.length; i++) {
            const properties = results[i].properties;
            if (properties.address.country_code === "ke") {
              result = results[i];
              break;
            }
          }

          if (result) {
            const location = result.center;
            const latitude = location.lat;
            const locationName = villageName;
            const longitude = location.lng;

            this.errorMessage = '';

            if (latitude !== undefined && longitude !== undefined) {
              if (this.marker) {
                this.map.removeLayer(this.marker);
              }
              const zoomLevel = this.map.getZoom();
              console.log('Current Zoom Level:', zoomLevel);
              const splitCoordinates = coordinates.split(',');
              const latitudeVillage = splitCoordinates[0];
              const longitudeVillage = splitCoordinates[1];

              this.map.setView([latitude, longitude], 7);
              this.marker = L.marker([latitude, longitude]).addTo(this.map);
              this.marker.bindTooltip(`Zoom level : ${zoomLevel} <br> latitude: ${latitudeVillage}, longitude: ${longitudeVillage}<br>${locationName}<br> Net Allocation: ${No_of_nets}<br> Org Id: ${orgunit_id}`, { permanent: true, direction: 'top' });
            } else {
              this.errorMessage = 'Invalid geocoding result';
              console.error('Invalid geocoding result:', result);
            }
          } else {
            this.errorMessage = 'No results found in Kenya';
            console.error('No results found within in Kenya');
          }
        } else {
          this.errorMessage = 'No results found';
          console.error('No results found');
        }
      });


    },
  },

};

</script>
<style src="./MapComponentStyles.vue" scoped></style>  