export type UserCampaign = {
  userId: number,
  campaignId: number,
  vaccineId: number,
  status: string,
  campaignName: string,
  vaccineName: string
}

export type UserCampaignList = {
  userCampaigns: UserCampaign[]
}
