import { format, parse } from 'date-fns'

export const formatDateToString = (date: Date) => {
  return format(date, "yyyy/MM/dd")
}

export const formatStringToDate = (date: string) => {
  return parse(date, 'yyyy/MM/dd', new Date())
}

export const formatToLocaleDateString = (date: string) => {
  return format(formatStringToDate(date), "dd/MM/yyyy")
}

export const formatStatusToPortuguese = (status: string) => {
  switch (status) {
    case "SIGN_UP": return "Cadastrada"
    case "ACCESSION": return "Em adesão"
    case "IN_PROGRESS": return "Em andamento"
    case "CLOSED": return "Finalizada"
    default: return "Estado inválido"
  }
}
