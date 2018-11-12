import * as React from 'react';
import Select from 'react-select';

interface Props {
  readonly name?: string;
  readonly className?: string;
  readonly value?: Select.Option;
  readonly options?: Select.Option[];
  readonly onChange?: (newValue: Select.Option | Select.Option[]) => void;
}

interface State {
  readonly value?: Select.Option;
}

class Component extends React.Component<Props, State> {
  state: State = {
  };

  static getDefaultValue(): Select.Option {
    return {
      label: '',
      value: ''
    };
  }

  handleChange = (value: Select.Option) => {
    const fixedValue: Select.Option = value || {
        label: '',
        value: ''
      };

    this.setState({
      value: fixedValue
    });

    this.props.onChange && this.props.onChange(fixedValue);
  };

  render() {
    const value = this.state.value || this.props.value || Component.getDefaultValue();

    return (
      <Select {...this.props}
        value={value}
        onChange={this.handleChange}
      />
    );
  }
}

export default Component;
