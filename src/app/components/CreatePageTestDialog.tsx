import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Plus, Trash2 } from 'lucide-react';

interface VariantForm {
  id: string;
  name: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaColor: string;
  imageQuery: string;
  backgroundColor: string;
}

interface CreatePageTestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTest: (data: {
    name: string;
    variants: Array<{
      name: string;
      headline: string;
      subheadline: string;
      ctaText: string;
      ctaColor: string;
      imageQuery: string;
      backgroundColor: string;
    }>;
  }) => void;
}

export function CreatePageTestDialog({ open, onOpenChange, onCreateTest }: CreatePageTestDialogProps) {
  const [testName, setTestName] = useState('');
  const [variants, setVariants] = useState<VariantForm[]>([
    {
      id: '1',
      name: 'Control',
      headline: 'Transform Your Business Today',
      subheadline: 'Join thousands of companies already growing with our platform',
      ctaText: 'Get Started Free',
      ctaColor: '#3b82f6',
      imageQuery: 'business technology',
      backgroundColor: '#ffffff',
    },
    {
      id: '2',
      name: 'Variant A',
      headline: 'Grow Faster Than Ever',
      subheadline: 'The all-in-one solution that scales with your success',
      ctaText: 'Start Free Trial',
      ctaColor: '#10b981',
      imageQuery: 'success growth',
      backgroundColor: '#f0fdf4',
    },
  ]);

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      {
        id: Date.now().toString(),
        name: `Variant ${String.fromCharCode(65 + variants.length - 1)}`,
        headline: 'Your Compelling Headline',
        subheadline: 'A subheadline that explains the value proposition',
        ctaText: 'Get Started',
        ctaColor: '#8b5cf6',
        imageQuery: 'modern design',
        backgroundColor: '#ffffff',
      },
    ]);
  };

  const handleRemoveVariant = (id: string) => {
    if (variants.length <= 2) return;
    setVariants(variants.filter((v) => v.id !== id));
  };

  const updateVariant = (id: string, field: keyof VariantForm, value: string) => {
    setVariants(variants.map((v) => (v.id === id ? { ...v, [field]: value } : v)));
  };

  const handleCreate = () => {
    if (!testName.trim()) return;

    onCreateTest({
      name: testName.trim(),
      variants: variants.map(({ id, ...rest }) => rest),
    });

    // Reset
    setTestName('');
    setVariants([
      {
        id: '1',
        name: 'Control',
        headline: 'Transform Your Business Today',
        subheadline: 'Join thousands of companies already growing with our platform',
        ctaText: 'Get Started Free',
        ctaColor: '#3b82f6',
        imageQuery: 'business technology',
        backgroundColor: '#ffffff',
      },
      {
        id: '2',
        name: 'Variant A',
        headline: 'Grow Faster Than Ever',
        subheadline: 'The all-in-one solution that scales with your success',
        ctaText: 'Start Free Trial',
        ctaColor: '#10b981',
        imageQuery: 'success growth',
        backgroundColor: '#f0fdf4',
      },
    ]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Landing Page A/B Test</DialogTitle>
          <DialogDescription>
            Design different versions of your landing page to test what converts best
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div>
            <Label htmlFor="test-name">Test Name *</Label>
            <Input
              id="test-name"
              placeholder="e.g., Homepage Hero Test Q2 2024"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Page Variants</Label>
              <Button variant="outline" size="sm" onClick={handleAddVariant}>
                <Plus className="size-4 mr-2" />
                Add Variant
              </Button>
            </div>

            <div className="space-y-4">
              {variants.map((variant, index) => (
                <div key={variant.id} className="p-4 border rounded-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{variant.name}</span>
                      {index === 0 && (
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                          Control
                        </span>
                      )}
                    </div>
                    {variants.length > 2 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveVariant(variant.id)}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="col-span-2">
                      <Label>Variant Name</Label>
                      <Input
                        value={variant.name}
                        onChange={(e) => updateVariant(variant.id, 'name', e.target.value)}
                      />
                    </div>

                    <div className="col-span-2">
                      <Label>Headline</Label>
                      <Input
                        value={variant.headline}
                        onChange={(e) => updateVariant(variant.id, 'headline', e.target.value)}
                        placeholder="Your main headline"
                      />
                    </div>

                    <div className="col-span-2">
                      <Label>Subheadline</Label>
                      <Textarea
                        value={variant.subheadline}
                        onChange={(e) => updateVariant(variant.id, 'subheadline', e.target.value)}
                        placeholder="Supporting text"
                        rows={2}
                      />
                    </div>

                    <div>
                      <Label>CTA Button Text</Label>
                      <Input
                        value={variant.ctaText}
                        onChange={(e) => updateVariant(variant.id, 'ctaText', e.target.value)}
                        placeholder="Get Started"
                      />
                    </div>

                    <div>
                      <Label>CTA Button Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={variant.ctaColor}
                          onChange={(e) => updateVariant(variant.id, 'ctaColor', e.target.value)}
                          className="w-20"
                        />
                        <Input
                          value={variant.ctaColor}
                          onChange={(e) => updateVariant(variant.id, 'ctaColor', e.target.value)}
                          placeholder="#3b82f6"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Background Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={variant.backgroundColor}
                          onChange={(e) => updateVariant(variant.id, 'backgroundColor', e.target.value)}
                          className="w-20"
                        />
                        <Input
                          value={variant.backgroundColor}
                          onChange={(e) => updateVariant(variant.id, 'backgroundColor', e.target.value)}
                          placeholder="#ffffff"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Image Search Query</Label>
                      <Input
                        value={variant.imageQuery}
                        onChange={(e) => updateVariant(variant.id, 'imageQuery', e.target.value)}
                        placeholder="e.g., modern office"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!testName.trim()}>
            Create Test
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
