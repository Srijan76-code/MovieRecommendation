import React, { useEffect, useState } from 'react'
import Search from './components/Search'
import Loader from './components/Loader'
import MovieCard from './components/MovieCard'
import { useDebounce } from 'react-use'
const App = () => {

  //FIXME: STATE MANAGEMENT:-

  const [searchTerm,setSearchTerm]=useState("")
  const [errorMessage,setErrorMessage]=useState("")
  const [movieList,setMovieList]=useState([])
  const [loading,setLoading]=useState(false)
  const [debounceSearchTerm,setDebounceSearchTerm] =useState("")

  //FIXME: useDebounce HOOK from npm i react-use:-
  useDebounce(()=>setDebounceSearchTerm(searchTerm),500,[searchTerm])

  //TODO: API CALLING $ FETCHING MOVIES:-
   
  const API_BASE_URL="https://api.themoviedb.org/3"  //Initial URL
  const API_KEY=import.meta.env.VITE_TMDB_API_KEY   //API KEY
  const API_OPTIONS={
    method:"GET",
    headers:{
      accept:"application/json",
      Authorization: `Bearer ${API_KEY}`
    }
  }

  //FIXME: fetchingMovies ASYNC FUNCTION:-
  const fetchingMovies=async (query="")=>{
        setLoading(true)   // For LOADING....
        setErrorMessage("")
        try{
          const url= query
          ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` //encodeURIComponent =>So that we can process all types of query...
          : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`
          const response = await fetch(url,API_OPTIONS)
          if (!response.ok){
            throw new Error("Failed to fetch Movies.")
          }

          const data= await response.json()
          if (data.Response=="False"){
            setErrorMessage(data.Error || "Failed to fetch Movies. ")
            setMovieList([])
            return
          }
          console.log(data)
          setMovieList(data.results || [])
          

        }catch(error){
          console.error(`Error fetching Movies: ${error}`)
          setErrorMessage("Error fetching Movies. Please try again later...")
        }finally{
          setLoading(false)  //For Removing the Loading...
        }
  }


  //FIXME: useEffect hook for calling fetchingMovies after every debounceSearchTerm....

  useEffect(()=>{
    fetchingMovies(debounceSearchTerm)
  },[debounceSearchTerm])

  
  return (
    <main>
      <div className="pattern">
        <div className="wrapper">

          
          <header>
            <img src="/hero.png" alt="Hero poster" />
            <h1>Find <span className='text-gradient' >MOVIES</span> You Will Enjoy Without The Hassle</h1>
            <Search  searchTerm={searchTerm} setSearchTerm={setSearchTerm}  />
          </header>


          <section className='all-movies mt-40' >
            <h2>All Movies</h2>

            {loading? (
              <p><Loader/></p>
            ): (errorMessage?(
              <p className='text-red-500 ' >{errorMessage}</p>
            ):(
              <ul>
                {movieList.map((movie)=>(
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul> 
             
            ))
          
          
          
          }

            

          </section>
        </div>
      </div>
    </main>
   
  )
}

export default App
