import React from 'react';
import PropTypes from 'prop-types';

const childContextTypes = {
  parent: PropTypes.object,
}

class ValidationComponent extends React.Component {
  getChildContext() {
    return {parent: this.getParent() || null};
  }

  getParent() {
    const parentData = this.props.parent;

    if (!parentData) {
      throw Error('Parent and child models should be present');
    }

    if (parentData.split('.').length > 2) {
      throw Error('Wrong parent model data');
    }

    const [parentModel, parentId] = parentData.split('.');

    if (!parentId) {
      throw Error('Parent model should contain id');
    }
    return {
      parentModel,
      parentId,
    };
  }

  render() {
    return this.props.children;
  }
}

ValidationComponent.childContextTypes = childContextTypes;

export default ValidationComponent;
