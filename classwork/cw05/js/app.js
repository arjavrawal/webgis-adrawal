const map = L.map("map").setView([33.4484, -112.0740], 11);
const locateButton = document.querySelector("#locate");
locateButton.addEventListener("click", function () {
    map.locate({ setView: true, maxZoom: 14 });
});
map.on("locationfound", function (e) {
    L.circle(e.latlng, {radius: e.accuracy / 2}).addTo(map);
});
map.on("locationerror", function (e) {
    console.log(e.message);
});
const osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);
L.marker([33.4242, -111.9281]).addTo(map).bindPopup("ASU Tempe campus").openPopup();
L.marker([33.42612069892929, -111.93593754570156]).addTo(map).bindPopup("Tempe Transit Center").openPopup();
L.circle([33.4242, -111.9281], {radius: 400, color: "#f1a340"}).addTo(map);
L.polyline([[33.42,-111.94],[33.42,-111.92]],{weight:4}).addTo(map);
L.polygon([[33.40,-111.95],[33.40,-111.90],[33.44,-111.90]], {fillOpacity:0.2}).addTo(map);
map.on("click", e => console.log(e.latlng.lat.toFixed(5), e.latlng.lng.toFixed(5)));
map.on("moveend", () => console.log("zoom", map.getZoom()));
const sites = L.geoJSON(null);
async function start() {
    const data = await (await fetch("data/cooling_centers.geojson")).json();
    sites.addData(data); sites.addTo(map);
}
start();