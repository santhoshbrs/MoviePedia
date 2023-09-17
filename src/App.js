import React, { useState, useEffect } from 'react';
import './App.css';
import MovieBox from './MovieBox';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Navbar, Container, Nav, Form, FormControl, Button, Row, Col } from 'react-bootstrap';
import logo from './logo.png';
import Footer from './Footer'

const API_URL = "https://api.themoviedb.org/3/movie/popular?api_key=9d807ce80ebbc1c7be889b73af01c8bb";
/* const API_SEARCH = "https://api.themoviedb.org/3/search/movie?api_key=9d807ce80ebbc1c7be889b73af01c8bb&query"; */

function App() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then(data => {
        console.log(data);
        setMovies(data.results);
        
      })
  }, [])

  const searchMovie = async (e) => {
    e.preventDefault();
    console.log("Searching");
    try {
      const url = `https://api.themoviedb.org/3/search/movie?api_key=bcc4ff10c2939665232d75d8bf0ec093&query=${query}`;
      const res = await fetch(url);
      const data = await res.json();
      console.log(data);
      setMovies(data.results);
    } catch (e) {
      console.log(e);
    }
  }

  const changeHandler = (e) => {
    setQuery(e.target.value);
  }

  return (
    <>
      <Navbar className='header' bg="black" expand="lg" variant="dark">
        <Container fluid>
          <Navbar.Brand href="/home">
            <img 
              src={logo}
              width="300"
              height="80"
              className="d-inline-block align-top rounded-"
              alt="Your Brand Logo"
            />
          </Navbar.Brand>
          <div className="d-flex align-items-center text-light">
           
              <h1 style={{marginLeft:"350px"}}><kbd className='trending'>TRENDING</kbd></h1>
            
          </div>
          <Navbar.Toggle aria-controls="navbarScroll" className='bg-dark'/>
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-3"
              style={{ maxHeight: '100px' }}
              navbarScroll
            ></Nav>
            <Form className="d-flex" onSubmit={searchMovie} autoComplete="off">
              <FormControl
                type="search"
                placeholder="Movie Search"
                className="me-2"
                aria-label="search"
                name="query"
                value={query} onChange={changeHandler}
              ></FormControl>
              <Button
                className='border-0'
                style={{ backgroundColor: "red" }}
                type="submit"
              >Search</Button>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container fluid>
        <Row xs={1} sm={2} md={2} lg={4} xl={4} className="mx-0 my-5">
          {movies.map((movieReq) => (
            <Col key={movieReq.id}>
              <MovieBox {...movieReq} />
            </Col>
          ))}
        </Row>
      </Container>
      <Footer />
    </>
  );
}

export default App;
