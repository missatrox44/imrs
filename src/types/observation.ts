import type { z } from 'zod'
import type { ObservationSchema } from '@/lib/inat'

type Observation = z.infer<typeof ObservationSchema>

export type DisplayObservation = Observation & { atImrs: boolean }
