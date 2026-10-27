-- Classwork 4

-- Exercise 1
-- How many hydration stations are in Phoenix?
SELECT count(*)
FROM cooling_centers
WHERE city = 'Phoenix'
  AND kind = 'Hydration Station';

-- Which sites in Mesa allow pets? (names only)
SELECT name
FROM cooling_centers
WHERE city = 'Mesa'
  AND pets = 'Yes';

-- List every Scottsdale site, alphabetically
SELECT name, kind, address
FROM cooling_centers
WHERE city = 'Scottsdale'
ORDER BY name;

-- How many sites are there in Tempe?
SELECT count(*)
FROM cooling_centers
WHERE city = 'Tempe';

-- Exercise 2
-- How many rail stations does each city have? Biggest count first
SELECT city, count(*) AS stations
FROM rail_stations
GROUP BY city
ORDER BY stations DESC;

-- Which sites are in cities of fewer than 50,000 people, with the population?
SELECT s.name, s.city, c.pop_2020
FROM cooling_centers s
JOIN cities c ON s.city = c.name
WHERE c.pop_2020 < 50000
ORDER BY c.pop_2020, s.name;

-- Which Maricopa County cities have at least one library site?
SELECT DISTINCT c.name
FROM cities c
JOIN cooling_centers s ON s.city = c.name
WHERE c.county = 'Maricopa'
  AND s.name ILIKE '%library%'
ORDER BY c.name;

-- Average population of the cities that have at least one site
SELECT round(avg(pop_2020)) AS avg_pop
FROM cities
WHERE name IN (SELECT DISTINCT city FROM cooling_centers);

-- Exercise 3
-- How many hydration stations are within 400 m of a light rail station?
SELECT count(DISTINCT s.id)
FROM cooling_centers s
JOIN rail_stations r
  ON ST_DWithin(s.geom::geography, r.geom::geography, 400)
WHERE s.kind = 'Hydration Station'
  AND r.service = 'Light Rail';

-- How many streetcar stations are there, and in which cities?
SELECT city, count(*) AS streetcar_stations
FROM rail_stations
WHERE service = 'StreetCar'
GROUP BY city;

-- Which station is nearest to Burton Barr Central Library, and how far?
SELECT r.name, r.service,
       round(ST_Distance(s.geom::geography, r.geom::geography)::numeric) AS meters
FROM cooling_centers s, rail_stations r
WHERE s.name = 'Burton Barr Central Library'
ORDER BY ST_Distance(s.geom::geography, r.geom::geography)
LIMIT 1;

-- How many sites fall inside Mesa's polygon?
SELECT count(*)
FROM cooling_centers s
JOIN cities c ON ST_Within(s.geom, c.geom)
WHERE c.name = 'Mesa';

-- How many sites say city = 'Mesa'?
SELECT count(*)
FROM cooling_centers
WHERE city = 'Mesa';