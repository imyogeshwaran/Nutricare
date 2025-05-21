import React, { useState } from 'react';

const nutrients = [
  {
    name: 'Vitamin D',
    amount: '600 IU',
    img: 'https://as2.ftcdn.net/v2/jpg/01/45/73/05/1000_F_145730503_UUvnzBvLFHCWD2BsQ4exw6fwg6FW2tcM.jpg', // Salmon
    desc: 'Vitamin D helps your body absorb calcium and plays a crucial role in bone health, immune function, and cell growth.',
    benefits: ['Strengthens bones & teeth', 'Supports immune system'],
    deficiency: ['Fatigue', 'Bone pain'],
    cdc: 'https://www.cdc.gov/infant-toddler-nutrition/vitamins-minerals/vitamin-d.html?CDC_AAref_Val=https://www.cdc.gov/nutrition/infantandtoddlernutrition/vitamins-minerals/vitamin-d.html',
  },
  {
    name: 'Vitamin B12',
    amount: '2.4 mcg',
    img: 'https://as2.ftcdn.net/v2/jpg/12/27/29/71/1000_F_1227297131_uDB6DEA0UFAuGJ0kcw2pfaqrN1k93lQx.jpg', // Salmon (for variety, but let's use eggs)
    desc: 'Vitamin B12 is essential for nerve tissue health, brain function, and the production of red blood cells.',
    benefits: ['Supports the formation of red blood cells', 'Prevents a type of anemia'],
    deficiency: ['Extreme fatigue', 'Lack of energy'],
    cdc: 'https://www.cdc.gov/nutrition/infantandtoddlernutrition/vitamins-minerals/vitamin-b12.html',
  },
  {
    name: 'Iron',
    amount: '18 mg',
    img: 'https://t4.ftcdn.net/jpg/12/56/52/03/240_F_1256520305_4sCntIC7veroOZhhbDGDzMAkz3xx4JDy.jpg', // Red meat
    desc: 'Iron is an essential mineral that helps red blood cells transport oxygen throughout the body.',
    benefits: ['Essential for the formation of hemoglobin', 'Supports energy production'],
    deficiency: ['Extreme fatigue', 'Weakness'],
    cdc: 'https://www.cdc.gov/infant-toddler-nutrition/vitamins-minerals/iron.html',
  },
  {
    name: 'Magnesium',
    amount: '400 mg',
    img: 'https://as1.ftcdn.net/v2/jpg/02/13/35/14/1000_F_213351493_DrkynW7d5DXbfiXaQDA8HGGUY0z5zKm3.jpg', // Nuts
    desc: 'Magnesium is involved in over 300 biochemical reactions in the body and is crucial for muscle and nerve function.',
    benefits: ['Boosts immune function', 'Regulates blood pressure'],
    deficiency: ['Muscle cramps', 'Mental disorders'],
    cdc: 'https://www.cdc.gov/nutrition/infantandtoddlernutrition/vitamins-minerals/magnesium.html',
  },
  {
    name: 'Zinc',
    amount: '11 mg',
    img: 'https://as1.ftcdn.net/v2/jpg/02/33/03/62/1000_F_233036228_ntv01hUs1YGlnmkKoBuo1Heo18fZfQhI.jpg', // Oysters
    desc: 'Zinc is vital for immune function, protein synthesis, wound healing, DNA synthesis, and cell division.',
    benefits: ['Improves immune function', 'Accelerates wound healing'],
    deficiency: ['Impaired immune function', 'Hair loss'],
    cdc: 'https://www.cdc.gov/nutrition/infantandtoddlernutrition/vitamins-minerals/zinc.html',
  },
  {
    name: 'Calcium',
    amount: '1000 mg',
    img: 'https://as1.ftcdn.net/v2/jpg/01/08/25/34/1000_F_108253412_8Kr9xAUGS4I4vwUbssFkS1cWAKz0RDmQ.jpg', // Milk
    desc: 'Calcium is necessary for strong bones and teeth, muscle contraction, and nerve signaling.',
    benefits: ['Builds strong bones', 'Supports muscle function'],
    deficiency: ['Osteoporosis', 'Numbness'],
    cdc: 'https://www.cdc.gov/nutrition/infantandtoddlernutrition/vitamins-minerals/calcium.html',
  },
  {
    name: 'Vitamin C',
    amount: '90 mg',
    img: 'https://as1.ftcdn.net/v2/jpg/11/10/64/16/1000_F_1110641603_ABBp8KbZthB9Ye667ip9RjZr4z7AK4oU.jpg', // Oranges
    desc: 'Vitamin C is an antioxidant that supports immune health, collagen production, and iron absorption.',
    benefits: ['Boosts immune system', 'Promotes healthy skin'],
    deficiency: ['Scurvy', 'Bleeding gums'],
    cdc: 'https://www.cdc.gov/nutrition/infantandtoddlernutrition/vitamins-minerals/vitamin-c.html',
  },
  {
    name: 'Folate',
    amount: '400 mcg',
    img: 'https://as2.ftcdn.net/v2/jpg/08/61/30/19/1000_F_861301999_bjwHD5aq6BOsDrBHTKIJ4fgm7ibUy7Nt.jpg', // Leafy greens
    desc: 'Folate is important for cell division and the formation of DNA and other genetic material.',
    benefits: ['Prevents neural tube defects', 'Supports cell growth'],
    deficiency: ['Anemia', 'Fatigue'],
    cdc: 'https://www.cdc.gov/nutrition/infantandtoddlernutrition/vitamins-minerals/folate.html',
  },
  {
    name: 'Potassium',
    amount: '4700 mg',
    img: 'https://as2.ftcdn.net/v2/jpg/12/05/19/11/1000_F_1205191120_HsJXdwaBWbUPuJ9HUjDwiMTIN3WnVDpY.jpg', // Bananas
    desc: 'Potassium is essential for proper cell function, nerve transmission, and muscle contraction.',
    benefits: ['Regulates fluid balance', 'Supports heart health'],
    deficiency: ['Muscle weakness', 'Irregular heartbeat'],
    cdc: 'https://www.cdc.gov/nutrition/infantandtoddlernutrition/vitamins-minerals/potassium.html',
  },
  {
    name: 'Iodine',
    amount: '150 mcg',
    img: 'https://as2.ftcdn.net/v2/jpg/02/57/53/85/1000_F_257538591_D5We5Dw6yVN0BTCiPaHLz4RoakXGWKxa.jpg', // Seaweed
    desc: 'Iodine is required for the production of thyroid hormones, which regulate metabolism.',
    benefits: ['Supports thyroid function', 'Regulates metabolism'],
    deficiency: ['Goiter', 'Cognitive impairment'],
    cdc: 'https://www.cdc.gov/nutrition/infantandtoddlernutrition/vitamins-minerals/iodine.html',
  },
  {
    name: 'Vitamin A',
    amount: '900 mcg',
    img: 'https://as1.ftcdn.net/v2/jpg/02/91/94/82/1000_F_291948291_spxq4o5NKJi6A6B2eAkhgNh9xWR364Ap.jpg', // Carrots
    desc: 'Vitamin A is important for vision, immune function, and reproduction. It also helps the heart, lungs, and kidneys function properly.',
    benefits: ['Supports healthy vision', 'Boosts immune system'],
    deficiency: ['Night blindness', 'Increased infection risk'],
    cdc: 'https://www.cdc.gov/nutrition/infantandtoddlernutrition/vitamins-minerals/vitamin-a.html',
  },
  {
    name: 'Selenium',
    amount: '55 mcg',
    img: 'https://as1.ftcdn.net/v2/jpg/00/22/85/80/1000_F_22858095_1bQrDmeNt0NEV9HxUWx53QKBXuDeA651.jpg', // Brazil nuts
    desc: 'Selenium is a trace mineral that plays a critical role in metabolism and thyroid function and helps protect your body from damage caused by oxidative stress.',
    benefits: ['Protects against oxidative stress', 'Supports thyroid health'],
    deficiency: ['Weakened immune system', 'Heart disease risk'],
    cdc: 'https://www.cdc.gov/nutrition/infantandtoddlernutrition/vitamins-minerals/selenium.html',
  },
];

const NutrientsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>([]);
  const [selectedDeficiencies, setSelectedDeficiencies] = useState<string[]>([]);

  // Collect all unique benefits and deficiencies
  const allBenefits = Array.from(new Set(nutrients.flatMap(n => n.benefits)));
  const allDeficiencies = Array.from(new Set(nutrients.flatMap(n => n.deficiency)));

  // Filtering logic
  const filteredNutrients = nutrients.filter(nutrient => {
    const matchesSearch = nutrient.name.toLowerCase().includes(search.toLowerCase());
    const matchesBenefit = selectedBenefits.length === 0 || selectedBenefits.some(b => nutrient.benefits.includes(b));
    const matchesDeficiency = selectedDeficiencies.length === 0 || selectedDeficiencies.some(d => nutrient.deficiency.includes(d));
    return matchesSearch && matchesBenefit && matchesDeficiency;
  });

  const handleBenefitChange = (benefit: string) => {
    setSelectedBenefits(prev => prev.includes(benefit) ? prev.filter(b => b !== benefit) : [...prev, benefit]);
  };
  const handleDeficiencyChange = (def: string) => {
    setSelectedDeficiencies(prev => prev.includes(def) ? prev.filter(d => d !== def) : [...prev, def]);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-2 text-emerald-700">Nutrient Library</h1>
        <p className="mb-8 text-gray-600 text-lg">Explore our comprehensive collection of essential micronutrients, their benefits, deficiency symptoms, and food sources.</p>
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <input
            type="text"
            placeholder="Search for nutrients..."
            className="w-full md:w-1/3 px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-400"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className="relative">
            <button
              className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg font-semibold hover:bg-emerald-200 transition"
              onClick={() => setShowFilter(v => !v)}
              type="button"
            >
              Filters
            </button>
            {showFilter && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4">
                <div className="mb-3">
                  <span className="font-semibold text-gray-700">Filter by Benefit:</span>
                  <div className="max-h-32 overflow-y-auto mt-1">
                    {allBenefits.map(benefit => (
                      <label key={benefit} className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={selectedBenefits.includes(benefit)}
                          onChange={() => handleBenefitChange(benefit)}
                          className="mr-2"
                        />
                        {benefit}
                      </label>
                    ))}
                  </div>
                </div>
                <div className="mb-3">
                  <span className="font-semibold text-gray-700">Filter by Deficiency:</span>
                  <div className="max-h-32 overflow-y-auto mt-1">
                    {allDeficiencies.map(def => (
                      <label key={def} className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={selectedDeficiencies.includes(def)}
                          onChange={() => handleDeficiencyChange(def)}
                          className="mr-2"
                        />
                        {def}
                      </label>
                    ))}
                  </div>
                </div>
                <button
                  className="mt-2 w-full bg-emerald-600 text-white py-1 rounded hover:bg-emerald-700"
                  onClick={() => setShowFilter(false)}
                  type="button"
                >
                  Apply Filters
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNutrients.length === 0 ? (
            <div className="col-span-full text-center text-gray-500">No nutrients found.</div>
          ) : (
            filteredNutrients.map((nutrient) => (
              <div key={nutrient.name} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition cursor-pointer" onClick={() => window.open(nutrient.cdc, '_blank')}>
                <img src={nutrient.img} alt={nutrient.name} className="w-full h-40 object-cover" />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold text-gray-800">{nutrient.name}</h2>
                    <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">{nutrient.amount}</span>
                  </div>
                  <p className="text-gray-600 mb-3 text-sm">{nutrient.desc}</p>
                  <div className="mb-2">
                    <span className="font-semibold text-gray-700">Key Benefits:</span>
                    <ul className="list-disc list-inside text-emerald-700 text-sm">
                      {nutrient.benefits.map((b, i) => <li key={i}>{b}</li>)}
                    </ul>
                  </div>
                  <div>
                    <span className="font-semibold text-gray-700">Deficiency Signs:</span>
                    <ul className="list-disc list-inside text-rose-600 text-sm">
                      {nutrient.deficiency.map((d, i) => <li key={i}>{d}</li>)}
                    </ul>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NutrientsPage;
