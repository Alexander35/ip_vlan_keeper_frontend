import React from 'react';
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { connect } from "react-redux"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDoorOpen, faUserNinja }from '@fortawesome/free-solid-svg-icons'

class Header extends React.Component {

    render() {
        return(
            <>        
              <Navbar bg="primary" variant="dark">
                <Navbar.Brand className="mr-auto">ip_vlan_keeper</Navbar.Brand>
                <Nav className="mr-sm-2">
                  <Nav.Link eventKey="disabled"> <FontAwesomeIcon icon={faUserNinja} /> { this.props.auth_user }</Nav.Link>
                  <Nav.Link href="/"><FontAwesomeIcon icon={faDoorOpen} /></Nav.Link>
                </Nav>
              </Navbar>
            </>
            )
    }
}

const mapStateToProps = state => {
    return { auth_user: state.user.login,
             auth_token: state.auth.token };
};

export default connect(
    mapStateToProps
)(Header);