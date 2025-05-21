import React, { useEffect } from 'react';
import { useProfileStore } from '../../store/profileStore';
import { useRecommendationStore } from '../../store/recommendationStore';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const RecommendationsPage: React.FC = () => {
  const { profile, fetchProfile } = useProfileStore();
  const { recommendations, fetchRecommendations, loading } = useRecommendationStore();

  useEffect(() => {
    fetchProfile();
    fetchRecommendations();
  }, [fetchProfile, fetchRecommendations]);

  const latest = recommendations && recommendations.length > 0 ? recommendations[0] : null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-full">
      <h1 className="text-3xl font-bold mb-6">Your Personalized Recommendations</h1>
      {loading && <div>Loading...</div>}
      {!loading && latest && profile && (
        <div className="space-y-8">
          {/* 1. Patient Health Profile Summary */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">1. Patient Health Profile Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <strong>Name:</strong> {profile.personalInfo?.name}<br />
                <strong>Age:</strong> {profile.personalInfo?.age}<br />
                <strong>Sex:</strong> {profile.personalInfo?.sex}<br />
                <strong>Height:</strong> {profile.personalInfo?.height} cm<br />
                <strong>Weight:</strong> {profile.personalInfo?.weight} kg<br />
              </div>
              <div>
                <strong>Blood Pressure:</strong> {profile.medicalInfo?.bloodPressure?.systolic}/{profile.medicalInfo?.bloodPressure?.diastolic} mmHg<br />
                <strong>Sugar Level:</strong> {profile.medicalInfo?.sugarLevel} mg/dL<br />
                <strong>Diseases:</strong> {profile.medicalInfo?.diseases?.join(', ') || 'None'}<br />
                <strong>Symptoms:</strong> {profile.medicalInfo?.symptoms?.join(', ') || 'None'}<br />
              </div>
            </div>
          </Card>

          {/* 2. Identified Health Conditions/Deficiencies */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">2. Identified Health Conditions/Deficiencies</h2>
            <div>
              <strong>Health Conditions:</strong> {latest.healthConditions.length > 0 ? latest.healthConditions.join(', ') : 'None'}<br />
              <strong>Deficiencies:</strong> {latest.deficiencies.length > 0 ? latest.deficiencies.join(', ') : 'None'}
            </div>
          </Card>

          {/* 3. Recommended Food Categories */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">3. Recommended Food Categories</h2>
            {latest.foodRecommendations.map((cat: any) => (
              <div key={cat.category} className="mb-6">
                <h3 className="text-lg font-bold mb-2 capitalize">{cat.category}</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-gray-700 mb-4">
                    <thead className="bg-teal-600 text-white">
                      <tr>
                        <th className="py-2 px-3 text-left">Food Item</th>
                        <th className="py-2 px-3 text-left">Recommended Daily Quantity</th>
                        <th className="py-2 px-3 text-left">Intake Duration</th>
                        <th className="py-2 px-3 text-left">Calories</th>
                        <th className="py-2 px-3 text-left">Fat (g)</th>
                        <th className="py-2 px-3 text-left">Protein (g)</th>
                        <th className="py-2 px-3 text-left">Micronutrients</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cat.items.map((item: any) => (
                        <tr key={item.name} className="even:bg-teal-50">
                          <td className="py-2 px-3 font-medium">{item.name}</td>
                          <td className="py-2 px-3">{item.quantity}</td>
                          <td className="py-2 px-3">{item.duration}</td>
                          <td className="py-2 px-3">{item.nutrition.calories}</td>
                          <td className="py-2 px-3">{item.nutrition.fat}</td>
                          <td className="py-2 px-3">{item.nutrition.protein}</td>
                          <td className="py-2 px-3">
                            {item.nutrition.vitamins?.length > 0 && (
                              <span className="text-xs text-teal-700">Vitamins: {item.nutrition.vitamins.join(', ')}</span>
                            )}<br />
                            {item.nutrition.minerals?.length > 0 && (
                              <span className="text-xs text-cyan-700">Minerals: {item.nutrition.minerals.join(', ')}</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </Card>

          {/* 4. Expected Health Benefits */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">4. Expected Health Benefits</h2>
            <ul className="list-disc pl-6">
              {latest.expectedBenefits.map((b: string, i: number) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </Card>

          {/* 5. Potential Dietary Precautions */}
          <Card>
            <h2 className="text-xl font-semibold mb-4">5. Potential Dietary Precautions</h2>
            <ul className="list-disc pl-6">
              {latest.precautions.map((p: string, i: number) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </Card>
        </div>
      )}
      {!loading && !latest && (
        <Card>
          <p className="text-gray-600">No recommendations found. Please complete your health profile and generate recommendations.</p>
        </Card>
      )}
    </div>
  );
};

export default RecommendationsPage;