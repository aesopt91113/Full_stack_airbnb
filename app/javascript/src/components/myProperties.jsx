import React from 'react';
import { handleErrors, safeCredentials } from '@src/utils/fetchHelper';

import './myProperties.scss';

class MyProperties extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      filter: '',
      properties: null,
    }
  }

  componentDidMount() {
    // this links myproperties images
    fetch(`/api/hosting`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
    .then(handleErrors)
    .then(data => {        
      this.setState({
        properties: data.properties,
      })
    }) 
  }

  render() {
    const { properties, filter } = this.state;

    const filterReg = new RegExp(filter, 'i');
    const urlUsername = (window.location.pathname).split('/')[3];

    if (!properties) return <div>loading</div>

    return (
      <div className="container">
        <h3 className="pt-3 pb-2">Your Airbnb properties: </h3>

        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroupPrepend">Filter</span>
          </div>
          <input type="text" className="form-control" onChange={(e) => { this.setState({ filter: e.target.value }) }} />
        </div>

        <div className="row">
          {
            properties.map(property => {
              if (!filterReg.test(property.title)) return null
              
              return (
                <a href={`/host/homes/${urlUsername}/user_home/${property.id}/bookings`} key={property.id} className="col-6 col-lg-4 mb-4 property">
                  <div className="text-body text-decoration-none">
                    {/* the following lines is for image */}
                    { 
                      property.images[0] ? 
                          <div className="property-image mb-1 rounded" style={{ backgroundImage: `url(${property.images[0].image_url})` }} />  : 
                          <h4>No picture</h4>
                    }
                    <p className="text-uppercase mb-0 text-secondary"><small><b>{property.city}</b></small></p>
                    <h6 className="mb-0">{property.title}</h6>
                    <p className="mb-0"><small>${property.price_per_night} USD/night</small></p>
                  </div>
                </a>
              )
            })
          }
        </div>
      </div>
    )
  }
}

export default MyProperties;