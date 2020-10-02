import React from 'react';
import { render } from 'react-dom';
import Layout from '@src/layout';
import { handleErrors } from '@src/utils/fetchHelper';
import "@src/booking/success_booking.scss";

class Success extends React.Component {
  constructor(props) {
    super(props);
      
    this.state = {
      booking: undefined,
    }
  }

  componentDidMount() {
    // fetch booking information
    fetch(`/api/bookings/${window.location.pathname.split('/')[2]}`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'}
    })
    .then(handleErrors)
    .then(data => {
      this.setState({
        booking: data.booking
      })
    })
    .catch(() => {
      this.setState({
        booking: null
      })
    })

    fetch('/api/authenticated')
    .then(handleErrors)
    .then(data => {
      this.setState({
        authenticated: data.authenticated,
        username: data.username,
      })
    })
  }

  render() {
    if (this.state.booking === undefined) return <Layout><div>loading</div></Layout>
    if (this.state.booking === null) return <Layout><div>Booking Not Found</div></Layout>

    const { 
      booking: { 
        id: bookingID,
        start_date: startDate,
        end_date: endDate,
        charge: { id: chargeID, amount, complete, currency },
        property: { id: propertyID, title }
      },
      booking, authenticated
    } = this.state;

    return (
      <Layout authenticated={authenticated}>
        <h3 className="pt-3 pl-5 pb-2" style={{ color: "red" }}>Congratulation! Your booking has been made.</h3>
        <div className="container">
          <div className="row mb-4">
            <div className="card col-8">
              <div id="card-body" className="card-body">
                <h4>The following information is for your reference:</h4>
                <p>Property name: {this.state.booking.property.title}</p>
                <p>Booking id: {booking.id}</p>
                <p>Check-in date: {booking.start_date}</p>
                <p>Check-out date: {booking.end_date}</p>
                <p>Amount: ${booking.charge.amount}</p>
                <div className="d-flex">
                  <p>Currency: </p>
                  <p id="currency">{booking.charge.currency}</p>
                </div>
                <a href="/" className="btn btn-primary float-right">Back to Home</a>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  render(
    <Success />,
    document.body.appendChild(document.createElement('div')),
  )
})