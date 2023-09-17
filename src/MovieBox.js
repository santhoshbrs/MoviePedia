import { Modal, Button } from 'react-bootstrap';
import React, { useState, useEffect, useCallback } from 'react';
const API_IMG = "https://image.tmdb.org/t/p/w500/";

const MovieBox = ({
  original_title,
  poster_path,
  vote_average,
  release_date,
  overview,
  id,
}) => {
  const [show, setShow] = useState(false);
  const [trailerKey, setTrailerKey] = useState(null);
  const [topCast, setTopCast] = useState([]);
  const [rating, setRating] = useState(null);
  const [genres, setGenres] = useState([]);
  const [runtime, setRuntime] = useState(null);
  const [director, setDirector] = useState('');

  const handleShow = async () => {
    setShow(true);
    await fetchMovieDetails();
  };

  const handleClose = () => setShow(false);

  // Wrap the definition of fetchMovieDetails in useCallback
  const fetchMovieDetails = useCallback(async () => {
    try {
      const apiKey = '9d807ce80ebbc1c7be889b73af01c8bb';

      // Fetch videos related to the movie using the movie's ID
      const videoResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${apiKey}`
      );
      const videoData = await videoResponse.json();

      // Find the trailer key (assuming the first video is the trailer)
      const trailer = videoData.results.find((video) => video.type === 'Trailer');

      if (trailer) {
        setTrailerKey(trailer.key);
      } else {
        setTrailerKey(null);
      }

      // Fetch the cast details for the movie
      const castResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${apiKey}`
      );
      const castData = await castResponse.json();
      const topCastMembers = castData.cast.slice(0, 5);
      setTopCast(topCastMembers);

      // Set the movie rating
      setRating(vote_average);

      // Fetch genre information
      const genreResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=genres`
      );
      const genreData = await genreResponse.json();
      const movieGenres = genreData.genres.map((genre) => genre.name);
      setGenres(movieGenres);

      // Fetch movie runtime
      setRuntime(genreData.runtime);

      // Fetch director information (if available)
      const crew = castData.crew;
      const directors = crew.filter((crewMember) => crewMember.job === 'Director');
      if (directors.length > 0) {
        setDirector(directors.map((director) => director.name).join(', '));
      } else {
        setDirector('Director information not available');
      }
    } catch (error) {
      console.error('Error fetching movie details:', error);
    }
  }, [id, vote_average]);

  useEffect(() => {
    fetchMovieDetails();
  }, [fetchMovieDetails]);

  return (
    <div className="card text-center bg-secondary mt-4 ms-4 border-0">
      <div className="card-body pt-5 px-5 pb-1  rounded">
        <img className="card-img-top" src={API_IMG + poster_path} alt={original_title} />
        <div className="card-body p-1">
          <h4 className='text-light'>{original_title}</h4>
          <button
            type="button"
            className="btn btn-danger mt-4"
            style={{ backgroundColor: "red" }}
            onClick={handleShow}
          >
            Details
          </button>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header className='bg-black text-light border-0' closeButton>
              <Modal.Title>
                <h3>{original_title}</h3>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className='bg-dark text-light'>
              <img className="card-img-top" style={{ width: '14rem' }} src={API_IMG + poster_path} alt={original_title} />
              <h5 className='mt-2'>Release Date: {release_date}</h5>
              <h5>Rating: {rating}</h5>
              <h5>Genres: {genres.join(', ')}</h5>
              <h5>Runtime: {runtime} minutes</h5>
              <h5>Director(s): {director}</h5>
              <h5>Cast:</h5>
              <ul>
                {topCast.map((actor) => (
                  <li key={actor.id}>{actor.name}</li>
                ))}
              </ul>
              <h5>Overview</h5>
              <p>{overview}</p>
              {trailerKey && (
                <div className="embed-responsive embed-responsive-16by9">
                  <iframe
                    title="Trailer"
                    className="embed-responsive-item"
                    src={`https://www.youtube.com/embed/${trailerKey}`}
                    allowFullScreen
                  ></iframe>
                </div>
              )}
              
            </Modal.Body>
            <Modal.Footer className='bg-black border-0'>
              <Button variant="danger" onClick={handleClose}>Close</Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  )
}

export default MovieBox;
