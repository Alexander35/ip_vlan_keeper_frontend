import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import UpdateNetwork from '../../app/requests/UpdateNetwork';
import UpdateDevice from '../../app/requests/UpdateDevice';
import UpdateVlan from '../../app/requests/UpdateVlan';
import UpdateIP from '../../app/requests/UpdateIP';
import UpdateDeviceInterface from '../../app/requests/UpdateDeviceInterface';

import Errors from './Errors';

class UpdateItemPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            column_values: {
                Description: '',
                id: '',
                Device: '',
                Gateway: '',
                Broadcast: '',
                Vlan: '',
                Device_interface: '',
                Net: '',
                Name: '',
                Owner: '',
                updated_at: ''
            },
            error_show: false,
            error_data: undefined,
            error_status: undefined,
            error_status_text: undefined
        };
    }

    componentDidMount() {
        this.setValues();
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

    setValues () {

        let column_values = this.props.column_values

        const column_keys = Object.keys(column_values)

        Object.values(column_values).map((value, idx) => {
            if(value instanceof Object)
                column_values[column_keys[idx]] = 'Name' in value ? value.Name : value.username
        })

        this.setState({column_values: this.props.column_values})
    }

    onChange = (e) => {
        if ((e.target.name !== 'created_at') && 
            (e.target.name !== 'updated_at') && 
            !(e.target.value in this.state.column_values))
                this.setState({ column_values: { ...this.state.column_values, [e.target.name]: e.target.value} });
    }

    onUpdateClick = (e) => {

        if(this.props.active_tab === 'net') {
            UpdateNetwork(this.state.column_values['Name'],
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
                            else
                                this.props.onClick()
                    });
        }
        if(this.props.active_tab === 'ip') {
            UpdateIP(this.state.column_values['Name'],
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
            UpdateVlan(this.state.column_values['Name'],
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
            UpdateDevice(this.state.column_values['Name'],
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
            UpdateDeviceInterface(this.state.column_values['Name'],
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
                  (property !== 'updated_at')  ) {
                if(property in this.props.all_item_names && (property !== 'Owner' ) && (property !== 'Network')) {
                     let names = []

                     names.push(<option key={property} >{property}</option>)

                     this.props.all_item_names[property].map( (name) => {
                        names.push(<option key={name} >{name}</option>)
                     } )

                     properties_list.push(
                        <td key={property}>
                            <Form.Control
                                as="select"
                                name={property}
                                placeholder={property}
                                onChange={this.onChange}
                                value={this.state.column_values[property]}
                            >
                                    {names}
                            </Form.Control>
                        </td>
                        )
                }
                else
                  if((property === 'Name') || 
                     (property === 'Owner' ) || 
                     (property === 'Gateway' ) || 
                     (property === 'Broadcast' ) ||
                     (property === 'Network' ))
                      properties_list.push(<td key={property}><Form.Control plaintext readOnly defaultValue={this.state.column_values[property]} /></td>)
                  else
                      properties_list.push(
                            <td key={property}>
                                <Form.Control 
                                    name={property}
                                    value={this.state.column_values[property]}
                                    placeholder={property}
                                    onChange={this.onChange}
                                />
                            </td>
                       )}})

        return (
                properties_list
            )
    }

    render() {

        if (this.props.column_names.length !==0 )
            return (
                <>
                      {this.getItemPropertiesList()}
                  <td key={this.props.column_names[0]}>
                      <Button variant="light" onClick={this.onUpdateClick}>
                          Save
                      </Button>
                  </td>
                  <td>
                        {this.showError()}
                  </td>
 
                </>
                )
        else 
            return (<></>)
    }
}

export default UpdateItemPanel;
