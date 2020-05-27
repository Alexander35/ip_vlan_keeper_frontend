import config from '../../config'

export default async (name, token) => {

    const auth = 'Token '.concat(token);

    const result = await config.delete(
        '/vlan/',
        { headers: { 'Content-Type': 'application/json',
                     'Authorization': auth },
         data: {"Name": name}}
    ).then( res => {
        return res.data;
        }
    ).catch(error => {
        return error
    });

    return result;
};