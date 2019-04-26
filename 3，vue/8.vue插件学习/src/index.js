export default {
    render: function (h) {
        return (
            <div on-click="a">
                <p>123456</p>
                <input on-change="xx" type="text"/>
            </div>
        )
    },
    method: {
        a() {
            console.log(12121)
        },
        xx() {
            console.log(11212165 + "qqqq")
        }
    }
}

