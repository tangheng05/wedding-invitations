import { render, screen } from '@testing-library/react'
import CountdownTimer from '@/app/components/CountdownTimer'

describe('CountdownTimer', () => {
  const mockWeddingDate = new Date('2024-12-31T18:00:00Z')

  it('renders countdown timer with wedding date', () => {
    render(<CountdownTimer weddingDate={mockWeddingDate} />)
    
    expect(screen.getByText('Counting Down to Our Special Day')).toBeInTheDocument()
    expect(screen.getByText('Days')).toBeInTheDocument()
    expect(screen.getByText('Hours')).toBeInTheDocument()
    expect(screen.getByText('Minutes')).toBeInTheDocument()
    expect(screen.getByText('Seconds')).toBeInTheDocument()
  })

  it('displays countdown message', () => {
    render(<CountdownTimer weddingDate={mockWeddingDate} />)
    
    expect(screen.getByText("We can't wait to celebrate with you!")).toBeInTheDocument()
  })

  it('shows time units in correct format', () => {
    render(<CountdownTimer weddingDate={mockWeddingDate} />)
    
    const timeUnits = ['Days', 'Hours', 'Minutes', 'Seconds']
    timeUnits.forEach(unit => {
      expect(screen.getByText(unit)).toBeInTheDocument()
    })
  })
})
