import Welcoming from "@/components/common/Welcoming";
import { DashboardHeader } from "@/components/header/DashboardHeader";
import { HomeRecentActivityContainer } from "@/components/homeRecentActivity/HomeRecentActivityContainer";
import { DSAProgressDashboard } from "@/components/dashboard/DSAProgressDashboard";
import { ImportedDSAProgressDashboard } from "@/components/dashboard/ImportedDSAProgressDashboard";
import GamingStatsWidget from "@/components/dashboard/GamingStatsWidget";
import { TabbedExternalServicesDashboard } from "@/components/dashboard/TabbedExternalServicesDashboard";
import { getInitialHomeRecentActivity } from "@/lib/api";
import { checkIfUserCompletedOnboarding } from "@/lib/checkIfUserCompletedOnboarding";
import { db } from "@/lib/db";

const Dashboard = async () => {
  const session = await checkIfUserCompletedOnboarding("/dashboard");

  const initialRecentActivity = await getInitialHomeRecentActivity(session.user.id);

  return (
    <>
      <DashboardHeader />
      <main className="min-h-screen bg-background">
        <div className="w-full">
          <Welcoming
            hideOnDesktop
            className="px-3 py-4 sm:px-4 md:px-6 lg:px-8"
            username={session.user.username!}
            name={session.user.name}
            surname={session.user.surname}
          />
          
          {/* Main Dashboard Content */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8 px-3 sm:px-4 md:px-6 lg:px-8 pb-6 sm:pb-8">
            {/* External Services Section */}
            <section className="space-y-2">
              <TabbedExternalServicesDashboard />
            </section>
            
            {/* DSA Progress Section - Curated Questions */}
            <section className="space-y-2">
              <DSAProgressDashboard />
            </section>
            
            {/* Imported DSA Progress Section - Love Babbar & Others */}
            <section className="space-y-2">
              <ImportedDSAProgressDashboard />
            </section>
            
            {/* Achievements Section */}
            <section className="space-y-2">
              <GamingStatsWidget />
            </section>
            
            {/* Recent Activity Section */}
            <section>
              <HomeRecentActivityContainer
                userId={session.user.id}
                initialData={initialRecentActivity ? initialRecentActivity : []}
              />
            </section>
          </div>
        </div>
      </main>
    </>
  );
};

export default Dashboard;
