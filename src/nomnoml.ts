const rulesText =
  "[vendor:alt]->[<choice>size:F23 OR size:F33]\n" +
  "[<start>start]->[<choice>vendor:alt]\n" +
  "[size:F23 OR size:F33] Y -> [<state>precut]\n" +
  "[size:F23 OR size:F33] N -> [<state>not a precut]\n" +
  "[precut] -> [<state>production files]\n" +
  "[not a precut] -> [<choice>self-imposition]\n" +
  "[self-imposition] Y -> [<state>production files]\n" +
  "[self-imposition] N -> [<choice>vendor:alt AND color:fullcolor]\n" +
  "[vendor:alt AND color:fullcolor] Y -> [<state>imposition production_with_dieline]\n" +
  "[vendor:alt AND color:fullcolor] N -> [<state>all imposition files]";

const nomnoml = require("nomnoml");

const parsedRules = nomnoml.parse(rulesText);

console.log("parsedRules :>>", parsedRules.root);

//
// const rules = rulesText.split("\n");
//
// const isChoice = (node: string): boolean => node.includes("<choice>");
// const isState = (node: string): boolean => node.includes("<state>");
//
// const parseRule = (rule: string) => {
//     const phrases = rule.split('->').map(phrase => phrase.trim())
//     const startNode =
// }
//
// rules.forEach((rule) => console.log("rule :>>", rule));
