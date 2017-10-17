import oFetch from 'o-fetch'
import machineRefloatCalculation from "~/lib/machine-refloat-calculation"

describe("machineRefloatCalculation()", () => {
  describe("when machine starts with no topup", () => {
    // £400
    let initialFloatCents = 40000
    // £200
    let initialRefillX10pReading = 2000;
    // £400
    let initialCashInX10pReading = 4000;
    // £200
    let initialCashOutX10pReading = 2000;
    let initialFloatTopupCents = 0;

    let selectedMachine = {
      floatCents: initialFloatCents,
      initialFloatTopupCents: initialFloatTopupCents,
      refillX10pReading: initialRefillX10pReading,
      cashInX10pReading: initialCashInX10pReading,
      cashOutX10pReading: initialCashOutX10pReading
    };
    let lastMachineRefloat = null;

    describe("no refill reading given", () => {
      let options = {
        selectedMachine: selectedMachine,
        lastMachineRefloat: lastMachineRefloat,
        refillX10pReading: null,
        cashInX10pReading: initialCashInX10pReading,
        cashOutX10pReading: initialCashOutX10pReading
      };
      it("should give null and not allow editing", () => {

        let result = machineRefloatCalculation(options);
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
        refillX10pReading: initialRefillX10pReading,
        cashInX10pReading: null,
        cashOutX10pReading: initialCashOutX10pReading
      };
      it("should give null and not allow editing", () => {

        let result = machineRefloatCalculation(options);
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
        refillX10pReading: initialRefillX10pReading,
        cashInX10pReading: initialCashInX10pReading,
        cashOutX10pReading: null
      };
      it("should give null and not allow editing", () => {

        let result = machineRefloatCalculation(options);
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
        refillX10pReading: initialRefillX10pReading,
        cashInX10pReading: initialCashInX10pReading,
        cashOutX10pReading: initialCashOutX10pReading
      };
      it("should give zero readings", () => {

        let result = machineRefloatCalculation(options);
        expect(result).toEqual({
          calculatedFloatTopupCents: 0,
          calculatedMoneyBankedCents: 0,
          topupAndBankedCanEdit: true,
        })
      });
    });

    describe("when readings have changed", () => {
      // £300 (+£100)
      let newRefillReading = initialRefillX10pReading + 1000;
      // £600 (+£200)
      let newCashOutReading = initialCashOutX10pReading  + 2000;
      // £1000 (+£600)
      let newCashInReading = initialCashInX10pReading + 6000;

      let options = {
        selectedMachine: selectedMachine,
        lastMachineRefloat: lastMachineRefloat,
        refillX10pReading: newRefillReading,
        cashInX10pReading: newCashInReading,
        cashOutX10pReading: newCashOutReading
      };

      it("should give correct amounts", () => {
        let result = machineRefloatCalculation(options);

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
    let initialRefillX10pReading = 2000;
    // £400
    let initialCashInX10pReading = 4000;
    // £200
    let initialCashOutX10pReading = 2000;
    // £200
    let initialFloatTopupCents = 2000;

    let selectedMachine = {
      floatCents: initialFloatCents,
      initialFloatTopupCents: initialFloatTopupCents,
      refillX10pReading: initialRefillX10pReading,
      cashInX10pReading: initialCashInX10pReading,
      cashOutX10pReading: initialCashOutX10pReading
    };
    let lastMachineRefloat = null;

    it('should add topup to the refloat', () => {
      let options = {
        selectedMachine: selectedMachine,
        lastMachineRefloat: lastMachineRefloat,
        refillX10pReading: initialRefillX10pReading,
        cashInX10pReading: initialCashInX10pReading,
        cashOutX10pReading: initialCashOutX10pReading
      };

      let result = machineRefloatCalculation(options);

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
    let initialRefillX10pReading = 2000;
    // £400
    let initialCashInX10pReading = 4000;
    // £200
    let initialCashOutX10pReading = 2000;
    let initialFloatTopupCents = 0;

    let selectedMachine = {
      floatCents: initialFloatCents,
      initialFloatTopupCents: initialFloatTopupCents,
      refillX10pReading: initialRefillX10pReading,
      cashInX10pReading: initialCashInX10pReading,
      cashOutX10pReading: initialCashOutX10pReading
    };

    describe('after reading where nothing changed', () => {
      let lastMachineRefloat = {
        refillX10pReading: initialRefillX10pReading,
        cashInX10pReading: initialCashInX10pReading,
        cashOutX10pReading: initialCashOutX10pReading,
        moneyBankedCents: 0,
        calculatedMoneyBankedCents: 0,
        floatTopupCents: 0,
        calculatedFloatTopupCents: 0
      };

      it("should still remain the same", () => {
        let options = {
          selectedMachine: selectedMachine,
          lastMachineRefloat: lastMachineRefloat,
          refillX10pReading: initialRefillX10pReading,
          cashInX10pReading: initialCashInX10pReading,
          cashOutX10pReading: initialCashOutX10pReading
        };

        let result = machineRefloatCalculation(options);

        expect(result).toEqual({
          calculatedFloatTopupCents: 0,
          calculatedMoneyBankedCents: 0,
          topupAndBankedCanEdit: true,
        })
      });
    });

    describe('multiple readings with strange stuff', () => {
      // £400 (+£200)
      let refloat1RefillX10pReading = initialRefillX10pReading + 2000;
      // £1000 (+£600)
      let refloat1CashInX10pReading = initialCashInX10pReading + 6000;
      // £500 (+£300)
      let refloat1CashOutX10pReading = initialCashOutX10pReading + 3000;
      // £100
      let refloat1FloatTopupCents = 10000;
      // £400
      let refloat1MoneyBankedCents = 40000;
      let refloat1CalculatedValues = machineRefloatCalculation({
        selectedMachine: selectedMachine,
        lastMachineRefloat: null,
        refillX10pReading: refloat1RefillX10pReading,
        cashInX10pReading: refloat1CashInX10pReading,
        cashOutX10pReading: refloat1CashOutX10pReading
      });
      let refloat1CalculatedMoneyBankedCents = oFetch(refloat1CalculatedValues, 'calculatedMoneyBankedCents');
      let refloat1CalculatedFloatTopupCents = oFetch(refloat1CalculatedValues, 'calculatedFloatTopupCents');
      let refloat1 = {
        refillX10pReading: refloat1RefillX10pReading,
        cashInX10pReading: refloat1CashInX10pReading,
        cashOutX10pReading: refloat1CashOutX10pReading,
        moneyBankedCents: refloat1MoneyBankedCents,
        calculatedMoneyBankedCents: refloat1CalculatedMoneyBankedCents,
        floatTopupCents: refloat1FloatTopupCents,
        calculatedFloatTopupCents: refloat1CalculatedFloatTopupCents
      }

      // £500 (+£100)
      let refloat2BaseRefillReading = refloat1RefillX10pReading + (refloat1FloatTopupCents / 10);
      // £800 (+£300)
      let refloat2RefillX10pReading = refloat2BaseRefillReading + 3000;
      // £2000 (+£1000)
      let refloat2CashInX10pReading = refloat1.cashInX10pReading + 10000;
      // £1000 (+£500)
      let refloat2CashOutX10pReading = refloat1.cashOutX10pReading + 5000;
      // £100 (-100)
      let refloat2FloatTopupCents = 10000;
      // £500 (-£200)
      let refloat2MoneyBankedCents = 50000;
      let refloat2CalculatedValues = machineRefloatCalculation({
        selectedMachine: selectedMachine,
        lastMachineRefloat: refloat1,
        refillX10pReading: refloat2RefillX10pReading,
        cashInX10pReading: refloat2CashInX10pReading,
        cashOutX10pReading: refloat2CashOutX10pReading
      });
      let refloat2CalculatedMoneyBankedCents = oFetch(refloat2CalculatedValues, 'calculatedMoneyBankedCents');
      let refloat2CalculatedFloatTopupCents = oFetch(refloat2CalculatedValues, 'calculatedFloatTopupCents');

      let lastMachineRefloat = {
        refillX10pReading: refloat2RefillX10pReading,
        cashInX10pReading: refloat2CashInX10pReading,
        cashOutX10pReading: refloat2CashOutX10pReading,
        moneyBankedCents: refloat2MoneyBankedCents,
        calculatedMoneyBankedCents: refloat2CalculatedMoneyBankedCents,
        floatTopupCents: refloat2FloatTopupCents,
        calculatedFloatTopupCents: refloat2CalculatedFloatTopupCents
      }

      let refloat3BaseRefillReading = refloat2RefillX10pReading + (refloat2FloatTopupCents / 10);

      it("should calculate diff properly", () => {
        let options = {
          selectedMachine: selectedMachine,
          lastMachineRefloat: lastMachineRefloat,
          refillX10pReading: refloat3BaseRefillReading,
          cashInX10pReading: refloat2CashInX10pReading,
          cashOutX10pReading: refloat2CashOutX10pReading
        };

        let result = machineRefloatCalculation(options);

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
