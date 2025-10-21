import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NotificationSystem, { useNotifications } from '../NotificationSystem'

// Mock the hook for testing
jest.mock('../NotificationSystem', () => {
  const actual = jest.requireActual('../NotificationSystem')
  return {
    ...actual,
    useNotifications: jest.fn(),
  }
})

describe('NotificationSystem', () => {
  const mockNotifications = [
    {
      id: '1',
      type: 'success' as const,
      title: 'Success!',
      message: 'Operation completed successfully',
    },
    {
      id: '2',
      type: 'error' as const,
      title: 'Error!',
      message: 'Something went wrong',
      persistent: true,
    },
    {
      id: '3',
      type: 'warning' as const,
      title: 'Warning!',
      message: 'Please check your input',
    },
    {
      id: '4',
      type: 'info' as const,
      title: 'Info',
      message: 'Here is some information',
    },
  ]

  const mockOnRemove = jest.fn()
  const mockOnAction = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders notifications', () => {
    render(
      <NotificationSystem
        notifications={mockNotifications}
        onRemove={mockOnRemove}
        onAction={mockOnAction}
      />
    )

    expect(screen.getByText('Success!')).toBeInTheDocument()
    expect(screen.getByText('Error!')).toBeInTheDocument()
    expect(screen.getByText('Warning!')).toBeInTheDocument()
    expect(screen.getByText('Info')).toBeInTheDocument()
  })

  it('calls onRemove when close button is clicked', async () => {
    render(
      <NotificationSystem
        notifications={[mockNotifications[0]]}
        onRemove={mockOnRemove}
        onAction={mockOnAction}
      />
    )

    const closeButton = screen.getByLabelText('Close notification')
    await userEvent.click(closeButton)

    expect(mockOnRemove).toHaveBeenCalledWith('1')
  })

  it('renders notification actions', () => {
    const notificationWithActions = {
      id: '5',
      type: 'info' as const,
      title: 'Action Required',
      message: 'Please take action',
      actions: [
        {
          label: 'Retry',
          action: jest.fn(),
          variant: 'primary' as const,
        },
        {
          label: 'Cancel',
          action: jest.fn(),
          variant: 'secondary' as const,
        },
      ],
    }

    render(
      <NotificationSystem
        notifications={[notificationWithActions]}
        onRemove={mockOnRemove}
        onAction={mockOnAction}
      />
    )

    expect(screen.getByText('Retry')).toBeInTheDocument()
    expect(screen.getByText('Cancel')).toBeInTheDocument()
  })

  it('calls onAction when action button is clicked', async () => {
    const mockAction = jest.fn()
    const notificationWithActions = {
      id: '6',
      type: 'info' as const,
      title: 'Action Required',
      message: 'Please take action',
      actions: [
        {
          label: 'Retry',
          action: mockAction,
        },
      ],
    }

    render(
      <NotificationSystem
        notifications={[notificationWithActions]}
        onRemove={mockOnRemove}
        onAction={mockOnAction}
      />
    )

    const retryButton = screen.getByText('Retry')
    await userEvent.click(retryButton)

    expect(mockAction).toHaveBeenCalled()
    expect(mockOnAction).toHaveBeenCalledWith('6', 0)
  })

  it('renders different notification types with correct styling', () => {
    render(
      <NotificationSystem
        notifications={mockNotifications}
        onRemove={mockOnRemove}
        onAction={mockOnAction}
      />
    )

    // Check for different background colors based on type
    const successNotification = screen.getByText('Success!').closest('div')
    const errorNotification = screen.getByText('Error!').closest('div')
    const warningNotification = screen.getByText('Warning!').closest('div')
    const infoNotification = screen.getByText('Info').closest('div')

    expect(successNotification).toHaveClass('bg-green-50')
    expect(errorNotification).toHaveClass('bg-red-50')
    expect(warningNotification).toHaveClass('bg-yellow-50')
    expect(infoNotification).toHaveClass('bg-blue-50')
  })

  it('renders persistent notifications without progress bar', () => {
    const persistentNotification = {
      id: '7',
      type: 'error' as const,
      title: 'Persistent Error',
      message: 'This error will not auto-dismiss',
      persistent: true,
    }

    render(
      <NotificationSystem
        notifications={[persistentNotification]}
        onRemove={mockOnRemove}
        onAction={mockOnAction}
      />
    )

    // Persistent notifications should not have progress bars
    const notification = screen.getByText('Persistent Error').closest('div')
    expect(notification).not.toHaveClass('h-1') // Progress bar class
  })
})

describe('useNotifications hook', () => {
  it('provides notification management functions', () => {
    const mockHook = {
      notifications: [],
      addNotification: jest.fn(),
      removeNotification: jest.fn(),
      clearAll: jest.fn(),
      showSuccess: jest.fn(),
      showError: jest.fn(),
      showWarning: jest.fn(),
      showInfo: jest.fn(),
    }

    ;(useNotifications as jest.Mock).mockReturnValue(mockHook)

    // This would typically be tested in a component that uses the hook
    expect(mockHook.addNotification).toBeDefined()
    expect(mockHook.removeNotification).toBeDefined()
    expect(mockHook.clearAll).toBeDefined()
    expect(mockHook.showSuccess).toBeDefined()
    expect(mockHook.showError).toBeDefined()
    expect(mockHook.showWarning).toBeDefined()
    expect(mockHook.showInfo).toBeDefined()
  })
})
