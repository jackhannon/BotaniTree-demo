import { plants } from "../data/PlantData";

type KeySets = {
  [key: string]: number;
};

const keySets: KeySets = {};

function initializeKeyset() {
  const highestPlantId = plants.sort((a,b) => b.id - a.id)[0]?.id
  keySets["plant"] = highestPlantId
}

initializeKeyset()

export function keyGen(keySetName: string) {
  typeof keySets[keySetName] === "number"
  ? keySets[keySetName]++
  : keySets[keySetName] = 0
  return keySets[keySetName]
}


export function generateName() {
  return `ST${keySets["plant"] + 1 || 0}`
}