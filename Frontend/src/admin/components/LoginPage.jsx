import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from "react-icons/hi";
import { loginUser, registerUser, googleLogin, forgotPassword, resetPassword, clearError, clearResetMessage } from "../../store/slices/authSlice";
import { Card, Button } from "../../components/ui";
import logo from "../../assets/logopollstack.png";

export default function LoginPage() {
  const dispatch = useDispatch();
  const { loading, error, resetMessage } = useSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleGoogleSuccess = (credentialResponse) => {
    // credentialResponse.credential is the ID token the backend expects
    dispatch(googleLogin(credentialResponse.credential));
  };

  const handleGoogleError = () => {
    dispatch(clearError());
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignUp) {
      dispatch(registerUser({ name, email, password }));
    } else {
      dispatch(loginUser({ email, password }));
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setShowForgotPassword(false);
    setShowResetPassword(false);
    dispatch(clearError());
    dispatch(clearResetMessage());
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    dispatch(resetPassword({ token: resetToken, password: newPassword }));
  };

  const showForgotPasswordForm = () => {
    setShowForgotPassword(true);
    setShowResetPassword(false);
    dispatch(clearError());
    dispatch(clearResetMessage());
  };

  const showResetPasswordForm = () => {
    setShowResetPassword(true);
    setShowForgotPassword(false);
    dispatch(clearError());
  };

  const backToLogin = () => {
    setShowForgotPassword(false);
    setShowResetPassword(false);
    dispatch(clearError());
    dispatch(clearResetMessage());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50/30 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-4">
            <img src={logo} alt="PollStack" className="h-10" />
          </div>
          <h1 className="text-xl font-bold text-heading mb-1">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-sm text-paragraph">
            {isSignUp ? "Start creating polls in seconds" : "Sign in to manage your polls"}
          </p>
        </div>

        <Card className="p-6 md:p-8">
          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-btn text-xs text-red-600">
              {error}
            </div>
          )}

          {/* Google Login */}
          <div className="flex justify-center mb-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              size="large"
              width="100%"
              text={isSignUp ? "signup_with" : "signin_with"}
              shape="rectangular"
              theme="outline"
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-paragraph">or</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-heading">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ankit Sharma"
                  className="w-full px-3.5 py-2.5 rounded-btn border border-border bg-white text-sm text-heading placeholder:text-paragraph/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  required
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-heading">Email</label>
              <div className="relative">
                <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-paragraph" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-btn border border-border bg-white text-sm text-heading placeholder:text-paragraph/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-heading">Password</label>
                {!isSignUp && (
                  <button 
                    type="button" 
                    onClick={showForgotPasswordForm}
                    className="text-xs text-primary font-medium cursor-pointer hover:underline"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-paragraph" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 rounded-btn border border-border bg-white text-sm text-heading placeholder:text-paragraph/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-paragraph cursor-pointer hover:text-heading"
                >
                  {showPassword ? <HiEyeOff /> : <HiEye />}
                </button>
              </div>
            </div>

            <Button variant="primary" size="lg" className="w-full mt-2" disabled={loading}>
              {loading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
            </Button>
          </form>
        </Card>

        {/* Forgot Password Form */}
        {showForgotPassword && (
          <Card className="p-6 md:p-8 mt-4">
            <h2 className="text-lg font-bold text-heading mb-4">Reset Password</h2>
            
            {resetMessage && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-btn text-xs text-green-600">
                {resetMessage}
                {resetMessage.includes("sent") && (
                  <div className="mt-2">
                    <button 
                      onClick={showResetPasswordForm}
                      className="text-primary font-medium hover:underline"
                    >
                      Enter reset code
                    </button>
                  </div>
                )}
              </div>
            )}
            
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-heading">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-3.5 py-2.5 rounded-btn border border-border bg-white text-sm text-heading placeholder:text-paragraph/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  required
                />
              </div>
              
              <Button variant="primary" size="lg" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Instructions"}
              </Button>
              
              <button 
                type="button" 
                onClick={backToLogin}
                className="w-full text-sm text-paragraph hover:text-heading"
              >
                Back to Login
              </button>
            </form>
          </Card>
        )}

        {/* Reset Password Form */}
        {showResetPassword && (
          <Card className="p-6 md:p-8 mt-4">
            <h2 className="text-lg font-bold text-heading mb-4">Enter New Password</h2>
            
            {resetMessage && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-btn text-xs text-green-600">
                {resetMessage}
              </div>
            )}
            
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-heading">Reset Code</label>
                <input
                  type="text"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  placeholder="Enter reset code from email"
                  className="w-full px-3.5 py-2.5 rounded-btn border border-border bg-white text-sm text-heading placeholder:text-paragraph/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  required
                />
              </div>
              
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-heading">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-3.5 py-2.5 rounded-btn border border-border bg-white text-sm text-heading placeholder:text-paragraph/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                  required
                />
              </div>
              
              <Button variant="primary" size="lg" className="w-full" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
              
              <button 
                type="button" 
                onClick={backToLogin}
                className="w-full text-sm text-paragraph hover:text-heading"
              >
                Back to Login
              </button>
            </form>
          </Card>
        )}

        {/* Toggle */}
        {!showForgotPassword && !showResetPassword && (
          <p className="text-center text-sm text-paragraph mt-6">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button onClick={toggleMode} className="text-primary font-medium cursor-pointer hover:underline">
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        )}
      </div>
    </div>
  );
}
