import {
  AttributeValue,
  Condition,
  FirstPrinciples,
  LogicOperator,
  Output,
  OutputScheme,
  OutputValue,
  OutputValueType,
  Relation,
  Rules,
  Treat,
} from "./types";

export class LogicMachine {
  private firstPrinciples: FirstPrinciples = {};

  constructor(private rules: Rules) {}

  run(outputScheme: OutputScheme, firstPrinciples: FirstPrinciples): Output {
    this.firstPrinciples = firstPrinciples;
    const results: Output = {};

    for (const neededOutput in outputScheme) {
      const resultType: OutputValueType = outputScheme[neededOutput];
      const treats = this.rules.treats.filter(
        (treat) => treat.name === neededOutput
      );

      for (const treat of treats) {
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
    let i = 0;
    for (const condition of treat.conditions) {
      const result = this.calculateCondition(condition);
      results.push(result);
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
      if (value === true || value === false) {
        return value;
      }
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
    if (this.isSolved(condition)) {
      const value = this.getFirstPricinpleValue(condition);

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

      const result = this.calculateCondition(condition);
      return result;
    }
  }

  private solveConditionFor(
    condition: Condition,
    value: AttributeValue
  ): boolean {
    switch (condition.relation) {
      case Relation.EQUAL:
        return this.isEqual(condition, value);
      case Relation.NOT_EQUAL:
        const result = !this.isEqual(condition, value);
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
    if (this.isBoolean(condition.value)) {
      const result =
        this.castReturnedValue(condition.value, "boolean") ===
        this.castReturnedValue(value, "boolean");
      return result;
    }

    const result = condition.value === value;
    return result;
  }

  private isBoolean(value: any): boolean {
    if (value === true || value === false) {
      return true;
    }

    const clearedValue = value.toLowerCase().trim();

    return ["true", "false"].includes(clearedValue);
  }

  private isSolved(condition: Condition): boolean {
    const attributeName = condition.attribute;
    // Note: it may contain false, so we must check if the value exists, not if it's false
    return this.firstPrinciples[attributeName] !== undefined;
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

      if (!treat) {
        throw new Error("Not rules available for this attribute!");
      }

      return treat;
    } else {
      const treat = this.rules.treats.find(
        (treat) => treat.name === condition.attribute
      );

      if (!treat) {
        throw new Error("Not rules available for this attribute!");
      }

      return treat;
    }
  }

  private isComplexAttribute(attributeName: string): boolean {
    const parts = attributeName.split(":");
    return parts.length === 2;
  }
}
