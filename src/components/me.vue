
if(this.userHasRight){
  const geocoder = L.Control.Geocoder.nominatim();

    geocoder.geocode(this.searchQuery, results => {
      
if (results && results.length > 0) {
   

 
  console.log('Geocoding results:', results);
  // Iterate through all results
  // Check if the location is in Kenya and state County data
   
  results.forEach(result => {
    if (result.properties.address.country_code === "ke" ) {

    if( result.properties.address.state  ){
      const location = result.center;
      const locationName = result.name;
      const latitude = location.lat;
      const longitude = location.lng;

      if (latitude !== undefined && longitude !== undefined) {

        this.storePosibleVillageLocation = [];

        //store posible location with that county and village name

        this.storePosibleVillageLocation.push({
          "latitude": latitude,
          "longitude": longitude,
          "villageName": locationName
        })

       
      } else {
        this.errorMessage = 'No coordinates found for this location.';
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
  console.error('No results sfsffound');
}
});

}else{
this.errorMessage = 'Selected place not found';
console.error('Selected place not found ' );

}