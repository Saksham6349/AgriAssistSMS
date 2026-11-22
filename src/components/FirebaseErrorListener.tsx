"use client";

import { useEffect } from 'react';
import { errorEmitter }from '@/lib/error-emitter';
import { FirestorePermissionError } from '@/lib/errors';
import { useToast } from '@/hooks/use-toast';

/**
 * A client-side component that listens for Firestore permission errors
 * and displays a detailed toast notification to aid in debugging security rules.
 * In a production environment, this could be logged to a monitoring service.
 */
export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (error: FirestorePermissionError) => {
      console.error("Firestore Permission Error caught by listener:", error.message);

      // In a development environment, we can throw the error to leverage
      // Next.js's error overlay for a better debugging experience.
      if (process.env.NODE_ENV === 'development') {
        // We throw the error in a timeout to break out of the current call stack
        // and ensure Next.js catches it as an unhandled runtime error.
        setTimeout(() => {
          throw error;
        }, 0);
      } else {
        // In production, you might want to show a generic toast and log the detailed error
        toast({
          variant: "destructive",
          title: "Permission Denied",
          description: "You do not have permission to perform this action.",
        });
        // Here you would log the `error` object to your monitoring service (e.g., Sentry, LogRocket)
      }
    };

    errorEmitter.on('permission-error', handleError);

    // Cleanup listener on component unmount
    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, [toast]);

  return null; // This component does not render anything
}
