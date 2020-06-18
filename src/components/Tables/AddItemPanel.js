import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

import AddNetwork from '../../app/requests/AddNetwork';
import AddIpPool from '../../app/requests/AddIpPool';
import AddDevice from '../../app/requests/AddDevice';
import AddVlan from '../../app/requests/AddVlan';
import AddIP from '../../app/requests/AddIP';
import AddDeviceInterface from '../../app/requests/AddDeviceInterface';

import Errors from './Errors';

class AddItemPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            column_values: {
                Name: '',
                Description: '',
                id: '',
                Device: '',
                Gateway: '',
                Broadcast: '',
                Vlan: '',
                Device_interface: '',
                Network: '',
                Owner: '',
                updated_at: ''
            },

            error_show: false,
            error_data: undefined,
            error_status: undefined,
            error_status_text: undefined
        };
    }

    showError() {
        let error = []

        if(this.state.error_show)
            error.push(<Errors key={this.state.error_status_text} onClose={this.onErrorClose.bind(this)}
                        error_show={this.state.error_show}
                        error_status_text={this.state.error_status_text}
                        error_data={this.state.error_data}
                        error_status={this.state.error_status}
                       />)
        return (
                <>
                    {error}
                </>
            )
    }

    onErrorClose() {
        this.setState({error_show: false})
    }


    onChange = (e) => {
        if ((e.target.name !== 'created_at') && 
            (e.target.name !== 'updated_at') && 
            !(e.target.value in this.state.column_values))
                this.setState({ column_values:
                    { ...this.state.column_values,
                        [e.target.name]: e.target.value} });
    }

    onAddClick = (e) => {
        if(this.props.active_tab === 'pool') {
            AddIpPool(this.state.column_values['Name'],
                this.state.column_values['Description'],
                this.props.auth_user,
                this.props.auth_token
                ).then( res => {
                            if('response' in res)
                                this.setState({error_show: true,
                                        error_data: JSON.stringify(res.response.data),
                                        error_status: res.response.status,
                                        error_status_text: res.response.statusText})
                            this.props.onClick()
                    });
        }
        if(this.props.active_tab === 'net') {
            AddNetwork(this.state.column_values['Name'],
                this.state.column_values['Gateway'],
                this.state.column_values['Vlan'],
                this.state.column_values['Device_interface'],
                this.state.column_values['Description'],
                this.props.auth_user,
                this.props.auth_token
                ).then( res => {
                            if('response' in res)
                                this.setState({error_show: true,
                                        error_data: JSON.stringify(res.response.data),
                                        error_status: res.response.status,
                                        error_status_text: res.response.statusText})
                            this.props.onClick()
                        
                    });
        }
        if(this.props.active_tab === 'ip') {
            AddIP(this.state.column_values['Name'],
                this.props.network_filter === 'all' ? this.state.column_values['Network'] : this.props.network_filter,
                this.state.column_values['Device_interface'],
                this.state.column_values['Description'],
                this.props.auth_token
                ).then( res => {
                            if('response' in res)
                                this.setState({error_show: true,
                                        error_data: JSON.stringify(res.response.data),
                                        error_status: res.response.status,
                                        error_status_text: res.response.statusText})
                            else
                                this.props.onClick()
                        
                    });
        }
        if(this.props.active_tab === 'vlan') {
            AddVlan(this.state.column_values['Name'],
                this.state.column_values['Description'],
                this.props.auth_user,
                this.props.auth_token
                ).then( res => {
                        if('response' in res)
                            this.setState({error_show: true,
                                        error_data: JSON.stringify(res.response.data),
                                        error_status: res.response.status,
                                        error_status_text: res.response.statusText})
                        else
                            this.props.onClick()
                        
                    });
        }
        if(this.props.active_tab === 'device') {
            AddDevice(this.state.column_values['Name'],
                this.state.column_values['Description'],
                this.props.auth_token
                ).then( res => {
                            if('response' in res)
                                this.setState({error_show: true,
                                        error_data: JSON.stringify(res.response.data),
                                        error_status: res.response.status,
                                        error_status_text: res.response.statusText})
                            else
                                this.props.onClick()
                    });
            
        }
        if(this.props.active_tab === 'device_interface') {
            AddDeviceInterface(this.state.column_values['Name'],
                this.state.column_values['Device'],
                this.state.column_values['Description'],
                this.props.auth_user,
                this.props.auth_token
                ).then( res => {
                            if('response' in res)
                                this.setState({error_show: true,
                                        error_data: JSON.stringify(res.response.data),
                                        error_status: res.response.status,
                                        error_status_text: res.response.statusText})
                            else
                                this.props.onClick()
                    });
        }
    }

    getItemPropertiesList() {
        let properties_list = []

        if (this.props.column_names.length !==0 )
            this.props.column_names.map( (property) => {
              if ((property !== 'created_at') && 
                    (property !== 'updated_at') && 
                     (property !== 'Owner') &&
                     (property !== 'Broadcast') &&
                     (property !== 'First') &&
                     (property !== 'Last')) {

                if((this.props.free_ips_by_network !== undefined) &&
                   (this.props.network_filter !== 'all') &&
                   (property === 'Network')) {

                    properties_list.push(
                        <Col key={property}>
                            <Form.Control plaintext readOnly value={this.props.network_filter} />
                        </Col>
                    )
                }
                else
                if((this.props.free_ips_by_network !== undefined) &&
                   (this.props.active_tab === 'ip') &&
                   (this.props.network_filter !== 'all') &&
                   (property === 'Name')) {

                    let names = []

                    names.push(<option key={property} >Free IPs Addresses</option>)

                    this.props.free_ips_by_network.map( (name) => {
                        names.push(<option key={name} >{name}</option>)
                    } )

                    properties_list.push(
                        <Col key={property}>
                            <Form.Control
                                as="select"
                                name={property}
                                placeholder={property}
                                onChange={this.onChange}
                                value={this.state.column_values[property]}
                            >
                                    {names}
                            </Form.Control>
                        </Col>
                    )
                }
                else
                if(property in this.props.all_item_names) {
                     let names = []

                     names.push(<option key={property} >{property}</option>)

                     this.props.all_item_names[property].map( (name) => {
                        names.push(<option key={name} >{name}</option>)
                     } )

                     properties_list.push(
                        <Col key={property}>
                            <Form.Control
                                as="select"
                                name={property}
                                placeholder={property}
                                onChange={this.onChange}
                                value={this.state.column_values[property]}
                            >
                                    {names}
                            </Form.Control>
                        </Col>
                        )
                }
                else
                {
                  properties_list.push(
                        <Col key={property}>
                            <Form.Control 
                                name={property}
                                value={this.state.column_values[property]}
                                placeholder={property}
                                onChange={this.onChange}
                            />
                        </Col>
                   )
                }
              }
          }
        )

        return (
                properties_list
            )
    }

    render() {
        if (this.props.column_names.length !==0 )
            return (
                <>
                <Container>
                <Row>
                    {this.showError()}

                </Row>
                <Form>
                  <Row>
                      <Form.Label><b>Add New Item</b></Form.Label>
                  </Row>
                  <Row>
                      {this.getItemPropertiesList()}
                      <Button variant="light" onClick={this.onAddClick}>
                            Add
                      </Button>
                  </Row>
                </Form>
                </Container>
                </>
                )
        else 
            return (<></>)
    }
}

export default AddItemPanel;
