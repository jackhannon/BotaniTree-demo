import React, { createContext, useContext, useState } from 'react'
import { FilterObjectEntry, Filters } from '../types';
import { isObjectLiteral } from '../utils/isObjectLiteral';

type initialState = {
  filters: Filters
  query: string
}


type FilterEntry = [string, string | number | boolean | FilterEntry];

type FlatEntry = [string, string | number | boolean];

type initialState = {
  filters: Filters
  query: string
}


const initialState = {
  filters: {
    isClone: false, 
    isDead: false,
    needsWater: false,
    needsFertilizer: false,
    hasArtificialConditions: false,
    mother: {motherName: undefined, motherId: undefined},
    father: {fatherName: undefined, fatherId: undefined},
    waterRange: {minWater: 0, maxWater: 0},
    ageRange: {minAge: 0, maxAge: 0},
    lightRange: {minLight: 0, maxLight: 0},
  },
  query: ""
}

type ProviderProps = {
  children: React.ReactNode;
}

type Context = {
  filters: Filters
  query: string,
  changeQuery: (query: string) => void
  changeFilters: (payload: FilterObjectEntry<Filters>) => void
  clearFilters: () => void
  getQueryParams: () =>  string
  countTruthyFilters: () => number
}

const HeaderContext = createContext({} as Context);


export const useHeaderContext = () => {
  return useContext(HeaderContext)
}

export const HeaderProvider: React.FC<ProviderProps> = ({children}) => {
  const [query, setQuery] = useState<string>("")
  const [filters, setFilters] = useState<Filters>(initialState.filters)


  function changeFilters(payload: FilterObjectEntry<Filters>) {
    setFilters(filters => ({
      ...filters,
      ...payload
    }))
  }

  function clearFilters() {
    setFilters(initialState.filters)
  }

  function changeQuery(query: string) {
    setQuery(query)
  }


  function selectFlatEntriesFromFilters(filters: Filters): [string, string | number | boolean][] {
    const flatEntries: [string, string | number | boolean][] = [];
    function recurseForFlatEntries(entries: FilterEntry[] | FlatEntry[]) {
      entries.forEach(([key, value]) => {
        if (isObjectLiteral(value)) {
          recurseForFlatEntries(Object.entries(value) as FilterEntry[]);
        } else {
          flatEntries.push([key, value as string | number | boolean]);
        }
      });
    }
    recurseForFlatEntries(Object.entries(filters) as FilterEntry[]);
    return flatEntries
  }
  
  
  function getQueryParams() {
      const flatEntries = selectFlatEntriesFromFilters(filters)
      flatEntries.push(["query", query])
      return flatEntries.map(pair => pair[0] + "=" + pair[1]).join("&")
  }
  
  
  function countTruthyFilters() {
    const flatEntries = selectFlatEntriesFromFilters(filters);
    return flatEntries.reduce((acc, entry) => {
      if (entry[0] === "motherName" || entry[0] === "fatherName") {
        return acc
      }
      if (entry[1]) {
        return acc += 1
      }
      return acc
    }, 0)
  }
  
  

  const context = {
    changeFilters,
    clearFilters,
    changeQuery,
    getQueryParams,
    countTruthyFilters,
    filters,
    query
  }

  return (
    <HeaderContext.Provider value={context}>
      {children}
    </HeaderContext.Provider>
  )
}

