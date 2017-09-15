import React from 'react';

const Stats = ({value, label}) => {
  
  return (
    <div className="boss-count boss-count_adjust_row">
      <div className="boss-count__group">
        <p className="boss-count__number">{value}</p>
        <p className="boss-count__label">{label}</p>
      </div>
    </div>
  )
}

export default Stats;
