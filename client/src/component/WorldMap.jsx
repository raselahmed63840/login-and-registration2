import { ComposableMap, Geographies, Geography } from "react-simple-maps";

const WorldMap = () => (
  <div className="bg-white p-4 rounded shadow mb-6">
    <h3 className="font-bold mb-2">Top Countries By Sales</h3>
    <ComposableMap>
      <Geographies geography="https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json">
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography key={geo.rsmKey} geography={geo} fill="#DDD" stroke="#FFF" />
          ))
        }
      </Geographies>
    </ComposableMap>
  </div>
);

export default WorldMap;
