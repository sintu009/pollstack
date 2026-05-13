import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { fetchPollByLink } from "../../store/slices/pollSlice";
import { resetSubmission } from "../../store/slices/responseSlice";
import { googleLogin } from "../../store/slices/authSlice";
import { responseAPI } from "../../services/api";
import UserLayout from "../UserLayout";
import TakePollPage from "./TakePollPage";
import ThankYouPage from "./ThankYouPage";
import PollResultsPage from "./PollResultsPage";
import { Card } from "../../components/ui";
import { HiExclamationCircle, HiClock, HiCheckCircle, HiLockClosed } from "react-icons/hi";

export default function SharedPollPage({ shareLink }) {
  const dispatch = useDispatch();
  const { currentPoll, loading, error } = useSelector((state) => state.polls);
  const { token } = useSelector((state) => state.auth);
  const [view, setView] = useState("loading");
  const [checking, setChecking] = useState(true);
  const [submissionStats, setSubmissionStats] = useState(null);

  useEffect(() => {
    if (shareLink) {
      dispatch(fetchPollByLink(shareLink));
      dispatch(resetSubmission());
    }
  }, [shareLink, dispatch]);

  // Once poll is loaded, check status
  useEffect(() => {
    if (!currentPoll?._id) return;

    if (!currentPoll.isAnonymous && !token) {
      setChecking(false);
      setView("auth_required");
      return;
    }

    if (!currentPoll.isActive && !currentPoll.isPublished) {
      setChecking(false);
      setView("expired");
      return;
    }

    if (currentPoll.isPublished) {
      setChecking(false);
      setView("published");
      return;
    }

    responseAPI.checkStatus(currentPoll._id)
      .then((data) => {
        setView(data.hasResponded ? "already" : "poll");
      })
      .catch(() => setView("poll"))
      .finally(() => setChecking(false));
  }, [currentPoll?._id, token]);

  const handleGoogleSuccess = (credentialResponse) => {
    dispatch(googleLogin(credentialResponse.credential));
  };

  const handlePollSubmit = (stats) => {
    setSubmissionStats(stats);
    setView("thankyou");
  };

  // Loading
  if (loading || checking) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center py-20">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-paragraph">Loading poll...</p>
          </div>
        </div>
      </UserLayout>
    );
  }

  // Not found
  if (error || (!loading && !currentPoll)) {
    return (
      <UserLayout>
        <div className="flex items-center justify-center py-20">
          <Card className="p-8 text-center max-w-md space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">
              <HiExclamationCircle className="text-3xl text-red-500" />
            </div>
            <h2 className="text-lg font-bold text-heading">Poll Not Found</h2>
            <p className="text-sm text-paragraph">
              {error || "This poll link is invalid or has been removed."}
            </p>
          </Card>
        </div>
      </UserLayout>
    );
  }

  // Expired
  if (view === "expired") {
    return (
      <UserLayout>
        <div className="flex items-center justify-center py-20">
          <Card className="p-8 text-center max-w-md space-y-4">
            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto">
              <HiClock className="text-3xl text-yellow-500" />
            </div>
            <h2 className="text-lg font-bold text-heading">Poll Expired</h2>
            <p className="text-sm text-paragraph">
              This poll is no longer accepting responses. It expired on {new Date(currentPoll.expiresAt).toLocaleDateString()}.
            </p>
          </Card>
        </div>
      </UserLayout>
    );
  }

  // Published — show results
  if (view === "published") {
    return (
      <UserLayout>
        <PollResultsPage poll={currentPoll} onBack={() => {}} />
      </UserLayout>
    );
  }

  // Auth required
  if (view === "auth_required") {
    return (
      <UserLayout>
        <div className="flex items-center justify-center py-20">
          <Card className="p-8 text-center max-w-md space-y-5">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <HiLockClosed className="text-3xl text-primary" />
            </div>
            <h2 className="text-lg font-bold text-heading">Authentication Required</h2>
            <p className="text-sm text-paragraph">
              This poll requires you to sign in before submitting your response.
            </p>
            <div className="pt-2">
              <p className="text-xs text-paragraph mb-3">Sign in with Google to continue</p>
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {}}
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                />
              </div>
            </div>
          </Card>
        </div>
      </UserLayout>
    );
  }

  // Already submitted
  if (view === "already") {
    return (
      <UserLayout>
        <div className="flex items-center justify-center py-20">
          <Card className="p-8 text-center max-w-md space-y-4">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <HiCheckCircle className="text-3xl text-green-500" />
            </div>
            <h2 className="text-lg font-bold text-heading">Already Submitted ✅</h2>
            <p className="text-sm text-paragraph">
              You have already submitted your response to <span className="font-medium text-heading">"{currentPoll.title}"</span>.
            </p>
            <p className="text-xs text-paragraph">
              Each person can only respond once.
            </p>
          </Card>
        </div>
      </UserLayout>
    );
  }

  // Thank you — with real stats
  if (view === "thankyou") {
    return (
      <UserLayout>
        <ThankYouPage onBackToPolls={() => {}} stats={submissionStats} />
      </UserLayout>
    );
  }

  // Active poll — take it
  return (
    <UserLayout>
      <TakePollPage
        poll={currentPoll}
        onBack={() => {}}
        onSubmit={handlePollSubmit}
      />
    </UserLayout>
  );
}
