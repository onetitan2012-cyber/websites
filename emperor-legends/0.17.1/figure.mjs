import { makeKneelingRig } from './qin-seating.mjs';
import { lathe, seam } from './scene-art.mjs';

export function makeFigures({ world, material, cloth, mesh, box, round, groupAt, handScale = 1, articulated = false }) {
  const skin = material(0xc59672);
  const hair = material(0x2c2928);
  const greyHair = material(0x4d4841);
  const dark = material(0x4a3430);
  const shoes = material(0x47362f, cloth);
  const bronze = material(0xa88457);
  const robeHem = articulated ? [[0.226, 0.39]] : [[0.261, 0], [0.289, 0.052], [0.235, 0.38]];
  const robe = lathe([...robeHem, [0.205, 0.49], [0.177, 0.59], [0.177, 0.66],
    [0.207, 0.80], [0.194, 0.866], [0.109, 0.923], [0.049, 0.94]]);
  const sash = lathe([[0.179, 0.824], [0.184, 0.832], [0.182, 0.873], [0.177, 0.883]]);
  const lapel = [[-0.110, 1.175, 0.104], [-0.061, 1.114, 0.158], [0.015, 1.047, 0.176],
    [0.084, 0.973, 0.153], [0.10, 0.887, 0.140]];
  const collarA = seam(lapel, 0.024);
  const stitching = seam(lapel.map(([x, y, z]) => [x + 0.010, y + 0.005, z + 0.020]), 0.0045);
  const collarB = seam([[0.108, 1.176, 0.104], [0.064, 1.135, 0.152], [-0.019, 1.079, 0.183]], 0.021);
  const fold = seam([[0.11, 0.820, 0.145], [0.14, 0.762, 0.158], [0.164, 0.68, 0.157]], 0.010);
  const sleeve = lathe([[0.077, -0.315], [0.092, -0.264], [0.094, -0.210], [0.079, -0.116], [0.064, -0.024], [0.067, 0.021]]);
  const cuff = lathe([[0.078, -0.316], [0.083, -0.303], [0.087, -0.291]]);
  const face = lathe([[0.018, -0.025], [0.071, -0.004], [0.111, 0.047], [0.136, 0.113],
    [0.140, 0.185], [0.124, 0.235], [0.077, 0.265], [0.001, 0.274]], 24);

  return function figure(scale, shade, trim, style) {
    const model = groupAt(world);
    model.scale.setScalar(scale);
    const torso = articulated ? groupAt(model) : null;
    const body = torso ? groupAt(torso, 0, -0.63, 0) : model;
    const mature = style === 'father' || style === 'ran';
    const woman = style === 'mother';
    const fabric = material(shade, cloth);
    const edge = material(trim, cloth);
    const lip = material(woman ? 0xba8e68 : 0x9b815e, cloth);
    mesh(body, robe, fabric, 0, 0.26, 0, true).scale.z = 0.90;
    mesh(body, sash, edge, 0, 0, 0).scale.z = 0.89;
    box(body, mature || woman ? bronze : edge, 0.019, 0.849, 0.161, 0.057, 0.033, 0.021);
    for (const geometry of [collarA, collarB, fold]) mesh(body, geometry, edge, 0, 0, 0);
    mesh(body, stitching, lip, 0, 0, 0);

    const head = groupAt(body, 0, 1.23, 0);
    round(body, skin, [0.058, 0.087, 0.055], 0, 1.199, 0);
    mesh(head, face, skin, 0, 0, 0.005, true).scale.z = 0.96;
    const hairColor = style === 'ran' ? greyHair : hair;
    round(head, hairColor, [0.145, 0.095, 0.137], 0, 0.222, -0.015);
    round(head, hairColor, [0.133, 0.115, 0.057], 0, 0.136, -0.11);
    round(head, hairColor, woman ? [0.084, 0.111, 0.070] : [0.065, 0.057, 0.057],
      0, woman ? 0.281 : 0.263, -0.10, true);
    if (woman) box(head, bronze, 0.014, 0.261, -0.119, 0.185, 0.011, 0.013).rotation.z = 0.18;
    if (mature) mesh(head, seam([[-0.113, 0.197, 0.108], [0, 0.214, 0.125], [0.113, 0.197, 0.108]], 0.010),
      edge, 0, 0, 0);
    for (const side of [-1, 1]) {
      const x = side * 0.053;
      round(head, skin, [0.018, 0.031, 0.018], side * 0.132, 0.099, 0.011);
      round(head, dark, [0.014, 0.0057, 0.006], x, 0.139, 0.127);
      round(head, hairColor, [0.019, 0.0045, 0.0048], x, 0.159, 0.130).rotation.z = side * 0.12;
    }
    round(head, skin, [0.018, 0.026, 0.024], 0, 0.117, 0.135);
    round(head, dark, [0.017, 0.0032, 0.0046], 0, 0.063, 0.126);
    if (style === 'ran') round(head, hairColor, [0.030, 0.027, 0.015], 0, 0.029, 0.116);

    const arms = [-1, 1].map(side => {
      const joint = groupAt(body, side * 0.177, 1.08, 0.016);
      joint.rotation.z = side * 0.27;
      const wide = woman ? 1.21 : mature ? 1.08 : 0.90;
      mesh(joint, sleeve, fabric, 0, 0, 0, true).scale.set(wide, 1, 0.93);
      mesh(joint, cuff, edge, 0, 0, 0).scale.set(wide, 1, 0.95);
      round(joint, skin, [0.042 * handScale, 0.060 * handScale, 0.044 * handScale], 0, -0.345, 0.018, true);
      return joint;
    });
    if (torso) return { model, head, arms, rig: makeKneelingRig(model, torso, fabric, shoes, mesh, round) };

    const feet = [-1, 1].map(side => {
      const foot = groupAt(model, side * 0.095, 0.34, 0);
      box(foot, fabric, 0, -0.132, 0, 0.105, 0.274, 0.111);
      round(foot, shoes, [0.060, 0.059, 0.121], 0, -0.27, 0.037);
      return foot;
    });
    return { model, head, arms, feet };
  };
}
