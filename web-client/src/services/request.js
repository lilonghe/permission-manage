import qs from 'qs';
import 'whatwg-fetch';
import { message } from 'antd';
let host = 'http://47.101.42.102/api/';
if (process.env.NODE_ENV=='development') {
    host = 'http://localhost:3000/';
}

const request = async (url, options={ query:{}, method:'GET' }) => {
    options.method = options.method.toUpperCase();
    const q = qs.stringify(options.query);

    if (q !== "") {
        url = `${url}?${q}`;
    }

    if (url.indexOf('http') != 0) {
        url = host + url;
    }

    return fetch(url, {
        ...options,
        "credentials": "include",
        "headers": {
            ...options.headers,
            "Content-Type": "application/json; charset=utf-8"
        }
    }).
        then((response) => response.json().then((data) => {
            if (data.errcode != 0) {
                global.actionTip.fail(`[${data.errcode}] ${data.errmsg}`)
                return { err: data.errmsg, data };
            }
            return { data: data.data };
        })).
        catch((err) => {
            global.actionTip.fail(err.message)
            return { err: err };
        });
};

export default request;