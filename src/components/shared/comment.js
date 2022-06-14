import { Embed } from 'hyvor-talk-react'

const Comments = ({ page }) => {
  return <Embed websiteId={process.env.NEXT_PUBLIC_HYVOR} id={page} />
}

export default Comments
