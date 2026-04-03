import { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink, RefreshCw, Award, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { LandingPagePreview } from './LandingPagePreview';
import { LandingPageTest } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TestAnalyticsProps {
  test: LandingPageTest;
  onBack: () => void;
  onToggleStatus: () => void;
  onViewAsVisitor: () => void;
  onRecordInteraction: (variantId: string, type: 'view' | 'click') => void;
}

export function TestAnalytics({
  test,
  onBack,
  onToggleStatus,
  onViewAsVisitor,
  onRecordInteraction,
}: TestAnalyticsProps) {
  const [selectedVariantId, setSelectedVariantId] = useState(test.variants[0].id);
  const selectedVariant = test.variants.find((v) => v.id === selectedVariantId);

  // Auto-switch between variants every 5 seconds in preview
  useEffect(() => {
    const interval = setInterval(() => {
      const currentIndex = test.variants.findIndex((v) => v.id === selectedVariantId);
      const nextIndex = (currentIndex + 1) % test.variants.length;
      setSelectedVariantId(test.variants[nextIndex].id);
    }, 5000);

    return () => clearInterval(interval);
  }, [selectedVariantId, test.variants]);

  const totalViews = test.variants.reduce((sum, v) => sum + v.views, 0);
  const totalClicks = test.variants.reduce((sum, v) => sum + v.clicks, 0);
  const overallCtr = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;

  const winner = test.variants.reduce((prev, current) =>
    current.ctr > prev.ctr ? current : prev
  );

  const chartData = test.variants.map((v) => ({
    name: v.name,
    views: v.views,
    clicks: v.clicks,
    ctr: parseFloat(v.ctr.toFixed(2)),
  }));

  const calculateImprovement = (variant: typeof test.variants[0]) => {
    const control = test.variants[0];
    if (control.ctr === 0) return null;
    return ((variant.ctr - control.ctr) / control.ctr) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Button variant="ghost" size="sm" onClick={onBack} className="mb-2 -ml-2 text-teal-600 hover:bg-teal-50">
            <ArrowLeft className="size-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl text-slate-800">{test.name}</h2>
            <Badge
              variant="outline"
              className={
                test.status === 'live'
                  ? 'bg-teal-500 text-white border-teal-600'
                  : test.status === 'completed'
                  ? 'bg-purple-500 text-white border-purple-600'
                  : 'bg-slate-400 text-white border-slate-500'
              }
            >
              {test.status}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onViewAsVisitor} className="border-teal-200 text-teal-600 hover:bg-teal-50">
            <ExternalLink className="size-4 mr-2" />
            View as Visitor
          </Button>
          <Button onClick={onToggleStatus} disabled={test.status === 'completed'} className="bg-teal-500 hover:bg-teal-600 text-white">
            {test.status === 'live' ? 'Pause Test' : 'Resume Test'}
          </Button>
        </div>
      </div>

      {/* Overall Performance */}
      <Card className="rounded-2xl custom-card-shadow bg-white/90 backdrop-blur border-0">
        <CardHeader>
          <CardTitle className="text-slate-800">Overall Performance</CardTitle>
          <CardDescription className="text-slate-600">Aggregate metrics across all variants</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl">
              <div className="text-3xl font-semibold mb-1 text-slate-800">{totalViews}</div>
              <div className="text-sm text-teal-700">Total Views</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <div className="text-3xl font-semibold mb-1 text-slate-800">{totalClicks}</div>
              <div className="text-sm text-purple-700">Total Clicks</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-pink-100 rounded-xl">
              <div className="text-3xl font-semibold mb-1 text-slate-800">{overallCtr.toFixed(1)}%</div>
              <div className="text-sm text-pink-700">Overall CTR</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl border-2 border-teal-200">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Award className="size-5 text-teal-600" />
                <span className="text-lg font-semibold text-slate-800">{winner.name}</span>
              </div>
              <div className="text-sm text-teal-700">Best Performer</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white/70 backdrop-blur rounded-xl p-1">
          <TabsTrigger value="preview" className="rounded-lg data-[state=active]:bg-teal-500 data-[state=active]:text-white">Live Preview</TabsTrigger>
          <TabsTrigger value="performance" className="rounded-lg data-[state=active]:bg-teal-500 data-[state=active]:text-white">Performance</TabsTrigger>
          <TabsTrigger value="analysis" className="rounded-lg data-[state=active]:bg-teal-500 data-[state=active]:text-white">Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="space-y-4">
          <Card className="rounded-2xl custom-card-shadow bg-white/90 backdrop-blur border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-slate-800">Variant Preview</CardTitle>
                  <CardDescription className="text-slate-600">
                    Click through variants to see how each one looks and performs
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {test.variants.map((variant) => (
                    <Button
                      key={variant.id}
                      variant={selectedVariantId === variant.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedVariantId(variant.id)}
                      className={selectedVariantId === variant.id ? 'bg-teal-500 hover:bg-teal-600 text-white' : 'border-teal-200 text-teal-600 hover:bg-teal-50'}
                    >
                      {variant.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden bg-white" style={{ height: '600px' }}>
                {selectedVariant && (
                  <LandingPagePreview
                    variant={selectedVariant}
                    onCtaClick={() => onRecordInteraction(selectedVariant.id, 'click')}
                  />
                )}
              </div>
              <div className="mt-4 p-4 bg-gradient-to-br from-teal-50 to-purple-50 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-slate-800">{selectedVariant?.name}</span>
                    <span className="text-sm text-slate-600 ml-2">
                      {selectedVariant?.views} views • {selectedVariant?.clicks} clicks
                    </span>
                  </div>
                  <div className="text-xl font-semibold text-slate-800">
                    {selectedVariant && selectedVariant.views > 0
                      ? `${selectedVariant.ctr.toFixed(1)}% CTR`
                      : 'No data yet'}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {test.variants.map((variant, index) => {
              const improvement = calculateImprovement(variant);
              const isControl = index === 0;

              return (
                <Card key={variant.id} className={`rounded-2xl custom-card-shadow bg-white/90 backdrop-blur border-0 ${isControl ? 'ring-2 ring-teal-300' : ''}`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-slate-800">
                        {variant.name}
                        {isControl && <Badge variant="outline" className="bg-teal-100 text-teal-700 border-teal-300">Control</Badge>}
                        {variant.id === winner.id && totalViews > 0 && !isControl && (
                          <Badge className="bg-teal-500 text-white">Winner</Badge>
                        )}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-6 bg-gradient-to-br from-teal-50 to-purple-50 rounded-xl">
                      <div className="text-4xl font-semibold mb-2 text-slate-800">
                        {variant.views > 0 ? `${variant.ctr.toFixed(1)}%` : '—'}
                      </div>
                      <div className="text-sm text-slate-600">Click-Through Rate</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-slate-600">Views</div>
                        <div className="text-2xl font-semibold text-slate-800">{variant.views}</div>
                      </div>
                      <div>
                        <div className="text-slate-600">Clicks</div>
                        <div className="text-2xl font-semibold text-slate-800">{variant.clicks}</div>
                      </div>
                    </div>

                    {!isControl && improvement !== null && (
                      <div className="p-3 bg-blue-50 rounded-xl border border-blue-200">
                        <div className="text-sm text-slate-600">vs Control</div>
                        <div
                          className={`text-xl font-semibold flex items-center ${
                            improvement > 0 ? 'text-teal-600' : 'text-red-600'
                          }`}
                        >
                          <TrendingUp className="size-5 mr-2" />
                          {improvement > 0 ? '+' : ''}
                          {improvement.toFixed(1)}%
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card className="rounded-2xl custom-card-shadow bg-white/90 backdrop-blur border-0">
            <CardHeader>
              <CardTitle className="text-slate-800">Performance Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" stroke="#64748b" />
                  <YAxis yAxisId="left" stroke="#64748b" />
                  <YAxis yAxisId="right" orientation="right" stroke="#64748b" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="views" fill="#8b5cf6" name="Views" radius={[8, 8, 0, 0]} />
                  <Bar yAxisId="left" dataKey="clicks" fill="#14b8a6" name="Clicks" radius={[8, 8, 0, 0]} />
                  <Bar yAxisId="right" dataKey="ctr" fill="#ec4899" name="CTR (%)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <Card className="rounded-2xl custom-card-shadow bg-white/90 backdrop-blur border-0">
            <CardHeader>
              <CardTitle className="text-slate-800">Variant Comparison</CardTitle>
              <CardDescription className="text-slate-600">Detailed breakdown of each variant's elements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left p-3 text-slate-700">Variant</th>
                      <th className="text-left p-3 text-slate-700">Headline</th>
                      <th className="text-left p-3 text-slate-700">CTA Text</th>
                      <th className="text-left p-3 text-slate-700">CTA Color</th>
                      <th className="text-right p-3 text-slate-700">Views</th>
                      <th className="text-right p-3 text-slate-700">Clicks</th>
                      <th className="text-right p-3 text-slate-700">CTR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {test.variants.map((variant) => (
                      <tr key={variant.id} className="border-b border-slate-100 hover:bg-teal-50/50">
                        <td className="p-3 font-medium text-slate-800">{variant.name}</td>
                        <td className="p-3 max-w-xs truncate text-slate-700">{variant.headline}</td>
                        <td className="p-3 text-slate-700">{variant.ctaText}</td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            <div
                              className="size-6 rounded border border-slate-200"
                              style={{ backgroundColor: variant.ctaColor }}
                            />
                            <span className="text-xs text-slate-500">
                              {variant.ctaColor}
                            </span>
                          </div>
                        </td>
                        <td className="p-3 text-right text-slate-800">{variant.views}</td>
                        <td className="p-3 text-right text-slate-800">{variant.clicks}</td>
                        <td className="p-3 text-right font-semibold text-slate-800">
                          {variant.views > 0 ? `${variant.ctr.toFixed(1)}%` : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl custom-card-shadow bg-white/90 backdrop-blur border-0">
            <CardHeader>
              <CardTitle className="text-slate-800">Key Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {totalViews > 50 ? (
                  <>
                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                      <div className="flex items-start gap-3">
                        <Award className="size-5 text-green-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-green-900">
                            {winner.name} is performing best
                          </div>
                          <div className="text-sm text-green-700 mt-1">
                            With a {winner.ctr.toFixed(1)}% CTR, this variant is getting the most
                            engagement from visitors.
                          </div>
                        </div>
                      </div>
                    </div>

                    {winner.id !== test.variants[0].id && (
                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                        <div className="flex items-start gap-3">
                          <TrendingUp className="size-5 text-blue-600 mt-0.5" />
                          <div>
                            <div className="font-medium text-blue-900">
                              Significant improvement detected
                            </div>
                            <div className="text-sm text-blue-700 mt-1">
                              {winner.name} shows a{' '}
                              {calculateImprovement(winner)?.toFixed(1)}% improvement over the
                              control variant.
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <div className="flex items-start gap-3">
                      <RefreshCw className="size-5 text-yellow-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-yellow-900">
                          Keep gathering data
                        </div>
                        <div className="text-sm text-yellow-700 mt-1">
                          You need more views to draw meaningful conclusions. Try sharing the
                          visitor link to collect more data.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}