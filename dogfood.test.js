/**
 * Unit tests for dogfood.js
 */
const nextOrder = require("./dogfood");

describe("nextOrder", () => {
    describe("normal cases", () => {
        test("returns expected order for data in instructions", () => {
            expect(nextOrder(5, 3, 7, 17)).toEqual(363.6);
        });

        test("returns expected order for other data", () => {
            expect(nextOrder(7, 7, 7, 50)).toEqual(444);
        });
    });

    describe("edge cases", () => {
        test("returns 0 if we have no dogs", () => {
            expect(nextOrder(0, 0, 0, 0)).toEqual(0);
        });

        test("returns 0 if we have no dogs, but do have leftovers", () => {
            expect(nextOrder(0, 0, 0, 100)).toEqual(0);
        });

        test("returns 0 if we have dogs, but food needed < leftover", () => {
            expect(nextOrder(1, 1, 1, 100)).toEqual(0);
        });

        test("returns expected order for only small dogs", () => {
            expect(nextOrder(10, 0, 0, 0)).toEqual(120);
        });

        test("returns expected order for only medium dogs", () => {
            expect(nextOrder(0, 10, 0, 0)).toEqual(240);
        });

        test("returns expected order for only large dogs", () => {
            expect(nextOrder(0, 0, 10, 0)).toEqual(360);
        });

        test("returns expected order for max of only small dogs", () => {
            expect(nextOrder(30, 0, 0, 0)).toEqual(360);
        });

        test("returns expected order for max of only medium dogs", () => {
            expect(nextOrder(0, 30, 0, 0)).toEqual(720);
        });

        test("returns expected order for max of only large dogs", () => {
            expect(nextOrder(0, 0, 30, 0)).toEqual(1080);
        });

        test("returns expected order for max including all size dogs", () => {
            expect(nextOrder(10, 10, 10, 0)).toEqual(720);
        });

        test("adjusts for leftover food", () => {
            expect(nextOrder(10, 10, 10, 100)).toEqual(600);
        });

        test("can override default food consumption for small dogs", () => {
            expect(nextOrder(10, 10, 10, 0, {
                lbsPerMonthSmall: 15,
            })).toEqual(780);
        });

        test("can override default food consumption for all dogs", () => {
            expect(nextOrder(10, 10, 10, 0, {
                lbsPerMonthSmall: 15,
                lbsPerMonthMedium: 25,
                lbsPerMonthLarge: 35,
            })).toEqual(900);
        });

        test("can override overorder percentage", () => {
            expect(nextOrder(10, 10, 10, 0, {
                pctOverOrder: 25,
            })).toEqual(750);
        });
    });

    describe("error cases", () => {
        describe("arguments", () => {
            test("requires # small dogs", () => {
                expect(() => nextOrder())
                    .toThrow(new Error("'nSmallDogs' must be provided"));
            });

            test("requires # medium dogs", () => {
                expect(() => nextOrder(5))
                    .toThrow(new Error("'nMediumDogs' must be provided"));
            });

            test("requires # large dogs", () => {
                expect(() => nextOrder(5, 5))
                    .toThrow(new Error("'nLargeDogs' must be provided"));
            });

            test("requires lbs remaining", () => {
                expect(() => nextOrder(5, 5, 5))
                    .toThrow(new Error("'lbsLeftover' must be provided"));
            });
        });

        describe("max dog count", () => {
            test("throws if total dog count > overridden max # dogs", () => {
                expect(() => nextOrder(10, 10, 10, 0, {
                    maxDogs: 25,
                })).toThrow(new Error("Total # dogs exceeds max of 25"));
            });

            test("throws if max # dogs is negative", () => {
                expect(() => nextOrder(5, 5, 5, 0, {
                    maxDogs: -1,
                })).toThrow(new Error("'maxDogs' must be > 0"));
            });

            test("throws if max # dogs is zero", () => {
                expect(() => nextOrder(5, 5, 5, 0, {
                    maxDogs: 0,
                })).toThrow(new Error("'maxDogs' must be > 0"));
            });

            test("throws if max # dogs is not an integer", () => {
                expect(() => nextOrder(5, 5, 5, 0, {
                    maxDogs: 30.5,
                })).toThrow(new Error("'maxDogs' must be an integer"));
            });
        });

        describe("dog count", () => {
            test("throws if # small dogs is not an integer", () => {
                expect(() => nextOrder(10.5, 0, 0, 0))
                    .toThrow(new Error("'nSmallDogs' must be an integer"));
            });

            test("throws if # medium dogs is not an integer", () => {
                expect(() => nextOrder(0, 10.5, 0, 0))
                    .toThrow(new Error("'nMediumDogs' must be an integer"));
            });

            test("throws if # large dogs is not an integer", () => {
                expect(() => nextOrder(0, 0, 10.5, 0))
                    .toThrow(new Error("'nLargeDogs' must be an integer"));
            });

            test("throws if # small dogs is negative or too large", () => {
                expect(() => nextOrder(-1, 0, 0, 0))
                    .toThrow(new Error("'nSmallDogs' must be between 0 and 30"));
                expect(() => nextOrder(31, 0, 0, 0))
                    .toThrow(new Error("'nSmallDogs' must be between 0 and 30"));
            });

            test("throws if # medium dogs is negative or too large", () => {
                expect(() => nextOrder(0, -1, 0, 0))
                    .toThrow(new Error("'nMediumDogs' must be between 0 and 30"));
                expect(() => nextOrder(0, 31, 0, 0))
                    .toThrow(new Error("'nMediumDogs' must be between 0 and 30"));
            });

            test("throws if # large dogs is negative or too large", () => {
                expect(() => nextOrder(0, 0, -1, 0))
                    .toThrow(new Error("'nLargeDogs' must be between 0 and 30"));
                expect(() => nextOrder(0, 0, 31, 0))
                    .toThrow(new Error("'nLargeDogs' must be between 0 and 30"));
            });

            test("throws if total # dogs exceeds max # of dogs", () => {
                expect(() => nextOrder(10, 10, 11, 0))
                    .toThrow(new Error("Total # dogs exceeds max of 30"));
            });
        });

        describe("food", () => {
            test("throws if lbs of leftover food is negative", () => {
                expect(() => nextOrder(10, 10, 10, -1))
                    .toThrow(new Error("'lbsLeftover' must be >= 0"));
            });

            test("throws if lbs food per month for small dog < min", () => {
                expect(() => nextOrder(10, 10, 10, 0, {
                    lbsPerMonthSmall: 4,
                })).toThrow(new Error("'lbsPerMonthSmall' must be >= 5"));
            });

            test("throws if lbs food per month for medium dog < min", () => {
                expect(() => nextOrder(10, 10, 10, 0, {
                    lbsPerMonthMedium: 4,
                })).toThrow(new Error("'lbsPerMonthMedium' must be >= 10"));
            });

            test("throws if lbs food per month for large dog < min", () => {
                expect(() => nextOrder(10, 10, 10, 0, {
                    lbsPerMonthLarge: 4,
                })).toThrow(new Error("'lbsPerMonthLarge' must be >= 15"));
            });
        });

        describe("overorder percent", () => {
            test("throws if overorder percentage is not an integer", () => {
                expect(() => nextOrder(10, 10, 10, 0, {
                    pctOverOrder: 1.5,
                })).toThrow(new Error("'pctOverOrder' must be an integer"));
            });

            test("throws if overorder percentage is negative", () => {
                expect(() => nextOrder(10, 10, 10, 0, {
                    pctOverOrder: -1,
                })).toThrow(new Error("'pctOverOrder' must be between 0 and 100"));
            });

            test("throws if overorder percentage is > 100", () => {
                expect(() => nextOrder(10, 10, 10, 0, {
                    pctOverOrder: 101,
                })).toThrow(new Error("'pctOverOrder' must be between 0 and 100"));
            });
        });
    });
});
