'use server';

import { createClient } from '@/lib/supabase/server';
import { LoginFormData, RegisterFormData } from '../types';

/**
 * Handles user login by authenticating with Supabase.
 * This is a Server Action that takes login credentials and attempts to sign in the user.
 *
 * @param data - An object containing the user's email and password.
 * @returns An object with an `error` property if authentication fails, otherwise `null` on success.
 */
export async function login(data: LoginFormData) {
  const supabase = await createClient();

  // Attempt to sign in the user with the provided email and password.
  const { error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  });

  if (error) {
    // Return the error message if authentication fails.
    return { error: error.message };
  }

  // Return null on success, indicating no error.
  return { error: null };
}

/**
 * Handles user registration by signing up a new user with Supabase.
 * This is a Server Action that takes registration details and creates a new user account.
 *
 * @param data - An object containing the user's name, email, and password.
 * @returns An object with an `error` property if registration fails, otherwise `null` on success.
 */
export async function register(data: RegisterFormData) {
  const supabase = await createClient();

  // Attempt to sign up the new user with the provided details.
  const { error } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      data: {
        name: data.name,
      },
    },
  });

  if (error) {
    // Return the error message if registration fails.
    return { error: error.message };
  }

  // Return null on success, indicating no error.
  return { error: null };
}

/**
 * Handles user logout by signing out the current user from Supabase.
 * This is a Server Action that terminates the user's session.
 *
 * @returns An object with an `error` property if logout fails, otherwise `null` on success.
 */
export async function logout() {
  const supabase = await createClient();
  // Attempt to sign out the current user.
  const { error } = await supabase.auth.signOut();
  if (error) {
    // Return the error message if logout fails.
    return { error: error.message };
  }
  // Return null on success.
  return { error: null };
}

/**
 * Retrieves the current authenticated user's information from Supabase.
 * This is a Server Action that fetches the user session.
 *
 * @returns The user object if authenticated, otherwise `null`.
 */
export async function getCurrentUser() {
  const supabase = await createClient();
  // Fetch the current user's session data.
  const { data } = await supabase.auth.getUser();
  return data.user;
}

/**
 * Retrieves the current Supabase session information.
 * This is a Server Action that fetches the raw session data.
 *
 * @returns The session object if a session exists, otherwise `null`.
 */
export async function getSession() {
  const supabase = await createClient();
  // Fetch the current Supabase session.
  const { data } = await supabase.auth.getSession();
  return data.session;
}
