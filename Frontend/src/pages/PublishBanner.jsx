import { HiUpload } from "react-icons/hi";
import { Card, Button } from "../components/ui";

export default function PublishBanner() {
  return (
    <Card className="p-4 md:p-5 flex flex-col sm:flex-row items-center gap-4 md:gap-6 bg-gradient-to-r from-surface to-white">
      <div className="text-4xl">🏆</div>
      <div className="flex-1 text-center sm:text-left">
        <h3 className="text-base font-semibold text-heading">Publish Results</h3>
        <p className="text-sm text-paragraph">
          Once you're happy with the responses, publish the results to share insights with everyone.
        </p>
      </div>
      <Button variant="primary" size="lg" className="flex-shrink-0">
        <HiUpload /> Publish Results
      </Button>
    </Card>
  );
}
