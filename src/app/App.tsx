import { useState, useCallback } from "react";
import { Plus, FlaskConical } from "lucide-react";
import { Button } from "./components/ui/button";
import { CreatePageTestDialog } from "./components/CreatePageTestDialog";
import { TestDashboard } from "./components/TestDashboard";
import { TestAnalytics } from "./components/TestAnalytics";
import { VisitorView } from "./components/VisitorView";
import { LandingPageTest, LandingPageVariant, InteractionData } from "./types";

export default function App() {
  const [tests, setTests] = useState<LandingPageTest[]>([]);
  const [selectedTestId, setSelectedTestId] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [visitorViewTestId, setVisitorViewTestId] = useState<string | null>(
    null,
  );

  const selectedTest = tests.find((t) => t.id === selectedTestId);
  const visitorViewTest = tests.find((t) => t.id === visitorViewTestId);

  // Image URLs from Unsplash
  const defaultImages = {
    "business technology":
      "https://images.unsplash.com/photo-1573164713988-8665fc963095?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzc1MjUzODQxfDA&ixlib=rb-4.1.0&q=80&w=1080",
    "success growth":
      "https://images.unsplash.com/photo-1629124096116-48743a0cea58?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdWNjZXNzJTIwZ3Jvd3RofGVufDF8fHx8MTc3NTI1Mzg0MXww&ixlib=rb-4.1.0&q=80&w=1080",
    "modern design":
      "https://images.unsplash.com/photo-1518733057094-95b53143d2a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBkZXNpZ258ZW58MXx8fHwxNzc1MjUzODQxfDA&ixlib=rb-4.1.0&q=80&w=1080",
  };

  const getImageUrl = (query: string): string => {
    // Return default image based on query, or fallback
    return (
      defaultImages[query as keyof typeof defaultImages] ||
      "https://images.unsplash.com/photo-1573164713988-8665fc963095?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
    );
  };

  const handleCreateTest = (data: {
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
  }) => {
    const newTest: LandingPageTest = {
      id: Date.now().toString(),
      name: data.name,
      status: "draft",
      createdAt: new Date(),
      variants: data.variants.map((v, index) => ({
        id: `${Date.now()}-${index}`,
        name: v.name,
        headline: v.headline,
        subheadline: v.subheadline,
        ctaText: v.ctaText,
        ctaColor: v.ctaColor,
        imageUrl: getImageUrl(v.imageQuery),
        backgroundColor: v.backgroundColor,
        views: 0,
        clicks: 0,
        ctr: 0,
      })),
      interactions: [],
    };

    setTests([newTest, ...tests]);
    setCreateDialogOpen(false);
  };

  const handleToggleStatus = (testId: string) => {
    setTests(
      tests.map((test) => {
        if (test.id !== testId) return test;
        if (test.status === "completed") return test;

        return {
          ...test,
          status:
            test.status === "live" ? ("draft" as const) : ("live" as const),
        };
      }),
    );
  };

  const handleDeleteTest = (testId: string) => {
    setTests(tests.filter((t) => t.id !== testId));
    if (selectedTestId === testId) {
      setSelectedTestId(null);
    }
  };

  const handleRecordInteraction = useCallback(
    (testId: string, variantId: string, type: "view" | "click") => {
      setTests((prevTests) =>
        prevTests.map((test) => {
          if (test.id !== testId) return test;

          const interaction: InteractionData = {
            variantId,
            timestamp: new Date(),
            type,
          };

          const updatedVariants = test.variants.map((variant) => {
            if (variant.id !== variantId) return variant;

            const newViews =
              type === "view" ? variant.views + 1 : variant.views;
            const newClicks =
              type === "click" ? variant.clicks + 1 : variant.clicks;
            const newCtr = newViews > 0 ? (newClicks / newViews) * 100 : 0;

            return {
              ...variant,
              views: newViews,
              clicks: newClicks,
              ctr: newCtr,
            };
          });

          return {
            ...test,
            variants: updatedVariants,
            interactions: [...test.interactions, interaction],
          };
        }),
      );
    },
    [],
  );

  return (
    <div className="min-h-screen">
      {/* Visitor View Overlay */}
      {visitorViewTest && (
        <VisitorView
          test={visitorViewTest}
          onClose={() => setVisitorViewTestId(null)}
          onRecordInteraction={(variantId, type) =>
            handleRecordInteraction(visitorViewTest.id, variantId, type)
          }
        />
      )}

      {/* Header */}
      <header
        className="border-b border-white/30 sticky top-0 backdrop-blur-xl z-40"
        style={{ background: "rgba(255, 255, 255, 0.7)" }}
      >
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg">
                <FlaskConical className="size-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl text-slate-800">
                  Landing Page A/B Tester
                </h1>
                <p className="text-sm text-teal-600">
                  Create, test, and optimize your landing pages
                </p>
              </div>
            </div>
            {!selectedTest && (
              <Button
                onClick={() => setCreateDialogOpen(true)}
                className="shadow-lg bg-teal-500 hover:bg-teal-600 text-white"
              >
                <Plus className="size-4 mr-2" />
                New A/B Test
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {selectedTest ? (
          <TestAnalytics
            test={selectedTest}
            onBack={() => setSelectedTestId(null)}
            onToggleStatus={() => handleToggleStatus(selectedTest.id)}
            onViewAsVisitor={() => setVisitorViewTestId(selectedTest.id)}
            onRecordInteraction={(variantId, type) =>
              handleRecordInteraction(selectedTest.id, variantId, type)
            }
          />
        ) : (
          <>
            {tests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="size-24 rounded-3xl bg-gradient-to-br from-teal-500 to-purple-500 flex items-center justify-center mb-6 shadow-2xl">
                  <FlaskConical className="size-12 text-white" />
                </div>
                <h2 className="text-3xl mb-3 text-slate-800">
                  Welcome to Landing Page A/B Testing
                </h2>
                <p className="text-slate-600 text-center max-w-2xl mb-8">
                  Create beautiful landing page variants with different
                  headlines, CTAs, and designs. Test them with real visitors and
                  see which one converts best. Get started by creating your
                  first test!
                </p>
                <Button
                  size="lg"
                  onClick={() => setCreateDialogOpen(true)}
                  className="shadow-lg bg-teal-500 hover:bg-teal-600 text-white"
                >
                  <Plus className="size-5 mr-2" />
                  Create Your First Test
                </Button>

                {/* Feature Cards */}
                <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-4xl">
                  <div className="p-6 rounded-2xl custom-card-shadow bg-white/90 backdrop-blur">
                    <div className="size-12 rounded-xl bg-teal-100 flex items-center justify-center mb-4">
                      <svg
                        className="size-6 text-teal-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                        />
                      </svg>
                    </div>
                    <h3 className="font-semibold mb-2 text-slate-800">
                      Visual Editor
                    </h3>
                    <p className="text-sm text-slate-600">
                      Create variants with custom headlines, CTAs, colors, and
                      images
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl custom-card-shadow bg-white/90 backdrop-blur">
                    <div className="size-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
                      <svg
                        className="size-6 text-purple-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </div>
                    <h3 className="font-semibold mb-2 text-slate-800">
                      Real Analytics
                    </h3>
                    <p className="text-sm text-slate-600">
                      Track views, clicks, and CTR for each variant in real-time
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl custom-card-shadow bg-white/90 backdrop-blur">
                    <div className="size-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                      <svg
                        className="size-6 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </div>
                    <h3 className="font-semibold mb-2 text-slate-800">
                      Visitor Preview
                    </h3>
                    <p className="text-sm text-slate-600">
                      See exactly what visitors see and test interactions
                      yourself
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <TestDashboard
                tests={tests}
                onSelectTest={setSelectedTestId}
                onToggleStatus={handleToggleStatus}
                onDeleteTest={handleDeleteTest}
              />
            )}
          </>
        )}
      </main>

      {/* Create Test Dialog */}
      <CreatePageTestDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        onCreateTest={handleCreateTest}
      />
    </div>
  );
}
