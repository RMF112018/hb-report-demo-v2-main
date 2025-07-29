import BetaBDCommercialPipelineCard from "@/components/cards/beta/business-dev/BetaBDCommercialPipelineCard"
import BetaBDPublicSectorOpportunitiesCard from "@/components/cards/beta/business-dev/BetaBDPublicSectorOpportunitiesCard"
import BetaBDUnanetAnalyticsCard from "@/components/cards/beta/business-dev/BetaBDUnanetAnalyticsCard"
import { BetaBDClientEngagementCard } from "@/components/cards/beta/BetaBDClientEngagementCard"

export default function BusinessDevelopmentPage() {
  return (
    <div className="space-y-6">
      {/* Masonry Grid Layout for Beta Business Development Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <div className="w-full">
          <BetaBDCommercialPipelineCard />
        </div>
        <div className="w-full">
          <BetaBDPublicSectorOpportunitiesCard />
        </div>
        <div className="w-full lg:col-span-2 xl:col-span-1">
          <BetaBDUnanetAnalyticsCard />
        </div>
        <div className="w-full">
          <BetaBDClientEngagementCard />
        </div>
      </div>
    </div>
  )
}
