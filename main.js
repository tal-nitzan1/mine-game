const grid = document.querySelector(".grid");
const counterDisplay = document.getElementById("counter");
const diamondCounterDisplay = document.getElementById("diamondCounter");
const clickSound = document.getElementById("clickSound");
let counter = 0;
let diamondCounter = 0;
let tileCount = 36;
let totalBlocks = 720;
let blockBrake = 36;
let layer1 = 20;

for (let i = 0; i < tileCount; i++) {
    // This is the place i'm creating the tiles
    const cell = document.createElement("div");
    cell.classList.add("cell");

    let tileData = {
        value: 1,
        type: "Normal",
        hp: 2,
        hp2: 0,
    };

    // all first tiles are normal always
    cell.data = tileData;

    cell.data.hp2 = cell.data.hp;

    cell.innerHTML = `
        <span class="value">`+ cell.data.value + `</span>
        <span class="emoji"></span>`;

    cell.addEventListener("click", function () {

        if(layer(cell)){
        playTileSound(cell);
        blockBrake++;

        cell.data.hp2--;
        if(cell.data.hp2 <= 0){
            cell.data.value++; // This is a simple cell - the rule for those is to always add 1 to its money value when digging.
            cell.data.hp *= 2;
            counter += cell.data.value; // add clicked value to the overall money count
            cell.data.hp2 = cell.data.hp;
        }
        
        counterDisplay.textContent = counter;
        diamondCounterDisplay.textContent = diamondCounter;
        
        cell.data = GetNextTileData(cell); // this will generate another tile

        if (cell.data.type == "TNT") {
            cell.innerHTML = `
        <span class="value">`+ cell.data.value + `</span>
        <span class="emoji">🧨</span>`;
        }
        if (cell.data.type == "Diamond") {
            cell.innerHTML = `
        <span class="value">`+ cell.data.value + `</span>
        <span class="emoji">💎</span>`;
        }
        if (cell.data.type == "Normal") {
            cell.innerHTML = `
        <span class="value">`+ cell.data.value + `</span>
        <span class="emoji"></span>`;
        }

        // Starting the animation
        this.classList.add("clicked");

        setTimeout(() => {
            this.style.setProperty("--cell-color", randomColor());
            this.classList.remove("clicked");
        }, 150);

        }

        this.classList.add("clicked");
        setTimeout(() => {
            this.classList.remove("clicked");
        }, 150);
        
        

    });

    grid.appendChild(cell);
    
}

function playTileSound(cell) {
    if (cell.data.type == "TNT") {
        playSound("soundTNT");
    } else if (cell.data.type == "Diamond") {
        playSound("soundDiamond");
        diamondCounter++;
    } else {
        playSound("soundNormal");
    }
}

// generate random color to a tile
function randomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

function playSound(id) {
    const sound = document.getElementById(id).cloneNode();
    sound.play();
}

function randomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// this will generate another tile from the different type we can build. the data define how the tile acts and it role.
function GetNextTileData(cell) {

    var tileDataNormal = {
        value: cell.data.value,
        type: "Normal",
        hp: cell.data.hp,
    };
    var tileDataTNT = {
        value: cell.data.value,
        type: "TNT",
        hp: cell.data.hp,
    };
    var tileDataDiamond = {
        value: cell.data.value,
        type: "Diamond",
        hp: cell.data.up,
    };

    // use weight method to generarte random tiles but to make sure what we generate
    let num = randomInRange(1, 1000000);
    if (num >= 1 && num <= 925000) {
        return tileDataNormal;
    }
    if (num > 925000 && num <= 980000) {
        return tileDataTNT;
    }
    if (num > 980000 && num <= 1000000) {
        return tileDataDiamond;
    }
}

function layer(cell){
    if(cell.data.value == layer1){
        if(blockBrake < totalBlocks){
            playSound("errorSound");
            return false;
        }
        if(blockBrake == totalBlocks){
            blockBrake = 0;
            layer1 *= 2;
        }
    }
    return true;    
}


