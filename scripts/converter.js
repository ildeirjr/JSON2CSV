function emptyTable() {
    $("#csv-table-header").empty()
    $("#csv-table-body").empty()
}

function displayTable(toggle) {
    if (toggle == true)
        $("#csv-table").css("display","block")
    else
        $("#csv-table").css("display","none")
}

function emptyFields() {
    $("#txtJSON").val("")
    $("#txtCSV").val("")
    displayTable(false)
    emptyTable()
}

function validate(txtJSON) {
    try {
        JSON.parse(txtJSON)
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
        emptyTable()

        txtJSON = txtJSON.replaceAll("\n","")
        var objMatches = txtJSON.match(/\{.*?\}/gm)

        var column = []

        // Varrer objetos JSON para obter todas as colunas distintas
        objMatches.forEach(obj => {
            obj = obj.replace("{","").replace("}","").replaceAll(" ","")
            var arrKeyValue = obj.split(",")

            arrKeyValue.forEach(pairKeyValue => {
                var key = pairKeyValue.split(":")[0].replaceAll('"',"")
                if(!column.includes(key)) {
                    column.push(key)
                    $("#csv-table-header").append('<th scope="col">' + key + '</th>')
                }
            });
        });

        var line = []

        // Varrer objetos JSON novamente para associar os valores às respectivas colunas
        objMatches.forEach((obj,idx) => {
            line = Array.from(' '.repeat(column.length))
            $("#csv-table-body").append(`<tr id="line-${idx}">` + '<td></td>'.repeat(column.length) + '</tr>')

            obj = obj.replace("{","").replace("}","").replaceAll(" ","")
            var arrKeyValue = obj.split(",")

            arrKeyValue.forEach(pairKeyValue => {
                var key = pairKeyValue.split(":")[0].replaceAll('"',"")
                var value = pairKeyValue.split(":")[1].replaceAll('"',"")
                
                var columnIdx = column.findIndex((element) => element == key)
                line[columnIdx] = value

                $(`#line-${idx} td`).eq(columnIdx).html(value)
            });

            lines.push(line)
        });

        columns = column.join(",")
        txtCSV = columns
        lines.forEach(line => {
            txtCSV += "\n" + line.join(",")
        });
        
        $("#txtCSV").val(txtCSV)
        displayTable(true)
    } else {
        alert("O text JSON não é válido!")
    }
}