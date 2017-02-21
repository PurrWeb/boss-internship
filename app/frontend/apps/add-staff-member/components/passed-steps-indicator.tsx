/// <reference path="../../../custom-typings/react-redux-form.d.ts" />

import * as React from 'react';
import {connect} from 'react-redux';

import {PropsExtendedByConnect} from '../../../interfaces/component';
import {StoreStructure} from '../../../interfaces/store-models';

interface Props {
}

interface MappedProps {
  readonly completedSteps: number;
}

type PropsFromConnect = PropsExtendedByConnect<Props, MappedProps>;

interface State {
  readonly isMounted: boolean;
}

interface StepData {
  readonly title: string;
}

const stepsData: StepData[] = [
  {
    title: 'Basic Information'
  },
  {
    title: 'Upload Photo'
  },
  {
    title: 'Venue'
  },
  {
    title: 'Address'
  },
  {
    title: 'Work'
  },
  {
    title: 'Preview'
  }
];

class Component extends React.Component<PropsFromConnect, State> {
  drawSteps() {
    return stepsData.map((stepData, idx) => {
      const activeClassName = this.props.completedSteps === idx ? 'boss3-steps-block__step_state_active' : '';

      return (
        <li key={idx} className={`boss3-steps-block__step ${activeClassName}`}>
          <div className="boss3-steps-block__step-index">{idx + 1}</div>
          <div className="boss3-steps-block__step-title">{stepData.title}</div>
        </li>
      );
    });
  }

  render() {
    return (
      <ul className="boss3-steps-block">
        {this.drawSteps()}
      </ul>
    );
  }
}

const mapStateToProps = (state: StoreStructure, ownProps?: {}): MappedProps => {
  return {
    completedSteps: state.app.completedSteps
  };
};

export default connect(
  mapStateToProps
)(Component);
