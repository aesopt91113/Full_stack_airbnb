import React from 'react';
import { handleErrors, safeCredentials} from '@src/utils/fetchHelper';

class UnpaidBookings extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      unpaidBooking: props.unpaidBooking,
    }

    this.initiateStripeCheckout = this.initiateStripeCheckout.bind(this);
    this.handleDeleteBooking = this.handleDeleteBooking.bind(this);
    this.renderGuest_booking = this.renderGuest_booking.bind(this);
    this.renderUser_booking = this.renderUser_booking.bind(this);
    this.determineMode = this.determineMode.bind(this);
  }

  componentDidMount() {
    this.determineMode()
  }
  
  initiateStripeCheckout() {
    const booking_id = this.props.unpaidBooking.id;

    return fetch(`/api/charges?booking_id=${booking_id}&cancel_url=${window.location.pathname}`, safeCredentials({
      method: 'POST',
    }))
      .then(handleErrors)
      .then(response => {
        const stripe = Stripe(process.env.STRIPE_PUBLISHABLE_KEY);
        
        stripe.redirectToCheckout({
          // Make the id field from the Checkout Session creation API response
          // available to this file, so you can provide it as parameter here
          // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
          sessionId: response.charge.checkout_session_id,
        }).then((result) => {
          // If `redirectToCheckout` fails due to a browser or network
          // error, display the localized error message to your customer
          // using `result.error.message`.
        });
      })
      .catch(error => {
        console.log(error);
      })
  }

  handleDeleteBooking(bookingID) {
    // need to finish .destroy function and need to undo the blocked date for the property
    fetch(`/api/booking/${bookingID}`, safeCredentials({
      method: 'DELETE',
    }))
    .then(handleErrors)
    .catch(error => {
      console.log('delete unsuccessful')
    })
    .then(window.location.reload(true))
  }

  determineMode() {
    const user_booking = 'user_booking'
    var checkMode = (window.location.pathname).includes(user_booking);

    if (checkMode) {
      return this.renderUser_booking(this.state.unpaidBooking);
    }
    else {
      return this.renderGuest_booking(this.state.unpaidBooking);
    }
  }

  renderUser_booking(unpaidBooking) {
    return (
      <div>
        <h5>{unpaidBooking.property.title}</h5>
        <p>Check-in date: {unpaidBooking.start_date}</p>
        <p>Check-out date: {unpaidBooking.end_date}</p>
        <button className="btn btn-danger float-right" onClick={this.initiateStripeCheckout}>Pay Now</button>
        <button className="btn btn-secondary float-left" onClick={() => this.handleDeleteBooking(unpaidBooking.id)}>Cancel Booking</button> 
      </div>
    )
  }

  renderGuest_booking(unpaidBooking) {
    return (
      <div>
        <h5>{unpaidBooking.property.title}</h5>
        <p>Username: {unpaidBooking.user}</p>
        <p>Check-in date: {unpaidBooking.start_date}</p>
        <p>Check-out date: {unpaidBooking.end_date}</p>
      </div>
    )
  }

  render() {
    const { unpaidBooking } = this.state;

    // if (!mode) return <div>loading</div>

    return(
      <div className="col-4 mb-2 pb-3 border">
        <div className="pt-3 pl-1">
          { this.determineMode() }
        </div>
      </div>
    )
  }
}

export default UnpaidBookings;