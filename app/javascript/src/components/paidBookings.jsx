import React from 'react';

class PaidBookings extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      paidBooking: props.paidBooking,
      mode: false,
    }

    this.determineMode = this.determineMode.bind(this);
    this.renderGuest_booking = this.renderGuest_booking.bind(this);
    this.renderUser_booking = this.renderUser_booking.bind(this);
  }

  componentDidMount() {
    // this.determineMode()
  }

  
  renderUser_booking(paidBooking) {
    return (
      <div>
        <h5>{paidBooking.property.title}</h5>
        <p>Check-in date: {paidBooking.start_date}</p>
        <p>Check-out date: {paidBooking.end_date}</p>
      </div>
    )
  }
  
  renderGuest_booking(paidBooking) {
    return (
      <div>
        <h5>{paidBooking.property.title}</h5>
        <p>Username: {paidBooking.user}</p>
        <p>Check-in date: {paidBooking.start_date}</p>
        <p>Check-out date: {paidBooking.end_date}</p> 
      </div>
    )
  }

  determineMode() {
    const user_booking = 'user_booking'

    var checkMode = (window.location.pathname).includes(user_booking) 
    if (checkMode) {
      return this.renderUser_booking(this.props.paidBooking)
    }
    else {
      return this.renderGuest_booking(this.props.paidBooking)
    }
  }
  
  render() {
    const { paidBooking } = this.state;

    return(
      <div className="col-4 mb-2  border">
        <div className="pt-3 pl-1">
          {this.determineMode()}
        </div>
      </div>
    )
  }
}

export default PaidBookings;