export type AuthInfo = {
  name: string;
  email: string;
  lastLogin: number;
};

export type Dog = {
  id: string;
  img: string;
  name: string;
  age: number;
  zip_code: string;
  breed: string;
};

export type Location = {
  zip_code: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  county: string;
};

export type DogWithLocation = Dog & {
  location?: Location;
};

export type Coordinates = {
  lat: number;
  lon: number;
};

export type SearchDogsRequest = {
  breeds?: string[];
  from?: string;
  sort: string;
  size?: number;
  ageMin?: number;
  ageMax?: number;
};

export type SearchLocationRequest = {
  city?: string;
  states?: string[];
  geoBoundingBox?: {
    top?: number;
    left?: number;
    bottom?: number;
    right?: number;
    bottom_left?: Coordinates;
    top_left?: Coordinates;
  };
  size?: number;
  from?: number;
};

export type SearchLocationResponse = {
  results: Location[];
  total: number;
};

export type SearchDogsResponse = {
  next?: string;
  resultIds: string[];
  total: number;
};

export enum SortDirection {
  Ascending = "asc",
  Descending = "desc",
}

export enum SortBy {
  Breed = "breed",
  Name = "name",
  Age = "age",
}
