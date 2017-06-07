import * as React from 'react';

import {connect} from 'react-redux';
import { StoreStructure } from '../../../interfaces/store-models';
import {PropsExtendedByConnect} from '../../../interfaces/component';
import { returntypeof } from 'react-redux-typescript';


interface OwnProps {
  readonly onClick: () => void;
  readonly pendingText: string;
}

interface ConnectedState {
  readonly pendingRequest: boolean;
}

interface ConnectedDispatch {
}

interface OwnState {}

class Component extends React.Component<ConnectedState & ConnectedDispatch & OwnProps, OwnState> {
    render() {
        return (
        <button
         onClick={this.props.onClick}
         disabled={this.props.pendingRequest}
         className="boss-button boss-button_role_submit boss-buttons-group_adjust_button">
            { this.props.pendingRequest ? this.props.pendingText : this.props.children }
        </button>
        );
    }
}

const mapStateToProps = (state: StoreStructure, ownProps?: OwnProps): ConnectedState => ({
    pendingRequest: state.app.pendingRequest
});

export const ProgressButton: React.ComponentClass<OwnProps> = connect(mapStateToProps)(Component);
