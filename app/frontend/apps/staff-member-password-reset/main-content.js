import React from 'react';

export default class MainContent extends React.Component {
  render() {
    return (
      <main className="boss-page-main">
        <div className="boss-page-main__content">
          <div className="boss-page-main__inner">
            {this.props.children}
          </div>
        </div>
      </main>
    )
  }
}
