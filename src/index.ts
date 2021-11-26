import { logicScheme } from "./logic-scheme";
import { LogicMachine, OutputScheme } from "./logic-machine";

// Note: `attribute` may have simple value, relates then to the treat
// or it can have complicated nature, looks like a condition, for example:
// `downloadBulkMode:impositionOnlyPrintWithDieline` which means that the treat called `downloadBulkMode`
// with a applicable value `impositionOnlyPrintWithDieline` is a part of the condition

const outputForImposition: OutputScheme = { isForImposition: "boolean" };
const outputDownloadBulkMode: OutputScheme = { downloadBulkMode: "string" };

const logicMachine = new LogicMachine(logicScheme);

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
//
// console.log("\nCASE 1: should be for imposition");
// const output1 = logicMachine.run(outputForImposition, fp_Alt_F23_Fullcolor);
// console.log("output1 :>>", output1);

// console.log("\nCASE 2: it's on a precut, not for imposition");
// const output2 = logicMachine.run(outputForImposition, fp_Alt_F52);
// console.log("output2 :>>", output2);
//
console.log("\nCASE 3: it should return `impositionOnlyPrintWithDieline`");
const output3 = logicMachine.run(outputDownloadBulkMode, fp_Alt_F23_Fullcolor);
console.log("output3 :>>", output3);
//
// console.log(
//   "\nCASE 4: it should throw because we haven't passed color attribute"
// );
// const output4 = logicMachine.run(outputDownloadBulkMode, fp_Alt_F52);
// console.log("output4 :>>", output4);

// console.log("\nCASE 5: downloadBulkMode should be `impositionFiles`");
// const output5 = logicMachine.run(outputDownloadBulkMode, fp_Alt_F23_Ecocolor);
// console.log("output5 :>>", output5);
