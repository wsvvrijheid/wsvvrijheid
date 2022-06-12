import { Navigate } from '~components'

export const FooterNavItem = ({ link, label }) => {
  return (
    <Navigate
      color='blue.200'
      _hover={{
        color: 'blue.100',
      }}
      key={link}
      href={link}
    >
      {label}
    </Navigate>
  )
}
