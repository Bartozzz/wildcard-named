import wildcard, {
  filters,
  addFilter,
  getNamedProps,
  getValidRegex,
} from "../dist";
import assert from "assert";

describe("wildcard-named", () => {
  it("should match named parameters", () => {
    assert.deepStrictEqual(wildcard("1-2-3", "[digit:a]-[digit:b]-[digit:c]"), {
      a: "1",
      b: "2",
      c: "3",
    });

    assert.deepStrictEqual(wildcard("a:b", "[alpah:x]:[alpah:y]"), {
      x: "a",
      y: "b",
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

  it("should return undefined when nothing matched", () => {
    assert.equal(undefined, wildcard("a-b-c", "[alpah:]"));
    assert.equal(undefined, wildcard("a-b-c", "[alpah:]-[alpah:]"));
    assert.equal(undefined, wildcard("a-b-c", "[lower:]-[lower:]-[upper:]"));
  });

  describe("getValidRegex", () => {
    it("should generate valid regular expression for a given pattern", () => {
      assert.equal(
        "/^([0-9]+)-([0-9]+)$/g",
        getValidRegex("[digit:a]-[digit:b]").toString()
      );

      assert.equal(
        "/^([0-9]+)-([0-9]+)$/g",
        getValidRegex("[digit:]-[digit:]").toString()
      );

      assert.equal(
        "/^([a-z]+)-([a-z]+)-([A-Z]+)$/g",
        getValidRegex("[lower:]-[lower:a]-[upper:]").toString()
      );
    });
  });

  describe("getNamedProps", () => {
    it("should return named props when all wildcards are named", () => {
      assert.deepStrictEqual(getNamedProps("[x:a]"), ["a"]);
      assert.deepStrictEqual(getNamedProps("[x:a]-[x:b]"), ["a", "b"]);
    });

    it("should return numeric props when all wildcards are unnamed", () => {
      assert.deepStrictEqual(getNamedProps("[x:]"), ["0"]);
      assert.deepStrictEqual(getNamedProps("[x:]-[x:]"), ["0", "1"]);
    });

    it("should return mixed props when some wildcards are unnamed", () => {
      assert.deepStrictEqual(getNamedProps("[x:]-[x:a]"), ["0", "a"]);
      assert.deepStrictEqual(getNamedProps("[x:a]-[x:]"), ["a", "0"]);
    });
  });

  describe("addFilter", () => {
    it("should add new filters", () => {
      addFilter("testA", "regex");
      addFilter("testB", "regex");

      assert.equal(true, filters.has("testA"));
      assert.equal(true, filters.has("testB"));
    });

    it("should match new filters", () => {
      addFilter("testing1", "(.*?)");
      addFilter("testing2", "([0-9])");

      assert.deepStrictEqual(wildcard("foo-1", "[testing1:a]-[testing2:b]"), {
        a: "foo",
        b: "1",
      });
    });
  });

  describe("filters", () => {
    it("digit", () => {
      assert.deepStrictEqual(wildcard("123:456", "[digit:]:[digit:]"), {
        0: "123",
        1: "456",
      });
    });

    it("alnum", () => {
      assert.deepStrictEqual(wildcard("1aA:2bB", "[alnum:]:[alnum:]"), {
        0: "1aA",
        1: "2bB",
      });
    });

    it("alpah", () => {
      assert.deepStrictEqual(wildcard("abc:ABC", "[alpah:]:[alpah:]"), {
        0: "abc",
        1: "ABC",
      });
    });

    it("xdigit", () => {
      assert.deepStrictEqual(wildcard("1f3:4b3", "[xdigit:]:[xdigit:]"), {
        0: "1f3",
        1: "4b3",
      });
    });

    it("punct", () => {
      assert.deepStrictEqual(wildcard("!#%&'()*,-./:;?@[]_‘{}", "[punct:]"), {
        0: "!#%&'()*,-./:;?@[]_‘{}",
      });
    });

    it("print", () => {
      assert.deepStrictEqual(wildcard("abc:+-=", "[print:]:[print:]"), {
        0: "abc",
        1: "+-=",
      });
    });

    it("upper", () => {
      assert.deepStrictEqual(
        wildcard("ABCDEFGHIJKLMNOPQRSTUVWXYZ", "[upper:]"),
        {
          0: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        }
      );
    });

    it("lower", () => {
      assert.deepStrictEqual(
        wildcard("abcdefghijklmnopqrstuvwxyz", "[lower:]"),
        {
          0: "abcdefghijklmnopqrstuvwxyz",
        }
      );
    });

    it("all", () => {
      assert.deepStrictEqual(wildcard("asdF!#$%@1234ERWDFQFADSA", "[all:]"), {
        0: "asdF!#$%@1234ERWDFQFADSA",
      });
    });
  });
});
