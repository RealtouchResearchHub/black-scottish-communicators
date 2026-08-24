import { Phase2Placeholder } from "@/components/admin/Phase2Placeholder";

export default function AdminPartnersPage() {
  return (
    <Phase2Placeholder
      title="Corporate & institutional CRM"
      description="Employers, councils, funders, universities and sponsors."
      cards={[
        { label: "Leads", value: "—" },
        { label: "In proposal", value: "—" },
        { label: "Won partnerships", value: "—" },
      ]}
    />
  );
}
