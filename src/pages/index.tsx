import React from 'react';
import Layout from '@/components/Layout';
import Head from 'next/head';
import CourseList from '../components/CourseList';
import InitialCourseSelection from '../components/InitialCourseSelection';
import SelectedCourses from '../components/SelectedCourses';
import RecommendedCourses from '../components/RecommendedCourses';
import CalendarView from '../components/CalendarView';

const HomePage: React.FC = () => {
  return (
    <Layout>
      <Head>
        <title>UChicago Law LLM Schedule Planner</title>
        <meta 
          name="description" 
          content="Course scheduling tool for UChicago Law LLM students" 
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* <Header /> */}
        
        <div className="pt-4">
          <main className="container mx-auto px-4 py-4">
            <div className="max-w-7xl mx-auto transition-all duration-300">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
                <h1 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                  Welcome to the Course Scheduler!
                </h1>
                
                <p className="text-lg text-gray-600 mb-6">
                  Select courses and build your LLM schedule. Use the filters in the sidebar to find 
                  courses that match your interests and requirements.
                </p>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="bg-maroon-600 bg-opacity-5 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-maroon-700 mb-3">
                      Getting Started
                    </h2>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Try adding an LLM course!</li>
                      <li>• Use filters to narrow down courses</li>
                      <li>• Add courses to your schedule</li>
                      <li>• Check for schedule conflicts</li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-3">
                      Quick Tips
                    </h2>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Biddable courses have * next to the title.</li>
                      <li>• Filter by title, professor, category, day, etc.</li>
                      <li>• Check credit requirements</li>
                      <li>• Save your schedule for later</li>
                    </ul>
                  </div>
                </div>
              </div>
              <InitialCourseSelection />
              <SelectedCourses />
              <CalendarView />
              <RecommendedCourses />
              <CourseList />
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
