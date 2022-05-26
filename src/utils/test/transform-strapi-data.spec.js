import { transformStrapiData } from '..'
import artists from './arts.json'
import artistsResult from './arts-result.json'

describe('Transform Data', () => {
  it('Transforms one level nested data', () => {
    const transformedData = transformStrapiData(artists)
    expect(transformedData).toStrictEqual(artistsResult)
  })
})
