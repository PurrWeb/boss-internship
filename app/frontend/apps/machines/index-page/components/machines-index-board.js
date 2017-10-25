import React from 'react';
import numeral from 'numeral';
import safeMoment from "~/lib/safe-moment";

function Row({children, classNames = null}) {
  return (
    <div className={`boss-check__row ${classNames}`}>
      <div className="boss-check__cell">
        {children}
      </div>
    </div>
  )
}

function InfoRow({children, text}) {
  return (
    <div className="boss-check__info-row">
      <div className="boss-check__info-cell">
        <p className="boss-check__text">{text}</p>
      </div>
      <div className="boss-check__info-cell">
        {children}
      </div>
    </div>
  )
}

export default function MachinesIndexBoard({
  machine,
  creator,
  onEdit,
  onDisable,
  onRestore,
}) {
  function machineName() {
    return !machine.disabledAt
      ? <span>{machine.get('name')}</span>
      : <span>{machine.get('name')}<span className="boss-check__title-status">(Disabled)</span></span>
  }

  function money(value) {
    return numeral(value / 100).format('0,0.00')
  }

  function date(value) {
    return safeMoment.iso8601Parse(value).format('HH:mm DD-MM-YYYY');
  }

  function totalBankedCents(){
    return machine.get("totalBankedCents");
  }

  function renderActionButtons(machine) {
    return machine.get('disabledAt')
      ? <div className="boss-check__row boss-check__row_role_buttons">
          <button
            onClick={() => onRestore(machine)}
            className="boss-button boss-button_role_restore boss-check__button"
          >Restore</button>
        </div>
      : <div className="boss-check__row boss-check__row_role_buttons">
          <button
            onClick={() => onEdit(machine)}
            className="boss-button boss-button_role_edit boss-check__button"
          >Edit</button>
          <button
            onClick={() => onDisable(machine.get('id'))}
            className="boss-button boss-button_role_disable boss-check__button"
          >Disable</button>
        </div>
  }

  return (
    <div className="boss-check boss-check_role_board">
      <Row>
        <div className="boss-check__title boss-check__title_role_arcade">
          <span>{machineName()}</span>
        </div>
      </Row>
      <Row>
        <p className="boss-check__text boss-check__text_role_main boss-check__text_role_location">
          {machine.get('location')}
        </p>
      </Row>
      <Row classNames="boss-check__row_marked">
        <div className="boss-check__info-table">
          <InfoRow text="Total Banked">
            <p className="boss-check__text boss-check__text_role_primary">
              £{money(totalBankedCents())}
            </p>
          </InfoRow>
          <InfoRow text="Float">
            <p className="boss-check__text boss-check__text_role_primary">
              <button className="boss-check__link">£{money(machine.get('floatCents'))}</button>
            </p>
          </InfoRow>
          <InfoRow text="Last Refloat">
            <p className="boss-check__text boss-check__text_role_primary boss-check__text_role_time">
              {date(machine.get('createdAt'))}
            </p>
          </InfoRow>
          <InfoRow text="Created">
            <p className="boss-check__text boss-check__text_role_primary boss-check__text_role_time">
              {date(machine.get('createdAt'))}
            </p>
          </InfoRow>
          <InfoRow text="By">
            <p className="boss-check__text boss-check__text_role_primary boss-check__text_role_user">
              {creator.get('name')}
            </p>
          </InfoRow>
        </div>
      </Row>
      {renderActionButtons(machine)}
    </div>
  )
}
