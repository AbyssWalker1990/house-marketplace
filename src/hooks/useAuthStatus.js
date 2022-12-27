import  { useEffect, useState } from 'react'
import { Auth, getAuth, onAuthStateChanged } from 'firebase/auth'

export const useAuthStatus = () => {
  const [loggedIn, setloggedIn] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)

  useEffect(() => {
    const auth = getAuth()
    onAuthStateChanged(auth, (user) => {
      if (user){
        setloggedIn(true)
      }
      setCheckingStatus(false)
    })
  }, [])

  return {loggedIn, checkingStatus}
}
