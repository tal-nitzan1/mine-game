const grid = document.querySelector(".grid");
const drillUpgradeLevelDisplay = document.getElementById("drillUpgradeLevel");
const diamondCounterDisplay = document.getElementById("diamondCounter");
const drillUpgradeCostDisply = document.getElementById("drillUpgradeCost")
const diamondMultiCostDisplay = document.getElementById("diamondMultiCost");
const diamondMultiLevelDisplay = document.getElementById("diamondMultiLevel");

let diamondCounter = 0;
let tileCount = 25;
let totalBlocks = 125;
let blockBrake = 25;
let layer1 = 5;
let drillUpgradeCost = 1;
let drillUpgradeLevel = 1;
let dpc = 1;
let boom = [];
let diamondMultiCost = 50;
let diamondMultiLevel = 1;
let diamondMulti = 1;

const layerImage = [
    "dirt.jpg",
    "claystone.jpg",
    "mudstone.jpg",
    "bedrock.jpg",
    "lavaseep.jpg",
    "magma.jpg",
    "goldveins.jpg",
    "obsidian.jpg",
    "crystalcavern.jpg",  
    "aliencore.jpg",
    "layer50.jpg"
];

 diamondCounterDisplay.textContent = diamondCounter;
 drillUpgradeLevelDisplay.textContent = drillUpgradeLevel;
 drillUpgradeCostDisply.textContent = drillUpgradeCost;
 diamondMultiCostDisplay.textContent = diamondMultiCost;

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
        currentLayer: 1,
    };

    // all first tiles are normal always
    cell.data = tileData;

    cell.innerHTML = `
    <span class="value">${cell.data.value}</span>
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

                blockBrake++;

                if(cell.data.type == "Diamond"){
                    playSound("soundDiamond");
                    diamondCounter += (2 * diamondMulti);
                }
                if(cell.data.type == "Chest"){
                    playSound("soundDiamond");
                    diamondCounter += (10 * diamondMulti);
                }

                diamondCounterDisplay.textContent = diamondCounter;
                
                
                cell.data = GetNextTileData(cell); // this will generate another tile

                cell.data.currentLayer++;

                let imageIndex = Math.floor((cell.data.currentLayer - 1) / 5);

                if (imageIndex >= layerImage.length) {
                    imageIndex = layerImage.length - 1;
                }

                const currentTileImage = layerImage[imageIndex];

                // 2. WAIT 150ms for the green bar to finish shrinking before resetting the HTML
                setTimeout(() => {
                    let emoji = "";
                    if (cell.data.type == "TNT") emoji = "🧨";
                    if (cell.data.type == "Diamond") emoji = "💎";
                    if (cell.data.type == "Chest") emoji = "💰";

                    // Reset the inner HTML with a full bar again
                    cell.innerHTML = `
                        <span class="value">${cell.data.value}</span>
                        <span class="emoji">${emoji}</span>
                        <span class="hp-bar"><span class="hp-fill" style="width: 100%;"></span></span>`;

                        cell.style.backgroundImage = "url(" + currentTileImage + ")";
                        
                }, 150); //150 = 0.15 animation for fill we have in the css

                // Starting the animation
                cell.classList.add("clicked");

                setTimeout(() => {
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
    } else {
        playSound("soundNormal");
    }
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
        currentLayer: cell.data.currentLayer,
    };
    let tileDataTNT = {
        value: cell.data.value,
        type: "TNT",
        hp: cell.data.hp,
        hpFactor: cell.data.hpFactor,
        currentLayer: cell.data.currentLayer
    };
    let tileDataDiamond = {
        value: cell.data.value,
        type: "Diamond",
        hp: cell.data.hp,
        hpFactor: cell.data.hpFactor,
        currentLayer: cell.data.currentLayer,
    };
    let tileDataChest = {
        value: cell.data.value,
        type: "Chest",
        hp: cell.data.hp,
        hpFactor: cell.data.hpFactor,
        currentLayer: cell.data.currentLayer,
    };

    // use weight method to generarte random tiles but to make sure what we generate
    let num = randomInRange(1, 1000000);
    if (num >= 1 && num <= 850000) {
        return tileDataNormal;
    }
    if (num > 850000 && num <= 900000) {
        return tileDataTNT;
    }
    if (num > 900000 && num <= 975000) {
        return tileDataDiamond;
    }
    if (num > 975000 && num <= 1000000) {
        return tileDataChest;
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
            layer1 += 5;
        }
        if(layer1 == 51){
            return false;
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
        drillUpgradeCost *= 2;
        drillUpgradeCostDisply.textContent = drillUpgradeCost;
        dpc++;
    }
}

function atomicBomb(){
    if(diamondCounter >= 100){
        for(let i = 0; i < boom.length; i++){
            bombClickEvent(boom[i])
            playSound("soundTNT");
        }
        diamondCounter -= 100;
        diamondCounterDisplay.textContent = diamondCounter;
    }
}

function upgradeDiamondMulti(){
    if(diamondCounter >= diamondMultiCost){
        diamondCounter -= diamondMultiCost;
        diamondCounterDisplay.textContent = diamondCounter;
        diamondMultiLevel += 1;
        diamondMultiLevelDisplay.textContent = diamondMultiLevel;
        diamondMultiCost *= 2;
        diamondMultiCostDisplay.textContent = diamondMultiCost;
        diamondMulti *= 2;
    }
}

const gameScreen = document.getElementById("gameScreen");
const mainMenu = document.getElementById("mainMenu");

gameScreen.style.display = "none";

function startGame(){

    mainMenu.style.opacity = "0";

    setTimeout(() => {

        mainMenu.style.display = "none";
        gameScreen.style.display = "flex";

    }, 500);
}

const worldMenu = document.getElementById("worldMenu");

function openWorldMenu(){

    mainMenu.style.display = "none";
    worldMenu.style.display = "flex";
}

function closeWorldMenu(){

    worldMenu.style.display = "none";
    mainMenu.style.display = "flex";
}

function toggleShop() {
    const shop = document.getElementById("shopMenu");
    if (shop.style.display === "flex") {
        shop.style.display = "none";
    } else {
        shop.style.display = "flex";
    }
}