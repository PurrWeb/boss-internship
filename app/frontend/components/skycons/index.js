import React from 'react';
import Skycons from './skycons';

let skycons;

export default class SkyconsComponent extends React.Component {
  componentDidMount() {
    if (!skycons) {
      skycons = new Skycons();
    }

    skycons.set(this.canvas, this.props.type, this.props.color);

    if (skycons.getItemsCount() > 0 && !skycons.isPlaying()) {
      skycons.play();
    }
  }

  componentDidUpdate() {
    skycons.set(this.canvas, this.props.type, this.props.color);
  }

  componentWillUnmount() {
    skycons.remove(this.canvas);

    if (skycons.getItemsCount() === 0 && skycons.isPlaying()) {
      skycons.pause();
    }
  }

  refCanvas = (canvas) => {
    this.canvas = canvas;
  }

  render() {
    let {
      color,
      type,
      width,
      height,

      ...restPops
    } = this.props

    const dpr = window.devicePixelRatio || 1;

    width = parseFloat(width);
    height = parseFloat(height);

    return <canvas
      {...restPops}
      width={width * dpr}
      height={height * dpr}
      style={{ width: width + 'px', height: height + 'px' }}
      ref={this.refCanvas}
    />;
  }
}