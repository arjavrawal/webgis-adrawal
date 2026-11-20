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