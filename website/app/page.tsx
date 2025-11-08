"use client";

import UserProfile from "@/components/UserProfile";
import { useIsAuthenticated } from "@azure/msal-react";

export default function Home() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-blue-600">Crazure Consulting</h1>
            <nav className="hidden md:flex space-x-8">
              <a href="#services" className="text-gray-700 hover:text-blue-600 transition-colors">
                Services
              </a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">
                About
              </a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">
                Contact
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Azure Cloud Solutions
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Expert consulting and architecture services for your cloud journey
          </p>
        </div>

        {/* Authentication Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-12 max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-6">
            {isAuthenticated ? "Your Account" : "Client Portal"}
          </h3>
          <UserProfile />
        </div>

        {/* Services Section */}
        <section id="services" className="mb-12">
          <h3 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Our Services
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
              <div className="text-blue-600 text-4xl mb-4">☁️</div>
              <h4 className="text-xl font-semibold mb-3">Cloud Architecture</h4>
              <p className="text-gray-600">
                Design and implement scalable, secure Azure cloud solutions
                tailored to your business needs.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
              <div className="text-blue-600 text-4xl mb-4">🔒</div>
              <h4 className="text-xl font-semibold mb-3">Security & Compliance</h4>
              <p className="text-gray-600">
                Ensure your cloud infrastructure meets industry standards and
                best practices for security.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow">
              <div className="text-blue-600 text-4xl mb-4">🚀</div>
              <h4 className="text-xl font-semibold mb-3">Migration Services</h4>
              <p className="text-gray-600">
                Seamlessly migrate your applications and data to Azure with
                minimal downtime.
              </p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="mb-12 bg-white rounded-lg shadow-md p-8">
          <h3 className="text-3xl font-bold text-center mb-6 text-gray-900">
            About Us
          </h3>
          <p className="text-gray-700 text-lg leading-relaxed max-w-3xl mx-auto">
            Crazure Consulting brings 15+ years of IT experience and deep Azure
            expertise to help organizations leverage the full power of cloud
            computing. Our bilingual team provides world-class consulting and
            architecture services to clients globally.
          </p>
        </section>

        {/* Contact Section */}
        <section id="contact" className="text-center">
          <h3 className="text-3xl font-bold mb-6 text-gray-900">Get In Touch</h3>
          <p className="text-gray-600 mb-6">
            Ready to transform your cloud infrastructure? Contact us today.
          </p>
          <a
            href="mailto:contact@crazureconsulting.com"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            Contact Us
          </a>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-300">
              © 2025 Crazure Consulting. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
