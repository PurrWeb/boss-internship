jest.dontMock("../utils");

describe("utils", function() {
    it("Knows that 'hello' starts with 'h'", function() {
        var utils = require("../utils").default;
        expect(utils.stringStartsWith("hello", "h")).toBe(true);
    });
});