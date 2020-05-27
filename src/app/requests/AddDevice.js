import config from '../../config'

export default async (name, description, token) => {
    const auth = 'Token '.concat(token);

    const result = await config.post(
        '/device/',
        {"Name": name, "Description": description},
            {headers: { 'Content-Type': 'application/json',
                        'Authorization': auth }}
    ).then( res => {
        return res.data;
        }
    ).catch(error => {
        return error
    });

    return result;
};