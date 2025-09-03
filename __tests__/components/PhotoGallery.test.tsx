import { render, screen, fireEvent } from '@testing-library/react'
import PhotoGallery from '@/app/components/PhotoGallery'

const mockPhotos = [
  {
    id: '1',
    src: '/test-image-1.jpg',
    alt: 'Test Image 1',
    caption: 'Beautiful moment 1',
    date: '2024-01-01'
  },
  {
    id: '2',
    src: '/test-image-2.jpg',
    alt: 'Test Image 2',
    caption: 'Beautiful moment 2',
    date: '2024-01-02'
  }
]

describe('PhotoGallery', () => {
  it('renders photo gallery with title', () => {
    render(<PhotoGallery photos={mockPhotos} title="Our Love Story" />)
    
    expect(screen.getByText('Our Love Story')).toBeInTheDocument()
    expect(screen.getByText('Capturing our journey together')).toBeInTheDocument()
  })

  it('renders photos in grid', () => {
    render(<PhotoGallery photos={mockPhotos} />)
    
    expect(screen.getByAltText('Test Image 1')).toBeInTheDocument()
    expect(screen.getByAltText('Test Image 2')).toBeInTheDocument()
  })

  it('displays photo captions and dates', () => {
    render(<PhotoGallery photos={mockPhotos} />)
    
    expect(screen.getByText('Beautiful moment 1')).toBeInTheDocument()
    expect(screen.getByText('Beautiful moment 2')).toBeInTheDocument()
    expect(screen.getByText('2024-01-01')).toBeInTheDocument()
    expect(screen.getByText('2024-01-02')).toBeInTheDocument()
  })

  it('opens lightbox when photo is clicked', () => {
    render(<PhotoGallery photos={mockPhotos} />)
    
    const firstPhoto = screen.getByAltText('Test Image 1')
    fireEvent.click(firstPhoto)
    
    expect(screen.getByText('Beautiful moment 1')).toBeInTheDocument()
    expect(screen.getByText('1 of 2')).toBeInTheDocument()
  })
})
