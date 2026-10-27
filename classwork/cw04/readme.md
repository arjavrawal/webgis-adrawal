## Classwork 04: SQL & Spatial SQL
### Arjav Rawal
Queried the heat-relief database (cooling centers, hydration stations and respite sites, Valley Metro rail stations, and city boundaries) in pgAdmin. All queries are in [`cw04.sql`](cw04.sql).

### Exercise 1

1) 56 hydration stations in Phoenix

2) Only one Mesa site allows pets: First United Methodist Church of Mesa Outreach Center.

3) Scottsdale has 10 sites: Appaloosa Library, Arabian Library, Cholla Health Center, Civic Center Library, Granite Reef Senior Center, Mustang Library, Paiute Neighborhood Center, Scottsdale Congregational United Church of Christ, Via Linda Senior Center, and Vista del Camino Community Center.

4) There are 3 sites in Tempe.

### Exercise 2

1) Phoenix has 41 rail stations, Tempe has 23 (both light rail and streetcar), and Mesa has 7.

2) Eight sites are in cities under 50,000: Gila Bend Clinic (1,892), Guadalupe Library (5,322), Litchfield Park Library (6,847), Fountain Hills Library (23,820), and four sites in El Mirage (35,805): the Customer Service center, the Fire Department, the Library, and the Police Department.

3) Fourteen Maricopa County cities have at least one library site: Buckeye, Chandler, El Mirage, Fountain Hills, Gilbert, Glendale, Goodyear, Guadalupe, Litchfield Park, Mesa, Peoria, Phoenix, Scottsdale, and Surprise.

4) The average population of the 17 cities that have at least one site is about 235,913.

### Exercise 3

1) There are nine hydration stations within 400m of a light rail station (6 in Phoenix and 3 in Mesa).

2) There are 14 streetcar stations, all of which are in Tempe.

3) The nearest station to Burton Barr Central Library is McDowell/Central.

4) There are 13 sites that fall inside Mesa's polygon, and there are thirteen sites that have city = 'Mesa'. The two counts match, so for Mesa the city attribute agrees with the boundary.