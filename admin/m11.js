$("#m11").on("click", function( event ) {
    event.preventDefault();
    m11_full();
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

$("#main_content").on("keyup","#selected_currency_price_2", function() {
    $.ajax( {
        type: 'POST',
        url: 'queries/calc_exchange.php',
        data: {
          selected_currency_price:$("#selected_currency_price_2").val(),
          selected_currency_type:$("#selected_currency_type_2").val(),
          calc_currency_type:$("#calc_currency_type_2").val()
        },
        dataType: 'json'
    })
    .done(function (data, textStatus, jqXHR) { 
        $('#exchange_table').empty();
        $('#exchange_table').append(parse_json(data));
    })
    .fail(function (jqXHR,textStatus) {
        alert("При обращении к серверу возникли проблемы: " + textStatus);
    })
});


$("#main_content").on("submit", "#exchange", function( event ) {
    event.preventDefault();
    $.ajax( {
        type: 'POST',
        dataType: 'text',
        url: 'queries/currency_exchange_by_card.php',
        data: {
            selected_currency_price:$("#selected_currency_price_2").val(),
            selected_currency_type:$("#selected_currency_type_2").val(),
            calc_currency_type:$("#calc_currency_type_2").val(),
            Number:$("#Number").val(),
            Closing_date:$("#Closing_date").val(),
            Name:$("#Name").val(),
            CVV:$("#CVV").val()
        }
    })
    .done(function (data, textStatus, jqXHR) { 
        $('#message_2').empty();
        $('#message_2').append('<div style="color:#ffe41c;">'+data+'</div>');
    })
    .fail(function (jqXHR,textStatus) {
        alert("При обращении к серверу возникли проблемы: " + textStatus);
    })
});


function calc_cur_select(){
    $.ajax( {
        type: 'POST',
        url: 'queries/calc_currency.php',
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
        url: 'queries/calc_currency.php',
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




function m11_full(){
    $('#main_content').empty();
    pop_course();
}

function pop_course(){
    $.ajax( {
        type: 'POST',
        dataType: 'json',
        url: 'queries/m11_pop_course.php'
    })
    .done(function (data, textStatus, jqXHR) { 
        $('#main_content').append(`
            <h1 class="title">Курсы валют</h1>

            <div class="table-data">
                <div class="order">
                    <div class="head">
                        <h3>Курсы популярных валют</h3>
                    </div>
                    <div id="all_customer_accounts">` + parse_json(data) + `</div>
                </div>
        </div>`);
        select_currencies();
    })
    .fail(function (jqXHR,textStatus) {
        alert("При обращении к серверу возникли проблемы: " + textStatus);
    })
}

function select_currencies(){
    $.ajax( {
        type: 'POST',
        dataType: 'json',
        url: 'queries/select_currencies.php'
    })
    .done(function (data, textStatus, jqXHR) { 
        $('#main_content').append(form_calc(parse_json_select(data)));
        $('#main_content').append(form_exchange_card(parse_json_select(data)));
        dynamiccourse();
    })
    .fail(function (jqXHR,textStatus) {
        alert("При обращении к серверу возникли проблемы: " + textStatus);
    })
}


function dynamiccourse(){
    $.ajax( {
        type: 'POST',
        dataType: 'json',
        url: 'queries/dynamiccourse.php'
    })
    .done(function (data, textStatus, jqXHR) { 
        $('#main_content').append(`
            <div class="table-data">
                <div class="order">
                    <div class="head">
                        <h3>Динамика курса доллара США, за 1 USD</h3>
                    </div>
                    <div id="all_customer_accounts">` + parse_json(data) + `</div>
                </div>
        </div>`);
    })
    .fail(function (jqXHR,textStatus) {
        alert("При обращении к серверу возникли проблемы: " + textStatus);
    })
}



function form_calc(select){
    return `
        <div class="table-data">
			<div class="order">
                <div class="head">
                    <h3>Конвертер валют по курсу International банка</h3>
                </div>
                <div class="conteiner-form">
                    <div class="find_card_2">
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

function get_exchange_table(){
    $.ajax( {
        type: 'POST',
        dataType: 'json',
        url: 'queries/select_currencies.php'
    })
    .done(function (data, textStatus, jqXHR) { 
        $('#main_content').append(form_calc(parse_json_select(data)));
        $('#main_content').append(form_exchange_card(parse_json_select(data)));
    })
    .fail(function (jqXHR,textStatus) {
        alert("При обращении к серверу возникли проблемы: " + textStatus);
    })
}

function form_exchange_card(select){
    return `
        <div class="table-data">
			<div class="order">
                <div class="head">
                    <h3>Форма для конвертирования средств на дебетовых картах</h3>
                </div>
                <div class="conteiner-form">
                    <div class="find_card_2">
                    <form id="employee_edit" class="currencies" action="#">
                        <div class="form first">
                            <div class="details ID">
                                <span class="title">Обмен валют</span>

                                <div class="fields">
                                    <div class="input-field_2">
                                        <label>Размер денежной суммы</label>
                                        <input id="selected_currency_price_2" type="number" placeholder="">
                                    </div>
                                    <div class="input-field_2">
                                        <label>1-й тип валюты</label>
                                        <select id="selected_currency_type_2">
                                            <option disabled selected>Выберите тип валюты</option>`
                                            +select+
                                        `</select>
                                    </div>
                                    <div class="input-field_2">
                                        <label>2-й тип валюты</label>
                                        <select id="calc_currency_type_2">
                                            <option disabled selected>Выберите тип валюты</option>`
                                            +select+
                                        `</select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                    <form>
                        <div class="details ID">
                            <span class="title">Таблица покупки и продажи валюты</span>
                        </div>
                    </form>
                    <div id="exchange_table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Продажа 1 типа валюты за 2 тип</th>
                                    <th>Покупка 1 типа валюты за 2 тип</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><p>0</p></td>
                                    <td><p>0</p></td>
                                </tr>
                            </tbody>
                        </table>
                    </div><br/><br/><br/>
                    <form id="exchange" class="form_card" action="#">
                        <div class="form first">
                            <div class="details ID">
                                <span class="title">Реквизиты карты списания</span>

                                <div class="fields">
                                    <div class="input-field_2">
                                        <label>Номер карты</label>
                                        <input id="Number" type="text" placeholder="">
                                    </div>
                                    <div class="input-field_2">
                                        <label>Дата окончания срока действия карты</label>
                                        <input id="Closing_date" type="date" placeholder="">
                                    </div>
                                </div></br>
                            </div>
                            <div class="details ID">
                                <span class="title"></span>

                                <div class="fields">
                                    <div class="input-field_2">
                                        <label>CVV код карты</label>
                                        <input id="CVV" type="text" placeholder="">
                                    </div>
                                    <div class="input-field_2">
                                        <label>Имя владельца карты</label>
                                        <input id="Name" type="text" placeholder="">
                                    </div>
                                </div>
                                <button class="nextBtn">
                                    <span class="btnText">Обменять</span>
                                </button>
                            </div>
                            
                        </div>
                    </form>
                    <div id="message_2" style="text-align:center;"></div>
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
