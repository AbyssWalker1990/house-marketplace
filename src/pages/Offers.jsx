import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { collection, getDocs, query, orderBy, limit, where, startAfter } from "firebase/firestore"
import { db } from "../firebase.config"
import { toast } from "react-toastify"
import Spinner from "../components/Spinner"
import ListingItem from "../components/ListingItem"


function Offers() {
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastFetchedListing, setLastFetchedListing] = useState(null)

  const params = useParams()

  useEffect(() => {
    const fetchListings = async () => {
      try {
        // Make reference to listings table
        const listingsRef = collection(db, 'listings')

        // Create a query
        const q = query(listingsRef, where('offer', '==', true),
          orderBy('timestamp', 'desc'), limit(1))

        const querySnap = await getDocs(q)

        const lastVisible = querySnap.docs[querySnap.docs.length - 1]
        setLastFetchedListing(lastVisible)

        const listings = []
        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data(),
          })
        })
        setListings(listings)
        setLoading(false)
      } catch (error) {
        toast.error('Couldnt fetch listings')
      }
    }
    fetchListings()
  }, [])

  // Fetch more / pagination
  const onFetchMoreListings = async () => {
    try {
      // Make reference to listings table
      const listingsRef = collection(db, 'listings')

      // Create a query
      const q = query(listingsRef, where('offer', '==', true),
        orderBy('timestamp', 'desc'), startAfter(lastFetchedListing), limit(1))

      const querySnap = await getDocs(q)

      const lastVisible = querySnap.docs[querySnap.docs.length - 1]
      setLastFetchedListing(lastVisible)
      
      const listings = []
      querySnap.forEach((doc) => {
        return listings.push({
          id: doc.id,
          data: doc.data(),
        })
      })
      setListings((prevState) => [...prevState, ...listings])
      setLoading(false)
    } catch (error) {
      console.log(error)
      toast.error('Couldnt fetch listings')
    }
  }

  return (
    <div className="category">
      <header>
        <p className="pageHeader">
          Offers
        </p>
      </header>
      {loading ? <Spinner /> : listings && listings.length > 0 ?
        (<>
          <main>
            <ul className="categoryListings">
              {listings.map((listing) => (
                <ListingItem key={listing.id} listing={listing.data} id={listing.id} />
              ))}
            </ul>
          </main>
          <br />
          <br />
          {lastFetchedListing && (
            <p className="loadMore" onClick={onFetchMoreListings}>Load More</p>
          )}
        </>) : <p>There are no offers</p>}
    </div>
  )
}

export default Offers