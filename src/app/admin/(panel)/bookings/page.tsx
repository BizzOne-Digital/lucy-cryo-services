import { Suspense } from "react";
import { SubmissionsManager } from "@/components/admin/SubmissionsManager";

export default function AdminBookingsPage() {
  return (
    <Suspense>
      <SubmissionsManager />
    </Suspense>
  );
}
