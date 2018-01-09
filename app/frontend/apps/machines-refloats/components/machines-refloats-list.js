import React from "react";
import ContentWrapper from '~/components/content-wrapper';
import Pagination from '~/components/pagination';
import URLSearchParams from 'url-search-params';
import utils from '~/lib/utils';
import safeMoment from "~/lib/safe-moment";
import numeral from 'numeral';
import { calculateRefloatValues, machineRefloatCalculationFromRefloatValues } from "~/lib/machine-refloat-calculation";
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
        {safeMoment.iso8601Parse(oFetch(machineRefloat, 'createdAt')).format(utils.humanDateFormatWithTime()) }
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

  const refloatValues = calculateRefloatValues({machineRefloat: machineRefloat, selectedMachine: machine});

  const refillX10p = oFetch(refloatValues, 'refillX10p');
  const cashInX10p = oFetch(refloatValues, 'cashInX10p');
  const cashOutX10p = oFetch(refloatValues, 'cashOutX10p');

  const calculatedValues = machineRefloatCalculationFromRefloatValues({
    refloatValues: refloatValues
  });

  const calculatedFloatTopupCents = oFetch(calculatedValues, 'calculatedFloatTopupCents');
  const calculatedMoneyBankedCents = oFetch(calculatedValues, 'calculatedMoneyBankedCents');

  const floatTopupCents = oFetch(refloatValues, 'floatTopupCents');
  const lastFloatTopup = numeral(floatTopupCents / 100).format('0,0.00');
  const floatTopupDiff = calculatedFloatTopupCents - floatTopupCents;
  let lastFloatTopupExtra = null;
  if (floatTopupDiff !== 0) {
    lastFloatTopupExtra = `£${numeral(floatTopupDiff / 100).format('0,0.00')}`;
  }

  const moneyBankedCents = oFetch(machineRefloat, 'moneyBankedCents');

  const lastMoneyBanked = numeral(moneyBankedCents / 100).format('0,0.00');
  const moneyBankedDiff = calculatedMoneyBankedCents - moneyBankedCents;
  let lastMoneyBankedExtra = null;
  if (moneyBankedDiff !== 0) {
    lastMoneyBankedExtra = `£${numeral(moneyBankedDiff / 100).format('0,0.00')}`;
  }


  const currentFloatCents = oFetch(refloatValues, 'currentFloatCents');
  const currentFloat = numeral(currentFloatCents / 100).format('0,0.00');

  const cashInDiffCents = oFetch(refloatValues, 'cashInDiffCents');
  const cashInDiff = numeral(cashInDiffCents / 100).format('0,0.00');

  const cashOutDiffCents = oFetch(refloatValues, 'cashOutDiffCents');
  const cashOutDiff = numeral(cashOutDiffCents / 100).format('0,0.00');

  const currentFloatDiffCents = oFetch(refloatValues, 'currentFloatDiffCents');
  let currentFloatExtra = null;
  if (currentFloatDiffCents !== 0) {
    currentFloatExtra = `£${numeral(currentFloatDiffCents / 100).format('0,0.00')}`;
  }

  let calculatedFloatTopup = calculatedFloatTopupCents / 100;
  let calculatedMoneyBanked = calculatedMoneyBankedCents / 100;

  const floatTopupNote = oFetch(machineRefloat, 'floatTopupNote');
  const moneyBankedNote = oFetch(machineRefloat, 'moneyBankedNote');

  return (
    <div className="boss-page-main__group boss-page-main__group_adjust_machine-refloats boss-page-main__group_context_stack">
      <div className="boss-report">
        <MachineRefloatsItemMeta machineRefloat={machineRefloat} machine={machine} />
        <MachinesReportsItemBoard boardClasses="boss-report__group_role_board">
          <MachineRefloatIndexReadingsDropdown
            refillReading={refillX10p}
            cashInReading={cashInX10p}
            cashOutReading={cashOutX10p} />
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
  currentPage
}) {
  const renderMachines = (machines) => {
    return machinesRefloats.map((machineRefloat, index) => {
      const machine = machines.find(machine => machine.get('id') === machineRefloat.get('machineId'));
      return <MachinesRefloatsItem key={index} machine={machine} machineRefloat={machineRefloat} />
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
