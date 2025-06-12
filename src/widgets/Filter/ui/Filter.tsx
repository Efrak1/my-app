'use client'
import { useState, useEffect, useMemo } from 'react';
import { Label } from '@/shared/ui/label';
import { Checkbox } from '@/shared/ui/checkbox';
import { Button } from '@/shared/ui/button';
import { Slider } from '@/shared/ui/slider';
import { Products } from './Product.mock';

const RAMFilter = () => {
  const initialProducts = Products;

  const [isClient, setIsClient] = useState(false);
  const [filters, setFilters] = useState({
    brands: [] as string[],
    capacities: [] as number[],
    types: [] as string[],
    minPrice: 0,
    maxPrice: 0,
  });

  const [allBrands, allCapacities, allTypes, maxPriceValue] = useMemo(() => {
    const brands = Array.from(new Set(initialProducts.map(p => p.brand)));
    const capacities = Array.from(new Set(initialProducts.map(p => p.capacity))).sort((a, b) => a - b);
    const types = Array.from(new Set(initialProducts.map(p => p.type)));
    const maxPrice = Math.max(...initialProducts.map(p => p.price), 0);
    
    return [brands, capacities, types, maxPrice];
  }, [initialProducts]);

  const filteredProducts = useMemo(() => {
    if (!isClient) return [];
    
    let result = initialProducts;
    
    if (filters.brands.length > 0) {
      result = result.filter(product => filters.brands.includes(product.brand));
    }
    
    if (filters.capacities.length > 0) {
      result = result.filter(product => filters.capacities.includes(product.capacity));
    }
    
    if (filters.types.length > 0) {
      result = result.filter(product => filters.types.includes(product.type));
    }
    
    result = result.filter(product => 
      product.price >= filters.minPrice && 
      product.price <= filters.maxPrice
    );

    return result;
  }, [filters, initialProducts, isClient]);

  useEffect(() => {
    setIsClient(true);
    setFilters(prev => ({
      ...prev,
      minPrice: 0,
      maxPrice: maxPriceValue
    }));
  }, [maxPriceValue]);

  const handleBrandChange = (brand: string) => {
    setFilters(prev => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter(b => b !== brand)
        : [...prev.brands, brand]
    }));
  };

  const handleCapacityChange = (capacity: number) => {
    setFilters(prev => ({
      ...prev,
      capacities: prev.capacities.includes(capacity)
        ? prev.capacities.filter(c => c !== capacity)
        : [...prev.capacities, capacity]
    }));
  };

  const handlePriceChange = (values: number[]) => {
    setFilters(prev => ({
      ...prev,
      minPrice: values[0],
      maxPrice: values[1]
    }));
  };

  const resetFilters = () => {
    setFilters({
      brands: [],
      capacities: [],
      types: [],
      minPrice: 0,
      maxPrice: maxPriceValue,
    });
  };

  if (!isClient) {
    return (
      <div className="flex flex-col md:flex-row gap-6 p-4">
        <div className="w-full md:w-64 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold">Фильтры</h2>
            <Button variant="ghost" disabled>
              Сбросить
            </Button>
          </div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="space-y-2">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="flex items-center space-x-2">
                    <div className="h-4 w-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex-1">
          <div className="mb-4">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4">
      <div className="w-full md:w-64 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Фильтры</h2>
          <Button variant="ghost" onClick={resetFilters}>
            Сбросить
          </Button>
        </div>

        <div>
          <Label className="font-semibold">Производитель</Label>
          <div className="mt-2 space-y-2">
            {allBrands.map(brand => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={filters.brands.includes(brand)}
                  onCheckedChange={() => handleBrandChange(brand)}
                />
                <Label htmlFor={`brand-${brand}`}>{brand}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="font-semibold">Объем модуля (ГБ)</Label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {allCapacities.map(capacity => (
              <div key={capacity} className="flex items-center space-x-2">
                <Checkbox
                  id={`capacity-${capacity}`}
                  checked={filters.capacities.includes(capacity)}
                  onCheckedChange={() => handleCapacityChange(capacity)}
                />
                <Label htmlFor={`capacity-${capacity}`}>{capacity}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="font-semibold">Тип памяти</Label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {allTypes.map(type => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${type}`}
                  checked={filters.types.includes(type)}
                  onCheckedChange={() => setFilters(prev => ({
                    ...prev,
                    types: prev.types.includes(type)
                      ? prev.types.filter(t => t !== type)
                      : [...prev.types, type]
                  }))}
                />
                <Label htmlFor={`type-${type}`}>{type}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="font-semibold">
            Цена: {filters.minPrice.toLocaleString()} - {filters.maxPrice.toLocaleString()} ₽
          </Label>
          <div className="mt-4 px-2">
            <Slider
              min={0}
              max={maxPriceValue}
              step={100}
              value={[filters.minPrice, filters.maxPrice]}
              onValueChange={handlePriceChange}
              minStepsBetweenThumbs={1}
            />
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Оперативная память</h1>
          <p className="text-muted-foreground">
            Найдено: {filteredProducts.length} товаров
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map(product => (
            <div key={product.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{product.brand} {product.model}</h3>
                  <p className="text-sm text-muted-foreground">{product.type} • {product.capacity} ГБ</p>
                </div>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <Button variant="outline">Сравнить</Button>
                <div className="text-lg font-bold">{product.price.toLocaleString()} ₽</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RAMFilter;