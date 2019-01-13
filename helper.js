window.addEventListener("load", function () {
    include();
});

//creates the query for you
//param1 is the file name
//param2 is the array of header of id values you want to have
//param3 is the array of id of which you want the value of
//param4[optional{default = []}] is the array of headers for names
//param5[optional{default = []}] is the array of names of which you want the values of
//return type string
//input eg::makeQueryString("file.php",["a1","a2"],["id1","id2"],["xy"],["name1"]);
//output eg::"file.php?submit=true&a1=1&a2=2&xy[]=45&xy[]=42&xy[]=40"
function makeQueryString(file, namesOfHeaders, arrayOfId, namesOfHeaders2 = [], arrayOfNames = []) {
    //getting values
    var idVals = getValuesById(arrayOfId);
    var nameVals = getValuesByName(arrayOfNames);
    //starting query string
    var qs = file + "?submit=true";
    //making id string
    for (var i = 0; i < namesOfHeaders.length; i++) {
        qs += "&" + namesOfHeaders[i] + "=" + idVals[i];
    }
    //making name string
    for (var j = 0; j < namesOfHeaders2; j++) {
        for (var k = 0; k < nameVals[j].length; k++) {
            qs += "&" + namesOfHeaders[j] + "[]=" + nameVals[j][k];
        }
    }
    //returning query string
    return qs;
}

//inserts the data to ids provided
//param1 defines the query string
//param2 defines the array of ids in which you want to insert the data
//param3[optional{default = "##"}] defines the string to be used to seperate the data
//return type void
//input eg::getDataToIds("file.php?submit=true&a1=1&a2=2&xy[]=45&xy[]=42&xy[]=40",["a1","a2"]);
function getDataToIds(qs, arrayOfIds, splitBy = "##") {
    var xml = new XMLHttpRequest();
    xml.open("POST", qs, true);
    xml.send();
    xml.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var resp = this.responseText.split(splitBy);
            for (var i = 0; i < arrayOfIds.length; i++) {
                var elem = document.getElementById(arrayOfIds[i]);
                if (hasValue(elem)) {
                    elem.value = resp[i];
                } else {
                    elem.innerHTML = resp[i];
                }
            }
        }
    }
}

//inserts the data to ids inner html by replacing the string in the innerHTML object
//param1 defines the query string from where data is to be fetched
//param2 defines the id of the parent holding html in which you want to insert the data
//param3[optional{default = "##"}] defines the string to be replaced to insert the data
//return type void
//input eg::replaceDataFromId("file.php?submit=true&a1=1&a2=2&xy[]=45&xy[]=42&xy[]=40","a1");
function replaceDataFromId(qs, id, replaceString = "##") {
    var xml = new XMLHttpRequest();
    xml.open("POST", qs, true);
    xml.send();
    xml.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var resp = this.responseText.split(replaceString);
            var elem = document.getElementById(id);
            var splitElems = elem.innerHTML.split(replaceString);
            var html = splitElems;
            for (var i = 0; i < resp.length; i++) {
                html.concat(resp[i].concat(splitElems[i + 1]));
            }
            elem.innerHTML = html;
        }
    }
}

//used to include different files into the html
//just create a <include>tag in your html and have a
//"file" and "to" attributes which define the "file" to get data from and "to" which id to fill it in
//not needed to be called
//return type void
function include() {
    var xarMain = [];
    var tags = document.getElementsByTagName("include");
    for (var i = 0; i < tags.length; i++) {
        var elem = tags[i];
        fetch(elem.getAttribute("file") + "?&idForReq=" + elem.getAttribute("to"))
            .then(function (e) {
                let recieved = e.text()
                    .then(function (recieved) {
                        return recieved
                    })
                    .then(function (ex) {
                        let id = e.url.split("?&").pop().split("=").pop()
                        document.getElementById(id).innerHTML = ex
                    })
            })
    }
}

//used to handle and validate values as per types provided
//available types are {email,phone,name,radio,checkbox,not null,number}
//param1 is the type of the validation
//param2 is the value to be validated 
//with the exception of radio and checkbox where the param2 is the name of the checkbox or radio button to be checked
//return type boolean
//input eg::validate("phone", "7012896734");
//output eg::true;
//input eg::validate("phone", "70128967");
//output eg::false;
function validate(type, value) {
    switch (type) {
        case "phone":
            return value.length == 10 && value.match("/^[7-9][0-9]{9}$/");
            break;
        case "number":
            try {
                var x = parseFloat(value);
                return true;
            } catch (e) {
                return false;
            }
            break;
        case "email":
            return value.match("/^\w{2,}@\w{2,}\.\w{2,4}$/");
            break;
        case "name":
            value.forEach(function (elem) {
                if (!((elem.charCode >= 65 && elem.charCode <= 90) || (elem.charCode >= 97 && elem.charCode <= 122) || elem.charCode <= 32)) {
                    return false;
                }
            });
            return true;
            break;
        case "not null":
            return value.length > 0 && value != "";
            break;
            //        case "url":
            //            return value.match("_^(?:(?:https?|ftp)://)(?:\S+(?::\S*)?@)?(?:(?!10(?:\.\d{1,3}){3})(?!127(?:\.\d{1,3}){3})(?!169\.254(?:\.\d{1,3}){2})(?!192\.168(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\x{00a1}-\x{ffff}0-9]+-?)*[a-z\x{00a1}-\x{ffff}0-9]+)(?:\.(?:[a-z\x{00a1}-\x{ffff}0-9]+-?)*[a-z\x{00a1}-\x{ffff}0-9]+)*(?:\.(?:[a-z\x{00a1}-\x{ffff}]{2,})))(?::\d{2,5})?(?:/[^\s]*)?$_iuS");
            //            break;
        case "radio" || "checkbox":
            getValuesByName([value])[0].forEach(function (e) {
                if (validate("not null", e)) {
                    return true;
                }
            });
            return false;
            break;
        default:
            throw "Not Handling ".concat(type).concat(" validations please contact the developers");
            //            console.log();
    }
    return false;
}

//used to retrive data from multiple ids so that you dont have to
//param1 is the array of ids whose you want the data of
//return type array
//input eg::getValuesById(['a1',"a2"]);
//output eg::["a1ans","a2ans"];
function getValuesById(arrayOfIds) {
    var returnArray = [];
    arrayOfIds.forEach(function (id) {
        var elem = document.getElementById(id);
        if (hasValue(elem)) {
            returnArray.push(elem.value);
        } else {
            returnArray.push(elem.innerHTML);
        }
    });
    return returnArray;
}

//used to retrive data from multiple names so that you dont have to
//param1 is the array of names whose you want the data of
//return type 2d array [[],[],[]]
//input eg::getValuesByName(['name1',"name2"]);
//output eg::[["name1ans1","name1ans2"],["name2ans1","name2ans2","name2ans3"]];
function getValuesByName(arrayOfNames) {
    var returnArray = [];
    arrayOfNames.forEach(function (name) {
        var elems = document.getElementsByName(name);
        var miniArray = [];
        elems.forEach(function (elem) {
            if (hasValue(elem)) {
                miniArray.push(elem.value);
            } else {
                miniArray.push(elem.innerHTML);
            }
        });
        returnArray.push(miniArray);
    });
    return returnArray;
}

//this is a privated function
function hasValue(elem) {
    return elem.tagName == "INPUT" || elem.tagName == "SELECT";
}

//used to filter tables using visible data
//param1 is the table body id you want to filter from
//param2 is the input field you want to use the input from
//return type void
//input eg::filterTable("testTableFunc","searchForTable");
function filterTable(tableId, searchBy) {

    var inputField = document.getElementById(searchBy);
    inputField.addEventListener("keyup", function () {
        var text = inputField.value;
        var table = document.getElementById(tableId);
        var tbody = table.getElementsByTagName("tr");
        for (var rows = 0; rows < tbody.length; rows++) {
            if (tbody[rows].innerHTML.search(text) != -1) {
                tbody[rows].style.display = "block";
            } else {
                tbody[rows].style.display = "none";
            }
        }
    });
}

//used to filter elements using visible data
//param1 is the parent id of the elements you want to filter
//param2 is the input field you want to use the input from
//return type void
//input eg::filterElements("filterElementsId","searchForElement");
function filterElements(parentId, searchBy) {
    var inputField = document.getElementById(searchBy);
    inputField.onkeyup = function () {
        var text = inputField.value;
        var elem = document.getElementById(parentId);
        var children = elem.children;
        for (var index = 0; index < children.length; index++) {
            if (children[index].innerHTML.search(text) != -1) {
                children[index].style.display = "block";
            } else {
                children[index].style.display = "none";
            }
        }
    }
}

//used to validate multiple elements whose ids are passed
//param1 is the array of ids to check
//return type boolean
//input eg::checkRequiredIds(['a1',"a2"]);
//output eg::true;
function checkRequiredIds(arrayOfIds) {
    arrayOfIds.forEach(function (id) {
        var elem = document.getElementById(id);
        if (hasValue(elem)) {
            if (!validate("not null", elem.value)) {
                return false;
            }
        } else {
            if (!validate("not null", elem.innerHTML)) {
                return false;
            }
        }
    });
    return true;
}

//used to validate multiple elements whose names are passed
//param1 is the array of names to check
//return type boolean
//input eg::checkRequiredNames(['name1',"name2"]);
//output eg::true;
function checkRequiredNames(arrayOfNames) {
    arrayOfNames.forEach(function (name) {
        var elem = document.getElementsByName(name);
        for (var i = 0; i < elem.length; i++) {
            if (hasValue(elem[i])) {
                if (!validate("not null", elem[i].value)) {
                    return false;
                }
            } else {
                if (!validate("not null", elem[i].innerHTML)) {
                    return false;
                }
            }
        }
    });
    return true;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////ONGOING AND EXPERIMENTAL TRY AT YOUR OWN RISK////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//function createDynamicElement(parentId, replaceString = "##", pos = "beforeend") {
//    var html = "";
//    var parentElem = document.getElementById(parentId);
//    var html = getHtml(parentElem);
//    parentElem.parentElement.insertAdjacentHTML(pos, html.replace(replaceString, (parentElem.parentElement.childElementCount / parentElem.childElementCount)));
//}
//
//function getHtml(elem) {
//    var children = elem.children;
//    if (children.length == 0) {
//        return children.toString();
//    } else {
//        return getHtml(children);
//    }
//}
