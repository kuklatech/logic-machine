import { LogicOperator, Relation, Rules } from "../types";

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
