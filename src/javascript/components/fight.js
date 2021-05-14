import { controls } from '../../constants/controls';

const pressedButtons = new Set();

export async function fight(firstFighter, secondFighter) {
  return new Promise((resolve) => {
    firstFighter = createFighterWrapper(firstFighter, 'left');
    secondFighter = createFighterWrapper(secondFighter, 'right');

    keydownAttackHandler = keydownAttackHandler.bind(null, firstFighter, secondFighter, resolve);
    keydownBlockHandler = keydownBlockHandler.bind(null, firstFighter, secondFighter);
    keydownCriticalAttackHandler = keydownCriticalAttackHandler.bind(null, firstFighter, secondFighter);
    keyupHandler = keyupHandler.bind(null, firstFighter, secondFighter);

    document.addEventListener('keydown', keydownBlockHandler, false);
    document.addEventListener('keydown', keydownAttackHandler, false);
    document.addEventListener('keydown', keydownCriticalAttackHandler, false);
    document.addEventListener('keyup', keyupHandler, false);
  });
}

function createFighterWrapper(fighter, position) {
  return {
    entity: fighter,
    health: fighter.health,
    healthIndicator: document.querySelector(`#${position}-fighter-indicator`),
    isBlocking: false,
    canDoCriticalHit: true
  }
}

function keydownAttackHandler(firstFighter, secondFighter, resolve, event) {
  let code = event.code;

  if (code === controls.PlayerOneAttack) {
    if (!firstFighter.isBlocking && !secondFighter.isBlocking) {
        secondFighter.health -= Math.min(getDamage(firstFighter.entity, secondFighter.entity), secondFighter.health);
        secondFighter.healthIndicator.style.width = `${100 / secondFighter.entity.health * secondFighter.health}%`;
        if (secondFighter.health == 0) {
          clearFightEvents();
          resolve(firstFighter.entity);
        }
        
    }
  }

  if (code === controls.PlayerTwoAttack) {
    if (!secondFighter.isBlocking && !firstFighter.isBlocking) {
        firstFighter.health -= Math.min(getDamage(secondFighter.entity, firstFighter.entity), firstFighter.health);
        firstFighter.healthIndicator.style.width = `${100 / firstFighter.entity.health * firstFighter.health}%`;
        if (firstFighter.health == 0) {
          clearFightEvents();
          resolve(secondFighter.entity);
        }
    }
  }
}

function keydownCriticalAttackHandler(firstFighter, secondFighter, event) {
  let code = event.code;

  pressedButtons.add(code);

  const isSubset = (combination) => combination.every(buttonKey => pressedButtons.has(buttonKey));

  const setCriticalHitTimeout = (fighter, time) => {
    setTimeout(() => {
      fighter.canDoCriticalHit = true;
    }, time)
  }

  if (isSubset(controls.PlayerOneCriticalHitCombination) && firstFighter.canDoCriticalHit) {
    secondFighter.health -= getCriticalDamage(firstFighter.entity);
    secondFighter.healthIndicator.style.width = `${100 / secondFighter.entity.health * secondFighter.health}%`;
    firstFighter.canDoCriticalHit = false;
    setCriticalHitTimeout(firstFighter, 10000);
  }

  if (isSubset(controls.PlayerTwoCriticalHitCombination) && secondFighter.canDoCriticalHit) {
    firstFighter.health -= getCriticalDamage(secondFighter.entity);
    firstFighter.healthIndicator.style.width = `${100 / firstFighter.entity.health * firstFighter.health}%`;
    secondFighter.canDoCriticalHit = false;
    setCriticalHitTimeout(secondFighter, 10000);
  }
}

function keydownBlockHandler(firstFighter, secondFighter, event) {
  let code = event.code;

  if (code === controls.PlayerOneBlock) {
    firstFighter.isBlocking = true;
  }
    
  if (code === controls.PlayerTwoBlock) {
    secondFighter.isBlocking = true;
  }
}


function keyupHandler(firstFighter, secondFighter, event) {
  let code = event.code;
  
  pressedButtons.delete(code);
  
  if (code === controls.PlayerOneBlock) {
    firstFighter.isBlocking = false;
  }

  if (code === controls.PlayerTwoBlock) {
    secondFighter.isBlocking = false;
  }
}

function clearFightEvents() {
  document.removeEventListener('keydown', keydownAttackHandler, false);
  document.removeEventListener('keydown', keydownCriticalAttackHandler, false);
  document.removeEventListener('keydown', keydownBlockHandler, false);
  document.removeEventListener('keyup', keyupHandler, false);
}

function getCriticalDamage(fighter) {
  return fighter.attack * 2;
}

export function getDamage(attacker, defender) {
  const damage = getHitPower(attacker) - getBlockPower(defender);
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
