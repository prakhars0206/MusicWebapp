'use client';

import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';

function NavBar({ onSearch, resetToPopular  }) {

    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm) return;

        try {
            const response = await fetch(`https://musicwebapp-bg57.onrender.com/api/search?query=${encodeURIComponent(searchTerm)}`, {
                method: 'GET',
            });
    

            if (response.ok) {
                const data = await response.json();
                onSearch(data);
            } else {
                console.error('Failed to fetch search results');
            }
            } catch (error) {
            console.error('Error during search:', error);
        }
    };

  return (
    <Navbar expand="lg" className="bg-body-tertiary" bg="dark" data-bs-theme="dark">
      <Container fluid>
        <Navbar.Brand className="" href="#" onClick={resetToPopular}>
          Xplore Music
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <div className="d-flex w-100 position-relative">
            {/* Centered Search Bar */}
            <div
              className="position-absolute top-50 start-50 translate-middle"
              style={{ width: '600px' }}
            >
              <Form className="d-flex" onSubmit={handleSearch}>
                <Form.Control
                  type="search"
                  placeholder="Search for an Artist"
                  className="me-2"
                  aria-label="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}

                  style={{ flexGrow: 1 }} 
                />
                <Button variant="outline-success" type="submit">Search</Button>
              </Form>
            </div>

            {/* Links on the Right */}
            <Nav className="ms-auto">
              <Nav.Link href="#login">Login</Nav.Link>
              {/* <Nav.Link href="#link">Link</Nav.Link>
              <NavDropdown title="Link" id="navbarScrollingDropdown">
                <NavDropdown.Item href="#action3">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action4">Another action</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action5">Something else here</NavDropdown.Item>
              </NavDropdown>
              <Nav.Link href="#" disabled>
                Disabled
              </Nav.Link> */}
            </Nav>
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
