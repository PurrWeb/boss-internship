import React from 'react';

export default function RotaFilter({
  currentRotaDay,
}) {
  return (
    <div className="boss-form__field boss-form__field_role_control boss-form__field_layout_min">
      <p className="boss-form__label boss-form__label_type_icon-single boss-form__label_type_icon-date">
        <span className="boss-form__label-text boss-form__label-text_type_hidden">
        Display
        </span>
      </p>
      <div className="boss-form__switcher">
        <span className="boss-form__switcher-label">
          <span className="boss-form__switcher-label-text boss-form__switcher-label-text_type_border boss-form__switcher-label-text_state_active">
            Daily
          </span>
        </span>
        <a href={`/rotas?highlight_date=${currentRotaDay}`} className="boss-form__switcher-label">
          <span className="boss-form__switcher-label-text boss-form__switcher-label-text_type_border">
            Weekly
          </span>
        </a>
      </div>
    </div>
  )
}
