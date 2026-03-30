const grid = document.querySelector(".grid");
const drillUpgradeLevelDisplay = document.getElementById("drillUpgradeLevel");
const diamondCounterDisplay = document.getElementById("diamondCounter");
const clickSound = document.getElementById("clickSound");
const drillUpgradeCostDisply = document.getElementById("drillUpgradeCost")
let diamondCounter = 200;
let tileCount = 36;
let totalBlocks = 720;
let blockBrake = 36;
let layer1 = 20;
let drillUpgradeCost = 1;
let drillUpgradeLevel = 1;
let dpc = 1;
let boom = [];
let bombHp = 0;

 diamondCounterDisplay.textContent = diamondCounter;
 drillUpgradeLevelDisplay.textContent = drillUpgradeLevel;
 drillUpgradeCostDisply.textContent = drillUpgradeCost;

for (let i = 0; i < tileCount; i++) {
    // This is the place i'm creating the tiles
    const cell = document.createElement("div");
    cell.classList.add("cell");

    boom[i] = cell

    let tileData = {
        value: 1,
        type: "Normal",
        hp: 1,
        hpFactor: 1,
    };

    // all first tiles are normal always
    cell.data = tileData;

    bombHp = cell.data.hp;

    cell.innerHTML = `
        <span class="value">`+ cell.data.value + `</span>
        <span class="emoji"></span>
        <span class="hp-bar"><span class="hp-fill"></span></span>`;

    cell.addEventListener("click", function () { //this happen everytime a user click on a tile

        clickEvent(cell);
    });

    grid.appendChild(cell);
    
}

function clickEvent(cell){
        if(layer(cell)){
            playTileSound(cell);
            blockBrake++;

            // decrease HP
            cell.data.hp -= dpc;

            if(cell.data.hp < 0){
                cell.data.hp = 0;
            }

    

            let fillSpan = cell.querySelector(".hp-fill");
            if (fillSpan) {
                
                // Calculate the percentage of HP left
                let hpPercentage = (cell.data.hp / cell.data.hpFactor) * 100;
                 if (cell.data.type == "TNT"){
                    hpPercentage = 0; //if this is a bomb we will go directly to zero !
                    cell.data.hp = 0;
                 }
                fillSpan.style.width = hpPercentage + "%";
            }

            if(cell.data.hp == 0){
                // this means the tile exploded ! - need to generate also the next layer
                
                cell.data.value++; // This is a simple cell - the rule for those is to always add 1 to its money value when digging.
                cell.data.hpFactor +=2;
                cell.data.hp = cell.data.hpFactor; //this line set how much the HP increase in next layer

                if(cell.data.type == "Diamond"){
                    playSound("soundDiamond");
                    diamondCounter++;
                }

                diamondCounterDisplay.textContent = diamondCounter;
                
                
                cell.data = GetNextTileData(cell); // this will generate another tile

                // 2. WAIT 150ms for the green bar to finish shrinking before resetting the HTML
                setTimeout(() => {
                    let emoji = "";
                    if (cell.data.type == "TNT") emoji = "🧨";
                    if (cell.data.type == "Diamond") emoji = "💎";

                    // Reset the inner HTML with a full bar again
                    cell.innerHTML = `
                        <span class="value">${cell.data.value}</span>
                        <span class="emoji">${emoji}</span>
                        <span class="hp-bar"><span class="hp-fill" style="width: 100%;"></span></span>`;
                        
                }, 150); //150 = 0.15 animation for fill we have in the css

                // Starting the animation
                cell.classList.add("clicked");

                setTimeout(() => {
                    cell.style.setProperty("--cell-color", randomColor());
                    cell.classList.remove("clicked");
                }, 150);

                }

                cell.classList.add("clicked");
                setTimeout(() => {
                    cell.classList.remove("clicked");
                }, 150);
            }
}

function bombClickEvent(cell){
    cell.data.hp = 0;
    clickEvent(cell);
}



function playTileSound(cell) {
    if (cell.data.type == "TNT") {
        playSound("soundTNT");
    } else if (cell.data.type == "Diamond") {
        playSound("soundNormal");
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

    let tileDataNormal = {
        value: cell.data.value,
        type: "Normal",
        hp: cell.data.hp,
        hpFactor: cell.data.hpFactor,
    };
    let tileDataTNT = {
        value: cell.data.value,
        type: "TNT",
        hp: cell.data.hp,
        hpFactor: cell.data.hpFactor,
    };
    let tileDataDiamond = {
        value: cell.data.value,
        type: "Diamond",
        hp: cell.data.hp,
        hpFactor: cell.data.hpFactor,
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


function upgradeDrill(){
    if(diamondCounter >= drillUpgradeCost){
        diamondCounter -= drillUpgradeCost;
        diamondCounterDisplay.textContent = diamondCounter;
        drillUpgradeLevel += 1;
        drillUpgradeLevelDisplay.textContent = drillUpgradeLevel;
        drillUpgradeCost += 3;
        drillUpgradeCostDisply.textContent = drillUpgradeCost;
        dpc++;
    }
}

function atomicBomb(){
    if(diamondCounter >= 100){
        for(let i = 0; i < boom.length; i++){
            bombClickEvent(boom[i])
            //playSound("soundTNT");
        }
        diamondCounter -= 100;
        diamondCounterDisplay.textContent = diamondCounter;
    }
}


