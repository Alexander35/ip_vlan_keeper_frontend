import React from 'react';
import Alert from 'react-bootstrap/Alert';

class Errors extends React.Component {
    render() {
        let error = []

        error.push(<Alert 
                        key={this.props.error_status_text}
                        variant="danger"
                        onClose={this.props.onClose}
                        dismissible
                    >
                    <Alert.Heading>{this.props.error_status} :: {this.props.error_status_text}</Alert.Heading>
                      <p>
                        {this.props.error_data}
                      </p>
                    </Alert>)

        return (
            <>
            {error}
            </>
        )
    }
}

export default Errors;