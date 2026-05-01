import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../hooks/useToast';

interface AdminHeaderProps {
  title?: string;
}

export default function AdminHeader({ title }: AdminHeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleLogout = () => {
    const name = user?.name || 'User';
    logout();
    toast.success('Signed out', { description: `See you soon, ${name}!` });
    navigate('/');
  };

  return (
    <header className="h-14 bg-white border-b border-neutral-200 flex items-center justify-between px-6">
      <p className="text-sm text-neutral-500">
        {title ?? 'Admin Panel'}
      </p>
      <div className="flex items-center gap-3">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
        >
          View Site ↗
        </a>
        <button
          onClick={handleLogout}
          className="text-sm text-error-600 hover:text-error-700 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
