"use client";

import { LeetCodeStats } from "@/components/dashboard/LeetCodeStats";
import { LeetCodeWidget } from "@/components/dashboard/LeetCodeWidget";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Example component showing how to use LeetCode integration components
 * This demonstrates the different variants and usage patterns
 */
export const LeetCodeIntegrationExample = () => {
  return (
    <div className="space-y-8 p-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">LeetCode Integration Examples</h1>
        <p className="text-muted-foreground">
          Different ways to display LeetCode statistics throughout your application
        </p>
      </div>

      {/* Full Dashboard Component */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Full Dashboard View</h2>
        <p className="text-muted-foreground">
          Use this in the main dashboard or dedicated LeetCode page for comprehensive stats display.
        </p>
        <LeetCodeStats />
      </div>

      {/* Widget Variants */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Widget Variants</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Compact Variant */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Compact Widget</CardTitle>
              <CardDescription>
                Perfect for dashboard summaries or overview sections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LeetCodeWidget variant="compact" />
            </CardContent>
          </Card>

          {/* Card Variant */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Card Widget</CardTitle>
              <CardDescription>
                Detailed widget for sidebars or dedicated sections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LeetCodeWidget variant="card" />
            </CardContent>
          </Card>

          {/* Mini Variant */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Mini Widget</CardTitle>
              <CardDescription>
                Minimal display for headers, navigation bars, or inline usage
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center py-8">
              <LeetCodeWidget variant="mini" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Usage Examples */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Usage Examples</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* In Header */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">In Navigation Header</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">TaskFlow</span>
                  <LeetCodeWidget variant="mini" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* In Sidebar */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">In Sidebar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg w-64">
                <div className="space-y-4">
                  <div className="font-semibold">Quick Stats</div>
                  <LeetCodeWidget variant="card" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dashboard Grid */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dashboard Grid Item</CardTitle>
            </CardHeader>
            <CardContent>
              <LeetCodeWidget variant="compact" />
            </CardContent>
          </Card>

          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile Section</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Coding Progress</span>
                  <LeetCodeWidget variant="mini" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Implementation Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">🔄 Automatic Data Management</h4>
            <p className="text-sm text-muted-foreground">
              All components automatically fetch and display the logged-in user's LeetCode data. 
              No need to pass props or manage state manually.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">🎯 Context-Based</h4>
            <p className="text-sm text-muted-foreground">
              Uses React Context to avoid multiple API calls. Data is fetched once when the user logs in 
              and shared across all components.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">🎨 Responsive & Themed</h4>
            <p className="text-sm text-muted-foreground">
              All components support dark/light themes and are responsive across different screen sizes.
            </p>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">⚡ Performance Optimized</h4>
            <p className="text-sm text-muted-foreground">
              Uses React.useMemo and useCallback to prevent unnecessary re-renders and optimize performance.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};