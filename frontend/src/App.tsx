import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import BlogFeed from './pages/BlogFeed';
import PostDetail from './pages/PostDetail';
import CategoryPage from './pages/CategoryPage';
import TagPage from './pages/TagPage';
import AuthorPage from './pages/AuthorPage';
import SearchResultsPage from './pages/SearchResultsPage';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyEmail from './pages/VerifyEmail';
import { ProtectedRoute, GuestRoute } from './components/auth';
import Toaster from './components/ui/Toaster';

// Admin pages
import Dashboard from './pages/admin/Dashboard';
import Profile from './pages/admin/Profile';
import Posts from './pages/admin/Posts';
import PostForm from './pages/admin/PostForm';
import Categories from './pages/admin/Categories';
import Users from './pages/admin/Users';
import Comments from './pages/admin/Comments';
import Newsletter from './pages/admin/Newsletter';
import Analytics from './pages/admin/Analytics';
import Settings from './pages/admin/Settings';
import CodeInjection from './pages/admin/CodeInjection';

/** Requires admin or superadmin role */
function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRoles={['admin', 'superadmin']}>
      {children}
    </ProtectedRoute>
  );
}

/** Requires admin/superadmin role + at least one of the given permissions */
function PermissionRoute({
  children,
  permissions,
}: {
  children: React.ReactNode;
  permissions: string | string[];
}) {
  return (
    <ProtectedRoute
      requiredRoles={['admin', 'superadmin']}
      requiredPermission={permissions}
    >
      {children}
    </ProtectedRoute>
  );
}

function App() {
  return (
    <Router>
      <Toaster />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/blog" element={<Layout><BlogFeed /></Layout>} />
        <Route path="/post/:id" element={<Layout><PostDetail /></Layout>} />
        <Route path="/category/:slug" element={<Layout><CategoryPage /></Layout>} />
        <Route path="/tag/:slug" element={<Layout><TagPage /></Layout>} />
        <Route path="/author/:username" element={<Layout><AuthorPage /></Layout>} />
        <Route path="/search" element={<Layout><SearchResultsPage /></Layout>} />

        {/* Guest Only Routes */}
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />
        <Route path="/verify-email" element={<GuestRoute><VerifyEmail /></GuestRoute>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Dashboard — accessible to all admins */}
        <Route path="/admin/dashboard" element={<AdminRoute><Dashboard /></AdminRoute>} />

        {/* Profile — accessible to all admins */}
        <Route path="/admin/profile" element={<AdminRoute><Profile /></AdminRoute>} />

        {/* Posts — requires any posts permission */}
        <Route
          path="/admin/posts"
          element={
            <PermissionRoute permissions={['posts.view', 'posts.create', 'posts.edit', 'posts.delete', 'posts.publish']}>
              <Posts />
            </PermissionRoute>
          }
        />
        <Route
          path="/admin/posts/new"
          element={
            <PermissionRoute permissions={['posts.create']}>
              <PostForm />
            </PermissionRoute>
          }
        />
        <Route
          path="/admin/posts/:id/edit"
          element={
            <PermissionRoute permissions={['posts.edit']}>
              <PostForm />
            </PermissionRoute>
          }
        />

        {/* Categories */}
        <Route
          path="/admin/categories"
          element={
            <PermissionRoute permissions={['categories.view', 'categories.create', 'categories.edit', 'categories.delete']}>
              <Categories />
            </PermissionRoute>
          }
        />

        {/* Users */}
        <Route
          path="/admin/users"
          element={
            <PermissionRoute permissions={['users.view', 'users.create', 'users.edit', 'users.delete', 'users.ban']}>
              <Users />
            </PermissionRoute>
          }
        />

        {/* Comments */}
        <Route
          path="/admin/comments"
          element={
            <PermissionRoute permissions={['comments.view', 'comments.moderate', 'comments.delete']}>
              <Comments />
            </PermissionRoute>
          }
        />

        {/* Newsletter — accessible to all admins */}
        <Route
          path="/admin/newsletter"
          element={
            <AdminRoute>
              <Newsletter />
            </AdminRoute>
          }
        />

        {/* Analytics */}
        <Route
          path="/admin/analytics"
          element={
            <PermissionRoute permissions={['dashboard.analytics', 'dashboard.reports']}>
              <Analytics />
            </PermissionRoute>
          }
        />

        {/* Settings — requires dashboard.settings permission */}
        <Route
          path="/admin/settings"
          element={
            <AdminRoute>
              <Settings />
            </AdminRoute>
          }
        />

        {/* Code Injection — requires dashboard.settings permission */}
        <Route
          path="/admin/code-injection"
          element={
            <PermissionRoute permissions={['dashboard.settings']}>
              <CodeInjection />
            </PermissionRoute>
          }
        />

        {/* Admins — redirect to users page */}
        <Route path="/admin/admins" element={<Navigate to="/admin/users" replace />} />

        {/* 404 - Catch all unmatched routes */}
        <Route path="*" element={<Layout><NotFound /></Layout>} />
      </Routes>
    </Router>
  );
}

export default App;
