import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { getAuth } from "firebase/auth"

function Profile() {
  const auth = getAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  })

  const { name, email } = formData

  const onLogout = () => {
    auth.signOut()
    navigate('/')
  }


    return <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button type='button' className="logOut" onClick={onLogout}>Log out</button>
      </header>
    </div>
  }
  
export default Profile