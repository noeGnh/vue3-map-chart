export type MapType =
  | 'world'
  | 'africa'
  | 'asia'
  | 'europe'
  | 'north-america'
  | 'south-america'
  | 'oceania'

export interface MapDataValue {
  value?: number
  color?: string
  legendLabel?: string
}

export interface MapData {
  [key: string]: number | MapDataValue
}

export interface Options {
  name: string
}
