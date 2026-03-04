import { shuffleSwapRows, type SwapRow } from "../src/utils/shuffleSwap.js";

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

function createSeededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (1664525 * state + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function runLockPreservationTest() {
  const input: SwapRow[] = [
    { left: "A", right: "B", locked: true },
    { left: "C", right: "D", locked: false },
  ];
  const result = shuffleSwapRows(input, true, () => 0.1);

  assert(result[0].left === "A" && result[0].right === "B", "Locked row must not change.");
  assert(result[1].left === "D" && result[1].right === "C", "Unlocked row should swap when random < 0.5.");
}

function runEmptySwapGuardTest() {
  const input: SwapRow[] = [
    { left: "A", right: "", locked: false },
    { left: "", right: "B", locked: false },
  ];

  const guarded = shuffleSwapRows(input, false, () => 0.1);
  assert(guarded[0].left === "A" && guarded[0].right === "", "Empty pair must remain when allowEmptySwap=false.");
  assert(guarded[1].left === "" && guarded[1].right === "B", "Empty pair must remain when allowEmptySwap=false.");

  const allowed = shuffleSwapRows(input, true, () => 0.1);
  assert(allowed[0].left === "" && allowed[0].right === "A", "Empty pair can swap when allowEmptySwap=true.");
  assert(allowed[1].left === "B" && allowed[1].right === "", "Empty pair can swap when allowEmptySwap=true.");
}

function runFairnessDistributionTest() {
  const scenarios = [
    { label: "seed=50091", seed: 50091, iterations: 100000 },
    { label: "seed=1337", seed: 1337, iterations: 100000 },
    { label: "seed=20260304", seed: 20260304, iterations: 100000 },
  ];

  const lines: string[] = [];

  scenarios.forEach((scenario) => {
    const random = createSeededRandom(scenario.seed);
    let swapped = 0;

    for (let i = 0; i < scenario.iterations; i += 1) {
      const [result] = shuffleSwapRows([{ left: "L", right: "R", locked: false }], true, random);
      if (result.left === "R") {
        swapped += 1;
      }
    }

    const ratio = swapped / scenario.iterations;
    assert(
      ratio > 0.49 && ratio < 0.51,
      `Swap ratio should stay near 50% (${scenario.label}). got=${ratio.toFixed(4)}`
    );
    lines.push(`${scenario.label}: ${swapped}/${scenario.iterations} (${(ratio * 100).toFixed(2)}%)`);
  });

  console.log("shuffle fairness report");
  lines.forEach((line) => console.log(`- ${line}`));
}

export function runShuffleSwapTests() {
  runLockPreservationTest();
  runEmptySwapGuardTest();
  runFairnessDistributionTest();
  console.log("shuffleSwap tests passed");
}
