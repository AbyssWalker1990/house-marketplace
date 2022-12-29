import { useLocation, useNavigate } from "react-router-dom"
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase.config"
import { toast } from "react-toastify"
import googleIcon from '../assets/svg/googleIcon.svg'

function OAuth() {
  const navigate = useNavigate()
  const location = useLocation()

  const onGoogleClick = async () => {
    try {
      const auth = getAuth()
      const provider = new GoogleAuthProvider() 
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      console.log('USER: ', user)

      // Check for user
      const docRef = doc(db, 'users', user.uid)
      console.log('docRef: ', docRef)
      const docSnap = await getDoc(docRef)
      console.log('docSnap: ', docSnap)
      
      // If user doesn't exist, create user
      if (!docSnap.exists()) {
        console.log('IF STARTED')
        await setDoc(doc(db, 'users', user.uid), {
          name: user.displayName,
          email: user.email,
          timestamp: serverTimestamp(),
        })
      }
      navigate('/')
    } catch (error) {
      toast.error('Could nor authorize with Google')
      console.log(error)
    }
  }

  return (
    <div className="socialLogin">
      <p>Sign {location.pathname === '/sign-up' ? 'Up' : 'In'} with</p>
      <button className="socialIconDiv" onClick={onGoogleClick}>
        <img className='socialIconImg' src={googleIcon} alt="google" />
      </button>
    </div>
  )
}

export default OAuth