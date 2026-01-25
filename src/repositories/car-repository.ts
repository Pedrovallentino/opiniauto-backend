import { Car } from '../domain/entities'

export interface CreateCarData {
  marca: string
  modelo: string
  ano: number
  categoria: string
  tipoMotorizacao: string
  imagem: string
}

export interface UpdateCarData {
  marca?: string
  modelo?: string
  ano?: number
  categoria?: string
  tipoMotorizacao?: string
  imagem?: string
  status?: 'ATIVO' | 'INATIVO'
}

export interface CarRepository {
  create(data: CreateCarData): Promise<Car>
  update(id: string, data: UpdateCarData): Promise<Car>
  delete(id: string): Promise<void>
  findById(id: string): Promise<Car | null>
  listActive(): Promise<Car[]>
  listAll(): Promise<Car[]>
}

