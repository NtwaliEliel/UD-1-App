import { Link } from 'react-router-dom';
import { BookOpen, Briefcase, Award } from 'lucide-react';

export function Home() {
  console.log('Home component is rendering');
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-green-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Empower Your Future with Digital Skills
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100">
              Access quality digital education and connect with job opportunities
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                to="/courses"
                className="px-8 py-3 bg-white text-green-600 rounded-lg font-semibold hover:bg-green-50 transition-colors"
              >
                Start Learning
              </Link>
              <Link
                to="/about"
                className="px-8 py-3 border-2 border-white rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose UD-1?</h2>
            <p className="mt-4 text-xl text-gray-600">
              We provide comprehensive digital skills training and career opportunities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-xl shadow-md">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Interactive Learning</h3>
              <p className="text-gray-600">
                Engage with interactive content, video lessons, and hands-on projects
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-md">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Briefcase className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Job Opportunities</h3>
              <p className="text-gray-600">
                Connect with employers and access exclusive job opportunities
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-md">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Certification</h3>
              <p className="text-gray-600">
                Earn recognized certificates to showcase your skills
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-green-600">1000+</div>
              <div className="mt-2 text-gray-600">Active Learners</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600">50+</div>
              <div className="mt-2 text-gray-600">Courses Available</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600">200+</div>
              <div className="mt-2 text-gray-600">Job Placements</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}