import type { z } from 'zod'
import type { ObservationSchema } from '@/lib/inat'

export type Observation = z.infer<typeof ObservationSchema>

export type DisplayObservation = Observation & { atImrs: boolean }
