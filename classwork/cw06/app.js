async function getLayers() {
    const url = "http://localhost:8080/geoserver/asu_webgis/wms?service=WMS&version=1.1.1&request=GetCapabilities";
    // fetch the XML text
    const xml = await (await fetch(url)).text();
    // parse into an XML document
    const doc = new DOMParser().parseFromString(xml, "text/xml");
    // extract just the layer names
    const names = [...doc.querySelectorAll("Layer > Name")].map((n) => n.textContent);
    console.log("Available layer:", names);
}
getLayers();

map = L.map('map').setView([33.4242, -111.9281], 13);
L.tileLayer.wms("http://localhost:8080/geoserver/asu_webgis/wms", {
    layers: "asu_webgis:shade_finder",
    styles: "",
    format: "image/png", transparent: true,
    version: "1.1.1"
}).addTo(map);

const WMS = "http://localhost:8080/geoserver/asu_webgis/wms";
let stack = "asu_webgis:shade_finder";
map.on("click", async (e) => {
    const b = map.getBounds(), s = map.getSize(); p = e.containerPoint;
    const url = WMS + "?service=WMS&version=1.1.1&request=GetFeatureInfo&layers=" + stack + "&query_layers=" + stack + "&styles=" + "&srs=EPSG:4326&bbox=" + b.toBBoxString() + "&width=" + s.x + "&height=" + s.y + "&x=" + Math.round(p.x) + "&y=" + Math.round(p.y) + "&info_format=application/json&feature_count=5&buffer=10";
    const text = await (await fetch(url)).text();
    const data = JSON.parse(text);
    if (!data.features.length) return;
    const html = data.features.slice().reverse().map((f) => {
        const layer = f.id ? f.id.split(".")[0] : "DEM pixel";
        const rows = Object.entries(f.properties).map(([k, v]) => "<tr><td><b>" + k + "</b></td><td>" + (v ?? "") + "</td></tr>").join("");
        return "<b>" + layer + "</b><table>" + rows + "</table>";
    }).join("<hr>");
    L.popup().setLatLng(e.latlng).setContent(html).openOn(map);
});

fetch(WMS + "?service=WMS&version=1.1.1&request=DescribeLayer&layers=" + stack)
    .then((r) => r.text())
    .then((xml) => {
        const doc = new DOMParser().parseFromString(xml, "text/xml");
        for (const d of doc.querySelectorAll("LayerDescription")) {
            const q = d.querySelector("Query");
            console.log(d.getAttribute("name"), "->", d.getAttribute("owsType"), q.getAttribute("typeName"), d.getAttribute("owsURL"));
        }
    });

const legend = L.control({ position: "bottomright" });
legend.onAdd = function () {
    const div = L.DomUtil.create("div");
    div.style.background = "white";
    div.style.padding = "6px";
    div.style.borderRadius = "4px";
    div.innerHTML = `<img src="${WMS}?service=WMS&version=1.1.1&request=GetLegendGraphic&format=image/png&layer=asu_webgis:shade_finder" alt="Legend">`;
    return div;
};
legend.addTo(map);

const WFS = "http://localhost:8080/geoserver/asu_webgis/wfs";
fetch(WFS + "?service=WFS&version=2.0.0&request=GetCapabilities")
    .then((r) => r.text())
    .then((xml) => {
        const doc = new DOMParser().parseFromString(xml, "text/xml");
        for (const t of doc.getElementsByTagNameNS("*", "FeatureType")) {
            console.log(t.getElementsByTagNameNS("*", "Name")[0].textContent);
            console.log(t.getElementsByTagNameNS("*", "DefaultCRS")[0].textContent);
        }
        const ops = [...doc.getElementsByTagNameNS("*", "Operation")].map((o) => o.getAttribute("name"));
        console.log("operations:", ops.join(", "));
    });

fetch(WFS + "?service=WFS&version=2.0.0&request=DescribeFeatureType&typeNames=asu_webgis:cooling_centers")
    .then((r) => r.text())
    .then((xml) => {
        console.log(xml);
        const doc = new DOMParser().parseFromString(xml, "text/xml");
        for (const el of doc.getElementsByTagNameNS("*", "element")) {
            const type = el.getAttribute("type");
            if (!type || type.endsWith("Type")) continue;
            console.log(el.getAttribute("name"), type, el.getAttribute("nillable") === "false" ? "required" : "optional");
        }
    });

async function getFeatures() {
    const cql = "kind = 'Cooling Center'";
    const url = WFS + "?service=WFS&version=2.0.0&request=GetFeature&typeNames=asu_webgis:cooling_centers&outputFormat=application/json&srsName=EPSG:4326&cql_filter=" + encodeURIComponent(cql);
    const data = await (await fetch(url)).json();
    console.log(data.numberMatched, "rows", data.features[0]);
    const results = L.geoJSON(data, {
        pointToLayer: (f, latlng) => L.circleMarker(latlng, {
            radius: 7, color: "#8c1d40", weight: 1.5, fillColor: "#ffc000", fillOpacity: 0.9
        }),
        onEachFeature: (f, layer) => layer.bindPopup(f.properties.name + "<br>" + f.properties.city)
    }).addTo(map);
}
getFeatures();

async function transaction(xml, user, pass) {
    const headers = { "Content-Type": "text/xml" };
    if (user) headers["Authorization"] = "Basic " + btoa(user + ":" + pass);
    const r = await fetch(WFS, { method: "POST", headers, body: xml });
    console.log(await r.text());
}

const head = `<wfs:Transaction service="WFS" version="1.1.0" xmlns:wfs="http://www.opengis.net/wfs" xmlns:gml="http://www.opengis.net/gml" xmlns:ogc="http://www.opengis.net/ogc" xmlns:asu_webgis="http://sgsup.asu.edu/webgis">`;
const tail = `</wfs:Transaction>`;

const insert = head + `
<wfs:Insert>
<asu_webgis:cooling_centers>
<asu_webgis:name>Class Demo Site</asu_webgis:name>
<asu_webgis:kind>Class demo</asu_webgis:kind>
<asu_webgis:geom><gml:Point srsName="EPSG:4326"><gml:pos>-111.94 33.4255</gml:pos></gml:Point></asu_webgis:geom>
</asu_webgis:cooling_centers>
</wfs:Insert>` + tail;

transaction(insert, "admin", prompt("GeoServer password"));