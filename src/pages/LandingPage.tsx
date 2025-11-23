import React, { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ChefHat,
  Search,
  Star,
  Bell,
  Users,
  BarChart3,
  ArrowRight,
  Sparkles,
  Clock,
  Heart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LandingPageHeader } from '@/components/LandingPageHeader';

const LandingPage = () => {
  // Set page title
  useEffect(() => {
    document.title = 'FitRecipes - Discover & Share Healthy Recipes';
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Navigation */}
      <LandingPageHeader />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection />

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* Stats Section */}
      <StatsSection />

      {/* CTA Section */}
      <CTASection />

      {/* Footer */}
      <Footer />
    </div>
  );
};

// Hero Section with Animated Gradient Background
const HeroSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-blue-50 to-primary-100">
        <motion.div
          className="absolute inset-0 opacity-40"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(14, 165, 233, 0.4) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(59, 130, 246, 0.4) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 80%, rgba(14, 165, 233, 0.4) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.4) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(14, 165, 233, 0.4) 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        {/* Additional animated layer */}
        <motion.div
          className="absolute inset-0 opacity-20"
          animate={{
            background: [
              'radial-gradient(circle at 80% 20%, rgba(96, 165, 250, 0.3) 0%, transparent 40%)',
              'radial-gradient(circle at 20% 80%, rgba(96, 165, 250, 0.3) 0%, transparent 40%)',
              'radial-gradient(circle at 80% 80%, rgba(96, 165, 250, 0.3) 0%, transparent 40%)',
              'radial-gradient(circle at 80% 20%, rgba(96, 165, 250, 0.3) 0%, transparent 40%)',
            ],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      {/* Floating decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 rounded-full bg-gradient-to-br from-primary-200/20 to-blue-200/20 blur-xl"
            animate={{
              x: [
                Math.random() * 100 - 50,
                Math.random() * 100 - 50,
                Math.random() * 100 - 50,
              ],
              y: [
                Math.random() * 100 - 50,
                Math.random() * 100 - 50,
                Math.random() * 100 - 50,
              ],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              left: `${(i * 20) % 100}%`,
              top: `${(i * 15) % 100}%`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Logo Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={isInView ? { scale: 1, rotate: 0 } : {}}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.5 }}
            className="flex justify-center mb-8"
          >
            <div className="relative p-4 bg-white rounded-2xl shadow-2xl">
              <motion.div
                animate={{ rotate: [0, 5, 0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ChefHat className="h-16 w-16 text-primary-600" />
              </motion.div>
              <motion.div
                className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-400/20 to-blue-400/20"
                animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>

          {/* Main Headline with enhanced animation */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
          >
            Discover & Share
            <br />
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-primary-600 via-blue-600 to-primary-600 bg-clip-text text-transparent animate-gradient">
                Healthy Recipes
              </span>
              <motion.div
                className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary-400 via-blue-400 to-primary-400 rounded-full"
                initial={{ scaleX: 0 }}
                animate={isInView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.6 }}
              />
            </span>
          </motion.h1>

          {/* Subheadline with stagger */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Join our community of health-conscious cooks. Browse thousands of nutritious recipes,
            share your culinary creations, and inspire others on their wellness journey.
          </motion.p>

          {/* CTA Buttons with enhanced effects */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Link to="/auth">
                <Button size="lg" className="text-lg px-8 py-6 shadow-2xl relative overflow-hidden group">
                  <span className="relative z-10 flex items-center">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary-700 to-blue-700"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </Button>
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Link to="/browse">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 py-6 border-2 bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-xl transition-all"
                >
                  Browse Recipes
                  <Search className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Floating Recipe Cards Animation */}
          <div className="relative mt-20 h-80 flex justify-center items-center">
            <div className="relative w-full max-w-4xl mx-auto h-full">
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 100 }}
                  animate={
                    isInView
                      ? {
                          opacity: [0, 1, 1, 0],
                          y: [100, 20, 0, -100],
                        }
                      : {}
                  }
                  transition={{
                    duration: 5,
                    delay: i * 0.4,
                    repeat: Infinity,
                    repeatDelay: 1.5,
                    ease: 'easeInOut',
                  }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  style={{
                    zIndex: 3 - i,
                    left: `calc(50% + ${(i - 1) * 120}px)`,
                  }}
                >
                  <Card className="w-56 p-5 shadow-2xl bg-white/95 backdrop-blur-sm hover:shadow-3xl transition-shadow duration-300">
                    <div className="h-36 bg-gradient-to-br from-primary-100 via-blue-100 to-primary-200 rounded-xl mb-3 flex items-center justify-center overflow-hidden relative">
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: [0, 5, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                      >
                        <Sparkles className="h-10 w-10 text-primary-600" />
                      </motion.div>
                      <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-full text-xs font-semibold text-primary-600">
                        ★ 4.{8 - i}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full" />
                      <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-100 rounded-full w-3/4" />
                      <div className="flex gap-1 mt-3">
                        <div className="h-2 w-2 rounded-full bg-green-400" />
                        <div className="h-2 w-2 rounded-full bg-orange-400" />
                        <div className="h-2 w-2 rounded-full bg-blue-400" />
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-primary-600 rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-primary-600 rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  );
};

// Features Section
const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const features = [
    {
      icon: Search,
      title: 'Smart Search',
      description:
        'Find recipes using natural language. Search by ingredients, cuisine, diet, or cooking time.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: ChefHat,
      title: 'Recipe Submission',
      description:
        'Share your culinary creations with the community. Upload recipes with detailed instructions.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: Star,
      title: 'Ratings & Reviews',
      description:
        'Rate recipes and leave comments. Help others discover the best healthy dishes.',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Bell,
      title: 'Real-time Notifications',
      description:
        'Stay updated with instant notifications for recipe approvals, comments, and new content.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Users,
      title: 'Community',
      description:
        'Connect with health-conscious cooks. Follow chefs and discover their latest recipes.',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description:
        'Track recipe performance, view engagement metrics, and understand your audience.',
      color: 'from-red-500 to-pink-500',
    },
  ];

  return (
    <section ref={ref} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Everything You Need
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Powerful features designed to make healthy cooking accessible and enjoyable for
            everyone.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="p-6 h-full hover:shadow-xl transition-shadow duration-300 group">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}
                >
                  <feature.icon className="h-7 w-7 text-white" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// How It Works Section
const HowItWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const steps = [
    {
      number: 1,
      title: 'Browse & Discover',
      description: 'Explore thousands of healthy recipes tailored to your dietary preferences and goals.',
      icon: Search,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
    },
    {
      number: 2,
      title: 'Try & Rate',
      description: 'Cook recipes at home, rate them, and share your culinary experience with others.',
      icon: Star,
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-50',
    },
    {
      number: 3,
      title: 'Share & Inspire',
      description: 'Submit your own healthy recipes and inspire the community on their wellness journey.',
      icon: Heart,
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
    },
  ];

  return (
    <section ref={ref} className="py-24 bg-white relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary-100 rounded-full opacity-20 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-100 rounded-full opacity-20 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : {}}
            transition={{ duration: 0.5, type: 'spring' }}
            className="inline-block mb-4"
          >
            <div className="px-4 py-2 bg-gradient-to-r from-primary-100 to-blue-100 rounded-full">
              <span className="text-primary-700 font-semibold text-sm">Simple Process</span>
            </div>
          </motion.div>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Getting started is easy. Join our community in three simple steps.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connecting Path - Desktop Only */}
          <div className="hidden lg:block absolute top-32 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary-300 to-transparent">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={isInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.5, delay: 0.5, ease: 'easeInOut' }}
              className="h-full bg-gradient-to-r from-primary-400 via-primary-600 to-primary-400 origin-left"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 50 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                {/* Card */}
                <motion.div
                  whileHover={{ y: -10 }}
                  className="relative bg-white rounded-2xl p-8 shadow-lg border border-gray-100 h-full hover:shadow-2xl transition-shadow duration-300"
                >
                  {/* Number Badge */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={isInView ? { scale: 1, rotate: 0 } : {}}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.2 + 0.3,
                      type: 'spring',
                      stiffness: 200,
                    }}
                    className="absolute -top-6 left-1/2 -translate-x-1/2"
                  >
                    <div className="relative">
                      <div
                        className={`w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg`}
                      >
                        <span className="text-2xl font-bold text-white relative z-10">
                          {step.number}
                        </span>
                      </div>
                      {/* Pulse Effect */}
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 0, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                        className={`absolute inset-0 rounded-full bg-gradient-to-br ${step.color}`}
                      />
                    </div>
                  </motion.div>

                  {/* Icon Container */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className={`inline-flex items-center justify-center w-20 h-20 ${step.bgColor} rounded-2xl mb-6 mt-8`}
                  >
                    <step.icon className="h-10 w-10 text-gray-700" />
                  </motion.div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>

                  {/* Decorative Element */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>

                {/* Arrow Between Steps - Desktop Only */}
                {index < steps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.2 + 0.5 }}
                    className="hidden lg:block absolute top-32 -right-4 z-20"
                  >
                    <ArrowRight className="h-8 w-8 text-primary-400" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <Link to="/auth">
            <Button size="lg" className="shadow-lg hover:shadow-xl transition-shadow">
              Start Your Journey Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

// Stats Section with Animated Counters
const StatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  const stats = [
    { value: 1000, suffix: '+', label: 'Healthy Recipes', icon: ChefHat },
    { value: 500, suffix: '+', label: 'Talented Chefs', icon: Users },
    { value: 5000, suffix: '+', label: 'Happy Users', icon: Heart },
    { value: 10000, suffix: '+', label: 'Ratings Given', icon: Star },
  ];

  return (
    <section ref={ref} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Join Our Growing Community
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Thousands of people are already making healthier choices with FitRecipes.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1, type: 'spring' }}
              className="text-center"
            >
              <Card className="p-8 hover:shadow-xl transition-shadow duration-300">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 + 0.3 }}
                  className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full mb-4"
                >
                  <stat.icon className="h-8 w-8 text-white" />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : {}}
                  transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                >
                  <AnimatedCounter
                    value={stat.value}
                    suffix={stat.suffix}
                    isInView={isInView}
                    delay={index * 0.1}
                  />
                </motion.div>
                <p className="text-gray-600 font-medium mt-2">{stat.label}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Animated Counter Component
const AnimatedCounter = ({
  value,
  suffix,
  isInView,
  delay,
}: {
  value: number;
  suffix: string;
  isInView: boolean;
  delay: number;
}) => {
  return (
    <motion.p
      className="text-4xl font-bold text-gray-900"
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.5, delay }}
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={
          isInView
            ? {
                opacity: 1,
              }
            : {}
        }
      >
        {isInView ? (
          <CountUp end={value} duration={2} delay={delay} />
        ) : (
          <span>0{suffix}</span>
        )}
      </motion.span>
    </motion.p>
  );
};

// Count Up Component
const CountUp = ({ end, duration, delay }: { end: number; duration: number; delay: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      let start = 0;
      const increment = end / (duration * 60);
      const counter = setInterval(() => {
        start += increment;
        if (start >= end) {
          setCount(end);
          clearInterval(counter);
        } else {
          setCount(Math.floor(start));
        }
      }, 1000 / 60);

      return () => clearInterval(counter);
    }, delay * 1000);

    return () => clearTimeout(timer);
  }, [end, duration, delay]);

  return <span ref={ref}>{count.toLocaleString()}+</span>;
};

// CTA Section
const CTASection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 relative overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-primary-700 to-blue-700">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 50% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)',
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-block mb-6"
          >
            <Sparkles className="h-16 w-16 text-white" />
          </motion.div>

          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Ready to Start Your Healthy Cooking Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of health-conscious cooks today. Discover new recipes, share your
            creations, and inspire others.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Link to="/auth">
                <Button
                  size="lg"
                  className="bg-white text-primary-600 hover:bg-blue-50 text-lg px-8 py-6 shadow-xl"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Link to="/browse">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6"
                >
                  Explore Recipes
                  <Clock className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// Footer
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <ChefHat className="h-8 w-8 text-primary-500 mr-2" />
            <span className="text-2xl font-bold text-white">FitRecipes</span>
          </div>
          <p className="text-gray-400 mb-6">
            Discover and share healthy recipes with our community
          </p>
          <div className="flex justify-center space-x-6 mb-6">
            <Link to="/terms" className="hover:text-primary-500 transition-colors">
              Terms of Service
            </Link>
            <Link to="/auth" className="hover:text-primary-500 transition-colors">
              Sign In
            </Link>
            <Link to="/browse" className="hover:text-primary-500 transition-colors">
              Browse
            </Link>
          </div>
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} FitRecipes. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default LandingPage;
