var jsonObj = null

function emptyFields() {
    $("#txtJSON").val("")
    $("#txtCSV").val("")
}

function validate(txtJSON) {
    try {
        jsonObj = JSON.parse(txtJSON)
        return true
    } catch(e) {
        console.log(e.message)
        return false
    }
}

function convert() {
    var txtJSON = $("#txtJSON").val()

    var txtCSV = ""

    var columns = ""
    var lines = []

    $("#txtCSV").val("")

    if(validate(txtJSON)) {
        //console.log(jsonObj)

        txtJSON = txtJSON.replaceAll("\n","")

        var arrayMatches = txtJSON.match(/\[.*?\]/gm);

        arrayMatches.forEach(array => {
            var objMatches = array.match(/\{.*?\}/gm)

            //console.log(objMatches)

            var column = []

            objMatches.forEach(obj => {
                //console.log(obj)

                obj = obj.replace("{","").replace("}","").replaceAll(" ","")
                
                var arrKeyValue = obj.split(",")
                
                var line = []

                arrKeyValue.forEach(pairKeyValue => {
                    var key = pairKeyValue.split(":")[0].replaceAll('"',"")
                    var value = pairKeyValue.split(":")[1].replaceAll('"',"")
                    
                    //console.log("KEY:", key)
                    //console.log("VALUE:", value)

                    if(!column.includes(key))
                        column.push(key)

                    line.push(value)
                });

                lines.push(line)
            });

            columns = column.join(";")
            txtCSV = columns

            lines.forEach(line => {
                txtCSV += "\n" + line.join(";")
            });
        });
        
        console.log(txtCSV)
        $("#txtCSV").val(txtCSV)
    } else {
        alert("O text JSON não é válido!")
    }
}