// Run: npm run check
import assert from "node:assert/strict";
import { parse, score, handName, equity } from "./poker.ts";

const h = (s: string) => s.split(" ").map(parse);
const name = (s: string) => handName(score(h(s)));

assert.equal(name("As Ks Qs Js Ts 2d 3c"), "Straight flush");
assert.equal(name("Ah 2d 3c 4s 5h 9d Kc"), "Straight");
assert.equal(name("Ah 2h 3h 4h 5h 9d Kc"), "Straight flush"); // steel wheel
assert.equal(name("Qd Qc Qh Qs 4d 2c 9h"), "Quads");
assert.equal(name("Jc Jd Js 3h 3c 3d 2h"), "Full house"); // two trips
assert.equal(name("2h 7h 9h Jh Kh Ad Ac"), "Flush");
assert.equal(name("Ah Ad Kc Kd Qs Qh 2c"), "Two pair");
assert.equal(name("2c 5d 9h Jc Ks 3d 7s"), "High card");
assert.ok(score(h("Ah Ad Kc 7d 2s 3h 9c")) > score(h("Kh Kd Ac 7d 2s 3h 9c")), "AA beats KK");
assert.ok(score(h("As Ks Qs Js Ts")) > score(h("Kd Qd Jd Td 9d")), "royal beats K-high SF");
assert.equal(score(h("Ah Kd 7c 4s 2h 9d 8c")), score(h("Ac Kh 7d 4c 2d 9s 8h")), "same ranks tie");

const e = equity(h("As Ah"), h("Kd Kc"), h("2s 7h 9c"));
assert.ok(e > 0.85 && e < 0.95, `AA vs KK on dry flop ≈ 0.91, got ${e}`);
assert.equal(equity(h("As Ah"), h("Kd Kc"), h("2s 7h 9c Jd 3h")), 1);
console.log("poker: all checks pass");
