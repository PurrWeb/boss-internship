import oFetch from "o-fetch"

export default function(options){
  let selectedMachine = oFetch(options, 'selectedMachine');
  let lastMachineRefloat = oFetch(options, 'lastMachineRefloat');
  let refillX10pReading = oFetch(options, 'refillX10pReading');
  let cashInX10pReading = oFetch(options, 'cashInX10pReading');
  let cashOutX10pReading = oFetch(options, 'cashOutX10pReading');

  const machineFloatCents = selectedMachine.floatCents;
  const machineFloatTopupCents = selectedMachine.initialFloatTopupCents;

  const lastRefillCents = lastMachineRefloat ? lastMachineRefloat.refillX10pReading * 10 : selectedMachine.refillX10pReading * 10;
  const lastCashInCents = lastMachineRefloat ? lastMachineRefloat.cashInX10pReading * 10 : selectedMachine.cashInX10pReading * 10;
  const lastCashOutCents = lastMachineRefloat ? lastMachineRefloat.cashOutX10pReading * 10 : selectedMachine.cashOutX10pReading * 10;
  const lastCalculatedMoneyBankedCents = lastMachineRefloat ? lastMachineRefloat.calculatedMoneyBankedCentsCents : 0;

  const lastCalculatedFloatTopupCents = lastMachineRefloat ? lastMachineRefloat.calculatedFloatTopupCents : machineFloatCents;
  const lastMoneyBankedCents = lastMachineRefloat ? lastMachineRefloat.moneyBankedCents : machineFloatTopupCents;
  const refillCents = refillX10pReading * 10;
  const cashInCents = cashInX10pReading * 10;
  const cashOutCents = cashOutX10pReading * 10;
  const lastFloatTopupCents = lastMachineRefloat ? lastMachineRefloat.floatTopupCents : machineFloatTopupCents;
  const cashInDiffCents = cashInCents - lastCashInCents;
  const cashOutDiffCents = cashOutCents - lastCashOutCents;
  const refillDiffCents = refillCents - lastRefillCents;
  const lastUnbankedCents = lastCalculatedMoneyBankedCents - lastMoneyBankedCents;
  const lastUntoppedupFloatCents = lastMachineRefloat ?  lastCalculatedFloatTopupCents - lastFloatTopupCents : 0

  const topupAndBankedCanEdit = (refillX10pReading || refillX10pReading === 0) && (cashInX10pReading || cashInX10pReading === 0) && (cashOutX10pReading || cashOutX10pReading === 0);
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
