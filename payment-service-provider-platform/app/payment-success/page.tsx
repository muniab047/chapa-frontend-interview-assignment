import PaymentSuccessPage from "@/components/PaymentSuccessPageInner";
import { Suspense } from "react";

export default function PaymentSuccessPageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentSuccessPage />
    </Suspense>
  );
}