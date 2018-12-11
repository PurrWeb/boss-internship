import React, { Component } from 'react';
import cn from 'classnames';
import oFetch from 'o-fetch';

export default class TabFilter extends Component {
  renderTabs = () => {
    const [selectedValue, onTabClick, tabs] = oFetch(this.props, 'selectedValue', 'onTabClick', 'tabs');

    return Object.keys(tabs).map((tabKey, index) => {
      const tabClassName = cn('boss-page-main__control', {
        'boss-page-main__control_state_active': selectedValue === tabKey,
      });
      return (
        <a key={index} onClick={() => onTabClick(tabKey)} href="javascript:;" className={tabClassName}>
          {tabs[tabKey]}
        </a>
      );
    });
  };

  render() {
    return <div className="boss-page-main__controls">{this.renderTabs()}</div>;
  }
}
