var time = 0,
    validIterations = 0,
    totalIterations = 0;
var showInfo = false;

function start() {
    if (window.Worker) {
        var worker = new Worker("getData.js");
        alert("Github Does not process php pages so please clone git project and uncomment the code in main.js and you are good to go");
        //var ip = document.getElementById("ipToCheck").value;
        //document.getElementById("links").innerHTML = "";
        //        if (ip == "") {
        //            showInfo = true;
        //            if (confirm("This May Take A Lot Of Time")) {
        //                let html = "<input type='text' id='searcher' placeholder='search links'><br><br>";
        //                document.getElementById("filters").innerHTML = html;
        //                filterElements("links", "searcher");
        //                worker.postMessage({
        //                    type: "all"
        //                });
        //                setInterval(function () {
        //                    let html = "Time Elapsed :: ";
        //                    let days = Math.floor(time / 86400);
        //                    let hours = (Math.floor(time / 3600) % 24);
        //                    let mins = (Math.floor(time / 60) % 60);
        //                    if (days >= 1) {
        //                        let x = days + "Day/s "
        //                        html += x;
        //                    }
        //                    if (hours >= 1) {
        //                        let x = hours + "hours "
        //                        html += x;
        //                    }
        //                    if (mins >= 1) {
        //                        let x = mins + "minutes ";
        //                        html += x;
        //                    }
        //                    let x = (time % 60) + "seconds ";
        //                    html += x;
        //                    document.getElementById("timeElapsed").innerHTML = html;
        //                    time++;
        //                }, 1000)
        //            }
        //        } else {
        //            document.getElementById("filters").innerHTML = "";
        //            worker.postMessage({
        //                type: "singular",
        //                ip: ip
        //            });
        //                    }
        //        worker.onmessage = function (data) {
        //            switch (data.data.isMessageType) {
        //                case 1:
        //                    document.getElementById("percentDoneShow").innerHTML = "Completed :: " + parseInt(data.data.percent) + "%";
        //                    document.getElementById("percentDone").style.width = parseInt(data.data.percent) + "%";
        //                    break;
        //                case 2:
        //                    document.getElementById("testingIp").innerHTML = "Checking Ip :: " + data.data.ip;
        //                    changeIpStatus(validIterations, totalIterations + 1)
        //                    break;
        //                case 3:
        //                    let ret = data.data.html;
        //                    var html = '';
        //                    if (ret.valid) {
        //                        html = '<a class="col s12 m12 l12" href="http://' + ret.ip + '" target="_blank">' + ret.name + "::(" + ret.ip + ')</a><br>';
        //                        changeIpStatus(validIterations + 1, totalIterations)
        //                    } else {
        //                        html = '<a href="#">Not A Linkable Ip<span class="badge white-text black">Unknown</span></a><br>';
        //                    }
        //                    document.getElementById("links").insertAdjacentHTML("beforeend", html);
        //                    break;
        //            }
        //        }
    }
}

function setClasses(x) {
    if (x == "server") {
        return "red";
    } else {
        return "blue";
    }
}

function changeIpStatus(validIterations_copy, totalIterations_copy) {
    if (showInfo) {
        document.getElementById("ipInfo").innerHTML = "Ips Found :: " + validIterations_copy + "/" + totalIterations_copy + " (out of 4294967296 ips)";
        validIterations = validIterations_copy;
        totalIterations = totalIterations_copy;
    }
}

async function getType(ips) {
    try {
        const file = await fetch("http://" + ips, {
            method: "get",
            mode: "no-cors"
        })
        const fun = await file
            .then(function (req) {
                return "Domain"
            }, function (er) {
                return "Server"
            })
        return fun
    } catch (e) {
        return "Server"
    }
}
