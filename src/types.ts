export enum Relation {
  EQUAL = "=",
  NOT_EQUAL = "!=",
  IN = "IN",
  NOT_IN = "NOT IN",
  GREATER = ">",
  GREATER_OR_EQUAL = ">=",
  LESS = "<",
  LESS_OR_EQUAL = "<=",
}

export enum LogicOperator {
  AND = "AND",
  OR = "OR",
}

export type AttributeValue = string | number;

export type Condition = {
  attribute: string;
  relation: Relation;
  value: AttributeValue;
};

export type List = {
  name: string;
  values: AttributeValue[];
  logicOperator: LogicOperator;
  conditions: Condition[];
};

export type Treat = {
  name: string;
  value: AttributeValue;
  logicOperator: LogicOperator;
  conditions: Condition[];
};

export type Rules = {
  lists: List[];
  treats: Treat[];
};

export type FirstPrinciples = {
  [key: string]: AttributeValue;
};
