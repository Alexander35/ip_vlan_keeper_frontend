import React from 'react';
import { connect } from "react-redux"
import Table from 'react-bootstrap/Table';
import Moment from 'moment';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Nav from 'react-bootstrap/Nav';

import DeleteNetwork from '../../app/requests/DeleteNetwork';
import DeleteIP from '../../app/requests/DeleteIP';
import DeleteVlan from '../../app/requests/DeleteVlan';
import DeleteDevice from '../../app/requests/DeleteDevice';
import DeleteDeviceInterface from '../../app/requests/DeleteDeviceInterface';
import GetIPsByNetwork from '../../app/requests/GetIPsByNetwork';
import GetFreeIPsByNetwork from '../../app/requests/GetFreeIPsByNetwork';

import AddItemPanel from './AddItemPanel';
import UpdateItemPanel from './UpdateItemPanel';

class TableBody extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          show_nested_key: undefined,
          update_item: undefined,
          update_item_panel_active_tab: undefined,
          network_filter: "all",
          filtered_data: [],
          free_ips_by_network: []
        };
    }

    stringToColour(str) {
      let hash = 0
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      let colour = '#'
      for (let i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xFF
        colour += ('00' + value.toString(16)).substr(-2);
      }
      return colour
    }

    invertColor(hex) {
        function padZero(str, len) {
            len = len || 2;
            var zeros = new Array(len).join('0');
            return (zeros + str).slice(-len);
        }

        if (hex.indexOf('#') === 0) {
            hex = hex.slice(1);
        }
        if (hex.length === 3) {
            hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
        }
        var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
            g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
            b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
        return '#' + padZero(r) + padZero(g) + padZero(b);
    }

    formatRow(row_name, row_data, row_key) {

        if ((row_name === "created_at") || (row_name === "updated_at")) {
            return Moment(row_data).format('YYYY MMMM DD  HH:mm')
        }

        if(row_name === "Description" && ((row_data === "Gateway") || (row_data === "Broadcast") || (row_data === "Network"))) 
        {
               return (<b style={{backgroundColor: "blue", color:"white"}}> {row_data} </b>)
        }

        if(row_data instanceof Object) {
            if(row_key === this.state.show_nested_key) {

                const keys = Object.keys(row_data)
                const values = Object.values(row_data)

                let listgroup = []

                keys.map((key, index) => {
                    listgroup.push(<ListGroup.Item key={key}>{key}: {this.formatRow(key,values[index],undefined)}</ListGroup.Item>)
                })

                return (
                        <Card style={{fontSize: '.8em'}}>
                          <ListGroup variant="flush">
                            {listgroup}
                          </ListGroup>
                        </Card>
                    )
            }
            else {
                let column = row_data

                if('Name' in  row_data)
                {
                    if(row_name === "Network")
                    {
                        column = <b style={{backgroundColor:this.invertColor(this.stringToColour(row_data.Name)), 
                                            color: this.stringToColour(row_data.Name)}}>{row_data.Name}</b>
                    }
                    else
                    
                        column = row_data.Name
                }
                else 
                    if('username' in  row_data) 
                        column = row_data.username
               
                return column
            }
        }

        return row_data        
    }

    getNetworkFilter() {
        let network_filter = []
        let network_tabs =[]

        if(this.props.active_tab === "ip")
        {
            network_tabs.push(
              <Nav.Item key="all">
                <Nav.Link
                    eventKey="all"
                    name="all"
                    onClick={ this.onChangeNetworkFilter }
                >
                    All
                </Nav.Link>
              </Nav.Item>)

            this.props.all_item_names["Network"].map( (name) => {
                network_tabs.push(
                  <Nav.Item key={name}>
                    <Nav.Link
                        eventKey={name}
                        name={name}
                        onClick={ this.onChangeNetworkFilter }
                    >
                        {name}
                    </Nav.Link>
                  </Nav.Item>)
            })

            network_filter.push(<Nav key={this.props.all_item_names["Network"][0]} fill defaultActiveKey={this.state.network_filter} variant="tabs"> {network_tabs} </Nav>)
        }

        return ( network_filter)
    }

    getTableHead() {
        let table_head = []

        const columns = this.props.column_names

        columns.map((column, index) => {
            table_head.push(<th key={index}>{column}</th>)
        })

        return (
                <thead>
                    <tr>
                        {table_head}
                    </tr>
                </thead>
                )
    }

    onChangeNetworkFilter = (e) => {
        this.setState({network_filter: e.target.name})

        GetIPsByNetwork(e.target.name).then( (res) => {
            this.setState({filtered_data: res});
            GetFreeIPsByNetwork(this.state.network_filter).then( (res) => {
                this.setState({free_ips_by_network: res['free_ips']})
            } )
        })
    }

    RemoveRow(e) {
        if (window.confirm('Are you sure you wish to delete this item?')) {
            switch (this.props.active_tab) {
                case 'net':
                    DeleteNetwork(e.target.id, this.props.auth_token).then( res => {
                            this.props.refreshData(this.props.active_tab)
                        }
                    );
                    break;

                case 'ip':
                    DeleteIP(e.target.id, this.props.auth_token).then( res => {
                            this.props.refreshData(this.props.active_tab)
                        }
                    );
                    GetIPsByNetwork(this.state.network_filter).then( (res) => {
                        this.setState({filtered_data: res})
                    })
                    break;

                case 'vlan':
                    DeleteVlan(e.target.id, this.props.auth_token).then( res => {
                            this.props.refreshData(this.props.active_tab)
                        }
                    );
                    break;

                case 'device':
                    DeleteDevice(e.target.id, this.props.auth_token).then( res => {
                            this.props.refreshData(this.props.active_tab)
                        }
                    );
                    break;

                case 'device_interface':
                    DeleteDeviceInterface(e.target.id, this.props.auth_token).then( res => {
                            this.props.refreshData(this.props.active_tab)
                        }
                    );
                    break;
            }
        }
    }

    onShowNestedClick(e) {
        if(this.state.show_nested_key === Number(e.target.id))
            this.setState({show_nested_key: undefined})
        else
            this.setState({show_nested_key: Number(e.target.id)})
    }

    onEditRowClick(e) {
        this.setState({update_item: Number(e.target.id),
                       update_item_panel_active_tab: this.props.active_tab})
    }

    UpdateItemPanelClick() {
        this.setState({update_item: undefined},
                       this.props.refreshData(this.props.active_tab))
        GetIPsByNetwork(this.state.network_filter).then( (res) => {
            this.setState({filtered_data: res})
        })
    }

    AddItemPanelClick() {
        this.props.refreshData(this.props.active_tab)
        GetIPsByNetwork(this.state.network_filter).then( (res) => {
            this.setState({filtered_data: res})
        })
    }

    getTableBody() {
        let table_body = [];
        
        if (this.props.table_data !== undefined) {
            let rows = this.props.table_data

            if((this.state.network_filter !== 'all') && (this.props.active_tab === 'ip'))
                rows = this.state.filtered_data


            
            for (let i=0; i<rows.length; i++) {

                let table_row = []

                const columns = Object.values(rows[i])

                if((this.state.update_item === i) && 
                    (this.state.update_item_panel_active_tab === this.props.active_tab))
                {
                    table_row.push(<UpdateItemPanel 
                        key={i}
                        onClick={this.UpdateItemPanelClick.bind(this)}
                        column_names={this.props.column_names}
                        column_values={rows[i]}
                        active_tab={this.props.active_tab}
                        auth_token={this.props.auth_token}
                        auth_user={this.props.auth_user}
                        all_item_names={this.props.all_item_names}
                    />);

                    table_body.push(<tr key={i} >{table_row}</tr>);
                }
                else
                {
                    let remove_and_edit_buttons = []

                    if( (('Owner' in rows[i]) &&
                        (this.props.auth_user === rows[i].Owner.username) || 
                        (this.props.auth_user === rows[i].Owner)) || 
                        !('Owner' in rows[i])){
                        
                        if( (rows[i].Description !== "Gateway") &&
                            (rows[i].Description !== 'Broadcast') &&
                            (rows[i].Description !== 'Network') )
                        {
                            remove_and_edit_buttons.push(
                                <td key={this.props.auth_user}>
                                    <Button  id={i} variant="light" 
                                        onClick={this.onEditRowClick.bind(this)}>
                                        Edit
                                    </Button>

                                    <Button key={i} variant="light"
                                        id={columns[0]}
                                        onClick={this.RemoveRow.bind(this)}>
                                        Remove
                                    </Button>
                                </td> )
                        }
                    }

                    for(let j=0; j<columns.length; j++) {

                        const column = this.formatRow(this.props.column_names[j], columns[j], i)

                        table_row.push(<td key={j}>{column}</td>)
                    }

                    table_body.push(
                        <tr key={i}>{table_row}
                            <td>
                                <Button id={i} variant="light" 
                                    onClick={this.onShowNestedClick.bind(this)}>
                                    Show Nested
                                </Button>
                            </td>
                            {remove_and_edit_buttons}
                        </tr>)
                }
            }
        }

        return (
                <tbody>
                    {table_body}
                </tbody>
                )
    }

    render() {

        return(
            <>  
                {this.getNetworkFilter()}      
                <Table responsive>
                  {this.getTableHead()}
                  {this.getTableBody()}
                </Table>
                <AddItemPanel
                    onClick={this.AddItemPanelClick.bind(this)}
                    column_names={this.props.column_names}
                    active_tab={this.props.active_tab}
                    free_ips_by_network={this.state.free_ips_by_network}
                    network_filter={this.state.network_filter}
                    auth_token={this.props.auth_token}
                    auth_user={this.props.auth_user}
                    all_item_names={this.props.all_item_names}
                />
            </>
            )
    }
}

const mapStateToProps = state => {
    return { auth_token: state.auth.token, 
             auth_user: state.user.login};
};

export default connect(
    mapStateToProps,
)(TableBody);
