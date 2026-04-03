import { Beaker, Play, Pause, BarChart3, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

export interface Test {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  variants: Variant[];
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  targetSampleSize: number;
}

export interface Variant {
  id: string;
  name: string;
  description: string;
  traffic: number; // percentage
  visitors: number;
  conversions: number;
  conversionRate: number;
}

interface TestListProps {
  tests: Test[];
  onSelectTest: (testId: string) => void;
  onToggleStatus: (testId: string) => void;
  onDeleteTest: (testId: string) => void;
}

export function TestList({ tests, onSelectTest, onToggleStatus, onDeleteTest }: TestListProps) {
  const getStatusColor = (status: Test['status']) => {
    switch (status) {
      case 'running':
        return 'bg-green-500';
      case 'paused':
        return 'bg-yellow-500';
      case 'completed':
        return 'bg-blue-500';
      default:
        return 'bg-gray-400';
    }
  };

  const getTotalVisitors = (test: Test) => {
    return test.variants.reduce((sum, v) => sum + v.visitors, 0);
  };

  const getProgress = (test: Test) => {
    const total = getTotalVisitors(test);
    return Math.min((total / test.targetSampleSize) * 100, 100);
  };

  if (tests.length === 0) {
    return (
      <Card className="col-span-full">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Beaker className="size-16 text-muted-foreground mb-4" />
          <p className="text-xl mb-2">No tests yet</p>
          <p className="text-sm text-muted-foreground">Create your first A/B test to get started</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {tests.map((test) => {
        const totalVisitors = getTotalVisitors(test);
        const progress = getProgress(test);
        const winner = test.variants.reduce((prev, current) => 
          current.conversionRate > prev.conversionRate ? current : prev
        );

        return (
          <Card key={test.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {test.name}
                    <Badge variant="outline" className={getStatusColor(test.status)}>
                      {test.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="mt-2">{test.description}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onToggleStatus(test.id)}
                    disabled={test.status === 'completed'}
                  >
                    {test.status === 'running' ? (
                      <Pause className="size-4" />
                    ) : (
                      <Play className="size-4" />
                    )}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDeleteTest(test.id)}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Progress */}
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progress</span>
                    <span className="text-muted-foreground">
                      {totalVisitors.toLocaleString()} / {test.targetSampleSize.toLocaleString()} visitors
                    </span>
                  </div>
                  <Progress value={progress} />
                </div>

                {/* Variants Summary */}
                <div>
                  <div className="text-sm mb-2">Variants</div>
                  <div className="grid grid-cols-2 gap-2">
                    {test.variants.map((variant) => (
                      <div
                        key={variant.id}
                        className={`p-3 rounded-lg border-2 ${
                          variant.id === winner.id && totalVisitors > 0
                            ? 'border-green-500 bg-green-50'
                            : 'border-border'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{variant.name}</span>
                          {variant.id === winner.id && totalVisitors > 0 && (
                            <Badge variant="outline" className="bg-green-500 text-white border-green-600">
                              Leading
                            </Badge>
                          )}
                        </div>
                        <div className="text-2xl">
                          {variant.visitors > 0
                            ? `${(variant.conversionRate * 100).toFixed(1)}%`
                            : '—'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {variant.conversions} / {variant.visitors} conversions
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* View Details Button */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => onSelectTest(test.id)}
                >
                  <BarChart3 className="size-4 mr-2" />
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
}
