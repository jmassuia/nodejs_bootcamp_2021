// console.log("Hello from the client side");

const locations = JSON.parse(document.getElementById("map").dataset.locations);

mapboxgl.accessToken =
  "pk.eyJ1Ijoiam9hby1tYXNzdWlhIiwiYSI6ImNrcXVhajllazAybmkyb3BiaGQwcXJxajEifQ.B7cQ4RKsF_RnCpINkEfFuA";

var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
});
