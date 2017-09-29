import React from "react"
import AsyncButton from 'react-async-button';
import './style.sass';
export default class DashboardFilter extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
    }
  }

  handleToggleFilter = () => {
    this.setState(state => ({isOpen: !state.isOpen}));
  }

  render() {
    const countInRow = 3;

    return (
      <div className="boss-page-dashboard__filter">
        <div className={`boss-dropdown ${this.state.isOpen && 'boss-dropdown__content_state_opened'}`}>
          <div className="boss-dropdown__header">
            <div className="boss-dropdown__header-group">

            </div>
            <button
              onClick={this.handleToggleFilter}
              className={`boss-dropdown__switch boss-dropdown__switch_role_filter ${this.state.isOpen && 'boss-dropdown__switch_state_opened'}`}
            >Filter
            </button>
          </div>
          <div className="boss-dropdown__content" style={{display: 'block'}}>
            { this.state.isOpen && <div className="boss-dropdown__content-inner">
              <div className="boss-form">
                <div className="boss-form__row">
                  {
                    React.Children.map(this.props.children, (child, index) => {
                      if ((index + 1) % countInRow === 0) {
                        return React.cloneElement(child, {
                          className: "boss-form__field boss-form__field_layout_third boss-form__field_position_last"
                        })
                      } else {
                        return React.cloneElement(child, {
                          className: "boss-form__field boss-form__field_layout_third"
                        })
                      }
                    })
                  }
                </div>
                <div className="boss-form__field">
                  <AsyncButton
                    className="boss-button boss-form__submit boss-form__submit_adjust_single"
                    text="Update"
                    loadingClass="is-loading"
                    fulFilledClass="btn-primary"
                    rejectedClass="btn-danger"
                    onClick={this.props.onFilterUpdate}
                  >
                    {
                      ({ buttonText, isPending }) => (
                        <span>
                          { isPending && <Spinner />}
                          <span>{buttonText}</span>
                        </span>
                      )
                    }
                  </AsyncButton>
                </div>
              </div>
            </div>}
          </div>
        </div>
      </div>
    )
  }
}
