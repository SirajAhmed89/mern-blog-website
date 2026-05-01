import type { User } from '../types';

export function getDashboardPath(user: User | null): string {
  if (!user) return '/';
  
  if (user.role === 'superadmin' || user.role === 'admin') {
    return '/admin/dashboard';
  }
  
  return '/';
}
