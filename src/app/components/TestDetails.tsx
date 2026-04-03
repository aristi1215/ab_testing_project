import { ArrowLeft, Play, Pause, RotateCcw, TrendingUp, TrendingDown } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Test } from './TestList';

interface TestDetailsProps {
  test: Test;
  onBack: () => void;
  onToggleStatus: () => void;
  onSimulate: (batchSize: number) => void;
  onReset: () => void;
}

export function TestDetails({ test, onBack, onToggleStatus, onSimulate, onReset }: TestDetailsProps) {
  const totalVisitors = test.variants.reduce((sum, v) => sum + v.visitors, 0);
  const totalConversions = test.variants.reduce((sum, v) => sum + v.conversions, 0);
  const overallConversionRate = totalVisitors > 0 ? totalConversions / totalVisitors : 0;
  const progress = Math.min((totalVisitors / test.targetSampleSize) * 100, 100);

  // Find control (first variant) for comparison
  const control = test.variants[0];
  
  // Calculate statistical significance (simplified z-test)
  const calculateSignificance = (variant: typeof test.variants[0]) => {
    if (variant.visitors < 30 || control.visitors < 30) return null;
    
    const p1 = variant.conversionRate;
    const p2 = control.conversionRate;
    const n1 = variant.visitors;
    const n2 = control.visitors;
    
    if (p1 === p2) return null;
    
    const pooled = ((p1 * n1) + (p2 * n2)) / (n1 + n2);
    const se = Math.sqrt(pooled * (1 - pooled) * (1/n1 + 1/n2));
    
    if (se === 0) return null;
    
    const z = Math.abs((p1 - p2) / se);
    
    // Convert z-score to confidence level (simplified)
    if (z > 2.58) return 99;
    if (z > 1.96) return 95;
    if (z > 1.65) return 90;
    return null;
  };

  const calculateLift = (variant: typeof test.variants[0]) => {
    if (control.conversionRate === 0) return null;
    return ((variant.conversionRate - control.conversionRate) / control.conversionRate) * 100;
  };

  // Prepare chart data
  const chartData = test.variants.map((variant) => ({
    name: variant.name,
    visitors: variant.visitors,
    conversions: variant.conversions,
    conversionRate: (variant.conversionRate * 100).toFixed(2),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Button variant="ghost" size="sm" onClick={onBack} className="mb-2 -ml-2">
            <ArrowLeft className="size-4 mr-2" />
            Back to Tests
          </Button>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl">{test.name}</h2>
            <Badge variant="outline">{test.status}</Badge>
          </div>
          {test.description && (
            <p className="text-muted-foreground mt-2">{test.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={onReset}
            disabled={test.status === 'running'}
          >
            <RotateCcw className="size-4 mr-2" />
            Reset
          </Button>
          <Button
            onClick={onToggleStatus}
            disabled={test.status === 'completed'}
          >
            {test.status === 'running' ? (
              <>
                <Pause className="size-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="size-4 mr-2" />
                {test.status === 'paused' ? 'Resume' : 'Start'}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle>Test Progress</CardTitle>
          <CardDescription>
            {totalVisitors.toLocaleString()} / {test.targetSampleSize.toLocaleString()} visitors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="h-3" />
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl">{totalVisitors.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Visitors</div>
            </div>
            <div>
              <div className="text-2xl">{totalConversions.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Conversions</div>
            </div>
            <div>
              <div className="text-2xl">{(overallConversionRate * 100).toFixed(2)}%</div>
              <div className="text-sm text-muted-foreground">Overall CVR</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Simulator Controls */}
      {test.status === 'running' && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle>Traffic Simulator</CardTitle>
            <CardDescription>
              Generate simulated traffic to see how the test progresses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button onClick={() => onSimulate(100)} variant="outline">
                +100 Visitors
              </Button>
              <Button onClick={() => onSimulate(500)} variant="outline">
                +500 Visitors
              </Button>
              <Button onClick={() => onSimulate(1000)} variant="outline">
                +1000 Visitors
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Variants Performance */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
          <TabsTrigger value="statistical">Statistical Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {test.variants.map((variant, index) => {
              const isControl = index === 0;
              const lift = calculateLift(variant);
              const significance = calculateSignificance(variant);

              return (
                <Card key={variant.id} className={isControl ? 'border-blue-300' : undefined}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        {variant.name}
                        {isControl && <Badge variant="outline">Control</Badge>}
                      </CardTitle>
                      {significance && !isControl && (
                        <Badge variant="outline" className="bg-green-50 border-green-300">
                          {significance}% confident
                        </Badge>
                      )}
                    </div>
                    <CardDescription>{variant.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-6 bg-muted rounded-lg">
                      <div className="text-4xl mb-2">
                        {(variant.conversionRate * 100).toFixed(2)}%
                      </div>
                      <div className="text-sm text-muted-foreground">Conversion Rate</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Visitors</div>
                        <div className="text-xl">{variant.visitors.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Conversions</div>
                        <div className="text-xl">{variant.conversions.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Traffic Split</div>
                        <div className="text-xl">{variant.traffic.toFixed(0)}%</div>
                      </div>
                      {!isControl && lift !== null && (
                        <div>
                          <div className="text-muted-foreground">Lift vs Control</div>
                          <div className={`text-xl flex items-center ${lift > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {lift > 0 ? <TrendingUp className="size-4 mr-1" /> : <TrendingDown className="size-4 mr-1" />}
                            {lift > 0 ? '+' : ''}{lift.toFixed(2)}%
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="charts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Conversion Rate Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'Conversion Rate (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="conversionRate" fill="#3b82f6" name="Conversion Rate (%)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Visitors vs Conversions</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="visitors" fill="#8b5cf6" name="Visitors" />
                  <Bar dataKey="conversions" fill="#10b981" name="Conversions" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="statistical" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Statistical Significance</CardTitle>
              <CardDescription>
                Comparison against control variant ({control.name})
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {test.variants.slice(1).map((variant) => {
                  const significance = calculateSignificance(variant);
                  const lift = calculateLift(variant);

                  return (
                    <div key={variant.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium">{variant.name} vs {control.name}</h4>
                        {significance ? (
                          <Badge className="bg-green-500">
                            {significance}% Confident
                          </Badge>
                        ) : (
                          <Badge variant="outline">
                            Need More Data
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <div className="text-muted-foreground">Sample Size</div>
                          <div className="text-lg">{variant.visitors}</div>
                          <div className="text-xs text-muted-foreground">
                            {variant.visitors < 30 ? 'Minimum: 30' : 'Sufficient'}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Lift</div>
                          <div className={`text-lg ${lift && lift > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {lift !== null ? `${lift > 0 ? '+' : ''}${lift.toFixed(2)}%` : 'N/A'}
                          </div>
                        </div>
                        <div>
                          <div className="text-muted-foreground">Winner Probability</div>
                          <div className="text-lg">
                            {significance ? `${significance}%+` : '< 90%'}
                          </div>
                        </div>
                      </div>

                      {!significance && variant.visitors < 30 && (
                        <p className="text-xs text-muted-foreground mt-3">
                          At least 30 visitors per variant needed for statistical analysis
                        </p>
                      )}
                    </div>
                  );
                })}

                <div className="p-4 bg-muted rounded-lg text-sm">
                  <h4 className="font-medium mb-2">Understanding Statistical Significance:</h4>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• <strong>90% confident:</strong> Good indicator, but continue testing</li>
                    <li>• <strong>95% confident:</strong> Industry standard for making decisions</li>
                    <li>• <strong>99% confident:</strong> Very strong evidence of a difference</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
