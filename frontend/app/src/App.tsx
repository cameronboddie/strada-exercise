import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard.tsx';
import Login from './pages/Login.tsx';
import Collections from './pages/Collections.tsx';
import CollectionDetail from './pages/CollectionDetail.tsx';
import Invoices from './pages/Invoices.tsx';
import Layout from './components/Layout.tsx';
import { AuthProvider } from './ context/AuthContext.tsx';
import Archive from './pages/Archive.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import { ViewProvider } from './ context/ViewContext.tsx';
import Forbidden from './pages/Forbidden.tsx';

function App() {
  return (
    <AuthProvider>
      <ViewProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/forbidden" element={<Forbidden />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/collections/:id" element={<CollectionDetail />} />
                <Route element={<ProtectedRoute permissions={['View Invoice']} />}>
                  <Route path="/invoices" element={<Invoices />} />
                </Route>
                <Route path="/archive" element={<Archive />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </ViewProvider>
    </AuthProvider>
  );
}

export default App;
