import React, { Component } from "react";
import Geosuggest from "react-geosuggest";
import "./geosuggest.css";

/*global google*/

import MBGoogleMap from "../GoogleMap/MBGoogleMap.js";

class LocationTextField extends Component {
  state = {};

  componentDidMount() {
    console.log("Location  and Map Mounted");
  }

  onSuggestSelect = Suggest => {
    this.props.suggest(Suggest);
  };

  onParkClicked = () => {
    this.props.findParking();
  };

  onMarkerClicked = info => {
    this.props.onLeadClicked(info);
    console.log("lead info clicked");
  };

  render() {
    let lawFirmName = "NA";
    if (this.props.selectedLead) {
      if (
        this.props.selectedLead.name &&
        this.props.selectedLead.name.length > 0
      )
        lawFirmName = this.props.selectedLead.name;
    }

    return (
      <div>
        <hr />
        <h4>Where Do You Want To Park?</h4>
        <Geosuggest
          placeholder="Where do you want to park?"
          initialValue="Willis Tower"
          onSuggestSelect={this.onSuggestSelect}
          location={new google.maps.LatLng(41.8789, 87.6359)}
          radius={20}
        />
        {this.props.selectedLead ? (
          <h5>Selected Law Firm: {lawFirmName}</h5>
        ) : null}

        <MBGoogleMap
          lat={this.props.lat}
          lng={this.props.lng}
          zoom={16}
          polylines={this.props.parkingInfo}
          leadsGeoMarkers={this.props.leadsInfo}
          onLeadClick={this.onMarkerClicked}
          isMarkerShown={true}
          selectedLead={this.props.selectedLead}
          containerElement={<div style={{ height: `400px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
      </div>
    );
  }
}

export default LocationTextField;
