import { useQuery } from 'react-query'

export const getVolunteers = async () => {
  const response = await request({ url: 'api/volunteers', filters: { approved: { $eq: true } } })

  return response.result
}

export const useVolunteers = (initialData = []) =>
  useQuery({
    queryKey: 'volunteers',
    queryFn: getVolunteers,
    initialData,
  })
