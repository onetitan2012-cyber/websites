import { ROAD_GOAL, CROWN_HITS, PETITION_TARGET, SIZE, RETURN_CELLS, QI_GOAL, QI_GRAIN_START } from './board.mjs';

const PREVIOUS_KEY = 'emperor-legends:qin-campaign:0.17.1:v1';
export const CHECKPOINT_KEY = 'emperor-legends:qin-campaign:0.21.0:v1';
const version = 1;
const firstChoices = {
  c1: ['wait_route', 'family_route'],
  c2: ['born_here', 'father_qin'],
  c3: ['trust_ran', 'own_route'],
  g1: ['assisted', 'clear'],
  g2: ['assisted', 'clear'],
};
const qinChoices = { q1: ['father', 'mother'], q2: ['child', 'mother'], q3: ['carry', 'leave'] };
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const text = value => typeof value === 'string';
const boolean = value => typeof value === 'boolean';
const range = (value, min, max) => Number.isInteger(value) && value >= min && value <= max;
const items = (value, count, accept) => Array.isArray(value) && value.length === count && value.every(accept);
const numbers = (value, count, min, max) => items(value, count, item => range(item, min, max));
const choicesValid = (journey, choices) => Object.entries(choices).every(([name, options]) => options.includes(journey[name]));

const resultChecks = [
  { keys: ['defer', 'send', 'hold'],
    fields: r => range(r.collected, 0, ROAD_GOAL) && range(r.gateHits, 0, 3) && strings(r.charges) },
  { keys: ['delayed', 'mother', 'clerk'],
    fields: r => numbers(r.marks, 2, 0, CROWN_HITS) && strings(r.charges) },
  { keys: ['recall', 'dispatch'],
    fields: r => boolean(r.assisted) && [undefined,true].includes(r.sawField) && [undefined,true].includes(r.sawMarket) && range(r.firstReview, 0, 1) && numbers(r.evidence, 2, 0, PETITION_TARGET) },
  { keys: ['notice', 'keeper'],
    fields: r => range(r.firstCargo, 0, 1) && numbers(r.cargo, 2, -1, SIZE - 1) },
  { keys: ['open', 'record'],
    fields: r => boolean(r.assisted) && [undefined,true].includes(r.sawTablet) && items(r.found, RETURN_CELLS.length, boolean) },
  { keys: ['keep', 'record'],
    fields: r => boolean(r.assisted) && range(r.firstHall, 0, 1) && numbers(r.progress, 2, 0, 2) && [undefined, null, 'self', 'scribe'].includes(r.folio) && [null, "lead", "share"].includes(r.priority) },
  { keys: ['shelter', 'list'],
    fields: r => boolean(r.assisted) && range(r.water, 0, 20) },
  { keys: ['reserve', 'list'],
    fields: r => boolean(r.assisted) && [undefined, true].includes(r.counted) && object(r.swift) && boolean(r.swift.assisted) &&
      range(r.swift.grain, 0, 8) && numbers(r.stock, 2, 0, 8) && range(r.batches, 0, 2) },
  { keys: ['origin', 'companions'],
    fields: r => boolean(r.assisted) && [undefined,true].includes(r.sentReply) && items(r.bound, 2, boolean) },
  { keys: ['count', 'announce'],
    fields: r => boolean(r.assisted) && range(r.entries, 0, QI_GOAL) && range(r.grain, 0, QI_GRAIN_START) },
];

function strings(value) {
  return Array.isArray(value) && value.every(text);
}

function validChapter(chapter, index) {
  if (!object(chapter) || !Array.isArray(chapter.logs) || !chapter.logs.length ||
    !chapter.logs.every(entry => object(entry) && text(entry.speaker) && text(entry.line))) return false;
  if (index === 1) return range(chapter.closingLogStart, 0, chapter.logs.length - 1);
  const check = resultChecks[index - 2];
  if (!check) return true;
  const result = chapter.result;
  return object(result) && check.keys.includes(result.key) && range(result.moves, 0, 5) && check.fields(result);
}

function validChuFold(fold) {
  if (!object(fold) || !object(fold.swift) || !range(fold.swift.grain, 0, 8)
      || fold.swift.assisted !== (fold.swift.grain < 8) || !Array.isArray(fold.logs)
      || !fold.logs.every(entry => object(entry) && text(entry.speaker) && text(entry.line))) return false;
  if (['return', 'counted', 'board'].includes(fold.at)) return true;
  if (!['shore', 'lamp'].includes(fold.at) || !object(fold.load)) return false;
  const { stock, batches, moves, assisted } = fold.load;
  return numbers(stock, 2, 0, 8) && batches === Math.floor(Math.min(...stock) / 4)
    && range(moves, 0, 5) && assisted === (batches < 2) && (!assisted || moves === 0)
    && (fold.at !== 'lamp' || ['reserve','list'].includes(fold.order));
}

const canalStages = ['entry', 'planted', 'court'];

function validCanalSample(value) {
  if (!object(value)) return false;
  if (value.canalAt !== undefined) return canalStages.includes(value.canalAt) && !value.fifth && !value.sixth;
  return validChapter(value.fifth, 4) && (value.sixth === undefined || validChapter(value.sixth, 5));
}

function validCheckpoint(value) {
  if (!object(value) || !object(value.journey) || !Array.isArray(value.chapters) ||
    !range(value.chapters.length, 1, 13)) return false;
  return choicesValid(value.journey, firstChoices) &&
    (value.chapters.length === 1 || choicesValid(value.journey, qinChoices)) &&
    value.chapters.every(validChapter) &&
    (value.canalAt === undefined || value.chapters.length >= 4 && canalStages.includes(value.canalAt) && !value.chuFold) &&
    (value.chuFold === undefined || value.chapters.length >= 9 && validChuFold(value.chuFold)) &&
    (!value.chapters[10]?.result?.sentReply || value.chapters[6]?.result?.sawTablet === true);
}

export function openCheckpointStore(getStorage, sample = false) {
  const key = sample === 'canal' ? CHECKPOINT_KEY + ':canal-sample' : sample ? CHECKPOINT_KEY + ':chu-sample' : CHECKPOINT_KEY;
  const accepts = sample === 'canal' ? validCanalSample : sample ? value => object(value) && validChuFold(value.chuFold) : validCheckpoint;
  let storage;
  let raw = null;
  let initial = null;
  let status = 'empty';
  try {
    storage = getStorage();
    raw = storage.getItem(key);
  } catch {
    storage = null;
    status = 'unavailable';
  }
  if (raw !== null) {
    try {
      const { version: savedVersion, ...value } = JSON.parse(raw);
      if (savedVersion === version && accepts(value)) initial = value;
    } catch {
      // A malformed record can be replaced at the next actual chapter completion.
    }
    status = initial ? 'ready' : 'invalid';
  }

  function replace(next) {
    if (!storage) return 'unavailable';
    try {
      if (storage.getItem(key) !== raw) return 'conflict';
      if (next === null) storage.removeItem(key);
      else storage.setItem(key, next);
      raw = next;
      return 'saved';
    } catch {
      return 'unavailable';
    }
  }

  return {
    initial, status,
    previous() {
      if (!storage || raw !== null) return null;
      try {
        const {version: schema, ...old} = JSON.parse(storage.getItem(PREVIOUS_KEY));
        return schema === version && validCheckpoint(old) ? old : null;
      } catch { return null; }
    },
    save(value) {
      if (!accepts(value)) return 'invalid';
      return replace(JSON.stringify({ version, ...value }));
    },
    clear() { return replace(null); },
  };
}
