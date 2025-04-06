fetch("https://api.github.com/repos/LimeSlime888/owot-funbox/contents/owotutilities.js?raw=true").then(e=>e.json()).then(e=>eval(atob(e.content)));
fetch("https://api.github.com/repos/LimeSlime888/owot-funbox/contents/utilities.js?raw=true").then(e=>e.json()).then(e=>eval(atob(e.content)));
var m_lookupDiv64 = "0abcdefghijklmnopqrstuvwxyzαβγδεζηθικλμνξøπρςτυφχψωϗϐϑϒϕϖϙϛϝϟϡϣϥϧABCDEFGHIJKLMNOPQRSTUVWXYZÆʙΓΔɞʘŋΘıʞΛɱʌΞØΠþΣʇʊΦʔΨΩϏЂЄЉЊЋϘϚϜϞϠϢϤϦ";
var m_lookupDiv16Add2 = "2бвгджзи҂лмнптцчшщъыьэюя≈ђєљњћџѡѣѥѧѩѫѭѯѳѻѵҁҍҏґғҕҗҙқҝҟҡңҥѹҧҩҭұҳҵҷҹ";
var m_lookup = {
    '⅛': 1/8, '¼': 1/4, '⅜': 3/8, '½': 1/2, '⅝': 5/8, '¾': 3/4, '⅞': 7/8,
    '⅙': 1/6, '⅓': 1/3, '⅔': 2/3, '⅚': 5/6,
    '⅕': 1/5, '⅖': 2/5, '⅗': 3/5, '⅘': 4/5,
    '⅐': 1/7, '⅑': 1/9, '⅒': 1/10
}
function m_decodeChar(c) {
    if (!c || c.match(/\s/)) return;
    if (c == +c) return c;
    let div64i = m_lookupDiv64.indexOf(c);
    if (div64i > -1) {
        return div64i/64;
    }
    let div16a2i = m_lookupDiv16Add2.indexOf(c);
    if (div16a2i > -1) {
        return div16a2i/16 + 2;
    }
    let lookup = m_lookup[c];
    return lookup;
}
function m_writemod(e) {
    let [x, y] = convertTileToXY(e.tileX, e.tileY, e.charX, e.charY);
    let bgChar = getCharInfoXY(x, y-32768);
    let brightChar = getCharInfoXY(x, y-65536);
    let brightness = m_decodeChar(brightChar.char);
    let opacChar = getCharInfoXY(x, y-98304);
    let opacity = m_decodeChar(opacChar.char);
    if (e.bgColor == -1 || isNaN(e.bgColor)) {
        e.bgColor = bgChar.bgColor;
        if (e.char.match(/\s/) || e.char == '\b') {
            e.char = bgChar.char; e.color = bgChar.color;
        }
    }
    let r = (e.color>>16)&255;
    let g = (e.color>>8)&255;
    let b = e.color&255;
    let hasbg, rb, gb, bb;
    if (e.bgColor >= 0) {
        hasbg = true;
        rb = (e.bgColor>>16)&255;
        gb = (e.bgColor>>8)&255;
        bb = e.bgColor&255;
    }
    if (opacity) {
        let r2 = (opacChar.color>>16)&255;
        let g2 = (opacChar.color>>8)&255;
        let b2 = opacChar.color&255;
        [r, g, b] = [r+(r2-r)*opacity, g+(g2-g)*opacity, b+(b2-b)*opacity];
        if (hasbg) {
            [rb, gb, bb] = [rb+(r2-rb)*opacity, gb+(g2-gb)*opacity, bb+(b2-bb)*opacity];
        }
    }
    if (!isNaN(brightness) || brightness == 1) {
        [r, g, b] = [r*brightness, g*brightness, b*brightness];
        if (hasbg) {
            [rb, gb, bb] = [rb*brightness, gb*brightness, bb*brightness];
        }
    }
    if (brightChar.color) {
        let r2 = ((brightChar.color>>16)&255) / 255;
        let g2 = ((brightChar.color>>8)&255) / 255;
        let b2 = (brightChar.color&255) / 255;
        [r, g, b] = [r*r2, g*g2, b*b2];
        if (hasbg) {
            [rb, gb, bb] = [rb*r2, gb*g2, bb*b2];
        }
    }
    if (brightChar.bgColor > 0) {
        let r2 = (brightChar.bgColor>>16)&255;
        let g2 = (brightChar.bgColor>>8)&255;
        let b2 = brightChar.bgColor&255;
        [r, g, b] = [r+r2, g+g2, b+b2];
        if (hasbg) {
            [rb, gb, bb] = [rb+r2, gb+g2, bb+b2];
        }
    }
    [r, g, b] = [r, g, b].map(x=>Math.min(255, Math.floor(x)));
    if (hasbg) {
        [rb, gb, bb] = [rb, gb, bb].map(x=>Math.min(255, Math.floor(x)));
        e.bgColor = (rb<<16)+(gb<<8)+bb;
    }
    e.color = (r<<16)+(g<<8)+b;
    if (e.color == 0) e.color = 1;
}
w.on('writeBefore', m_writemod);
state.userModel.is_owner = true;
function m_onmove(e) {
    let [x, y] = convertTileToXY(e.tileX, e.tileY, e.charX, e.charY);
    let info = getCharInfoXY(x, y);
    let link = getLinkXY(x, y);
    if (link && link.type == 'coord' && info.protection > 0) {
        let [lx, ly] = [link.link_tileX, link.link_tileY];
        let [cx, cy] = [lx*4*tileC - .5, -ly*4*tileR - .5];
        if (!(cx == Math.floor(cx) && cy == Math.floor(cy))) {
            let contenders = [
                [Math.floor(cx), Math.floor(cy)],
                [Math.floor(cx), Math.ceil(cy)],
                [Math.ceil(cx), Math.floor(cy)],
                [Math.ceil(cx), Math.ceil(cy)]
            ];
            contenders = contenders.filter((e,i)=>contenders.indexOf(e) == i);
            contenders = contenders.filter(function(e){
                let info = getCharInfoXY(...e);
                let link = getLinkXY(...e);
                return info.protection <= 0 && (link ? link.type != 'coord' : true);
            });
            if (contenders.length) [cx, cy] = contenders.randomElm();
            else cx = null;
        }
        if (cx == null) { removeCursor() } else {
            renderCursor(convertXYtoTile(cx, cy));
        }
        w.doGoToCoord(ly, lx);
    } else if (info.protection > 0) { removeCursor() }
}
w.on('cursorMove', m_onmove);
var m_fetchDataRaw;
var m_fetchData;
async function m_refetch() {
    m_fetchDataRaw = await fetch("https://api.github.com/repos/LimeSlime888/mis------./contents/fetch_areas.txt?raw=true").then(e=>e.json());
    m_fetchDataRaw = atob(m_fetchDataRaw.content);
    m_fetchData = m_fetchDataRaw.split('\n');
    m_fetchData = m_fetchData.map(e=>e.split(','));
    for (let range of m_fetchData) {
      network.fetch({minX: range[0], maxX: range[1], minY: range[2], maxY: range[3]});
    }
}
m_refetch();
