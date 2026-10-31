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
L.Control.layers(basemaps, null, {position: "topleft"}).addTo(map);
const centers = siteLayer(" Cooling Centers");
const hydration = siteLayer(" Hydration Stations");
const cities = L.geoJSON(null, {
    style: {color: "#f1a340", weight: 1, fillOpacity: 5.55}
});
const rail = L.geoJSON(null, {
    style: {color: "#f1a340", weight: 2, fillOpacity: 0.15}
});
const layers = {cities, centers, hydration, rail};
for (const box of document.querySelectorAll("[data-layer]")) {
    box.addEventListener("change", () => {
        const layer = layers[box.dataset.layer];
        if (box.checked) layer.addTo(map); else map.removeLayer(layer);
    });
}
async function start () {
    const data = await (await fetch("data/cooling_centers.geojson")).json();
    centers.addData(data);
    hydration.addData(data);
    const cityData = await (await fetch("data/cities.geojson")).json();
    cities.addData(cityData);
    const railData = await (await fetch("data/rail_stations.geojson")).json();
    rail.addData(railData);
    countInView();
}
start();
const CountControl = L.Control.extend({
    onAdd: function () {
        this.box = L.DomUtil.create("div", "count-box");
        this.box.textContent = "...";
        return this.box;
},
update: function (n) {
    this.box.textContent = `${n} sites in view`;
}
});
const countControl = new CountControl({ position: "bottomleft" }).addTo(map);
function countInView() {
    const bounds = map.getBounds();
    let n = 0;
    centers.eachLayer(l => { if (bounds.contains(l.getLatLng())) n += 1; });
    cities.eachLayer(l => { if (bounds.contains(l.getLatLng())) n += 1; });
    rail.eachLayer(l => { if (bounds.contains(l.getLatLng())) n += 1; });
    hydration.eachLayer(l => { if (bounds.contains(l.getLatLng())) n += 1; });
    countControl.update(n);
}
map.on("moveend", countInView);
const usgs = L.tileLayer.wms(
    "https://basemap.nationalmap.gov/arcgis/services/" + "USGSTopo/MapServer/WMSServer", {
        layers: "0", format: "image/png", attribution: "USGS The National Map"
    }
);
const basemaps = {"OpenStreetMap": osm, "USGS Topo": usgs};
const waterIcon = L.icon({
    iconUrl: "img/water.png",
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -36]
});
const plainStyle = { radius: 6, color: "white", weight: 1, fillColor: "#2166ac", fillOpacity: 0.9 };
function siteLayer(kind) {
    return L.geoJSON(null, {
        filter: f => f.properties.kind == kind,
        pointToLayer: (f, latlng) => kind == "Hydration Stations"
        ? L.marker(latlng, {icon: waterIcon})
        : L.circleMarker(latlng, plainStyle)
    });
}