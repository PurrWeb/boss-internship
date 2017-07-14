import React, { Component } from 'react';
import HeaderDropdownList from './header-dropdown-list';
import cn from 'classnames';
import utils from '~lib/utils'
import iScroll from 'iscroll';
import ReactIScroll from 'react-iscroll';

const objects = window.boss.quickMenu;

export default class HeaderDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quickMenu: objects,
    };
    this.scrollOptions = {
      crollbars: true,
      mouseWheel: true,
      interactiveScrollbars: true,
      shrinkScrollbars: 'scale',
      fadeScrollbars: false,
      click: true,
      scrollbars: true,
    }
  }

  componentWillMount() {
    document.body.addEventListener('keydown', this.props.handleEscPress);
    document.body.addEventListener('keypress', this.keyPress);
    document.body.addEventListener('keydown', this.keyPress);
    
  }

  componentWillUnmount() {
    document.body.removeEventListener('keydown', this.props.handleEscPress);
    document.body.removeEventListener('keypress', this.keyPress);
    document.body.removeEventListener('keydown', this.keyPress);
    
  }

  onInuputChange = (e) => {
    this.setState({
      quickMenu: utils.quickMenuFilter(e.target.value, objects),
    })
  }

  keyPress = () => {
    document.getElementById('onFocusInput').focus();
  }

  render() {
    const dropDownCn = cn('boss-page-header__dropdown boss-page-header__dropdown_role_search', {'boss-page-header__dropdown_state_opened': this.props.isOpen});

    return <div className="boss-page-header__dropdowns">
      <div className={dropDownCn}>
        <div className="boss-page-header__dropdown-header">
            <p className="boss-page-header__dropdown-label boss-page-header__dropdown-label_role_search">Search</p>
            <div className="boss-page-header__dropdown-filter">
              <form className="boss-form">
                <div className="boss-form__field boss-form__field_position_last">
                  <label className="boss-form__label">
                    <input type="text" id="onFocusInput" onChange={this.onInuputChange} className="boss-form__input boss-form__input_type_narrow" />
                  </label>
                </div>
              </form>
            </div>
            <a href="#" onClick={this.props.closeDropdown} className="boss-page-header__dropdown-label boss-page-header__dropdown-label_role_action boss-page-header__dropdown-label_role_close boss-page-header__dropdown-label_type_icon">Close</a>
        </div>
        <div className="boss-page-header__dropdown-scroll">
          <ReactIScroll iScroll={iScroll} options={this.scrollOptions}>
            <div className="boss-page-header__dropdown-content">
              <HeaderDropdownList items={this.state.quickMenu} />
            </div>
          </ReactIScroll>
        </div>
      </div>
    </div>
  };
};
