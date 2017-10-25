import oFetch from "o-fetch"

function machineRefloatCalculation(options){
  let selectedMachine = oFetch(options, 'selectedMachine');
  let lastMachineRefloat = oFetch(options, 'lastMachineRefloat');
  let refillX10p = oFetch(options, 'refillX10p');
  let cashInX10p = oFetch(options, 'cashInX10p');
  let cashOutX10p = oFetch(options, 'cashOutX10p');

  const machineFloatCents = oFetch(selectedMachine, 'floatCents');
  const machineFloatTopupCents = oFetch(selectedMachine, 'initialFloatTopupCents');
  const lastMachineRefloatPresent = !(lastMachineRefloat === null || lastMachineRefloat === undefined)

  const lastRefillCents = lastMachineRefloatPresent ? oFetch(lastMachineRefloat, 'refillX10p') * 10 : oFetch(selectedMachine, 'refillX10p') * 10;
  const lastCashInCents = lastMachineRefloatPresent ? oFetch(lastMachineRefloat, 'cashInX10p') * 10 : oFetch(selectedMachine, 'cashInX10p') * 10;
  const lastCashOutCents = lastMachineRefloatPresent ? oFetch(lastMachineRefloat, 'cashOutX10p') * 10 : oFetch(selectedMachine, 'cashOutX10p') * 10;
  const lastCalculatedMoneyBankedCents = lastMachineRefloat ? oFetch(lastMachineRefloat, 'calculatedMoneyBankedCents') : 0;

  const lastCalculatedFloatTopupCents = lastMachineRefloatPresent ? oFetch(lastMachineRefloat, 'calculatedFloatTopupCents') : machineFloatCents;
  const lastMoneyBankedCents = lastMachineRefloatPresent ? oFetch(lastMachineRefloat, 'moneyBankedCents') : machineFloatTopupCents;
  const refillCents = refillX10p * 10;
  const cashInCents = cashInX10p * 10;
  const cashOutCents = cashOutX10p * 10;
  const lastFloatTopupCents = lastMachineRefloatPresent ? oFetch(lastMachineRefloat, 'floatTopupCents') : machineFloatTopupCents;
  const cashInDiffCents = cashInCents - lastCashInCents;
  const cashOutDiffCents = cashOutCents - lastCashOutCents;
  const refillDiffCents = refillCents - lastRefillCents;
  const lastUnbankedCents = lastCalculatedMoneyBankedCents - lastMoneyBankedCents;
  const lastUntoppedupFloatCents = lastMachineRefloat ?  lastCalculatedFloatTopupCents - lastFloatTopupCents : 0

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

export default machineRefloatCalculation;
