export const displayMap = (locations) => {
    mapboxgl.accessToken = 'pk.eyJ1IjoibGluaHRyYW4xMjMiLCJhIjoiY2tqMm5xajluMDRsNjJxcXkxZ2M3NW0wdCJ9.D7a1Sf1Ef8T5jfL6l6ijeA';
    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/linhtran123/ckj45f8cx30df19njqh7w3e11',
        scrollZoom: false
        // center: [-118.113491, 34.111745],
        // zoom: 10,
        // interactive: false
    });
    
    const bounds = new mapboxgl.LngLatBounds();
    
    locations.forEach(loc => {
        //Add marker
         const el = document.createElement('div');
         el.className = 'marker';
    
        //Add marker
         new mapboxgl.Marker({
             element: el,
             anchor: 'bottom',
         }).setLngLat(loc.coordinates).addTo(map);
    
         //Add Popup
         new mapboxgl.Popup({
             offset: 30
         })
            .setLngLat(loc.coordinates)
            .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
            .addTo(map);
    
         //extend map bounds to include current location
         bounds.extend(loc.coordinates);
    });
    
    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            left: 100,
            right: 100
        }
    });
}
