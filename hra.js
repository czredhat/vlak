// Základní kostra pro hru Vlak
console.log("Hra Vlak se načítá...");

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Zde budou definice velikosti hry a další konstanty
const TILE_SIZE = 48; // Zvětšená velikost dlaždice
const MAP_COLS = 20;
const MAP_ROWS = 12;

canvas.width = TILE_SIZE * MAP_COLS;
canvas.height = TILE_SIZE * MAP_ROWS;

// Mapování z interního názvu dlaždice na název assetu
const TILE_TO_ASSET_MAP = {
    ZED: 'ZED',
    VRA: 'VRATA',
    KRY: 'KRYSTAL',
    STO: 'STROM',
    JAB: 'JABLKO',
    KRA: 'KRAVA',
    TRE: 'TRESNE',
    RYB: 'RYBNIK',
    ZIR: 'ZIRAFA',
    ZMR: 'ZMRZLIN',
    DOR: 'DORT',
    POC: 'POCITAC',
    AUT: 'AUTO',
    BAL: 'BALON',
    BUD: 'BUDIK',
    SLO: 'SLON',
    VIN: 'VINO',
    PEN: 'PENIZE',
    LET: 'LETADLO',
    LOKOMOT: 'LOKOMOT'
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
    'RYBNIK1', 'RYBNIK2', 'RYBNIK3',
    'SLON1', 'SLON2', 'SLON3', 'SLON4', 'SLON5', 'SLON6', 'SLON7',
    'SRAZKA1', 'SRAZKA2', 'SRAZKA3', 'SRAZKA4', 'SRAZKA5', 'SRAZKA6', 'SRAZKA7', 'SRAZKA8', 'SRAZKA9', 'SRAZKAA',
    'STROM1', 'STROM2', 'STROM3', 'STROM4', 'STROM5', 'STROM6', 'STROM7',
    'TITULEK',
    'TRESNE1', 'TRESNE2', 'TRESNE3',
    'VINO1', 'VINO2', 'VINO3', 'VINO4', 'VINO5', 'VINO6', 'VINO7',
    'VRATA1', 'VRATA2', 'VRATA3', 'VRATA4', 'VRATA5', 'VRATA6',
    'ZED',
    'ZIRAFA1', 'ZIRAFA2', 'ZIRAFA3', 'ZIRAFA4', 'ZIRAFA5', 'ZIRAFA6', 'ZIRAFA7',
    'ZMRZLIN1', 'ZMRZLIN2', 'ZMRZLIN3', 'ZMRZLIN4', 'ZMRZLIN5', 'ZMRZLIN6', 'ZMRZLIN7'
];

let assetsLoaded = 0;
function loadAssets(callback) {
    // Vytvoříme mapu pro seřazení obrázků, aby se zachovalo pořadí 1-9, A, B, C
    const assetOrder = {};

    assetNames.forEach(name => {
        const key = name.replace(/[0-9A-C]+$/, '');
        if (!assetOrder[key]) {
            assetOrder[key] = [];
        }
        assetOrder[key].push(name);
    });

    // Seřadíme názvy souborů pro každý klíč
    for (const key in assetOrder) {
        assetOrder[key].sort((a, b) => {
            const numA = parseInt(a.match(/[0-9A-C]+$/)[0].replace('A', '10').replace('B', '11').replace('C', '12'));
            const numB = parseInt(b.match(/[0-9A-C]+$/)[0].replace('A', '10').replace('B', '11').replace('C', '12'));
            return numA - numB;
        });
    }

    const sortedAssetNames = [].concat(...Object.values(assetOrder));

    sortedAssetNames.forEach(name => {
        const assetKey = name.replace(/[0-9A-C]+$/, '');
        if (!assets[assetKey]) {
            assets[assetKey] = [];
        }
        const img = new Image();
        img.src = `assets/${name}.png`;
        img.onload = () => {
            assetsLoaded++;
            if (assetsLoaded === sortedAssetNames.length) {
                console.log("Všechny obrázky načteny a seřazeny.");
                callback();
            }
        };
        assets[assetKey].push(img);
    });
}


// --- Herní stav ---
let currentLevel = 0;
let train = {
    x: 0,
    y: 0,
    dx: 1,
    dy: 0,
    path: [], // Historie pozic hlavy vlaku [{x, y}, {x, y}, ...]
    wagons: [], // Seznam typů vagónů ['STROM', 'KRAVA', ...]
    headAsset: null
};
let gameOver = false;
let score = 0;
let animationFrame = 0;
let itemsToCollect = 0;
let gateFrame = 0;
let gateAnimationCounter = 0;

function initLevel(levelIndex) {
    const levelData = levels[levelIndex];
    itemsToCollect = 0;
    gateFrame = 0;
    gateAnimationCounter = 0;

    for (let row = 0; row < MAP_ROWS; row++) {
        for (let col = 0; col < MAP_COLS; col++) {
            const tile = levelData[row][col];
            if (tile >= TILES.JAB && tile <= TILES.LET) {
                itemsToCollect++;
            }
            if (tile >= TILES.LO1 && tile <= TILES.LOC) {
                train.x = col;
                train.y = row;
                levelData[row][col] = 0; // Odstraníme vlak z mapy
            }
        }
    }
    train.wagons = [];
    train.path = [];
    train.dx = 1;
    train.dy = 0;
    gameOver = false;
    score = 0;
}

// --- Ovládání ---
document.addEventListener('keydown', e => {
    if (e.key === 'ArrowUp' && train.dy === 0) {
        train.dx = 0;
        train.dy = -1;
    } else if (e.key === 'ArrowDown' && train.dy === 0) {
        train.dx = 0;
        train.dy = 1;
    } else if (e.key === 'ArrowLeft' && train.dx === 0) {
        train.dx = -1;
        train.dy = 0;
    } else if (e.key === 'ArrowRight' && train.dx === 0) {
        train.dx = 1;
        train.dy = 0;
    }
});

// --- Vykreslování ---
function drawMap() {
    const levelData = levels[currentLevel];
    for (let row = 0; row < MAP_ROWS; row++) {
        for (let col = 0; col < MAP_COLS; col++) {
            const tile = levelData[row][col];
            if (tile !== 0) {
                let tileName = Object.keys(TILES).find(key => TILES[key] === tile);
                if (tileName) {
                    const assetKey = TILE_TO_ASSET_MAP[tileName.replace(/[0-9]/g, '')];
                    const assetGroup = assets[assetKey];
                    if (assetGroup && assetGroup.length > 0) {
                        let img;
                        if (tile === TILES.VRA) {
                            img = assetGroup[gateFrame];
                        } else {
                            let frameCount = assetGroup.length >= 3 ? 3 : assetGroup.length;
                            const frameIndex = animationFrame % frameCount;
                            img = assetGroup[frameIndex];
                        }
                        ctx.drawImage(img, col * TILE_SIZE, row * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                    }
                }
            }
        }
    }
}

function drawTrain() {
    // Vykreslení vagónů
    train.wagons.forEach((wagonType, index) => {
        // Pozice pro vagón na indexu `index` je uložena v `path[index]`.
        if (index < train.path.length) {
            const currentPos = train.path[index];

            // Segment před tímto vagónem určuje jeho směr.
            // Pro první vagón (index 0) je to hlava vlaku.
            // Pro další vagóny je to vagón na `index - 1`, jehož pozice je `path[index - 1]`.
            const prevPos = (index === 0) ? { x: train.x, y: train.y } : train.path[index - 1];

            const dx = prevPos.x - currentPos.x;
            const dy = prevPos.y - currentPos.y;

            let assetIndex = 3; // Default: doprava
            if (dx === 1) assetIndex = 3;      // Doprava (frame 4)
            else if (dx === -1) assetIndex = 5; // Doleva (frame 6)
            else if (dy === 1) assetIndex = 4;  // Dolů (frame 5)
            else if (dy === -1) assetIndex = 6; // Nahoru (frame 7)

            const wagonAssetGroup = assets[wagonType];
            if (wagonAssetGroup && wagonAssetGroup.length > assetIndex) {
                const img = wagonAssetGroup[assetIndex];
                ctx.drawImage(img, currentPos.x * TILE_SIZE, currentPos.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
            }
        }
    });

    // Vykreslení hlavy
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

    // Uložíme aktuální pozici hlavy, než se pohne
    const lastPos = { x: train.x, y: train.y };

    // Vypočítáme další pozici
    const nextX = train.x + train.dx;
    const nextY = train.y + train.dy;

    // Detekce kolize s okrajem
    if (nextY < 0 || nextY >= MAP_ROWS || nextX < 0 || nextX >= MAP_COLS) {
        gameOver = true;
        return;
    }

    // Detekce kolize se zdí, stromem, rybníkem
    const levelData = levels[currentLevel];
    const nextTile = levelData[nextY][nextX];
    if (nextTile === TILES.ZED || nextTile === TILES.STO || nextTile === TILES.RYB) {
        gameOver = true;
        return;
    }

    // Detekce kolize se sebou samým (s vagóny)
    for (let i = 0; i < train.wagons.length; i++) {
        const partPos = train.path[i];
        if (partPos && partPos.x === nextX && partPos.y === nextY) {
            gameOver = true;
            return;
        }
    }
    
    // Přidáme starou pozici hlavy na začátek historie cesty
    train.path.unshift(lastPos);

    // Omezíme délku historie cesty na počet vagónů
    while (train.path.length > train.wagons.length) {
        train.path.pop();
    }

    // Sběr předmětů
    if (nextTile >= TILES.JAB && nextTile <= TILES.LET) {
        let tileName = Object.keys(TILES).find(key => TILES[key] === nextTile);
        const assetKey = TILE_TO_ASSET_MAP[tileName.replace(/[0-9]/g, '')];
        
        if (assets[assetKey] && assets[assetKey].length >= 7) {
            train.wagons.push(assetKey); // Přidá specifický vagón
        } else {
            train.wagons.push('STROM'); // Přidá defaultní vagón
        }

        score += 10;
        itemsToCollect--;
        levelData[nextY][nextX] = 0; // Odstraní předmět z mapy
    } else if (nextTile === TILES.KRY) {
        train.wagons.push('KRYSTAL');
        score += 50;
        levelData[nextY][nextX] = 0;
    }

    // Aktualizujeme pozici hlavy
    train.x = nextX;
    train.y = nextY;

    // Dokončení levelu
    if (nextTile === TILES.VRA) {
        if (gateFrame < 5) {
            gameOver = true;
            return;
        }
        currentLevel++;
        if (currentLevel >= levels.length) {
            gameOver = true;
            alert('Vyhrál jsi!');
        } else {
            initLevel(currentLevel);
        }
    }

    // Animace brány
    if (itemsToCollect === 0 && gateFrame < 5) {
        gateAnimationCounter++;
        if (gateAnimationCounter % 5 === 0) {
            gateFrame++;
        }
    }
}

function gameLoop() {
    animationFrame++;
    update();

    // Výběr správného obrázku pro hlavu lokomotivy
    const frameIndex = animationFrame % 3;
    const lokomotAssets = assets['LOKOMOT'];
    let nextHeadAsset;

    if (train.dx === 1) { // Doprava
        const rightFrames = [lokomotAssets[2], lokomotAssets[6], lokomotAssets[10]];
        nextHeadAsset = rightFrames[frameIndex];
    } else if (train.dx === -1) { // Doleva
        const leftFrames = [lokomotAssets[0], lokomotAssets[4], lokomotAssets[8]];
        nextHeadAsset = leftFrames[frameIndex];
    } else if (train.dy === -1) { // Nahoru
        const upFrames = [lokomotAssets[1], lokomotAssets[5], lokomotAssets[9]];
        nextHeadAsset = upFrames[frameIndex];
    } else if (train.dy === 1) { // Dolů
        const downFrames = [lokomotAssets[3], lokomotAssets[7], lokomotAssets[11]];
        nextHeadAsset = downFrames[frameIndex];
    }
    if (nextHeadAsset) {
        train.headAsset = nextHeadAsset;
    }

    // Vykreslení
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

// --- Hlavní funkce ---
function main() {
    initLevel(currentLevel);
    gameLoop();
}

// Spuštění hry po načtení všech zdrojů
loadAssets(main);