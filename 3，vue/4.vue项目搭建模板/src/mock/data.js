export const login = req => {
    req = JSON.parse(req.body);
    return {
        code: 200,
        data: req,
        msg: ''
    }
};