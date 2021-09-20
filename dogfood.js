/**
 * Calculates dog food order for next month based on number of each
 * size dog and amount of dog food remaining at the shelter.
 *
 * Makes the following assumptions which can be overridden with 'options':
 *  - Small dogs require 10 lbs per month
 *  - Medium dogs require 20 lbs per month
 *  - Large dogs require 30 lbs per month
 *  - Maximum number of dogs total is 30
 *  - Order increased by 20% over needs for current dogs in shelter
 *
 * @param {number} nSmallDogs - # small dogs currently in shelter
 * @param {number} nMediumDogs - # medium dogs currently in shelter
 * @param {number} nLargeDogs - # large dogs currently in shelter
 * @param {number} lbsLeftover - # lbs leftover food
 *
 * @param {object} [options] - May contain:
 *  @property {number} [lbsPerMonthSmall=10] - # lbs small dog eats per month, min 5
 *  @property {number} [lbsPerMonthMedium=20] - # lbs medium dog eats per month, min 10
 *  @property {number} [lbsPerMonthLarge=30] - # lbs large dog eats per month, min 15
 *  @property {number} [maxDogs=30] - max # dogs shelter can hold
 *  @property {number} [pctOverOrder=20] - % order is increased over current needs
 *
 * @return Number of lbs to order for next month
 */


const nextOrder = (
    nSmallDogs,
    nMediumDogs,
    nLargeDogs,
    lbsLeftover,
    options = {},
) => {
    const {
        lbsPerMonthSmall = 10,
        lbsPerMonthMedium = 20,
        lbsPerMonthLarge = 30,
        maxDogs = 30,
        pctOverOrder = 20,
    } = options;

    // Validate argument presence
    const validateArgPresence = (name, arg) => {
        if (arg === undefined) {
            throw new Error(`'${ name }' must be provided`);
        }
    };
    validateArgPresence("nSmallDogs", nSmallDogs);
    validateArgPresence("nMediumDogs", nMediumDogs);
    validateArgPresence("nLargeDogs", nLargeDogs);
    validateArgPresence("lbsLeftover", lbsLeftover);

    // Validate maximum dog count
    if (!Number.isInteger(maxDogs)) {
        throw new Error("'maxDogs' must be an integer");
    }
    if (maxDogs <= 0) {
        throw new Error("'maxDogs' must be > 0");
    }

    // Validate dog counts by size
    const validateNumDogs = (name, num) => {
        if (!Number.isInteger(num)) {
            throw new Error(`'${ name }' must be an integer`);
        }
        if (num < 0 || num > maxDogs) {
            throw new Error(`'${ name }' must be between 0 and ${ maxDogs }`);
        }
    };
    validateNumDogs("nSmallDogs", nSmallDogs);
    validateNumDogs("nMediumDogs", nMediumDogs);
    validateNumDogs("nLargeDogs", nLargeDogs);

    if (nSmallDogs + nMediumDogs + nLargeDogs > maxDogs) {
        throw new Error(`Total # dogs exceeds max of ${ maxDogs }`);
    }

    // Validate food - Enforce min monthly consumption:
    // small dogs to be 5 lbs, medium 10, and large 15
    const validateLbsFood = (name, lbs, min = 0) => {
        if (lbs < min) {
            throw new Error(`'${ name }' must be >= ${ min }`);
        }
    };
    validateLbsFood("lbsPerMonthSmall", lbsPerMonthSmall, 5);
    validateLbsFood("lbsPerMonthMedium", lbsPerMonthMedium, 10);
    validateLbsFood("lbsPerMonthLarge", lbsPerMonthLarge, 15);
    validateLbsFood("lbsLeftover", lbsLeftover);

    // Validate overorder percentage
    const validatePct = (name, pct) => {
        if (!Number.isInteger(pct)) {
            throw new Error(`'${ name }' must be an integer`);
        }
        if (pct < 0 || pct > 100) {
            throw new Error(`'${ name }' must be between 0 and 100`);
        }
    };
    validatePct("pctOverOrder", pctOverOrder);

    // Calculate order
    const monthly = (nSmallDogs * lbsPerMonthSmall) +
        (nMediumDogs * lbsPerMonthMedium) +
        (nLargeDogs * lbsPerMonthLarge);
    const need = monthly - lbsLeftover;
    if (need <= 0) {
        return 0;
    }
    const order = need * ((100 + pctOverOrder) / 100);

    // To nearest tenth
    return Math.round(order * 10) / 10;
};

module.exports = nextOrder;
