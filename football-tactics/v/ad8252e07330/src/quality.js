export const QUALITY_KEY='qg-football-graphics-v1';
export const QUALITY={standard:{label:'标准',pixelRatio:1.8,diceRatio:1.7,shadows:true,fps:60},low:{label:'轻量',pixelRatio:1,diceRatio:1,shadows:false,fps:30}};
export function chooseQuality({requested,saved,coarse=false,width=1280}={}){return QUALITY[requested]?requested:QUALITY[saved]?saved:coarse||width<850?'low':'standard';}
