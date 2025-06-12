import { Ram } from "./Filter.types";

export const generateMockRams = (count: number): Ram[] => {
  const brands = [
    'HyperX', 'G.skill', 'Samsung', 'Corsair', 
    'Kingston', 'Crucial', 'Team Group', 'ADATA',
    'Patriot', 'Mushkin'
  ] as const; // Добавляем as const для безопасности типов
  
  // Явно указываем допустимые значения типа
  const types: Ram['type'][] = ['DDR3', 'DDR4', 'DDR5'];
  
  const capacities = [4, 8, 16, 32, 64] as const;
  
  const basePrices: Record<Ram['type'], number> = {
    'DDR3': 80,
    'DDR4': 120,
    'DDR5': 150
  };

  const typeWeights = [0.2, 0.5, 0.3];
  const capacityWeights = [0.1, 0.25, 0.35, 0.2, 0.1];

  const getRandomItem = <T extends Ram['type'] | number>(
    items: readonly T[],
    weights: number[]
  ): T => {
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    const random = Math.random() * totalWeight;
    
    let weightSum = 0;
    for (let i = 0; i < items.length; i++) {
      weightSum += weights[i];
      if (random <= weightSum) {
        return items[i];
      }
    }
    return items[items.length - 1];
  };

  const products: Ram[] = [];
  
  for (let i = 1; i <= count; i++) {
    // Убеждаем TypeScript, что type соответствует Ram['type']
    const type = getRandomItem<Ram['type']>(types, typeWeights);
    const capacity = getRandomItem(capacities, capacityWeights);
    const brand = brands[Math.floor(Math.random() * brands.length)];
    
    const basePrice = basePrices[type];
    const priceVariation = 0.8 + Math.random() * 0.7;
    const price = Math.round(basePrice * capacity * priceVariation);

    products.push({
      id: i,
      brand,
      model: '--',
      capacity,
      type,
      price
    });
  }

  return products;
};

// Генерация 200 продуктов
export const Products: Ram[] = generateMockRams(200);