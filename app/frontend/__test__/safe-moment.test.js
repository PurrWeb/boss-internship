import safeMoment from "~/lib/safe-moment"

describe("safeMoment.parse()", () => {
  let defaultDateFormat = "DD-MM-YYYY";
  let dateInvalidMessage = (input) => {
    return `invalid date ${input} supplied`
  };
  let invalidDateFormatErrorMessage = () => {
    return "Must supply valid dateFormat"
  };

  describe("date is valid", () => {

    it("should parse correctly", () => {
      let input = '01-02-2018';
      expect(
        safeMoment.parse(input, defaultDateFormat).format(defaultDateFormat)
      ).toEqual(input)
    });
  });

  describe("date has whitespace at start", () => {
    it("should raise error", () => {
      let input = '    01-02-2018';
      expect(() => {
        safeMoment.parse(input, defaultDateFormat)
      }).toThrow(dateInvalidMessage(input))
    });
  });

  describe("date has whitespace at end", () => {
    it("should raise error", () => {
      let input = '01-02-2018      ';
      expect(() => {
        safeMoment.parse(input, defaultDateFormat)
      }).toThrow(dateInvalidMessage(input))
    });
  });

  describe("date is in different format", () => {
    it("should raise error", () => {
      let input = '2010-01-02';
      expect(() => {
        safeMoment.parse(input, defaultDateFormat)
      }).toThrow(dateInvalidMessage(input))
    });
  });

  describe("valid date is present in bad string", () => {
    it("should raise error", () => {
      let input = 'sdasaas asddsa  2010-01-02';
      expect(() => {
        safeMoment.parse(input, defaultDateFormat)
      }).toThrow(dateInvalidMessage(input))
    });
  });

  describe("only supply date", () => {
    it("should raise error", () => {
      let input = 'sdasaas asddsa  2010-01-02';
      expect(() => {
        safeMoment.parse(input)
      }).toThrow("Invalid arguments error: must supply input and dateFormat")
    });
  });

  describe("supply null dateFormat", () => {
    it("should raise error", () => {
      let input = 'sdasaas asddsa  2010-01-02';
      expect(() => {
        safeMoment.parse(input, null)
      }).toThrow(invalidDateFormatErrorMessage())
    });
  });

  describe("supply undefined dateFormat", () => {
    it("should raise error", () => {
      let input = 'sdasaas asddsa  2010-01-02';
      expect(() => {
        safeMoment.parse(input, undefined)
      }).toThrow(invalidDateFormatErrorMessage())
    });
  });
});
