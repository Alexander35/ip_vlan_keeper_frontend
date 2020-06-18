import React from 'react';
import Nav from 'react-bootstrap/Nav';
import { connect } from "react-redux";
import GetAllNetworks from "../../app/requests/GetAllNetworks";
import GetAllIpPools from "../../app/requests/GetAllIpPools";
import GetAllIPs from "../../app/requests/GetAllIPs";
import GetAllVlans from "../../app/requests/GetAllVlans";
import GetAllDevices from "../../app/requests/GetAllDevices";
import GetAllDeviceInterfaces from "../../app/requests/GetAllDeviceInterfaces";
import GetAllNames from '../../app/requests/GetAllNames';
import TableBody from "./TableBody";

class Table extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          table_data: [],

          all_item_names: [],
          active_tab: "net"
        };
    }

    componentDidMount() {
        this.refreshData("net")
    }

    onAllIpPoolsClick = (e) => {
        this.setState({active_tab: "pool"}, this.refreshData("pool"));
    }

    onAllNetworksClick = (e) => {
        this.setState({active_tab: "net"}, this.refreshData("net"));
    }

    onAllIPsClick = (e) => {
        this.setState({active_tab: "ip"}, this.refreshData("ip"));
    }

    onAllVlansClick = (e) => {
        this.setState({active_tab: "vlan"}, this.refreshData("vlan"));
    }

    onAllDevicesClick = (e) => {
        this.setState({active_tab: "device"}, this.refreshData("device"));
    }

    onAllDeviceInterfacesClick = (e) => {
        this.setState({active_tab: "device_interface"}, this.refreshData("device_interface"));
    }

    refreshData(active_tab)
    {
        GetAllNames().then( res => {
                this.setState({all_item_names: res});
            });
        if(active_tab === "pool")
            GetAllIpPools().then( res => {
                this.setState({table_data: res});
            });
        if(active_tab === "net")
            GetAllNetworks().then( res => {
                this.setState({table_data: res});
            });
        if(active_tab === "ip")
            GetAllIPs().then( res => {
                this.setState({table_data: res});
            });
        if(active_tab === "vlan")
            GetAllVlans().then( res => {
                this.setState({table_data: res});
            });
        if(active_tab === "device")
            GetAllDevices().then( res => {
                this.setState({table_data: res});
            });
        if(active_tab === "device_interface")
            GetAllDeviceInterfaces().then( res => {
                this.setState({table_data: res});
            });
    }

    render() {

        const column_names = this.state.table_data[0] ? Object.keys(this.state.table_data[0]) : [] 

        return(
            <>        
                <Nav fill defaultActiveKey="link-1" variant="tabs">
                  <Nav.Item>
                    <Nav.Link eventKey="link-0"  onClick={ this.onAllIpPoolsClick }>Pools</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="link-1"  onClick={ this.onAllNetworksClick }>Networks</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="link-2" onClick={ this.onAllIPsClick }>IPs</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="link-3" onClick={ this.onAllVlansClick }>Vlans</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="link-4" onClick={ this.onAllDevicesClick }>Devices</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="link-5" onClick={ this.onAllDeviceInterfacesClick }>Device Interfaces</Nav.Link>
                  </Nav.Item>
                </Nav>
                <TableBody
                    refreshData={this.refreshData.bind(this)}
                    column_names={column_names}
                    table_data={this.state.table_data}
                    active_tab={this.state.active_tab}
                    all_item_names={this.state.all_item_names}
                />
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
)(Table);