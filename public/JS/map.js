{let mapToken="<%=process.env.MAP_TOKEN%>"; }
    
mapboxgl.accessToken = mapToken;
    console.log(mapToken);  //see mapToken in browser console.
    const map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/streets-v12',
        // center: [77.2088, 28.6139], // starting position [lng, lat]
        center:listing.geometry.coordinates,
        zoom: 9// starting zoom
});
// console.log(coordinates);

const marker1 = new mapboxgl.Marker({color:'red'})
        // .setLngLat([12.554729, 55.70651])   //listing.geometry.coordinates
        .setLngLat(listing.geometry.coordinates) 
        .setPopup(new mapboxgl.Popup({offset: 25 })
        .setHTML(`<h4>${listing.location}</h4><p>Exact Location will be provided after booking</p> `)
        .setMaxWidth("300px"))
        .addTo(map);



    



