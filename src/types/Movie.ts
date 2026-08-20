export interface Movie {
  imdbID: string
  Title: string
  Year: string
  Type: string
  Poster: string
}

export interface OmdbSearchResponse {
  Search?: Movie[]
  Response: 'True' | 'False'
  Error?: string
}
