import ReactDOM from 'react-dom';

export default function modalDecorator(openModalFn) {
  return function({ submit = () => {}, config = {}, props, closeCallback = () => {} }) {
    let bodyFirst, wrapper;
    const handleClose = () => {
      setTimeout(() => {
        ReactDOM.unmountComponentAtNode(wrapper);
        wrapper.remove();
      }, 50);
    };

    bodyFirst = document.body.firstChild;
    wrapper = document.createElement('div');
    bodyFirst.parentNode.insertBefore(wrapper, bodyFirst);

    const handleSubmit = (...args) => {
      return Promise.resolve(submit(handleClose, ...args));
    };
    return openModalFn(config, props, handleSubmit, handleClose, wrapper, closeCallback);
  };
}
