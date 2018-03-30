import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ProfileWrapper from '../../profile-wrapper';
import oFetch from 'o-fetch';

const mapStateToProps = (state) => {
  return {};
}

const mapDispatchToProps = (dispatch) => {
  return {
    actions: []
  };
}

@connect(mapStateToProps, mapDispatchToProps)
export class PaymentsPageUI extends React.Component {
  constructor(props){
    super(props);
  }

  render() {
    return <ProfileWrapper currentPage="payments">
      <section className="boss-board">
        <div>Works</div>
      </section>
    </ProfileWrapper>;
  }
}
