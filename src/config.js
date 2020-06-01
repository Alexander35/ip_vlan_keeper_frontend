import axios from 'axios';

const IP_VLAN_KEEPER_HOST_ADDRESS = process.env.IP_VLAN_KEEPER_HOST_ADDRESS || '10.0.2.1';

const host = IP_VLAN_KEEPER_HOST_ADDRESS + ':8808'

export default axios.create({
  baseURL: 'http://' + host,
});
