import React from 'react'

import { useLocaleTimeFormat } from '~hooks'

const FormattedDate = ({ date, format }) => {
  const { formattedDate } = useLocaleTimeFormat(date, format)
  return <>{formattedDate}</>
}

export default FormattedDate
