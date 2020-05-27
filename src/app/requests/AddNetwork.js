import config from '../../config'

export default async (name, gateway,
                      vlan, device_interface,
                      description, owner,
                      token) => {
    const auth = 'Token '.concat(token);

    const result = await config.post(
        '/net/',
        {"Name": name,
            "Gateway": gateway,
            "Vlan": vlan,
            "Device_interface": device_interface,
            "Description": description,
            "Owner": owner},
        { headers: { 'Content-Type': 'application/json',
                     'Authorization': auth } }

    ).then( res => {
        return res.data;
        }
    ).catch(error => {
        return error
    });

    return result;
};