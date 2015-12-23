import expect from "expect"
import utils from "./utils"

describe("utils", function() {
    it("Knows that 'hello' starts with 'h'", function() {
        expect(utils.stringStartsWith("hello", "h")).toBe(true);
    });
});