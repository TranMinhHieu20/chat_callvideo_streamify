import { useMutation, useQueryClient } from '@tanstack/react-query'
import { login } from '../lib/api.js'

export const useLogin = () => {
  const queryClient = useQueryClient()
  const {
    mutate: loginMutation,
    error,
    isPending
  } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries(['authUser'])
    }
  })
  return { loginMutation, error, isPending }
}
