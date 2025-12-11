export interface Observation {
  id: number;
  species_guess?: string;
  user?: {
    login: string;
  };
  observed_on_string?: string;
  photos?: Array<{
    url: string;
  }>;
  place_guess?: string;
  uri?: string;
}