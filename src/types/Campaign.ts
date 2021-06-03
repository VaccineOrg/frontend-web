import { Vaccine } from "./Vaccine"

export type Campaign = {
  dateBegin: string,
  dateEnd: string,
  id: number,
  name: string,
  numberVaccines: number,
  status: string
  vaccineList: Vaccine[],
}

export type CampaignData = {
  dateBegin: Date,
  dateEnd: Date,
  name: string,
  numberVaccines: number,
  status: string
  vaccineList: Vaccine[],
}
