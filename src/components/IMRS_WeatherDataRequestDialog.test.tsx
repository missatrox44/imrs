import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IMRS_WeatherDataRequestDialog as WeatherDataRequestDialog } from '@/components/IMRS_WeatherDataRequestDialog'

// jsdom lacks these APIs that Radix Select relies on.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal('ResizeObserver', ResizeObserverStub)
Element.prototype.hasPointerCapture = () => false
Element.prototype.setPointerCapture = () => {}
Element.prototype.releasePointerCapture = () => {}
Element.prototype.scrollIntoView = () => {}

function setup() {
  // Radix sets pointer-events: none on <body> while the dialog is open,
  // which would make user-event reject clicks inside the dialog.
  const user = userEvent.setup({ pointerEventsCheck: 0 })
  render(<WeatherDataRequestDialog />)
  return user
}

async function openDialog(user: ReturnType<typeof userEvent.setup>) {
  await user.click(
    screen.getByRole('button', { name: /request raw weather data/i }),
  )
  return screen.getByRole('button', { name: /send request/i })
}

async function selectOption(
  user: ReturnType<typeof userEvent.setup>,
  triggerLabel: RegExp,
  optionName: RegExp,
) {
  await user.click(screen.getByLabelText(triggerLabel))
  await user.click(screen.getByRole('option', { name: optionName }))
}

function setDate(label: RegExp, value: string) {
  const input = screen.getByLabelText(label)
  fireEvent.change(input, { target: { value } })
  fireEvent.blur(input)
}

async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/full name/i), '  Jane Doe  ')
  await user.type(screen.getByLabelText(/^email/i), 'jane@example.com')
  await selectOption(user, /^role/i, /faculty/i)
  await selectOption(user, /^purpose/i, /research/i)
  await user.type(
    screen.getByLabelText(/brief description/i),
    'Analyzing rainfall trends.',
  )
  await user.click(screen.getByLabelText('Yes'))
  await user.click(screen.getByLabelText('Temperature'))
  setDate(/start date/i, '2024-01-01')
  setDate(/end date/i, '2024-06-30')
  await selectOption(user, /temporal resolution/i, /hourly/i)
  await selectOption(user, /file format/i, /csv/i)
  await user.click(screen.getByLabelText(/i agree to cite/i))
  await user.click(screen.getByLabelText(/i agree to share/i))
  await user.click(screen.getByLabelText(/provided .as is/i))
  await user.click(screen.getByLabelText(/i consent to the above/i))
}

describe('WeatherDataRequestDialog', () => {
  beforeEach(() => {
    vi.stubEnv('VITE_FORMSPREE_FORM_ID', 'test-form-id')
  })

  it('opens from the trigger with the submit button disabled', async () => {
    const user = setup()
    const submit = await openDialog(user)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(submit).toBeDisabled()
  })

  it('shows a text-field error only after blur', async () => {
    const user = setup()
    const submit = await openDialog(user)
    const fullName = screen.getByLabelText(/full name/i)
    await user.click(fullName)
    expect(screen.queryByText('Full name is required')).not.toBeInTheDocument()
    await user.tab()
    expect(screen.getByText('Full name is required')).toBeInTheDocument()
    // A blur with no input must not mark the form submittable.
    expect(submit).toBeDisabled()
  })

  it('rejects an end date before the start date', async () => {
    const user = setup()
    const submit = await openDialog(user)
    // The .refine cross-field rule only runs once the base object is valid.
    await fillValidForm(user)
    setDate(/end date/i, '2023-12-01')
    expect(
      screen.getByText('End date must be on or after the start date'),
    ).toBeInTheDocument()
    expect(submit).toBeDisabled()
  })

  it('shows the PI field for students and the specify field for other roles', async () => {
    const user = setup()
    await openDialog(user)
    expect(screen.queryByLabelText(/major professor/i)).not.toBeInTheDocument()
    await selectOption(user, /^role/i, /student/i)
    expect(screen.getByLabelText(/major professor/i)).toBeInTheDocument()
    await selectOption(user, /^role/i, /other/i)
    expect(screen.queryByLabelText(/major professor/i)).not.toBeInTheDocument()
    expect(
      screen.getByLabelText(/please specify your role/i),
    ).toBeInTheDocument()
  })

  it('submits trimmed values to Formspree and shows the success panel', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 })
    vi.stubGlobal('fetch', fetchMock)
    const user = setup()
    const submit = await openDialog(user)
    await fillValidForm(user)
    expect(submit).toBeEnabled()
    await user.click(submit)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://formspree.io/f/test-form-id')
    const body = JSON.parse(init.body)
    expect(body.fullName).toBe('Jane Doe')
    expect(body.email).toBe('jane@example.com')
    expect(body.variables).toEqual(['Temperature'])
    expect(body.station).toBe('Hill Station — Indio Mountains Research Station')
    expect(body.submittedAt).toEqual(expect.any(String))

    const status = await screen.findByRole('status')
    expect(status).toHaveTextContent(/your request has been sent/i)
  })

  it('shows an inline error when Formspree responds with a failure', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: false, status: 500 }),
    )
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const user = setup()
    const submit = await openDialog(user)
    await fillValidForm(user)
    await user.click(submit)

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent(/something went wrong/i)
    consoleError.mockRestore()
  })
})
