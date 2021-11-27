import {LogicOperator, Relation, Rules} from "../types";

export const impositionRules: Rules = {
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
      name: "downloadBulkMode",
      value: "productionFiles",
      logicOperator: LogicOperator.AND,
      conditions: [
        {
          attribute: "vendor",
          relation: Relation.EQUAL,
          value: "alt",
        },
        {
          attribute: "size",
          relation: Relation.NOT_IN,
          value: "F23,F33"
        }
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
    {
      name: "vendor",
      value: "fallback",
      logicOperator: LogicOperator.AND,
      conditions: []
    },
    {
      name: "vendor",
      value: "alt",
      logicOperator: LogicOperator.OR,
      conditions: [
        {
          attribute: "qty",
          relation: Relation.GREATER_OR_EQUAL,
          value: 10000
        },
        {
          attribute: "color",
          relation: Relation.EQUAL,
          value: "fullcolor"
        }
      ]
    },
    {
      name: "vendor",
      value: "second",
      logicOperator: LogicOperator.AND,
      conditions: [
        {
          attribute: "qty",
          relation: Relation.LESS,
          value: 10000
        },
      ]
    }
  ],
};
