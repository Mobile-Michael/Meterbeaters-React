import React, { Component } from "react";
import TimePicker from "react-time-picker";
import HourButtonHotKeys from "./HourButtonHotKeys";
import moment from "moment";

//DEVTEST should do this in UTC time but for now hard code it at CST

class DatePickerComponent extends Component {
  render() {
    const TextName = this.sanityCheckTimes() ? "SafeText" : "WarnableText";
    return (
      <span>
        <div>
          <h3 className={TextName}>Begin Park Time</h3>
          <TimePicker
            clearIcon={null}
            onChange={this.onChangeStart}
            value={this.props.timeStart}
          />
        </div>
        <div>
          <HourButtonHotKeys
            click={this.onHourHotButtonClicked}
            name="startTime"
          />
        </div>
        <div>
          <h3 className={TextName}>End Park Time</h3>
          <TimePicker
            clearIcon={null}
            onChange={this.onChangeEnd}
            value={this.props.timeEnd}
          />
        </div>
        <div>
          <HourButtonHotKeys
            click={this.onHourHotButtonClicked}
            name="endTime"
          />
        </div>
      </span>
    );
  }

  getHHMM_fromString(timeString) {
    const time_components = timeString.split(":");
    console.log(time_components);
    return [parseInt(time_components[0]), time_components[1]];
  }

  getHHMM_asString(timeString) {
    return timeString.split(":").join("");
  }

  onHourHotButtonClicked = (hoursToAdd, type) => {
    console.log(
      "hot button clicked:",
      hoursToAdd,
      type,
      this.props.timeEnd,
      this.props.timeStart
    );

    const isEndTime = type === "endTime";

    let newTimeStr = "";
    if (hoursToAdd > 0 && (this.props.timeStart && this.props.timeEnd)) {
      let hh_mm_components = isEndTime
        ? this.getHHMM_fromString(this.props.timeEnd)
        : this.getHHMM_fromString(this.props.timeStart);

      hh_mm_components[0] += hoursToAdd;
      newTimeStr =
        hh_mm_components[0] >= 24 ? "23:59" : hh_mm_components.join(":");
    } else {
      //aka time  now!
      newTimeStr = moment(new Date()).format("HH:mm");
    }

    this.props.timeChanged(isEndTime, newTimeStr);
  };

  sanityCheckTimes = () => {
    console.log("In SanityCHeck", this.props.timeStart, this.props.timeEnd);
    return this.props.timeStart <= this.props.timeEnd;
  };

  onChangeStart = time => {
    this.props.timeChanged(false, time);
  };

  onChangeEnd = time => {
    this.props.timeChanged(true, time);
  };
}

export default DatePickerComponent;
