
import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, Users, BarChart3, Shield, Brain, Zap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Advanced Gemma 3-4B model classifies complaints with 95% accuracy",
    color: "bg-purple-500"
  },
  {
    icon: MessageSquare,
    title: "Intelligent Chat",
    description: "Natural conversations with context-aware responses",
    color: "bg-blue-500"
  },
  {
    icon: BarChart3,
    title: "Real-time Analytics",
    description: "Comprehensive dashboards for all stakeholders",
    color: "bg-green-500"
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-grade security with role-based access control",
    color: "bg-orange-500"
  }
];

const userTypes = [
  {
    type: "Customer",
    description: "Submit and track complaints, get instant AI assistance",
    features: ["AI Chat Support", "Complaint Tracking", "Status Updates", "File Uploads"]
  },
  {
    type: "Manager",
    description: "Oversee complaint resolution and team performance",
    features: ["Team Analytics", "Performance Metrics", "Workflow Management", "Reports"]
  },
  {
    type: "Admin",
    description: "Full system control and advanced analytics",
    features: ["System Control", "AI Monitoring", "User Management", "Advanced Analytics"]
  }
];

const Navbar = () => {
  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <img
            src="/lovable-uploads/704cd890-e36f-4688-8aa1-a02ffa01eb64.png"
            alt="SoloSolve AI"
            className="h-8"
          />
        </div>
        <div className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-white/80 hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="text-white/80 hover:text-white transition-colors">How it Works</a>
          <a href="#users" className="text-white/80 hover:text-white transition-colors">User Types</a>
        </div>
        <Link to="/login">
          <Button className="bg-purple-600 hover:bg-purple-700 text-white">
            Try Demo
          </Button>
        </Link>
      </div>
    </motion.nav>
  );
};

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6">
      <div className="container mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            The Future of
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
              {" "}Complaint{" "}
            </span>
            Management
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto">
            Powered by cutting-edge AI, SoloSolver revolutionizes customer service with intelligent 
            complaint classification, automated responses, and real-time analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg">
                Start Demo
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-4 text-lg">
              Watch Demo
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 px-6">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Powered by Advanced AI
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Our system combines Gemma 3-4B for classification and Gemini for orchestration, 
            delivering unparalleled accuracy and intelligence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white/5 backdrop-blur border-white/10 hover:bg-white/10 transition-all duration-300 h-full">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-white/70">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorksSection = () => {
  const steps = [
    {
      step: "01",
      title: "Customer Submits Complaint",
      description: "User describes their issue through our intelligent chat interface",
      icon: MessageSquare
    },
    {
      step: "02", 
      title: "AI Classification",
      description: "Gemma 3-4B analyzes and classifies the complaint with high accuracy",
      icon: Brain
    },
    {
      step: "03",
      title: "Smart Orchestration", 
      description: "Gemini searches transaction history and generates personalized responses",
      icon: Zap
    },
    {
      step: "04",
      title: "Real-time Analytics",
      description: "All interactions are tracked and analyzed for continuous improvement",
      icon: BarChart3
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-6 bg-black/20">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            How SoloSolver Works
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Our AI-powered workflow ensures every complaint is processed efficiently and accurately
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-purple-400 mb-2">{step.step}</div>
                <h3 className="text-xl font-semibold text-white mb-3">{step.title}</h3>
                <p className="text-white/70">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-purple-600 to-transparent"></div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const UserTypesSection = () => {
  return (
    <section id="users" className="py-20 px-6">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Built for Every User
          </h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto">
            Role-based interfaces designed for customers, managers, and administrators
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {userTypes.map((user, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white/5 backdrop-blur border-white/10 hover:bg-white/10 transition-all duration-300 h-full">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-4">{user.type}</h3>
                  <p className="text-white/70 mb-6">{user.description}</p>
                  <ul className="space-y-3">
                    {user.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-white/80">
                        <div className="w-2 h-2 bg-purple-400 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  return (
    <section className="py-20 px-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50">
      <div className="container mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Customer Service?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Experience the power of AI-driven complaint management. Try our demo with simulated users.
          </p>
          <Link to="/login">
            <Button size="lg" className="bg-white text-purple-900 hover:bg-gray-100 px-12 py-4 text-lg font-semibold">
              Start Demo Now
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export const WelcomeScreen = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-slate-900 overflow-x-hidden">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 -left-40 w-60 h-60 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <UserTypesSection />
      <CTASection />
    </div>
  );
};
