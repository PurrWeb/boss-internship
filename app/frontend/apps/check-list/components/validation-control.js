import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import _ from 'lodash';

const mapStateToProps = (state, ownProps) => {
  return {
    errors: state.getIn(['checklists', 'errors']),
  };
}

@connect(mapStateToProps)
class ValidationControl extends React.Component {
  static contextTypes = {
    parent: PropTypes.object
  }

  constructor(props) {
    super(props);
  }

  componentWillReceiveProps(nextProps) {
    this.error = null;
    const allErrors = nextProps.errors;
    if (!allErrors) return;
    const { parentModel, parentId } = this.context.parent;
    if (!parentModel) {
      throw Error('ValidationController as parent should be present');
    }

    const parent = allErrors.getIn([`${parentModel}.${parentId}`]);
    if (!parent) return;
    const childData = nextProps.model;
    if (!childData) {
      throw Error('Child model should be present');
    }
    const [childModel, childIndex] = childData.split('.');
    const child = parent.get(`${childModel}`);
    if (!child) return;
    let componentErrors;
    if (childIndex) {
      if (isNaN(parseInt(childIndex))) {
        throw Error('Child index should be a number')
      }
      componentErrors = child.find(item => item.get('index') === parseInt(childIndex));
    } else {
      componentErrors = child;
    }

    if (componentErrors) {
      componentErrors = componentErrors.toJS();
      if (_.isArray(componentErrors)) {
        this.error = componentErrors.join(', ');
      } else {
        this.error = componentErrors.message;
      }
    }
  }

  render() {
    const Component = this.props.component;
    return <Component {...this.props.mappedProps} error={this.error} valid={!this.error}/>
  }
}

export default ValidationControl;
