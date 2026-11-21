## Lab 05: Getting Started with the ArcGIS Maps SDK for JavaScript
### Arjav Rawal

How to build a web map with the SDK's components.

load the SDK from the CDN, put <arcgis-map> in the body, and set its basemap, center, zoom or web map item through attributes.
course also went through the three ways to authenticate (API key, user and app), how scopes limit what a key can reach, and how to add components like zoom and legend and react to events like a map click.

because my ASU account can't create API keys, each page that authenticates keeps the course's esriConfig.apiKey = "YOUR_API_KEY" line commented out, and below it sets the key only if arcgis-key.js exists. That file is in .gitignore. arcgis-key.js shows its one line with no key in it.

the maps still draw because they use named basemaps (topo-vector, gray-vector, gray-3d, dark-gray-3d) and public web maps, which don't need a key. Only the arcgis/ basemap styles do.

### Cool Corridors
the map page could be built with this SDK: <arcgis-map> with shaded routes, cooling centers and bus stops as layers, plus the legend, layer list and locate components in place of the checkboxes, legend and locate me buttons.

it would gain popups, legends and layer toggles that come ready-made from a web map. it would lose Leaflet's lightweight nature and the hand-built pieces such as the count box and click-to-select, which would need rewriting in the SDK's event model. also, the arcgis/ basemaps would depend on a key.