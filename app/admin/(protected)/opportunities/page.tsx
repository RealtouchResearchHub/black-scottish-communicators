import { Phase2Placeholder } from "@/components/admin/Phase2Placeholder";

export default function AdminOpportunitiesPage() {
  return (
    <Phase2Placeholder
      title="Opportunities board"
      description="Jobs, boards, speaking, funding and fellowships."
      cards={[
        { label: "Open opportunities", value: "—" },
        { label: "Applications this month", value: "—" },
      ]}
    />
  );
}
