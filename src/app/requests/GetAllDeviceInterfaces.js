import config from '../../config'

export default async () => {
    const result = await config.get(
        '/device_interface/',
        { headers: { 'Content-Type': 'application/json' } }
    ).then( res => {
        return res.data;
        }
    ).catch(error => {
        return error
    });

    return result;
};