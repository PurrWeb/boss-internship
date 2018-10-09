import React from 'react';
import { Provider } from 'react-redux';
import { reducer as formReducer } from 'redux-form/immutable';
import { combineReducers } from 'redux-immutable';

import Disciplinary from './containers/disciplinary';
import configureStore from '../store';
import { initialProfileLoad } from '../profile-wrapper/actions';
import profileReducer from '../profile-wrapper/reducers';
import disciplinariesReducer from './redux/reducers/disciplinaries-reducer';
import filterReducer from './redux/reducers/filter-reducer';
import permissionsReducer from './redux/reducers/permissions-reducer';

class StaffMemberDisiplinaryApp extends React.Component {
  componentWillMount() {
    require('./styles.css');
    this.store = configureStore(
      combineReducers({
        profile: profileReducer,
        disciplinaries: disciplinariesReducer,
        filter: filterReducer,
        permissions: permissionsReducer,
        form: formReducer,
      }),
    );
    this.store.dispatch(initialProfileLoad({ ...this.props }));
  }

  render() {
    return (
      <Provider store={this.store}>
        <Disciplinary />
      </Provider>
    );
  }
}

export default StaffMemberDisiplinaryApp;
