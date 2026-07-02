

mapboxgl.accessToken = maptoken;
console.log(listings.geometry.coordinates);

const map = new mapboxgl.Map({
       container: 'map', // container ID
       center: listings.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
       zoom: 9 // starting zoom
    });
   console.log("pass")
    const marker = new mapboxgl.Marker({ color: 'red', rotation: 0 })
        .setLngLat(listings.geometry.coordinates)
        .setPopup( new mapboxgl.Popup({offset: 25,})
        .setHTML(`${listings.location} <p>You listing is here </p>`))
        .addTo(map);

   