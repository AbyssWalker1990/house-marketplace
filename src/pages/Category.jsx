import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { collection, getDocs, query, orderBy, limit, where, startAfter } from "firebase/firestore"
import { db } from "../firebase.config"
import { toast } from "react-toastify"
import Spinner from "../components/Spinner"


function Category() {
  const [listings, setListings] = useState(null)
  const [loading, setLoading] = useState(true)

  const params = useParams()

  useEffect(() => {
    const fetchListings = async () => {

    }
    fetchListings()
  }, [])

  return (
    <div>Category</div>
  )
}

export default Category