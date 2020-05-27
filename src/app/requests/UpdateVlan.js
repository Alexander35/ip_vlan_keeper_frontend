import config from '../../config'

export default async (name, description, owner, token) => {
    const auth = 'Token '.concat(token);

    const result = await config.patch(
        '/vlan/',
        {"Name": name,
        	"Description": description,
        	"Owner": owner},
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