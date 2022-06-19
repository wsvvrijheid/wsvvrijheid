import HTMLFlipBook from 'react-pageflip'

const FlipBook = ({ children, ...rest }) => {
  return <HTMLFlipBook {...rest}>{children}</HTMLFlipBook>
}

export default FlipBook
