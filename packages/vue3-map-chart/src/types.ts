export type MapType =
  | 'world'
  | 'africa'
  | 'asia'
  | 'europe'
  | 'north-america'
  | 'south-america'
  | 'australia'

export interface MapDataValue {
  value?: number
  color?: string
  legendLabel?: string
}

export interface MapData {
  [key: string]: number | MapDataValue
}
