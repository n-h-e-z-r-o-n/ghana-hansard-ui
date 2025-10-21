import { render, screen } from '@testing-library/react'
import LoadingSpinner, { CardSkeleton, ChartSkeleton, TableRowSkeleton } from '../LoadingSpinner'

describe('LoadingSpinner', () => {
  it('renders with default props', () => {
    render(<LoadingSpinner />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders with custom text', () => {
    render(<LoadingSpinner text="Custom loading text" />)
    expect(screen.getByText('Custom loading text')).toBeInTheDocument()
  })

  it('renders with different sizes', () => {
    const { rerender } = render(<LoadingSpinner size="sm" />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()

    rerender(<LoadingSpinner size="md" />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()

    rerender(<LoadingSpinner size="lg" />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    render(<LoadingSpinner className="custom-class" />)
    const container = screen.getByText('Loading...').closest('div')
    expect(container).toHaveClass('custom-class')
  })
})

describe('CardSkeleton', () => {
  it('renders skeleton elements', () => {
    render(<CardSkeleton />)
    const skeletonElements = document.querySelectorAll('.animate-pulse')
    expect(skeletonElements.length).toBeGreaterThan(0)
  })
})

describe('ChartSkeleton', () => {
  it('renders chart skeleton', () => {
    render(<ChartSkeleton />)
    const skeletonElements = document.querySelectorAll('.animate-pulse')
    expect(skeletonElements.length).toBeGreaterThan(0)
  })
})

describe('TableRowSkeleton', () => {
  it('renders table row skeleton', () => {
    render(<TableRowSkeleton />)
    const skeletonElements = document.querySelectorAll('.animate-pulse')
    expect(skeletonElements.length).toBeGreaterThan(0)
  })
})
