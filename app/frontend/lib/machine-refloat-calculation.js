import oFetch from "o-fetch"

function machineRefloatCalculation(options){
  const refillX10p = oFetch(options, 'refillX10p');
  const cashInX10p = oFetch(options, 'cashInX10p');
  const cashOutX10p = oFetch(options, 'cashOutX10p');
  const lastRefillCents = oFetch(options, 'lastRefillCents');
  const lastCashInCents = oFetch(options, 'lastCashInCents');
  const lastCashOutCents = oFetch(options, 'lastCashOutCents');
  const lastCalculatedMoneyBankedCents = oFetch(options, 'lastCalculatedMoneyBankedCents');
  const lastCalculatedFloatTopupCents = oFetch(options, 'lastCalculatedFloatTopupCents');
  const lastMoneyBankedCents = oFetch(options, 'lastMoneyBankedCents');
  const lastFloatTopupCents = oFetch(options, 'lastFloatTopupCents');
  const lastUntoppedupFloatCents = oFetch(options, 'lastUntoppedupFloatCents');

  const refillCents = refillX10p * 10;
  const cashInCents = cashInX10p * 10;
  const cashOutCents = cashOutX10p * 10;

  const cashInDiffCents = cashInCents - lastCashInCents;
  const cashOutDiffCents = cashOutCents - lastCashOutCents;
  const refillDiffCents = refillCents - lastRefillCents;
  const lastUnbankedCents = lastCalculatedMoneyBankedCents - lastMoneyBankedCents;

  const topupAndBankedCanEdit = !!((refillX10p || refillX10p === 0) && (cashInX10p || cashInX10p === 0) && (cashOutX10p || cashOutX10p === 0));

  let calculatedFloatTopupCents = null;
  let calculatedMoneyBankedCents = null;
  if (topupAndBankedCanEdit) {
    calculatedFloatTopupCents = cashOutDiffCents - (refillDiffCents - lastFloatTopupCents) + lastUntoppedupFloatCents;
    calculatedMoneyBankedCents = cashInDiffCents - (refillDiffCents - lastFloatTopupCents) + lastUnbankedCents;
  }

  return {
    topupAndBankedCanEdit: topupAndBankedCanEdit,
    calculatedMoneyBankedCents: calculatedMoneyBankedCents,
    calculatedFloatTopupCents: calculatedFloatTopupCents
  };
}

export function machineRefloatCalculationFromReadings(options) {
  const selectedMachine = oFetch(options, 'selectedMachine');
  const lastMachineRefloat = options.lastMachineRefloat;
  const lastMachineRefloatPresent = !(lastMachineRefloat === null || lastMachineRefloat === undefined)

  const machineFloatCents = oFetch(selectedMachine, 'floatCents');
  const machineFloatTopupCents = oFetch(selectedMachine, 'initialFloatTopupCents');

  const lastRefillCents = lastMachineRefloatPresent ? oFetch(lastMachineRefloat, 'refillX10p') * 10 : oFetch(selectedMachine, 'refillX10p') * 10;
  const lastCashInCents = lastMachineRefloatPresent ? oFetch(lastMachineRefloat, 'cashInX10p') * 10 : oFetch(selectedMachine, 'cashInX10p') * 10;
  const lastCashOutCents = lastMachineRefloatPresent ? oFetch(lastMachineRefloat, 'cashOutX10p') * 10 : oFetch(selectedMachine, 'cashOutX10p') * 10;
  const lastCalculatedMoneyBankedCents = lastMachineRefloat ? oFetch(lastMachineRefloat, 'calculatedMoneyBankedCents') : 0;

  const lastCalculatedFloatTopupCents = lastMachineRefloatPresent ? oFetch(lastMachineRefloat, 'calculatedFloatTopupCents') : machineFloatCents;
  const lastMoneyBankedCents = lastMachineRefloatPresent ? oFetch(lastMachineRefloat, 'moneyBankedCents') : machineFloatTopupCents;
  const lastFloatTopupCents = lastMachineRefloatPresent ? oFetch(lastMachineRefloat, 'floatTopupCents') : machineFloatTopupCents;

  const lastUntoppedupFloatCents = lastMachineRefloat ? lastCalculatedFloatTopupCents - lastFloatTopupCents : 0

  return machineRefloatCalculation({
    refillX10p: oFetch(options, 'refillX10p'),
    cashInX10p: oFetch(options, 'cashInX10p'),
    cashOutX10p: oFetch(options, 'cashOutX10p'),
    lastRefillCents: lastRefillCents,
    lastCashInCents: lastCashInCents,
    lastCashOutCents: lastCashOutCents,
    lastCalculatedMoneyBankedCents: lastCalculatedMoneyBankedCents,
    lastCalculatedFloatTopupCents: lastCalculatedFloatTopupCents,
    lastMoneyBankedCents: lastMoneyBankedCents,
    lastFloatTopupCents: lastFloatTopupCents,
    lastUntoppedupFloatCents: lastUntoppedupFloatCents
  });
}

export function calculateRefloatValues(options){
  const selectedMachine = oFetch(options, 'selectedMachine');
  const machineRefloat = oFetch(options, 'machineRefloat');

  const refillX10p = oFetch(machineRefloat, 'refillX10p');
  const cashInX10p = oFetch(machineRefloat, 'cashInX10p');
  const cashOutX10p = oFetch(machineRefloat, 'cashOutX10p');

  const cashOutCents = cashOutX10p * 10;
  const cashInCents = cashInX10p * 10;

  const machineFloatCents = oFetch(selectedMachine, 'floatCents');

  const floatTopupCents = oFetch(machineRefloat, 'floatTopupCents');
  const lastRefillCents = oFetch(machineRefloat, 'lastRefillCents') * 10;
  const lastCashInCents = oFetch(machineRefloat, 'lastCashInCents') * 10;
  const lastCashOutCents = oFetch(machineRefloat, 'lastCashOutCents') * 10;
  const lastCalculatedMoneyBankedCents = oFetch(machineRefloat, 'lastCalculatedMoneyBankedCents');
  const lastCalculatedFloatTopupCents = oFetch(machineRefloat, 'lastCalculatedFloatTopupCents');
  const lastMoneyBankedCents = oFetch(machineRefloat, 'lastMoneyBankedCents');
  const lastFloatTopupCents = oFetch(machineRefloat, 'lastFloatTopupCents');
  const lastUntoppedupFloatCents = lastCalculatedFloatTopupCents - lastFloatTopupCents;

  const initialRefillCents = oFetch(selectedMachine, 'refillX10p') * 10;
  const initialCashOutCents = oFetch(selectedMachine, 'cashOutX10p') * 10;

  const cashOutSinceStartCents = cashOutCents - initialCashOutCents;
  const refillSinceStartCents = lastRefillCents - initialRefillCents;
  const currentFloatCents = machineFloatCents + refillSinceStartCents + floatTopupCents - cashOutSinceStartCents;

  const cashInDiffCents = cashInCents - lastCashInCents;
  const cashOutDiffCents = cashOutCents - lastCashOutCents;
  const currentFloatDiffCents = machineFloatCents - currentFloatCents;

  return {
    refillX10p: refillX10p,
    cashInX10p: cashInX10p,
    cashOutX10p: cashOutX10p,
    floatTopupCents: floatTopupCents,
    lastRefillCents: lastRefillCents,
    lastCashInCents: lastCashInCents,
    lastCashOutCents: lastCashOutCents,
    lastCalculatedMoneyBankedCents: lastCalculatedMoneyBankedCents,
    lastCalculatedFloatTopupCents: lastCalculatedFloatTopupCents,
    lastMoneyBankedCents: lastMoneyBankedCents,
    lastFloatTopupCents: lastFloatTopupCents,
    lastUntoppedupFloatCents: lastUntoppedupFloatCents,
    currentFloatCents: currentFloatCents,
    cashInDiffCents: cashInDiffCents,
    cashOutDiffCents: cashOutDiffCents,
    currentFloatDiffCents: currentFloatDiffCents
  }
}

export function machineRefloatCalculationFromRefloatValues(options) {
  const refloatValues = oFetch(options, 'refloatValues');

  return machineRefloatCalculation({
    refillX10p: oFetch(refloatValues, 'refillX10p'),
    cashInX10p: oFetch(refloatValues, 'cashInX10p'),
    cashOutX10p: oFetch(refloatValues, 'cashOutX10p'),
    lastRefillCents: oFetch(refloatValues, 'lastRefillCents'),
    lastCashInCents: oFetch(refloatValues, 'lastCashInCents'),
    lastCashOutCents: oFetch(refloatValues, 'lastCashOutCents'),
    lastCalculatedMoneyBankedCents: oFetch(refloatValues, 'lastCalculatedMoneyBankedCents'),
    lastCalculatedFloatTopupCents: oFetch(refloatValues, 'lastCalculatedFloatTopupCents'),
    lastMoneyBankedCents: oFetch(refloatValues, 'lastMoneyBankedCents'),
    lastFloatTopupCents: oFetch(refloatValues, 'lastFloatTopupCents'),
    lastUntoppedupFloatCents: oFetch(refloatValues, 'lastUntoppedupFloatCents')
  });
}