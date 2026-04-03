import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

interface Variant {
  id: string;
  name: string;
  description: string;
  traffic: number;
}

interface CreateTestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateTest: (data: {
    name: string;
    description: string;
    variants: Variant[];
    targetSampleSize: number;
  }) => void;
}

export function CreateTestDialog({ open, onOpenChange, onCreateTest }: CreateTestDialogProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [targetSampleSize, setTargetSampleSize] = useState('10000');
  const [variants, setVariants] = useState<Variant[]>([
    { id: '1', name: 'Control', description: 'Original version', traffic: 50 },
    { id: '2', name: 'Variant A', description: 'Test variation', traffic: 50 },
  ]);

  const handleAddVariant = () => {
    const newVariant: Variant = {
      id: Date.now().toString(),
      name: `Variant ${String.fromCharCode(65 + variants.length - 1)}`,
      description: '',
      traffic: 0,
    };

    // Redistribute traffic evenly
    const newTraffic = 100 / (variants.length + 1);
    const updatedVariants = variants.map((v) => ({ ...v, traffic: newTraffic }));

    setVariants([...updatedVariants, { ...newVariant, traffic: newTraffic }]);
  };

  const handleRemoveVariant = (id: string) => {
    if (variants.length <= 2) return; // Minimum 2 variants
    const filtered = variants.filter((v) => v.id !== id);
    
    // Redistribute traffic evenly
    const newTraffic = 100 / filtered.length;
    const updated = filtered.map((v) => ({ ...v, traffic: newTraffic }));
    
    setVariants(updated);
  };

  const handleVariantChange = (id: string, field: keyof Variant, value: string | number) => {
    setVariants(variants.map((v) => (v.id === id ? { ...v, [field]: value } : v)));
  };

  const handleTrafficChange = (id: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    const clamped = Math.max(0, Math.min(100, numValue));
    handleVariantChange(id, 'traffic', clamped);
  };

  const totalTraffic = variants.reduce((sum, v) => sum + v.traffic, 0);

  const handleCreate = () => {
    if (!name.trim() || totalTraffic !== 100) return;

    onCreateTest({
      name: name.trim(),
      description: description.trim(),
      variants,
      targetSampleSize: parseInt(targetSampleSize) || 10000,
    });

    // Reset form
    setName('');
    setDescription('');
    setTargetSampleSize('10000');
    setVariants([
      { id: '1', name: 'Control', description: 'Original version', traffic: 50 },
      { id: '2', name: 'Variant A', description: 'Test variation', traffic: 50 },
    ]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New A/B Test</DialogTitle>
          <DialogDescription>
            Set up a new experiment with multiple variants to test different approaches
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Test Details */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="test-name">Test Name *</Label>
              <Input
                id="test-name"
                placeholder="e.g., Homepage Hero Test"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="test-description">Description</Label>
              <Textarea
                id="test-description"
                placeholder="Describe what you're testing..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="sample-size">Target Sample Size *</Label>
              <Input
                id="sample-size"
                type="number"
                min="100"
                placeholder="10000"
                value={targetSampleSize}
                onChange={(e) => setTargetSampleSize(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Total number of visitors needed for statistical significance
              </p>
            </div>
          </div>

          {/* Variants */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Variants *</Label>
              <Button variant="outline" size="sm" onClick={handleAddVariant}>
                <Plus className="size-4 mr-2" />
                Add Variant
              </Button>
            </div>

            <div className="space-y-3">
              {variants.map((variant, index) => (
                <div key={variant.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Variant {index + 1}</span>
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
                    <div>
                      <Label>Name</Label>
                      <Input
                        placeholder="e.g., Control"
                        value={variant.name}
                        onChange={(e) => handleVariantChange(variant.id, 'name', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Traffic Split (%)</Label>
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        value={variant.traffic}
                        onChange={(e) => handleTrafficChange(variant.id, e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Description</Label>
                    <Input
                      placeholder="Describe this variant..."
                      value={variant.description}
                      onChange={(e) => handleVariantChange(variant.id, 'description', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Traffic validation */}
            <div className={`text-sm ${totalTraffic === 100 ? 'text-green-600' : 'text-destructive'}`}>
              Total traffic split: {totalTraffic.toFixed(1)}%
              {totalTraffic !== 100 && ' (must equal 100%)'}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!name.trim() || totalTraffic !== 100}
          >
            Create Test
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
