import React from 'react';
import axios from 'axios';
import AsyncButton from 'react-async-button';
import Highlight from 'react-highlight';

export default class LoggedInPage extends React.Component {
  componentWillMount() {
    require('highlight.js/styles/vs.css');
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          <div className="row">
            <div className="col-md-12">
              <div className="form-group float-right">
                <AsyncButton
                  className="btn btn-primary"
                  text="Log Out"
                  pendingText="Loging Out ..."
                  onClick={this.props.onLogOutSuccess}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 offset-md-4">
              <Highlight className='json'>
                {JSON.stringify(this.props.jsonResponse, null, 2)}
              </Highlight>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
