import { render, screen } from '@testing-library/react'
import LazyImage from '@/app/components/LazyImage'

describe('LazyImage', () => {
  const defaultProps = {
    src: '/test-image.jpg',
    alt: 'Test Image',
    width: 400,
    height: 300
  }

  it('renders lazy image with correct props', () => {
    render(<LazyImage {...defaultProps} />)
    
    const img = screen.getByAltText('Test Image')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/test-image.jpg')
    expect(img).toHaveAttribute('width', '400')
    expect(img).toHaveAttribute('height', '300')
  })

  it('applies custom className', () => {
    render(<LazyImage {...defaultProps} className="custom-class" />)
    
    const container = screen.getByAltText('Test Image').parentElement
    expect(container).toHaveClass('custom-class')
  })

  it('renders with custom placeholder', () => {
    const customPlaceholder = 'data:image/svg+xml;base64,custom'
    render(<LazyImage {...defaultProps} placeholder={customPlaceholder} />)
    
    const placeholderImg = screen.getAllByRole('img')[0]
    expect(placeholderImg).toHaveAttribute('src', customPlaceholder)
  })

  it('has lazy loading attribute', () => {
    render(<LazyImage {...defaultProps} />)
    
    const img = screen.getByAltText('Test Image')
    expect(img).toHaveAttribute('loading', 'lazy')
  })
})
