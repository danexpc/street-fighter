import { controls } from '../../constants/controls';

let pressedButtons = [];
let isPlayerOneCanDoCriticalHit = false;
let isPlayerTwoCanDoCriticalHit = false;

export async function fight(firstFighter, secondFighter) {
  isPlayerOneCanDoCriticalHit = true;
  isPlayerTwoCanDoCriticalHit = true;
  return new Promise((resolve) => {
    firstFighter = {...firstFighter, maxHealth: firstFighter.health, isBlocking: false}
    secondFighter = {...secondFighter, maxHealth: secondFighter.health, isBlocking: false}

    keypressHandler = keypressHandler.bind(null, firstFighter, secondFighter, resolve);
    keydownHandler = keydownHandler.bind(null, firstFighter, secondFighter);
    keyupHandler = keyupHandler.bind(null, firstFighter, secondFighter);

    document.addEventListener('keydown', keydownHandler, false);

    document.addEventListener('keyup', keyupHandler, false);

    document.addEventListener('keypress', keypressHandler, false);
  });
}

function keydownHandler(firstFighter, secondFighter, event) {
  let code = event.code;
  pressedButtons.push(code);
  if (isSubset(pressedButtons, controls.PlayerOneCriticalHitCombination) && isPlayerOneCanDoCriticalHit) {
    console.log("Crit 1");
    secondFighter.health -= firstFighter.attack * 2;
    document.querySelector('#right-fighter-indicator.arena___health-bar').style.width = (secondFighter.health/secondFighter.maxHealth) * 100 + '%';
    isPlayerOneCanDoCriticalHit = false;
    setTimeout(() => {
      isPlayerOneCanDoCriticalHit = true;
    }, 10000)
  }

  if (isSubset(pressedButtons, controls.PlayerTwoCriticalHitCombination) && isPlayerTwoCanDoCriticalHit) {
    console.log("Crit 2");
    firstFighter.health -= secondFighter.attack * 2;
    document.querySelector('#left-fighter-indicator.arena___health-bar').style.width = (firstFighter.health/firstFighter.maxHealth) * 100 + '%';
    isPlayerTwoCanDoCriticalHit = false;
    setTimeout(() => {
      isPlayerTwoCanDoCriticalHit = true;
    }, 10000)
  }

  if (code === controls.PlayerOneBlock) {
    firstFighter.isBlocking = true;
  }
    
  if (code === controls.PlayerTwoBlock) {
    secondFighter.isBlocking = true;
  }
}

function keyupHandler(firstFighter, secondFighter, event) {
  let code = event.code;
  let index = pressedButtons.indexOf(code);
  if (index !== -1) {
    pressedButtons.splice(index, 1);
  }
  if (code === controls.PlayerOneBlock) {
    firstFighter.isBlocking = false;
  }

  if (code === controls.PlayerTwoBlock) {
    secondFighter.isBlocking = false;
  }
}


function keypressHandler(firstFighter, secondFighter, resolve, event) {
  let code = event.code;
  if (code === controls.PlayerOneAttack) {
    if (!firstFighter.isBlocking) {
      secondFighter.health -= getDamage(firstFighter, secondFighter);
      if (secondFighter.health <= 0) {
        clearFightEvents();
        resolve(firstFighter);
      }
      document.querySelector('#right-fighter-indicator.arena___health-bar').style.width = (secondFighter.health/secondFighter.maxHealth) * 100 + '%';
    }
  }
  if (code === controls.PlayerTwoAttack) {
    if (!secondFighter.isBlocking) {
      firstFighter.health -= getDamage(secondFighter, firstFighter);
      if (firstFighter.health <= 0) {
        clearFightEvents();
        resolve(secondFighter);
      }
      document.querySelector('#left-fighter-indicator.arena___health-bar').style.width = (firstFighter.health/firstFighter.maxHealth) * 100 + '%';
    }
  }
}

function clearFightEvents() {
  document.removeEventListener('keypress', keypressHandler, false);
  document.removeEventListener('keydown', keydownHandler, false);
  document.removeEventListener('keyup', keyupHandler, false);
}

function isSubset(arr1, arr2) {
    let m = arr1.length;
    let n = arr2.length;
    let i = 0;
    let j = 0;
    for (i = 0; i < n; i++) {
      for (j = 0; j < m; j++)
        if (arr2[i] == arr1[j])
          break;
      if (j == m)
        return false;
    }
    return true;
}

export function getDamage(attacker, defender) {
  const damage = getHitPower(attacker) - (defender.isBlocking ? getBlockPower(defender) : 0);
  return damage > 0 ? damage : 0;
}

export function getHitPower(fighter) {
  return fighter.attack * getCriticalHitChance();
}

export function getBlockPower(fighter) {
  return fighter.defense * getDodgeChance();
}

function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function getCriticalHitChance() {
  return getRandomNumber(1, 2);
}

function getDodgeChance() {
  return getRandomNumber(1, 2);
}

