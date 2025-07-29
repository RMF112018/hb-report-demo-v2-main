import BetaBDCommercialPipelineCard from "@/components/cards/beta/business-dev/BetaBDCommercialPipelineCard"
import BetaBDPublicSectorOpportunitiesCard from "@/components/cards/beta/business-dev/BetaBDPublicSectorOpportunitiesCard"

export default function BusinessDevelopmentPage() {
  return (
    <div className="space-y-6">
      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="w-full">
          <BetaBDCommercialPipelineCard />
        </div>
        <div className="w-full">
          <BetaBDPublicSectorOpportunitiesCard />
        </div>
      </div>
    </div>
  )
}
