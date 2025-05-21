import React, { useState } from 'react';

const nutritionData: Record<string, Array<{ name: string; carbs: number; protein: number; fat: number }>> = {
  Fruits: [
    { name: 'Apple', carbs: 14, protein: 0.3, fat: 0.2 },
    { name: 'Banana', carbs: 23, protein: 1.1, fat: 0.3 },
    { name: 'Orange', carbs: 12, protein: 0.9, fat: 0.1 },
    { name: 'Mango', carbs: 15, protein: 0.8, fat: 0.4 },
    { name: 'Grapes', carbs: 18, protein: 0.7, fat: 0.2 },
    { name: 'Watermelon', carbs: 8, protein: 0.6, fat: 0.2 },
    { name: 'Pineapple', carbs: 13, protein: 0.5, fat: 0.1 },
    { name: 'Papaya', carbs: 11, protein: 0.5, fat: 0.3 },
    { name: 'Strawberry', carbs: 8, protein: 0.7, fat: 0.3 },
    { name: 'Guava', carbs: 14, protein: 2.6, fat: 1.0 }
  ],
  Veggies: [
    { name: 'Carrot', carbs: 10, protein: 0.9, fat: 0.2 },
    { name: 'Spinach', carbs: 1, protein: 2.9, fat: 0.4 },
    { name: 'Broccoli', carbs: 7, protein: 2.8, fat: 0.4 },
    { name: 'Cauliflower', carbs: 5, protein: 1.9, fat: 0.3 },
    { name: 'Potato', carbs: 17, protein: 2.0, fat: 0.1 },
    { name: 'Tomato', carbs: 4, protein: 0.9, fat: 0.2 },
    { name: 'Onion', carbs: 9, protein: 1.1, fat: 0.1 },
    { name: 'Peas', carbs: 14, protein: 5.4, fat: 0.4 },
    { name: 'Cabbage', carbs: 6, protein: 1.3, fat: 0.1 },
    { name: 'Brinjal', carbs: 6, protein: 1.0, fat: 0.2 }
  ],
  Cereals: [
    { name: 'Rice', carbs: 28, protein: 2.7, fat: 0.3 },
    { name: 'Wheat', carbs: 27, protein: 3.6, fat: 0.4 },
    { name: 'Oats', carbs: 66, protein: 17, fat: 7 },
    { name: 'Barley', carbs: 73, protein: 12, fat: 2.3 },
    { name: 'Maize', carbs: 19, protein: 3.2, fat: 1.2 },
    { name: 'Millet', carbs: 72, protein: 11, fat: 4.2 },
    { name: 'Rye', carbs: 76, protein: 10, fat: 1.6 },
    { name: 'Quinoa', carbs: 21, protein: 4.4, fat: 1.9 },
    { name: 'Sorghum', carbs: 72, protein: 11, fat: 3.3 },
    { name: 'Buckwheat', carbs: 71, protein: 13, fat: 3.4 }
  ],
  Pulses: [
    { name: 'Chickpeas', carbs: 27, protein: 9, fat: 2.6 },
    { name: 'Lentils', carbs: 20, protein: 9, fat: 0.4 },
    { name: 'Kidney beans', carbs: 22, protein: 8.7, fat: 0.5 },
    { name: 'Black gram', carbs: 59, protein: 25, fat: 1.6 },
    { name: 'Green gram', carbs: 63, protein: 24, fat: 1.2 },
    { name: 'Pigeon pea', carbs: 62, protein: 22, fat: 1.7 },
    { name: 'Soybean', carbs: 30, protein: 36, fat: 20 },
    { name: 'Peas (dry)', carbs: 61, protein: 25, fat: 1.2 },
    { name: 'Horse gram', carbs: 57, protein: 22, fat: 0.5 },
    { name: 'Moth bean', carbs: 60, protein: 23, fat: 1.6 }
  ],
  Meat: [
    { name: 'Chicken', carbs: 0, protein: 27, fat: 3.6 },
    { name: 'Beef', carbs: 0, protein: 26, fat: 15 },
    { name: 'Pork', carbs: 0, protein: 25, fat: 21 },
    { name: 'Lamb', carbs: 0, protein: 25, fat: 21 },
    { name: 'Fish', carbs: 0, protein: 22, fat: 5 },
    { name: 'Turkey', carbs: 0, protein: 29, fat: 1 },
    { name: 'Duck', carbs: 0, protein: 27, fat: 14 },
    { name: 'Goat', carbs: 0, protein: 27, fat: 3 },
    { name: 'Prawn', carbs: 0, protein: 24, fat: 0.8 },
    { name: 'Egg', carbs: 1, protein: 13, fat: 11 }
  ]
};

const categories = Object.keys(nutritionData);

const NutritionTable: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 flex flex-col items-center py-10 px-4">
      <h1 className="text-3xl font-bold text-teal-700 mb-6 text-center">Nutrition Facts per 100g</h1>
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full font-semibold shadow-sm transition-all duration-200
              ${selectedCategory === cat ? 'bg-teal-600 text-white' : 'bg-white text-teal-700 border border-teal-300 hover:bg-teal-100'}`}
          >
            {cat}
          </button>
        ))}
      </div>
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-teal-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Food Item</th>
              <th className="py-3 px-4 text-left">Carbohydrates (g)</th>
              <th className="py-3 px-4 text-left">Protein (g)</th>
              <th className="py-3 px-4 text-left">Fat (g)</th>
            </tr>
          </thead>
          <tbody>
            {nutritionData[selectedCategory].map((item) => (
              <tr key={item.name} className="even:bg-teal-50">
                <td className="py-2 px-4 font-medium">{item.name}</td>
                <td className="py-2 px-4">{item.carbs}</td>
                <td className="py-2 px-4">{item.protein}</td>
                <td className="py-2 px-4">{item.fat}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NutritionTable;
