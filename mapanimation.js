
mapboxgl.accessToken = 'pk.eyJ1IjoicmVuZXY4OCIsImEiOiJjanp5cGl1MDQxY2s1M2JwMGwwMnZkcTF3In0.Fq7LSEQ7aBcImlozCt3-wA';

const map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/mapbox/streets-v11',
	center: [-71.104081, 42.3655541],
	zoom: 14
});

function bearing(direction) {
  let heading;
  switch (true) {
    case (direction < 25):
      heading = 'North';
      break;
    case (direction < 75):
      heading = 'North East';
      break;
    case (direction < 105):
      heading = 'East';
      break;
    case (direction < 165):
      heading = 'South East';
      break;
    case (direction < 195):
      heading = 'South';
      break;
    case (direction < 255):
      heading = 'South West';
      break;
    case (direction < 295):
      heading = 'West';
      break;
    case (direction < 350):
      heading = 'North West';
      break;
    // case (direccion < 365):
    //   heading = 'North';
    //   break;
    default:
      heading: 'North';
      break;
  }
  return heading;
}

async function run(){
    // get bus data    
	const locations = await getBusLocations();
	console.log(new Date());
	// console.log(locations);

	
	locations.forEach((item) => {
		let coor = []
		coor.push(item.attributes.longitude);
		coor.push(item.attributes.latitude);
		
	
		let occupancy;
		if (item.attributes.occupancy_status === 'MANY_SEATS_AVAILABLE') {
			occupancy = 'Not Crowded';
		}
		else if (item.attributes.occupancy_status === 'FEW_SEATS_AVAILABLE') {
			occupancy = 'Some Crowding';
		}
		else if (item.attributes.occupancy_status === 'FULL') {
			occupancy = 'Crowded';
		}
		else {
			occupancy = 'Undefined';
		}
    
    let heading = bearing(item.attributes.bearing);

		let marker = new mapboxgl.Marker()
			.setLngLat(coor)
			.setPopup(new mapboxgl.Popup().setHTML("<h2>Bus: "+item.attributes.label+ "</h2> <p>Ocuppancy: "+ occupancy +"</p> <p>Heading: "+ heading + "</p>"))
			.addTo(map);
	})
	

	// timer
	// setTimeout(run, 15000);
}

// Request bus data from MBTA
async function getBusLocations(){
	const url = 'https://api-v3.mbta.com/vehicles';
	const response = await fetch(url);
	const json     = await response.json();
	return json.data;
}

run();