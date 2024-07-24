import React, { createContext, useContext} from 'react'
import { Group, Individual, Species } from '../types';
import { plants } from '../data/PlantData';
import { groups } from '../data/GroupData';
import { species } from '../data/SpeciesData';


type ProviderProps = {
  children: React.ReactNode;
}

type Context = {
 plants: Individual[]
 groups: Group[]
 species: Species
 group?: Group
 changeSpecies: (modifiedSpecies: Species) => void
 getCurrentSpecies: (itemId?: number) => Species | undefined
 getCurrentGroup: (itemId?: number) => Group | undefined
 getCurrentPlant: (itemId?: number) => Individual | undefined
 changePlant: (modifiedPlant: Individual) => void
 addPlant: (plant: Individual) => void
 removePlant: (id: number) => void
 changeGroup: (modifiedGroup: Group) => void
 addGroup: (plant: Group) => void
 removeGroup: (id: number) => void
 getNestedPlants: () => Individual[]
 getFlatFilteredPlants: (filters: string) => Individual[]
 getQueriedPlants: (query: string) => Individual[]
}

const PlantContext = createContext({} as Context);


export const usePlantContext = () => {
  return useContext(PlantContext)
}

export const PlantProvider: React.FC<ProviderProps> = ({children}) => {


  function addPlant(plant: Individual) {
    plants.push(plant)
    console.log(plants)
  }

  function removePlant(id: number) {
    const index = plants.findIndex(plant => plant.id === id)
    plants.splice(index, 1)
  }

  function changePlant(modifiedPlant: Individual) {
    const index = plants.findIndex(plant => plant.id === modifiedPlant.id)
    plants.splice(index, 1, modifiedPlant)
  }

  function addGroup(group: Group) {
    groups.push(group)
  }

  function removeGroup(id: number) {
    const index = plants.findIndex(plant => plant.id === id)
    groups.splice(index, 1)
  }

  function changeGroup(modifiedGroups: Group) {
    const index = groups.findIndex(plant => plant.id === modifiedGroups.id)
    groups.splice(index, 1, modifiedGroups)
  }

  function changeSpecies(modifiedSpecies: Species) {
    const index = species.findIndex(plant => plant.id === modifiedSpecies.id)
    species.splice(index, 1, modifiedSpecies)
  }



  function getNestedPlants() {
    function findChildrenOfMother(id?: number) {
      return plants.filter(plant => plant.mother_id === id)
    }

    const nestedPlants: Individual[] = []

    function recusivelyBuildTree(child: Individual) {
      const childrenMap = new Map()

      plants.forEach(plant => {
        if (plant.mother_id === child.id) {
          const childrenOfFather = childrenMap.get(plant.father_id) || []
          childrenMap.set(plant.father_id, [...childrenOfFather, {...plant, mates: []}])
        }
      })
   
      for (const [mateId, children] of childrenMap) {
        let mate = getCurrentPlant(mateId) as Individual || {}
        mate = {...mate}
        mate.children = [...children];
        mate.child_count = children.length;
        mate.children?.forEach(child => recusivelyBuildTree(child))
        child.mates.push(mate)
      }
    }

    findChildrenOfMother().forEach(plant => {
      plant = {...plant, mates: []}
      nestedPlants.push(plant);
      recusivelyBuildTree(plant);
    })
    return nestedPlants
  }



  function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }


  
  function getFlatFilteredPlants(filters: string) {
    function isValidEntry(entry: string[]) {
      const coercedEntry = 
        entry[1] === "false" 
        ? false
        : entry[1] === "true" 
        ? true 
        : entry[1] === "0"
        ? 0 
        : entry[1] === "undefined"
        ? undefined 
        : true
      return Boolean(coercedEntry)
    }

    const filtersArray = filters.split("&");
    const filtersEntries = filtersArray.map(filter => filter.split("="));
    const validEntries = filtersEntries.filter(isValidEntry);

    return plants.filter(plant => {
      return validEntries.every(filter => {
        let booleanValue: boolean | string = filter[1]
          if (filter[1] === "true") {
            booleanValue = true
          }
          if (filter[1] === "false") {
            booleanValue = false
          }

        if (filter[0] === "isClone") {
          return plant.is_clone === booleanValue
        }
        if (filter[0] === "isDead") {
          return plant.death_date !== undefined
        }
        if (filter[0] === "hasArtificialConditions") {
          return plant.is_artificial_conditions === booleanValue
        }
        if (filter[0] === "motherId") {
          return plant.mother_id === Number(filter[1])
        }
        if (filter[0] === "fatherId") {
          return plant.father_id === Number(filter[1])
        }
        if (filter[0] === "minWater") {
          const minWater = [...plant.water_values].sort((a, b) => {
            return Number(a.water_count) - Number(b.water_count)
          })[0].water_count
          return minWater >= Number(filter[1])
        }
        if (filter[0] === "maxWater") {
          const maxWater = [...plant.water_values].sort((a, b) => {
            return Number(b.water_count) - Number(a.water_count)
          })[0].water_count
          return maxWater <= Number(filter[1])
        }
        if (filter[0] === "minAge") {
          return Number(filter[1]) <= Number(plant.death_date)
        }
        if (filter[0] === "maxAge") {
          return Number(filter[1]) >= Number(plant.death_date)
        }
        if (filter[0] === "minLight") {
          return plant.light_value <= Number(filter[1])
        }
        if (filter[0] === "maxLight") {
          return plant.light_value >= Number(filter[1])
        }
        if (filter[0] === "query") {
          const escapedQuery = escapeRegExp(filter[1]);
          const regex = new RegExp(escapedQuery, 'i');
          return regex.test(plant.name)
        }
      })
    })
  }
  


  function getCurrentGroup(itemId?: number) {
    return groups.find(group => group.id === itemId)
  }



  function getCurrentPlant(itemId?: number) {
    return plants.find(plant => plant.id === itemId)
  }



  function getQueriedPlants(query: string) {
    return plants.filter((plant) => {
      const escapedQuery = escapeRegExp(query);
      const regex = new RegExp(escapedQuery, 'i');
      return regex.test(plant.name)
    })
  }


  function getCurrentSpecies(itemId?: number) {
    return species.find(group => group.id === itemId)
  }



  const context = {

    species: species[0],
    group: undefined,
    plants,
    groups,
    changeSpecies,
    getCurrentSpecies,
    changePlant,
    addPlant,
    removePlant,
    changeGroup,
    addGroup,
    removeGroup,
    getNestedPlants,
    getFlatFilteredPlants,
    getCurrentGroup,
    getCurrentPlant,
    getQueriedPlants
  }

  return (
    <PlantContext.Provider value={context}>
      {children}
    </PlantContext.Provider>
  )
}

