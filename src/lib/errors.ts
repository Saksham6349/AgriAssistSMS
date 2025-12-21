/**
 * Defines the context for a Firestore security rule violation.
 * This information is used to construct a detailed error message
 * that helps developers debug their security rules.
 */
export type SecurityRuleContext = {
  path: string;
  operation: 'get' | 'list' | 'create' | 'update' | 'delete';
  // The new data being sent for a 'create' or 'update' operation.
  requestResourceData?: any;
};

/**
 * A custom error class for Firestore permission-denied errors.
 * It formats the error message to be more informative by including
 * the security rule context, which can be picked up by debugging tools.
 */
export class FirestorePermissionError extends Error {
  constructor(context: SecurityRuleContext) {
    // Construct a detailed error message.
    const message = `Firestore Security Rules denied ${context.operation.toUpperCase()} request on path: ${context.path}`;
    
    super(message);
    this.name = 'FirestorePermissionError';

    // Attach the context to the error object for programmatic access.
    // The context is stringified and appended to the message for easy display in error overlays.
    (this as any).details = `\n\n--- Firestore Security Rule Context ---\n${JSON.stringify(
      {
        auth: "Simulated: No user authenticated. `request.auth` is null.",
        ...context,
      },
      null,
      2
    )}\n----------------------------------`;

    // Append the details to the message that gets displayed in the error overlay.
    this.message += (this as any).details;
    
    // This helps in correctly capturing the stack trace.
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FirestorePermissionError);
    }
  }
}
