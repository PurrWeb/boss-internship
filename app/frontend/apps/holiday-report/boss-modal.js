import React from 'react';
import { Provider } from "react-redux"
import configureStore from '~/apps/store';

import ContentModal from '~/components/content-modal';

export default function openModal(submit, props) {
  return function(Component) {
    const bodyFirst = document.body.firstChild;
    const wrapper = document.createElement('div');
    bodyFirst.parentNode.insertBefore(wrapper, bodyFirst);

    const handleClose = (...args) => {
      return new Promise((resolve, reject) => {
        resolve(submit(hideModal, ...args));
      });
    }
    
    const getParent = () => {
      return wrapper;
    }

    const hideModal = () => {
      setTimeout(() => {
        ReactDOM.unmountComponentAtNode(wrapper);
        wrapper.remove();
      }, 50)
    }

    ReactDOM.render(
      <ContentModal
        show={true}
        title="Add Holiday"
        onClose={hideModal}
      >
        <Component onSubmit={handleClose} {...props} />
      </ContentModal>,
      wrapper
    );
  }
}

export function modalRedux(reducers) {
  const store = configureStore(reducers);
  return function(Component) {
    return class extends React.Component {
      render() {
        return (
          <Provider store={store}>
            <Component {...this.props}/>
          </Provider>
        )
      }
    }
  }
}
