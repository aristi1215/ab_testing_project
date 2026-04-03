import { useEffect } from 'react';
import { motion } from 'motion/react';
import { X } from 'lucide-react';
import { Button } from './ui/button';
import { LandingPagePreview } from './LandingPagePreview';
import { LandingPageTest } from '../types';

interface VisitorViewProps {
  test: LandingPageTest;
  onClose: () => void;
  onRecordInteraction: (variantId: string, type: 'view' | 'click') => void;
}

export function VisitorView({ test, onClose, onRecordInteraction }: VisitorViewProps) {
  // Randomly select a variant (weighted by traffic split if needed, but here we'll do equal)
  const randomVariant = test.variants[Math.floor(Math.random() * test.variants.length)];

  useEffect(() => {
    // Record view when component mounts
    onRecordInteraction(randomVariant.id, 'view');
  }, [randomVariant.id, onRecordInteraction]);

  const handleCtaClick = () => {
    onRecordInteraction(randomVariant.id, 'click');
    // Show success message
    alert(`🎉 Conversion recorded for ${randomVariant.name}!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black z-50"
    >
      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 z-10 text-white hover:bg-white/20"
        onClick={onClose}
      >
        <X className="size-6" />
      </Button>

      {/* Variant label (for demo purposes - in real use this would be hidden) */}
      <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-black/80 text-white text-sm rounded-lg backdrop-blur">
        Showing: {randomVariant.name}
      </div>

      {/* Landing page */}
      <div className="w-full h-full">
        <LandingPagePreview variant={randomVariant} onCtaClick={handleCtaClick} />
      </div>
    </motion.div>
  );
}
