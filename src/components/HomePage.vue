<template>
<!-- add a spinner when loading the page and  stop when the page has loaded -->
<div class="loader" v-if="div">
<div v-if="isLoading" class="spinner"></div>
 <!-- Add a card to display a welcome message -->
    <div class="card" v-if="!isLoading && loading">
        <div class="item">
            <span class="label">Welcome:</span>
            <span class="value">Welcome to DigiMal</span>
        </div>
        <div class="item">
            <span class="label">Description:</span>
            <span class="value">This is a Digimal mapping system</span>
        </div>
        <button type="button"  class="agree" @click="split">Agree</button>
        
    </div>
</div>
    
     <div >
    <div>
      <div   style="width:100%; height: 10px;z-index: 1000; position: fixed;  top: 0; background-color: white;padding: 27px;  border-radius: 5px;box-shadow: 0 2px 5px rgba(0, 0, 0, 0.9);"  >
 
        <h4 class="moving-word" style="text-align: center;text-shadow: 0px 0px 0px rgba(0, 0, 0, 0.5); ">  Location: Homa bay County</h4> 
      </div>
    </div>

    <div id="map"  ></div>
    <div>

      <div style=""  >
        <p  v-if="showAlertMessages" style=" position: fixed; top: 10%; left: 50%; transform: translate(-50%, -50%); background-color: darkslategrey; border-radius: 5px ; color: aliceblue;padding : 5px; "> {{this.alertMessages}} </p>
      </div>

    </div>

    <div id="search-bar">
      <input v-if="!menuVisible" type="text" placeholder="Search for a location..." v-model="searchQuery"
        @input="checkLocation">
      <button v-if="!menuVisible"  @click="selectPlace(this.searchQuery)" >Zoom Search</button> <i v-if="searchVisibleIcon"
        @click="toggleSearchTorch" class="search-icon fas fa-search such"></i>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>

      <div v-if="filteredPlaces.length > 0" class="search-results">
        <p v-for="(place, index) in filteredPlaces.slice(0, 5)" :key="index" :style="{ backgroundColor: index % 2 === 0 ? 'gray' : 'lightgray',marginBottom: '5px',cursor: 'pointer',color: 'white',width: '100%' ,padding:'5px'}" @click="selectPlace(place)"  >{{ place }} </p>

      </div>

    </div>

    <div id="floating-bar">
      <i class="menu-icon fas fa-bars" @click="toggleMenu"></i>
      <p></p>

      <button v-if="menuVisible" class="distribution-button" @click="split">
        {{ showDistribution ? 'Hide Distribution' : 'Show Distribution' }}
        <i :class="showDistribution ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>

      </button>
      <p></p>
      <button v-if="menuVisible && VillageregisterButton" class="register-button" @click="toggleVillageRegistration"> Village Update <i class="fas fa-map-marker-alt"></i>
      </button>
      <div v-if="menuVisible && !VillageregisterButton" class="village-form">
      <p>hint:"Double-click the location to generate its coordinates."</p>

      <!-- Display possible Village locations from Search -->
<p v-if="storePosibleVillageLocation.length > 0" class="search-results">Possible Locations Found:</p>

<ul v-if="storePosibleVillageLocation.length > 0">
  <li v-for="(location, index) in storePosibleVillageLocation" :key="index">
    Village Name: {{ location.villageName }}  
    Latitude: {{ location.latitude }}  
    Longitude: {{ location.longitude }}  
  </li>
</ul>




        <p></p>
        <input type="text" v-model="newVillageCoordinatesInput" placeholder="Village Coordinates">
        <p></p>


      <div class="search-container">

  <input type="text" class="villageInput" v-model="newVillageNameInput" placeholder="Village Name" @input="searchVillages">
  <button class="update" @click="register">Update</button>
  <div v-if="searchResults.length > 0" class="search-results">
    <p v-for="(result, index) in searchResults.slice(0, 5)" :key="index" :style="{ backgroundColor: index % 2 === 0 ? 'gray' : 'lightgray',marginBottom: '5px',cursor: 'pointer',color: 'white',width: '100%' ,padding:'5px'}" @click="selectPlace(result)">{{ result }} </p>
  </div>

        
</div>     


      </div>

    </div>
        <div style="position: fixed;bottom: 10px; right: 10px;z-index: 1000;background-color: white;padding: 10px; padding-top:0px; border-radius: 5px;box-shadow: 0 2px 5px rgba(0, 0, 0, 0.9); height: 100; max-width: 400px; border-radius: 10px; ">
              <p style="border: 1px solid green; padding :5px; text-align: center; ">Location Details</p>

              <p><i style="color: green;" class="fas fa-circle"></i>  Neme: <span>N/A</span></p>

              <p><i style="color: blue;" class="fas fa-map-marker-alt"></i>  <span>N/A</span></p>

              <p > <i  style="color: blue;" class="fas fa-bed"></i> Number of Nets: <span>N/A</span></p>
              <p><i style="color: red ;" class="fas fa-key"></i>  Id: <span>N/A</span></p> 
              <p><i style="color: blue ;"  class="fas fa-book"></i> Registration Data: N/A</p>
              <p><i style="color: green ;" class="fas fa-share"></i> Distribution Date: N/A</p>
              <p><i style="color: green ;" class="fas fa-user-check"></i> Supervisor: <span>N/A</span></p>


              </div>

  </div>
</template>


<script>
// Import Section
import L from 'leaflet';
import 'leaflet-control-geocoder';
import api from './Api/DijimalEndPoints';
export default {
  data() {
    return {
      // Defination Of All Global Variable they can Be access using "this.variableName"
      div: true,
      isLoading: true,
      loading: true,
      errorMessage: '',
      alertMessages:'',
      showAlertMessages: false,
      searchQuery: '',
      newVillageNameInput: '',
      newVillageCoordinatesInput: '',
      map: null,
      marker: null,
      markers: [],
      showDistribution: false,
      VillageregisterButton: true,
      distribution_post_data: [],
      menuVisible: false,
      searchVisibleIcon: false ,
      userHasRight: true, 
      showFilter: true,
      filteredPlaces: [],
      searchResults: [],
      authData: [],
      orgunit_data: [],
      countyData: [],//any county
      countyVillages: [],//any county village data
      sub_county:[],
      word:[],
      location:[],
      sub_location:[],// has all villages from org_table
      structure_village_data:[],//data store B
      ActualVillageDataStoreA :[],
      villageWithoutCoordinates: [],
      villageWithCoorinatates: [],

      storePosibleVillageLocation: [],

      villageCoordinates: [
        {
          "type": "Feature",
          "geometry": {
            "type": "Point",
            "coordinates": [1.018076, 35.000236],
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
        },
      ],


    };

    

  },
  mounted() {
    // setTimeout(() => {
    //   this.ActualVillageDataStoreA;
    //   this.isLoading = false;      
      
    // },
    // );
  
    this.datastore();//authentication
    //get org unit data
    this.getOrgunitsData();
    //homabay data
    this.getHomabay_org_data();

    //distribution data
    //this.get_distribution_data();
    // Launch The LeafLet Display Frame Work

    //county data
    this.getCountyData()
    this.structureVillageData()

    this.getCountyVillages()
  

    this.filterOutsublocationdata()


    this.map = L.map('map').setView([0.0236, 37.9062], 6.49);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
    this.map.removeControl(this.map.zoomControl);
    L.control.zoom({ position: 'bottomleft' }).addTo(this.map);

    this.ActualVillageDataStoreA.forEach(feature => {
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

              // Check if the location is in Kenya and state the location
              if (results[0].properties.address.country_code === "ke" ) {

                const hierarchy = results[0].name;
                const parts = hierarchy.split(',');
                const newVillage = parts[0].trim();
                const newCoordinates = lat.toString() + ',' + lng.toString();
                this.newVillageCoordinatesInput = newCoordinates;
                this.newVillageNameInput = newVillage;


                console.log(newCoordinates, " ", newVillage)
                const tooltipContent = `Latitude: ${lat.toFixed(6)}, Longitude: ${lng.toFixed(6)}<br>City: ${hierarchy}<br>`;
                if (!this.tooltip) {
                  this.tooltip = L.tooltip({ direction: 'top', permanent: true })
                    .setContent(tooltipContent)
                    .setLatLng(e.latlng)
                    .addTo(this.map);
                } else {
                  this.tooltip.setLatLng(e.latlng).setContent(tooltipContent);
                }




              } else {
                this.newVillageNameInput = '';
                this.newVillageCoordinatesInput = '';

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
    // load data
    // All function Method Are executed Here
    getAllInstancesOfKey(data, key) { 
      const _data = data.find(item => item.key === key)
      return _data;
    },
    async datastore() {
      this.authData = await api.getAuth()
    },
    async getOrgunitsData() {
      this.orgunit_data = await api.retrive_Org_units()
    },
    async getHomabay_org_data() {
      this.homabay = await api.homabay_org_sub_county()
      
    },
    // async get_distribution_data(){
    //   this.distribution_post_data = await api.Distribution_Post()
    // },
    async getCountyData() {

     const data= await api.get_county_data("Ur2xRBDtazT")
     this.sub_county = data.sub_county
     this.word = data.word
     this.location  = data.location
     this.sub_location = data.sub_location
     this.isLoading= data.isLoading
     
 
    },
    async getCountyVillages() {
      this.countyVillages = await api.CountyVillages(9)//change for diffrent counties

    },

    async filterOutsublocationdata() {
      console.log()
      this.subloactiondata = this.countyData.filter((item) => {
        return item.key == 'sub_location'
      })
    

    },
    async structureVillageData(){
      
      this.structure_village_data= this.sub_location.map(item=>{
           const __data= item.map(_item=>{
              const _data ={
                "type": "Feature",
                "geometry": {
                  "type": "Point",
                  "coordinates": [_item?.latitude, _item?.longitude],
                },
                "properties": {
                  "orgunit": {
                    "id": _item?.id,
                    "name": _item?.name,
                    "code": _item?.code,
                    "org_id": _item?.org_id,
                    "parent_id": _item?.parent_id,
                    "level_id": _item?.level_id,
                    "supervisor":_item?.supervisor
                  }
                }
              }   
             
              this.ActualVillageDataStoreA.push(_data)

              
              return _data
            })
            return __data
        })
        this.structure_village_data=this.structure_village_data.map(item=>item)
  
    // console.log(ActualVillageDataStoreA)
    },

    async split() {
      await this.structureVillageData()
      this.loading = false;
      this.div = false;
      
      this.structureVillageData()
      this.villageWithCoorinatates = this.ActualVillageDataStoreA.filter(item => item.geometry.coordinates.length > 0)
      this.villageWithoutCoordinates = this.ActualVillageDataStoreA.filter(item => item.geometry.coordinates.length === 0)
      console.log(this.ActualVillageDataStoreA)
      },

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
      this.ActualVillageDataStoreA.forEach(feature => {
        const [latitude, longitude] = feature.geometry.coordinates;
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
          console.log(distance(latitude, latitudeInput, longitude, longitudeInput) + " K.M");
          console.log('Latitude:', latitude, ', Longitude:', longitude);




        }



      } else {
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


      api.PostVillageCoordinates(newVillage)

        this.villageWithCoorinatates.push(newVillage);

        alert("New Village Added")

      }

    },
    toggleVillageRegistration() {


      this.VillageregisterButton = false;

    },
    toggleSearchTorch() {
      this.menuVisible = false;
      this.searchVisibleIcon = !this.searchVisibleIcon;
    },
    toggleMenu() {
      this.VillageregisterButton = true;
      this.menuVisible = !this.menuVisible;
      this.searchVisibleIcon = true;
      // check if menuVisibleis true make error message empty
      if(this.menuVisible){
        this.errorMessage = '';
      }
      
    },
    toggleDistribution() {
      this.showDistribution = !this.showDistribution;
    }, checkLocation() {

      this.filteredPlaces = this.ActualVillageDataStoreA.filter(feature => {
        const name = feature.properties.orgunit.name.toLowerCase();
        return name.includes(this.searchQuery.toLowerCase());
      }).map(feature => feature.properties.orgunit.name);



      
    },
    removeMarkers() {
    this.markers.forEach(marker => {
      this.map.removeLayer(marker);
    });
    this.markers = []; // Clear the markers array
  },
    searchVillages() {

this.searchResults = this.ActualVillageDataStoreA.filter(feature => {
  const name = feature.properties.orgunit.name.toLowerCase();
  return name.includes(this.newVillageNameInput.toLowerCase());
}).map(feature => feature.properties.orgunit.name);




},  
// searchLocation() {
//   // Search Location by Name
//   const geocoder = L.Control.Geocoder.nominatim();
//   this.errorMessage = '';

//   geocoder.geocode(this.searchQuery.trim(), results => {
//     if (results && results.length > 0) {
//       // Remove existing markers
//       this.removeMarkers();

//       console.log('Geocoding results:', results);
//       // Iterate through all results
//       // Check if the location is in Kenya and state County data
       
//       results.forEach(result => {
//         if (result.properties.address.country_code === "ke" ) {

//         if( result.properties.address.state === "Homa Bay County"){
//           const location = result.center;
//           const locationName = result.name;
//           const latitude = location.lat;
//           const longitude = location.lng;

//           if (latitude !== undefined && longitude !== undefined) {
//             // Create marker for each result
//             const marker = L.marker([latitude, longitude]).addTo(this.map);
//             const zoomLevel = this.map.getZoom();
//             marker.bindTooltip(`Zoom level : ${zoomLevel} <br> latitude: ${latitude}, longitude: ${longitude}<br>${locationName}<br> Net Allocation: 5362`, { permanent: true, direction: 'top' });
//             this.markers.push(marker);
//           } else {
//             this.errorMessage = 'Invalid geocoding result';
//             console.error('Invalid geocoding result:', result);
//           }

//         } else {
//           this.errorMessage = 'No results found in Homa Bay County';
//           console.error('No results found within in Homa Bay County');
//         }

//         } else {
//           this.errorMessage = 'No results found in Kenya';
//           console.error('No results found within in Kenya');
//         }
//       });

//       // If there are markers, fit map bounds to all markers
//       if (this.markers.length > 0) {
//         const group = new L.featureGroup(this.markers);
//         this.map.fitBounds(group.getBounds());
//       }   
//     } else {
//       this.errorMessage = 'No results found';
//       console.error('No results found');
//     }
//   });


// },
 selectPlace(place) {

      // Selected village is converted to get coordinateds

    // searching location using coordinates 
    // check if the input is place is empty
    if (place === '') {
      this.errorMessage = 'Please enter a location';
      return;
    }

  const selectedPlace = this.ActualVillageDataStoreA.find(feature => feature.properties.orgunit.name === place);
  this.searchResults =[];
  this.filteredPlaces = [];
  
  if (selectedPlace) {
   
    const coordinates = selectedPlace.geometry.coordinates;
    const villageName = this.searchQuery = this.newVillageNameInput = selectedPlace.properties.orgunit.name;
    const orgunit_id =selectedPlace.properties.orgunit.orgunit_id
    const No_of_nets =selectedPlace.properties.orgunit.No_of_nets

    const coordinateString = coordinates.join(',');
    const splitCoordinates = coordinateString.split(',');
    const strippedCoordinates = splitCoordinates.map(coord => coord.trim());
    const  rejoinedCoordinates = strippedCoordinates.join(',');


    this.searchLocationWithCoordinates(rejoinedCoordinates, orgunit_id, villageName, No_of_nets);


    } else if(selectedPlace === undefined ) {

        //Check in the  data store C which has no coordinates 
        const isSelectedPlaceHasNoCoordinates = this.ActualVillageDataStoreA.find(feature => feature.properties.orgunit.name.toLowerCase()  === place.toLowerCase() );
        //if found then
        if(isSelectedPlaceHasNoCoordinates){

        //check if user has right? 
        if(this.userHasRight){
          this.alertMessages = 'Allocate Coordinates to This location ';
          // add timeout to alert message
          this.showAlertMessages = true;
         
          setTimeout(() => {
            this.showAlertMessages = false;
          }, 5000);

        
          
          this.newVillageNameInput = place;
          this.menuVisible = true;
          this.VillageregisterButton = false;
          this.searchVisibleIcon = true;
          
        }else  {
          //else tell user location does not exist
          this.errorMessage = 'No coordinates found for this location.';
        }
      }else if(isSelectedPlaceHasNoCoordinates === undefined){
        // location Not Found but posible Longitude and latitude
        //if not found in both data store B and C


if(this.userHasRight){
  console.log(place)

    const geocoder = L.Control.Geocoder.nominatim();
  this.errorMessage = '';

  geocoder.geocode(place , results => {

    if (results ) {
     
      // Remove existing markers
      this.removeMarkers();

      console.log('Geocoding results:', results);
      // Iterate through all results
      // Check if the location is in Kenya and state County data
       
      this.storePosibleVillageLocation=[];
      results.forEach(result => {
        if (result.properties.address.country_code === "ke" ) {

        if( result.properties.address.state === "Homa Bay County"){
          const location = result.center;
          const locationName = result.name;
          const latitude = location.lat;
          const longitude = location.lng;

          if (latitude !== undefined && longitude !== undefined) {
            // Create marker for each result
            const marker = L.marker([latitude, longitude]).addTo(this.map);
            const zoomLevel = this.map.getZoom();
            marker.bindTooltip(`Zoom level : ${zoomLevel} <br> latitude: ${latitude}, longitude: ${longitude}<br>${locationName}<br> Net Allocation: 5362`, { permanent: true, direction: 'top' });
            this.markers.push(marker);
            // store posible location with that county and village name
            this.storePosibleVillageLocation.push({
              "latitude": latitude,
              "longitude": longitude,
              "villageName": locationName
            })
          } else {
            this.errorMessage = 'Invalid geocoding result';
            console.error('Invalid geocoding result:', result);
          }

        } else {
          this.errorMessage = 'No results found in Homa Bay County';
          console.error('No results found within in Homa Bay County');
        }

        } else {
          this.errorMessage = 'No results found in Kenya';
          console.error('No results found within in Kenya');
        }
      });

      // If there are markers, fit map bounds to all markers
      if (this.markers.length > 0) {
        const group = new L.featureGroup(this.markers);
        this.map.fitBounds(group.getBounds());
      }   
    } else {
      this.errorMessage = 'No results found';
      console.error('No results found');
    }
  });



}else{
this.errorMessage = 'Selected place not found';
console.error('Selected place not found ' );

}
         

        
           
        
      }

      } else {

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
<style>
.spinner {
  border: 16px solid #2E8B57.;
  border-radius: 50%;
  border-top: 10px  #008000;
  border-right: 10px solid green;
  border-bottom: 10px solid blue;
  width: 120px;
  height: 120px;
  -webkit-animation: spin 2s linear infinite;
  animation: spin 2s linear infinite;  
  }
  @-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.loader {
  display: flex;
  justify-content: center;
  align-items: center; 
  height: 100vh!important;

}
.register-button {
  background-color: #20C997 !important;
}

.distribution-button {
  background-color: #20C997 !important;
}
.agree{
  background-color: #20C997 !important;
  border: none;
  border-radius: 5px;
  color: white;
  padding: 10px 20px;
  pointer: cursor !important;
  
}
.update {
  background-color: #20C997 !important;
  border: none;
  border-radius: 5px;
  color: white;
  padding: 10px 20px;
  pointer: cursor !important;
}
.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  padding: 20px;
  width: 50%;
}
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f4f4f4;
}
</style>
