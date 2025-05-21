import React, { useState } from 'react';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useNavigate } from 'react-router-dom';

const sexOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

const bloodGroupOptions = [
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' },
];

const HealthProfile: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    age: '',
    sex: '',
    height: '',
    weight: '',
    bloodPressure: '',
    sugarLevel: '',
    bloodGroup: '',
    diseases: '',
    deficiencies: '',
    conditionDuration: '',
    symptoms: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Send personal info
      const res = await fetch('/api/profile/personal', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          age: Number(form.age),
          sex: form.sex,
          height: Number(form.height),
          weight: Number(form.weight),
          bloodGroup: form.bloodGroup,
          deficiencies: form.deficiencies.split(',').map(s => s.trim()).filter(Boolean),
          conditionDuration: form.conditionDuration,
        }),
      });
      if (!res.ok) throw new Error('Failed to save personal info');
      // Send medical info
      const res2 = await fetch('/api/profile/medical', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bloodPressure: {
            systolic: Number(form.bloodPressure.split('/')[0]),
            diastolic: Number(form.bloodPressure.split('/')[1]),
          },
          sugarLevel: Number(form.sugarLevel),
          diseases: form.diseases.split(',').map(s => s.trim()).filter(Boolean),
          symptoms: form.symptoms.split(',').map(s => s.trim()).filter(Boolean),
        }),
      });
      if (!res2.ok) throw new Error('Failed to save medical info');
      await fetch('/api/recommendations/generate', { method: 'POST' });
      navigate('/recommendations');
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto py-8">
      {/* Personal Information Section */}
      <Card>
        <h3 className="text-lg font-semibold text-green-700 flex items-center mb-1">🧑‍💼 Personal Information</h3>
        <p className="text-gray-500 mb-4">Provide basic personal details.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Full Name" name="name" placeholder="e.g., John Doe" value={form.name} onChange={handleChange} required />
          <Input label="Age (Years)" name="age" type="number" min="0" placeholder="e.g., 30" value={form.age} onChange={handleChange} required />
          <Select label="Sex" name="sex" options={sexOptions} value={form.sex} onChange={handleChange} required />
        </div>
      </Card>
      {/* Physical Metrics Section */}
      <Card>
        <h3 className="text-lg font-semibold text-green-700 flex items-center mb-1">📏 Physical Metrics</h3>
        <p className="text-gray-500 mb-4">Enter your current height and weight.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Height (cm)" name="height" type="number" min="0" placeholder="e.g., 175" value={form.height} onChange={handleChange} required />
          <Input label="Weight (kg)" name="weight" type="number" min="0" placeholder="e.g., 70" value={form.weight} onChange={handleChange} required />
        </div>
      </Card>
      {/* Medical Indicators Section */}
      <Card>
        <h3 className="text-lg font-semibold text-green-700 flex items-center mb-1">💓 Medical Indicators</h3>
        <p className="text-gray-500 mb-4">Key medical readings.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Blood Pressure (e.g., 120/80)" name="bloodPressure" placeholder="e.g., 120/80" value={form.bloodPressure} onChange={handleChange} required />
          <Input label="Sugar Level (mg/dL)" name="sugarLevel" type="number" min="0" placeholder="e.g., 90" value={form.sugarLevel} onChange={handleChange} required />
          <Select label="Blood Group" name="bloodGroup" options={bloodGroupOptions} value={form.bloodGroup} onChange={handleChange} required />
        </div>
      </Card>
      {/* Medical History Section */}
      <Card>
        <h3 className="text-lg font-semibold text-green-700 flex items-center mb-1">🩺 Medical History</h3>
        <p className="text-gray-500 mb-4">Relevant medical conditions and deficiencies. If none, leave blank.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Specific Diseases" name="diseases" placeholder="e.g., Hypertension, Type 2 Diabetes" value={form.diseases} onChange={handleChange} />
          <Input label="Deficiencies" name="deficiencies" placeholder="e.g., Iron deficiency, Vitamin D deficiency" value={form.deficiencies} onChange={handleChange} />
        </div>
      </Card>
      {/* Condition Details Section */}
      <Card>
        <h3 className="text-lg font-semibold text-green-700 flex items-center mb-1">📝 Current Condition Details</h3>
        <p className="text-gray-500 mb-4">Information about your current health concern.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Duration of Condition" name="conditionDuration" placeholder="e.g., 3 months, 2 weeks" value={form.conditionDuration} onChange={handleChange} />
          <Input label="Symptoms Experienced" name="symptoms" placeholder="e.g., Fatigue, headaches, joint pain" value={form.symptoms} onChange={handleChange} />
        </div>
      </Card>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <Button type="submit" isLoading={loading} className="w-full bg-green-600 hover:bg-green-700">Get Personalized Suggestions</Button>
    </form>
  );
};

export default HealthProfile;
