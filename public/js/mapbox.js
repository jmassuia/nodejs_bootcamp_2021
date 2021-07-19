// console.log("Hello from the client side");

const locations = JSON.parse(document.getElementById("map").dataset.locations);

mapboxgl.accessToken =
  "pk.eyJ1Ijoiam9hby1tYXNzdWlhIiwiYSI6ImNrcXVhajllazAybmkyb3BiaGQwcXJxajEifQ.B7cQ4RKsF_RnCpINkEfFuA";

var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/joao-massuia/ckqvqg5ov0nyv18t58mhd587g",
  scrollZoom: false,
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach((loc) => {
  // Create Marker Element
  const el = document.createElement("div");
  el.className = "marker";

  //Add Marker
  new mapboxgl.Marker({
    element: el,
    anchor: "bottom",
  })
    .setLngLat(loc.coordinates)
    .addTo(map);

  // Add Pop-up
  new mapboxgl.Popup({
    offset: 30,
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);

  // Extend map bounds to includ the currently locations
  bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
  padding: {
    top: 200,
    bottom: 150,
    left: 100,
    right: 100,
  },
});
