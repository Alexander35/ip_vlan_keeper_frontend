import config from '../../config'

export default async (name, device_interface, description, token) => {
    const auth = 'Token '.concat(token);

    const result = await config.patch(
        '/ip/',
        {"Name": name,
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