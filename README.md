# ALX Polly: A Polling Application

Welcome to ALX Polly, a full-stack polling application built with Next.js, TypeScript, and Supabase. This project allows users to register, create polls, and share them via unique links and QR codes for others to vote on.

## Project Overview and Tech Stack

ALX Polly is a simple yet powerful application that demonstrates key features of modern web development:

-   **Authentication**: Secure user sign-up and login.
-   **Poll Management**: Users can create, view, edit, and delete their own polls.
-   **Voting System**: A straightforward system for casting and viewing votes.
-   **User Dashboard**: A personalized space for users to manage their polls.

The application is built with a modern tech stack:

-   **Framework**: [Next.js](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Backend & Database**: [Supabase](https://supabase.io/)
-   **UI**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn/ui](https://ui.shadcn.com/)
-   **State Management**: React Server Components and Client Components

## Getting Started

To get the application running on your local machine, follow these steps:

### 1. Prerequisites

-   [Node.js](https://nodejs.org/) (v20.x or higher recommended)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
-   A [Supabase](https://supabase.io/) account.

### 2. Supabase Configuration

1.  **Create a new Supabase project**: Go to your [Supabase dashboard](https://app.supabase.io/) and create a new project.
2.  **Get your API keys**: Navigate to `Project Settings > API` to find your `Project URL` and `anon public` key.
3.  **Set up your database schema**: You'll need to create a `polls` table and a `votes` table. Here's a basic schema:

    ```sql
    -- polls table
    create table polls (
      id uuid primary key default uuid_generate_v4(),
      user_id uuid references auth.users(id) on delete cascade,
      question text not null,
      options jsonb not null,
      created_at timestamp with time zone default now()
    );

    -- votes table
    create table votes (
      id uuid primary key default uuid_generate_v4(),
      poll_id uuid references polls(id) on delete cascade,
      user_id uuid references auth.users(id) on delete set null,
      option_index int not null,
      created_at timestamp with time zone default now()
    );
    ```

### 3. Environment Variables

Create a `.env.local` file in the root of your project and add the following:

```
NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Replace `YOUR_SUPABASE_PROJECT_URL` and `YOUR_SUPABASE_ANON_KEY` with your actual Supabase project URL and anon public key.

### 4. Installation

Clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd alx-polly
npm install
```

### 5. Running the Development Server

Start the application in development mode:

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Usage Examples

### Creating Polls

1.  Register or log in to your account.
2.  Navigate to the "Create Poll" page.
3.  Enter your poll question and at least two options.
4.  Click "Create Poll". Your new poll will appear on your dashboard.

### Voting on Polls

1.  Browse to a poll's unique URL.
2.  Select your preferred option.
3.  Click "Vote". Your vote will be recorded.

## How to Run and Test the App Locally

1.  **Start the development server**: Ensure your Supabase project is set up and your `.env.local` file is configured correctly. Then, run `npm run dev`.
2.  **Access the application**: Open your browser and go to `http://localhost:3000`.
3.  **Test authentication**: Register a new user and log in/out to ensure the authentication flow works as expected.
4.  **Test poll management**: Create, edit, and delete polls. Verify that only the poll owner can perform these actions.
5.  **Test voting**: Vote on polls and observe the vote counts updating. Try voting as a logged-in user and as an anonymous user (if anonymous voting is enabled).

This comprehensive documentation should help you understand, set up, and use the ALX Polly application. If you encounter any issues, please refer to the Supabase documentation or the Next.js documentation for further assistance.
