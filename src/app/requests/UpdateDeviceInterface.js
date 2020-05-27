import config from '../../config'

export default async (name, device, description, owner, token) => {
    const auth = 'Token '.concat(token);

    const result = await config.patch(
        '/device_interface/',
        {"Name": name, "Device": device, "Description": description, "Owner": owner},
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