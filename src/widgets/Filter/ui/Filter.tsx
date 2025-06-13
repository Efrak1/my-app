'use client'
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Label } from '@/shared/ui/label';
import { Checkbox } from '@/shared/ui/checkbox';
import { Button } from '@/shared/ui/button';
import { Slider } from '@/shared/ui/slider';
import { Ram, FilterState } from './Filter.types';
import { Products } from './Product.mock'

const ALL_BRANDS = Array.from(new Set(Products.map(p => p.brand)));
const ALL_CAPACITIES = Array.from(new Set(Products.map(p => p.capacity))).sort((a, b) => a - b);
const ALL_TYPES = Array.from(new Set(Products.map(p => p.type))) as Ram['type'][];
const MAX_PRICE = Math.max(...Products.map(p => p.price));

const RAMFilter = () => {
  const [isClient, setIsClient] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    brands: [],
    capacities: [],
    types: [],
    priceRange: [0, MAX_PRICE]
  });

  const toggleFilter = useCallback((
    filterType: keyof FilterState,
    value: string | number
  ) => {
    setFilters(prev => {
      const currentValues = [...prev[filterType]] as (string | number)[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      
      return { ...prev, [filterType]: newValues };
    });
  }, []);

  const handlePriceChange = useCallback((values: number[]) => {
    setFilters(prev => ({
      ...prev,
      priceRange: [values[0], values[1]]
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      brands: [],
      capacities: [],
      types: [],
      priceRange: [0, MAX_PRICE]
    });
  }, []);

  const filteredProducts = useMemo(() => (
    Products.filter(product => {
      const [minPrice, maxPrice] = filters.priceRange;
      return (
        (!filters.brands.length || filters.brands.includes(product.brand)) &&
        (!filters.capacities.length || filters.capacities.includes(product.capacity)) &&
        (!filters.types.length || filters.types.includes(product.type)) &&
        product.price >= minPrice && 
        product.price <= maxPrice
      );
    })
  ), [filters]);

  useEffect(() => setIsClient(true), []);

  if (!isClient) return <SkeletonLoader />;

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4">
      <div className="w-full md:w-64 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold">Фильтры</h2>
          <Button variant="ghost" onClick={resetFilters}>Сбросить</Button>
        </div>

        <div>
          <Label className="font-semibold">Производитель</Label>
          <div className="mt-2 space-y-2">
            {ALL_BRANDS.map(brand => (
              <div key={brand} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand}`}
                  checked={filters.brands.includes(brand)}
                  onCheckedChange={() => toggleFilter('brands', brand)}
                />
                <Label htmlFor={`brand-${brand}`}>{brand}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="font-semibold">Объем модуля (ГБ)</Label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {ALL_CAPACITIES.map(capacity => (
              <div key={capacity} className="flex items-center space-x-2">
                <Checkbox
                  id={`capacity-${capacity}`}
                  checked={filters.capacities.includes(capacity)}
                  onCheckedChange={() => toggleFilter('capacities', capacity)}
                />
                <Label htmlFor={`capacity-${capacity}`}>{capacity}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="font-semibold">Тип памяти</Label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {ALL_TYPES.map(type => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${type}`}
                  checked={filters.types.includes(type)}
                  onCheckedChange={() => toggleFilter('types', type)}
                />
                <Label htmlFor={`type-${type}`}>{type}</Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="font-semibold">
            Цена: {filters.priceRange[0].toLocaleString()} - {filters.priceRange[1].toLocaleString()} ₽
          </Label>
          <div className="mt-4 px-2">
            <Slider
              min={0}
              max={MAX_PRICE}
              step={100}
              value={filters.priceRange}
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
                  <p className="text-sm text-muted-foreground">
                    {product.type} • {product.capacity} ГБ
                  </p>
                </div>
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <Button variant="outline">Сравнить</Button>
                <div className="text-lg font-bold">
                  {product.price.toLocaleString()} ₽
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SkeletonLoader = () => (
  <div className="flex flex-col md:flex-row gap-6 p-4">
    <div className="w-full md:w-64 space-y-6">
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-200 rounded w-1/3 animate-pulse" />
        <div className="h-8 bg-gray-200 rounded w-20 animate-pulse" />
      </div>
      
      {[...Array(3)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
          <div className="space-y-2">
            {[...Array(4)].map((_, j) => (
              <div key={j} className="flex items-center space-x-2">
                <div className="h-4 w-4 bg-gray-200 rounded" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      ))}
      
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2" />
        <div className="h-2 bg-gray-200 rounded-full mt-4" />
      </div>
    </div>
    
    <div className="flex-1">
      <div className="mb-4">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-2 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-1/3 animate-pulse" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
              <div className="h-8 bg-gray-200 rounded w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default RAMFilter;