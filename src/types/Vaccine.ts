export type Vaccine = {
  id: number,
  name: string,
  description: string,
  ableToDelete: boolean,
}

export type VaccineData = Omit<Vaccine, "id" | "ableToDelete">
