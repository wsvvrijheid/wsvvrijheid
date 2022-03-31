import axios from 'axios'
import qs from 'qs'

import { transformStrapiData } from '~utils'

export const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
  },
})

export const request = async ({
  publicationState = 'live',
  locale,
  url,
  filters,
  sort,
  populate = '*',
  page,
  pageSize,
}) => {
  const query = qs.stringify(
    {
      publicationState,
      locale,
      filters,
      sort,
      populate,
      pagination: {
        page,
        pageSize,
      },
    },
    {
      encodeValuesOnly: true,
    },
  )
 
  // TODO Consider a better error handling
  try {
    const response = await instance.get(`/${url}?${query}`)
    return transformStrapiData(response.data)
  } catch (error) {
    console.error(error.data || error.response || error.message)
    return null
  }
}

export const mutation = {
  create: async (url, data) => instance.post(`/${url}`, data),
  edit: async (url, id, data) => instance.put(`/${url}/${id}`, data),
  delete: async (url, id) => instance.delete(`/${url}/${id}`),
  // https://docs.strapi.io/developer-docs/latest/plugins/i18n.html#creating-a-localization-for-an-existing-entry
  localize: async (url, id, data) => instance.post(`/${url}/${id}/localization`, data),
}
