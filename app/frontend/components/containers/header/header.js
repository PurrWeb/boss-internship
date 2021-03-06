import React, { Component } from "react";
import ReactDOM from 'react-dom';
import HeaderDropdown from './components/header-dropdown';
import iScroll from 'boss-iscroll';
import ReactIScroll from 'react-iscroll';
import utils from '~/lib/utils';
import URLSearchParams from 'url-search-params';

export const EmptyHeader = () => {
  return (
    <header className="boss-page-header">
      <div className="boss-page-header__inner">
        <a className="boss-page-header__logo">Boss</a>
      </div>
    </header>    
  )
}

export default class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isDropdownOpen: false,
      isUserDropdownOpen: false,
      isGlobalVenueOpen: false,
    };

    this.queryString = new URLSearchParams(window.location.search);
    this.globalVenueId = this.queryString.get('venue_id');
    this.dropdownKeys = ["isDropdownOpen", "isUserDropdownOpen", "isGlobalVenueOpen"];

    this.scrollOptions = {
      mouseWheel: true,
      interactiveScrollbars: true,
      shrinkScrollbars: 'scale',
      fadeScrollbars: false,
      click: true,
      scrollbars: true,
      enable_ofscroll: true,
    };
  };

  componentWillMount() {
    document.body.addEventListener('click', this.handleDropdownsClose);
  };

  handleDropdownsClose = (e) => {
    let domNode = ReactDOM.findDOMNode(this);

    let searchButtonNode = ReactDOM.findDOMNode(this.headerSearchButton);
    if (searchButtonNode === e.target) {
      return;
    }
    let globalVenueDivNode = ReactDOM.findDOMNode(this.headerGlobalVenueDiv);
    if (globalVenueDivNode === e.target || (globalVenueDivNode && globalVenueDivNode.contains(e.target))) {
      return;
    }
    let userMenuButtonNode = ReactDOM.findDOMNode(this.headerUserMenuButton);
    if (userMenuButtonNode === e.target) {
      return;
    }

    let quickMenuDropdownNode = ReactDOM.findDOMNode(this.headerDropdown);
    let globalVenueDropdownNode = ReactDOM.findDOMNode(this.globalVenueDropdown);
    let userMenuDropdownNode = ReactDOM.findDOMNode(this.userMenuDropdown);

    let clickedOnDropDowns = (
      quickMenuDropdownNode && quickMenuDropdownNode.contains(e.target)
    ) || (
      globalVenueDropdownNode && globalVenueDropdownNode.contains(e.target)
    ) || (
      userMenuDropdownNode && userMenuDropdownNode.contains(e.target)
    )
    if (!clickedOnDropDowns) {
      this.closeAllDropdowns();
    }
  };

  handleEscPress = (e) => {
    if (e.keyCode === 27) {
      this.closeAllDropdowns();
    };
  }

  closeDropdowns = (dropdownsToClose) => {
    //assert dropdowns valid
    dropdownsToClose.forEach(item => {
      if(this.dropdownKeys.indexOf(item) === -1){
        throw new Error("Invalid dropdown key " + item + " supplied");
      }
    });

    this.setState(previousState => {
      let newState = Object.assign({}, previousState);
      dropdownsToClose.forEach(key => {
        newState[key] = false
      });
      return newState
    })
  }

  closeAllDropdowns = () => {
    this.setState({isDropdownOpen: false, isUserDropdownOpen: false, isGlobalVenueOpen: false});
  }

  handleToggleDropdown = () => {
    this.closeDropdowns(['isUserDropdownOpen', 'isGlobalVenueOpen']);
    this.setState({isDropdownOpen: !this.state.isDropdownOpen});
  };

  handleToggleUserDropdown = () => {
    this.closeDropdowns(['isDropdownOpen', 'isGlobalVenueOpen'])
    this.setState(previousState => {
      return {isUserDropdownOpen: !previousState.isUserDropdownOpen}
    })
  };

  toggleGlobalVenue = () => {
    this.closeDropdowns(['isDropdownOpen', 'isUserDropdownOpen']);
    this.setState(previousState => {
      return {isGlobalVenueOpen: !previousState.isGlobalVenueOpen}
    });
  }

  getCurrentVenueName(venues, currentVenueId) {
    const currentVenue = venues.find(venue => {
      return venue.id === parseInt(currentVenueId);
    });

    if (currentVenue) {
      return currentVenue.name;
    } else {
      throw Error('Undefined venue id');
    }
  }

  renderVenues(venues) {
    return venues.map((venue, index) => {
      let venueLink = new URLSearchParams(window.location.search);
      venueLink.set('venue_id', venue.id);
      return (
        <a href={`${window.location.href.split('?')[0]}?${venueLink.toString()}`} key={index} className="boss-menu__link">{venue.name}</a>
      );
    })
  }

  currentVenueControl(currentVenueId, venues) {
    if(!this.globalVenueId || !this.props.showGlobalVenue){
      return null;
    }

    let allowVenueSelection = venues.length > 1;

    let changeVenueButton = null;
    if(allowVenueSelection) {
      changeVenueButton = <button
        className="boss-page-header__control-arrow"
      />
    }

    let divOnClick = false;
    if(allowVenueSelection) {
      divOnClick = this.toggleGlobalVenue;
    }

    return <div
      ref={(headerGlobalVenueDiv) => {this.headerGlobalVenueDiv = headerGlobalVenueDiv}}
      className="boss-page-header__control boss-page-header__control_role_site-select"
      onClick={divOnClick}>
      <p className="boss-page-header__control-value">
        {this.getCurrentVenueName(this.props.venues, this.globalVenueId)}
      </p>
     {changeVenueButton}
    </div>;
  }

  render() {
    return <header className="boss-page-header">
      <div className="boss-page-header__inner">
        <div className="boss-page-header__group boss-page-header__group_role_logo">
          <a href="/" className="boss-page-header__logo">Boss</a>
        </div>
        <button
          className="boss-page-header__action boss-page-header__action_role_search"
          onClick={this.handleToggleDropdown}
          ref={(headerSearchButton) => this.headerSearchButton = headerSearchButton}
        >
          Search
        </button>

        { this.currentVenueControl(this.globalVenueId, this.props.venues) }

        <button
          ref={(headerUserMenuButton) => { this.headerUserMenuButton = headerUserMenuButton }}
          className="boss-page-header__action boss-page-header__action_role_profile"
          onClick={this.handleToggleUserDropdown}
        >Profile</button>
        { this.state.isUserDropdownOpen &&
          <div
            className="boss-page-header__dropdown boss-page-header__dropdown_role_profile boss-page-header__dropdown_state_opened"
            ref={(userMenuDropdown) => this.userMenuDropdown = userMenuDropdown }
            >
            <nav className="boss-menu">
              <p className="boss-menu__label boss-menu__label_role_user">{this.props.user.name}</p>
              <a href="/auth/sign_out" data-method="delete" className="boss-menu__link boss-menu__link_role_logout">Logout</a>
            </nav>
          </div>
        }
        <div className="boss-page-header__dropdowns">
          { this.state.isDropdownOpen && <HeaderDropdown
            ref={(headerDropdown) => this.headerDropdown = headerDropdown}
            quickMenu={ this.props.quickMenu }
            handleEscPress={this.handleEscPress}
            closeDropdown={this.closeAllDropdowns}
          /> }
          { this.state.isGlobalVenueOpen && <div
            className={`boss-page-header__dropdown boss-page-header__dropdown_role_site-select boss-page-header__dropdown_state_opened`}
            ref={(globalVenueDropdown) => this.globalVenueDropdown = globalVenueDropdown}
            >
            <div className="boss-page-header__dropdown-scroll">
              <ReactIScroll iScroll={iScroll} options={this.scrollOptions}>
                <div className="boss-page-header__dropdown-content">
                  <div className="boss-menu">
                    { this.renderVenues(this.props.venues) }
                  </div>
                </div>
              </ReactIScroll>
            </div>
          </div> }
        </div>
      </div>
    </header>
  }
};
