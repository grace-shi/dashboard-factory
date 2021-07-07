import { sortedUniqBy, join } from 'lodash'

export const calcCols = panels => {
  const arr = panels.map(({ x, width }) => ([x, width]))
  return sortedUniqBy(arr, join)
}
