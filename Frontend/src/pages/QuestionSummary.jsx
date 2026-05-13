import { Card, ProgressBar, Button } from "../components/ui";

export default function QuestionSummary({ questions }) {
  return (
    <Card className="p-4 md:p-5">
      <h3 className="text-sm md:text-base font-semibold text-heading mb-4">Question Summary</h3>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="text-xs font-medium text-paragraph py-2 w-8">#</th>
              <th className="text-xs font-medium text-paragraph py-2">Question</th>
              <th className="text-xs font-medium text-paragraph py-2">Type</th>
              <th className="text-xs font-medium text-paragraph py-2">Required</th>
              <th className="text-xs font-medium text-paragraph py-2">Responses</th>
              <th className="text-xs font-medium text-paragraph py-2">Top Result</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q, i) => (
              <tr key={i} className="border-b border-border/50">
                <td className="py-3 text-sm text-paragraph">{i + 1}</td>
                <td className="py-3 text-sm text-heading max-w-[250px]">{q.question}</td>
                <td className="py-3 text-sm text-paragraph">{q.type}</td>
                <td className="py-3 text-sm text-paragraph">{q.required ? "Yes" : "No"}</td>
                <td className="py-3 text-sm text-heading font-medium font-num">{q.responses}</td>
                <td className="py-3 w-44">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs text-heading">{q.topResult.label} ({q.topResult.percent})</span>
                    <ProgressBar value={parseFloat(q.topResult.percent)} color="secondary" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4">
        <Button variant="outline" size="sm">View All Questions</Button>
      </div>
    </Card>
  );
}
