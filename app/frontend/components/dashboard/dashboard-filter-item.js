import React from "react"

export default class DashboardFilterItem extends React.Component {
  render() {
    return (
      <div className={this.props.className}>
        <p className="boss-form__label">
          <span className="boss-form__label-text">{this.props.label}</span>
        </p>
        {this.props.children}
      </div>
    )
  }
}
