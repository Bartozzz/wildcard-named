import wildcard from "../dist";
import assert from "assert";

describe("wildcard-param", () => {
  it("should match named parameters", () => {
    assert.deepStrictEqual(wildcard("1-2-3", "[digit:a]-[digit:b]-[digit:c]"), {
      a: "1",
      b: "2",
      c: "3",
    });

    assert.deepStrictEqual(wildcard("a:b", "[alpah:aa]:[alpah:bb]"), {
      aa: "a",
      bb: "b",
    });
  });

  it("should match unnamed parameters", () => {
    assert.deepStrictEqual(wildcard("1-2-3", "[digit:]-[digit:]-[digit:]"), {
      0: "1",
      1: "2",
      2: "3",
    });

    assert.deepStrictEqual(wildcard("a:b", "[alpah:]:[alpah:]"), {
      0: "a",
      1: "b",
    });
  });

  it("should return null when nothing matched", () => {
    assert.equal(null, wildcard("a-b-c", "[alpah:]"));
    assert.equal(null, wildcard("a-b-c", "[alpah:]-[alpah:]"));
    assert.equal(null, wildcard("a-b-c", "[lower:]-[lower:]-[upper:]"));
  });

  it("should add new filters", () => {
    wildcard.addFilter("testA", "regex");
    wildcard.addFilter("testB", "regex");

    assert.equal(true, wildcard.filters.has("testA"));
    assert.equal(true, wildcard.filters.has("testB"));
  });

  it("should match new filters", () => {
    wildcard.addFilter("testing1", "(.*?)");
    wildcard.addFilter("testing2", "([0-9])");

    assert.deepStrictEqual(wildcard("foo-1", "[testing1:a]-[testing2:b]"), {
      a: "foo",
      b: "1",
    });
  });
});
