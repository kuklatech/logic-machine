import {impositionRules} from "./logic-machine.data";
import {Nomnoml, Uml} from "../nomnoml";

const nomnoml = require ('nomnoml')


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


impositionRules.treats

describe("UML", () => {
  it("should generate nomnoml format", () => {
    const uml = new Uml(impositionRules, new Nomnoml())

    const rulesForExport = uml.generateRulesForExport()
    expect(rulesForExport.join("\n")).toMatchInlineSnapshot(`
"[isForImposition] -> [isForImposition = TRUE]
[downloadBulkMode:impositionOnlyPrintWithDieline] -> [downloadBulkMode:impositionOnlyPrintWithDieline != impositionOnlyPrintWithDieline]
[downloadBulkMode = impositionOnlyPrintWithDieline] -> [downloadBulkMode:impositionOnlyPrintWithDieline != impositionOnlyPrintWithDieline]
[AND e67c8] -> [downloadBulkMode = impositionFiles]
[isForImposition = TRUE] -> [AND e67c8]
[downloadBulkMode:impositionOnlyPrintWithDieline != impositionOnlyPrintWithDieline] -> [AND e67c8]
[vendor] -> [vendor = alt]
[color] -> [color = fullcolor]
[isForImposition] -> [isForImposition = TRUE]
[AND 38c73] -> [downloadBulkMode = impositionOnlyPrintWithDieline]
[vendor = alt] -> [AND 38c73]
[color = fullcolor] -> [AND 38c73]
[isForImposition = TRUE] -> [AND 38c73]
[vendor] -> [vendor = alt]
[size] -> [size NOT IN F23,F33]
[AND 2026b] -> [downloadBulkMode = productionFiles]
[vendor = alt] -> [AND 2026b]
[size NOT IN F23,F33] -> [AND 2026b]
[vendor] -> [vendor = alt]
[size] -> [size IN F23,F33]
[AND a155d] -> [isForImposition = TRUE]
[vendor = alt] -> [AND a155d]
[size IN F23,F33] -> [AND a155d]
[AND d41d8] -> [vendor = fallback]
[qty] -> [qty >= 10000]
[color] -> [color = fullcolor]
[qty >= 10000] -> [vendor = alt]
[color = fullcolor] -> [vendor = alt]
[qty] -> [qty < 10000]
[qty < 10000] -> [vendor = second]"
`)
  })
})
