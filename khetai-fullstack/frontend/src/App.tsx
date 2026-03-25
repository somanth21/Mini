import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from '@/contexts/language-context';
import { HistoryProvider } from '@/contexts/history-context';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider, useAuth } from '@/contexts/auth-context';
import AppShell from '@/components/app-shell';

// Pages
import Home from '@/pages/Home';
import CropDiagnosis from '@/pages/CropDiagnosis';
import MandiPrices from '@/pages/MandiPrices';
import GovSchemes from '@/pages/GovSchemes';
import Settings from '@/pages/Settings';
import Login from '@/pages/Login';
import Admin from '@/pages/Admin';
import History from '@/pages/History';
import Weather from '@/pages/Weather';
import Suggestions from '@/pages/Suggestions';
import Chat from '@/pages/Chat';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <Router>
      <LanguageProvider>
        <AuthProvider>
          <HistoryProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/*" element={
                <ProtectedRoute>
                  <AppShell>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/crop-diagnosis" element={<CropDiagnosis />} />
                      <Route path="/mandi-prices" element={<MandiPrices />} />
                      <Route path="/gov-schemes" element={<GovSchemes />} />
                      <Route path="/suggestions" element={<Suggestions />} />
                      <Route path="/weather" element={<Weather />} />
                      <Route path="/chat" element={<Chat />} />
                      <Route path="/history" element={<History />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/admin" element={<Admin />} />
                    </Routes>
                  </AppShell>
                </ProtectedRoute>
              } />
            </Routes>
            <Toaster />
          </HistoryProvider>
        </AuthProvider>
      </LanguageProvider>
    </Router>
  );
}
