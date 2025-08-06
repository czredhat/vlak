
// Základní kostra pro hru Vlak
console.log("Hra Vlak se načítá...");

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Zde budou definice velikosti hry a další konstanty
const TILE_SIZE = 48; // Předpokládaná velikost dlaždice
const MAP_COLS = 20;
const MAP_ROWS = 12;

canvas.width = TILE_SIZE * MAP_COLS;
canvas.height = TILE_SIZE * MAP_ROWS;

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

// Mapping from TILES value to the base asset name for wagons
const WAGON_ASSET_MAP = {
    [TILES.JAB]: 'JABLKO',
    [TILES.KRA]: 'KRAVA',
    [TILES.TRE]: 'TRESNE',
    [TILES.RYB]: 'RYBNIK',
    [TILES.ZIR]: 'ZIRAFA',
    [TILES.ZMR]: 'ZMRZLIN',
    [TILES.DOR]: 'DORT',
    [TILES.POC]: 'POCITAC',
    [TILES.AUT]: 'AUTO',
    [TILES.BAL]: 'BALON',
    [TILES.BUD]: 'BUDIK',
    [TILES.SLO]: 'SLON',
    [TILES.VIN]: 'VINO',
    [TILES.PEN]: 'PENIZE',
    [TILES.LET]: 'LETADLO',
};



// --- Načítání obrázků ---
const assets = {};
const assetNames = [
    'AUTO1', 'AUTO2', 'AUTO3', 'AUTO4', 'AUTO5', 'AUTO6', 'AUTO7',
    'BALON1', 'BALON2', 'BALON3', 'BALON4', 'BALON5', 'BALON6', 'BALON7',
    'BUDIK1', 'BUDIK2', 'BUDIK3', 'BUDIK4', 'BUDIK5', 'BUDIK6', 'BUDIK7',
    'DORT1', 'DORT2', 'DORT3', 'DORT4', 'DORT5', 'DORT6', 'DORT7',
    'JABLKO1', 'JABLKO2', 'JABLKO3', 'JABLKO4', 'JABLKO5', 'JABLKO6', 'JABLKO7',
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
    assetNames.forEach(name => {
        // First, get a base key by removing trailing numbers.
        let assetKey = name.replace(/[0-9]/g, '');

        // This isn't enough for assets using letters in their sequence (LOKOMOTA, SRAZKAA, etc.).
        // We add specific rules for these known cases.
        if (assetKey.startsWith('LOKOMOT') && assetKey.length > 7) {
            assetKey = 'LOKOMOT';
        }
        if (assetKey.startsWith('SRAZKA') && assetKey.length > 6) {
            assetKey = 'SRAZKA';
        }

        if (!assets[assetKey]) {
            assets[assetKey] = [];
        }
        const img = new Image();
        img.src = `assets/${name}.png`;
        img.onload = () => {
            assetsLoaded++;
            if (assetsLoaded === assetNames.length) {
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
    body: [],
    length: 5
};
let gameOver = false;
let score = 0;
let animationFrame = 0;
let itemsToCollect = 0;
let gateFrame = 0;
let gateAnimationCounter = 0;

function initLevel(levelIndex) {
    const levelData = levels[levelIndex];
    itemsToCollect = 0; // Reset item counter
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
                levelData[row][col] = 0; // Remove train from map data
            }
        }
    }
    train.body = [];
    train.length = 1; // Start with just the locomotive head
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
                        if (tile === TILES.VRA) { // Handle gate animation separately
                            img = assetGroup[gateFrame];
                        } else {
                            let frameCount = assetGroup.length;
                            // Heuristika pro standardní animované předměty (3 snímky animace + 4 pro vagóny)
                            if (assetGroup.length === 7) {
                                frameCount = 3;
                            }
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
    // Draw body
    train.body.forEach(part => {
        let asset;
        if (part.type !== 0) {
            const assetKey = WAGON_ASSET_MAP[part.type];
            if (assetKey && assets[assetKey] && assets[assetKey].length >= 4) {
                asset = assets[assetKey][3]; // Use the 4th frame (index 3) for the wagon body
            } else {
                asset = assets['LOKOMOT'][1]; // Fallback to default lokomotiva body
            }
        } else {
            asset = assets['LOKOMOT'][1]; // Default lokomotiva body if no item was collected
        }
        ctx.drawImage(asset, part.x * TILE_SIZE, part.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
    });

    // Draw head
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

    // Calculate potential next position
    const nextX = train.x + train.dx;
    const nextY = train.y + train.dy;

    // Collision detection for the *next* tile
    const levelData = levels[currentLevel];
    // Check bounds first to prevent errors accessing levelData[nextY][nextX]
    if (nextY < 0 || nextY >= MAP_ROWS || nextX < 0 || nextX >= MAP_COLS) {
        gameOver = true; // Collision with border
        return;
    }
    const nextTile = levelData[nextY][nextX];

    // Wall collision
    if (nextTile === TILES.ZED || nextTile === TILES.STO || nextTile === TILES.RYB) {
        gameOver = true;
        return;
    }

    // Self collision (check against existing body parts *before* moving the head)
    for (let i = 0; i < train.body.length; i++) {
        const part = train.body[i];
        if (part.x === nextX && part.y === nextY) {
            gameOver = true;
            return;
        }
    }

    // Determine collected item type and update train length
    let collectedItemType = 0;
    if (nextTile >= TILES.JAB && nextTile <= TILES.LET) {
        collectedItemType = nextTile;
        train.length++; // Increase length only when an item is collected
        score += 10;
        itemsToCollect--;
        levelData[nextY][nextX] = 0; // Remove item from map
    } else if (nextTile === TILES.KRY) { // Crystal collection
        score += 50;
        levelData[nextY][nextX] = 0; // Remove crystal from map
    }

    // Update train head position
    train.x = nextX;
    train.y = nextY;

    // Add new head segment to body
    train.body.unshift({ x: train.x, y: train.y, type: collectedItemType });

    // Remove oldest segment if train is not growing (or shrinking)
    while (train.body.length > train.length) {
        train.body.pop();
    }

    // Level complete
    if (nextTile === TILES.VRA) {
        if (gateFrame < 5) { // Gate is not fully open
            gameOver = true;
            return;
        }
        currentLevel++;
        if (currentLevel >= levels.length) {
            gameOver = true;
            alert('You win!');
        } else {
            initLevel(currentLevel);
        }
    }

    // Gate animation
    if (itemsToCollect === 0 && gateFrame < 5) {
        gateAnimationCounter++;
        if (gateAnimationCounter % 5 === 0) { // Slow down gate animation
            gateFrame++;
        }
    }
}

function gameLoop() {
    animationFrame++;
    update();

    // Select the correct head asset based on direction and animation frame
    const frameIndex = animationFrame % 3;
    const lokomotAssets = assets['LOKOMOT'];
    let nextHeadAsset;

    if (train.dx === 1) { // Right
        const rightFrames = [lokomotAssets[2], lokomotAssets[6], lokomotAssets[10]];
        nextHeadAsset = rightFrames[frameIndex];
    } else if (train.dx === -1) { // Left
        const leftFrames = [lokomotAssets[0], lokomotAssets[4], lokomotAssets[8]];
        nextHeadAsset = leftFrames[frameIndex];
    } else if (train.dy === -1) { // Up
        const upFrames = [lokomotAssets[1], lokomotAssets[5], lokomotAssets[9]];
        nextHeadAsset = upFrames[frameIndex];
    } else if (train.dy === 1) { // Down
        const downFrames = [lokomotAssets[3], lokomotAssets[7], lokomotAssets[11]];
        nextHeadAsset = downFrames[frameIndex];
    }

    if (nextHeadAsset) {
        train.headAsset = nextHeadAsset;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawMap();
    drawTrain();
    drawScore();

    if (gameOver) {
        ctx.fillStyle = 'white';
        ctx.font = '120px Arial';
        ctx.fillText('Game Over', canvas.width / 2 - 300, canvas.height / 2);
    }

    setTimeout(gameLoop, 1000 / 5); // 5 FPS
}

// --- Hlavní funkce ---
function main() {
    console.log("Všechny obrázky načteny, startuji hru.");
    initLevel(currentLevel);
    gameLoop();
}

// Spuštění hry po načtení všech zdrojů
loadAssets(main);
