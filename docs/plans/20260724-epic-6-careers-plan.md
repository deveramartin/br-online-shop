# Epic 6: Careers / Application Page Plan

## Objective
Implement a job application system for the e-commerce website where users can view open positions and submit their applications with a resume upload.

## Backend Implementation (`apps/api-oos`)
1. **Entities & DTOs**:
   - `JobPosting`: ID, Title, Description, Location, Type (Full-time, Part-time), IsActive, CreatedAt.
   - `JobApplication`: ID, JobPostingId, FirstName, LastName, Email, Phone, CoverLetter, ResumeUrl, SubmittedAt.
   - DTOs for fetching job postings and submitting applications.
2. **Database Context**:
   - Add `DbSet<JobPosting>` and `DbSet<JobApplication>` to `AppDbContext`.
   - Add migration `AddCareersEntities`.
3. **Services**:
   - `IStorageService` (or similar): Handle resume file uploads (validate `.pdf`, `.docx`, limit size to 5MB).
   - `IEmailService`: Send a notification email to HR upon new application submission (can be a mock/logger implementation initially).
4. **Controllers**:
   - `JobPostingsController`: `GET /api/jobs` to fetch active job postings.
   - `ApplicationsController`: `POST /api/applications` to submit an application (handles `multipart/form-data`).

## Frontend Implementation (`apps/web-shop`)
1. **Careers Page (`/careers`)**:
   - Create a new route `app/careers/page.tsx`.
   - Fetch active job postings from `GET /api/jobs`.
   - Display jobs in a visually appealing list or grid using `shadcn/ui` components (Card, Badge).
2. **Application Form Component**:
   - Create a dialog or a dedicated route (`/careers/[id]/apply`) for the application form.
   - Form fields: Name, Email, Phone, Cover Letter (Textarea), and Resume (File Input).
   - Client-side validation using `zod` and `react-hook-form`.
   - Upload progress indication and submission success/error toasts using `sonner`.
3. **Integration**:
   - Use `axios` (or fetch) to submit the form data to `POST /api/applications`.
   - Handle loading states and success confirmation.

## Open Questions for Review
1. **Job Postings Data**: Should the job postings be dynamic (fetched from the database and manageable) or can they just be static data in the frontend for MVP?
2. **File Storage**: For the resume uploads, should we store them locally on the server (similar to ticket attachments) or do we want to integrate with a cloud provider (Azure Blob/AWS S3) right away?
3. **Notifications**: Do you want to use a real SMTP service (like Brevo) for HR notifications, or a mock service that logs to the console for now?

## Next Steps
Once you approve this plan and answer the open questions, I will proceed with the implementation.
