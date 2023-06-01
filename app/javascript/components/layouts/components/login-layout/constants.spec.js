import * as constants from "./constants";

describe("layouts/components/<LoginLayout> - constants", () => {
  it("should have known constant", () => {
    const clonedConstants = { ...constants };

    ["NAME"].forEach(property => {
      expect(clonedConstants).toHaveProperty(property);
      delete clonedConstants[property];
    });

    expect(clonedConstants).not.toHaveProperty("NAME");
  });
});
