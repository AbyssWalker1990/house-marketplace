import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { getAuth, updateProfile } from "firebase/auth"
import {db} from '../firebase.config'
import { updateDoc, doc, collection, getDocs, query, orderBy, deleteDoc, where } from "firebase/firestore"
import {toast} from 'react-toastify'
import arrowRight from '../assets/svg/keyboardArrowRightIcon.svg'
import homeIcon from '../assets/svg/homeIcon.svg'
import ListingItem from '../components/ListingItem'

function Profile() {
  const auth = getAuth()
  const navigate = useNavigate()

  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [changeDetails, setChangeDetails] = useState(false)
  const [formData, setFormData] = useState({
    name: auth.currentUser.displayName,
    email: auth.currentUser.email
  })

  useEffect(() => {
    const fetchUserListings = async () => {
      const listingsRef = collection(db, 'listings')
      const q = query(listingsRef, where('userRef', '==', auth.currentUser.uid), orderBy('timestamp', 'desc'))
      console.log(auth.currentUser.uid)
      const querySnap = await getDocs(q)
      let listings = []

      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        })
      })
      setListings(listings)
      setLoading(false)
    }
    fetchUserListings()
  }, [auth.currentUser.uid])

  const { name, email } = formData

  const onLogout = () => {
    auth.signOut()
    navigate('/')
  }

  const onSubmit = async () => {
    try {
      if (auth.currentUser.displayName !== name) {
        // Update name in firebase
        await updateProfile(auth.currentUser, {
          displayName: name
        })
        // Update in firestore
        const userRef = doc(db, 'users', auth.currentUser.uid)
        await updateDoc(userRef, {
          name
        })
      }
    } catch (error) {
      toast.error('Could not update profile details!')
    }
  }

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }))
  }

  const onDelete = async (listingId) => {
    if (window.confirm('Are you sure want to delete?')) {
      await deleteDoc(doc(db, 'listings', listingId))
      const updatedListings = listings.filter((listing) => listing.id !== listingId)
      setListings(updatedListings)
      toast.success('Successfully deleted listing')
    }
  }

  const onEdit = (listingId) => navigate(`/edit-listing/${listingId}`)


    return <div className="profile">
      <header className="profileHeader">
        <p className="pageHeader">My Profile</p>
        <button type='button' className="logOut" onClick={onLogout}>Log out</button>
      </header>
      <main>
        <div className="profileDetailsHeader">
          <p className="profileDetailsText">Personal Details</p>
          <p className="changePersonalDetails" onClick={() => {
            changeDetails && onSubmit()
            setChangeDetails((prevState) => !prevState)
          }}>
            {changeDetails ? 'Done' : 'Change'}
          </p>
        </div>
        <div className="profileCard">
          <input type="text" id="name" 
          className={!changeDetails ? 'profileName' : 'profileNameActive'}
          disabled={!changeDetails} value={name} onChange={onChange} />
          <input type="text" id="email" 
          className={!changeDetails ? 'profileEmail' : 'profileEmailActive'}
          disabled={!changeDetails} value={email} onChange={onChange} />
        </div>
      </main>

      <Link to='/create-listing' className='createListing'>
        <img src={homeIcon} alt="home" />
        <p>Sell or rent your house</p>
        <img src={arrowRight} alt="arrow right" />
      </Link>

      {!loading && listings?.length > 0 && (
        <>
        <p className="listingText">Your Listings</p>
        <ul className="listingsList">
          {listings.map((listing) => (
            <ListingItem key={listing.id} listing={listing.data} 
            id={listing.id} onDelete={() => onDelete(listing.id)} 
            onEdit={() => onEdit(listing.id)}/>
          ))}
        </ul>
        </>
      )}
    </div>
  }
  
export default Profile