import { useRouter } from 'next/router'
import qs from 'qs'

export const useChangeParams = () => {
  const router = useRouter()

  const query = { ...router.query }

  const changeParams = args => {
    // In the case of query has empty string param which we want to remove,
    // it should be removed from both the query and args
    Object.keys(query).forEach(key => {
      if (query[key] === '' || args[key] === null) {
        delete query[key]
      }
    })

    // When we provide null value for a param, remove it from the query
    Object.keys(args).forEach(key => {
      if (args[key] === null) {
        delete args[key]
      }

      if (Array.isArray(args[key])) {
        args[key] = qs.stringify(args[key], { encodeValuesOnly: true })
      }
    })

    // If page is not specified, remove it from query
    // so that data is always fetched by the first page
    if (!args.page) delete query.page

    return router.push({
      query: { ...query, ...args },
    })
  }

  return changeParams
}
