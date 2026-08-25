import { Phase2Placeholder } from "@/components/admin/Phase2Placeholder";

export default function AdminFundingPage() {
  return (
    <Phase2Placeholder
      title="Funding pipeline"
      description="Deadlines, eligibility and stage in one place."
      cards={[
        { label: "Open applications", value: "-" },
        { label: "Total requested", value: "-" },
      ]}
    />
  );
}
