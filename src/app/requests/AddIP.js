import config from '../../config'

export default async (name, network, device_interface, description, token) => {
    const auth = 'Token '.concat(token);

    const result = await config.post(
        '/ip/',
        {"Name": name,
                "Net": network,
                "Device_interface": device_interface,
                "Description": description},
        { headers: { 'Content-Type': 'application/json',
                     'Authorization': auth }}
    ).then( res => {
        return res.data;
        }
    ).catch(error => {
        return error
    });

    return result;
};