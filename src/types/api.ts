// src/types/api.ts

export interface Bus {
  bus_no: string
  eta: string
  arrival_time: string
  crowd: string
  position: string
}

export interface Weather {
  time: string
  sky: string
  temp: string
  humidity: string
  precipitation_type: string
  precipitation_amount: string
  sky_code: number
  wind: string
}

export interface ApiResponse {
  bus: Bus[]
  weather: Weather[]
}
