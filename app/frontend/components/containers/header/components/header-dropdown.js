import React, { Component } from 'react';
import HeaderDropdownList from './header-dropdown-list';
import cn from 'classnames';
import utils from '~lib/utils'

const objects = window.boss.quickMenu;

export default class HeaderDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quickMenu: objects.slice(0),
    };
  }

  componentWillMount() {
    document.body.addEventListener('keydown', this.props.handleEscPress);
  }

  componentWillUnmount() {
    document.body.removeEventListener('keydown', this.props.handleEscPress);
  }

  onInuputChange = (e) => {
    // this.setState({
    //   quickMenu: !e.target.value ? objects.slice(0) : utils.quickMenuFilter(e.target.value, objects),
    // })
    console.log(utils.quickMenuFilter(e.target.value, objects));
  }

  render() {
    const dropDownCn = cn('boss-page-header__dropdown boss-page-header__dropdown_role_search', {'boss-page-header__dropdown_state_opened': this.props.isOpen});

    return <div className="boss-page-header__dropdowns">
      <div className={dropDownCn}>
        <div className="boss-page-header__dropdown-header">
            <p className="boss-page-header__dropdown-label boss-page-header__dropdown-label_role_search">Search</p>
            <div className="boss-page-header__dropdown-filter">
              <input type="text" onChange={this.onInuputChange} />
            </div>
            <a href="#" className="boss-page-header__dropdown-label boss-page-header__dropdown-label_role_action boss-page-header__dropdown-label_role_close boss-page-header__dropdown-label_type_icon">Close</a>
        </div>
        <div className="boss-page-header__dropdown-scroll">
          <div className="boss-page-header__dropdown-content">
            <HeaderDropdownList items={this.state.quickMenu} />
          </div>
        </div>
      </div>
    </div>
  };
};