self.onmessage = function (data) {
    if (data.data.type == "all") {
        for (var k = 0; k < 256; k++) {
            showPercent(((k / 256) * 100));
            for (var l = 0; l < 256; l++) {
                for (var j = 0; j < 256; j++) {
                    for (var i = 0; i < 256; i++) {
                        var ip = i + "." + j + "." + k + "." + l;
                        var qs = "network.php?ip=" + ip;
                        showIp(ip);
                        makeOutput(qs)
                    }
                }
            }
        }
        showPercent("All Done");
    } else if (data.data.type == "singular") {
        var ip = data.data.ip;
        var qs = "network.php?ip=" + ip;
        showIp(ip);
        makeOutput(qs, true)
    }
    showPercent(100);
}

function showPercent(per) {
    self.postMessage({
        percent: per,
        isMessageType: 1
    });
}

function showIp(ip) {
    self.postMessage({
        ip: ip,
        isMessageType: 2
    })
}

function showOutput(html) {
    self.postMessage({
        html: html,
        isMessageType: 3
    })
    console.log(html)
}

function makeOutput(qs, l = false) {
    var x = new XMLHttpRequest();
    x.onreadystatechange = async function () {
        if (this.status == 200 && this.readyState == 4) {
            let resp = this.responseText.split("##");
            let ip = resp[0];
            let name = resp[1];
            if (ip != name && name != "") {
                //                let type = await getType(ip);
                self.postMessage({
                    html: {
                        ip: ip,
                        name: name,
                        valid: true
                    },
                    isMessageType: 3
                });
                //                showOutput(h);
                return true;
            } else {
                if (l == true) {
                    console.log("Invalid");
                    self.postMessage({
                        html: {
                            valid: false
                        },
                        isMessageType: 3
                    })

                }
                return false;
            }
        }
    }
    x.open("GET", qs, false);
    x.send();
}
