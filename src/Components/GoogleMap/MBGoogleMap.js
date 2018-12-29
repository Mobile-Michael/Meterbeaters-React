import * as React from "react";
import { GoogleMap, Marker, withGoogleMap } from "react-google-maps";

import Polyline from "react-google-maps/lib/components/Polyline";
import logo from "./MBLogo.png";

/*global google*/

const MBGoogleMap = withGoogleMap(props => {
  let markers = null;
  console.log("leadInfo: ", props.selectedLead);
  if (props.selectedLead) {
    console.log(props.selectedLead.lead_id);
  }
  markers = props.leadsGeoMarkers.map((geoMarkInfo, index) => {
    if (
      props.selectedLead &&
      props.selectedLead.lead_id === geoMarkInfo.lead_id
    ) {
      return (
        <Marker
          key={geoMarkInfo.lead_id}
          onClick={() => {
            props.onLeadClick(geoMarkInfo);
          }}
          icon={{ url: logo, scaledSize: new google.maps.Size(32, 32) }}
          position={{ lat: geoMarkInfo.lat, lng: geoMarkInfo.lng }}
        />
      );
    } else {
      return (
        <Marker
          key={geoMarkInfo.lead_id}
          onClick={() => {
            props.onLeadClick(geoMarkInfo);
          }}
          //icon={{ url: logo, scaledSize: new google.maps.Size(32, 32) }}
          position={{ lat: geoMarkInfo.lat, lng: geoMarkInfo.lng }}
        />
      );
    }
  });

  console.log("markers: ", markers);

  return (
    <GoogleMap
      defaultZoom={8}
      zoom={props.zoom}
      defaultCenter={{ lat: props.lat, lng: props.lng }}
      center={{ lat: props.lat, lng: props.lng }}
    >
      {props.polylines.map((polyline, index) => (
        <Polyline
          key={index}
          path={polyline}
          //geodesic={true}
          options={{
            strokeColor: "#008b45",
            strokeOpacity: 0.75,
            strokeWeight: 3
          }}
        />
      ))}

      {markers}
    </GoogleMap>
  );
});

export default MBGoogleMap;
