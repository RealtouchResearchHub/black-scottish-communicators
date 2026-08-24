import { Phase2Placeholder } from "@/components/admin/Phase2Placeholder";

export default function AdminGovernancePage() {
  return (
    <Phase2Placeholder
      title="Board & governance portal"
      description="Separate governance accountability from day-to-day operations."
      cards={[
        { label: "Statutory actions due", value: "—" },
        { label: "Conflicts register", value: "—" },
      ]}
    />
  );
}
