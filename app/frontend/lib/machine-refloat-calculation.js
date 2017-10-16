import oFetch from "o-fetch"

function machineRefloatCalculation(options){
  let selectedMachine = oFetch(options, 'selectedMachine');
  let lastMachineRefloat = oFetch(options, 'lastMachineRefloat');
  let refillX10pReading = oFetch(options, 'refillX10pReading');
  let cashInX10pReading = oFetch(options, 'cashInX10pReading');
  let cashOutX10pReading = oFetch(options, 'cashOutX10pReading');

  const machineFloatCents = oFetch(selectedMachine, 'floatCents');
  const machineFloatTopupCents = oFetch(selectedMachine, 'initialFloatTopupCents');
  const lastMachineRefloatPresent = !(lastMachineRefloat === null || lastMachineRefloat === undefined)

  const lastRefillCents = lastMachineRefloatPresent ? oFetch(lastMachineRefloat, 'refillX10pReading') * 10 : oFetch(selectedMachine, 'refillX10pReading') * 10;
  const lastCashInCents = lastMachineRefloatPresent ? oFetch(lastMachineRefloat, 'cashInX10pReading') * 10 : oFetch(selectedMachine, 'cashInX10pReading') * 10;
  const lastCashOutCents = lastMachineRefloatPresent ? oFetch(lastMachineRefloat, 'cashOutX10pReading') * 10 : oFetch(selectedMachine, 'cashOutX10pReading') * 10;
  const lastCalculatedMoneyBankedCents = lastMachineRefloat ? oFetch(lastMachineRefloat, 'calculatedMoneyBankedCents') : 0;

  const lastCalculatedFloatTopupCents = lastMachineRefloatPresent ? oFetch(lastMachineRefloat, 'calculatedFloatTopupCents') : machineFloatCents;
  const lastMoneyBankedCents = lastMachineRefloatPresent ? oFetch(lastMachineRefloat, 'moneyBankedCents') : machineFloatTopupCents;
  const refillCents = refillX10pReading * 10;
  const cashInCents = cashInX10pReading * 10;
  const cashOutCents = cashOutX10pReading * 10;
  const lastFloatTopupCents = lastMachineRefloatPresent ? oFetch(lastMachineRefloat, 'floatTopupCents') : machineFloatTopupCents;
  const cashInDiffCents = cashInCents - lastCashInCents;
  const cashOutDiffCents = cashOutCents - lastCashOutCents;
  const refillDiffCents = refillCents - lastRefillCents;
  const lastUnbankedCents = lastCalculatedMoneyBankedCents - lastMoneyBankedCents;
  const lastUntoppedupFloatCents = lastMachineRefloat ?  lastCalculatedFloatTopupCents - lastFloatTopupCents : 0

  const topupAndBankedCanEdit = !!((refillX10pReading || refillX10pReading === 0) && (cashInX10pReading || cashInX10pReading === 0) && (cashOutX10pReading || cashOutX10pReading === 0));
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
