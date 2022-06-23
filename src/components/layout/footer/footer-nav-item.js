import { Navigate } from '~components'

export const FooterNavItem = ({ link, label }) => {
  return (
    <Navigate
      color='blue.100'
      _hover={{
        color: 'blue.50',
      }}
      key={link}
      href={link}
    >
      {label}
    </Navigate>
  )
}
