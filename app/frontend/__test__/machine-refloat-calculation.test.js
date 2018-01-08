import oFetch from 'o-fetch'
import { machineRefloatCalculationFromReadings } from "~/lib/machine-refloat-calculation"

describe("machineRefloatCalculationFromReadings()", () => {
  describe("when machine starts with no topup", () => {
    // £400
    let initialFloatCents = 40000
    // £200
    let initialRefillX10p = 2000;
    // £400
    let initialCashInX10p = 4000;
    // £200
    let initialCashOutX10p = 2000;
    let initialFloatTopupCents = 0;

    let selectedMachine = {
      floatCents: initialFloatCents,
      initialFloatTopupCents: initialFloatTopupCents,
      refillX10p: initialRefillX10p,
      cashInX10p: initialCashInX10p,
      cashOutX10p: initialCashOutX10p
    };
    let lastMachineRefloat = null;

    describe("no refill reading given", () => {
      let options = {
        selectedMachine: selectedMachine,
        lastMachineRefloat: lastMachineRefloat,
        refillX10p: null,
        cashInX10p: initialCashInX10p,
        cashOutX10p: initialCashOutX10p
      };
      it("should give null and not allow editing", () => {

        let result = machineRefloatCalculationFromReadings(options);
        expect(result).toEqual({
          calculatedFloatTopupCents: null,
          calculatedMoneyBankedCents: null,
          topupAndBankedCanEdit: false,
        })
      });
    });

    describe("no cashIn reading given", () => {
      let options = {
        selectedMachine: selectedMachine,
        lastMachineRefloat: lastMachineRefloat,
        refillX10p: initialRefillX10p,
        cashInX10p: null,
        cashOutX10p: initialCashOutX10p
      };
      it("should give null and not allow editing", () => {

        let result = machineRefloatCalculationFromReadings(options);
        expect(result).toEqual({
          calculatedFloatTopupCents: null,
          calculatedMoneyBankedCents: null,
          topupAndBankedCanEdit: false,
        })
      });
    });

    describe("no cashOut reading given", () => {
      let options = {
        selectedMachine: selectedMachine,
        lastMachineRefloat: lastMachineRefloat,
        refillX10p: initialRefillX10p,
        cashInX10p: initialCashInX10p,
        cashOutX10p: null
      };
      it("should give null and not allow editing", () => {

        let result = machineRefloatCalculationFromReadings(options);
        expect(result).toEqual({
          calculatedFloatTopupCents: null,
          calculatedMoneyBankedCents: null,
          topupAndBankedCanEdit: false,
        })
      });
    });

    describe("when readings match initial", () => {
      let options = {
        selectedMachine: selectedMachine,
        lastMachineRefloat: lastMachineRefloat,
        refillX10p: initialRefillX10p,
        cashInX10p: initialCashInX10p,
        cashOutX10p: initialCashOutX10p
      };
      it("should give zero readings", () => {

        let result = machineRefloatCalculationFromReadings(options);
        expect(result).toEqual({
          calculatedFloatTopupCents: 0,
          calculatedMoneyBankedCents: 0,
          topupAndBankedCanEdit: true,
        })
      });
    });

    describe("when readings have changed", () => {
      // £300 (+£100)
      let newRefill = initialRefillX10p + 1000;
      // £600 (+£200)
      let newCashOut = initialCashOutX10p  + 2000;
      // £1000 (+£600)
      let newCashIn = initialCashInX10p + 6000;

      let options = {
        selectedMachine: selectedMachine,
        lastMachineRefloat: lastMachineRefloat,
        refillX10p: newRefill,
        cashInX10p: newCashIn,
        cashOutX10p: newCashOut
      };

      it("should give correct amounts", () => {
        let result = machineRefloatCalculationFromReadings(options);

        let expectedFloatTopupPounds = 100;
        let expectedMoneyBankedPounds = 500;
        expect(result).toEqual({
          calculatedFloatTopupCents: expectedFloatTopupPounds * 100,
          calculatedMoneyBankedCents: expectedMoneyBankedPounds * 100,
          topupAndBankedCanEdit: true,
        })
      });
    });
  });

  describe("when machine starts with topup", () => {
    // £400
    let initialFloatCents = 40000
    // £200
    let initialRefillX10p = 2000;
    // £400
    let initialCashInX10p = 4000;
    // £200
    let initialCashOutX10p = 2000;
    // £200
    let initialFloatTopupCents = 2000;

    let selectedMachine = {
      floatCents: initialFloatCents,
      initialFloatTopupCents: initialFloatTopupCents,
      refillX10p: initialRefillX10p,
      cashInX10p: initialCashInX10p,
      cashOutX10p: initialCashOutX10p
    };
    let lastMachineRefloat = null;

    it('should add topup to the refloat', () => {
      let options = {
        selectedMachine: selectedMachine,
        lastMachineRefloat: lastMachineRefloat,
        refillX10p: initialRefillX10p,
        cashInX10p: initialCashInX10p,
        cashOutX10p: initialCashOutX10p
      };

      let result = machineRefloatCalculationFromReadings(options);

      expect(result).toEqual({
        calculatedFloatTopupCents: initialFloatTopupCents,
        calculatedMoneyBankedCents: 0,
        topupAndBankedCanEdit: true,
      })
    });
  });

  describe("when multiple readings exist", () => {
    // £400
    let initialFloatCents = 40000
    // £200
    let initialRefillX10p = 2000;
    // £400
    let initialCashInX10p = 4000;
    // £200
    let initialCashOutX10p = 2000;
    let initialFloatTopupCents = 0;

    let selectedMachine = {
      floatCents: initialFloatCents,
      initialFloatTopupCents: initialFloatTopupCents,
      refillX10p: initialRefillX10p,
      cashInX10p: initialCashInX10p,
      cashOutX10p: initialCashOutX10p
    };

    describe('after reading where nothing changed', () => {
      let lastMachineRefloat = {
        refillX10p: initialRefillX10p,
        cashInX10p: initialCashInX10p,
        cashOutX10p: initialCashOutX10p,
        moneyBankedCents: 0,
        calculatedMoneyBankedCents: 0,
        floatTopupCents: 0,
        calculatedFloatTopupCents: 0
      };

      it("should still remain the same", () => {
        let options = {
          selectedMachine: selectedMachine,
          lastMachineRefloat: lastMachineRefloat,
          refillX10p: initialRefillX10p,
          cashInX10p: initialCashInX10p,
          cashOutX10p: initialCashOutX10p
        };

        let result = machineRefloatCalculationFromReadings(options);

        expect(result).toEqual({
          calculatedFloatTopupCents: 0,
          calculatedMoneyBankedCents: 0,
          topupAndBankedCanEdit: true,
        })
      });
    });

    describe('multiple readings with strange stuff', () => {
      // £400 (+£200)
      let refloat1RefillX10p = initialRefillX10p + 2000;
      // £1000 (+£600)
      let refloat1CashInX10p = initialCashInX10p + 6000;
      // £500 (+£300)
      let refloat1CashOutX10p = initialCashOutX10p + 3000;
      // £100
      let refloat1FloatTopupCents = 10000;
      // £400
      let refloat1MoneyBankedCents = 40000;
      let refloat1CalculatedValues = machineRefloatCalculationFromReadings({
        selectedMachine: selectedMachine,
        lastMachineRefloat: null,
        refillX10p: refloat1RefillX10p,
        cashInX10p: refloat1CashInX10p,
        cashOutX10p: refloat1CashOutX10p
      });
      let refloat1CalculatedMoneyBankedCents = oFetch(refloat1CalculatedValues, 'calculatedMoneyBankedCents');
      let refloat1CalculatedFloatTopupCents = oFetch(refloat1CalculatedValues, 'calculatedFloatTopupCents');
      let refloat1 = {
        refillX10p: refloat1RefillX10p,
        cashInX10p: refloat1CashInX10p,
        cashOutX10p: refloat1CashOutX10p,
        moneyBankedCents: refloat1MoneyBankedCents,
        calculatedMoneyBankedCents: refloat1CalculatedMoneyBankedCents,
        floatTopupCents: refloat1FloatTopupCents,
        calculatedFloatTopupCents: refloat1CalculatedFloatTopupCents
      }

      // £500 (+£100)
      let refloat2BaseRefill = refloat1RefillX10p + (refloat1FloatTopupCents / 10);
      // £800 (+£300)
      let refloat2RefillX10p = refloat2BaseRefill + 3000;
      // £2000 (+£1000)
      let refloat2CashInX10p = refloat1.cashInX10p + 10000;
      // £1000 (+£500)
      let refloat2CashOutX10p = refloat1.cashOutX10p + 5000;
      // £100 (-100)
      let refloat2FloatTopupCents = 10000;
      // £500 (-£200)
      let refloat2MoneyBankedCents = 50000;
      let refloat2CalculatedValues = machineRefloatCalculationFromReadings({
        selectedMachine: selectedMachine,
        lastMachineRefloat: refloat1,
        refillX10p: refloat2RefillX10p,
        cashInX10p: refloat2CashInX10p,
        cashOutX10p: refloat2CashOutX10p
      });
      let refloat2CalculatedMoneyBankedCents = oFetch(refloat2CalculatedValues, 'calculatedMoneyBankedCents');
      let refloat2CalculatedFloatTopupCents = oFetch(refloat2CalculatedValues, 'calculatedFloatTopupCents');

      let lastMachineRefloat = {
        refillX10p: refloat2RefillX10p,
        cashInX10p: refloat2CashInX10p,
        cashOutX10p: refloat2CashOutX10p,
        moneyBankedCents: refloat2MoneyBankedCents,
        calculatedMoneyBankedCents: refloat2CalculatedMoneyBankedCents,
        floatTopupCents: refloat2FloatTopupCents,
        calculatedFloatTopupCents: refloat2CalculatedFloatTopupCents
      }

      let refloat3BaseRefill = refloat2RefillX10p + (refloat2FloatTopupCents / 10);

      it("should calculate diff properly", () => {
        let options = {
          selectedMachine: selectedMachine,
          lastMachineRefloat: lastMachineRefloat,
          refillX10p: refloat3BaseRefill,
          cashInX10p: refloat2CashInX10p,
          cashOutX10p: refloat2CashOutX10p
        };

        let result = machineRefloatCalculationFromReadings(options);

        let expectedFloatTopupPounds = 100;
        let expectedMoneyBankedPounds = 200;

        expect(result).toEqual({
          calculatedFloatTopupCents: expectedFloatTopupPounds * 100,
          calculatedMoneyBankedCents: expectedMoneyBankedPounds * 100,
          topupAndBankedCanEdit: true,
        })
      });
    });
  });
});
