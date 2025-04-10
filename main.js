fetch("https://api.github.com/repos/LimeSlime888/owot-funbox/contents/owotutilities.js?raw=true").then(e=>e.json()).then(e=>eval(atob(e.content)));
fetch("https://api.github.com/repos/LimeSlime888/owot-funbox/contents/utilities.js?raw=true").then(e=>e.json()).then(e=>eval(atob(e.content)));
w.nightMode = 1;
elm.owot.classList.add('nightmode');
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
		} else {
			if (!(e.color || e.bgColor)) e.color = 0xffffff;
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
var m_safeguard = true;
var m_linkWarp = true;
function m_onmove(e) {
	let [x, y] = convertTileToXY(e.tileX, e.tileY, e.charX, e.charY);
	let info = getCharInfoXY(x, y);
	let link = getLinkXY(x, y);
	if (m_linkWarp && link && link.type == 'coord' && info.protection > 0) {
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
	} else if (m_safeguard && info.protection > 0) { removeCursor() }
}
w.on('cursorMove', m_onmove);
var m_ambience, m_ambienceInfo, m_ambienceCanPlay, m_ambienceVolumeSlider;
var m_music, m_musicInfo, m_musicCanPlay, m_musicVolumeSlider;
function m_makeAudioModal() {
	let modal = new Modal();
	modal.createForm();
	modal.inputField.style.gridTemplateColumns = '';
	modal.formTitle.style.fontWeight = 'bold';
	modal.formTitle.style.fontSize = 'large';
	modal.formTitle.style.marginBottom = '12px';
	m_ambience = new Audio();
	m_ambience.loop = true;
	m_ambience.controls = true;
	m_ambience.addEventListener('loadstart', ()=>m_ambienceCanPlay=false);
	m_ambience.addEventListener('canplay', ()=>m_ambienceCanPlay=true);
	m_ambienceVolumeSlider = document.createElement('input');
	m_ambienceVolumeSlider.type = 'range';
	m_ambienceVolumeSlider.min = 0;
	m_ambienceVolumeSlider.max = 1;
	m_ambienceVolumeSlider.step = 1/128;
	let ainfob = document.createElement('b');
	ainfob.innerText = 'ambience: ';
	m_ambienceInfo = document.createElement('span');
	m_music = new Audio();
	m_music.loop = true;
	m_music.controls = true;
	m_music.addEventListener('loadstart', ()=>m_musicCanPlay=false);
	m_music.addEventListener('canplay', ()=>m_musicCanPlay=true);
	m_musicVolumeSlider = document.createElement('input');
	m_musicVolumeSlider.type = 'range';
	m_musicVolumeSlider.min = 0;
	m_musicVolumeSlider.max = 1;
	m_musicVolumeSlider.step = 1/128;
	let minfob = document.createElement('b');
	minfob.innerText = 'music: ';
	m_musicInfo = document.createElement('span');
	modal.inputField.append(
		m_ambience, m_ambienceVolumeSlider, ainfob, m_ambienceInfo,
		m_music, m_musicVolumeSlider, minfob, m_musicInfo,
	);
	return w.ui.m_audioModal = modal;
}
m_makeAudioModal();
menu.addOption('Ambience/music info', ()=>w.ui.m_audioModal.open());
function distanceFromRectangle(px, py, rx, ry, rw, rh) {
	if ([px, py, rx, ry, rw, rh].some(isNaN)) return Infinity;
	if (px < rx) {
		if (py < ry) {
			return Math.sqrt((px-rx)**2 + (py-ry)**2);
		} else if (py > ry + rh) {
			return Math.sqrt((px-rx)**2 + (py-ry-rh)**2);
		} else {
			return rx - px;
		}
	} else if (px > rx + rw) {
		if (py < ry) {
			return Math.sqrt((px-rx-rw)**2 + (py-ry)**2);
		} else if (py > ry + rh) {
			return Math.sqrt((px-rx-rw)**2 + (py-ry-rh)**2);
		} else {
			return px - rx - rw;
		}
	} else {
		if (py < ry) {
			return ry - py;
		} else if (py > ry + rh) {
			return py - ry - rh;
		} else {
			return 0;
		}
	}
}
var m_baseAudioUrl = 'https://github.com/LimeSlime888/mis------./raw/refs/heads/main/audio/';
var m_audioAreas = [];
var m_audioAreasString;
async function m_updateAudioAreas() {
	m_audioAreasString = await fetch("https://api.github.com/repos/LimeSlime888/mis------./contents/audio_areas.json?raw=true").then(e=>e.json());
	m_audioAreasString = atob(m_audioAreasString.content);
	let json = JSON.parse(m_audioAreasString);
	m_audioAreas.splice(0);
	for (let area of json) {
		m_audioAreas.push(area);
	}
}
m_updateAudioAreas();
var m_rolloffMin = 4;
var m_rolloffMax = 12;
var m_updateAudioAborts = 0;
function m_updateAudio() {
	if (!m_audioAreas.length || !w.ui.m_audioModal || !m_ambience || !m_music || !m_ambienceVolumeSlider || !m_musicVolumeSlider) return false;
	let [x, y] = [-positionX/tileW, -positionY/tileH];
	let closestArea;
	let closestDistance = Infinity;
	for (let area of m_audioAreas) {
		let distance = distanceFromRectangle(x, y, area.x, area.y, area.w, area.h);
		if (distance < closestDistance) {
			closestArea = area;
			closestDistance = distance;
		}
	}
	if (closestDistance < m_rolloffMax && closestArea) {
		w.ui.m_audioModal.setFormTitle(closestArea.displayName ?? closestArea.name);
		if (closestArea.hasAmbience) {
			let url = m_baseAudioUrl + '(a)%20' + closestArea.name + '.mp3';
			if (m_ambience.src != url) m_ambience.src = url;
			if (m_ambience.paused && m_ambienceCanPlay) m_ambience.play();
			m_ambience.volume = Math.min(1, (1 - (closestDistance-m_rolloffMin)/(m_rolloffMax-m_rolloffMin)) * m_ambienceVolumeSlider.value);
		}
		if (closestArea.hasMusic) {
			let url = m_baseAudioUrl + '(m)%20' + closestArea.name + '.mp3';
			if (m_music.src != url) m_music.src = url;
			if (m_music.paused && m_musicCanPlay) m_music.play();
			m_music.volume = Math.min(1, (1 - (closestDistance-m_rolloffMin)/(m_rolloffMax-m_rolloffMin)) * m_ambienceVolumeSlider.value);
		}
	} else {
		w.ui.m_audioModal.setFormTitle('void');
		m_ambience.src = '';
	}
}
async function m_updateAudioLoop() {
	let a = ++m_updateAudioAborts;
	while (a == m_updateAudioAborts) {
		m_updateAudio();
		if (window.sleep) await sleep(10);
		else await new Promise(r=>setTimeout(r, 10));
	}
}
m_updateAudioLoop();
unloadTilesAuto = false;
var m_fetchDataRaw;
var m_fetchData;
var m_fetches;
async function m_refetch() {
	m_fetchDataRaw = await fetch("https://api.github.com/repos/LimeSlime888/mis------./contents/fetch_areas.txt?raw=true").then(e=>e.json());
	m_fetchDataRaw = atob(m_fetchDataRaw.content);
	m_fetchData = m_fetchDataRaw.split('\n');
	m_fetchData = m_fetchData.map(e=>e.split(','));
	m_fetches = [];
	for (let range of m_fetchData) {
		let [minX, maxX, minY, maxY] = range.slice(0, 4).map(e=>+e);
		if ([minX, maxX, minY, maxY].some(isNaN)) continue;
		if (maxX < minX) {
			console.warn('maxX < minX ('+range.slice(0,4).join(',')+')');
			[maxX, minX] = [minX, maxX];
		}
		if (maxY < minY) {
			console.warn('maxY < minY ('+range.slice(0,4).join(',')+')');
			[maxY, minY] = [minY, maxY];
		}
		m_fetches.push({minX, maxX, minY, maxY});
	}
	network.fetch(m_fetches);
}
m_refetch();
