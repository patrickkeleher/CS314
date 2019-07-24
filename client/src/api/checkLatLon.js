import coordParser from 'coord-parser';


export const isValidLatLon = (lat,lon)=>{
  const parsedLatLon = parseLatLon(lat,lon);
  if (isParseValid(parsedLatLon)){
    if (checkValidLatLonRange(parsedLatLon.lat,parsedLatLon.lon)){return true}

  }
  else{
    //console.log("bad lat lon");
  }


  return false;
};



export const parseLatLon = (lat,lon) => {
  const latLon = `${lat}, ${lon}`;

  let parsedLatLon = {};

  try {
    parsedLatLon = coordParser(latLon);
    parsedLatLon.lat = parsedLatLon.lat.toString();
    parsedLatLon.lon = parsedLatLon.lon.toString();

  }
  catch (e) {}
  return parsedLatLon;

};

const isParseValid = (parsedLatLon) => {
  return Object.keys(parsedLatLon).length === 2
};

export const checkValidLatLonRange = (lat,lon) =>{
  const checkLatRange = parseFloat(lat) >= -90 && parseFloat(lat) <= 90;
  const checkLonRange = parseFloat(lon) >= -180 && parseFloat(lon) <= 180;
  return checkLatRange && checkLonRange;
};