export class Farm {
  id: string
  total_area: number
  farm_name: string
  vegetation_area: number
  agricultural_area: number
  city_id: string
  producer_id: string
  city?: any // Adicionado para incluir a relação com City
}
