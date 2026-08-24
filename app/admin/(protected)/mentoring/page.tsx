import { Phase2Placeholder } from "@/components/admin/Phase2Placeholder";

export default function AdminMentoringPage() {
  return (
    <Phase2Placeholder
      title="Mentorship engine"
      description="Match by goals, sector, experience, hub and availability."
      cards={[
        { label: "Approved mentors", value: "—" },
        { label: "Active matches", value: "—" },
        { label: "Awaiting match", value: "—" },
      ]}
    />
  );
}
