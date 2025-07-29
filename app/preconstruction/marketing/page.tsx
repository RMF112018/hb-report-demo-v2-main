import { redirect } from "next/navigation"

export default function MarketingPage() {
  // Redirect to the main preconstruction page with marketing tab
  redirect("/preconstruction")
}
