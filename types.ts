
export type UserRole = 'ADMIN' | 'INSTITUTION' | 'USER';
export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type Language = 'FR' | 'KH';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: ApprovalStatus;
  avatar?: string;
  verificationDoc?: string;
  createdAt: string;
}

export interface Job {
  id: string;
  institutionId: string;
  institutionName: string;
  title: string;
  description: string;
  category: Category;
  requiredDocuments: string[];
  deadline: string;
  salary?: string;
  location: string;
  createdAt: string;
}

export interface Product {
  id: string;
  institutionId: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  imageUrl: string;
  createdAt: string;
}

export interface Application {
  id: string;
  jobId: string;
  userId: string;
  userName: string;
  status: 'PENDING' | 'INTERVIEWING' | 'ACCEPTED' | 'REJECTED';
  submissionDate: string;
  feedback?: string;
  rating?: number;
}

export type Category = 
  | 'Education' 
  | 'Business' 
  | 'Health' 
  | 'Technology' 
  | 'Agriculture' 
  | 'Government' 
  | 'NGOs';

export interface Review {
  id: string;
  targetUserId: string;
  authorId: string;
  authorName: string;
  rating: number;
  comment: string;
  createdAt: string;
}
