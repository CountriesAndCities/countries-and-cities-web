import { useNavigate, useParams } from 'react-router-dom'
import { useEffect } from 'react'

export function useFetchCountry(store: { fetchCountry: (p: string) => void }) {
  const { id } = useParams<'id'>()

  useEffect(() => {
    id && store.fetchCountry(id)
  }, [id])

  return id
}

export function useFetchCountryOrRedirect(store: { fetchCountry: (p: string) => void }) {
  const navigate = useNavigate()

  const id = useFetchCountry(store)

  if (!id) {
    navigate('/')
    return null
  }
}
