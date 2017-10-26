import React from 'react';
import safeMoment from '~/lib/safe-moment';

export default function RotaDayFilter({currentRotaDay, desktop = true}) {
  const currentDay = safeMoment.uiDateParse(currentRotaDay).format('dddd, DD MMMM YYYY');
  const previousDay = safeMoment.uiDateParse(currentRotaDay).subtract(1, 'day').format('DD-MM-YYYY')
  const nextDay = safeMoment.uiDateParse(currentRotaDay).add(1, 'day').format('DD-MM-YYYY');
  
  const additionalClassName = desktop ? "boss-form__row_desktop" : ""

  return (
    <div className={`boss-form__row boss-form__row_justify_space boss-form__row_position_last ${additionalClassName}`}>
      <div className="boss-form__field boss-form__field_position_last">
        <div className="boss-form__pagination">
          <a href={`/rotas/${previousDay}`} className="boss-form__pagination-control boss-form__pagination-control_prev">Previous</a>
          <p className="boss-form__pagination-label">{currentDay}</p>
          <a href={`/rotas/${nextDay}`} className="boss-form__pagination-control boss-form__pagination-control_next">Next</a>
        </div>
      </div>
    </div>
  )
}
