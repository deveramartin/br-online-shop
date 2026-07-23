export interface JobPosting {
  id: string;
  title: string;
  description: string;
  requirements: string;
  location: string;
  department: string;
  type: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface JobApplicationResponse {
  id: string;
  jobPostingId: string;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  coverLetter: string;
  resumeUrl: string;
  submittedAt: string;
}
