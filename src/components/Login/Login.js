import React from 'react'
import { connect } from "react-redux"
import LoginRequest from '../../app/requests/LoginRequest'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { setAuthToken } from "../../app/actions/setAuthToken"
import { setAuthUser } from "../../app/actions/setAuthUser"

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          login: '',
          password: ''
        };
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onSubmit = (e) => {
        e.preventDefault();
        const { login, password } = this.state;

        LoginRequest(login, password
            ).then( res => {
                        this.props.setAuthUser(login);
                        this.props.setAuthToken(res.token);
                    });
    }

    render() {
        return (
                <>
                <Container fluid>
                    <Row  className="justify-content-md-center">
                        <Col md={2}>
                            <Form onSubmit={this.onSubmit}>
                                <Form.Group controlId="formBasicEmail">
                                    <Form.Label>Login</Form.Label>
                                    <Form.Control name="login" value={this.state.login} placeholder="Login" onChange={this.onChange} />
                                </Form.Group>
                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control name="password" value={this.state.password} type="password" placeholder="Password" onChange={this.onChange} />
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    Enter
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                </Container>
                </>
        )
    } 
};

const mapStateToProps = state => {
    return { auth_token: state.auth.token, auth_user: state.auth.user };
};

export default connect(
    mapStateToProps,
    { setAuthToken, 
    setAuthUser }
)(Login);