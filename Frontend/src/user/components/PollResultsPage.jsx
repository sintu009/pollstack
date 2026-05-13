import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { HiUsers, HiGlobe, HiArrowLeft, HiChartBar } from "react-icons/hi";
import { Card, Badge, ProgressBar } from "../../components/ui";
import { fetchPublicResults } from "../../store/slices/responseSlice";

export default function PollResultsPage({ poll, onBack }) {
  const dispatch = useDispatch();
  const { publicResults, loading } = useSelector((state) => state.responses);

  useEffect(() => {
    if (poll?.shareLink) dispatch(fetchPublicResults(poll.shareLink));
  }, [poll?.shareLink, dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-paragraph">Loading results...</p>
        </div>
      </div>
    );
  }

  if (!publicResults) {
    return (
      <div className="flex items-center justify-center py-16">
        <Card className="p-8 text-center max-w-md space-y-3">
          <HiChartBar className="text-3xl text-paragraph mx-auto" />
          <p className="text-sm text-paragraph">Results are not available yet. The poll creator has not published the results.</p>
        </Card>
      </div>
    );
  }

  const { poll: pollInfo, totalResponses, questionSummaries } = publicResults;

  return (
    <div className="space-y-6">
      {onBack && (
        <button onClick={onBack} className="flex items-center gap-1.5 text-paragraph text-sm cursor-pointer hover:text-heading transition-colors">
          <HiArrowLeft /> Back
        </button>
      )}

      {/* Header */}
      <Card className="p-5 md:p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-lg md:text-xl font-bold text-heading">{pollInfo?.title}</h1>
              <Badge variant="published">Published Results</Badge>
            </div>
            {pollInfo?.description && <p className="text-sm text-paragraph mt-1">{pollInfo.description}</p>}
          </div>
          <div className="text-3xl">📊</div>
        </div>
        <div className="flex items-center gap-5 pt-3 border-t border-border/50 text-xs text-paragraph flex-wrap">
          <span className="flex items-center gap-1.5">
            <HiUsers className="text-primary" />
            <span className="font-num font-semibold text-heading">{totalResponses}</span> total responses
          </span>
          <span className="flex items-center gap-1.5">
            <HiGlobe className="text-green-500" /> Public Results
          </span>
          <span className="flex items-center gap-1.5">
            <HiChartBar className="text-paragraph" />
            {questionSummaries?.length} questions
          </span>
        </div>
      </Card>

      {/* Question Results */}
      {questionSummaries?.map((q, i) => {
        const totalForQ = q.options.reduce((sum, o) => sum + o.count, 0);
        const sortedOptions = [...q.options].sort((a, b) => b.count - a.count);

        return (
          <Card key={i} className="p-5 md:p-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center font-num">{i + 1}</span>
              <h3 className="text-sm font-semibold text-heading flex-1">{q.title}</h3>
              <span className="text-[10px] text-paragraph font-num">{totalForQ} answers</span>
            </div>

            <div className="flex flex-col gap-4 ml-8 mt-4">
              {sortedOptions.map((opt, j) => {
                const percent = totalForQ > 0 ? Math.round((opt.count / totalForQ) * 100) : 0;
                const isTop = j === 0 && opt.count > 0;
                return (
                  <div key={j}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-sm ${isTop ? "font-medium text-heading" : "text-paragraph"}`}>
                        {opt.text} {isTop && <span className="ml-2 text-[10px] text-primary font-medium">👑 Top</span>}
                      </span>
                      <span className="text-xs font-num text-heading font-medium">
                        {opt.count} <span className="text-paragraph">({percent}%)</span>
                      </span>
                    </div>
                    <ProgressBar value={percent} color={isTop ? "primary" : "secondary"} className="h-2.5 rounded-full" />
                  </div>
                );
              })}
            </div>
          </Card>
        );
      })}

      {/* Footer */}
      <div className="text-center py-4">
        <p className="text-xs text-paragraph">
          These results are final and published by the poll creator.
        </p>
      </div>
    </div>
  );
}
