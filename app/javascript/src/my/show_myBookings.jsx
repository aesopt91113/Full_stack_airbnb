// show_MyBookings.jsx
import React from 'react';
import { render } from 'react-dom';
import Layout from '@src/layout';
import { handleErrors } from '@src/utils/fetchHelper';

import PaidBookings from '@src/components/paidBookings';
import UnpaidBookings from '@src/components/unpaidBookings';

import '@src/my/show_myBookings.scss'

class Show_MyBookings extends React.Component  {
  constructor(props) {
    super(props)

    this.state = {
      bookings: [],
      paidBooking: {},

      paid: null,
      authenticated: null,
      username: null,
    }
    
    this.renderPaidBookings = this.renderPaidBookings.bind(this);
    this.renderUnpaidBookings = this.renderUnpaidBookings.bind(this);
  }

  componentDidMount() {
    fetch('/api/authenticated')
    .then(handleErrors)
    .then(data => {
      this.setState({
        authenticated: data.authenticated,
        username: data.username,
      })
    })

    // fetch paidBookings details
    fetch('/api/booking', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    .then(handleErrors)
    .then(data => {
      this.setState({
        bookings: data.bookings,
      })
    })
  }

  renderPaidBookings(bookings) {
    const paidBookings = bookings.filter(booking => booking.hasOwnProperty("charge") == true);

    return paidBookings.map(paidBooking => {
      return (
        <PaidBookings key={paidBooking.id} paidBooking={paidBooking}/>
      )
    })
  }

  renderUnpaidBookings(bookings) {
    var unpaidBookings = bookings.filter(booking => booking.hasOwnProperty("charge") == false)

    return unpaidBookings.map(unpaidBooking => {
      return(
        <UnpaidBookings key={unpaidBooking.id} unpaidBooking={unpaidBooking} />
      )
    })
  }

  render() {
    const { bookings, username, authenticated } = this.state;
    const paidBookings = this.renderPaidBookings(bookings)
    const unpaidBookings = this.renderUnpaidBookings(bookings)

    return(
      <Layout authenticated={ authenticated } username={username} >
        <div>
          <h2 className="font-weight-bold p-4 ml-5" >My upcoming trips:</h2>
        </div>
        <hr className="solid"/>
        <h3 id="paidBookings">Paid Bookings</h3>
        
        <div className="d-flex justify-content-center">
          <div className='row col-7'>
            {paidBookings}
          </div>
        </div>
      
        <hr className="solid"/>
        <h3 id="paidBookings">Unpaid Bookings</h3>
        <div className="d-flex justify-content-center">
          <div className="row col-7">
            {unpaidBookings}
          </div>
        </div>
      </Layout>
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  render(
    <Show_MyBookings/>,
    document.body.appendChild(document.createElement('div')),
  )
})
