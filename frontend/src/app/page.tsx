import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Zap, Shield, Users, TrendingUp, Star, Rocket, Globe } from 'lucide-react';
import { HeroSection } from '@/components/sections/HeroSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { StatsSection } from '@/components/sections/StatsSection';
import { HowItWorksSection } from '@/components/sections/HowItWorksSection';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { CTASection } from '@/components/sections/CTASection';
import { AnimatedBackground } from '@/components/AnimatedBackground';

export const metadata: Metadata = {
  title: 'LaunchStream - Crypto Token Creation Platform',
  description: 'Create and launch tokens on Ethereum with our secure, feature-rich platform. One-click token creation with automatic liquidity and Uniswap integration.',
};

const features = [
  {
    icon: <Zap className="w-8 h-8" />,
    title: 'Lightning Fast',
    description: 'Create tokens in under 30 seconds with our optimized smart contracts.',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-400/10',
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: 'Enterprise Security',
    description: 'Audited contracts with multi-layer security and anti-bot protection.',
    color: 'text-green-400',
    bgColor: 'bg-green-400/10',
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: 'Community Driven',
    description: 'Built-in community tools and social features for token success.',
    color: 'text-blue-400',
    bgColor: 'bg-blue-400/10',
  },
  {
    icon: <TrendingUp className="w-8 h-8" />,
    title: 'Auto Liquidity',
    description: 'Automatic PancakeSwap integration with instant liquidity provision.',
    color: 'text-purple-400',
    bgColor: 'bg-purple-400/10',
  },
  {
    icon: <Star className="w-8 h-8" />,
    title: 'Professional Grade',
    description: 'Advanced features like fee distribution and trading controls.',
    color: 'text-pink-400',
    bgColor: 'bg-pink-400/10',
  },
  {
    icon: <Globe className="w-8 h-8" />,
    title: 'Multi-Chain Ready',
    description: 'Built for Ethereum with expansion to other EVM networks planned.',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-400/10',
  },
];

const stats = [
  { label: 'Tokens Created', value: '10,000+', icon: <Rocket className="w-8 h-8 text-blue-400" /> },
  { label: 'Total Volume', value: '$50M+', icon: <TrendingUp className="w-8 h-8 text-blue-400" /> },
  { label: 'Active Users', value: '25,000+', icon: <Users className="w-8 h-8 text-blue-400" /> },
  { label: 'Success Rate', value: '99.9%', icon: <Shield className="w-8 h-8 text-blue-400" /> },
];

const steps = [
  {
    step: '01',
    title: 'Connect Wallet',
    description: 'Connect your Web3 wallet to get started with token creation.',
    icon: <Users className="w-8 h-8" />,
  },
  {
    step: '02',
    title: 'Configure Token',
    description: 'Set your token details, supply, and metadata in our intuitive form.',
    icon: <Zap className="w-8 h-8" />,
  },
  {
    step: '03',
    title: 'Add Liquidity',
    description: 'Provide initial liquidity and set trading parameters.',
    icon: <TrendingUp className="w-8 h-8" />,
  },
  {
    step: '04',
    title: 'Launch & Trade',
    description: 'Your token goes live on PancakeSwap with instant trading.',
    icon: <Rocket className="w-8 h-8" />,
  },
];

const testimonials = [
  {
    name: 'Alex Chen',
    role: 'Token Creator',
    content: 'Four.Meme Launchpad made creating my token incredibly easy. The professional features and security gave me confidence from day one.',
    avatar: '/avatars/alex.jpg',
    rating: 5,
  },
  {
    name: 'Sarah Johnson',
    role: 'DeFi Investor',
    content: 'The automatic liquidity and PancakeSwap integration saved me hours of manual work. Highly recommended!',
    avatar: '/avatars/sarah.jpg',
    rating: 5,
  },
  {
    name: 'Mike Rodriguez',
    role: 'Community Manager',
    content: 'The community tools and social features helped our token gain traction quickly. Great platform!',
    avatar: '/avatars/mike.jpg',
    rating: 5,
  },
];

export default function HomePage() {
  return (
    <>
      <AnimatedBackground />
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Stats Section */}
      <StatsSection stats={stats} />
      
      {/* Features Section */}
      <FeaturesSection features={features} />
      
      {/* How It Works Section */}
      <HowItWorksSection steps={steps} />
      
      {/* Testimonials Section */}
      <TestimonialsSection testimonials={testimonials} />
      
      {/* CTA Section */}
      <CTASection />
    </>
  );
}
