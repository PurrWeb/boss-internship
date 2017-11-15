import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setInitialData } from '../actions/initial-load'
import { setFrontendState, setSelectedMessage } from '../actions/states';
import { getDashboardMessagesRequest, disableDasboardMessageRequest, restoreDasboardMessageRequest } from '../actions/requests';

import PageHeader from '../components/page-header'
import PageBody from '../components/page-body'

function mapStateToProps(state) {
  return {
    frontend: state.messageBoard.get('frontend'),
    venues: state.messageBoard.get('venues'),
    currentVenue: state.messageBoard.get('currentVenue'),
    messages: state.messageBoard.get('messages'),
    selectedMessage: state.messageBoard.get('selectedMessage')
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    setInitialData,
    setFrontendState,
    setSelectedMessage,
    getDashboardMessagesRequest,
    disableDasboardMessageRequest,
    restoreDasboardMessageRequest
  }, dispatch);
}

export class MessageBoardContainer extends React.Component {
  componentWillMount() {
    this.props.setInitialData(window.boss.messageBoard);
  }

  render() {
    return (
      <main className="boss-page-main">
        <PageHeader { ...this.props } />

        <PageBody { ...this.props } />
      </main>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageBoardContainer);
