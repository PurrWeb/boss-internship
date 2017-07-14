import React, { Component } from "react";
import ReactDOM from 'react-dom';
import HeaderDropdown from './components/header-dropdown';

const userName = window.boss.rollbarData.currentUser.name

export default class Header extends Component {

  constructor(props) {
    super(props);

    this.quickMenu = JSON.parse(props.quickMenu);
    this.state = {
      isDropdownOpen: false,
      isUserDropdownOpen: false,
    };    
  };

  componentWillMount() {
    document.body.addEventListener('click', this.handleDropdownsClose);
  };

  handleDropdownsClose = (e) => {
    let domNode = ReactDOM.findDOMNode(this);

    if (!domNode || !domNode.contains(e.target)) {
      this.closeAllDropdowns()
    }
  };

  handleEscPress = (e) => {
    if (e.keyCode === 27) {
      this.closeAllDropdowns();
    };
  }

  closeAllDropdowns = () => {
    this.setState({isDropdownOpen: false, isUserDropdownOpen: false});
  }

  handleToggleDropdown = () => {
    this.closeAllDropdowns();
    this.setState({isDropdownOpen: !this.state.isDropdownOpen});
  };

  handleToggleUserDropdown = () => {
    this.closeAllDropdowns();
    this.setState({isUserDropdownOpen: !this.state.isUserDropdownOpen})
  };

  render() {
    return <header className="boss-page-header">
      <div className="boss-page-header__inner">
        <a className="boss-page-header__logo">Boss</a>
        <a href="javascript:;" className="boss-page-header__action boss-page-header__action_role_search" onClick={this.handleToggleDropdown} >Search</a>
        <a href="#" className="boss-page-header__action boss-page-header__action_role_profile" onClick={this.handleToggleUserDropdown}>Profile</a>
        { this.state.isUserDropdownOpen && 
          <div className="boss-page-header__dropdown boss-page-header__dropdown_role_profile boss-page-header__dropdown_state_opened">
            <nav className="boss-menu">
              <p href="::javascript" className="boss-menu__label boss-menu__label_role_user">{userName}</p>
              <a href="/auth/sign_out" data-method="delete" className="boss-menu__link boss-menu__link_role_logout">Logout</a>
            </nav>
          </div>
        }
        <HeaderDropdown
          quickMenu={ this.quickMenu }
          isOpen={this.state.isDropdownOpen}
          handleEscPress={this.handleEscPress}
          closeDropdown={this.closeAllDropdowns}
        />
      </div>
    </header>
  }
};
