// show_hostHomes.jsx
import React from 'react';
import { render } from 'react-dom';
import Layout from '@src/layout';
import { handleErrors } from '@src/utils/fetchHelper';
import MyProperties from '@src/components/myProperties';

class Show_hostHomes extends React.Component {
  constructor(props) {
    super(props) 
    
    this.state = {
      username: '',
      user_id: '',
      authenticated: null,
    }
  }

  componentDidMount() {
    fetch('/api/authenticated')
    .then(handleErrors)
    .then(data => {
      this.setState({
        authenticated: data.authenticated,
        username: data.username,
        user_id: data.user,
      })
    })
  }
  
  render() {
    const { properties, authenticated, username } = this.state;

    return(
      <Layout authenticated={authenticated} username={username}>
        <MyProperties properties={properties}/>
      </Layout>
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  render(
    <Show_hostHomes/>,
    document.body.appendChild(document.createElement('div')),
  )
})
