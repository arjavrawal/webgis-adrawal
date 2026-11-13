SELECT json_build_object(
    'type', 'FeatureCollection',
    'features', json_agg(json_build_object(
        'type', 'Feature',
        'geometry', ST_AsGeoJSON(geom)::json,
        'properties', json_build_object('name', name, 'city', city, 'kind', kind, 'wheelchair', wheelchair)
    ))
)
FROM cooling_centers;

SELECT json_build_object(
    'type', 'FeatureCollection',
    'features', json_agg(json_build_object(
        'type', 'Feature',
        'geometry', ST_AsGeoJSON(geom)::json,
        'properties', json_build_object('name', name, 'city', city, 'service', service)
    ))
)
FROM rail_stations;

SELECT json_build_object(
    'type', 'FeatureCollection',
    'features', json_agg(json_build_object(
        'type', 'Feature',
        'geometry', ST_AsGeoJSON(geom)::json,
        'properties', json_build_object('name', name, 'county', county, 'pop_2020', pop_2020)
    ))
)
FROM cities;
