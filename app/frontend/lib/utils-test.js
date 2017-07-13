import expect from "expect"
import utils from "./utils"

describe("utils.stringStartsWith", function() {
    it("Knows that 'hello' starts with 'h'", function() {
        expect(utils.stringStartsWith("hello", "h")).toBe(true);
    });
});

describe("utils.dateIsValid", function() {
    it("Knows that `new Date()` is valid", function() {
        expect(utils.dateIsValid(new Date())).toBe(true);
    });
    it("Knows that `new Date('a')` is invalid", function() {
        expect(utils.dateIsValid(new Date("a"))).toBe(false);
    });
});

describe("utils.round", function(){
    it("Rounds 1.456 with two decimals as 1.46", function(){
        expect(utils.round(1.456, 2)).toEqual(1.46);
    })
})

describe("utils.generateQuickMenuAlias", function() {
    it("Create alias from 'Rota' as 'Ro'", function() {
      expect(utils.generateQuickMenuAlias('Rota').toEqual('Ro'));
    });
    it("Create alias from 'Security Rota' as 'Sr'", function() {
      expect(utils.generateQuickMenuAlias('Security Rota').toEqual('Sr'));
    });
});

describe("quickMenuFilter", function() {
    var quickMenu = [
      {
        items: [
          {description: "Rota"},
          {description: "Security Rota"},
          {description: "Change Orders"},
        ]
      },
      {
        items: [
          {description: "Hours Confirmation"},
          {description: "Holidays"},
          {description: "Add Staff Member"},
        ]
      },
      {
        items: [
          {description: "Dayly Report"},
          {description: "Weekly Report"},
          {description: "Payroll Reports"},
        ]
      },
    ];

    var exQuickMenuOneWord = [
      {
        items: [
          {description: "Rota"},
          {description: "Security Rota"},
        ]
      },
    ]

    it("Filtering quick menu", function() {
      expect(utils.quickMenuFilter('Rota', quickMenu).toEqual(exQuickMenuOneWord));
    });
});
