// hostHomes.jsx
import React from 'react';
import { render } from 'react-dom'
import Layout from '@src/layout';
import { handleErrors, safeCredentials, createFormData, safeCredentialsForm } from '@src/utils/fetchHelper';

import MyHostingForm from '@src/components/myHostingForm';

class HostHomes extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      property: {
        title: '',
        description: '',
        city: '',
        country: '',
        property_type: '',
        price_per_night: null,
        max_guests: null,
        bedrooms: null,
        beds: null,
        baths: null,
        images: [{}],
      },
      authenticated: null,
      username: '',
    }

    this.hostNewProperty = this.hostNewProperty.bind(this);
  }

  componentDidMount() {
    fetch('/api/authenticated')
      .then(handleErrors)
      .then(data => {
        this.setState({
          authenticated: data.authenticated,
          username: data.username
        })
      })
  }

  hostNewProperty(e, propertyData, fileArr) {
    if (e) { e.preventDefault(); }
    
    var formData = createFormData(propertyData, fileArr);

    fetch('/api/hosting', safeCredentialsForm({
      method: 'POST',
      body: formData,
    }))
    .then(handleErrors)
    .then(() => {
      window.location.href=`/host/homes/${this.state.username}/user_home`
    })

  }
  
  render() {
    const { username, authenticated, property } = this.state;

    return(
      <Layout authenticated={ authenticated } username={username}>
        <div>
          <div className="container">
            <div className="card col-5 float-left border-0 mt-4">
              <h1 className="font-weight-bold mb-3">Earn money as an Airbnb host</h1>
              <p className="font-weight-bold">Tell us a little about your place</p>

              <MyHostingForm onSubmit={this.hostNewProperty} property={property} username={username}/>
            </div>

            <div className="card col-5 float-left border-0 pt-5 pl-5">
              <h4 className="mb-3 ">Why host on airbnb?</h4>
              <p className="pb-4">No matter what kind of home or room you have to share, Airbnb makes it simple and secure to host travelers. You’re in full control of your availability, prices, house rules, and how you interact with guests.</p>
              <h4 className="mb-3">We have your back</h4>
              <p>To keep you, your home, and your belongings safe, we cover every booking with $1M USD in property damage protection and another $1M USD in insurance against accidents.</p>
            </div>
            
          </div>
        </div>
        <div className="container col-12 d-flex justify-content-center mt-3 mb-3">
          <div className="card col-4 border-0 mr-2">
          </div>
        </div>
      </Layout>
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  render(
    <HostHomes/>,
    document.body.appendChild(document.createElement('div')),
  )
})