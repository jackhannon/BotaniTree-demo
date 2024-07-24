import { DeltaStatic } from "quill";

export type Individual = {
  name: string
  images: string[]
  id: number
  description_html: string
  description_delta: DeltaStatic
  death_date?: number
  is_artificial_conditions: boolean
  is_clone: boolean
  mates: Individual[]
  children?: Individual[]
  child_count?: number
  water_values: WaterEntry[];
  substrate_values: SubstrateEntry[]
  light_value: number
  mother_id?: number
  father_id?: number
  group_id?: number
  generated_name?: string
  species_id: number
};

export type Mate = {
  name: string;
  images: string[];
  id: number;
  children: Individual[]
}

export type LeanLineageNode = {
  name: string;
  image?: string;
  id: number;
};

export type Filters = {
  isDead: boolean;
  isClone: boolean, 
  needsWater: boolean,
  needsFertilizer: boolean,
  hasArtificialConditions: boolean,
  mother: {motherName?: string, mother_id?: number},
  father: {fatherName?: string, father_id?: number},
  waterRange: {minWater?: number, maxWater?: number},
  ageRange: {minAge?: number, maxAge?: number},
  lightRange: {minLight?: number, maxLight?: number}
}

export type FilterObjectEntry<T> = {
  [K in keyof T]?: T[K];
};

export type FilterEntry = [string, string | number | boolean | FilterEntry];

export type FlatEntry = [string, string | number | boolean];


export type Species = {
  description_delta: DeltaStatic;
  description_html: string;
  substrate_values: SubstrateEntry[];
  water_values: WaterEntry[];
  light_value: number;
  name: string;
  images: string[];
  id: number;
}

export type Parent = {
  name: string;
  id: number;
}

export type SubstrateEntry = {
  substrate: string;
  percent: number
  color: string
}

export type WaterEntry = {
  month: string;
  water_count: number
}



export type Group =  {
  name: string;
  images?: string[];
  id: number;
  description_html?: string
  description_delta?: DeltaStatic
  water_values?: WaterEntry[];
  substrate_values?: SubstrateEntry[]
  light_value?: number
  species_id?: number
}