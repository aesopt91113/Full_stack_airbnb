import React from 'react';
import { handleErrors, safeCredentialsForm } from '@src/utils/fetchHelper';

import './myHostingForm.scss'

class MyHostingForm extends React.Component {
  constructor(props) {
    super(props)
    
    // this.myRef = React.createRef();

    this.state = {
      property: props.property,
      editMode: props.editMode,
      username: props.username,
      fileArr:  props.property.images && props.property.images.length > 0 ? props.property.images: [{}],
    }
    this.handleChange = this.handleChange.bind(this);
    this.handlePickFile = this.handlePickFile.bind(this);
    this.redirectUser = this.redirectUser.bind(this);
    this.addImage = this.addImage.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
    this.deleteLocalImage = this.deleteLocalImage.bind(this);
    this.updateState = this.updateState.bind(this);
    this.warning = this.warning.bind(this);
  }

  handleChange(e) {
    const currentParams = this.state.property;

    this.setState({
      property: {
        ...currentParams,
        [e.target.name]: e.target.value
      }
    })
  }

  handlePickFile(e, index) {
    const file = e.target.files[0]
    const newFileArr = [...this.state.fileArr]

    newFileArr[index].file = file 
    newFileArr[index].previewUrl = URL.createObjectURL(file)

    this.setState({
      fileArr: newFileArr,
    })
  }

  addImage() {
    const newfileArr = [...this.state.fileArr, {}];

    this.setState({
      fileArr: newfileArr,
    })

  }

  deleteLocalImage(index) {
    // ** so far this only works for host property, not for editing property yet. only works with deleting loca array before sent to api
    var currentFileArr = this.state.fileArr
    var newFileArr = currentFileArr.splice(index, 1)
    
    this.setState({
      fileArr: currentFileArr,
    })
  }

  deleteImage(index) {
    const { editMode, property } = this.state;
    var attachmentIDExist = this.state.fileArr[index].hasOwnProperty('attachment_id')

    if (attachmentIDExist) {
      this.props.onDeleteImage({ id: property.id, attachment_id: this.state.fileArr[index].attachment_id }, this.updateState)      
    } else { 
      this.deleteLocalImage(index) 
    }
  }

  updateState(data) {
    const unsavedImages = this.state.fileArr.filter((file) => !file.attachment_id)
    const responseData = [...data.property.images, ...unsavedImages]

    this.setState({
      property: data.property,
      fileArr: responseData.length > 0 ? unsavedImages : [{}]
    })
  }

  redirectUser(e) {
    const username = this.props.username;

    return location.href=`/host/homes/${username}/user_home`
  }

  warning(fileArr) {
    if (fileArr.length > 1) {
      return <button className="btn btn-outline-secondary" type="button" onClick={this.addImage}>Add</button> 
    } else {
      return ( 
        <div>
          <button className="btn btn-outline-secondary" type="button" data-toggle="modal" data-target="#exampleModalCenter" >Add</button>
          {/* modal below */}
          <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLongTitle" style={{ color: "red" }}>Reminder:</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  Your first picture would be your cover picture
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.addImage}>Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
  }

  render() {
    const { property, editMode, fileArr } = this.state
    const { onSubmit, onCancel, onDelete } = this.props

    return (
      <div className="container">
        <form onSubmit={(e) => { onSubmit(e, property, fileArr) }}>
          <div className="form-group clearfix">
            {
              onDelete && 
              <h3 className="mt-3">
                Edit Property: { property.title }
                <button type="button" className="btn btn-danger float-right" onClick={onDelete}>Delete Property</button>
              </h3>
            }
          </div>
          <div id="form" className="form-group">
            <input type="text" className="form-control mb-2" id="exampleInputEmail1" placeholder="Property title" onChange={ this.handleChange } name="title" defaultValue={property.title}/>

            <input type="text" className="form-control mb-2" id="exampleInputEmail1" placeholder="Description" onChange={ this.handleChange } name="description" defaultValue={property.description}/>

            <input type="text" className="form-control mb-2" id="exampleInputEmail1" placeholder="City" onChange={ this.handleChange } name="city" defaultValue={property.city} />

            <input type="text" className="form-control mb-2" id="exampleInputEmail1" placeholder="Country" onChange={ this.handleChange }  name="country"  defaultValue={property.country}/>

            <div className="d-flex inline-block mb-2">
                <select className="form-control col-6 mr-3" id="inputState" onChange={ this.handleChange } name="property_type" defaultValue={property.property_type}>
                  <option>Apartment</option>
                  <option>Condominium</option>
                  <option>Loft</option>
                  <option>Service Apartment</option>
                </select>

                <select id="inputState" className="form-control" onChange={ this.handleChange } name="max_guests" defaultValue={property.max_guests}>
                  <option>No. of guests</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                  <option>8</option>
                  <option>9</option>
                  <option>10</option>
                  <option>11</option>
                  <option>12</option>
                  <option>13</option>
                </select>
            </div>

            <input type="text" className="form-control mb-2" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Price per night" onChange={ this.handleChange } name="price_per_night" defaultValue={property.price_per_night}/>

            <div className="mb-2">
              <select id="inputState" className="form-control" onChange={ this.handleChange } name="bedrooms" defaultValue={property.bedrooms}>
                <option>No. of bedroom</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
              </select>
            </div>

            <div className="mb-2">
              <select id="inputState" className="form-control" onChange={ this.handleChange } name="beds" defaultValue={property.beds}>
                  <option>No. of beds</option>
                  <option>1</option>
                  <option>2</option>
                  <option>3</option>
                  <option>4</option>
                  <option>5</option>
                  <option>6</option>
                  <option>7</option>
                  <option>8</option>
                  <option>9</option>
                  <option>10</option>
                  <option>11</option>
                  <option>12</option>
                  <option>13</option>
              </select>
            </div>
            
            <div className="mb-2">
              <select id="inputState" className="form-control" onChange={ this.handleChange } name="baths" defaultValue={property.baths}>
                <option>No. of bath</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
              </select>
            </div>

            {/* image upload and handling */}
            { fileArr.map((image, i) => {
              var index = i
              
              return (
                <div className="input-group mb-3" key={`index.${i}`}>
                  <div className="custom-file">
                    <input type="file" className="custom-file-input" id="inputGroupFile02" onChange={(e) => this.handlePickFile(e, i)}/>
                    {
                      (image.file || image.image_url) ? 
                        <label className="custom-file-label downsizeThumbnail" htmlFor="inputGroupFile02" id="fileName" >{ image.file ? image.file.name : image.filename }</label> :
                        <label className="custom-file-label" htmlFor="inputGroupFile02" id="fileName">Choose file</label>
                    }
                  </div>
                  {
                    fileArr.length - 1 == i && (
                      <div className="input-group-append">
                        { this.warning(fileArr)
                          // fileArr.length > 1 ? 
                          // <button className="btn btn-outline-secondary" type="button" onClick={this.addImage}>Add</button> : 
                          // <button className="btn btn-outline-secondary" type="button" data-toggle='modal' data-target='#exampleModalCenter' onClick={this.addImage} >Add</button>
                        }
                      </div>
                    )
                  }
                  {
                    (image.previewUrl || image.image_url) && (
                      <div className="position-relative">
                        <img src={image.previewUrl || image.image_url} className="img-thumbnail" id="thumbnail"/>
                        <label onClick={() => this.deleteImage(index)} className="btn btn-outline-light position-absolute" style={{top: "5px", right: "5px"}} >x</label>
                      </div>
                    )
                  }
                </div>
              )
            }) }
          </div>

          <div className="clearfix">
            {
              onCancel && <button type="button" className="btn btn-info float-left" onClick={onCancel}>Cancel</button>
            }
            {
              editMode 
              ? <button type="submit" className="btn btn-success float-right col-3">Submit</button>
              : <button type="submit" className="btn btn-danger float-right btn-block">Host Your Property Now!</button>
            } 
          </div>
        </form>
      </div>
    )
  }
}

export default MyHostingForm;
