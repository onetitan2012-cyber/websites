import { makeKneelingRig } from './qin-seating.mjs';

const wardrobe = {
  king: { robe: 0x394342, edge: 0x823e37, silk: 0xb27452, belt: 0x413432, sleeve: 1.06, skin: 0xc69b78 },
  official: { robe: 0x576974, edge: 0x9b826b, silk: 0xbaa689, belt: 0x474340, sleeve: 0.86, skin: 0xb58a69 },
  lisi: { robe: 0x626b48, edge: 0x7c5340, silk: 0xb59261, belt: 0x51413a, sleeve: 1.10, skin: 0xbe906b },
  mother: { robe: 0x81584f, edge: 0x493a40, silk: 0xc89163, belt: 0x5b3f3a, sleeve: 1.25, skin: 0xcba382 },
  keeper: { robe: 0x827052, edge: 0x565b4d, silk: 0xa99771, belt: 0x504336, sleeve: 0.94, skin: 0xbb8f6f },
  resident: { robe: 0x6d7773, edge: 0x7b5847, silk: 0x938268, belt: 0x494741, sleeve: 0.90, skin: 0xbe9276 },
  yan: { robe: 0x56677d, edge: 0x785758, silk: 0xbe9871, belt: 0x4d4149, sleeve: 1.18, skin: 0xc49776 },
  guest: { robe: 0x786454, edge: 0x4f5451, silk: 0xa29276, belt: 0x483d36, sleeve: 0.94, skin: 0xb78b6c },
  li: { robe: 0x50636f, edge: 0x855748, silk: 0xaf8867, belt: 0x463a36, sleeve: 0.88, skin: 0xb98d6b },
  wang: { robe: 0x6a715b, edge: 0x6b564d, silk: 0xbe9c78, belt: 0x504537, sleeve: 1.08, skin: 0xc19a78 },
};

export function makeCrownFigure(world, art, role, scale) {
  const { groupAt, material, cloth, box, round, mesh, profile, thread } = art;
  const palette = wardrobe[role];
  const fabric = material(palette.robe, cloth);
  const edge = material(palette.edge, cloth, 0.64);
  const silk = material(palette.silk, cloth, 0.61);
  const belt = material(palette.belt, cloth);
  const skin = material(palette.skin, null, 0.75);
  const shade = material(0x65493b);
  const hair = material(role === 'wang' ? 0x4b4a47 : 0x282728, null, 0.62);
  const hairLight = material(role === 'wang' ? 0x655d59 : 0x3a3030);
  const leather = material(0x352c2a);
  const metal = material(0xa88658, null, 0.44, 0.34);
  const model = groupAt(world);
  model.name = role;
  model.scale.setScalar(scale);
  const torso = groupAt(model);
  const body = groupAt(torso, 0, -0.63, 0);
  const coat = profile(body, fabric, [[0.227, 0.62], [0.226, 0.69], [0.200, 0.77],
    [0.178, 0.84], [0.182, 0.91], [0.207, 1.01], [0.207, 1.056], [0.177, 1.104],
    [0.104, 1.148], [0.067, 1.164]], 0, 0, 0, true, 32);
  coat.scale.z = 0.83;
  const waist = profile(body, belt, [[0.181, 0.811], [0.182, 0.844], [0.184, 0.861]]);
  waist.scale.z = 0.89;
  box(body, metal, 0.017, 0.836, 0.171, 0.058, 0.035, 0.022);
  const hem = profile(body, edge, [[0.226, 0.62], [0.228, 0.634], [0.229, 0.654]]);
  hem.scale.z = 0.84;

  const upperFold = [[-0.115, 1.135, 0.103], [-0.035, 1.068, 0.170], [0.046, 0.997, 0.168],
    [0.101, 0.925, 0.132], [0.113, 0.866, 0.117]];
  thread(body, edge, upperFold, 0.027);
  thread(body, silk, upperFold.map(([x, y, z]) => [x + 0.010, y + 0.008, z + 0.025]), 0.006);
  thread(body, edge, [[0.104, 1.138, 0.096], [0.057, 1.100, 0.142], [-0.017, 1.050, 0.173]], 0.023);
  thread(body, edge, [[0.11, 0.82, 0.124], [0.13, 0.74, 0.153], [0.18, 0.65, 0.120]], 0.012);
  profile(body, skin, [[0.055, 1.14], [0.063, 1.20], [0.057, 1.238]]);

  const head = groupAt(body, 0, 1.205, 0.006);
  const face = profile(head, skin, [[0.016, 0.001], [0.069, 0.016], [0.102, 0.051],
    [0.121, 0.087], [0.132, 0.133], [0.132, 0.176], [0.133, 0.224],
    [0.113, 0.268], [0.071, 0.295], [0.001, 0.304]], 0, 0, 0.007, true, 28);
  face.scale.z = 0.86;
  round(head, hair, [0.137, 0.089, 0.119], 0, 0.238, -0.011);
  round(head, hair, [0.121, 0.117, 0.057], 0, 0.173, -0.078);
  for (const side of [-1, 1]) {
    round(head, skin, [0.021, 0.037, 0.018], side * 0.126, 0.122, 0.005);
    round(head, hair, [0.020, 0.056, 0.016], side * 0.116, 0.176, -0.019);
    round(head, shade, [0.018, 0.006, 0.0055], side * 0.053, 0.151, 0.110);
    const brow = round(head, hair, [0.023, 0.005, 0.0045], side * 0.053, 0.170, 0.111);
    brow.rotation.z = side * 0.11;
  }
  round(head, skin, [0.018, 0.036, 0.026], 0, 0.128, 0.117);
  round(head, shade, [0.022, 0.004, 0.005], 0, 0.074, 0.108);
  if (role === 'lisi' || role === 'keeper' || role === 'guest' || role === 'wang') {
    round(head, hair, [0.039, 0.006, 0.010], 0, 0.088, 0.109);
    round(head, hair, [0.023, 0.025, 0.015], 0, 0.043, 0.097);
  }

  if (role === 'king') {
    const crown = profile(head, hair, [[0.121, 0.241], [0.137, 0.252], [0.137, 0.282],
      [0.118, 0.319], [0.103, 0.368], [0.068, 0.394], [0.004, 0.399]], 0, 0, -0.024, true);
    crown.scale.z = 1.15;
    const binding = profile(head, edge, [[0.138, 0.25], [0.139, 0.259], [0.137, 0.273]], 0, 0, -0.023);
    binding.scale.z = 1.15;
    thread(head, silk, [[-0.035, 0.264, 0.126], [0, 0.268, 0.136], [0.035, 0.264, 0.126]], 0.006);
  } else if (role === 'mother' || role === 'resident') {
    round(head, hair, [0.106, 0.099, 0.071], 0, 0.304, -0.088, true).rotation.x = -0.3;
    round(head, hairLight, [0.065, 0.062, 0.047], 0.008, 0.342, -0.090);
    box(head, metal, 0, 0.323, -0.102, 0.24, 0.015, 0.015).rotation.z = 0.08;
    for (const side of [-1, 1]) round(head, metal, [0.010, 0.019, 0.011], side * 0.137, 0.092, 0.006);
  } else {
    profile(head, hair, [[0.122, 0.221], [0.134, 0.232], [0.130, 0.263], [0.097, 0.282]], 0, 0, -0.015);
    round(head, edge, [0.064, 0.057, 0.060], 0, 0.278, -0.078);
  }

  const arms = [-1, 1].map(side => {
    const joint = groupAt(body, side * 0.189, 1.045, 0.001);
    const width = palette.sleeve;
    const sleeve = profile(joint, fabric, [[0.080 * width, -0.315], [0.095 * width, -0.28],
      [0.099 * width, -0.225], [0.088 * width, -0.151], [0.069, -0.046], [0.063, 0.026]], 0, 0, 0, true);
    sleeve.scale.z = 0.87;
    const cuff = profile(joint, edge, [[0.081 * width, -0.320], [0.085 * width, -0.305], [0.092 * width, -0.279]]);
    cuff.scale.z = 0.89;
    const cuffLine = profile(joint, silk, [[0.087 * width, -0.304], [0.089 * width, -0.294]]);
    cuffLine.scale.z = 0.89;
    round(joint, skin, [0.040, 0.061, 0.034], 0, -0.349, 0.014, true);
    return joint;
  });

  return { model, head, arms, rig: makeKneelingRig(model, torso, fabric, leather, mesh, round) };
}
