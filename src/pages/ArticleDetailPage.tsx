import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { articles } from './LearnPage';

const ArticleDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const article = articles[Number(id)];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold text-red-600 mb-4">Article not found</h1>
            <p className="text-gray-600 mb-8">The article you're looking for doesn't exist or has been moved.</p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/learn')}
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition shadow-lg"
            >
              Back to Articles
            </motion.button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="relative h-[500px] mb-8">
        <div className="absolute inset-0">
          <img 
            src={article.img} 
            alt={article.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent" />
        </div>
        
        <div className="absolute inset-0">
          <div className="max-w-4xl mx-auto px-4 h-full flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <button 
                onClick={() => navigate('/learn')}
                className="mb-6 text-white/90 hover:text-white flex items-center gap-2 transition group"
              >
                <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
                Back to Articles
              </button>
              
              <span className="bg-emerald-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-4 inline-block">
                {article.category}
              </span>
              <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
                {article.title}
              </h1>
              <p className="text-xl text-white/90 mb-6 max-w-2xl leading-relaxed">
                {article.desc}
              </p>
              <div className="flex items-center gap-4 text-white/80">
                <span>{article.date}</span>
                <span>•</span>
                <span>{article.read}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Existing article content sections */}
          <div className="prose prose-emerald lg:prose-lg max-w-none">
            {article.category === 'Featured' && (
              <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-r-lg mb-8">
                <h3 className="text-emerald-800 mt-0">Latest Research Highlights</h3>
                <p className="mb-0">Recent studies have shown remarkable discoveries in the field of micronutrients and their impact on human health. Scientists have found that these essential compounds play even more crucial roles than previously thought in areas ranging from immune function to cognitive performance.</p>
              </div>
            )}

            <h2>Understanding {article.title}</h2>
            <p>This comprehensive guide explores everything you need to know about {article.title.toLowerCase()}, backed by the latest scientific research and practical insights from nutrition experts.</p>
            
            <h2>Key Insights</h2>
            {article.category === 'Deficiencies' ? (
              <ul>
                <li>Early warning signs and symptoms to watch for</li>
                <li>Risk factors and common causes</li>
                <li>Diagnostic tests and assessments</li>
                <li>Treatment options and prevention strategies</li>
              </ul>
            ) : article.category === 'Food Sources' ? (
              <ul>
                <li>Top natural food sources and their nutrient content</li>
                <li>Absorption enhancers and inhibitors</li>
                <li>Meal planning and preparation tips</li>
                <li>Storage and cooking methods to preserve nutrients</li>
              </ul>
            ) : (
              <ul>
                <li>Latest scientific findings and research</li>
                <li>Recommended daily intake guidelines</li>
                <li>Practical implementation strategies</li>
                <li>Common myths and misconceptions</li>
              </ul>
            )}

            <h2>Practical Applications</h2>
            <p>Understanding the theory is important, but putting it into practice is crucial. Here are specific ways you can apply this knowledge to improve your health:</p>
            
            <ul>
              <li>Daily dietary recommendations and meal planning</li>
              <li>Lifestyle modifications for optimal nutrition</li>
              <li>Tips for different dietary preferences and restrictions</li>
              <li>Supplementation guidelines when necessary</li>
            </ul>

            <h2>Expert Recommendations</h2>
            <p>Leading nutrition experts recommend the following strategies to optimize your {article.category.toLowerCase()} intake and maintain optimal health:</p>
            
            <ul>
              <li>Regular monitoring and assessment</li>
              <li>Balanced diet focusing on whole foods</li>
              <li>Lifestyle factors that affect nutrient status</li>
              <li>When to seek professional guidance</li>
            </ul>

            <h2>Common Questions</h2>
            <div className="space-y-4">
              <details>
                <summary className="font-semibold cursor-pointer">How much do I need daily?</summary>
                <p className="pl-4">Requirements vary based on age, gender, activity level, and health status. Consult with a healthcare provider for personalized recommendations.</p>
              </details>
              <details>
                <summary className="font-semibold cursor-pointer">Can I get enough from food alone?</summary>
                <p className="pl-4">Most people can meet their needs through a balanced diet, but certain conditions or dietary restrictions may require supplementation.</p>
              </details>
              <details>
                <summary className="font-semibold cursor-pointer">What affects absorption?</summary>
                <p className="pl-4">Various factors including dietary combinations, timing of intake, and overall health status can impact nutrient absorption.</p>
              </details>
            </div>

            <h2>Conclusion</h2>
            <p>Armed with this knowledge about {article.title.toLowerCase()}, you can make informed decisions about your nutrition and take practical steps to optimize your health and wellbeing.</p>
            
            <div className="bg-emerald-50 p-6 rounded-lg mt-8">
              <h3 className="text-emerald-800 font-semibold">Need Professional Advice?</h3>
              <p className="text-emerald-600">While this article provides general guidance, always consult with a healthcare provider or registered dietitian for personalized recommendations, especially if you have specific health conditions or concerns.</p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 border-t border-gray-200 pt-8"
          >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Share this Article</h2>
            <div className="flex gap-4">
              <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition">
                Share on Twitter
              </button>
              <button className="bg-[#4267B2] text-white px-6 py-2 rounded-lg hover:bg-[#365899] transition">
                Share on Facebook
              </button>
              <button className="bg-[#0077b5] text-white px-6 py-2 rounded-lg hover:bg-[#006396] transition">
                Share on LinkedIn
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-emerald-50 p-8 rounded-2xl mt-12 shadow-sm"
          >
            <div className="flex items-start gap-6">
              <div className="bg-emerald-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">Need Professional Advice?</h3>
                <p className="text-emerald-600">While this article provides general guidance, always consult with a healthcare provider or registered dietitian for personalized recommendations, especially if you have specific health conditions or concerns.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ArticleDetailPage;
