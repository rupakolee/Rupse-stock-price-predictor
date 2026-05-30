import { BrowserRouter } from "react-router-dom";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import AuthProvider from "./context/AuthProvider";
import PermissionProvider from "./context/PermissionContext";
import { AppProvider } from "./context/appContext";
import { QueryProvider } from "./providers/QueryProvider";

function App() {
  return (
    <BrowserRouter>
      <div
        data-theme="aurora"
        className="min-h-screen bg-background font-sans text-foreground"
      >
        <QueryProvider>
          <AuthProvider>
            <PermissionProvider>
              <AppProvider>
                <AppRoutes />
              </AppProvider>
            </PermissionProvider>
          </AuthProvider>
        </QueryProvider>
      </div>
    </BrowserRouter>
  );
}

export default App;
