import { geoEquirectangular, geoGraticule10, geoPath } from "d3-geo";
import { feature, mesh } from "topojson-client";
import type { FeatureCollection, Geometry } from "geojson";
import type { GeometryCollection, Topology } from "topojson-specification";
import countriesData from "world-atlas/countries-50m.json";
import LocationInteractive from "./LocationInteractive";

const width = 520;
const height = 260;
const sphere = { type: "Sphere" } as const;

type WorldObjects = {
  countries: GeometryCollection;
  land: GeometryCollection;
};

const topology = countriesData as unknown as Topology<WorldObjects>;
const countriesObject = topology.objects.countries;
const projection = geoEquirectangular().fitExtent(
  [
    [0, 0],
    [width, height],
  ],
  sphere,
);
const path = geoPath(projection);
const countries = feature(topology, countriesObject) as FeatureCollection<Geometry>;
const borders = mesh(topology, countriesObject, (a, b) => a !== b);

const countryPaths = countries.features
  .filter((country) => String(country.id) !== "010")
  .map((country, index) => ({
    id: String(country.id),
    key: `${String(country.id ?? "country")}-${index}`,
    d: path(country) ?? "",
  }))
  .filter((country) => country.d);

const india = countryPaths.find((country) => country.id === "356");
const otherCountries = countryPaths.filter((country) => country.id !== "356");
const mumbai = projection([72.8777, 19.076]) ?? [352, 144];

const routeOrigins: Array<[number, number]> = [
  [-74.006, 40.7128],
  [-0.1276, 51.5072],
  [103.8198, 1.3521],
];

function routePath(origin: [number, number]) {
  const start = projection(origin);
  if (!start) {
    return "";
  }

  const controlX = (start[0] + mumbai[0]) / 2;
  const controlY = Math.min(start[1], mumbai[1]) - 24;
  return `M${start[0].toFixed(2)},${start[1].toFixed(2)} Q${controlX.toFixed(
    2,
  )},${controlY.toFixed(2)} ${mumbai[0].toFixed(2)},${mumbai[1].toFixed(2)}`;
}

export default function Location() {
  const markerLeft = `${(mumbai[0] / width) * 100}%`;
  const markerTop = `${(mumbai[1] / height) * 100}%`;

  return (
    <LocationInteractive markerLeft={markerLeft} markerTop={markerTop}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label="Detailed Natural Earth world map showing Mumbai, India"
      >
        <rect className="map-ocean" width={width} height={height} />
        <path className="map-graticule" d={path(geoGraticule10()) ?? ""} />

        <g className="map-countries">
          {otherCountries.map((country) => (
            <path key={country.key} className="map-country" d={country.d} />
          ))}
          {india && <path className="map-country map-country-india" d={india.d} />}
        </g>

        <path className="map-borders" d={path(borders) ?? ""} />

        <g className="map-network" aria-hidden="true">
          {routeOrigins.map((origin, index) => {
            const point = projection(origin);

            return (
              <g key={`${origin[0]}-${origin[1]}`}>
                <path
                  className={`map-route map-route-delay-${index}`}
                  d={routePath(origin)}
                />
                {point && <circle cx={point[0]} cy={point[1]} r="2" className="map-node" />}
              </g>
            );
          })}
          <circle cx={mumbai[0]} cy={mumbai[1]} r="2.4" className="map-node map-node-home" />
        </g>

        <text
          x={mumbai[0] + 8}
          y={mumbai[1] + 4}
          className="map-city-label"
        >
          MUMBAI
        </text>
      </svg>
    </LocationInteractive>
  );
}
