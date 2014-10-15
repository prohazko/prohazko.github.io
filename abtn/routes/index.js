module.exports = {

    index  : function (req, res) {
        res.sendFile(req.filepath('views/index.html'));
    },
    webshot : require('./webshot')
}