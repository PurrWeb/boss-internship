import oFetch from 'o-fetch'
import { machineRefloatCalculationFromReadings } from "~/lib/machine-refloat-calculation"

describe("machineRefloatCalculationFromReadings()", () => {
  it("should call calculationFunction with correct values", () => {
    const refillX10p = 20;
    const cashInX10p = 23;
    const cashOutX10p = 50;

    const machineFloatCents = 233;
    const initialFloatTopupCents = 212;

    const lastRefillReading = 20;
    const lastCashInReading = 34;
    const lastCashOutReading = 54;
    const lastCalculatedMoneyBankedCents = 200;
    const lastCalculatedFloatTopupCents = 233;
    const lastMoneyBankedCents = 900;
    const lastFloatTopupCents = 444;
    //Calculated internally
    const lastUntoppedupFloatCents = lastCalculatedFloatTopupCents - lastFloatTopupCents;

    const selectedMachine = {
      initialFloatTopupCents: initialFloatTopupCents,
      floatCents: machineFloatCents
    }
    const lastMachineRefloat = {
      refillX10p: lastRefillReading,
      cashInX10p: lastCashInReading,
      cashOutX10p: lastCashOutReading,
      calculatedMoneyBankedCents: lastCalculatedMoneyBankedCents,
      calculatedFloatTopupCents: lastCalculatedFloatTopupCents,
      moneyBankedCents: lastMoneyBankedCents,
      floatTopupCents:lastFloatTopupCents
    }

    const mockCaluclationFunction = jest.fn();
    const mockReturnValue = "Mock return value";
    mockCaluclationFunction.mockReturnValue(mockReturnValue);

    const options = {
      refillX10p: refillX10p,
      cashInX10p: cashInX10p,
      cashOutX10p: cashOutX10p,
      selectedMachine: selectedMachine,
      lastMachineRefloat: lastMachineRefloat,
      calculationFunction: mockCaluclationFunction
    }

    expect(machineRefloatCalculationFromReadings(options)).toEqual(mockReturnValue);

    expect(mockCaluclationFunction).toHaveBeenLastCalledWith({
      refillX10p: refillX10p,
      cashInX10p: cashInX10p,
      cashOutX10p: cashOutX10p,
      lastRefillCents: lastRefillReading * 10,
      lastCashInCents: lastCashInReading * 10,
      lastCashOutCents: lastCashOutReading * 10,
      lastCalculatedMoneyBankedCents: lastCalculatedMoneyBankedCents,
      lastCalculatedFloatTopupCents: lastCalculatedFloatTopupCents,
      lastMoneyBankedCents: lastMoneyBankedCents,
      lastFloatTopupCents: lastFloatTopupCents,
      lastUntoppedupFloatCents: lastUntoppedupFloatCents
    })
  });
});
