import React, { Component } from "react";
import "./App.css";
import DatePickerComponent from "./Components/DatePickerComponent";
import GeoSuggestTextField from "./Components/GeoSuggestTextField/GeoSuggestTextField.js";
import MBNavBar from "./Components/NavBar/MBNavBar";
import axios from "axios";

const DEFAULT_LAT = 41.8789;
const DEFAULT_LNG = -87.6359;

class App extends Component {
  state = {
    lat: DEFAULT_LAT,
    lng: DEFAULT_LNG,
    startTime: "11:00",
    endTime: "12:00",
    parkingDataRaw: [],
    leadsDataRaw: [],
    selectedLead: null,
    generateLeadsCalled: false,
    clearCalled: false
  };

  getErrors() {
    if (this.state.startTime > this.state.endTime)
      return "Start Time Is After End Time!";
    else if (!this.state.lat || !this.state.lng)
      return "Parking Location Is Not Set!";
    else return false;
  }

  onTimeChanged = (isEnd, time) => {
    console.log("linked time component", isEnd, time);
    if (isEnd) this.setState({ endTime: time });
    else this.setState({ startTime: time });
  };

  onSuggestCallback = suggest => {
    if (suggest) {
      const { lat, lng } = suggest.location;
      console.log(lat, lng);
      this.setState({ lat: lat, lng: lng });
    } else {
      this.setState({ lat: DEFAULT_LAT, lng: DEFAULT_LNG });
    }

    this.findParking();
  };

  onLeadClicked = info => {
    this.setState({ selectedLead: info });
    console.log("LeadInfo", info);
  };

  generateLeads = () => {
    const postParams = {
      Longitude: this.state.lng,
      Latitude: this.state.lat,
      Distance: 0.00434783
    };

    console.log("Lead Params: ", postParams);

    console.log(postParams);
    axios
      .post("<YOUR_BACK_END_SERVER_HERE>", postParams)
      .then(response => {
        console.log("Leads Data received");
        console.log(response.data.length);
        if (response.data.length) {
          console.log(response.data);
          this.setState({ leadsDataRaw: response.data, generateLeads: true });
        } else this.setState({ leadsDataRaw: [], generateLeads: true });
      })
      .catch(error => {
        console.log("Error:get generate leads: ", error);
      });

    this.findParking();
  };

  findParking = () => {
    if (this.getErrors()) {
      console.log("Errors in inputs not continuing!");
      return;
    }

    console.log(this.state.lat);
    const postParams = this.GetParkingURL();
    console.log(postParams);
    axios
      .post("<YOUR_BACK_END_SERVER_HERE>", postParams)
      .then(response => {
        console.log("Data received");
        console.log(response.data.length);
        if (response.data.length) {
          this.setState({ parkingDataRaw: response.data });
        } else {
          this.setState({ parkingDataRaw: [] });
        }
      })
      .catch(error => {
        console.log("Error:get parking: ", error);
      });
  };

  getHHMM_asString(timeString) {
    return timeString.split(":").join("");
  }

  clearMap = () => {
    this.setState({
      parkingDataRaw: [],
      leadsDataRaw: [],
      selectedLead: null,
      clearCalled: true
    });
  };

  GetParkingURL = () => {
    const postParams = {
      StartTime: this.getHHMM_asString(this.state.startTime),
      EndTime: this.getHHMM_asString(this.state.endTime),
      Longitude: this.state.lng,
      Latitude: this.state.lat,
      Distance: 0.00434783,
      startDay: 7,
      endDay: 7,
      numDays: 0,
      email: "reacttest@react.com",
      YMDstring: "2018-12-22",
      parkType: 0,
      Type: 1
    };

    return postParams;
  };
  //
  componentDidMount() {
    console.log("mounted called");
    this.generateLeads();
  }

  render() {
    let parkingData = [];
    if (this.state.parkingDataRaw && this.state.parkingDataRaw.length) {
      parkingData = this.state.parkingDataRaw.map((dataForSpot, index) => {
        //const id = dataForSpot["ID"];
        const latStart = parseFloat(dataForSpot["BeginLat"]);
        const latEnd = parseFloat(dataForSpot["EndLat"]);
        const longStart = parseFloat(dataForSpot["BeginLong"]);
        const longEnd = parseFloat(dataForSpot["EndLong"]);
        const insert = [
          { lat: latStart, lng: longStart },
          { lat: latEnd, lng: longEnd }
        ];
        return insert;
      });
    }

    let leadsData = [];
    if (this.state.leadsDataRaw && this.state.leadsDataRaw.length) {
      leadsData = this.state.leadsDataRaw.map((dataForSpot, index) => {
        //const id = dataForSpot["ID"];
        const latInfo = parseFloat(dataForSpot["lat"]);
        const lngInfo = parseFloat(dataForSpot["lng"]);
        const id = parseInt(dataForSpot["task_id"]);
        const name = dataForSpot["name"];
        const insert = { lat: latInfo, lng: lngInfo, lead_id: id, name: name };
        return insert;
      });
    }

    let warning = this.getErrors();
    let parkingInfoFooter = null;
    if (this.state.clearCalled) {
      parkingInfoFooter = (
        <div>
          <h3 m-2>
            There Are Whispers of Leads around Santa Barbara, CA and the Willis
            Tower!
          </h3>
        </div>
      );
    } else {
      parkingInfoFooter =
        parkingData.length > 0 ? (
          <h1>{parkingData.length} Parking Spots Available!</h1>
        ) : (
          <h4>No Parking Data Available Here!</h4>
        );
    }

    return (
      <div className="App">
        <MBNavBar />
        <DatePickerComponent
          timeChanged={(isEnd, time) => this.onTimeChanged(isEnd, time)}
          timeStart={this.state.startTime}
          timeEnd={this.state.endTime}
        />
        <button
          className="btn btn-primary btn-md m-2"
          onClick={this.findParking}
        >
          Find Parking!
        </button>

        <button
          className="btn btn-success btn-md m-2 btn-tooltip"
          onClick={this.generateLeads}
          data-placement="bottom"
          title="Try Willis Tower Or Santa Barba For Leads!"
        >
          Generate Law Firm Leads And Park!
        </button>

        <button className="btn btn-danger btn-md m-2" onClick={this.clearMap}>
          Clear Map!
        </button>

        <h3 className="WarnableText">{warning}</h3>

        <GeoSuggestTextField
          suggest={suggest => this.onSuggestCallback(suggest)}
          lat={this.state.lat}
          lng={this.state.lng}
          parkingInfo={parkingData}
          leadsInfo={leadsData}
          selectedLead={this.state.selectedLead}
          onLeadClicked={info => this.onLeadClicked(info)}
        />

        {parkingInfoFooter}
      </div>
    );
  }
}

export default App;
