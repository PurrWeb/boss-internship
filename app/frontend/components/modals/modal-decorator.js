import ReactDOM from 'react-dom';

export default function modalDecorator(openModalFn) {
  return function({ submit = () => {}, config = {}, props, closeCallback = () => {} }) {
    let bodyFirst, wrapper;

    const handleClose = () => {
      destroyModal();
      return closeCallback();
    };

    const destroyModal = () => {
      setTimeout(() => {
        ReactDOM.unmountComponentAtNode(wrapper);
        wrapper.remove();
      }, 50);
    };

    const handleCloseAfterSubmit = () => {
      destroyModal();
    };

    bodyFirst = document.body.firstChild;
    wrapper = document.createElement('div');
    bodyFirst.parentNode.insertBefore(wrapper, bodyFirst);

    const handleSubmit = (...args) => {
      return Promise.resolve(submit(handleCloseAfterSubmit, ...args));
    };

    return openModalFn(config, props, handleSubmit, handleClose, wrapper);
  };
}
