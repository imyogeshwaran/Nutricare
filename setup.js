import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const questions = [
  {
    name: 'PORT',
    message: 'Enter server port (default: 5000): ',
    default: '5000'
  },
  {
    name: 'MONGODB_URI',
    message: 'Enter MongoDB URI (default: mongodb://localhost:27017/nutricare): ',
    default: 'mongodb://localhost:27017/nutricare'
  },
  {
    name: 'JWT_SECRET',
    message: 'Enter JWT secret (default: 2025!@#$): ',
    default: '2025!@#$'
  },
  {
    name: 'EMAIL_USER',
    message: 'Enter Gmail address for sending emails: ',
    required: true
  },
  {
    name: 'EMAIL_PASS',
    message: 'Enter Gmail app-specific password: ',
    required: true
  }
];

const envContent = [];

console.log('Setting up environment configuration...\n');

const askQuestion = (index) => {
  if (index >= questions.length) {
    // Write to .env file
    const envPath = path.join(__dirname, '.env');
    fs.writeFileSync(envPath, envContent.join('\n'));
    console.log('\nEnvironment configuration completed!');
    console.log('Please make sure to:');
    console.log('1. Start MongoDB server');
    console.log('2. Run "npm run server" to start the backend');
    console.log('3. Run "npm run dev" to start the frontend');
    rl.close();
    return;
  }

  const question = questions[index];
  rl.question(question.message, (answer) => {
    const value = answer.trim() || question.default;
    if (!value && question.required) {
      console.log('This field is required!');
      askQuestion(index);
      return;
    }
    envContent.push(`${question.name}=${value}`);
    askQuestion(index + 1);
  });
};

askQuestion(0); 