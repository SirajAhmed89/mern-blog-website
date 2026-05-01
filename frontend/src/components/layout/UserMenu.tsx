import { useNavigate } from 'react-router-dom';
import { 
  UserCircleIcon, 
  Cog6ToothIcon, 
  ArrowRightOnRectangleIcon,
  PencilSquareIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import Dropdown, { DropdownItem, DropdownDivider } from '../ui/Dropdown';
import Avatar from '../ui/Avatar';
import { useToast } from '../../hooks/useToast';
import { getImageUrl } from '../../utils/imageUrl';

export default function UserMenu() {
  const { user, logout, hasPermission } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  if (!user) return null;

  const handleLogout = () => {
    const userName = user.name;
    logout();
    toast.success('Signed out successfully', {
      description: `See you soon, ${userName}!`,
    });
    navigate('/');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Dropdown
      align="right"
      trigger={
        <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Avatar
            src={getImageUrl(user.avatar)}
            alt={user.name}
            size="sm"
            fallback={user.name.charAt(0).toUpperCase()}
          />
          <span className="hidden md:block text-sm font-medium text-neutral-700">
            {user.name}
          </span>
        </button>
      }
    >
      {/* User Info */}
      <div className="px-4 py-3 border-b border-neutral-200">
        <p className="text-sm font-medium text-neutral-900">{user.name}</p>
        <p className="text-xs text-neutral-500 mt-0.5">@{user.username}</p>
        <p className="text-xs text-primary-500 mt-1 capitalize">{user.role}</p>
      </div>

      {/* Menu Items */}
      <div className="py-1">
        {/* My Profile - Available to all authenticated users */}
        <DropdownItem
          icon={<UserCircleIcon className="w-5 h-5" />}
          onClick={() => handleNavigation('/admin/profile')}
        >
          My Profile
        </DropdownItem>

        {/* Dashboard - Available to admins and superadmins */}
        {(user.role === 'admin' || user.role === 'superadmin') && (
          <DropdownItem
            icon={<ChartBarIcon className="w-5 h-5" />}
            onClick={() => handleNavigation('/admin/dashboard')}
          >
            Dashboard
          </DropdownItem>
        )}

        {/* Write Article - Available to users with posts.create permission */}
        {hasPermission('posts.create') && (
          <DropdownItem
            icon={<PencilSquareIcon className="w-5 h-5" />}
            onClick={() => handleNavigation('/admin/posts/new')}
          >
            Write Article
          </DropdownItem>
        )}

        {/* Site Settings - Available to users with dashboard.settings permission */}
        {hasPermission('dashboard.settings') && (
          <DropdownItem
            icon={<Cog6ToothIcon className="w-5 h-5" />}
            onClick={() => handleNavigation('/admin/settings')}
          >
            Site Settings
          </DropdownItem>
        )}
      </div>

      <DropdownDivider />

      {/* Logout */}
      <div className="py-1">
        <DropdownItem
          icon={<ArrowRightOnRectangleIcon className="w-5 h-5" />}
          onClick={handleLogout}
          variant="danger"
        >
          Sign Out
        </DropdownItem>
      </div>
    </Dropdown>
  );
}
