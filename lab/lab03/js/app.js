// Cool Corridors: the route cards are built from data, not hand-typed HTML.
// Mark: to add or fix a route, edit the routes list below. Nothing else needs to change.

/* ---------- Part 1: one route becomes an object ---------- */
const libraryLoop = {
  name: "Library Loop",
  miles: 1.4,
  shadePct: 62,
  description: "Tempe Transportation Center to Tempe Public Library along the Southern Avenue tree line."
};
console.table(libraryLoop);

/* ---------- Part 2: five routes become an array ---------- */
const routes = [
  libraryLoop,
  { name: "Apache Line",         miles: 1.1, shadePct: 38, description: "Streetcar stops on Apache Boulevard to Escalante Community Center. The long gap is by the car lots." },
  { name: "Mill Avenue Walk",    miles: 0.9, shadePct: 71, description: "Tempe Beach Park to the downtown stops. Awnings do most of the work here." },
  { name: "McClintock Crossing", miles: 1.6, shadePct: 29, description: "The McClintock and Southern stop to Kiwanis Recreation Center. Our hottest route and the one we most want fixed." },
  { name: "Rio Salado Path",     miles: 2.1, shadePct: 48, description: "Rio Salado Parkway path from the light rail bridge to the Tempe Marketplace cooling station." }
];

console.log(routes.length);
console.log(routes[0].name);
console.log(routes[4].name);

for (const route of routes) {
  console.log(route.name);
}

console.table(routes);

/* ---------- Part 4: how long does it take? ---------- */
function minutesFor(miles, mph) {
  return Math.round(miles / mph * 60);
}

function speedFor(mode) {
  switch (mode) {
    case "walk":  return 3;
    case "bike":  return 10;
    case "drive": return 25;
    default:      return 3;   // catches undefined, so a missing mode still gives walking times
  }
}

/* ---------- Part 5: shade in words ---------- */
function shadeRating(pct) {
  if (pct >= 60) {
    return "Good shade";
  } else if (pct >= 40) {
    return "Patchy shade";
  } else {
    return "Little shade";
  }
}

/* ---------- Part 3: the page builds itself ---------- */
function routeCard(route, mode) {
  const article = document.createElement("article");
  article.className = "card";

  const h3 = document.createElement("h3");
  h3.textContent = route.name;

  // Facts line: distance, then the shade share followed by its rating in words
  const facts = document.createElement("p");
  facts.className = "facts";
  const badge = document.createElement("span");
  badge.className = "badge";
  badge.textContent = route.shadePct + "% shaded (" + shadeRating(route.shadePct) + ")";
  facts.append(route.miles + " miles · ", badge);

  const desc = document.createElement("p");
  desc.textContent = route.description;

  const time = document.createElement("p");
  time.className = "time";
  const label = mode.charAt(0).toUpperCase() + mode.slice(1);
  time.textContent = label + ": " + minutesFor(route.miles, speedFor(mode)) + " min";

  article.append(h3, facts, desc, time);
  return article;
}

function drawRoutes(mode) {
  const holder = document.querySelector(".routes");
  holder.textContent = "";
  for (const route of routes) {
    holder.append(routeCard(route, mode));
  }
}

/* ---------- Part 4: the Walk / Bike / Drive buttons ---------- */
const modeButtons = document.querySelectorAll("[data-mode]");
for (const btn of modeButtons) {
  btn.addEventListener("click", function () {
    drawRoutes(btn.dataset.mode);
    // Tell screen readers (and Dev's eyes) which mode is showing
    for (const other of modeButtons) {
      other.setAttribute("aria-pressed", other === btn ? "true" : "false");
    }
  });
}

drawRoutes("walk");
