$(document).ready(function(){
    select_currencies();
});

$("#main_content").on("keyup","#selected_currency_price", function() {
    calc_cur_select();
});
$("#main_content").on("keyup","#calc_currency_price", function() {
    calc_cur_calc();
});
$("#main_content").on("change", "#selected_currency_type", function( event ) {
    event.preventDefault();
    calc_cur_select();
});
$("#main_content").on("change", "#calc_currency_type", function( event ) {
    event.preventDefault();
    calc_cur_calc();
});

function calc_cur_select(){
    $.ajax( {
        type: 'POST',
        url: '../admin/queries/calc_currency.php',
        data: {
          flag:1,
          selected_currency_price:$("#selected_currency_price").val(),
          selected_currency_type:$("#selected_currency_type").val(),
          calc_currency_price:$("#calc_currency_price").val(),
          calc_currency_type:$("#calc_currency_type").val()
        },
        dataType: 'text'
    })
    .done(function (data, textStatus, jqXHR) { 
        $('#calc_currency_price').val('');
        $('#calc_currency_price').val(data);
    })
    .fail(function (jqXHR,textStatus) {
        alert("При обращении к серверу возникли проблемы: " + textStatus);
    })
}
function calc_cur_calc(){
    $.ajax( {
        type: 'POST',
        url: '../admin/queries/calc_currency.php',
        data: {
            flag:0,
            selected_currency_price:$("#selected_currency_price").val(),
            selected_currency_type:$("#selected_currency_type").val(),
            calc_currency_price:$("#calc_currency_price").val(),
            calc_currency_type:$("#calc_currency_type").val()
        },
        dataType: 'text'
        })
        .done(function (data, textStatus, jqXHR) { 
            $('#selected_currency_price').val('');
            $('#selected_currency_price').val(data);
        })
        .fail(function (jqXHR,textStatus) {
            alert("При обращении к серверу возникли проблемы: " + textStatus);
    })
}




function select_currencies(){
    $.ajax( {
        type: 'POST',
        dataType: 'json',
        url: '../admin/queries/select_currencies.php'
    })
    .done(function (data, textStatus, jqXHR) { 
        $('#main_content').append(form_calc(parse_json_select(data)));
    })
    .fail(function (jqXHR,textStatus) {
        alert("При обращении к серверу возникли проблемы: " + textStatus);
    })
}
function form_calc(select){
    return `
        <div class="table-data">
			<div class="order">
                <div class="conteiner-form">
                    <div class="findent">
                    <form id="employee_edit" class="currencies" action="#">
                        <div class="form first">
                            <div class="details ID">
                                <span class="title">1-й тип валюты</span>

                                <div class="fields">
                                    <div class="input-field_2">
                                        <label>Размер денежной суммы</label>
                                        <input id="selected_currency_price" type="number" placeholder="">
                                    </div>
                                    <div class="input-field_2">
                                        <label>Тип валюты</label>
                                        <select id="selected_currency_type">
                                            <option disabled selected>Выберите тип валюты</option>`
                                            +select+
                                        `</select>
                                    </div>
                                </div></br>
                            </div>
                            <div class="details ID">
                                <span class="title">2-й тип валюты</span>

                                <div class="fields">
                                    <div class="input-field_2">
                                        <label>Размер денежной суммы</label>
                                        <input id="calc_currency_price" type="number" placeholder="">
                                    </div>
                                    <div class="input-field_2">
                                        <label>Тип валюты</label>
                                        <select id="calc_currency_type">
                                            <option disabled selected>Выберите тип валюты</option>`
                                            +select+
                                        `</select>
                                    </div>
                                </div>
                            </div>
                            <div id="message" style="text-align:center;"></div>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
        </div>
    `;
}
function parse_json_select (data) {
    var option = '';

    $(data).each(function(index, element) { 
        option += '<option value="'+ element[0] + '">' + element[1] + '</option>';
    });
    
    return option;
}