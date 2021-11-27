import {LogicOperator, Rules} from "./types";
import {MD5} from "crypto-js";


export interface UmlGenerator {
  generateText(rules: Rules): string[]
  generateSvg(rules: Rules): string
}

export class Nomnoml implements UmlGenerator {
  public generateText(rules: Rules): string[] {
    const rulesText: string[] = []
    for (const treat of rules.treats) {
      const resultNode = `[${treat.name} = ${treat.value}]`
      const conditions: string[] = []

      for (const condition of treat.conditions) {
        const conditionText = `${condition.attribute} ${condition.relation} ${condition.value}`
        conditions.push(conditionText)

        const attributeRule = `[${condition.attribute}] -> [<choice>${conditionText}]`
        rulesText.push(attributeRule)

        const isComplexAttribute = condition.attribute.includes(':')

        if (isComplexAttribute) {
          // Note: We're adding another rule
          const simplifiedAttributeNode = `${condition.attribute.replace(':', " = ")}`
          const fullRule = `[${simplifiedAttributeNode}] -> [${conditionText}]`
          rulesText.push(fullRule)
        }
      }

      if (treat.logicOperator === LogicOperator.AND) {

        if (conditions.length === 1) {
          const fullRule = `[${conditions.pop()}] -> ${resultNode}`
          rulesText.push(fullRule)
        } else {
          const conditionNode = conditions.join(` ${treat.logicOperator} `)
          const hash = new String(MD5(conditionNode)).substring(0, 5)

          const fullRule = `[AND ${hash}] -> ${resultNode}`
          rulesText.push(fullRule)

          conditions.forEach(condition => {
            const fullRule = `[${condition}] -> [AND ${hash}]`
            rulesText.push(fullRule)
          })
        }

      } else {
        conditions.forEach(condition => {
          const fullRule = `[${condition}] -> ${resultNode}`
          rulesText.push(fullRule)
        })
      }

      // treat.conditions.forEach(condition => {
      //   const [simpleAttribute] = condition.attribute.split(":")
      //
      //   const fullRule = `[${simpleAttribute}] -> [${condition}]`
      //   rulesText.push(fullRule)
      // })
    }

    return rulesText
  }

  public generateSvg(rules: Rules): string {
    return ""
  }
}

export class Uml {
  constructor(private rules: Rules, private umlGenerator: UmlGenerator) {}

  public generateSvg() {
    const filePath = this.umlGenerator.generateSvg(this.rules)
    console.log("filePath :>>", filePath)
  }

  public generateRulesForExport() {
    return this.umlGenerator.generateText(this.rules)
  }
}
