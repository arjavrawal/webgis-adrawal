const map = L.map("map").setView([33.4484, -112.0740], 11);

const osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors"
}).addTo(map);
const usgs = L.tileLayer.wms(
    "https://basemap.nationalmap.gov/arcgis/services/" + "USGSTopo/MapServer/WMSServer", {
        layers: "0", format: "image/png", attribution: "USGS The National Map"
    }
);
const basemaps = {"OpenStreetMap": osm, "USGS Topo": usgs};
L.control.layers(basemaps, null, {position: "topleft"}).addTo(map);

L.marker([33.42612069892929, -111.93593754570156]).addTo(map).bindPopup("Tempe Transit Center").openPopup();
L.circle([33.4242, -111.9281], {radius: 400, color: "#f1a340"}).addTo(map);
L.polyline([[33.42, -111.94], [33.43, -111.92]], {weight: 4}).addTo(map);
L.polygon([[33.40, -111.95], [33.40, -111.90], [33.44, -111.90]], {fillOpacity: 0.2}).addTo(map);

const locateButton = document.querySelector("#locate");
locateButton.addEventListener("click", function () {
    map.locate({ setView: true, maxZoom: 14 });
});
map.on("locationfound", function (e) {
    L.circle(e.latlng, {radius: e.accuracy}).addTo(map);
});
map.on("locationerror", function (e) {
    console.log(e.message);
});

map.on("click", e => console.log(e.latlng.lat.toFixed(5), e.latlng.lng.toFixed(5)));
map.on("moveend", () => console.log("zoom", map.getZoom()));

const waterIcon = L.icon({
    iconUrl: "img/water.png",
    iconSize: [30, 40],
    iconAnchor: [15, 40],
    popupAnchor: [0, -36]
});
const waterIconBig = L.icon({
    iconUrl: "img/water.png",
    iconSize: [42, 56],
    iconAnchor: [21, 56],
    popupAnchor: [0, -50]
});
const plainStyle = { radius: 6, color: "white", weight: 1, fillColor: "#d95f02", fillOpacity: 0.9 };
const selectedStyle = { radius: 9, color: "#8c1d40", weight: 3, fillColor: "#ffc627", fillOpacity: 1 };
const selectedText = document.querySelector("#selected");
let current = null;

function highlight(layer, on) {
    if (layer.setStyle) layer.setStyle(on ? selectedStyle : plainStyle);
    else layer.setIcon(on ? waterIconBig : waterIcon);
}

// Cooling centers and hydration stations share one file, so each layer keeps only its own kind
function siteLayer(kind) {
    return L.geoJSON(null, {
        filter: f => f.properties.kind == kind,
        pointToLayer: (f, latlng) => kind == "Hydration Station"
            ? L.marker(latlng, {icon: waterIcon})
            : L.circleMarker(latlng, plainStyle),
        onEachFeature: (f, layer) => {
            const p = f.properties;
            layer.bindPopup(`${p.name}<br>${p.city}<br>Wheelchair: ${p.wheelchair ?? "not reported"}`);
            layer.on("click", e => {
                if (current) highlight(current, false);
                current = layer;
                highlight(layer, true);
                selectedText.textContent = `${p.name} (${p.kind}, ${p.city})`;
                L.DomEvent.stopPropagation(e);
            });
        }
    });
}

map.on("click", () => {
    if (current) highlight(current, false);
    current = null;
    selectedText.textContent = "";
});

function getColor(pop) {
    if (pop == null) return "#bdbdbd";
    return pop > 200000 ? "#54278f"
         : pop > 50000  ? "#756bb1"
         : pop > 10000  ? "#9e9ac8"
         :                "#dadaeb";
}
function cityStyle(f) {
    return { fillColor: getColor(f.properties.pop_2020), color: "#555", weight: 1, fillOpacity: 0.6 };
}

map.createPane("cityPane").style.zIndex = 350;
const cities = L.geoJSON(null, {
    pane: "cityPane",
    style: cityStyle,
    onEachFeature: (f, layer) => {
        const p = f.properties;
        layer.bindPopup(`${p.name}<br>Population (2020): ${p.pop_2020?.toLocaleString() ?? "no data"}`);
    }
});

const centers = siteLayer("Cooling Center");
const hydration = siteLayer("Hydration Station");
const clustered = L.markerClusterGroup();
const stops = L.geoJSON(null, {
    pointToLayer: (f, latlng) => L.circleMarker(latlng, {radius: 4, color: "#333", weight: 1, fillColor: "#ffffff", fillOpacity: 1}),
    onEachFeature: (f, layer) => layer.bindTooltip(f.properties.name)
});

const layers = {centers, hydration, stops, cities};
layers.hydration = clustered;

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
    for (const [group, shown] of [[centers, map.hasLayer(centers)], [hydration, map.hasLayer(clustered)]]) {
        if (!shown) continue;
        group.eachLayer(l => { if (bounds.contains(l.getLatLng())) n += 1; });
    }
    countControl.update(n);
}
map.on("moveend", countInView);

for (const box of document.querySelectorAll("[data-layer]")) {
    box.addEventListener("change", () => {
        const layer = layers[box.dataset.layer];
        if (box.checked) layer.addTo(map); else map.removeLayer(layer);
        countInView();
    });
}

const Legend = L.Control.extend({
    onAdd: function () {
        const div = L.DomUtil.create("div", "legend");
        const classes = [
            [5000, "Under 10,000"],
            [20000, "10,000 – 50,000"],
            [100000, "50,000 – 200,000"],
            [300000, "Over 200,000"],
            [null, "No data"]
        ];
        div.innerHTML = "<strong>Population (2020)</strong><br>" +
            classes.map(([pop, label]) => `<i style="background:${getColor(pop)}"></i>${label}`).join("<br>");
        return div;
    }
});
new Legend({ position: "bottomright" }).addTo(map);

async function start() {
    const data = await (await fetch("data/cooling_centers.geojson")).json();
    centers.addData(data);
    hydration.addData(data);
    clustered.addLayer(hydration);
    centers.addTo(map);
    countInView();

    const cityData = await (await fetch("data/cities.geojson")).json();
    cities.addData(cityData);

    const stopData = await (await fetch("data/rail_stations.geojson")).json();
    stops.addData(stopData);
}
start();
