import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import oFetch from 'o-fetch';
import cn from 'classnames';

export default class Tabs extends Component {
  render() {
    const [
      softDodgersCount,
      hardDodgersCount,
      offendersCount,
      markNeededOffendersCount,
      onTabClick,
      selectedTab,
    ] = oFetch(
      this.props,
      'softDodgersCount',
      'hardDodgersCount',
      'offendersCount',
      'markNeededOffendersCount',
      'onTabClick',
      'selectedTab',
    );

    return (
      <div className="boss-page-main__controls">
        <button
          type="button"
          onClick={() => onTabClick('soft')}
          className={cn('boss-page-main__control', {
            'boss-page-main__control_state_active': selectedTab === 'soft',
          })}
        >
          Soft Dodgers - 45-47h or more ({softDodgersCount})
        </button>
        <button
          type="button"
          onClick={() => onTabClick('hard')}
          className={cn('boss-page-main__control', {
            'boss-page-main__control_state_active': selectedTab === 'hard',
          })}
        >
          Hard Dodgers - under 45 ({hardDodgersCount})
        </button>

        <Link to={`/repeat_offenders`} style={{ position: 'relative' }} className="boss-page-main__control">
          <span className="boss-red-badge">{markNeededOffendersCount}</span> Repeat Offenders ({offendersCount})
        </Link>
      </div>
    );
  }
}
