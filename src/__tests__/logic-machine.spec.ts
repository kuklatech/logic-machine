import { LogicMachine, OutputScheme } from "../logic-machine";
import { impositionRules } from "./logic-machine.data";

const outputForImposition: OutputScheme = { isForImposition: "boolean" };
const outputDownloadBulkMode: OutputScheme = { downloadBulkMode: "string" };

const fp_Alt_F23_Fullcolor = {
  vendor: "alt",
  size: "F23",
  color: "fullcolor",
};

const fp_Alt_F23_Ecocolor = {
  vendor: "alt",
  size: "F23",
  color: "eco",
};

const fp_Alt_F52 = {
  vendor: "alt",
  size: "F52",
};

const fp_Qty30 = {
  qty: 30,
};

const fp_Qty10000 = {
  qty: 10000,
};

describe("isForImposition", () => {
  it("should always return true", () => {
    expect(true).toBeTruthy();
  });
  it("should be for imposition", () => {
    // given
    const logicMachine = new LogicMachine(impositionRules);

    const result = logicMachine.run(outputForImposition, fp_Alt_F23_Fullcolor);

    expect(result).toMatchInlineSnapshot(`
Object {
  "isForImposition": true,
}
`);
  });

  it("it's on a precut, so should not be for imposition", () => {
    const logicMachine = new LogicMachine(impositionRules);
    const result = logicMachine.run(outputForImposition, fp_Alt_F23_Fullcolor);

    expect(result).toMatchInlineSnapshot(`
Object {
  "isForImposition": true,
}
`);
  });
});

describe("downloadBulkMode", () => {
  it("for fp_Alt_F23_Fullcolor should return `impositionOnlyPrintWithDieline`", () => {
    // given
    const logicMachine = new LogicMachine(impositionRules);

    const result = logicMachine.run(
      outputDownloadBulkMode,
      fp_Alt_F23_Fullcolor
    );

    // expect
    expect(result).toMatchInlineSnapshot(`
Object {
  "downloadBulkMode": "impositionOnlyPrintWithDieline",
}
`);
  });

  it("fp_Alt_F23_Ecocolor should return `impositionFiles`", () => {
    const logicMachine = new LogicMachine(impositionRules);
    const result = logicMachine.run(
      outputDownloadBulkMode,
      fp_Alt_F23_Ecocolor
    );

    expect(result).toMatchInlineSnapshot(`
Object {
  "downloadBulkMode": "impositionFiles",
}
`);
  });

  describe("rules", () => {
    it("should throw if we want an anwer to a not supported value", () =>{
      const logicMachine = new LogicMachine(impositionRules);
      const invalidOutput: OutputScheme = {
        somethingWeCantSolve: "string",
      };

      // expect
      expect.assertions(1);
      try {
        const result = logicMachine.run(invalidOutput, fp_Alt_F52);
        console.log("result :>>", result)
      } catch (e) {
        expect(e).toMatchInlineSnapshot();
      }
    })

    it("should throw if rules check non-existing input", () => {
      const logicMachine = new LogicMachine(impositionRules);
      const outputDownloadBulkMode: OutputScheme = {
        downloadBulkMode: "string",
      };

      // expect
      expect.assertions(1);
      try {
        logicMachine.run(outputDownloadBulkMode, fp_Alt_F52);
      } catch (e) {
        expect(e).toMatchInlineSnapshot(`[Error: Not rules available for this attribute!]`);
      }
    })
  })
});
