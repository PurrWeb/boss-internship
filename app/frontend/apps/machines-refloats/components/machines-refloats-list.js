import React from "react";
import ContentWrapper from '~/components/content-wrapper';
import Pagination from '~/components/pagination';
import URLSearchParams from 'url-search-params';
import utils from '~/lib/utils';
import moment from 'moment';
import numeral from 'numeral';
import MachinesReportsItemStat from './machines-reports-item-stat';
import MachineRefloatIndexReadingsDropdown from './machine-refloat-index-readings-dropdown';
import oFetch from 'o-fetch';

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
        {moment(oFetch(machineRefloat, 'createdAt')).format(utils.humanDateFormatWithTime()) }
      </Badge>
      <Badge labelClasses="boss-count__label_role_arcade">
        {`${oFetch(machine, 'name')}(${oFetch(machine, 'location')})`}
      </Badge>
      <Badge labelClasses="boss-count__label_role_user">
        {oFetch(machineRefloat, 'createdBy')}
      </Badge>
    </div>
  )
}

export function MachinesRefloatsItem({machineRefloat, machine}) {
  machine = machine.toJS();
  machineRefloat = machineRefloat.toJS();

  const machineFloatCents = oFetch(machine, 'floatCents');
  const initialCashInCents = oFetch(machine, 'cashInX10p') * 10;
  const initialCashOutCents = oFetch(machine, 'cashOutX10p') * 10;
  const initialRefillCents = oFetch(machine, 'refillX10p') * 10;
  const floatTopupCents = oFetch(machineRefloat, 'floatTopupCents');
  const moneyBankedCents = oFetch(machineRefloat, 'moneyBankedCents');
  const refillCents = oFetch(machineRefloat, 'refillX10p') * 10;
  const cashInCents = oFetch(machineRefloat, 'cashInX10p') * 10;
  const cashOutCents = oFetch(machineRefloat, 'cashOutX10p') * 10;
  const lastRefillCents = oFetch(machineRefloat, 'lastRefillCents') * 10;
  const lastCashInCents = oFetch(machineRefloat, 'lastCashInCents') * 10;
  const lastCashOutCents = oFetch(machineRefloat, 'lastCashOutCents') * 10;
  const lastCalculatedFloatTopupCents = oFetch(machineRefloat, 'calculatedFloatTopupCents');
  const lastCalculatedMoneyBankedCents = oFetch(machineRefloat, 'calculatedMoneyBankedCents');
  const refillDiffCents = refillCents - lastRefillCents;
  const cashInDiffCents = cashInCents - lastCashInCents;
  const cashOutDiffCents = cashOutCents - lastCashOutCents;
  const cashInDiff = numeral(cashInDiffCents / 100).format('0,0.00');
  const cashOutDiff = numeral(cashOutDiffCents / 100).format('0,0.00');
  const refillReading = oFetch(machineRefloat, 'refillX10p');
  const cashInReading = oFetch(machineRefloat, 'cashInX10p');
  const cashOutReading = oFetch(machineRefloat, 'cashOutX10p');
  const lastFloatTopup = numeral(floatTopupCents / 100).format('0,0.00');
  const lastMoneyBanked = numeral(moneyBankedCents / 100).format('0,0.00');
  const refillSinceStartCents = refillCents - initialRefillCents;
  const cashOutSinceStartCents = cashOutCents - initialCashOutCents;
  const currentFloatCents = machineFloatCents + refillSinceStartCents + floatTopupCents - cashOutSinceStartCents;
  const currentFloat = numeral(currentFloatCents / 100).format('0,0.00');

  let lastFloatTopupDiff = lastCalculatedFloatTopupCents - floatTopupCents;
  let lastMoneyBankedDiff = lastCalculatedMoneyBankedCents - moneyBankedCents;
  const currentFloatDiffCents = machineFloatCents - currentFloatCents;

  let lastFloatTopupExtra = null;
  if (lastFloatTopupDiff !== 0) {
    lastFloatTopupExtra = `£${numeral(lastFloatTopupDiff / 100).format('0,0.00')}`;
  }
  let lastMoneyBankedExtra = null;
  if (lastMoneyBankedDiff !== 0) {
    lastMoneyBankedExtra = `£${numeral(lastMoneyBankedDiff / 100).format('0,0.00')}`;
  }
  let currentFloatExtra = null;
  if (currentFloatDiffCents !== 0) {
    currentFloatExtra = `£${numeral(currentFloatDiffCents / 100).format('0,0.00')}`;
  }

  const floatTopupNote = oFetch(machineRefloat, 'floatTopupNote');
  const moneyBankedNote = oFetch(machineRefloat, 'moneyBankedNote');

  return (
    <div className="boss-page-main__group boss-page-main__group_adjust_machine-refloats boss-page-main__group_context_stack">
      <div className="boss-report">
        <MachineRefloatsItemMeta machineRefloat={machineRefloat} machine={machine} />
        <MachinesReportsItemBoard boardClasses="boss-report__group_role_board">
          <MachineRefloatIndexReadingsDropdown
            refillReading={refillReading}
            cashInReading={cashInReading}
            cashOutReading={cashOutReading} />
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
