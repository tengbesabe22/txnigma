import type { InvestigationOutput } from "../investigation.schema";
import type { DeepPartial } from "ai";

const categoryLabels: Record<InvestigationOutput["issueCategory"], string> = {
  failed_payment: "Reported payment failure",
  possible_duplicate: "Possible duplicate payment",
  refund_issue: "Reported refund issue",
  unknown: "More information needed",
};

export default function InvestigationResult({
  analysis,
  provisional,
  isLoading,
}: {
  analysis: DeepPartial<InvestigationOutput>;
  provisional: boolean;
  isLoading: boolean;
}) {
  const category = analysis.issueCategory;
  const categoryLabel =
    category && Object.hasOwn(categoryLabels, category)
      ? categoryLabels[category as InvestigationOutput["issueCategory"]]
      : "Identifying the reported issue…";
  const sections = [
    { title: "Findings & possible causes", items: analysis.findings },
    { title: "Missing evidence", items: analysis.missingEvidence },
    { title: "Recommended next steps", items: analysis.recommendedNextSteps },
  ];
  return (
    <div className="result-content">
      <div className="case-summary">
        <span className="transaction-id">
          {analysis.transactionId ??
            (provisional
              ? "Transaction ID not yet established"
              : "No transaction ID reported")}
        </span>
        <h3>{categoryLabel}</h3>
      </div>
      {provisional && (
        <p className="provisional-note">
          {isLoading
            ? "Draft · Investigation is still being generated."
            : "Incomplete · These results have not been confirmed as a final investigation."}
        </p>
      )}
      <p className="evidence-note">
        Description-based analysis. Findings are reported observations or
        hypotheses, not verified payment records.
      </p>
      {sections.map((section, sectionIndex) => (
        <section className="result-section" key={section.title}>
          <h3>
            <span className="finding-number">0{sectionIndex + 1}</span>
            {section.title}
          </h3>
          {section.items?.some(
            (item) => typeof item === "string" && item.length > 0,
          ) ? (
            <ul>
              {section.items
                .filter(
                  (item): item is string =>
                    typeof item === "string" && item.length > 0,
                )
                .map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
            </ul>
          ) : (
            <p className="muted">
              {isLoading
                ? "Waiting for details…"
                : provisional
                  ? "Not available in this incomplete investigation."
                  : "None identified in this report."}
            </p>
          )}
        </section>
      ))}
    </div>
  );
}
