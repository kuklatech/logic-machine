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
  Trait
} from './types'

export class LogicMachine {
  private firstPrinciples: FirstPrinciples = {}

  constructor(private rules: Rules) {}

  run(outputScheme: OutputScheme, firstPrinciples: FirstPrinciples): Output {
    this.firstPrinciples = firstPrinciples
    const results: Output = {}

    for (const neededOutput in outputScheme) {
      const resultType: OutputValueType = outputScheme[neededOutput]
      const traits = this.rules.traits.filter(
        (trait) => trait.name === neededOutput
      )

      for (const trait of traits) {
        const result = this.castReturnedValue(
          this.calculateOutputForTrait(trait),
          resultType
        )

        const isResultFalseButNoOtherValueStoredYet =
          result === false && !results[neededOutput]

        if (isResultFalseButNoOtherValueStoredYet) {
          results[neededOutput] = result
        }

        if (result !== false) {
          results[neededOutput] = result
        }
      }
    }

    return results
  }

  private calculateOutputForTrait(trait: Trait): OutputValue {
    const results: boolean[] = []
    let i = 0
    for (const condition of trait.conditions) {
      const result = this.calculateCondition(condition)
      results.push(result)
    }

    return this.calculateOutputForLogicalSentence(trait, results)
  }

  private calculateOutputForLogicalSentence(trait: Trait, results: boolean[]) {
    if (trait.logicOperator === LogicOperator.AND) {
      if (results.every((result) => result)) {
        return trait.value
      }
    } else {
      if (results.some((result) => result)) {
        return trait.value
      }
    }

    return false
  }

  private castReturnedValue(value: any, resultType: OutputValueType) {
    if (resultType === 'string') {
      return value as string
    } else if (resultType === 'number') {
      return value as number
    } else if (resultType === 'boolean') {
      if (value === true || value === false) {
        return value
      }
      if (value.toLowerCase() === 'true') {
        return true
      }
      return false
    }

    const leftover: never = resultType
    throw new Error(
      `We don't support this resultType just yet. resultType=${resultType}`
    )
  }

  private calculateCondition(condition: Condition) {
    if (this.isSolved(condition)) {
      const value = this.getFirstPricinpleValue(condition)

      return this.solveConditionFor(condition, value)
    } else {
      const trait = this.findTraitByCondition(condition)

      if (!trait) {
        console.debug("Condition we're trying to solve:", condition)
        throw new Error(
          "We couldn't solve it, because there are information missing!"
        )
      }

      const value = this.calculateOutputForTrait(trait) as AttributeValue
      this.firstPrinciples[condition.attribute] = value

      const result = this.calculateCondition(condition)
      return result
    }
  }

  private solveConditionFor(
    condition: Condition,
    value: AttributeValue
  ): boolean {
    switch (condition.relation) {
      case Relation.EQUAL:
        return this.isEqual(condition, value)
      case Relation.NOT_EQUAL:
        const result = !this.isEqual(condition, value)
        return result
      case Relation.IN:
        const conditionValues = (condition.value as string).split(',')
        return conditionValues.includes(value as string)
      default:
        // const leftover: never = condition.relation
        throw new Error("We don't support this condition")
    }
  }

  private isEqual(condition: Condition, value: string | number) {
    if (this.isBoolean(condition.value)) {
      const result =
        this.castReturnedValue(condition.value, 'boolean') ===
        this.castReturnedValue(value, 'boolean')
      return result
    }

    const result = condition.value === value
    return result
  }

  private isBoolean(value: any): boolean {
    if (value === true || value === false) {
      return true
    }

    const clearedValue = value.toLowerCase().trim()

    return ['true', 'false'].includes(clearedValue)
  }

  private isSolved(condition: Condition): boolean {
    const attributeName = condition.attribute
    // Note: it may contain false, so we must check if the value exists, not if it's false
    return this.firstPrinciples[attributeName] !== undefined
  }

  private getFirstPricinpleValue(condition) {
    const attributeName = condition.attribute
    return this.firstPrinciples[attributeName]
  }

  private findTraitByCondition(condition: Condition): Trait {
    const isComplexAttribute = this.isComplexAttribute(condition.attribute)

    if (isComplexAttribute) {
      const [attributeName, attributeResult] = condition.attribute.split(':')

      const trait = this.rules.traits.find((trait) => {
        return trait.name === attributeName && trait.value === attributeResult
      })

      if (!trait) {
        throw new Error('Not rules available for this attribute!')
      }

      return trait
    } else {
      const trait = this.rules.traits.find(
        (traitItem) => traitItem.name === condition.attribute
      )

      if (!trait) {
        throw new Error('Not rules available for this attribute!')
      }

      return trait
    }
  }

  private isComplexAttribute(attributeName: string): boolean {
    const parts = attributeName.split(':')
    return parts.length === 2
  }
}
