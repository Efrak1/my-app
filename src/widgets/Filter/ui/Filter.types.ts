export interface Ram {
    id: number;
    brand: string;
    model: string;
    capacity: number;
    type: 'DDR3' | 'DDR4' | 'DDR5';
    price: number;
}