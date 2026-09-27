export interface Point {
  x: number
  y: number
}

export interface Stroke {
  color: string
  width: number
  points: Point[]
}

export interface Drawing {
  id: number
  user_id: number
  username: string
  data: string
  created_at: string
  updated_at: string
}