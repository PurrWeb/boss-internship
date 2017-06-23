import React from "react"
import Select from 'react-select';

export default class VenueFinder extends React.Component {
  constructor(props){
    super(props)

    this.state = {
      venue: { value: this.props.selected_venue.id, label: this.props.selected_venue.name }
    }
  }

  changeVenueHandler(venue) {
    this.setState({
      venue: venue
    }, this.submitForm);
  }

  submitForm() {
    $('.boss-form').submit();
  }

  render() {
    return (
      <Select
        classNames="status-select"
        name="venue_id"
        value={ this.state.venue }
        options={this.venueOptions()}
        onChange={this.changeVenueHandler.bind(this)}
        clearable={false}
        searchable={false}
      />
    )
  }

  venueOptions() {
    return this.props.venues.map(function(venue, index) {
      return { value: venue.id, label: venue.name }
    });
  }
}
