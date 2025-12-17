import { useMutation, useQueryClient } from '@tanstack/react-query'
import { logout } from '../lib/api.js'

export const useLogout = () => {
  const queryClient = useQueryClient()
  const { mutate: logoutMutation } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries(['authUser'])
    }
  })
  return { logoutMutation }
}
