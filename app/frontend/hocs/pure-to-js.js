import React from 'react';
import { Iterable } from 'immutable';

export default function pureToJS(WrappedComponent) {
  return class extends React.PureComponent {
    render() {
      const KEY = 0;
      const VALUE = 1;

      const propsJS = Object.entries(this.props).reduce((acc, wrappedComponentProp) => {
        acc[wrappedComponentProp[KEY]] = Iterable.isIterable(wrappedComponentProp[VALUE])
          ? wrappedComponentProp[VALUE].toJS()
          : wrappedComponentProp[VALUE];
        return acc;
      }, {});
      return <WrappedComponent {...propsJS} />;
    }
  };
}
