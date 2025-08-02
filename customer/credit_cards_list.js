$(document).ready(function(){
    m12_full();
});

$("#main_content").on("keyup","#cashback_percentage_from", function() {
    get_credit_cards();
});
$("#main_content").on("keyup","#cashback_percentage_to", function() {
    get_credit_cards();
});
$("#main_content").on("keyup","#maintenance_cost_from", function() {
    get_credit_cards();
});
$("#main_content").on("keyup","#maintenance_cost_to", function() {
    get_credit_cards();
});
$("#main_content").on("change", "#category_var", function( event ) {
    event.preventDefault();
    get_credit_cards();
});
$("#main_content").on("change", "#sort_column", function( event ) {
    event.preventDefault();
    get_credit_cards();
});
$("#main_content").on("change", "#sort_type", function( event ) {
    event.preventDefault();
    get_credit_cards();
});


function m12_full(){
    $('#main_content').empty();
    filtr_form();
}

function filtr_form(){
    $.ajax( {
        type: 'POST',
        dataType: 'json',
        url: 'vendor/credit_card_category.php'
    })
    .done(function (data, textStatus, jqXHR) { 
        $('#main_content').append(form_filtr(parse_json_select_2(data)));
        form_sort_column();
        $('#main_content').append(`
            <div class="table-data">
                <div class="order">
                    <div class="head">
                        <h5>Кредитные карты</h5>
                    </div><br/>
                    <div id="all_debit_cards"></div>
                </div>
        </div>`);
        get_credit_cards();
    })
    .fail(function (jqXHR,textStatus) {
        alert("При обращении к серверу возникли проблемы: " + textStatus);
    })
}




function get_credit_cards(){
    $.ajax( {
        type: 'POST',
        dataType: 'json',
        url: 'vendor/get_credit_cards.php',
        data: {
            cashback_percentage_from:$("#cashback_percentage_from").val(),
            cashback_percentage_to:$("#cashback_percentage_to").val(),
            maintenance_cost_from:$("#maintenance_cost_from").val(),
            maintenance_cost_to:$("#maintenance_cost_to").val(),
            category_var:$("#category_var").val(),
            sort_column:$("#sort_column").val(),
            sort_type:$("#sort_type").val()
        }
    })
    .done(function (data, textStatus, jqXHR) { 
        $('#all_debit_cards').empty();
        $('#all_debit_cards').append(parse_json(data));
        
    })
    .fail(function (jqXHR,textStatus) {
        alert("При обращении к серверу возникли проблемы: " + textStatus);
    })
}






function form_sort_column(){
    $.ajax( {
        type: 'POST',
        dataType: 'json',
        url: 'vendor/sort_column.php'
    })
    .done(function (data, textStatus, jqXHR) { 
        $('#sort_column').append(parse_json_select_3(data));
    })
    .fail(function (jqXHR,textStatus) {
        alert("При обращении к серверу возникли проблемы: " + textStatus);
    })
}




function form_filtr(select){
    return `
        <div class="table-data">
			<div class="order">
                <div class="head">
                    <h5>Форма фильтрации</h5>
                </div>
                <div class="conteiner-form">
                    <div class="findent">
                    <form id="employee_edit" class="form_filtr" action="#">
                        <div class="form first">
                            <div class="details ID">
                                <span class="title">Фильтр</span>

                                <div class="fields">
                                    <div class="input-field">
                                        <label>Процентная ставка кредита</label>
                                        <input id="cashback_percentage_from" type="number" placeholder="От">
                                    </div>
                                    <div class="input-field">
                                        <label>Процентная ставка кредита</label>
                                        <input id="cashback_percentage_to" type="number" placeholder="До">
                                    </div>
                                    <div class="input-field"></div>
                                </div><hr class="hr">
                                <div class="fields">
                                    <div class="input-field">
                                        <label>Стоимость обслуживания</label>
                                        <input id="maintenance_cost_from" type="number" placeholder="От">
                                    </div>
                                    <div class="input-field">
                                        <label>Стоимость обслуживания</label>
                                        <input id="maintenance_cost_to" type="number" placeholder="До">
                                    </div>
                                    <div class="input-field">
                                        <label>Тип категории</label>
                                        <select id="category_var">
                                            <option disabled selected>Выберите тип категории</option>
                                            <option value="ALL">Любой</option>`
                                            +select+
                                        `</select>
                                    </div>
                                </div><br/>
                            </div>
                            <div class="details ID">
                                <span class="title">Сортировка</span>

                                <div class="fields">
                                    <div class="input-field">
                                        <label>Сортируемый столбец</label>
                                        <select id="sort_column">
                                            <option disabled selected>Выберите название столбца</option>
                                        </select>
                                    </div>
                                    <div class="input-field">
                                        <label>Тип сортировки</label>
                                        <select id="sort_type">
                                            <option disabled selected>Выберите тип сортировки</option>
                                            <option value="DESC">По убыванию</option>
                                            <option value="ASC">По возрастанию</option>
                                        </select>
                                    </div>
                                    <div class="input-field"></div>
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

function get_customer_id (id){
    $.ajax( {
        type: 'POST',
        dataType: 'text',
        url: 'vendor/customer_id.php'
    })
    .done(function (data, textStatus, jqXHR) { 
        form_open_card(id, data);
    })
    .fail(function (jqXHR,textStatus) {
        alert("При обращении к серверу возникли проблемы: " + textStatus);
    })
}

function parse_json (data) {
    var table = '<table>';
    var thead = '<thead><tr>';
    var i = 0;
  var j=0;
    $(data[0]).each(function(ind_cell, val_cell) { 
        if (i>0){
      thead += "<th>" + val_cell + "</th>";}
      i++;
    });
  
    thead += '<th>Оформление</th></tr></thead>';
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
          col += "<td><p>" + val_cell + "</p></td>";}
          j++;
        })

        col += `
        <td style="margin-right: 15px;">
            <a href='javascript:void(0)' onclick='regData_cs(` + data[index][0] + `)'>Оформить</a>
        </td>
        `;

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

var regData_cs = function(id){
    get_customer_id(id);
};

function form_open_card(ID_card, data){
    $('#main_content').empty();
    $('#main_content').append(`
        <div class="table-data">
			<div class="order">
                <div class="head">
                    <h5>Оформление кредитной карты клиента</h5>
                </div>
                <div class="conteiner-form">
                    <div class="find_card">
                    <form id="customer_card" class="form_card2" action="#">
                        <div class="form first">
                            <input id="ID_credit_card" type="hidden" value="`+ID_card+`">
                            <input id="ID_customer" type="hidden" value="`+data+`">
                            <div class="details personal">
                                <span class="title">Данные карты</span>
                                <div class="fields">
                                    <div class="input-field">
                                        <label>Номер карты</label>
                                        <input id="Number" type="text" placeholder="5000001234567905" required>
                                    </div>
                                    <div class="input-field">
                                        <label>CVV код</label>
                                        <input id="CVV" type="text" placeholder="017" required>
                                    </div>
                                    <div class="input-field">
                                        <label>PIN код</label>
                                        <input id="PIN" type="text" placeholder="0017" required>
                                    </div>
                                    <div class="input-field">
                                        <label>Цель оформления карты</label>
                                        <input id="Purpose_of_opening" type="textarea" placeholder="Использовать в повседневных покупках" required>
                                    </div>
                                </div></br>
                            </div>
                            <div class="details ID">
                                <span class="title">Данные счёта</span>

                                <div class="fields">
                                    <div class="input-field">
                                        <label>Номер счета в валюте RUB</label>
                                        <input id="Account_number_rub" type="text" placeholder="0004016" required>
                                    </div>
                                    <div class="input-field">
                                        <label>Кредитный лимит</label>
                                        <input id="Credit_limit_rub" type="text" placeholder="5000" required>
                                    </div>
                                    <div class="input-field">
                                        <label>Номер счета в валюте USD</label>
                                        <input id="Account_number_usd" type="text" placeholder="0004017" required>
                                    </div>
                                    <div class="input-field">
                                        <label>Кредитный лимит</label>
                                        <input id="Credit_limit_usd" type="text" placeholder="5000" required>
                                    </div>
                                    <div class="input-field">
                                        <label>Номер счета в валюте EUR</label>
                                        <input id="Account_number_eur" type="text" placeholder="0004018" required>
                                    </div>
                                    <div class="input-field">
                                        <label>Кредитный лимит</label>
                                        <input id="Credit_limit_eur" type="text" placeholder="5000" required>
                                    </div>
                                </div>
                                <button class="nextBtn">
                                    <span class="btnText">Зарегистрировать</span>
                                </button>
                            </div>
                            <div id="message" style="text-align:center;"></div>
                        </div>
                    </form>
                    </div>
                </div>
            </div>
        </div>
    `);
}

$("#main_content").on("submit", "#customer_card", function( event ) {
    event.preventDefault();
    $.ajax( {
        type: 'POST',
        dataType: 'text',
        url: 'vendor/credit_card_reg.php',
        data: {
        ID_customer: $("#ID_customer").val(),
        ID_credit_card: $("#ID_credit_card").val(),
        Number: $("#Number").val(),
        CVV: $("#CVV").val(),
        PIN: $("#PIN").val(),
        Purpose_of_opening: $("#Purpose_of_opening").val(),
        Account_number_rub: $("#Account_number_rub").val(),
        Credit_limit_rub: $("#Credit_limit_rub").val(),
        Account_number_usd: $("#Account_number_usd").val(),
        Credit_limit_usd: $("#Credit_limit_usd").val(),
        Account_number_eur: $("#Account_number_eur").val(),
        Credit_limit_eur: $("#Credit_limit_eur").val()
        }
    })
    .done(function (data, textStatus, jqXHR) { 
        $('#message').empty();
        $('#message').append('<div style="color:#ffe41c;">Кредитная карта успешно оформлена</div>');
    })
    .fail(function (jqXHR,textStatus) {
        alert("При обращении к серверу возникли проблемы: " + textStatus);
    })
});

function parse_json_select_2(data){
    var option = '';

    $(data).each(function(index, element) { 
        option += '<option value="'+ element[0] + '">' + element[0] + '</option>';
    });
    
    return option;
}
function parse_json_select_3(data){
    var option = '';
    var i = 0;
    $(data[0]).each(function(index, element) { 
        if(i>0){
            option += '<option value="'+ element + '">' + element + '</option>';
        }
        i++;
    });
    
    return option;
}