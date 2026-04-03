import { Eye, MousePointerClick, TrendingUp, Play, Pause, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { LandingPageTest } from '../types';

interface TestDashboardProps {
  tests: LandingPageTest[];
  onSelectTest: (testId: string) => void;
  onToggleStatus: (testId: string) => void;
  onDeleteTest: (testId: string) => void;
}

export function TestDashboard({ tests, onSelectTest, onToggleStatus, onDeleteTest }: TestDashboardProps) {
  if (tests.length === 0) {
    return (
      <Card className="col-span-full rounded-2xl custom-card-shadow bg-white/90 backdrop-blur border-0">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <BarChart3 className="size-16 text-teal-400 mb-4" />
          <p className="text-xl mb-2 text-slate-800">No landing page tests yet</p>
          <p className="text-sm text-slate-600">
            Create your first A/B test to compare different landing page designs
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {tests.map((test) => {
        const totalViews = test.variants.reduce((sum, v) => sum + v.views, 0);
        const totalClicks = test.variants.reduce((sum, v) => sum + v.clicks, 0);
        const overallCtr = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;
        
        const winner = test.variants.reduce((prev, current) =>
          current.ctr > prev.ctr ? current : prev
        );

        return (
          <Card key={test.id} className="hover:shadow-2xl transition-all duration-300 rounded-2xl custom-card-shadow bg-white/90 backdrop-blur border-0">
            <CardHeader>
              <div className="flex items-start justify-between mb-2">
                <CardTitle className="text-lg text-slate-800">{test.name}</CardTitle>
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
              <CardDescription className="text-slate-600">
                {test.variants.length} variants • Created {test.createdAt.toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Overall Stats */}
              <div className="grid grid-cols-3 gap-2 text-center p-3 bg-gradient-to-br from-teal-50 to-purple-50 rounded-xl">
                <div>
                  <div className="flex items-center justify-center gap-1 text-teal-600 mb-1">
                    <Eye className="size-3" />
                    <span className="text-xs">Views</span>
                  </div>
                  <div className="font-semibold text-slate-800">{totalViews}</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-purple-600 mb-1">
                    <MousePointerClick className="size-3" />
                    <span className="text-xs">Clicks</span>
                  </div>
                  <div className="font-semibold text-slate-800">{totalClicks}</div>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 text-pink-600 mb-1">
                    <TrendingUp className="size-3" />
                    <span className="text-xs">CTR</span>
                  </div>
                  <div className="font-semibold text-slate-800">{overallCtr.toFixed(1)}%</div>
                </div>
              </div>

              {/* Variant Performance */}
              <div className="space-y-2">
                {test.variants.map((variant) => (
                  <div
                    key={variant.id}
                    className={`flex items-center justify-between p-2 rounded-lg border ${
                      variant.id === winner.id && totalViews > 0
                        ? 'border-teal-300 bg-teal-50'
                        : 'border-slate-200 bg-white/50'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="font-medium text-sm text-slate-800">{variant.name}</div>
                      <div className="text-xs text-slate-500">
                        {variant.views} views • {variant.clicks} clicks
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-slate-800">
                        {variant.views > 0 ? `${variant.ctr.toFixed(1)}%` : '—'}
                      </div>
                      {variant.id === winner.id && totalViews > 0 && (
                        <Badge variant="outline" className="text-xs bg-teal-500 text-white border-teal-600">
                          Leader
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-teal-200 text-teal-600 hover:bg-teal-50"
                  onClick={() => onSelectTest(test.id)}
                >
                  <BarChart3 className="size-4 mr-2" />
                  View Details
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onToggleStatus(test.id)}
                  disabled={test.status === 'completed'}
                  className="border-slate-200 hover:bg-slate-50"
                >
                  {test.status === 'live' ? (
                    <Pause className="size-4" />
                  ) : (
                    <Play className="size-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}