import { motion } from 'motion/react';
import { Button } from './ui/button';
import { LandingPageVariant } from '../types';

interface LandingPagePreviewProps {
  variant: LandingPageVariant;
  onCtaClick: () => void;
}

export function LandingPagePreview({ variant, onCtaClick }: LandingPagePreviewProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full h-full flex items-center justify-center p-8"
      style={{ backgroundColor: variant.backgroundColor }}
    >
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-center">
        {/* Content Side */}
        <div className="space-y-6 text-center md:text-left">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl leading-tight"
            style={{ color: variant.backgroundColor === '#000000' ? '#ffffff' : '#000000' }}
          >
            {variant.headline}
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="text-xl opacity-80"
            style={{ color: variant.backgroundColor === '#000000' ? '#e5e5e5' : '#404040' }}
          >
            {variant.subheadline}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Button
              size="lg"
              className="text-lg px-8 py-6"
              style={{ 
                backgroundColor: variant.ctaColor,
                color: '#ffffff'
              }}
              onClick={onCtaClick}
            >
              {variant.ctaText}
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center gap-4 justify-center md:justify-start text-sm opacity-60"
            style={{ color: variant.backgroundColor === '#000000' ? '#ffffff' : '#000000' }}
          >
            <div className="flex items-center gap-2">
              <svg className="size-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>4.9 rating</span>
            </div>
            <span>•</span>
            <span>10,000+ users</span>
          </motion.div>
        </div>

        {/* Image Side */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={variant.imageUrl}
              alt="Product preview"
              className="w-full h-full object-cover"
            />
          </div>
          
          {/* Decorative elements */}
          <div 
            className="absolute -top-4 -right-4 size-24 rounded-full blur-3xl opacity-40"
            style={{ backgroundColor: variant.ctaColor }}
          />
          <div 
            className="absolute -bottom-4 -left-4 size-32 rounded-full blur-3xl opacity-30"
            style={{ backgroundColor: variant.ctaColor }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
