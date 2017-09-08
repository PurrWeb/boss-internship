import utils from "~/lib/utils"

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
      expect(utils.generateQuickMenuAlias('Rota')).toBe('Ro');
    });
    it("Create alias from 'Security Rota' as 'Sr'", function() {
      expect(utils.generateQuickMenuAlias('Security Rota')).toBe('Sr');
    });
});

describe("quickMenuFilter", function() {
    var quickMenu = [
      {
        name: "Venue",
        items: [
          {description: "Rota"},
          {description: "Security Rota"},
          {description: "Change Orders"},
        ]
      },
      {
        name: "Staff Members",
        items: [
          {description: "Hours Confirmation"},
          {description: "Holidays"},
          {description: "Add Staff Member"},
        ]
      },
      {
        name: "Reports",
        items: [
          {description: "Daily Report"},
          {description: "Weekly Report"},
          {description: "Payroll Report"},
        ]
      },
    ];

    var exQuickMenuOneWord = [
      {
        name: "Venue",
        color: undefined,
        items: [
          {
            description: "Rota",
          },
          {
            description: "Security Rota",
          },
        ]
      },
    ];

    var exQuickMenuTwoWord = [
      {
        name: "Venue",
        color: undefined,
        items: [
          {
            description: "Security Rota",
          },
        ]
      },
    ];

    var exQuickMenuHighlighted = [
      {
        name: "Venue",
        color: undefined,
        highlightedName: "Venue",
        items: [
          {
            description: "Rota",
            highlightedDescription: '<strong style="background-color:#FF9">Rota</strong>'
          },
          {
            description: "Security Rota",
            highlightedDescription: 'Security <strong style="background-color:#FF9">Rota</strong>'
          },
        ]
      },
    ]
    it("Filtering quick menu (one word)", function() {
      expect(utils.quickMenuFilter('Rota', quickMenu)).toEqual(exQuickMenuOneWord);
    });

    it("Filtering quick menu (two words)", function() {
      expect(utils.quickMenuFilter('SeCu rO', quickMenu)).toEqual(exQuickMenuTwoWord);
    });

    it("Filter quick menu highlighted results", function() {
      expect(utils.quickMenuHighlightResults(exQuickMenuOneWord, 'Rota')).toEqual(exQuickMenuHighlighted);
    });
});
