# External Services Integration

This directory contains the unified external services integration system that provides context-based data management for all external platforms.

## Architecture Overview

### Context Provider
- **`ExternalServicesProvider.tsx`** - Unified context provider that manages all external services data
- Replaces individual service providers with a single, comprehensive solution
- Provides automatic data fetching, caching, and refresh capabilities
- Includes computed metrics, achievements, and insights for all services

### Supported Services
1. **LeetCode** - Coding problem solving progress
2. **Codeforces** - Competitive programming statistics  
3. **GitHub** - Development activity and repositories
4. **Reddit** - Community engagement and karma
5. **Email** - Productivity and inbox management

### Components

#### Individual Service Components
- `LeetCodeStats.tsx` - Comprehensive LeetCode dashboard
- `CodeforcesStats.tsx` - Codeforces competitive programming stats
- `GitHubStats.tsx` - GitHub development activity
- `RedditStats.tsx` - Reddit community engagement
- `EmailStats.tsx` - Email productivity dashboard

#### Unified Components
- `UnifiedExternalServicesDashboard.tsx` - Main dashboard with tabs for all services
- `ExternalServicesWidget.tsx` - Compact widgets for different layouts

### Usage

#### Using the Unified Context
```tsx
import { useExternalServices } from '@/context/ExternalServicesProvider';

const MyComponent = () => {
  const {
    leetcode,
    codeforces,
    github,
    reddit,
    email,
    dailyDigest,
    unifiedAchievements,
    refreshData
  } = useExternalServices();
  
  // Component logic
};
```

#### Using Individual Service Hooks (Backward Compatibility)
```tsx
import { useLeetCode, useGitHub } from '@/hooks/useExternalServiceHooks';

const MyComponent = () => {
  const { data, achievements, insights } = useLeetCode();
  const { data: githubData, topLanguages } = useGitHub();
  
  // Component logic
};
```

### Features

#### Automatic Data Management
- Fetches data when user logs in
- Caches data to avoid multiple API calls
- Provides refresh functionality
- Handles loading and error states

#### Rich Metrics & Insights
- Progress tracking and percentages
- Achievement system with gamification
- Personalized insights and recommendations
- Next goals and actionable items

#### Creative UI Components
- Multiple variants: full, compact, minimal
- Gradient backgrounds and modern design
- Achievement badges and progress indicators
- Responsive layouts for all screen sizes

#### Unified Dashboard
- Overview of all connected services
- Daily digest with highlights and action items
- Cross-platform achievements
- Tabbed interface for detailed views

### Integration Points

#### Root Layout
The `ExternalServicesProvider` is integrated at the root level in `app/layout.tsx`:

```tsx
<ExternalServicesProvider>
  <ToastProvider>
    {children}
  </ToastProvider>
</ExternalServicesProvider>
```

#### Dashboard Integration
- Main dashboard shows overview with `variant="overview"`
- Dedicated page at `/dashboard/external-services` shows full dashboard
- Individual service widgets can be used throughout the app

#### Settings Integration
- Connected to existing external services settings
- Automatic detection of configured services
- Prompts users to connect services when none are available

### API Integration

#### Endpoints Used
- `/api/external-services` - Fetches all user's external service data
- Individual service APIs are consumed through the aggregator service

#### Data Flow
1. User logs in → Context provider fetches data
2. Data is cached in React state with useMemo/useCallback optimization
3. Components consume data through context hooks
4. Refresh button triggers new API calls
5. Real-time updates through the context system

### Benefits

1. **Performance** - Single API call instead of multiple requests
2. **Consistency** - Unified data structure and loading states
3. **Maintainability** - Single source of truth for external services
4. **User Experience** - Rich, creative UI with comprehensive insights
5. **Scalability** - Easy to add new external services
6. **Context-Aware** - Global access to data throughout the application