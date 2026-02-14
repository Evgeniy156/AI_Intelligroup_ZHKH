import { useState } from "react";
import { Dashboard } from "./components/Dashboard";
import { RequestResponseModule } from "./components/RequestResponseModule";
import { LegalConsultantModule } from "./components/LegalConsultantModule";
import { SupervisionResponseModule } from "./components/SupervisionResponseModule";
import { AdminPanel } from "./components/AdminPanel";
import { ArchitectureView } from "./components/ArchitectureView";
import { ApiSettingsPanel } from "./components/ApiSettingsPanel";
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";

type ViewType = "dashboard" | "requests" | "legal" | "supervision" | "admin" | "architecture" | "api";

export function App() {
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleNavigate = (view: string) => {
    setCurrentView(view as ViewType);
  };

  const renderContent = () => {
    switch (currentView) {
      case "dashboard":
        return <Dashboard onNavigate={handleNavigate} />;
      case "requests":
        return <RequestResponseModule />;
      case "legal":
        return <LegalConsultantModule />;
      case "supervision":
        return <SupervisionResponseModule />;
      case "admin":
        return <AdminPanel />;
      // case "architecture":
      //   return <ArchitectureView />;
      case "api":
        return <ApiSettingsPanel />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        currentView={currentView}
      />
      <div className="flex">
        <Sidebar
          currentView={currentView}
          onNavigate={handleNavigate}
          isOpen={isSidebarOpen}
        />
        <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
          <div className="p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
