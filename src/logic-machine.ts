import {
  AttributeValue,
  Condition,
  FirstPrinciples,
  LogicOperator,
  Rules,
  Relation,
  Treat,
} from "./rules";

export type OutputValueType = "string" | "boolean" | "number";

export type OutputScheme = {
  [key: string]: OutputValueType;
};

export type OutputValue = string | boolean | number;

export type Output = {
  [key: string]: OutputValue;
};

export class LogicMachine {
  private firstPrinciples: FirstPrinciples;

  constructor(private rules: Rules) {}

  run(outputScheme: OutputScheme, firstPrinciples: FirstPrinciples): Output {
    this.firstPrinciples = firstPrinciples;
    const results: Output = {};

    for (const neededOutput in outputScheme) {
      const resultType: OutputValueType = outputScheme[neededOutput];
      const treats = this.rules.treats.filter(
        (treat) => treat.name === neededOutput
      );

      console.log("treats :>>", treats);

      for (const treat of treats) {
        console.log("treat :>>", treat);
        const result = this.castReturnedValue(
          this.calculateOutputForTreat(treat),
          resultType
        );

        const isResultFalseButNoOtherValueStoredYet =
          result === false && !results[neededOutput];

        if (isResultFalseButNoOtherValueStoredYet) {
          results[neededOutput] = result;
        }

        if (result !== false) {
          results[neededOutput] = result;
        }
      }
    }

    return results;
  }

  private calculateOutputForTreat(treat: Treat): OutputValue {
    const results: boolean[] = [];
    for (const condition of treat.conditions) {
      console.log("\ncondition :>>", condition);
      const calculatedCondition = this.calculateCondition(condition);
      console.log("condition.relation :>>", condition.relation);
      console.log("condition.value :>>", condition.value);

      console.log("calculatedCondition :>>", calculatedCondition);
      results.push(calculatedCondition);
    }

    return this.calculateOutputForLogicalSentence(treat, results);
  }

  private calculateOutputForLogicalSentence(treat: Treat, results: boolean[]) {
    if (treat.logicOperator === LogicOperator.AND) {
      if (results.every((result) => result)) {
        return treat.value;
      }
    } else {
      if (results.some((result) => result)) {
        return treat.value;
      }
    }

    return false;
  }

  private castReturnedValue(value: any, resultType: OutputValueType) {
    if (resultType === "string") {
      return value as string;
    } else if (resultType === "number") {
      return value as number;
    } else if (resultType === "boolean") {
      if (value.toLowerCase() === "true") {
        return true;
      }
      return false;
    }

    const leftover: never = resultType;
    throw new Error(
      `We don't support this resultType just yet. resultType=${resultType}`
    );
  }

  private calculateCondition(condition: Condition) {
    if (this.isFirstPrinciple(condition)) {
      const value = this.getFirstPricinpleValue(condition);
      console.log("value (simple) :>>", value);

      return this.solveConditionFor(condition, value);
    } else {
      const treat = this.findTreatByCondition(condition);

      if (!treat) {
        console.debug("Condition we're trying to solve:", condition);
        throw new Error(
          "We couldn't solve it, because there are information missing!"
        );
      }

      const value = this.calculateOutputForTreat(treat) as AttributeValue;
      this.firstPrinciples[condition.attribute] = value;
      console.log("this.firstPrinciples :>>", this.firstPrinciples);
      console.log("condition (complex):>>", condition);
      console.log("value (complex) :>>", value);
      // const result = this.solveConditionFor(condition, value);

      const result = this.calculateCondition(condition);
      return result;
    }
  }

  private solveConditionFor(
    condition: Condition,
    value: AttributeValue
  ): boolean {
    console.log("condition.attribute :>>", condition.attribute);
    console.log("condition.value :>>", condition.value);
    console.log("condition.relation :>>", condition.relation);
    console.log("value (solveConditionFor) :>>", value);

    switch (condition.relation) {
      case Relation.EQUAL:
        return this.isEqual(condition, value);
      case Relation.NOT_EQUAL:
        const result = !this.isEqual(condition, value);
        console.log("result (NOT_EQUAL) :>>", result);
        return result;
      case Relation.IN:
        const conditionValues = (condition.value as string).split(",");
        return conditionValues.includes(value as string);
      default:
        // const leftover: never = condition.relation
        throw new Error("We don't support this condition");
    }
  }

  private isEqual(condition: Condition, value: string | number) {
    if (this.isBooleanLikeValue(condition.value)) {
      const result =
        this.castReturnedValue(condition.value, "boolean") ===
        this.castReturnedValue(value, "boolean");
      console.log("result (casted to boolean) :>>", result);
      return result;
    }

    const result = condition.value === value;
    console.log("result (string comparison) :>>", result);
    return result;
  }

  private isBooleanLikeValue(value: any): boolean {
    const clearedValue = value.toLowerCase().trim();

    return ["true", "false"].includes(clearedValue);
  }

  private isFirstPrinciple(condition: Condition): boolean {
    const attributeName = condition.attribute;

    return !!this.firstPrinciples[attributeName];
  }

  private getFirstPricinpleValue(condition) {
    const attributeName = condition.attribute;
    return this.firstPrinciples[attributeName];
  }

  private findTreatByCondition(condition: Condition): Treat {
    const isComplexAttribute = this.isComplexAttribute(condition.attribute);

    if (isComplexAttribute) {
      const [attributeName, attributeResult] = condition.attribute.split(":");

      const treat = this.rules.treats.find((treat) => {
        return treat.name === attributeName && treat.value === attributeResult;
      });

      return treat;
    } else {
      const treat = this.rules.treats.find(
        (treat) => treat.name === condition.attribute
      );

      return treat;
    }
  }

  private isComplexAttribute(attributeName: string): boolean {
    const parts = attributeName.split(":");
    return parts.length === 2;
  }
}
