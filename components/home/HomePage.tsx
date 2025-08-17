import {
  homePageAssignmentFilterAndStarredImgs,
  homePageCalendarImgs,
  homePageMindMapsImgs,
  homePagePomodoroImgs,
  homePageRolesAndSettingsImgs,
  homePageTasksImgs,
} from "@/lib/constants";
import { CreativeHeader } from "./header/CreativeHeader";
import { Nav } from "./nav/Nav";
import { ModernSection } from "./section/ModernSection";
import { ModernTextSection } from "./section/ModernTextSection";
import { Footer } from "./footer/Footer";

export const HomePage = () => {
  return (
    <>
      <Nav />
      <CreativeHeader />
      {/* Only render the hero section below. All other landing page sections are commented out. */}
      {/*
      <div className="w-full mx-auto max-w-screen-xl px-4 sm:px-6">
        <main>
          <ModernTextSection ... />
          <ModernSection ... />
          ...
        </main>
      </div>
      <Footer />
      */}
    </>
  );
};
