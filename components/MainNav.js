import {
  Button,
  Container,
  Form,
  Nav,
  NavDropdown,
  Navbar,
} from 'react-bootstrap'
import { readToken, removeToken } from '../lib/authenticate'

import Link from 'next/link'
import { addToHistory } from '../lib/userData'
import { searchHistoryAtom } from '../store'
import { useAtom } from 'jotai'
import { useRouter } from 'next/router'
import { useState } from 'react'

export default function MainNav() {
  const [searchField, setSearchField] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom)

  const router = useRouter()
  const [token] = useState(readToken())

  async function submitForm(e) {
    e.preventDefault()

    if (searchField != '') {
      router.push(`/artwork?title=true&q=${searchField}`)
      setSearchField('')
      setIsExpanded(false)
      setSearchHistory(await addToHistory(`title=true&q=${searchField}`))
    }
  }

  function logout() {
    setIsExpanded(false)
    removeToken()
    router.push('/login')
  }

  return (
    <>
      <Navbar
        expand="lg"
        className="fixed-top navbar-dark bg-primary"
        expanded={isExpanded}
      >
        <Container>
          <Navbar.Brand>Mrinaal Nagpal</Navbar.Brand>
          <Navbar.Toggle
            aria-controls="basic-navbar-nav"
            onClick={() => setIsExpanded((e) => !e)}
          />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link href="/" passHref>
                <Nav.Link
                  active={router.pathname === '/'}
                  onClick={() => setIsExpanded(false)}
                >
                  Home
                </Nav.Link>
              </Link>
              {token && (
                <Link href="/search" passHref>
                  <Nav.Link
                    active={router.pathname === '/search'}
                    onClick={() => setIsExpanded(false)}
                  >
                    Advanced Search
                  </Nav.Link>
                </Link>
              )}
            </Nav>
            {!token && (
              <Nav>
                <Link href="/register" passHref>
                  <Nav.Link
                    active={router.pathname === '/register'}
                    onClick={() => setIsExpanded(false)}
                  >
                    Register
                  </Nav.Link>
                </Link>
                <Link href="/login" passHref>
                  <Nav.Link
                    active={router.pathname === '/login'}
                    onClick={() => setIsExpanded(false)}
                  >
                    Log In
                  </Nav.Link>
                </Link>
              </Nav>
            )}
            &nbsp;
            {token && (
              <Form className="d-flex" onSubmit={submitForm}>
                <Form.Control
                  type="search"
                  placeholder="Search"
                  className="me-2"
                  aria-label="Search"
                  value={searchField}
                  onChange={(e) => setSearchField(e.target.value)}
                />
                <Button type="submit" variant="success">
                  Search
                </Button>
              </Form>
            )}
            &nbsp;
            <Nav>
              {token && (
                <NavDropdown title={token.userName} id="basic-nav-dropdown">
                  <Link href="/favourites" passHref>
                    <NavDropdown.Item
                      active={router.pathname === '/favourites'}
                      onClick={() => setIsExpanded(false)}
                    >
                      Favourites
                    </NavDropdown.Item>
                  </Link>

                  <Link href="/history" passHref>
                    <NavDropdown.Item
                      active={router.pathname === '/history'}
                      onClick={() => setIsExpanded(false)}
                    >
                      Search History
                    </NavDropdown.Item>
                  </Link>

                  <NavDropdown.Item onClick={() => logout()}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <br />
      <br />
      <br />
    </>
  )
}
