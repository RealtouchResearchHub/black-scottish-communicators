import { Phase2Placeholder } from "@/components/admin/Phase2Placeholder";

export default function AdminCommunicationsPage() {
  return (
    <Phase2Placeholder
      title="Communications centre"
      description="Segmented messages through email, WhatsApp and portal notifications."
      cards={[
        { label: "Campaigns sent", value: "—" },
        { label: "Estimated audience", value: "—" },
      ]}
    />
  );
}
