import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';


const HomePage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-cyan-500 to-blue-500 overflow-hidden"
    >
      {/* Header/Navbar is handled by Layout */}
      <section className="pt-24 pb-20 text-white text-center px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Personalized Nutrition for Your Optimal Health</h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Discover your micronutrient deficiencies and get tailored dietary recommendations backed by science.
          </p>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <Link to="/analyze" className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg shadow hover:bg-blue-50 transition">
              Start Your Analysis
            </Link>
            <Link to="/diet-plan" className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg shadow hover:bg-blue-50 transition">
              Fix Your Diet
            </Link>
            <Link to="/learn" className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-lg shadow hover:bg-blue-50 transition">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-gray-900">How NutriCare Works</h2>
          <div className="flex flex-col md:flex-row justify-center gap-10 max-w-4xl mx-auto">
            {[
              {
                icon: "💬",
                title: "Share Your Symptoms",
                description: "Tell us about your health concerns and symptoms you're experiencing."
              },
              {
                icon: "📊",
                title: "AI Analysis",
                description: "Our system analyzes your symptoms to identify potential micronutrient deficiencies."
              },
              {
                icon: "🧑‍⚕️",
                title: "Get Recommendations",
                description: "Receive personalized dietary recommendations based on your unique needs."
              },
              {
                icon: "🔄",
                title: "Track Progress",
                description: "Monitor your health improvements as you implement the recommendations."
              }
            ].map((segment, index) => (
              <div
                key={index}
                className="flex-1 text-center border-2 border-gray-200 rounded-lg p-6 bg-gradient-to-br from-gray-50 to-white shadow-md transition-transform duration-500 hover:scale-105 hover:shadow-2xl hover:bg-gradient-to-tl hover:from-white hover:to-gray-100"
              >
                <div className="mx-auto mb-3 text-blue-600 text-4xl animate-bounce">{segment.icon}</div>
                <h3 className="font-semibold text-xl mb-2 text-gray-800 transition-colors duration-300 hover:text-blue-600">{segment.title}</h3>
                <p className="text-gray-600 text-base leading-relaxed transition-opacity duration-300 hover:opacity-80">{segment.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-gray-900">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: "📝",
                title: "Personalized Analysis",
                description: "Get insights tailored to your unique symptoms, body, and health history."
              },
              {
                icon: "🔬",
                title: "Scientific Recommendations",
                description: "Dietary suggestions backed by peer-reviewed nutritional science."
              },
              {
                icon: "📈",
                title: "Progress Tracking",
                description: "Monitor your health improvements with easy-to-understand visualizations."
              },
              {
                icon: "📚",
                title: "Comprehensive Database",
                description: "Access information on a wide range of micronutrients and food sources."
              },
              {
                icon: "🎓",
                title: "Educational Resources",
                description: "Learn about nutrition, micronutrients, and their impact on your health."
              },
              {
                icon: "🔁",
                title: "Ongoing Support",
                description: "Receive regular updates and adjustments to your nutritional plan."
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg p-6 text-center border-2 border-gray-200 transition-transform duration-500 hover:scale-105 hover:shadow-2xl hover:bg-gradient-to-tl hover:from-gray-50 hover:to-white"
              >
                <div className="text-3xl mb-3 text-teal-500 animate-spin-slow">{feature.icon}</div>
                <h4 className="font-semibold text-lg mb-2 text-gray-800 transition-colors duration-300 hover:text-teal-500">{feature.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed transition-opacity duration-300 hover:opacity-80">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

export default HomePage;