import { useId, useState } from 'react'
import { z } from 'zod'
import { Download } from 'lucide-react'
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

type TextField = keyof typeof MAX_LENGTHS

type FieldErrors = Partial<Record<string, string>>

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

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'

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
  const [values, setValues] = useState(initialValues)
  const [touched, setTouched] = useState<Record<string, boolean>>({})
  const [status, setStatus] = useState<SubmitStatus>('idle')

  const parsed = requestSchema.safeParse(values)
  const isValid = parsed.success

  const fieldErrors: FieldErrors = {}
  if (!parsed.success) {
    for (const issue of parsed.error.issues) {
      const key = issue.path[0]
      if (typeof key === 'string' && !fieldErrors[key]) {
        fieldErrors[key] = issue.message
      }
    }
  }

  // Only surface an error once the user has interacted with the field.
  function errorFor(field: string) {
    return touched[field] ? fieldErrors[field] : undefined
  }

  function setField<TKey extends keyof typeof initialValues>(
    key: TKey,
    value: (typeof initialValues)[TKey],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  function markTouched(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  function toggleVariable(variable: string) {
    setValues((prev) => ({
      ...prev,
      variables: prev.variables.includes(variable)
        ? prev.variables.filter((v) => v !== variable)
        : [...prev.variables, variable],
    }))
  }

  // Shared props for free-text inputs: controlled value, touch tracking,
  // a hard length cap, and accessible error wiring.
  function textProps(field: TextField) {
    const error = errorFor(field)
    return {
      id: ids[field],
      value: values[field],
      maxLength: MAX_LENGTHS[field],
      'aria-invalid': error ? true : undefined,
      'aria-describedby': error ? `${ids[field]}-error` : undefined,
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => setField(field, e.target.value),
      onBlur: () => markTouched(field),
    }
  }

  function resetForm() {
    setValues(initialValues)
    setTouched({})
    setStatus('idle')
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    if (!parsed.success) return

    const formId = import.meta.env.VITE_FORMSPREE_FORM_ID
    if (!formId) {
      setStatus('error')
      return
    }

    setStatus('submitting')
    try {
      const response = await fetch(`https://formspree.io/f/${formId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          ...parsed.data,
          station: 'Hill Station — Indio Mountains Research Station',
          submittedAt: new Date().toISOString(),
        }),
      })
      if (!response.ok) throw new Error('Request failed')
      setStatus('success')
      setValues(initialValues)
      setTouched({})
    } catch {
      setStatus('error')
    }
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
        <Button variant="outline" size="sm" className="cursor-pointer">
          <Download className="size-4" aria-hidden="true" />
          Request raw weather data
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Request raw weather data</DialogTitle>
          <DialogDescription>
            Tell us a bit about you and the data you need. We&rsquo;ll follow up
            by email.
          </DialogDescription>
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
          <form onSubmit={handleSubmit} noValidate className="contents">
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8">
              {/* Requester */}
              <fieldset className="space-y-4">
                <legend className="text-sm font-semibold text-foreground mb-2">
                  Requester
                </legend>
                <Field
                  id={ids.fullName}
                  label="Full name"
                  required
                  error={errorFor('fullName')}
                >
                  <Input {...textProps('fullName')} />
                </Field>
                <Field
                  id={ids.email}
                  label="Email"
                  required
                  error={errorFor('email')}
                >
                  <Input type="email" inputMode="email" {...textProps('email')} />
                </Field>
                <Field
                  id={ids.organization}
                  label="Organization / institution"
                  error={errorFor('organization')}
                >
                  <Input {...textProps('organization')} />
                </Field>
                <Field
                  id={ids.role}
                  label="Role"
                  required
                  error={errorFor('role')}
                >
                  <Select
                    value={values.role}
                    onValueChange={(v) => {
                      setField('role', v)
                      markTouched('role')
                    }}
                  >
                    <SelectTrigger
                      id={ids.role}
                      className="cursor-pointer"
                      aria-invalid={errorFor('role') ? true : undefined}
                    >
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map((r) => (
                        <SelectItem key={r.value} value={r.value}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                {values.role === 'student' && (
                  <Field
                    id={ids.pi}
                    label="Major professor / PI"
                    error={errorFor('pi')}
                  >
                    <Input {...textProps('pi')} />
                  </Field>
                )}
                {values.role === 'other' && (
                  <Field
                    id={ids.roleOther}
                    label="Please specify your role"
                    error={errorFor('roleOther')}
                  >
                    <Input {...textProps('roleOther')} />
                  </Field>
                )}
              </fieldset>

              {/* Use */}
              <fieldset className="space-y-4">
                <legend className="text-sm font-semibold text-foreground mb-2">
                  Use
                </legend>
                <Field
                  id={ids.purpose}
                  label="Purpose"
                  required
                  error={errorFor('purpose')}
                >
                  <Select
                    value={values.purpose}
                    onValueChange={(v) => {
                      setField('purpose', v)
                      markTouched('purpose')
                    }}
                  >
                    <SelectTrigger
                      id={ids.purpose}
                      className="cursor-pointer"
                      aria-invalid={errorFor('purpose') ? true : undefined}
                    >
                      <SelectValue placeholder="Select a purpose" />
                    </SelectTrigger>
                    <SelectContent>
                      {PURPOSES.map((p) => (
                        <SelectItem key={p.value} value={p.value}>
                          {p.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field
                  id={ids.description}
                  label="Brief description of how the data will be used"
                  required
                  error={errorFor('description')}
                >
                  <Textarea {...textProps('description')} />
                </Field>
                <fieldset>
                  <legend className="text-sm font-medium mb-2">
                    Will results be published?
                    <span aria-hidden="true" className="text-destructive">
                      {' '}
                      *
                    </span>
                  </legend>
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
                          checked={values.published === option}
                          onChange={() => {
                            setField('published', option)
                            markTouched('published')
                          }}
                          className="size-4 cursor-pointer accent-primary"
                        />
                        {option === 'yes' ? 'Yes' : 'No'}
                      </label>
                    ))}
                  </div>
                  {errorFor('published') && (
                    <FieldError message={errorFor('published')!} />
                  )}
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
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {VARIABLES.map((variable) => (
                      <label
                        key={variable}
                        className="flex cursor-pointer items-center gap-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={values.variables.includes(variable)}
                          onChange={() => {
                            toggleVariable(variable)
                            markTouched('variables')
                          }}
                          className="size-4 cursor-pointer accent-primary"
                        />
                        {variable}
                      </label>
                    ))}
                  </div>
                  {errorFor('variables') && (
                    <FieldError message={errorFor('variables')!} />
                  )}
                </fieldset>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    id={ids.startDate}
                    label="Start date"
                    required
                    error={errorFor('startDate')}
                  >
                    <Input type="date" {...textProps('startDate')} />
                  </Field>
                  <Field
                    id={ids.endDate}
                    label="End date"
                    required
                    error={errorFor('endDate')}
                  >
                    <Input type="date" {...textProps('endDate')} />
                  </Field>
                </div>

                <Field
                  id={ids.resolution}
                  label="Temporal resolution"
                  required
                  error={errorFor('resolution')}
                >
                  <Select
                    value={values.resolution}
                    onValueChange={(v) => {
                      setField('resolution', v)
                      markTouched('resolution')
                    }}
                  >
                    <SelectTrigger
                      id={ids.resolution}
                      className="cursor-pointer"
                      aria-invalid={errorFor('resolution') ? true : undefined}
                    >
                      <SelectValue placeholder="Select a resolution" />
                    </SelectTrigger>
                    <SelectContent>
                      {RESOLUTIONS.map((r) => (
                        <SelectItem key={r.value} value={r.value}>
                          {r.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>

                <Field
                  id={ids.format}
                  label="File format"
                  required
                  error={errorFor('format')}
                >
                  <Select
                    value={values.format}
                    onValueChange={(v) => {
                      setField('format', v)
                      markTouched('format')
                    }}
                  >
                    <SelectTrigger
                      id={ids.format}
                      className="cursor-pointer"
                      aria-invalid={errorFor('format') ? true : undefined}
                    >
                      <SelectValue placeholder="Select a format" />
                    </SelectTrigger>
                    <SelectContent>
                      {FORMATS.map((f) => (
                        <SelectItem key={f.value} value={f.value}>
                          {f.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </fieldset>

              {/* Acknowledgment */}
              <fieldset className="space-y-3">
                <legend className="text-sm font-semibold text-foreground mb-2">
                  Acknowledgment
                </legend>
                <CheckboxRow
                  checked={values.ackCite}
                  onChange={(c) => {
                    setField('ackCite', c)
                    markTouched('ackCite')
                  }}
                  error={errorFor('ackCite')}
                >
                  I agree to cite / acknowledge the Indio Mountains Research
                  Station in any resulting publication.
                </CheckboxRow>
                <CheckboxRow
                  checked={values.ackShare}
                  onChange={(c) => {
                    setField('ackShare', c)
                    markTouched('ackShare')
                  }}
                  error={errorFor('ackShare')}
                >
                  I agree to share a copy of any resulting publications.
                </CheckboxRow>
                <CheckboxRow
                  checked={values.ackAsIs}
                  onChange={(c) => {
                    setField('ackAsIs', c)
                    markTouched('ackAsIs')
                  }}
                  error={errorFor('ackAsIs')}
                >
                  I understand the data is provided &ldquo;as is,&rdquo; with no
                  warranty.
                </CheckboxRow>
                <CheckboxRow
                  checked={values.consent}
                  onChange={(c) => {
                    setField('consent', c)
                    markTouched('consent')
                  }}
                  error={errorFor('consent')}
                >
                  I consent to the above (a timestamp will be recorded with this
                  request).
                </CheckboxRow>
              </fieldset>

              {status === 'error' && (
                <p role="alert" className="text-sm text-destructive">
                  Something went wrong sending your request. Please try again
                  later.
                </p>
              )}
            </div>

            <DialogFooter>
              <Button
                type="submit"
                disabled={status === 'submitting' || !isValid}
                className="cursor-pointer"
              >
                {status === 'submitting' ? 'Sending…' : 'Send request'}
              </Button>
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
  checked,
  onChange,
  error,
  children,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-2 text-sm">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 size-4 shrink-0 cursor-pointer accent-primary"
        />
        <span>{children}</span>
      </label>
      {error && <FieldError message={error} />}
    </div>
  )
}
