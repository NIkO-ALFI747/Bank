$(document).ready(function(){
    m11_full();
});

function get_customer_id (){
    $.ajax( {
        type: 'POST',
        dataType: 'text',
        url: 'vendor/customer_id.php'
    })
    .done(function (data, textStatus, jqXHR) { 
        cards(data);
    })
    .fail(function (jqXHR,textStatus) {
        alert("При обращении к серверу возникли проблемы: " + textStatus);
    })
}

function cards(id){
    income_this_month(id);
    income_last_month(id);
    procent(id);

    total_balance_on_all_debit_cards(id);
    expenses_on_all_debit_cards(id);
    total_turnover_on_all_debit_cards(id);
}

function income_this_month(id){
    $.ajax( {
        type: 'POST',
        dataType: 'text',
        url: 'vendor/income_this_month.php',
        data: {
            ID_customer:id
        }
    })
    .done(function (data, textStatus, jqXHR) { 
        $('#income_this_month').empty();
        $('#income_this_month').append(data);
    })
    .fail(function (jqXHR,textStatus) {
        alert("При обращении к серверу возникли проблемы: " + textStatus);
    })
}
function income_last_month(id){
    $.ajax( {
        type: 'POST',
        dataType: 'text',
        url: 'vendor/income_last_month.php',
        data: {
            ID_customer:id
        }
    })
    .done(function (data, textStatus, jqXHR) { 
        $('#income_last_month').empty();
        $('#income_last_month').append(data);
    })
    .fail(function (jqXHR,textStatus) {
        alert("При обращении к серверу возникли проблемы: " + textStatus);
    })
}
function procent(id){
    
    $.ajax( {
        type: 'POST',
        dataType: 'text',
        url: 'vendor/procent.php',
        data: {
            ID_customer:id
        }
    })
    .done(function (data, textStatus, jqXHR) { 
        $('#procent').empty();
        if (data<100){
            $('#procent').append('<div style="color:red; font: bold;">-'+(100-data)+'%</div>');
        } else{
            $('#procent').append('<div style="color:red; font: bold;">+'+(data-100)+'%</div>');
        }
        
    })
    .fail(function (jqXHR,textStatus) {
        alert("При обращении к серверу возникли проблемы: " + textStatus);
    })
}
function total_balance_on_all_debit_cards(id){
    
    $.ajax( {
        type: 'POST',
        dataType: 'text',
        url: 'vendor/total_balance_on_all_debit_cards.php',
        data: {
            ID_customer:id
        }
    })
    .done(function (data, textStatus, jqXHR) { 
        $('#total_balance_on_all_debit_cards').empty();
        $('#total_balance_on_all_debit_cards').append(data);
    })
    .fail(function (jqXHR,textStatus) {
        alert("При обращении к серверу возникли проблемы: " + textStatus);
    })
}
function expenses_on_all_debit_cards(id){
    
    $.ajax( {
        type: 'POST',
        dataType: 'text',
        url: 'vendor/expenses_on_all_debit_cards.php',
        data: {
            ID_customer:id
        }
    })
    .done(function (data, textStatus, jqXHR) { 
        $('#expenses_on_all_debit_cards').empty();
        $('#expenses_on_all_debit_cards').append(data);
    })
    .fail(function (jqXHR,textStatus) {
        alert("При обращении к серверу возникли проблемы: " + textStatus);
    })
}
function total_turnover_on_all_debit_cards(id){
    
    $.ajax( {
        type: 'POST',
        dataType: 'text',
        url: 'vendor/total_turnover_on_all_debit_cards.php',
        data: {
            ID_customer:id
        }
    })
    .done(function (data, textStatus, jqXHR) { 
        $('#total_turnover_on_all_debit_cards').empty();
        $('#total_turnover_on_all_debit_cards').append(data);
    })
    .fail(function (jqXHR,textStatus) {
        alert("При обращении к серверу возникли проблемы: " + textStatus);
    })
}

function get_customer_id_2 (){
    $.ajax( {
        type: 'POST',
        dataType: 'text',
        url: 'vendor/customer_id.php'
    })
    .done(function (data, textStatus, jqXHR) { 
        pop_course(data);
    })
    .fail(function (jqXHR,textStatus) {
        alert("При обращении к серверу возникли проблемы: " + textStatus);
    })
}



function text_cards(){
    return `
    <div class="head">
        <h5>Статистика</h5>
    </div>
    <div class="info-data">
        <div class="card">
            <div class="head">
                <div>
                    <div id="income_this_month"></div>
                    <p>Зачисления в текущем месяце</p>
                    <span id="procent"></span>
                    по сравнению с
                    <span id="income_last_month" style="font: bold;"></span>
                    в прошлом месяце
                </div>
            </div>
        </div>
        <div class="card">
            <div class="head">
                <div>
                    <div id="total_balance_on_all_debit_cards"></div>
                    <p>Суммарный баланс на всех дебетовых картах</p>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="head">
                <div>
                    <div id="expenses_on_all_debit_cards"></div>
                    <p>Затраты на всех дебетовых картах</p>
                </div>
            </div>
        </div>
        <div class="card">
            <div class="head">
                <div>
                    <div id="total_turnover_on_all_debit_cards"></div>
                    <p>Суммарный денежный оборот на всех картах</p>
                </div>
            </div>
        </div>
    </div>`;
}


function m11_full(){
    $('#main_content').empty();
    get_customer_id_2 ();
}

function pop_course(id){
    $.ajax( {
        type: 'POST',
        dataType: 'json',
        url: 'vendor/transactions.php',
        data: {
            ID_customer:id
        }
    })
    .done(function (data, textStatus, jqXHR) { 
        if (data!=0){
            $('#main_content').append(text_cards() + `
            <div class="table-data">
                <div class="order">
                    <div class="head">
                        <h5>Транзакции</h5>
                    </div>
                    <div id="all_customer_accounts">` + parse_json_dc(data) + `</div>
                </div>
            </div>`);
            get_customer_id();
            customer_data(id);
        } else {
            get_customer_id();
            customer_data(id);
        }
    })
    .fail(function (jqXHR,textStatus) {
        alert("При обращении к серверу возникли проблемы: " + textStatus);
    })
}


function customer_data(id){
    $.ajax( {
        type: 'POST',
        dataType: 'json',
        url: 'vendor/customer_data.php',
        data: {
            ID_customer:id
        }
    })
    .done(function (data, textStatus, jqXHR) { 
        $('#main_content').append(`
            <div class="table-data">
                <div class="order">
                    <div class="head">
                        <h5>Личные данные</h5>
                    </div>
                    <div id="all_customer_accounts">` + parse_json(data) + `</div>
                </div>
        </div>`);
        customer_data_contact(id);
    })
    .fail(function (jqXHR,textStatus) {
        alert("При обращении к серверу возникли проблемы: " + textStatus);
    })
}
function customer_data_contact(id){
    $.ajax( {
        type: 'POST',
        dataType: 'json',
        url: 'vendor/customer_data_contact.php',
        data: {
            ID_customer:id
        }
    })
    .done(function (data, textStatus, jqXHR) { 
        $('#main_content').append(`
            <div class="table-data">
                <div class="order">
                    <div class="head">
                        <h5>Данные адреса</h5>
                    </div>
                    <div id="all_customer_accounts">` + parse_json(data) + `</div>
                </div>
        </div>`);
        customer_data_credentials(id);
    })
    .fail(function (jqXHR,textStatus) {
        alert("При обращении к серверу возникли проблемы: " + textStatus);
    })
}
function customer_data_credentials(id){
    $.ajax( {
        type: 'POST',
        dataType: 'json',
        url: 'vendor/customer_data_credentials.php',
        data: {
            ID_customer:id
        }
    })
    .done(function (data, textStatus, jqXHR) { 
        $('#main_content').append(`
            <div class="table-data">
                <div class="order">
                    <div class="head">
                        <h5>Учетные данные</h5>
                    </div>
                    <div id="all_customer_accounts">` + parse_json(data) + `</div>
                </div>
        </div>`);
        customer_debit_card_info(id);
    })
    .fail(function (jqXHR,textStatus) {
        alert("При обращении к серверу возникли проблемы: " + textStatus);
    })
}
function customer_accounts_info(id){
    $.ajax( {
        type: 'POST',
        dataType: 'json',
        url: 'vendor/customer_accounts_info.php',
        data: {
            ID_customer:id
        }
    })
    .done(function (data, textStatus, jqXHR) { 
        if(data!=0){
            $('#main_content').append(`
            <div class="table-data">
                <div class="order">
                    <div class="head">
                        <h5>Данные о счетах дебетовых карт</h5>
                    </div>
                    <div id="all_customer_accounts">` + parse_json_dc(data) + `</div>
                </div>
        </div>`);
        customer_credit_cards_info(id);
        }else{
            customer_credit_cards_info(id);
        }
        
    })
    .fail(function (jqXHR,textStatus) {
        alert("При обращении к серверу возникли проблемы: " + textStatus);
    })
}
function customer_credit_cards_info(id){
    $.ajax( {
        type: 'POST',
        dataType: 'json',
        url: 'vendor/customer_credit_accounts_info.php',
        data: {
            ID_customer:id
        }
    })
    .done(function (data, textStatus, jqXHR) { 
        if(data!=0){
            $('#main_content').append(`
            <div class="table-data">
                <div class="order">
                    <div class="head">
                        <h5>Данные о счетах кредитных карт</h5>
                    </div>
                    <div id="all_customer_accounts">` + parse_json_dc(data) + `</div>
                </div>
        </div>`);
        }
    })
    .fail(function (jqXHR,textStatus) {
        alert("При обращении к серверу возникли проблемы: " + textStatus);
    })
}

function customer_debit_card_info(id){
    $.ajax( {
        type: 'POST',
        dataType: 'json',
        url: 'vendor/customer_debit_card_info.php',
        data: {
            ID_customer:id
        }
    })
    .done(function (data, textStatus, jqXHR) { 
        if (data!=0){
        $('#main_content').append(`
            <div class="table-data">
                <div class="order">
                    <div class="head">
                        <h5>Оформленные дебетовые карты</h5>
                    </div>
                    <div id="all_customer_accounts">` + parse_json_dc(data) + `</div>
                </div>
        </div>`);
        customer_credit_card_info(id);
        }else{customer_credit_card_info(id);}
    })
    .fail(function (jqXHR,textStatus) {
        alert("При обращении к серверу возникли проблемы: " + textStatus);
    })
}

function customer_credit_card_info(id){
    $.ajax( {
        type: 'POST',
        dataType: 'json',
        url: 'vendor/customer_credit_card_info.php',
        data: {
            ID_customer:id
        }
    })
    .done(function (data, textStatus, jqXHR) { 
        if (data!=0){
        $('#main_content').append(`
            <div class="table-data">
                <div class="order">
                    <div class="head">
                        <h5>Оформленные кредитные карты</h5>
                    </div>
                    <div id="all_customer_accounts">` + parse_json_dc(data) + `</div>
                </div>
        </div>`);
        customer_accounts_info(id);
        }else{customer_accounts_info(id);}
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
        url: '../admin/queries/dynamiccourse.php'
    })
    .done(function (data, textStatus, jqXHR) { 
        $('#main_content').append(`
            <div class="table-data">
                <div class="order">
                    <div class="head">
                        <h5>Динамика курса доллара США, за 1 USD</h5>
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
                    <h5>Конвертер валют по курсу International банка</h5>
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
        url: '../admin/queries/select_currencies.php'
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
                    <h5>Форма для конвертирования средств на дебетовых картах</h5>
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
function parse_json (data) {
    var table = '<table>';
    var thead = '<thead><tr>';
    var i = 0;
    var j = 0;
  
    $(data[0]).each(function(ind_cell, val_cell) { 
        if(i>0){
            thead += "<th>" + val_cell + "</th>";
        }
      
      i++;
    });
  
    thead += '</tr></thead>';
    table += thead;
    var row = '<tbody>';
    var col = '';
    i = 0;
  
    $(data).each(function(index, element) { 
      if (i > 0){
        row += '<tr>';
        col = '';
  j=0;
        $(element).each(function(ind_cell, val_cell) {
            if(j>0){
                col += "<td><p>" + val_cell + "</p></td>";
            }
          j++;
        })
  
        row += col;
        row += '</tr>';
      }
      i++;
    });
    
    row += '</tbody>';
    table += row;
    table += '</table>';
    return table;
}
function parse_json_dc (data) {
    var table = '<table>';
    var thead = '<thead><tr>';
    var i = 0;
  
    $(data[0]).each(function(ind_cell, val_cell) { 
      thead += "<th>" + val_cell + "</th>";
      i++;
    });
  
    thead += '</tr></thead>';
    table += thead;
    var row = '<tbody>';
    var col = '';
    i = 0;
  
    $(data).each(function(index, element) { 
      if (i > 0){
        row += '<tr>';
        col = '';
  
        $(element).each(function(ind_cell, val_cell) {
          col += "<td><p>" + val_cell + "</p></td>";
        })
  
        row += col;
        row += '</tr>';
      }
      i++;
    });
    
    row += '</tbody>';
    table += row;
    table += '</table>';
    return table;
}