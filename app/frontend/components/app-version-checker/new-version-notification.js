import React from 'react';
import ModalWrapper from './modal-wrapper.styled';
import Button from './button.styled';
import CountDown from './countdown';

export default class NewVersionNotification extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  reloadPage = () => {
    window.location.reload(true);
  }

  render() {
    return (
      <ModalWrapper>
        <p>You app version is out of date, your app will be refreshed automatically in:</p>
        <p>5 minutes</p>
        <p>Or you can refresh app manually, by pressing Refresh button below.</p>
        <CountDown countdown={this.props.countdown}/>
        <Button onClick={this.reloadPage}>Refresh</Button>
      </ModalWrapper>
    )
  }
}