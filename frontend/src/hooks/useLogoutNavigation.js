import { useNavigate } from 'react-router-dom'

const useLogoutNavigation = () => {
  const navigate = useNavigate()

  return () => {
    navigate('/logout')
  }
}

export default useLogoutNavigation


