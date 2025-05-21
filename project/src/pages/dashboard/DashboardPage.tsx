import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProfileStore } from '../../store/profileStore';
import { useRecommendationStore } from '../../store/recommendationStore';
import { motion } from 'framer-motion';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { 
  UserCircle, 
  Activity, 
  Utensils,

  Plus,
  Heart,
  AlertTriangle
} from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { profile, fetchProfile } = useProfileStore();
  const { 
    recommendations, 
    currentRecommendation, 
    fetchRecommendations, 
    fetchRecommendationById 
  } = useRecommendationStore();

  useEffect(() => {
    fetchProfile();
    fetchRecommendations();
  }, [fetchProfile, fetchRecommendations]);

  useEffect(() => {
    if (recommendations.length > 0 && !currentRecommendation) {
      fetchRecommendationById(recommendations[0].id);
    }
  }, [recommendations, currentRecommendation, fetchRecommendationById]);

  // Check if profile is incomplete
  const isProfileIncomplete = !profile || 
    !profile.personalInfo?.age || 
    !profile.personalInfo?.weight || 
    !profile.personalInfo?.height;

  // Check if medical info is incomplete
  const isMedicalIncomplete = !profile || 
    !profile.medicalInfo?.bloodPressure?.systolic || 
    !profile.medicalInfo?.bloodPressure?.diastolic || 
    !profile.medicalInfo?.sugarLevel;

  return (
    <div className="pb-12">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to your personalized nutrition dashboard</p>
      </motion.div>

      {/* Alerts */}
      {(isProfileIncomplete || isMedicalIncomplete) && (
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="bg-amber-50 border border-amber-200">
            <div className="flex items-start">
              <div className="mr-4">
                <AlertTriangle size={24} className="text-amber-500" />
              </div>
              <div>
                <h3 className="font-semibold text-amber-800 mb-2">Complete Your Profile</h3>
                <p className="text-amber-700 mb-4">
                  Your {isProfileIncomplete ? 'personal' : 'medical'} information is incomplete. 
                  Complete your profile to get accurate nutrition recommendations.
                </p>
                <Link to={isProfileIncomplete ? "/profile" : "/health-metrics"}>
                  <Button variant="secondary" size="sm">
                    Complete Profile
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Quick Stats */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card isHoverable>
          <div className="flex items-center">
            <div className="bg-teal-100 p-3 rounded-full mr-4">
              <UserCircle size={24} className="text-teal-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Profile</h3>
              <p className="text-gray-500">
                {isProfileIncomplete ? 'Incomplete' : 'Complete'}
              </p>
            </div>
          </div>
        </Card>

        <Card isHoverable>
          <div className="flex items-center">
            <div className="bg-cyan-100 p-3 rounded-full mr-4">
              <Activity size={24} className="text-cyan-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Health Metrics</h3>
              <p className="text-gray-500">
                {isMedicalIncomplete ? 'Incomplete' : 'Complete'}
              </p>
            </div>
          </div>
        </Card>

        <Card isHoverable>
          <div className="flex items-center">
            <div className="bg-emerald-100 p-3 rounded-full mr-4">
              <Utensils size={24} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Recommendations</h3>
              <p className="text-gray-500">
                {recommendations.length > 0 ? recommendations.length : 'None yet'}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Health Summary */}
      {!isProfileIncomplete && !isMedicalIncomplete && (
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Health Summary</h2>
              <Link to="/health-metrics">
                <Button variant="outline" size="sm">View Details</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Blood Pressure</h4>
                <p className="text-lg font-semibold text-gray-900">
                  {profile?.medicalInfo?.bloodPressure?.systolic}/{profile?.medicalInfo?.bloodPressure?.diastolic} mmHg
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Blood Sugar</h4>
                <p className="text-lg font-semibold text-gray-900">
                  {profile?.medicalInfo?.sugarLevel} mg/dL
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">BMI</h4>
                <p className="text-lg font-semibold text-gray-900">
                  {profile?.personalInfo?.weight && profile?.personalInfo?.height ? 
                    (profile.personalInfo.weight / ((profile.personalInfo.height / 100) ** 2)).toFixed(1) : 
                    'N/A'}
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Latest Nutrition Recommendation */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Nutrition Recommendations</h2>
            <Link to="/recommendations">
              <Button variant="outline" size="sm">View All</Button>
            </Link>
          </div>

          {currentRecommendation ? (
            <div>
              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Health Focus Areas</h3>
                <div className="flex flex-wrap gap-2">
                  {currentRecommendation.healthConditions.map((condition, index) => (
                    <span 
                      key={index}
                      className="bg-teal-100 text-teal-800 text-sm px-3 py-1 rounded-full"
                    >
                      {condition}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Top Recommendations</h3>
                {currentRecommendation.foodRecommendations.slice(0, 1).map((category, index) => (
                  <div key={index} className="mb-3">
                    <h4 className="font-medium text-gray-800 mb-2 capitalize">{category.category}</h4>
                    <ul className="space-y-2">
                      {category.items.slice(0, 3).map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start">
                          <Heart size={16} className="text-teal-500 mr-2 mt-1 flex-shrink-0" />
                          <div>
                            <span className="font-medium">{item.name}</span>
                            <span className="text-gray-600 text-sm ml-2">
                              ({item.quantity})
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                <div className="mt-4">
                  <Link to={`/recommendations`}>
                    <Button size="sm">View Full Recommendations</Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <p className="text-gray-600 mb-4">
                {isProfileIncomplete || isMedicalIncomplete
                  ? "Complete your profile to generate recommendations"
                  : "No recommendations yet. Generate your first nutrition plan."}
              </p>
              <Button
                leftIcon={<Plus size={18} />}
                disabled={isProfileIncomplete || isMedicalIncomplete}
              >
                Generate Recommendations
              </Button>
            </div>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

export default DashboardPage;