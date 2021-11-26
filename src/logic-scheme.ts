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

export type LogicScheme = {
  lists: List[];
  treats: Treat[];
};

export type FirstPrinciples = {
  [key: string]: AttributeValue;
};

export const logicScheme: LogicScheme = {
  lists: [
    {
      name: "downloadBulkMode",
      values: [
        "impositionFiles",
        "impositionOnlyPrintWithDieline",
        "productionFiles",
      ],
      logicOperator: LogicOperator.AND,
      conditions: [],
    },
  ],
  treats: [
    {
      name: "downloadBulkMode",
      value: "impositionFiles",
      logicOperator: LogicOperator.AND,
      conditions: [
        {
          attribute: "isForImposition",
          relation: Relation.EQUAL,
          value: "TRUE",
        },
        {
          attribute: "downloadBulkMode:impositionOnlyPrintWithDieline",
          relation: Relation.NOT_EQUAL,
          value: "impositionOnlyPrintWithDieline",
        },
      ],
    },
    {
      name: "downloadBulkMode",
      value: "impositionOnlyPrintWithDieline",
      logicOperator: LogicOperator.AND,
      conditions: [
        {
          attribute: "vendor",
          relation: Relation.EQUAL,
          value: "alt",
        },
        {
          attribute: "color",
          relation: Relation.EQUAL,
          value: "fullcolor",
        },
        {
          attribute: "isForImposition",
          relation: Relation.EQUAL,
          value: "TRUE",
        },
      ],
    },
    {
      name: "isForImposition",
      value: "TRUE",
      logicOperator: LogicOperator.AND,
      conditions: [
        {
          attribute: "vendor",
          relation: Relation.EQUAL,
          value: "alt",
        },
        {
          attribute: "size",
          relation: Relation.IN,
          value: "F23,F33",
        },
      ],
    },
  ],
};
