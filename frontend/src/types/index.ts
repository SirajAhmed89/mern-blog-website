// User Types
export interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
  role: 'admin' | 'superadmin';
  permissions?: string[];
  isActive: boolean;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
}

// Post Types
export interface Post {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  author: User | { name: string; email: string; username: string; avatar?: string; bio?: string };
  category: Category;
  tags: Tag[];
  status: 'draft' | 'published' | 'archived';
  likes: string[];
  views: number;
  readTime?: number;
  commentsCount?: number;
  isFeaturedHero?: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Category Types
export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  postsCount?: number;
}

// Tag Types
export interface Tag {
  _id: string;
  name: string;
  slug: string;
  postsCount?: number;
}

// Comment Types
export interface Comment {
  _id: string;
  content: string;
  author?: User | null;
  guestName?: string;
  guestEmail?: string;
  post: Post | string;
  parent?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  pages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    data: T[];
    pagination: Pagination;
  };
  message?: string;
}

// Error Types
export interface ValidationError {
  field: string;
  message: string;
}

export interface ErrorResponse {
  success: false;
  message: string;
  errors?: ValidationError[];
}

// OTP Types
export interface OTPVerificationData {
  email: string;
  otp: string;
}

export interface OTPSendResponse {
  email: string;
  expiresIn: string;
}

// Admin Types
export interface AdminStats {
  totalPosts: number;
  totalUsers: number;
  totalComments: number;
  totalViews: number;
  publishedPosts: number;
  draftPosts: number;
  pendingComments: number;
  activeUsers: number;
}

export interface Permission {
  key: string;
  label: string;
  group: string;
}

export interface AvailablePermissions {
  [key: string]: string;
}

// Form Types
export interface PostFormData {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  featuredImage?: string;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  color?: string;
}

export interface TagFormData {
  name: string;
}

export interface AdminFormData {
  name: string;
  username: string;
  email: string;
  password?: string;
  permissions: string[];
}
