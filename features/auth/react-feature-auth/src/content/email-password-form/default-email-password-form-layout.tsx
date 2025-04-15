'use client';
import {
  executeAction,
  LayoutConfiguration,
  TypeDescriptor,
  useVyuh,
} from '@vyuh/react-core';
import React, { useState } from 'react';
import {
  AuthActionType,
  EmailPasswordForm,
  EMAIL_PASSWORD_FORM_SCHEMA_TYPE,
} from './email-password-form';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Default layout for the Email/Password form
 */
export class DefaultEmailPasswordFormLayout extends LayoutConfiguration<EmailPasswordForm> {
  static readonly schemaName = `${EMAIL_PASSWORD_FORM_SCHEMA_TYPE}.layout.default`;
  static readonly typeDescriptor = new TypeDescriptor(this.schemaName, this);

  constructor() {
    super({
      schemaType: DefaultEmailPasswordFormLayout.schemaName,
      title: 'Default Email Password Form Layout',
    });
  }

  render(content: EmailPasswordForm): React.ReactNode {
    const { plugins } = useVyuh();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setLoading(true);

      try {
        if (content.actionType === AuthActionType.SignUp) {
          await plugins.auth.registerWithEmailPassword({
            email,
            password,
          });

          // Execute the main action after successful registration
          if (content.action) {
            executeAction(content.action);
          }
        } else {
          await plugins.auth.loginWithEmailPassword({
            email,
            password,
          });

          // Execute the main action after successful login
          if (content.action) {
            executeAction(content.action);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Authentication failed');
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="card bg-base-100 mx-auto w-full max-w-md shadow-xl">
        <div className="card-body">
          {error && content.showLoginError && (
            <div className="alert alert-error mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input input-bordered w-full pr-10"
                  required
                />
                {content.showPasswordVisibilityToggle && (
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                )}
              </div>
            </div>

            {content.actionType === AuthActionType.SignIn &&
              content.forgotPasswordAction && (
                <div className="mb-4 flex justify-end">
                  <button
                    type="button"
                    className="btn btn-link btn-sm h-auto min-h-0 p-0 text-sm"
                    onClick={() => {
                      executeAction(content.forgotPasswordAction!);
                    }}
                  >
                    Forgot Password?
                  </button>
                </div>
              )}

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  {content.actionType === AuthActionType.SignIn
                    ? 'Signing In...'
                    : 'Signing Up...'}
                </>
              ) : (
                content.actionType === AuthActionType.SignIn
                  ? 'Sign In'
                  : 'Sign Up'
              )}
            </button>
          </form>

          {content.actionType === AuthActionType.SignIn &&
            content.signupAction && <div className="divider">OR</div>}

          {content.actionType === AuthActionType.SignIn &&
            content.signupAction && (
              <div className="text-center">
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={() => {
                    executeAction(content.signupAction!);
                  }}
                >
                  Don't have an account? Sign up
                </button>
              </div>
            )}

          {content.actionType === AuthActionType.SignUp &&
            content.loginAction && (
              <div className="text-center">
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={() => {
                    executeAction(content.loginAction!);
                  }}
                >
                  Already have an account? Sign in
                </button>
              </div>
            )}
        </div>
      </div>
    );
  }
}
