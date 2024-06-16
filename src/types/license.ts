export interface License {
  id: number
  fingerprint: string
  license: string
  brand?: string
  expireDays: number
  createdAt: Date
  updatedAt: Date
}
