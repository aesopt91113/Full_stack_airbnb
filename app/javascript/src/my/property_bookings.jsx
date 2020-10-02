import React from 'react';
import { handleErrors, safeCredentials, safeCredentialsForm, createFormData } from '@src/utils/fetchHelper';
import Layout from '@src/layout';
import { render } from 'react-dom';

import PaidBookings from '@src/components/paidBookings';
import UnpaidBookings from '@src/components/unpaidBookings';
import MyHostingForm from '@src/components/myHostingForm';

import show_myBookings from '@src/my/show_myBookings.scss'

class Property_bookings extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      authenticated: null,
      username: '',
      user_id: '',

      guestBookings: null,
      editMode: false,
      selectedProperty: null,

      authLoading: true,
      propertyLoading: true,
      bookingsLoading: true,
      deleteLoading: true,
    }

    this.handleEditInfo = this.handleEditInfo.bind(this);
    this.handleUpdatedInfo = this.handleUpdatedInfo.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.deleteProperty = this.deleteProperty.bind(this);
    this.renderCoverPic = this.renderCoverPic.bind(this);
    this.handleDeleteImage = this.handleDeleteImage.bind(this);
  }

  componentDidMount() {
    fetch('/api/authenticated')
    .then(handleErrors)
    .then(data => {
      this.setState({
        authenticated: data.authenticated,
        username: data.username,
        user_id: data.user,
        authLoading: false
      })
    })    
    .catch(error => {
      this.setState({
        authLoading: false
      })
    })

    // get specific property-id bookings
    const urlPropertyID = (window.location.pathname).split('/')[5];
    
    fetch(`/api/hosting/${urlPropertyID}`, safeCredentials({
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }))
    .then(handleErrors)
    .then(data => {
      this.setState({
        guestBookings: data.bookings,
        bookingsLoading: false,
      })
    }) 
    .catch(error => {
      this.setState({
        bookingsLoading: false,
      })
    })

    // get specific property-id information
    fetch(`/api/properties/${urlPropertyID}`, safeCredentials({
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }))
    .then(handleErrors)
    .then(data => {
      this.setState({
        selectedProperty: data.property,
        propertyLoading: false,
      })
    })
    .catch(error => {
      this.setState({
        propertyLoading: false,
      })
    })
  }

  renderPaidBookings() {
    const { guestBookings } = this.state
    const paidBookings = guestBookings.filter(paidbooking => paidbooking.hasOwnProperty("charge") == true);

    return paidBookings.map(paidBooking => {
      return (
        <PaidBookings key={paidBooking.id} paidBooking={paidBooking}/>
      )
    })
  }

  renderUnpaidBookings() {
    const { guestBookings } = this.state

    var unpaidBookings = guestBookings.filter(unpaidBooking => unpaidBooking.hasOwnProperty("charge") == false)

    return unpaidBookings.map(unpaidBooking => {
      return(
        <UnpaidBookings key={unpaidBooking.id} unpaidBooking={unpaidBooking} />
      )
    })
  }
  
  handleEditInfo(property) {
    // need a function to switch the boxes into editable textbox
    this.setState({ 
      editMode: true
    });
  }

  handleCancel() {
    // checked
    this.setState({
      editMode: false
    })
  }

  handleDeleteImage(propertyData, formCB) {
    var formData = createFormData(propertyData)

    // fetch updated information to database
    fetch(`/api/hosting/${propertyData.id}/imageDelete`, safeCredentialsForm({
      method: 'DELETE',
      body: formData
    }))
    .then(handleErrors)
    .then(data => {
      formCB(data);
      this.setState({
        selectedProperty: data.property,
      })
    })
  }

  handleUpdatedInfo(e, propertyData, fileArr) {
    if (e) e.preventDefault()

    var formData = createFormData(propertyData, fileArr)

    // fetch updated information to database
    fetch(`/api/hosting/${propertyData.id}`, safeCredentialsForm({
      method: 'PUT',
      body: formData
    }))
    .then(handleErrors)
    .then(data => {
      console.log(this.state)
     
      window.location.href=`/host/homes/${this.state.username}/user_home`
    })
  }

  deleteProperty() {
    // fetch destroy property -checked
    const { selectedProperty } = this.state
    
    fetch(`/api/hosting/${selectedProperty.id}`, {
      method: "DELETE",
    })
    .then(handleErrors)
    .then(data => {
      this.setState({ 
        selectedProperty: {},
        editMode: false
      })
    })
    location.href=`/host/homes/${selectedProperty.user.username}/user_home`
  }

  renderEdit() {
    const { selectedProperty, editMode } = this.state
    
    return (
      <React.Fragment>
        <MyHostingForm 
          onSubmit={this.handleUpdatedInfo} 
          onCancel={this.handleCancel} 
          onDelete={this.deleteProperty}
          property={selectedProperty} 
          editMode={editMode}
          onDeleteImage={this.handleDeleteImage}
        />
      </React.Fragment>
    )
  }

  renderCoverPic() {
    return this.state.selectedProperty.images[0] ? 
      <div className="property-image mb-3 rounded" id='pBookingsCover' style={{ backgroundImage: `url(${this.state.selectedProperty.images[0].image_url})` }} /> :
      <div className="property-image mb-3 rounded" id='pBookingsCover' style={{ backgroundImage: `url(${this.state.selectedProperty.image_url})` }} /> 
  }

  renderBookings() {
    const { selectedProperty } = this.state
    const urlPropertyID = (window.location.pathname).split('/')[5];
    const paidBookings = this.renderPaidBookings()
    const unpaidBookings = this.renderUnpaidBookings()

    return(
      <React.Fragment>
        {this.renderCoverPic()}
        <div>
          <h2 className="font-weight-bold p-4 ml-5" >All bookings on {`${selectedProperty.title}`}:
          <button className="btn btn-lg btn-danger float-right" onClick={() => { this.handleEditInfo(urlPropertyID) }}>Edit Property Details</button>
          </h2>
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
      </React.Fragment>
    )
  }

  render() {
    const { editMode, bookingsLoading, authLoading, propertyLoading, selectedProperty } = this.state;
  
    if (bookingsLoading || propertyLoading || authLoading) return <div>loading</div>
    if (!selectedProperty) {
      return (
        <Layout authenticated={this.state.authenticated}>
          <div>
            <h4>property not found</h4>
          </div>
        </Layout>
      )
    }
    
    return (
      <Layout authenticated={ this.state.authenticated }>
        <div>
          { editMode ? this.renderEdit() : this.renderBookings() }
        </div>
      </Layout>
    )
  }
}


document.addEventListener('DOMContentLoaded', () => {
  render(
    <Property_bookings/>,
    document.body.appendChild(document.createElement('div')),
  )
})