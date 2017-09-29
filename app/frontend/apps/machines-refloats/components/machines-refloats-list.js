import React from "react";
import ContentWrapper from '~/components/content-wrapper';
import Tooltip from '~/components/boss-form/tooltip';
import Pagination from '~/components/pagination';
import URLSearchParams from 'url-search-params';
import utils from '~/lib/utils';
import moment from 'moment';
import numeral from 'numeral';

export function Badge({
  labelClasses = '',
  children,
}) {
  const labelClassName = `boss-count__label boss-count__label_size_medium ${labelClasses}`

  return (
    <div className="boss-count boss-count_type_solid boss-count_adjust_flow">
      <p className={labelClassName}>
        {children}
      </p>
    </div>
  )
}

export function MachinesReportsItemStatNote({note}) {
  return (
    <div className="boss-report__stats-note">
      <div className="boss-report__note boss-report__note_role_control-fluid-s">
        <p className="boss-report__note-label">Note</p>
        <div className="boss-report__note-box">
          <p className="boss-report__text">
            {note}
          </p>
        </div>
      </div>
    </div>
  )
}

export function MachinesReportsItemStat({
  label,
  value,
  statClasses = '',
  labelClasses = '',
  tip = '',
  tooltipDelimiter = false,
  extraValue = '',
}) {

  const statClassName = `boss-report__stats-item ${statClasses}`
  const labelClassName = `boss-report__stats-text ${labelClasses}`

  return (
    <div className={statClassName}>
      <div className="boss-report__stats-label">
        <p className={labelClassName}>
          <span>{label}</span>
          {tip && <Tooltip delimiter={tooltipDelimiter} message={tip} />}
        </p>
      </div>
      <div className="boss-report__stats-value">
        <p className="boss-report__stats-text boss-report__stats-text_size_m boss-report__stats-text_marked">
          {value}
          {extraValue && <span className="boss-report__stats-text-alert boss-report__stats-text-nowrap"> {extraValue}</span>}
        </p>
      </div>
    </div>
  )
}

export function MachinesReportsItemBoard({
  boardClasses = '',
  children,
}) {
  const boardClassName = `boss-report__group ${boardClasses}`;
  return (
    <div className={boardClassName}>
      <div className="boss-report__record">
        {children}
      </div>
    </div>
  )
}

export function MachineRefloatsItemMeta({machineRefloat, machine}) {
  return (
    <div className="boss-report__meta">
      <Badge labelClasses="boss-count__label_role_time">
        {moment(machineRefloat.get('createdAt')).format(utils.humanDateFormatWithTime()) }
      </Badge>
      <Badge labelClasses="boss-count__label_role_arcade">
        {`${machine.get('name')}(${machine.get('location')})`}
      </Badge>
      <Badge labelClasses="boss-count__label_role_user">
        {machineRefloat.get('createdBy')}
      </Badge>
    </div>
  )
}

export function MachinesRefloatsItem({machineRefloat, machine}) {
  const machineFloatPounds = machine.get('floatCents') / 100;
  const floatTopupPounds = machineRefloat.get('floatTopupCents') / 100;
  const moneyBankedPounds = machineRefloat.get('moneyBankedCents') / 100;
  const refillPounds = (machineRefloat.get('refillX10p') / 10);
  const cashInPounds = machineRefloat.get('cashInX10p') / 10;
  const cashOutPounds = machineRefloat.get('cashOutX10p') / 10;
  const lastRefillPounds = machineRefloat.get('lastRefillCents') / 10;
  const lastCashInPounds = machineRefloat.get('lastCashInCents') / 10;
  const lastCashOutPounds = machineRefloat.get('lastCashOutCents') / 10;
  const lastCalculatedFloatTopupPounds = machineRefloat.get('calculatedFloatTopupCents') / 100;
  const lastCalculatedMoneyBankedPounds = machineRefloat.get('calculatedMoneyBankedCents') / 100;
  const refillDiffPounds = Math.abs(refillPounds - lastRefillPounds);
  const cashInDiffPounds = Math.abs(cashInPounds - lastCashInPounds);
  const cashOutDiffPounds = Math.abs(cashOutPounds - lastCashOutPounds);
  const cashInDiff = numeral(cashInDiffPounds).format('0,0.00');
  const cashOutDiff = numeral(cashOutDiffPounds).format('0,0.00');
  const refill = numeral(refillPounds).format('0,0.00');
  const cashIn = numeral(cashInPounds).format('0,0.00');
  const cashOut = numeral(cashOutPounds).format('0,0.00');
  const lastFloatTopup = numeral(floatTopupPounds).format('0,0.00');
  const lastMoneyBanked = numeral(moneyBankedPounds).format('0,0.00');
  const currentFloatPounds = machineFloatPounds + refillPounds + floatTopupPounds - cashOutPounds;
  const currentFloat = numeral(currentFloatPounds).format('0,0.00');

  let lastFloatTopupDiff = lastCalculatedFloatTopupPounds - floatTopupPounds;
  let lastMoneyBankedDiff = lastCalculatedMoneyBankedPounds - moneyBankedPounds;
  const currentFloatDiffPounds = machineFloatPounds - currentFloatPounds;
  
  let lastFloatTopupExtra = null;
  if (lastFloatTopupDiff !== 0) {
    lastFloatTopupExtra = `£${numeral(Math.abs(lastFloatTopupDiff)).format('0,0.00')}`;
  }
  let lastMoneyBankedExtra = null;
  if (lastMoneyBankedDiff !== 0) {
    lastMoneyBankedExtra = `£${numeral(Math.abs(lastMoneyBankedDiff)).format('0,0.00')}`;
  }
  let currentFloatExtra = null;
  if (currentFloatDiffPounds !== 0) {
    currentFloatExtra = `£${numeral(Math.abs(currentFloatDiffPounds)).format('0,0.00')}`;
  }
  
  const floatTopupNote = machineRefloat.get('floatTopupNote');
  const moneyBankedNote = machineRefloat.get('moneyBankedNote');

  return (
    <div className="boss-page-main__group boss-page-main__group_adjust_machine-refloats boss-page-main__group_context_stack">
      <div className="boss-report">
        <MachineRefloatsItemMeta machineRefloat={machineRefloat} machine={machine} />
        <MachinesReportsItemBoard boardClasses="boss-report__group_role_board">
          <h3 className="boss-report__subtitle boss-report__subtitle_role_readings">
            Readings
          </h3>
          <div className="boss-report__stats">
            <MachinesReportsItemStat
              statClasses="boss-report__stats-item_layout_table"
              labelClasses="boss-report__stats-text_size_m"
              tip="How much the float has been topped up the float since the start of time, including money taken from customers."
              label="Refill"
              value={`£${refill}`}
            />
            <MachinesReportsItemStat
              statClasses="boss-report__stats-item_layout_table"
              labelClasses="boss-report__stats-text_size_m"
              tip="How much customer money put into machine since start of time."
              label="Cash In"
              value={`£${cashIn}`}
            />
            <MachinesReportsItemStat
              statClasses="boss-report__stats-item_layout_table"
              labelClasses="boss-report__stats-text_size_m"
              tip="How much money has been taken out of the machine since the start of time."
              label="Cash Out"
              value={`£${cashOut}`}
            />
          </div>
        </MachinesReportsItemBoard>
        <MachinesReportsItemBoard boardClasses="boss-report__group_role_middle">
          <div className="boss-report__stats">
            <MachinesReportsItemStat
              tooltipDelimiter
              statClasses="boss-report__stats-item_layout_table-s"
              labelClasses="boss-report__stats-text_size_xl"
              tip="How much the float was topped up after readings."
              label="Float Topup"
              value={`£${lastFloatTopup}`}
              extraValue={lastFloatTopupExtra && `(-${lastFloatTopupExtra})`}
            />
            {floatTopupNote && <MachinesReportsItemStatNote note={floatTopupNote}/>}
            <MachinesReportsItemStat
              tooltipDelimiter
              statClasses="boss-report__stats-item_layout_table-s"
              labelClasses="boss-report__stats-text_size_xl"
              tip="How much money was taken from the machine after readings."
              label="Money Banked"
              value={`£${lastMoneyBanked}`}
              extraValue={lastMoneyBankedExtra && `(-${lastMoneyBankedExtra})`}
            />
            {moneyBankedNote && <MachinesReportsItemStatNote note={moneyBankedNote}/>}
          </div>
        </MachinesReportsItemBoard>
        <MachinesReportsItemBoard boardClasses="boss-report__group_role_board">
          <h3 className="boss-report__subtitle boss-report__subtitle_role_calculate">
            Computed Values
          </h3>
          <div className="boss-report__stats">
            <MachinesReportsItemStat
              statClasses="boss-report__stats-item_layout_table"
              labelClasses="boss-report__stats-text_size_m"
              tip="Current float of machine based on readings given."
              label="Current Float"
              value={`£${currentFloat}`}
              extraValue={currentFloatExtra && `(-${currentFloatExtra})`}
            />
            <MachinesReportsItemStat
              statClasses="boss-report__stats-item_layout_table"
              labelClasses="boss-report__stats-text_size_m"
              tip="Amount entered into machine Since last reading."
              label="Take Since last Reading"
              value={`£${cashInDiff}`}
            />
            <MachinesReportsItemStat
              statClasses="boss-report__stats-item_layout_table"
              labelClasses="boss-report__stats-text_size_m"
              tip="Amount paid out Since last reading."
              label="Payout Since Last Reading"
              value={`£${cashOutDiff}`}
            />
          </div>
        </MachinesReportsItemBoard>
      </div>
    </div>
  )
}

export default function MachinesRefloatsList({
  machinesRefloats = [],
  machines = [],
  pageCount,
  currentPage,
}) {
  const renderMachines = (machines) => {
    return machinesRefloats.map((machineRefloat, index) => {
      const machine = machines.find(machine => machine.get('id') === machineRefloat.get('machineId'));
      return <MachinesRefloatsItem key={index} machine={machine} machineRefloat={machineRefloat}/>
    });
  }
  const handleChangePage = (value) => {
    let queryParams = new URLSearchParams(window.location.search);
    queryParams.set('page', value);
    const link = `${window.location.href.split('?')[0]}?${queryParams.toString()}`
    window.location.href = link;
  }

  return (
    <ContentWrapper>
      {renderMachines(machines)}
      {pageCount > 1 && <Pagination key="pagination" pageCount={pageCount} initialPage={currentPage} onPageChange={handleChangePage} />}
    </ContentWrapper>
  );
}

