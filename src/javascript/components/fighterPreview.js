import { createElement } from '../helpers/domHelper';

export function createFighterPreview(fighter, position) {
  const positionClassName = position === 'right' ? 'fighter-preview___right' : 'fighter-preview___left';
  const fighterElement = createElement({
    tagName: 'div',
    className: `fighter-preview___root ${positionClassName}`,
  });
  console.log(fighter)

  if (fighter) {
    fighterElement.appendChild(createFighterImage(fighter));
    fighterElement.appendChild(createFighterDescription(fighter));
  }

  return fighterElement;
}

export function createFighterImage(fighter) {
  const { source, name } = fighter;
  const attributes = { 
    src: source, 
    title: name,
    alt: name 
  };
  const imgElement = createElement({
    tagName: 'img',
    className: 'fighter-preview___img',
    attributes,
  });

  return imgElement;
}

export function createFighterDescription(fighter) {
  const { name, health, attack, defense } = fighter;
  const descriptionElement = createElement({
    tagName: 'div',
    className: 'fighter-preview___description',
  });
  
  descriptionElement.innerHTML = `
    <h1>${name}</h1>
    <span>Health: ${health}HP</span></br>
    <span>Attack: ${attack}</span></br>
    <defence>Defence: ${defense}</defence></br>
  `;

  return descriptionElement;
}
