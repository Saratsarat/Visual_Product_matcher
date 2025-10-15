'use client';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import {
  Search, Zap, Shield, Sparkles, ArrowRight, Camera, Image, TrendingUp
} from 'lucide-react';

export default function Homepage() {
  const [images, setImages] = useState([]);

  // Fetch some product previews dynamically from MongoDB
  useEffect(() => {
    fetch('/api/images')
      .then((res) => res.json())
      .then((data) => setImages(data.slice(0, 6))) // show first 6
      .catch(() => setImages([]));
  }, []);

  return (
    <>
      <Head>
        <title>VisualMatch — AI Product Search</title>
        <meta
          name="description"
          content="Find products by simply uploading an image. AI-powered visual search by VisualMatch."
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white">
        {/* Navigation */}
        <nav className="fixed top-0 w-full bg-white bg-opacity-10 backdrop-blur-lg z-50 border-b border-white border-opacity-20">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Camera className="w-8 h-8 text-white" />
              <span className="text-white text-2xl font-bold">VisualMatch</span>
            </div>
            <div className="flex items-center gap-6">
              <a href="#features" className="text-white hover:text-pink-300 transition">Features</a>
              <a href="#how-it-works" className="text-white hover:text-pink-300 transition">How It Works</a>
              <a
                href="/matcher"
                className="px-6 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all"
              >
                Try Now
              </a>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="pt-32 pb-24 px-6 text-center relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 rounded-full text-white mb-8">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered Visual Search</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-extrabold leading-tight mb-6">
              Discover Products by
              <span className="block bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text text-transparent">
                Uploading an Image
              </span>
            </h1>
            <p className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
              Revolutionize your shopping experience — upload any image and instantly find visually similar products powered by advanced AI.
            </p>

            <div className="flex justify-center gap-4 mb-16">
              <a
                href="/matcher"
                className="px-8 py-4 bg-white text-purple-900 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2"
              >
                Start Searching
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#demo"
                className="px-8 py-4 bg-white bg-opacity-20 text-white rounded-full font-bold text-lg hover:bg-opacity-30 transition-all"
              >
                Watch Demo
              </a>
            </div>
          </motion.div>

          {/* Animated Gradient Background */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-pink-600/30 via-purple-600/30 to-indigo-700/30 blur-3xl"></div>
        </section>

        {/* Product Preview Section */}
        {images.length > 0 && (
          <section id="demo" className="py-20 px-6 bg-white bg-opacity-5 backdrop-blur-lg">
            <div className="max-w-7xl mx-auto text-center">
              <h2 className="text-5xl font-bold mb-10">Recent Matches</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {images.map((img, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    viewport={{ once: true }}
                    className="bg-white bg-opacity-10 rounded-2xl overflow-hidden border border-white border-opacity-20 hover:scale-105 transition-all"
                  >
                    <img src={img.image_url} alt={img.name} className="w-full h-56 object-cover" />
                    <div className="p-4 text-left">
                      <h3 className="font-semibold text-lg">{img.name}</h3>
                      <p className="text-gray-300 text-sm mt-1">{img.category || 'Similar Product'}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Features & How It Works — same as yours */}
        <section id="features" className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-4">Powerful Features</h2>
              <p className="text-xl text-gray-300">Everything you need for intelligent visual search</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: Zap, title: 'Lightning Fast', text: 'Results in under 2 seconds with AI optimized for speed.' },
                { icon: Shield, title: 'Secure & Private', text: 'Images processed securely — never stored.' },
                { icon: TrendingUp, title: 'Smart Matching', text: 'Understands style, context & visual similarity.' }
              ].map(({ icon: Icon, title, text }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white bg-opacity-10 rounded-2xl p-8 border border-white border-opacity-20 hover:bg-opacity-20 transition-all"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{title}</h3>
                  <p className="text-gray-300">{text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-6 bg-black bg-opacity-40 border-t border-white border-opacity-10">
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Camera className="w-6 h-6 text-white" />
              <span className="text-white text-xl font-bold">VisualMatch</span>
            </div>
            <p className="text-gray-400 mb-6">Powered by advanced AI visual technology</p>
            <p className="text-gray-500 mt-8">
              © {new Date().getFullYear()} VisualMatch. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}
