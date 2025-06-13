export interface Ram {
    id: number;
    brand: string;
    model: string;
    capacity: number;
    type: 'DDR3' | 'DDR4' | 'DDR5';
    price: number;
}

export interface FilterState {
  brands: string[];
  capacities: number[];
  types: Ram['type'][];
  priceRange: [number, number];
}
