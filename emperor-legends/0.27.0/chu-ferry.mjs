import { makeCrownFigure } from './crown-figures.mjs';

// A narrow channel with two separate landings. All passengers share the boat transform.
export function makeChuFerry(parent, art) {
  const { box, groupAt, material, wood, earth, cloth, round, thread } = art;
  const shore = groupAt(parent, 0, 0, 0);
  const river = material(0x638a86);
  const reflection = material(0x95aaa0);
  const mud = material(0x968467, earth);
  const grass = material(0x848453, cloth);
  const timber = material(0x795642, wood);
  const plankWood = material(0xb08a60, wood);
  box(shore, river, 0, -0.16, 0, 20, 0.25, 22);
  for (const side of [-1, 1]) {
    box(shore, mud, side * 6.4, -0.07, 0, 7, 0.63, 22);
    for (let i = 0; i < 28; i++) {
      const stem = box(shore, grass, side * (2.97 + (i % 4) * 0.12), 0.41,
        -6 + (i % 14) * 0.27 + (i >= 14 ? 8 : 0), 0.035, 0.58 + (i % 3) * 0.12, 0.042);
      stem.rotation.z = side * 0.17;
    }
    box(shore, timber, side * 2.95, 0.36, -0.53, 0.11, 0.82, 0.11, true);
  }
  const stone = material(0x807d6d, earth);
  const fibre = material(0x988466, cloth);
  for (const side of [-1, 1]) {
    for (let i = 0; i < 26; i++) {
      const z = -6.2 + i * 0.48;
      if (Math.abs(z) < 1.18) continue;
      round(shore, i % 3 === 0 ? stone : mud, [0.29 + i % 4 * 0.08, 0.20, 0.37],
        side * (2.96 + 0.09 * Math.sin(i)), 0.04, z);
    }
  }
  // The stone approach and mooring rope mark the old landing on the home bank.
  for (let i = 0; i < 5; i++) {
    box(shore, stone, -3.18 - i * 0.29, 0.255 + i * 0.012, 0.47, 0.28, 0.08, 0.73, true);
  }
  for (let i = 0; i < 3; i++) {
    box(shore, timber, -3.37 - i * 0.48, 0.63, -1.54, 0.08, 0.81, 0.08, true);
    if (i < 2) thread(shore, fibre, [[-3.37 - i * 0.48,0.90,-1.54],[-3.61 - i * 0.48,0.72,-1.54],[-3.85 - i * 0.48,0.9,-1.54]],0.019);
  }
  for (let i = 0; i < 21; i++) {
    box(shore, reflection, ((i * 17) % 21 - 10) * 0.24, -0.029, -6 + i * 0.55, 0.3 + i % 3 * 0.18, 0.009, 0.026);
  }
  const boat = groupAt(shore, -1.91, 0.02, 0);
  for (let i = -3; i <= 3; i++) {
    box(boat, plankWood, i * 0.15, 0.12, 0, 0.145, 0.15, 2.55 - Math.abs(i) * 0.105, true);
  }
  for (const side of [-1, 1]) {
    box(boat, timber, side * 0.55, 0.23, 0, 0.10, 0.28, 2.05, true);
    for (const end of [-1, 1]) {
      const tip = box(boat, timber, side * 0.29, 0.25, end * 1.2, 0.1, 0.30, 0.63, true);
      tip.rotation.y = -side * end * 0.95;
    }
  }
  const plank = box(boat, plankWood, -0.8, 0.28, 0.52, 1.08, 0.08, 0.38, true);
  const ferrier = makeCrownFigure(boat, art, 'resident', 0.94);
  ferrier.model.position.set(0, 0.21, -0.78);
  ferrier.arms[1].rotation.x = -0.6;
  const pole = box(boat, timber, 0.31, 0.92, -0.68, 0.045, 2.18, 0.045);
  pole.rotation.z = -0.23;
  const family = groupAt(shore, 0, 0, 0);
  const parentFigure = makeCrownFigure(family, art, 'keeper', 0.95);
  const child = makeCrownFigure(family, art, 'guest', 0.58);
  child.model.position.set(0.08, 0, 0.61);
  parentFigure.model.rotation.y = 1.18;
  child.model.rotation.y = -0.65;
  return {
    shore,
    pose(beat, travel) {
      const aboard = beat === 'crossing';
      boat.position.x = beat === 'landed' ? 1.91 : aboard ? -1.91 + 3.82 * travel : -1.91;
      family.position.set(aboard ? boat.position.x : beat === 'landed' ? 3.18 : -3.22, aboard ? 0.22 : 0.247, 0);
      plank.position.x = beat === 'landed' ? 0.87 : beat === 'plank' ? -0.87 : 0.32;
      plank.rotation.y = aboard || beat === 'bank' ? Math.PI / 2 : 0;
      ferrier.model.rotation.y = beat === 'landed' ? 1.2 : -0.9;
      pole.rotation.z = -0.23 + (aboard ? Math.sin(Math.PI * travel) * 0.33 : 0);
    },
  };
}
