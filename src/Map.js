
import React, { useState, useEffect,useRef } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import wildfireDataJSON from './data/bc-wildfires.geojson';
import RiskChecker from "./RiskChecker"; 



function MapComponent() {
    const [wildfireData, setWildfireData] = useState(null);
    const [loading, setLoading] = useState(true);
const mapRef = useRef(null);


    useEffect(() => {
        // Handle different import formats
        const loadData = async () => {
            try {
                let data = wildfireDataJSON;
                
                // Check if wrapped in default
                if (data.default) {
                    data = data.default;
                }
                
                // If it's a URL/path string, fetch it
                if (typeof data === 'string') {
                    const response = await fetch(data);
                    data = await response.json();
                }
                
                console.log('✅ Loaded fires:', data?.features?.length || 0);
                console.log('📍 First fire:', data?.features?.[0]?.properties);
                
                setWildfireData(data);
                setLoading(false);
            } catch (error) {
                console.error('❌ Error loading data:', error);
                setLoading(false);
            }
        };
        
        loadData();
    }, []);

    const [viewState, setViewState] = useState({
        longitude: -122.7497,
        latitude: 53.9171,
        zoom: 8
    });

    const [selectedFire, setSelectedFire] = useState(null);
    const [showWildFires, setShowWildFires] = useState(true);
    const [filterYear, setFilteryear] = useState('all');
    

    // Show loading screen
    if (loading || !wildfireData) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
            }}>
                🔥 Loading BC Wildfire Data...
            </div>
        );
    }

   

    //this is to get a unique year from adataset and making sure something is loaded
    const availableYears = wildfireData.features ?
    [...new Set (wildfireData.features.map(f=> f.properties.FIRE_YEAR))].sort().reverse() 
    : [];

    //Filter fires by year
    const filteredFires = !wildfireData.features ? [] :
    filterYear === 'all'
    ? wildfireData.features // get all features form the data
    :wildfireData.features.filter(f=> f.properties.FIRE_YEAR === parseInt(filterYear)) //get features of a specific year
   

    // Get specific Location by Long. and Lan
    //const 
   // Determine marker color by fire size
   // 
   if (loading) {
    return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        🔥 Loading wildfire data...
    </div>;
}

   const getMarkerColor=(sizeHa)=> {
    if(!sizeHa || sizeHa ===0) return '#00ff33ff'; // Vey small
    if(sizeHa > 5000) return '#ff0000'; //Massive
    if(sizeHa> 1000) return '#ffA500'; //Large
    if(sizeHa >500) return '#FFFF00'; // Medium
    else return '#00ff33ff'  // Small
   };

    // Function to determine marker size
  const getMarkerSize = (sizeHa) => {
    if (!sizeHa || sizeHa === 0) return 10;
    if (sizeHa > 5000) return 28;
    if (sizeHa > 1000) return 22;
    if (sizeHa > 100) return 18;
    return 14;
  };

   //Format the Date

   const formatDate =(dateString) => {
    if(!dateString) return "N/A";
    const year = dateString.substring(0,4); //my dataset only has the year so...🤷‍♂️
    const month = dateString.substring(4,6);
    const day = dateString.substring(6,8);
    return `${year}-${month}- ${day}`;
   };

   //Calculate stats
   const totalFires= filteredFires.length;
   const activeFires= filteredFires.filter(f=> f.properties.FIRE_STATUS !== 'Out').length;
   const totalArea = filteredFires.reduce((sum,f) => sum + (f.properties.CURRENT_SIZE || 0),0)
//    const hazards= [
//         {
//             id:1,
//             name:"Industrial Site Example",
//             longitude: -122.7497,
//             latitude: 53.9171,
//             type: "pollution",
//             severity: "high"
//         }

//         //More hazard types wil go here
//     ];

    return(
        
        <div style= {{height: '100vh', width: '100%', position: 'relative'}}>
            {/*Control Panel */}

            <div style={{
                position: 'absolute',
                top: 20,
                left : 20,
                zIndex: 1,
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                boxShadow : '0 2px 8px rgba(0,0,0,0.15)',
                maxWidth: '320px',
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                <h2 style ={{margin: '0 0 10px 0', fontSize: '20px'}}>Enviromental Hazards & Health</h2>
                <p style ={{ margin :'0 0 15px 0', fontSize: '14px', color: '#666' }}>BC WIldfire Impact Analysis</p>
            
            {/*Stats*/}
            <div>
                <p style= {{ margin :'0 0 5px 0', fontSize: '14px'}}><strong>Total Fires: </strong>{totalFires.toLocaleString()}</p>
                <p style= {{ margin :'0 0 5px 0', fontSize: '14px'}}><strong>Active Fires: </strong> {activeFires}</p>
                <p style= {{ margin :'0', fontSize: '14px'}}><strong>Total Area Covered: </strong>{totalArea.toLocaleString()}</p>
            </div>

            {/*YearFilter*/}
            <div style = {{marginBottom : '15px'}}>
                <label style = {{ fontSize: '14px', fontStyle: 'bold', display:'block', marginBottom: '7px' }}>Filter by Year: </label>

                <select
                value = {filterYear}
                onChange={(e)=> setFilteryear(e.target.value)}
                style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    fontSize: '14px'
                }}
                >

                <option value = "all">All Years</option>
                {availableYears.map(year=>(
                    <option key = {year} value= {year}>{year}</option>
                ))}

                </select>

               
            </div>

           <RiskChecker
  mapboxToken={process.env.REACT_APP_MAPBOX_TOKEN}
  wildfireGeoJson={wildfireData}   // ✅ FeatureCollection
  mapRef={mapRef}                  // ✅ enables flyTo()
/>




            {/*Toggle Controls */}
            <div style= {{marginBottom: '15px'}}>
                <label style= {{display: 'flex', alignItems:'center', cursor: 'pointer'}}>
                    <input
                    type= "checkbox"
                    checked= {showWildFires}
                    onChange={(e) => setShowWildFires(e.target.checked)}
                    style= {{marginRight: '8px'}} />
                    <span>Show WildFires</span>
                </label>

                
            </div>
            {/*Legend */}
            <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #ddd' }}>
          <h3 style={{ margin: '0 0 10px 0', fontSize: '14px' }}>Fire Size (hectares)</h3>
          <div style={{ fontSize: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
              <div style={{ width: '15px', height: '15px', backgroundColor: '#ff0000', borderRadius: '50%', marginRight: '8px' }}></div>
              <span>Extreme (&gt;5000 ha)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
              <div style={{ width: '15px', height: '15px', backgroundColor: '#ffA500', borderRadius: '50%', marginRight: '8px' }}></div>
              <span>Large (1000-5000 ha)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
              <div style={{ width: '15px', height: '15px', backgroundColor: '#DFFF00', borderRadius: '50%', marginRight: '8px' }}></div>
              <span>Medium (100-1000 ha)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
              <div style={{ width: '15px', height: '15px', backgroundColor: '#00ff33ff', borderRadius: '50%', marginRight: '8px' }}></div>
              <span>Small (&lt;100 ha)</span>
            </div>
          </div>
        </div>

        {/*Course Connection */}
        <div style= {{
            marginTop: '20px',
            paddingTop: '15px',
            borderTop: '1px solid #ddd',
            fontSize: '12px',
            color: '#666'
        }}>
            <p style= {{margin :'0'}}>
                <strong>Course Topics: </strong> Enviromental Hazards, Climate Change Effects, Place-based Health differences
            </p>
        </div>
            
            </div>
            <Map
            ref= {mapRef}
            
            {...viewState}
            onMove={evt => setViewState(evt.viewState)}
            mapStyle="mapbox://styles/mapbox/light-v11"
            mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
            >

            {/*Render Wildfire MArker*/}
            {showWildFires && filteredFires.map((fire, index) => {
                const coords = fire.geometry.coordinates;
                const size = fire.properties.CURRENT_SIZE || 0;

                return(
                    <Marker
                    key = {fire.properties.OBJECTID || index}
                    longitude= {coords[0]}
                    latitude={coords[1]}
                    onClick={e => {
                        e.originalEvent.stopPropagation();
                        setSelectedFire(fire);
                    }}
                    >
                        <div style ={{
                            backgroundColor: getMarkerColor(size),
                            width: `${getMarkerSize(size)}px`,
                            height: `${getMarkerSize(size)}px`,
                            borderRadius: '50%',
                            border: '2px solid white',
                            cursor: 'pointer',
                            opacity: 0.8,
                            transition: 'all 0.2s',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity= '1'}
                        onMouseLeave={(e)=> e.currentTarget.style.opacity='0.8'}
                        />
                    </Marker>
                );
            })}

            {/*Popup on click*/}
            {selectedFire && (
                <Popup
                    longitude= {selectedFire.geometry.coordinates[0]}
                    latitude= {selectedFire.geometry.coordinates[1]}
                    onClose= {() => setSelectedFire(null)}
                    closeOnClick= {false}
                    anchor= "bottom"
                >

                <div style={{ padding: '8px', minWidth: '250px' }}>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#333' }}>
                {selectedFire.properties.GEOGRAPHIC_DESCRIPTION || selectedFire.properties.INCIDENT_NAME}
              </h3>
              
              <div style={{ fontSize: '13px', lineHeight: '1.6' }}>
                <p style={{ margin: '5px 0' }}>
                  <strong>Fire Number:</strong> {selectedFire.properties.FIRE_NUMBER}
                </p>
                <p style={{ margin: '5px 0' }}>
                  <strong>Year:</strong> {selectedFire.properties.FIRE_YEAR}
                </p>
                <p style={{ margin: '5px 0' }}>
                  <strong>Current Size:</strong> {selectedFire.properties.CURRENT_SIZE.toLocaleString()} ha
                </p>
                <p style={{ margin: '5px 0' }}>
                  <strong>Status:</strong> <span style={{ 
                    color: selectedFire.properties.FIRE_STATUS === 'Out' ? 'green' : 'red',
                    fontWeight: 'bold'
                  }}>
                    {selectedFire.properties.FIRE_STATUS}
                  </span>
                </p>
                <p style={{ margin: '5px 0' }}>
                  <strong>Cause:</strong> {selectedFire.properties.FIRE_CAUSE}
                </p>
                <p style={{ margin: '5px 0' }}>
                  <strong>Ignition Date:</strong> {formatDate(selectedFire.properties.IGNITION_DATE)}
                </p>
                {selectedFire.properties.FIRE_OUT_DATE && (
                  <p style={{ margin: '5px 0' }}>
                    <strong>Out Date:</strong> {formatDate(selectedFire.properties.FIRE_OUT_DATE)}
                  </p>
                )}
                {selectedFire.properties.FIRE_URL && (
                  <p style={{ margin: '10px 0 0 0' }}>
                    <a 
                      href={selectedFire.properties.FIRE_URL} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#0066cc', textDecoration: 'underline' }}
                    >
                      View Details →
                    </a>
                  </p>
                )}
              </div>
            </div>
          </Popup>

            )}


            </Map>
            </div>
    );

}

export default MapComponent