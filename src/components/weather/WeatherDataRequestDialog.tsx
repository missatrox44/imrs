import { useId, useState } from 'react'
import { z } from 'zod'
import { useForm, useStore } from '@tanstack/react-form'
import { Download, Loader2 } from 'lucide-react'
import type { AnyFieldApi } from '@tanstack/react-form'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const VARIABLES = [
  'Temperature',
  'Relative humidity',
  'Dew point',
  'Rainfall',
  'Wind speed',
  'Wind gust',
  'Pressure',
] as const

const ROLES = [
  { value: 'student', label: 'Student' },
  { value: 'faculty', label: 'Faculty / Researcher' },
  { value: 'other', label: 'Other' },
] as const

const PURPOSES = [
  { value: 'research', label: 'Research' },
  { value: 'education', label: 'Education / Teaching' },
  { value: 'personal', label: 'Personal' },
  { value: 'other', label: 'Other' },
] as const

const RESOLUTIONS = [
  { value: '15min', label: '15-minute (raw)' },
  { value: 'hourly', label: 'Hourly' },
  { value: 'daily', label: 'Daily' },
] as const

const FORMATS = [
  { value: 'csv', label: 'CSV' },
  { value: 'excel', label: 'Excel' },
] as const

// Reject HTML angle brackets in free-text identity fields to avoid markup
// being carried into the request email.
const noAngleBrackets = z
  .string()
  .regex(/^[^<>]*$/u, 'Cannot contain the characters < or >')

const requestSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(1, 'Full name is required')
      .max(100, 'Must be 100 characters or fewer')
      .pipe(noAngleBrackets),
    email: z
      .string()
      .trim()
      .min(1, 'Email is required')
      .max(254, 'Email is too long')
      .email('Enter a valid email address'),
    organization: z
      .string()
      .trim()
      .max(200, 'Must be 200 characters or fewer')
      .pipe(noAngleBrackets),
    role: z.enum(['student', 'faculty', 'other'], {
      message: 'Please select a role',
    }),
    pi: z
      .string()
      .trim()
      .max(100, 'Must be 100 characters or fewer')
      .pipe(noAngleBrackets),
    roleOther: z
      .string()
      .trim()
      .max(100, 'Must be 100 characters or fewer')
      .pipe(noAngleBrackets),
    purpose: z.enum(['research', 'education', 'personal', 'other'], {
      message: 'Please select a purpose',
    }),
    description: z
      .string()
      .trim()
      .min(1, 'Please describe how the data will be used')
      .max(2000, 'Must be 2000 characters or fewer'),
    published: z.enum(['yes', 'no'], {
      message: 'Please indicate whether results will be published',
    }),
    variables: z.array(z.string()).min(1, 'Select at least one variable'),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    resolution: z.enum(['15min', 'hourly', 'daily'], {
      message: 'Please select a temporal resolution',
    }),
    format: z.enum(['csv', 'excel'], {
      message: 'Please select a file format',
    }),
    ackCite: z.literal(true, { message: 'Acknowledgment is required' }),
    ackShare: z.literal(true, { message: 'Acknowledgment is required' }),
    ackAsIs: z.literal(true, { message: 'Acknowledgment is required' }),
    consent: z.literal(true, { message: 'Consent is required' }),
  })
  .refine((data) => data.startDate <= data.endDate, {
    path: ['endDate'],
    message: 'End date must be on or after the start date',
  })

const MAX_LENGTHS = {
  fullName: 100,
  email: 254,
  organization: 200,
  pi: 100,
  roleOther: 100,
  description: 2000,
  startDate: 10,
  endDate: 10,
} as const

type TextFieldName = keyof typeof MAX_LENGTHS

const ACKNOWLEDGMENTS = [
  {
    name: 'ackCite',
    label:
      'I agree to cite / acknowledge the Indio Mountains Research Station in any resulting publication.',
  },
  {
    name: 'ackShare',
    label: 'I agree to share a copy of any resulting publications.',
  },
  {
    name: 'ackAsIs',
    label: 'I understand the data is provided “as is,” with no warranty.',
  },
  {
    name: 'consent',
    label:
      'I consent to the above (a timestamp will be recorded with this request).',
  },
] as const

const initialValues = {
  fullName: '',
  email: '',
  organization: '',
  role: '',
  pi: '',
  roleOther: '',
  purpose: '',
  description: '',
  published: '',
  variables: [] as Array<string>,
  startDate: '',
  endDate: '',
  resolution: '',
  format: '',
  ackCite: false,
  ackShare: false,
  ackAsIs: false,
  consent: false,
}

type SubmitStatus = 'idle' | 'success' | 'error'

function issueMessage(field: AnyFieldApi): string | undefined {
  return field.state.meta.errors[0]?.message
}

// Only surface an error once the user has interacted with the field:
// text inputs after blur, pickers/checkboxes after any interaction.
function blurredError(field: AnyFieldApi) {
  return field.state.meta.isBlurred ? issueMessage(field) : undefined
}

function touchedError(field: AnyFieldApi) {
  return field.state.meta.isTouched ? issueMessage(field) : undefined
}

// Pickers, radios, and checkboxes commit on interaction: change and blur in
// one step, so their errors surface immediately (see touchedError above).
function commit(field: AnyFieldApi, value: unknown) {
  field.handleChange(value)
  field.handleBlur()
}

export default function WeatherDataRequestDialog() {
  const ids = {
    fullName: useId(),
    email: useId(),
    organization: useId(),
    role: useId(),
    pi: useId(),
    roleOther: useId(),
    purpose: useId(),
    description: useId(),
    published: useId(),
    variables: useId(),
    startDate: useId(),
    endDate: useId(),
    resolution: useId(),
    format: useId(),
  }

  const [open, setOpen] = useState(false)
  const [status, setStatus] = useState<SubmitStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const form = useForm({
    defaultValues: initialValues,
    // onMount keeps the submit button disabled from first render. Touching a
    // field discards the onMount errors, so onChange AND onBlur must both
    // revalidate — a blur without a change would otherwise mark the form valid.
    validators: {
      onMount: requestSchema,
      onChange: requestSchema,
      onBlur: requestSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      const formId = import.meta.env.VITE_FORMSPREE_FORM_ID
      if (!formId) {
        console.error(
          'WeatherDataRequestDialog: VITE_FORMSPREE_FORM_ID is not set. ' +
            'Set it in .env.local and restart the dev server to enable submissions.',
        )
        setErrorMessage(
          'This form is not set up correctly yet, so requests cannot be sent. Please contact the site administrator.',
        )
        setStatus('error')
        return
      }

      try {
        // Post the Zod output, not the raw values, so strings are trimmed.
        const parsed = requestSchema.parse(value)
        const response = await fetch(`https://formspree.io/f/${formId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            ...parsed,
            station: 'Hill Station — Indio Mountains Research Station',
            submittedAt: new Date().toISOString(),
          }),
        })
        if (!response.ok) {
          throw new Error(`Formspree responded with status ${response.status}`)
        }
        setStatus('success')
        formApi.reset()
      } catch (error) {
        console.error('WeatherDataRequestDialog: failed to send request', error)
        setErrorMessage(
          'Something went wrong sending your request. Please check your connection and try again.',
        )
        setStatus('error')
      }
    },
  })

  const role = useStore(form.store, (state) => state.values.role)

  function resetForm() {
    form.reset()
    setStatus('idle')
    setErrorMessage('')
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) resetForm()
      }}
    >
      <DialogTrigger asChild>
        <Button
          id="request-weather-data"
          variant="outline"
          size="sm"
          className="cursor-pointer"
        >
          <Download className="size-4" aria-hidden="true" />
          Request raw weather data
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request raw weather data</DialogTitle>
          {status !== 'success' && (
            <DialogDescription>
              Tell us a bit about you and the data you need. We&rsquo;ll follow
              up by email.
            </DialogDescription>
          )}
        </DialogHeader>

        {status === 'success' ? (
          <div
            role="status"
            aria-live="polite"
            className="flex-1 overflow-y-auto px-6 py-8 text-center"
          >
            <p className="text-base font-medium text-foreground">
              Thank you &mdash; your request has been sent.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              We&rsquo;ll be in touch at the email you provided.
            </p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-6 cursor-pointer"
              onClick={() => setStatus('idle')}
            >
              Submit another request
            </Button>
          </div>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault()
              event.stopPropagation()
              form.handleSubmit()
            }}
            noValidate
            className="contents"
          >
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8">
              {/* Requester */}
              <fieldset className="space-y-4">
                <legend className="text-sm font-semibold text-foreground mb-2">
                  Requester
                </legend>
                <form.Field name="fullName">
                  {(field) => (
                    <TextField
                      field={field}
                      id={ids.fullName}
                      label="Full name"
                      required
                    />
                  )}
                </form.Field>
                <form.Field name="email">
                  {(field) => (
                    <TextField
                      field={field}
                      id={ids.email}
                      label="Email"
                      required
                      type="email"
                      inputMode="email"
                    />
                  )}
                </form.Field>
                <form.Field name="organization">
                  {(field) => (
                    <TextField
                      field={field}
                      id={ids.organization}
                      label="Organization / institution"
                    />
                  )}
                </form.Field>
                <form.Field name="role">
                  {(field) => (
                    <SelectField
                      field={field}
                      id={ids.role}
                      label="Role"
                      placeholder="Select a role"
                      options={ROLES}
                    />
                  )}
                </form.Field>
                {role === 'student' && (
                  <form.Field name="pi">
                    {(field) => (
                      <TextField
                        field={field}
                        id={ids.pi}
                        label="Major professor / PI"
                      />
                    )}
                  </form.Field>
                )}
                {role === 'other' && (
                  <form.Field name="roleOther">
                    {(field) => (
                      <TextField
                        field={field}
                        id={ids.roleOther}
                        label="Please specify your role"
                      />
                    )}
                  </form.Field>
                )}
              </fieldset>

              {/* Use */}
              <fieldset className="space-y-4">
                <legend className="text-sm font-semibold text-foreground mb-2">
                  Use
                </legend>
                <form.Field name="purpose">
                  {(field) => (
                    <SelectField
                      field={field}
                      id={ids.purpose}
                      label="Purpose"
                      placeholder="Select a purpose"
                      options={PURPOSES}
                    />
                  )}
                </form.Field>
                <form.Field name="description">
                  {(field) => (
                    <TextField
                      field={field}
                      id={ids.description}
                      label="Brief description of how the data will be used"
                      required
                      multiline
                    />
                  )}
                </form.Field>
                <fieldset>
                  <legend className="text-sm font-medium mb-2">
                    Will results be published?
                    <span aria-hidden="true" className="text-destructive">
                      {' '}
                      *
                    </span>
                  </legend>
                  <form.Field name="published">
                    {(field) => {
                      const error = touchedError(field)
                      return (
                        <>
                          <div className="flex gap-6">
                            {(['yes', 'no'] as const).map((option) => (
                              <label
                                key={option}
                                className="flex cursor-pointer items-center gap-2 text-sm"
                              >
                                <input
                                  type="radio"
                                  name="published"
                                  value={option}
                                  checked={field.state.value === option}
                                  onChange={() => commit(field, option)}
                                  className="size-4 cursor-pointer accent-primary"
                                />
                                {option === 'yes' ? 'Yes' : 'No'}
                              </label>
                            ))}
                          </div>
                          {error && <FieldError message={error} />}
                        </>
                      )
                    }}
                  </form.Field>
                </fieldset>
              </fieldset>

              {/* Data requested */}
              <fieldset className="space-y-4">
                <legend className="text-sm font-semibold text-foreground mb-2">
                  Data requested
                </legend>
                <p className="text-sm text-muted-foreground">
                  Station: Hill Station &mdash; Indio Mountains Research Station
                </p>

                <fieldset>
                  <legend className="text-sm font-medium mb-2">
                    Variables
                    <span aria-hidden="true" className="text-destructive">
                      {' '}
                      *
                    </span>
                  </legend>
                  <form.Field name="variables">
                    {(field) => {
                      const error = touchedError(field)
                      return (
                        <>
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {VARIABLES.map((variable) => {
                              const checked =
                                field.state.value.includes(variable)
                              return (
                                <label
                                  key={variable}
                                  className="flex cursor-pointer items-center gap-2 text-sm"
                                >
                                  <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() =>
                                      commit(
                                        field,
                                        checked
                                          ? field.state.value.filter(
                                              (v) => v !== variable,
                                            )
                                          : [...field.state.value, variable],
                                      )
                                    }
                                    className="size-4 cursor-pointer accent-primary"
                                  />
                                  {variable}
                                </label>
                              )
                            })}
                          </div>
                          {error && <FieldError message={error} />}
                        </>
                      )
                    }}
                  </form.Field>
                </fieldset>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <form.Field name="startDate">
                    {(field) => (
                      <TextField
                        field={field}
                        id={ids.startDate}
                        label="Start date"
                        required
                        type="date"
                      />
                    )}
                  </form.Field>
                  <form.Field name="endDate">
                    {(field) => (
                      <TextField
                        field={field}
                        id={ids.endDate}
                        label="End date"
                        required
                        type="date"
                      />
                    )}
                  </form.Field>
                </div>

                <form.Field name="resolution">
                  {(field) => (
                    <SelectField
                      field={field}
                      id={ids.resolution}
                      label="Temporal resolution"
                      placeholder="Select a resolution"
                      options={RESOLUTIONS}
                    />
                  )}
                </form.Field>

                <form.Field name="format">
                  {(field) => (
                    <SelectField
                      field={field}
                      id={ids.format}
                      label="File format"
                      placeholder="Select a format"
                      options={FORMATS}
                    />
                  )}
                </form.Field>
              </fieldset>

              {/* Acknowledgment */}
              <fieldset className="space-y-3">
                <legend className="text-sm font-semibold text-foreground mb-2">
                  Acknowledgment
                </legend>
                {ACKNOWLEDGMENTS.map(({ name, label }) => (
                  <form.Field key={name} name={name}>
                    {(field) => (
                      <CheckboxRow field={field}>{label}</CheckboxRow>
                    )}
                  </form.Field>
                ))}
              </fieldset>

              {status === 'error' && (
                <p role="alert" className="text-sm text-destructive">
                  {errorMessage}
                </p>
              )}
            </div>

            <DialogFooter>
              <form.Subscribe
                selector={(state) =>
                  [state.canSubmit, state.isSubmitting] as const
                }
              >
                {([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    disabled={!canSubmit}
                    className="cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2
                          className="size-4 animate-spin"
                          aria-hidden="true"
                        />
                        Sending…
                      </>
                    ) : (
                      'Send request'
                    )}
                  </Button>
                )}
              </form.Subscribe>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

function Field({
  id,
  label,
  required,
  error,
  children,
}: {
  id: string
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {label}
        {required && (
          <span aria-hidden="true" className="text-destructive">
            {' '}
            *
          </span>
        )}
      </Label>
      {children}
      {error && <FieldError id={`${id}-error`} message={error} />}
    </div>
  )
}

function FieldError({ id, message }: { id?: string; message: string }) {
  return (
    <p id={id} className="text-sm text-destructive">
      {message}
    </p>
  )
}

function CheckboxRow({
  field,
  children,
}: {
  field: AnyFieldApi
  children: React.ReactNode
}) {
  const error = touchedError(field)
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-2 text-sm">
        <input
          type="checkbox"
          checked={field.state.value}
          onChange={(e) => commit(field, e.target.checked)}
          className="mt-0.5 size-4 shrink-0 cursor-pointer accent-primary"
        />
        <span>{children}</span>
      </label>
      {error && <FieldError message={error} />}
    </div>
  )
}

// Shared free-text field: controlled value, blur tracking, a hard length cap
// (keyed off the field name), and accessible error wiring.
function TextField({
  field,
  id,
  label,
  required,
  multiline,
  type,
  inputMode,
}: {
  field: AnyFieldApi
  id: string
  label: string
  required?: boolean
  multiline?: boolean
  type?: React.HTMLInputTypeAttribute
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
}) {
  const error = blurredError(field)
  const shared = {
    id,
    value: field.state.value,
    maxLength: MAX_LENGTHS[field.name as TextFieldName],
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? `${id}-error` : undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      field.handleChange(e.target.value),
    onBlur: field.handleBlur,
  }
  return (
    <Field id={id} label={label} required={required} error={error}>
      {multiline ? (
        <Textarea {...shared} />
      ) : (
        <Input type={type} inputMode={inputMode} {...shared} />
      )}
    </Field>
  )
}

function SelectField({
  field,
  id,
  label,
  placeholder,
  options,
}: {
  field: AnyFieldApi
  id: string
  label: string
  placeholder: string
  options: ReadonlyArray<{ value: string; label: string }>
}) {
  const error = touchedError(field)
  return (
    <Field id={id} label={label} required error={error}>
      <Select value={field.state.value} onValueChange={(v) => commit(field, v)}>
        <SelectTrigger
          id={id}
          className="cursor-pointer"
          aria-invalid={error ? true : undefined}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  )
}
