// Základní kostra pro hru Vlak
console.log("Hra Vlak se načítá...");

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const TILES = {
    ZED: 1, VRA: 2, KRY: 3, STO: 4, JAB: 5, KRA: 6, TRE: 7, RYB: 8, ZIR: 9, ZMR: 10,
    DOR: 11, POC: 12, AUT: 13, BAL: 14, BUD: 15, SLO: 16, VIN: 17, PEN: 18, LET: 19,
    LO1: 20, LO2: 21, LO3: 22, LO4: 23, LO5: 24, LO6: 25, LO7: 26, LO8: 27, LO9: 28,
    LOA: 29, LOB: 30, LOC: 31, KOR: 32
};

// Zde budou definice velikosti hry a další konstanty
const TILE_SIZE = 48; // Zvětšená velikost dlaždice
const MAP_COLS = 20;
const MAP_ROWS = 12;

canvas.width = TILE_SIZE * MAP_COLS;
canvas.height = TILE_SIZE * MAP_ROWS;

// Mapování z interního názvu dlaždice na název assetu
const TILE_TO_ASSET_MAP = {
    ZED: 'ZED', VRA: 'VRATA', KRY: 'KRYSTAL', STO: 'STROM', JAB: 'JABLKO', KRA: 'KRAVA',
    TRE: 'TRESNE', RYB: 'RYBNIK', ZIR: 'ZIRAFA', ZMR: 'ZMRZLIN', DOR: 'DORT', POC: 'POCITAC',
    AUT: 'AUTO', BAL: 'BALON', BUD: 'BUDIK', SLO: 'SLON', VIN: 'VINO', PEN: 'PENIZE',
    LET: 'LETADLO', KOR: 'KORUNA', LOKOMOT: 'LOKOMOT'
};

// --- Načítání obrázků ---
const assets = {};
const assetNames = [
    'AUTO1', 'AUTO2', 'AUTO3', 'AUTO4', 'AUTO5', 'AUTO6', 'AUTO7',
    'BALON1', 'BALON2', 'BALON3', 'BALON4', 'BALON5', 'BALON6', 'BALON7',
    'BUDIK1', 'BUDIK2', 'BUDIK3', 'BUDIK4', 'BUDIK5', 'BUDIK6', 'BUDIK7',
    'DORT1', 'DORT2', 'DORT3', 'DORT4', 'DORT5', 'DORT6', 'DORT7',
    'JABLKO1', 'JABLKO2', 'JABLKO3',
    'KORUNA1', 'KORUNA2', 'KORUNA3', 'KORUNA4', 'KORUNA5', 'KORUNA6', 'KORUNA7',
    'KRAVA1', 'KRAVA2', 'KRAVA3', 'KRAVA4', 'KRAVA5', 'KRAVA6', 'KRAVA7',
    'KRYSTAL1', 'KRYSTAL2', 'KRYSTAL3', 'KRYSTAL4', 'KRYSTAL5', 'KRYSTAL6', 'KRYSTAL7',
    'LETADLO1', 'LETADLO2', 'LETADLO3', 'LETADLO4', 'LETADLO5', 'LETADLO6', 'LETADLO7',
    'LOKOMOT1', 'LOKOMOT2', 'LOKOMOT3', 'LOKOMOT4', 'LOKOMOT5', 'LOKOMOT6', 'LOKOMOT7', 'LOKOMOT8', 'LOKOMOT9', 'LOKOMOTA', 'LOKOMOTB', 'LOKOMOTC',
    'PENIZE1', 'PENIZE2', 'PENIZE3', 'PENIZE4', 'PENIZE5', 'PENIZE6', 'PENIZE7',
    'POCITAC1', 'POCITAC2', 'POCITAC3', 'POCITAC4', 'POCITAC5', 'POCITAC6', 'POCITAC7',
    'RYBNIK1', 'RYBNIK2', 'RYBNIK3', 'RYBNIK4', 'RYBNIK5', 'RYBNIK6', 'RYBNIK7', 
    'SLON1', 'SLON2', 'SLON3', 'SLON4', 'SLON5', 'SLON6', 'SLON7',
    'SRAZKA1', 'SRAZKA2', 'SRAZKA3', 'SRAZKA4', 'SRAZKA5', 'SRAZKA6', 'SRAZKA7', 'SRAZKA8', 'SRAZKA9', 'SRAZKAA',
    'STROM1', 'STROM2', 'STROM3', 'STROM4', 'STROM5', 'STROM6', 'STROM7',
    'TITULEK',
    'TRESNE1', 'TRESNE2', 'TRESNE3', 'TRESNE4', 'TRESNE5', 'TRESNE6', 'TRESNE7',
    'VINO1', 'VINO2', 'VINO3', 'VINO4', 'VINO5', 'VINO6', 'VINO7',
    'VRATA1', 'VRATA2', 'VRATA3', 'VRATA4', 'VRATA5', 'VRATA6',
    'ZED',
    'ZIRAFA1', 'ZIRAFA2', 'ZIRAFA3', 'ZIRAFA4', 'ZIRAFA5', 'ZIRAFA6', 'ZIRAFA7',
    'ZMRZLIN1', 'ZMRZLIN2', 'ZMRZLIN3', 'ZMRZLIN4', 'ZMRZLIN5', 'ZMRZLIN6', 'ZMRZLIN7'
];

let assetsLoaded = 0;
function loadAssets(callback) {
    const assetOrder = {};
    assetNames.forEach(name => {
        let key;
        if (name.startsWith('KORUNA')) {
            key = 'KORUNA';
        } else {
            key = name.replace(/\d+$|[A-C]$/, '');
        }
        if (!assetOrder[key]) assetOrder[key] = [];
        assetOrder[key].push(name);
    });

    for (const key in assetOrder) {
        assetOrder[key].sort((a, b) => {
            let numA, numB;
            if (a.startsWith('KORUNA')) {
                numA = parseInt(a.replace('KORUNA', ''));
            } else {
                numA = parseInt(a.match(/[0-9A-C]+$/)[0].replace('A', '10').replace('B', '11').replace('C', '12'));
            }
            if (b.startsWith('KORUNA')) {
                numB = parseInt(b.replace('KORUNA', ''));
            } else {
                numB = parseInt(b.match(/[0-9A-C]+$/)[0].replace('A', '10').replace('B', '11').replace('C', '12'));
            }
            return numA - numB;
        });
    }

    const sortedAssetNames = [].concat(...Object.values(assetOrder));
    sortedAssetNames.forEach(name => {
        const assetKey = (() => {
            if (name.startsWith('KORUNA')) {
                return 'KORUNA';
            } else {
                return name.replace(/\d+$|[A-C]$/, '');
            }
        })();
        if (!assets[assetKey]) assets[assetKey] = [];
        const img = new Image();
        img.src = `assets/${name}.png`;
        img.onload = () => {
            assetsLoaded++;
            if (assetsLoaded === sortedAssetNames.length) callback();
        };
        assets[assetKey].push(img);
    });
}

// --- Herní stav ---
let currentLevel = 0;
let train = { x: 0, y: 0, dx: 1, dy: 0, path: [], wagons: [], headAsset: null };
let gameOver = false;
let score = 0;
let animationFrame = 0;
let itemsToCollect = 0;
let gateFrame = 0;
let gateAnimationCounter = 0;
let gateState = 'closed'; // new: 'closed', 'opening', 'open'

function initLevel(levelIndex) {
    const levelData = levels[levelIndex];
    itemsToCollect = 0;
    gateFrame = 0;
    gateAnimationCounter = 0;
    gateState = 'closed';

    for (let row = 0; row < MAP_ROWS; row++) {
        for (let col = 0; col < MAP_COLS; col++) {
            const tile = levelData[row][col];
            if (tile > TILES.VRA) { // Vše kromě zdi a brány je sbíratelné
                itemsToCollect++;
            }
            if (tile >= TILES.LO1 && tile <= TILES.LOC) {
                train.x = col;
                train.y = row;
                levelData[row][col] = 0;
                // If the train starts on a collectible tile, decrement itemsToCollect
                if (tile > TILES.VRA) {
                    itemsToCollect--;
                }
            }
        }
    }
    console.log(`initLevel: itemsToCollect initialized to ${itemsToCollect}`);
    train.wagons = [];
    train.path = [];
    train.dx = 1;
    train.dy = 0;
    gameOver = false;
    score = 0;
}

// --- Ovládání ---
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' && train.dy === 0) { train.dx = 0; train.dy = -1; }
    else if (e.key === 'ArrowDown' && train.dy === 0) { train.dx = 0; train.dy = 1; }
    else if (e.key === 'ArrowLeft' && train.dx === 0) { train.dx = -1; train.dy = 0; }
    else if (e.key === 'ArrowRight' && train.dx === 0) { train.dx = 1; train.dy = 0; }
});

// --- Vykreslování ---
function drawMap() {
    const levelData = levels[currentLevel];
    for (let row = 0; row < MAP_ROWS; row++) {
        for (let col = 0; col < MAP_COLS; col++) {
            const tile = levelData[row][col];
            if (tile === 0) continue; // Skip empty tiles

            const tileName = Object.keys(TILES).find(key => TILES[key] === tile);
            if (!tileName) continue; // Skip unknown tiles

            // Determine the base name for the asset key
            let baseName = tileName;
            if (tileName.startsWith('LO')) {
                baseName = 'LOKOMOT';
            }

            const assetKey = TILE_TO_ASSET_MAP[baseName];
            if (!assetKey) continue; // Skip if no asset is mapped

            const assetGroup = assets[assetKey];
            if (assetGroup && assetGroup.length > 0) {
                let img;
                if (tile === TILES.VRA) {
                    img = assetGroup[gateFrame];
                } else {
                    // Use first 3 frames for animated items
                    const frameCount = Math.min(assetGroup.length, 3);
                    const frameIndex = animationFrame % frameCount;
                    img = assetGroup[frameIndex];
                }
                if (img) {
                    ctx.drawImage(img, col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                }
            }
        }
    }
}

function drawTrain() {
    train.wagons.forEach((wagonType, index) => {
        if (index < train.path.length) {
            const currentPos = train.path[index];
            const prevPos = (index === 0) ? { x: train.x, y: train.y } : train.path[index - 1];
            const dx = prevPos.x - currentPos.x;
            const dy = prevPos.y - currentPos.y;

            let assetIndex; 
            if (dx === 1) assetIndex = 5;      // Doprava (index 6)
            else if (dx === -1) assetIndex = 3; // Doleva (index 4)
            else if (dy === 1) assetIndex = 6;  // Dolů (index 7)
            else if (dy === -1) assetIndex = 4; // Nahoru (index 5)

            const wagonAssetGroup = assets[wagonType];
            if (wagonAssetGroup && wagonAssetGroup.length > assetIndex) {
                const img = wagonAssetGroup[assetIndex];
                ctx.drawImage(img, currentPos.x * TILE_SIZE, currentPos.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
    });

    if (train.headAsset) {
        ctx.drawImage(train.headAsset, train.x * TILE_SIZE, train.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    }
}

function drawScore() {
    ctx.fillStyle = 'white';
    ctx.font = '48px Arial';
    ctx.fillText('Score: ' + score, 24, 60);
}

// --- Herní smyčka ---
function update() {
    if (gameOver) return;

    const lastPos = { x: train.x, y: train.y };
    const nextX = train.x + train.dx;
    const nextY = train.y + train.dy;

    if (nextY < 0 || nextY >= MAP_ROWS || nextX < 0 || nextX >= MAP_COLS) {
        gameOver = true; return;
    }

    const levelData = levels[currentLevel];
    const nextTile = levelData[nextY][nextX];

    // Kolize POUZE se zdí
    if (nextTile === TILES.ZED) {
        gameOver = true; return;
    }

    // Kolize se sebou samým
    for (let i = 0; i < train.wagons.length; i++) {
        const partPos = train.path[i];
        if (partPos && partPos.x === nextX && partPos.y === nextY) {
            gameOver = true; return;
        }
    }

    train.path.unshift(lastPos);
    while (train.path.length > train.wagons.length) {
        train.path.pop();
    }

    // Sběr předmětů (vše, co není zeď, brána nebo prázdné pole)
    if (nextTile >= TILES.KRY) {
        let tileName = Object.keys(TILES).find(key => TILES[key] === nextTile);
        const assetKey = TILE_TO_ASSET_MAP[tileName.replace(/[0-9]/g, '')];
        
        if (assets[assetKey] && assets[assetKey].length >= 7) {
            train.wagons.push(assetKey);
        } else {
            train.wagons.push('STROM');
        }

        score += 10;
        itemsToCollect--;
        levelData[nextY][nextX] = 0;
        console.log(`Item collected. itemsToCollect: ${itemsToCollect}`);

        if (itemsToCollect === 0 && gateState === 'closed') {
            console.log('All items collected, starting gate opening animation.');
            gateState = 'opening';
        }
    }

    train.x = nextX;
    train.y = nextY;

    // Handle gate collision
    if (nextTile === TILES.VRA) {
        console.log(`Train hit gate. itemsToCollect: ${itemsToCollect}, gateState: ${gateState}`);
        if (gateState !== 'open') {
            gameOver = true; return; // Collision with closed or opening gate
        } else {
            // Train can pass through open gate
            currentLevel++;
            if (currentLevel >= levels.length) {
                gameOver = true;
                alert('Vyhrál jsi!');
            } else {
                initLevel(currentLevel);
            }
            return; // Level changed, so stop further processing for this frame
        }
    }

    // Gate animation logic
    if (gateState === 'opening') {
        gateFrame++;
        if (gateFrame >= 5) { // VRATA6 is index 5 (VRATA1 is index 0)
            gateState = 'open';
        }
    }
}

function gameLoop() {
    animationFrame++;
    update();

    const frameIndex = animationFrame % 3;
    const lokomotAssets = assets['LOKOMOT'];
    let nextHeadAsset;
    if (train.dx === 1) { nextHeadAsset = [lokomotAssets[2], lokomotAssets[6], lokomotAssets[10]][frameIndex]; }
    else if (train.dx === -1) { nextHeadAsset = [lokomotAssets[0], lokomotAssets[4], lokomotAssets[8]][frameIndex]; }
    else if (train.dy === -1) { nextHeadAsset = [lokomotAssets[1], lokomotAssets[5], lokomotAssets[9]][frameIndex]; }
    else if (train.dy === 1) { nextHeadAsset = [lokomotAssets[3], lokomotAssets[7], lokomotAssets[11]][frameIndex]; }
    if (nextHeadAsset) train.headAsset = nextHeadAsset;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawMap();
    drawTrain();
    drawScore();

    if (gameOver) {
        ctx.fillStyle = 'white';
        ctx.font = '120px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2);
    }

    setTimeout(gameLoop, 1000 / 5); // 5 FPS
}

function main() {
    initLevel(currentLevel);
    gameLoop();
}

loadAssets(main);