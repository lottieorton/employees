import { dropdownOptions, isSearchField } from "./SearchQuery";

describe("SearchQuery", () => {
  describe("isSearchField", () => {
    it("Should return true for all valid search fields", () => {
      dropdownOptions.forEach((option) => {
        expect(isSearchField(option.value)).toBe(true);
      });
    });

    it("Should return false for invalid strings", () => {
      const invalidFields = [
        "department",
        "age",
        "randomString",
        "First Name",
        "",
        " ",
      ];

      invalidFields.forEach((field) => {
        expect(isSearchField(field)).toBe(false);
      });
    });
  });

  describe("dropdownOptions", () => {
    it("Should contain the correct number of options", () => {
      expect(dropdownOptions.length).toBe(5);
    });

    it("Should have the default 'search' option as the first item", () => {
      expect(dropdownOptions[0]).toEqual({
        value: "search",
        text: "Search by...",
      });
    });
  });
});
