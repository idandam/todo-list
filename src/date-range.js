import Range from "./range.js";
/**
 * Represents a range of Dates without time
 */
export default class DateRange extends Range {
  constructor(from, to) {
    super(from, to);
    this.#validateRange(from, to);
  }
  /**
   * @inheritdoc
   * @override
   * @param {Date} date
   */
  includes(date) {
    if (!(date instanceof Date)) {
      throw new Error("Argument must be an instance of Date");
    }

    return super.includes(date);
  }

  /**
   * @inheritdoc
   * @override
   * @param {Date} from
   * @param {Date} to
   */
  #validateRange(from, to) {
    if (!(from instanceof Date && to instanceof Date)) {
      throw new Error("The date range sides must be an instance of Date");
    }
  }

  /**
   * @override
   */
  toString() {
    return `DateRange: ${super.toString()}`;
  }
}
