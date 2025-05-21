import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

interface Article {
  title: string;
  category: string;
  date: string;
  read: string;
  desc: string;
  img: string;
}

export const articles: Article[] = [
  {
    title: 'The Science of Micronutrients: How They Shape Your Health',
    category: 'Featured',
    date: 'May 20, 2025',
    read: '10 min read',
    desc: 'A deep dive into the critical role micronutrients play in cellular function, disease prevention, and overall wellbeing.',
    img: 'https://images.unsplash.com/photo-1502741338009-cac2772e18bc?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Micronutrients 101: What You Need to Know',
    category: 'Nutrition Basics',
    date: 'May 15, 2025',
    read: '8 min read',
    desc: 'An introduction to micronutrients, why they matter, and how they affect your health.',
    img: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80',
  },
  {
    title: 'Vitamin D Deficiency: Signs, Symptoms, and Solutions',
    category: 'Deficiencies',
    date: 'May 10, 2025',
    read: '12 min read',
    desc: 'Understanding vitamin D deficiency, its impact on health, and how to address it through diet and lifestyle.',
    img: 'https://t4.ftcdn.net/jpg/11/48/58/49/240_F_1148584943_x4tqBCSXdQCqLPfurYFfG2VUO0njUxXw.jpg',
  },
  {
    title: 'Top 10 Iron-Rich Foods for Combating Anemia',
    category: 'Food Sources',
    date: 'May 15, 2025',
    read: '7 min read',
    desc: 'Discover the best dietary sources of iron and how to incorporate them into your daily meals.',
    img: 'https://t3.ftcdn.net/jpg/13/76/26/20/240_F_1376262040_RxsuxDXc11D0VYCkIS448AxrOv1u2l4z.jpg',
  },
  {
    title: 'Getting Enough B12 on a Plant-Based Diet',
    category: 'Special Diets',
    date: 'April 28, 2025',
    read: '9 min read',
    desc: 'Strategies for vegans and vegetarians to ensure adequate vitamin B12 intake without animal products.',
    img: 'https://as1.ftcdn.net/v2/jpg/11/20/46/04/1000_F_1120460430_Dyc0H5a0nEc0hoc0lw4rydHKW4m1Tgee.jpg',
  },
  {
    title: 'Magnesium: The Overlooked Mineral Essential for Health',
    category: 'Minerals',
    date: 'April 20, 2025',
    read: '6 min read',
    desc: 'Why magnesium is crucial for over 300 bodily functions and how to ensure you’re getting enough.',
    img: 'https://as1.ftcdn.net/v2/jpg/13/46/79/34/1000_F_1346793489_OqTu57rWV4GdmmdemAXndCuwuL5kTaXN.jpg',
  },
  {
    title: 'Zinc and Immune Function: What Science Tells Us',
    category: 'Immunity',
    date: 'April 15, 2025',
    read: '11 min read',
    desc: 'The research-backed relationship between zinc levels and your body’s ability to fight infections.',
    img: 'https://as2.ftcdn.net/v2/jpg/10/75/12/51/1000_F_1075125191_4DtsUEhKMIamsPxQdDC8ppoDyM9rQDNj.jpg',
  },
  // ...add up to 10 articles if needed...
];

function getRandomArticles(count: number): Article[] {
  const shuffled = [...articles].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

const LearnPage: React.FC = () => {
  const navigate = useNavigate();
  const [mainArticles, setMainArticles] = useState<Article[]>(() => getRandomArticles(5));
  const [mainIndex, setMainIndex] = useState(0);
  const [latestArticles] = useState<Article[]>(() => getRandomArticles(6));

  const handleMainRefresh = () => {
    setMainArticles(getRandomArticles(5));
    setMainIndex(0);
  };

  const handleNextMain = () => {
    setMainIndex((prev) => (prev + 1) % mainArticles.length);
  };

  const handleArticleClick = (articleIndex: number) => {
    navigate(`/learn/${articleIndex}`);
  };

  const currentMainArticleIndex = articles.findIndex(
    article => article.title === mainArticles[mainIndex].title
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-10">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >          <h1 className="text-4xl font-bold mb-2 text-emerald-700 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Learn About Nutrition & Health
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleMainRefresh}
              className="ml-4 inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-3 py-1 rounded-full shadow-sm transition"
            >
              <ArrowPathIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Refresh</span>
            </motion.button>
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed mb-8">
            Explore our collection of evidence-based articles, guides, and resources about micronutrients, deficiencies, and nutritional health.
          </p>
        </motion.div>

        {/* Main Article Section */}
        <motion.div 
          className="mb-12 relative cursor-pointer group"
          onClick={() => handleArticleClick(currentMainArticleIndex)}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
          <img 
            src={mainArticles[mainIndex].img} 
            alt={mainArticles[mainIndex].title} 
            className="w-full h-[400px] object-cover rounded-xl shadow-lg transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent rounded-xl flex flex-col justify-end p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={mainIndex}
              transition={{ duration: 0.3 }}
            >
              <span className="bg-emerald-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-3 inline-block shadow-lg">
                {mainArticles[mainIndex].category}
              </span>
              <h2 className="text-3xl font-bold text-white mb-3 leading-tight">
                {mainArticles[mainIndex].title}
              </h2>
              <p className="text-white/90 text-lg mb-4 max-w-2xl leading-relaxed">
                {mainArticles[mainIndex].desc}
              </p>
              <div className="flex items-center gap-4 text-sm text-white/80 mb-4">
                <span>{mainArticles[mainIndex].date}</span>
                <span>•</span>
                <span>{mainArticles[mainIndex].read}</span>
              </div>
              <div className="flex gap-3 z-10" onClick={(e) => e.stopPropagation()}>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleNextMain}
                  className="bg-white text-emerald-700 font-semibold px-6 py-2 rounded-lg shadow-lg hover:bg-white/90 transition"
                >
                  Next Article
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Latest Articles Section */}
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Latest Articles</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestArticles.map((article, idx) => {
            const articleIndex = articles.findIndex(a => a.title === article.title);
            return (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
                onClick={() => handleArticleClick(articleIndex)}
              >
                <div className="relative overflow-hidden">
                  <img 
                    src={article.img} 
                    alt={article.title} 
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-6">
                  <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                    {article.category}
                  </span>
                  <h3 className="text-xl font-bold text-gray-800 mt-2 mb-3 group-hover:text-emerald-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {article.desc}
                  </p>
                  <div className="flex items-center text-xs text-gray-400 gap-3">
                    <span>{article.date}</span>
                    <span>•</span>
                    <span>{article.read}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default LearnPage;
